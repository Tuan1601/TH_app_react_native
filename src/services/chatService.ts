/**
 * chatService: toàn bộ nghiệp vụ Chat 1-1 Realtime với Firebase Realtime Database.
 * Bao gồm: tạo/lấy cuộc trò chuyện, gửi tin nhắn văn bản & vị trí bằng multi-path update,
 * lắng nghe danh sách tin nhắn, lắng nghe cuộc trò chuyện, và quản lý số tin chưa đọc.
 */
import {
  get,
  increment,
  limitToLast,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  serverTimestamp,
  set,
  update,
  type Unsubscribe,
} from 'firebase/database';
import { APP_CONFIG } from '../constants/config';
import type {
  Conversation,
  LastMessage,
  UnreadCountMap,
} from '../types/conversation';
import type { LocationCoords, Message, MessageType } from '../types/message';
import { createConversationId as buildConversationId } from '../utils/chatUtils';
import { getErrorMessage, toAppError } from '../utils/errorUtils';
import { db, DB_PATHS } from './firebase';

/**
 * Tạo ID cuộc trò chuyện thống nhất từ hai UID (sắp xếp alphabet, nối bằng '_').
 */
export function createConversationId(uid1: string, uid2: string): string {
  return buildConversationId(uid1, uid2);
}

/** Chuyển dữ liệu thô từ Firebase thành đối tượng Conversation hợp lệ. */
function parseConversation(
  id: string,
  raw: Record<string, unknown> | null | undefined,
): Conversation | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const participantsRaw = raw.participants as
    | Record<string, boolean>
    | undefined;
  if (!participantsRaw || typeof participantsRaw !== 'object') {
    return null;
  }
  const lastMsgRaw = raw.lastMessage as
    | Record<string, unknown>
    | null
    | undefined;
  let lastMessage: LastMessage | null = null;
  if (
    lastMsgRaw &&
    typeof lastMsgRaw.text === 'string' &&
    typeof lastMsgRaw.senderId === 'string'
  ) {
    lastMessage = {
      text: lastMsgRaw.text,
      senderId: lastMsgRaw.senderId,
      type: lastMsgRaw.type === 'location' ? 'location' : 'text',
      createdAt:
        typeof lastMsgRaw.createdAt === 'number' ? lastMsgRaw.createdAt : 0,
    };
  }

  return {
    id,
    participants: participantsRaw,
    lastMessage,
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : 0,
  };
}

/** Chuyển dữ liệu thô từ Firebase thành đối tượng Message hợp lệ. */
function parseMessage(
  id: string,
  raw: Record<string, unknown> | null | undefined,
): Message | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  if (
    typeof raw.senderId !== 'string' ||
    typeof raw.receiverId !== 'string' ||
    typeof raw.text !== 'string'
  ) {
    return null;
  }
  const type: MessageType = raw.type === 'location' ? 'location' : 'text';
  const locRaw = raw.location as Record<string, unknown> | null | undefined;
  const location: LocationCoords | null =
    locRaw &&
    typeof locRaw.latitude === 'number' &&
    typeof locRaw.longitude === 'number'
      ? { latitude: locRaw.latitude, longitude: locRaw.longitude }
      : null;

  return {
    id,
    senderId: raw.senderId,
    receiverId: raw.receiverId,
    text: raw.text,
    type,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : 0,
    location,
  };
}

/**
 * Lấy hoặc khởi tạo cuộc trò chuyện giữa 2 người dùng.
 * Không ghi đè lastMessage nếu cuộc trò chuyện đã tồn tại.
 */
export async function getOrCreateConversation(
  uid1: string,
  uid2: string,
): Promise<Conversation> {
  const conversationId = createConversationId(uid1, uid2);
  const convRef = ref(db, DB_PATHS.conversation(conversationId));

  try {
    const snapshot = await get(convRef);
    const existing = parseConversation(
      conversationId,
      snapshot.val() as Record<string, unknown> | null,
    );
    if (existing) {
      return existing;
    }

    const participants: Record<string, boolean> = {
      [uid1]: true,
      [uid2]: true,
    };
    const multiUpdates: Record<string, unknown> = {
      [`${DB_PATHS.conversation(conversationId)}/id`]: conversationId,
      [`${DB_PATHS.conversation(conversationId)}/participants`]: participants,
      [`${DB_PATHS.conversation(conversationId)}/updatedAt`]: serverTimestamp(),
      [`${DB_PATHS.userConversations(uid1)}/${conversationId}`]: true,
      [`${DB_PATHS.userConversations(uid2)}/${conversationId}`]: true,
    };
    await update(ref(db), multiUpdates);

    return {
      id: conversationId,
      participants,
      lastMessage: null,
      updatedAt: Date.now(),
    };
  } catch (error) {
    throw toAppError(error, 'Không thể khởi tạo cuộc trò chuyện.');
  }
}

export interface SendTextMessageParams {
  senderId: string;
  receiverId: string;
  text: string;
}

/**
 * Gửi tin nhắn văn bản bằng update() đa đường dẫn:
 * - Tạo message ID duy nhất bằng push()
 * - Lưu message tại /messages/{cid}/{mid}
 * - Cập nhật /conversations/{cid} (id, participants, lastMessage, updatedAt)
 * - Đảm bảo chỉ mục /userConversations cho cả 2 phía
 * - Tăng unreadCount cho người nhận bằng increment(1) nguyên tử trên server
 * - Không tăng unreadCount của người gửi
 */
export async function sendTextMessage(
  params: SendTextMessageParams,
): Promise<string> {
  const trimmed = params.text.trim();
  if (!trimmed) {
    throw new Error('Nội dung tin nhắn không được để trống.');
  }
  if (trimmed.length > APP_CONFIG.MESSAGE_MAX_LENGTH) {
    throw new Error(
      `Tin nhắn tối đa ${APP_CONFIG.MESSAGE_MAX_LENGTH} ký tự.`,
    );
  }

  const { senderId, receiverId } = params;
  const conversationId = createConversationId(senderId, receiverId);
  const messagesRef = ref(db, DB_PATHS.messages(conversationId));
  const newMsgRef = push(messagesRef);
  const messageId = newMsgRef.key;

  if (!messageId) {
    throw new Error('Không thể tạo ID cho tin nhắn.');
  }

  const now = serverTimestamp();
  const convPath = DB_PATHS.conversation(conversationId);
  const msgPath = DB_PATHS.message(conversationId, messageId);

  const updates: Record<string, unknown> = {
    [msgPath]: {
      id: messageId,
      senderId,
      receiverId,
      text: trimmed,
      type: 'text',
      createdAt: now,
    },
    [`${convPath}/id`]: conversationId,
    [`${convPath}/participants/${senderId}`]: true,
    [`${convPath}/participants/${receiverId}`]: true,
    [`${convPath}/lastMessage`]: {
      text: trimmed,
      senderId,
      type: 'text',
      createdAt: now,
    },
    [`${convPath}/updatedAt`]: now,
    [`${DB_PATHS.userConversations(senderId)}/${conversationId}`]: true,
    [`${DB_PATHS.userConversations(receiverId)}/${conversationId}`]: true,
    [DB_PATHS.unreadCount(receiverId, conversationId)]: increment(1),
  };

  try {
    await update(ref(db), updates);
    return messageId;
  } catch (error) {
    throw toAppError(error, 'Không thể gửi tin nhắn.');
  }
}

export interface SendLocationMessageParams {
  senderId: string;
  receiverId: string;
  location: LocationCoords;
}

/**
 * Gửi tin nhắn vị trí hiện tại bằng update() đa đường dẫn.
 */
export async function sendLocationMessage(
  params: SendLocationMessageParams,
): Promise<string> {
  const { senderId, receiverId, location } = params;
  if (
    typeof location.latitude !== 'number' ||
    typeof location.longitude !== 'number'
  ) {
    throw new Error('Tọa độ vị trí không hợp lệ.');
  }

  const conversationId = createConversationId(senderId, receiverId);
  const messagesRef = ref(db, DB_PATHS.messages(conversationId));
  const newMsgRef = push(messagesRef);
  const messageId = newMsgRef.key;

  if (!messageId) {
    throw new Error('Không thể tạo ID cho tin nhắn vị trí.');
  }

  const now = serverTimestamp();
  const text = 'Đã gửi vị trí';
  const convPath = DB_PATHS.conversation(conversationId);
  const msgPath = DB_PATHS.message(conversationId, messageId);

  const updates: Record<string, unknown> = {
    [msgPath]: {
      id: messageId,
      senderId,
      receiverId,
      text,
      type: 'location',
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      createdAt: now,
    },
    [`${convPath}/id`]: conversationId,
    [`${convPath}/participants/${senderId}`]: true,
    [`${convPath}/participants/${receiverId}`]: true,
    [`${convPath}/lastMessage`]: {
      text,
      senderId,
      type: 'location',
      createdAt: now,
    },
    [`${convPath}/updatedAt`]: now,
    [`${DB_PATHS.userConversations(senderId)}/${conversationId}`]: true,
    [`${DB_PATHS.userConversations(receiverId)}/${conversationId}`]: true,
    [DB_PATHS.unreadCount(receiverId, conversationId)]: increment(1),
  };

  try {
    await update(ref(db), updates);
    return messageId;
  } catch (error) {
    throw toAppError(error, 'Không thể gửi vị trí.');
  }
}

/**
 * Lắng nghe realtime danh sách tin nhắn của một cuộc trò chuyện.
 * Sắp xếp tăng dần theo createdAt và loại bỏ trùng lặp theo id.
 * @returns hàm unsubscribe để gọi trong cleanup của useEffect.
 */
export function listenToMessages(
  conversationId: string,
  onData: (messages: Message[]) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  const messagesQuery = query(
    ref(db, DB_PATHS.messages(conversationId)),
    orderByChild('createdAt'),
    limitToLast(APP_CONFIG.MESSAGE_LOAD_LIMIT),
  );

  return onValue(
    messagesQuery,
    snapshot => {
      const seen = new Set<string>();
      const list: Message[] = [];
      snapshot.forEach(child => {
        const key = child.key;
        if (!key || seen.has(key)) {
          return;
        }
        const parsed = parseMessage(
          key,
          child.val() as Record<string, unknown> | null,
        );
        if (parsed) {
          seen.add(key);
          list.push(parsed);
        }
      });
      list.sort((a, b) => a.createdAt - b.createdAt);
      onData(list);
    },
    error => onError?.(getErrorMessage(error, 'Không thể tải tin nhắn.')),
  );
}

/**
 * Lắng nghe realtime danh sách các cuộc trò chuyện mà uid tham gia.
 * Kết hợp chỉ mục /userConversations/{uid} và listener trên từng /conversations/{cid},
 * tự động dọn dẹp mọi sub-listener khi danh sách thay đổi hoặc khi unsubscribe.
 * Chỉ trả về các cuộc trò chuyện đã có tin nhắn hoặc đã khởi tạo, sắp xếp giảm dần theo updatedAt.
 */
export function listenToConversations(
  uid: string,
  onData: (conversations: Conversation[]) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  const userConvRef = ref(db, DB_PATHS.userConversations(uid));
  const convMap = new Map<string, Conversation>();
  const convListeners = new Map<string, Unsubscribe>();
  let isDisposed = false;

  const emitSorted = () => {
    if (isDisposed) {
      return;
    }
    const sorted = Array.from(convMap.values())
      .filter(c => c.lastMessage !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    onData(sorted);
  };

  const unsubscribeIndex = onValue(
    userConvRef,
    snapshot => {
      if (isDisposed) {
        return;
      }
      const rawIndex = (snapshot.val() ?? {}) as Record<string, boolean>;
      const activeIds = new Set(
        Object.keys(rawIndex).filter(cid => rawIndex[cid] === true),
      );

      // Hủy listener của những conversation không còn trong index
      convListeners.forEach((unsub, cid) => {
        if (!activeIds.has(cid)) {
          unsub();
          convListeners.delete(cid);
          convMap.delete(cid);
        }
      });

      if (activeIds.size === 0) {
        emitSorted();
        return;
      }

      // Đăng ký listener cho các conversation mới
      activeIds.forEach(cid => {
        if (convListeners.has(cid)) {
          return;
        }
        const unsubConv = onValue(
          ref(db, DB_PATHS.conversation(cid)),
          convSnap => {
            if (isDisposed) {
              return;
            }
            const parsed = parseConversation(
              cid,
              convSnap.val() as Record<string, unknown> | null,
            );
            if (parsed) {
              convMap.set(cid, parsed);
            } else {
              convMap.delete(cid);
            }
            emitSorted();
          },
          err =>
            onError?.(
              getErrorMessage(err, 'Không thể đồng bộ cuộc trò chuyện.'),
            ),
        );
        convListeners.set(cid, unsubConv);
      });
    },
    error =>
      onError?.(getErrorMessage(error, 'Không thể tải danh sách trò chuyện.')),
  );

  return () => {
    isDisposed = true;
    unsubscribeIndex();
    convListeners.forEach(unsub => unsub());
    convListeners.clear();
    convMap.clear();
  };
}

/**
 * Lắng nghe realtime bản đồ số tin nhắn chưa đọc tại /unreadCounts/{uid}.
 */
export function listenToUnreadCounts(
  uid: string,
  onData: (counts: UnreadCountMap) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, DB_PATHS.unreadCounts(uid)),
    snapshot => {
      const raw = (snapshot.val() ?? {}) as Record<string, unknown>;
      const result: UnreadCountMap = {};
      Object.keys(raw).forEach(cid => {
        const val = raw[cid];
        if (typeof val === 'number' && val > 0) {
          result[cid] = val;
        } else {
          result[cid] = 0;
        }
      });
      onData(result);
    },
    error =>
      onError?.(getErrorMessage(error, 'Không thể tải số tin chưa đọc.')),
  );
}

/**
 * Tăng số tin nhắn chưa đọc của người nhận lên 1 đơn vị.
 * Sử dụng ServerValue.increment(1) nguyên tử trên server để tránh mất dữ liệu
 * khi nhiều tin nhắn đến đồng thời và tuân thủ Security Rules (người gửi không cần quyền đọc unread của người nhận).
 */
export async function incrementUnreadCount(
  receiverId: string,
  conversationId: string,
): Promise<void> {
  try {
    await set(
      ref(db, DB_PATHS.unreadCount(receiverId, conversationId)),
      increment(1),
    );
  } catch (error) {
    throw toAppError(error, 'Không thể cập nhật số tin chưa đọc.');
  }
}

/**
 * Đặt lại số tin nhắn chưa đọc của tài khoản hiện tại trong một cuộc trò chuyện về 0.
 */
export async function resetUnreadCount(
  uid: string,
  conversationId: string,
): Promise<void> {
  try {
    await set(ref(db, DB_PATHS.unreadCount(uid, conversationId)), 0);
  } catch (error) {
    throw toAppError(error, 'Không thể đặt lại số tin chưa đọc.');
  }
}


/**
 * Kiểu dữ liệu cuộc trò chuyện, lưu tại /conversations/{conversationId}.
 */
import type { MessageType } from './message';
import type { UserProfile } from './user';

/** Tóm tắt tin nhắn cuối, dùng để hiển thị ở HomeScreen. */
export interface LastMessage {
  text: string;
  senderId: string;
  type: MessageType;
  createdAt: number;
}

export interface Conversation {
  /** = createConversationId(uid1, uid2) */
  id: string;
  /** { uidA: true, uidB: true } */
  participants: Record<string, boolean>;
  lastMessage: LastMessage | null;
  updatedAt: number;
}

/** Map conversationId -> số tin chưa đọc (node /unreadCounts/{uid}). */
export type UnreadCountMap = Record<string, number>;

/** Dữ liệu đã ghép sẵn để render một dòng ở HomeScreen. */
export interface ConversationListItem {
  conversation: Conversation;
  partnerId: string;
  /** null khi hồ sơ người kia chưa tải xong hoặc đã bị xóa. */
  partner: UserProfile | null;
  unreadCount: number;
}


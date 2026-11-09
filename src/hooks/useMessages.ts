/**
 * useMessages: lắng nghe realtime tin nhắn của một cuộc trò chuyện,
 * trạng thái online/offline realtime của đối phương, và tự động reset unreadCount
 * về 0 khi người dùng đang mở màn hình chat này.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  listenToMessages,
  resetUnreadCount,
  sendLocationMessage,
  sendTextMessage,
} from '../services/chatService';
import { getCurrentLocation } from '../services/locationService';
import { listenToUserStatus } from '../services/presenceService';
import type { Message } from '../types/message';
import type { UserStatus } from '../types/user';

export interface UseMessagesParams {
  conversationId: string;
  currentUid: string | undefined;
  partnerId: string;
}

export interface UseMessagesResult {
  messages: Message[];
  partnerStatus: UserStatus | null;
  loading: boolean;
  sendingText: boolean;
  sendingLocation: boolean;
  error: string | null;
  handleSendText: (text: string) => Promise<void>;
  handleSendCurrentLocation: () => Promise<void>;
}

export function useMessages({
  conversationId,
  currentUid,
  partnerId,
}: UseMessagesParams): UseMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerStatus, setPartnerStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingText, setSendingText] = useState<boolean>(false);
  const [sendingLocation, setSendingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Khi mở ChatScreen: đặt unreadCount của cuộc trò chuyện này về 0
  // và lắng nghe danh sách tin nhắn realtime.
  useEffect(() => {
    if (!conversationId || !currentUid) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    resetUnreadCount(currentUid, conversationId).catch(() => undefined);

    const unsubscribeMessages = listenToMessages(
      conversationId,
      nextMessages => {
        if (!isMounted) {
          return;
        }
        setMessages(nextMessages);
        setLoading(false);
        setError(null);

        // Nếu có tin nhắn mới nhất do đối phương gửi trong lúc đang mở màn hình chat,
        // đảm bảo unreadCount của tài khoản hiện tại luôn được giữ ở 0.
        const latest = nextMessages[nextMessages.length - 1];
        if (latest && latest.receiverId === currentUid) {
          resetUnreadCount(currentUid, conversationId).catch(() => undefined);
        }
      },
      errMessage => {
        if (!isMounted) {
          return;
        }
        setError(errMessage);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      unsubscribeMessages();
    };
  }, [conversationId, currentUid]);

  // 2. Lắng nghe trạng thái online/offline realtime của người đang chat
  useEffect(() => {
    if (!partnerId) {
      setPartnerStatus(null);
      return;
    }
    let isMounted = true;
    const unsubscribeStatus = listenToUserStatus(partnerId, status => {
      if (isMounted) {
        setPartnerStatus(status);
      }
    });
    return () => {
      isMounted = false;
      unsubscribeStatus();
    };
  }, [partnerId]);

  const handleSendText = useCallback(
    async (text: string) => {
      if (!currentUid) {
        throw new Error('Bạn chưa đăng nhập.');
      }
      setSendingText(true);
      try {
        await sendTextMessage({
          senderId: currentUid,
          receiverId: partnerId,
          text,
        });
      } finally {
        setSendingText(false);
      }
    },
    [currentUid, partnerId],
  );

  const handleSendCurrentLocation = useCallback(async () => {
    if (!currentUid) {
      throw new Error('Bạn chưa đăng nhập.');
    }
    setSendingLocation(true);
    try {
      const coords = await getCurrentLocation();
      await sendLocationMessage({
        senderId: currentUid,
        receiverId: partnerId,
        location: coords,
      });
    } finally {
      setSendingLocation(false);
    }
  }, [currentUid, partnerId]);

  return {
    messages,
    partnerStatus,
    loading,
    sendingText,
    sendingLocation,
    error,
    handleSendText,
    handleSendCurrentLocation,
  };
}


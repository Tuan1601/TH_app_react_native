
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


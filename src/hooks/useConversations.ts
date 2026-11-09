/**
 * useConversations: lắng nghe realtime danh sách cuộc trò chuyện, số tin chưa đọc
 * và thông tin đối phương để hiển thị trên HomeScreen.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  listenToConversations,
  listenToUnreadCounts,
} from '../services/chatService';
import { listenToUsers } from '../services/userService';
import type {
  Conversation,
  ConversationListItem,
  UnreadCountMap,
} from '../types/conversation';
import type { UserProfile } from '../types/user';
import { extractPartnerId } from '../utils/chatUtils';

export interface UseConversationsResult {
  items: ConversationListItem[];
  totalUnread: number;
  loading: boolean;
  error: string | null;
}

export function useConversations(
  currentUid: string | undefined,
): UseConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadMap, setUnreadMap] = useState<UnreadCountMap>({});
  const [usersMap, setUsersMap] = useState<Record<string, UserProfile>>({});
  const [loadingConv, setLoadingConv] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUid) {
      setConversations([]);
      setUnreadMap({});
      setUsersMap({});
      setLoadingConv(false);
      return;
    }

    let isMounted = true;
    setLoadingConv(true);
    setError(null);

    const unsubConv = listenToConversations(
      currentUid,
      list => {
        if (!isMounted) {
          return;
        }
        setConversations(list);
        setLoadingConv(false);
      },
      errMsg => {
        if (!isMounted) {
          return;
        }
        setError(errMsg);
        setLoadingConv(false);
      },
    );

    const unsubUnread = listenToUnreadCounts(currentUid, counts => {
      if (isMounted) {
        setUnreadMap(counts);
      }
    });

    const unsubUsers = listenToUsers(currentUid, users => {
      if (!isMounted) {
        return;
      }
      const nextMap: Record<string, UserProfile> = {};
      users.forEach(u => {
        nextMap[u.uid] = u;
      });
      setUsersMap(nextMap);
    });

    return () => {
      isMounted = false;
      unsubConv();
      unsubUnread();
      unsubUsers();
    };
  }, [currentUid]);

  const items = useMemo<ConversationListItem[]>(() => {
    if (!currentUid) {
      return [];
    }
    return conversations.map(conversation => {
      const partnerId = extractPartnerId(
        conversation.id,
        currentUid,
        conversation.participants,
      );
      return {
        conversation,
        partnerId,
        partner: usersMap[partnerId] ?? null,
        unreadCount: unreadMap[conversation.id] ?? 0,
      };
    });
  }, [conversations, currentUid, unreadMap, usersMap]);

  const totalUnread = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unreadCount, 0);
  }, [items]);

  return {
    items,
    totalUnread,
    loading: loadingConv,
    error,
  };
}


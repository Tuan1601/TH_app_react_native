/**
 * useContacts: lắng nghe realtime danh bạ người dùng từ /users
 * và hỗ trợ tìm kiếm theo họ tên hoặc email.
 */
import { useEffect, useMemo, useState } from 'react';
import { listenToUsers } from '../services/userService';
import type { UserProfile } from '../types/user';

export interface UseContactsResult {
  contacts: UserProfile[];
  filteredContacts: UserProfile[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  loading: boolean;
  error: string | null;
}

export function useContacts(currentUid: string | undefined): UseContactsResult {
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUid) {
      setContacts([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const unsubscribe = listenToUsers(
      currentUid,
      users => {
        if (!isMounted) {
          return;
        }
        setContacts(users);
        setLoading(false);
        setError(null);
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
      unsubscribe();
    };
  }, [currentUid]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return contacts;
    }
    return contacts.filter(
      item =>
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q),
    );
  }, [contacts, searchQuery]);

  return {
    contacts,
    filteredContacts,
    searchQuery,
    setSearchQuery,
    loading,
    error,
  };
}


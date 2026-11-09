/**
 * NotificationsScreen: màn hình Thông báo tích hợp trong MainTabNavigator.
 * Đọc dữ liệu realtime từ /notifications/{uid}, hiển thị Empty State khi chưa có thông báo.
 */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/AppHeader';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import type { MainTabScreenProps } from '../../navigation/types';
import {
  listenToNotifications,
  markNotificationAsRead,
} from '../../services/notificationService';
import type { AppNotification } from '../../types/notification';
import { formatConversationTime } from '../../utils/dateUtils';

export const NotificationsScreen: React.FC<
  MainTabScreenProps<'Notifications'>
> = () => {
  const { userProfile } = useAuth();
  const currentUid = userProfile?.uid;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const unsubscribe = listenToNotifications(
      currentUid,
      list => {
        if (!isMounted) {
          return;
        }
        setNotifications(list);
        setLoading(false);
      },
      errMsg => {
        if (!isMounted) {
          return;
        }
        setError(errMsg);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentUid]);

  const handlePressItem = (item: AppNotification) => {
    if (!currentUid || item.read) {
      return;
    }
    markNotificationAsRead(currentUid, item.id).catch(() => undefined);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        title="Thông báo"
        subtitle="Cập nhật hệ thống và hoạt động tài khoản"
      />

      {loading ? (
        <Loading message="Đang tải thông báo..." />
      ) : error ? (
        <EmptyState
          iconName="alert-circle-outline"
          title="Không thể tải thông báo"
          description={error}
          isError
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          iconName="notifications-off-outline"
          title="Chưa có thông báo nào"
          description="Các thông báo mới về tài khoản và hệ thống sẽ xuất hiện tại đây."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.read && styles.cardUnread]}
              onPress={() => handlePressItem(item)}
              activeOpacity={0.8}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={
                    item.type === 'new_conversation'
                      ? 'chatbubbles-outline'
                      : 'notifications-outline'
                  }
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={styles.contentBox}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.time}>
                    {formatConversationTime(item.createdAt)}
                  </Text>
                </View>
                <Text style={styles.body}>{item.body}</Text>
              </View>
              {!item.read ? <View style={styles.unreadDot} /> : null}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUnread: {
    borderColor: colors.primaryLight,
    backgroundColor: '#FAFCFF',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
  },
  body: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});

export default NotificationsScreen;


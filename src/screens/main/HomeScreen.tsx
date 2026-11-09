/**
 * HomeScreen: màn hình danh sách các cuộc trò chuyện realtime.
 * - Sắp xếp theo updatedAt giảm dần (mới nhất trên cùng).
 * - Hiển thị tin nhắn cuối, thời gian và badge số tin chưa đọc.
 * - Khi nhấn vào cuộc trò chuyện: đặt unreadCount về 0 và mở ChatScreen.
 */
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import ConversationItem from '../../components/ConversationItem';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useConversations } from '../../hooks/useConversations';
import type { MainTabScreenProps } from '../../navigation/types';
import { resetUnreadCount } from '../../services/chatService';
import type { ConversationListItem } from '../../types/conversation';

export const HomeScreen: React.FC<MainTabScreenProps<'Home'>> = ({
  navigation,
}) => {
  const { userProfile, isConnected } = useAuth();
  const currentUid = userProfile?.uid;
  const { items, loading, error } = useConversations(currentUid);

  const handlePressConversation = (item: ConversationListItem) => {
    if (!currentUid) {
      return;
    }
    if (item.unreadCount > 0) {
      resetUnreadCount(currentUid, item.conversation.id).catch(() => undefined);
    }
    navigation.navigate('Chat', {
      conversationId: item.conversation.id,
      partnerId: item.partnerId,
      partnerName: item.partner?.fullName || 'Người dùng',
      partnerAvatar: item.partner?.avatar || '',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        title="Tin nhắn"
        subtitle={
          userProfile ? `Xin chào, ${userProfile.fullName}` : 'Trò chuyện 1-1'
        }
        rightElement={
          <View
            style={[
              styles.connPill,
              isConnected ? styles.connOnline : styles.connOffline,
            ]}>
            <View
              style={[
                styles.connDot,
                {
                  backgroundColor: isConnected
                    ? colors.online
                    : colors.warning,
                },
              ]}
            />
            <Text style={styles.connText}>
              {isConnected ? 'Trực tuyến' : 'Mất kết nối'}
            </Text>
          </View>
        }
      />

      {loading ? (
        <Loading message="Đang tải danh sách cuộc trò chuyện..." />
      ) : error ? (
        <EmptyState
          iconName="alert-circle-outline"
          title="Không thể tải cuộc trò chuyện"
          description={error}
          isError
        />
      ) : items.length === 0 ? (
        <EmptyState
          iconName="chatbubbles-outline"
          title="Chưa có cuộc trò chuyện nào"
          description="Hãy mở tab Danh bạ và chọn một người dùng để bắt đầu nhắn tin."
          actionLabel="Mở Danh bạ"
          onActionPress={() => navigation.navigate('Contacts')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.conversation.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ConversationItem
              item={item}
              currentUid={currentUid ?? ''}
              onPress={handlePressConversation}
            />
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
  connPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  connOnline: {
    backgroundColor: '#E9F9EF',
  },
  connOffline: {
    backgroundColor: colors.warningLight,
  },
  connDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  connText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});

export default HomeScreen;


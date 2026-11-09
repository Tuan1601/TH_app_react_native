
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import type { ConversationListItem } from '../types/conversation';
import { formatLastMessagePreview } from '../utils/chatUtils';
import { formatConversationTime } from '../utils/dateUtils';
import Avatar from './Avatar';

export interface ConversationItemProps {
  item: ConversationListItem;
  currentUid: string;
  onPress: (item: ConversationListItem) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  item,
  currentUid,
  onPress,
}) => {
  const { conversation, partner, unreadCount } = item;
  const fullName = partner?.fullName || 'Người dùng';
  const avatar = partner?.avatar || '';
  const isOnline = partner?.isOnline ?? false;
  const hasUnread = unreadCount > 0;

  const previewText = formatLastMessagePreview(
    conversation.lastMessage,
    currentUid,
  );
  const timeText = formatConversationTime(
    conversation.lastMessage?.createdAt || conversation.updatedAt,
  );

  return (
    <TouchableOpacity
      style={[styles.card, hasUnread && styles.cardUnread]}
      onPress={() => onPress(item)}
      activeOpacity={0.75}>
      <Avatar
        fullName={fullName}
        uri={avatar}
        size={52}
        showOnline
        isOnline={isOnline}
      />
      <View style={styles.contentBox}>
        <View style={styles.topRow}>
          <Text
            style={[styles.name, hasUnread && styles.nameUnread]}
            numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={[styles.time, hasUnread && styles.timeUnread]}>
            {timeText}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text
            style={[styles.preview, hasUnread && styles.previewUnread]}
            numberOfLines={1}>
            {previewText}
          </Text>
          {hasUnread ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUnread: {
    borderColor: colors.primaryLight,
    backgroundColor: '#FAFCFF',
  },
  contentBox: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  nameUnread: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
    marginRight: 8,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ConversationItem;



import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import type { UserProfile } from '../types/user';
import { formatLastSeen } from '../utils/dateUtils';
import Avatar from './Avatar';

export interface ContactItemProps {
  user: UserProfile;
  onPress: (user: UserProfile) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ user, onPress }) => {
  const statusText = user.isOnline
    ? 'Đang hoạt động'
    : formatLastSeen(user.lastSeen);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(user)}
      activeOpacity={0.75}>
      <Avatar
        fullName={user.fullName}
        uri={user.avatar}
        size={50}
        showOnline
        isOnline={user.isOnline}
      />
      <View style={styles.infoBox}>
        <Text style={styles.name} numberOfLines={1}>
          {user.fullName}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: user.isOnline
                  ? colors.online
                  : colors.textMuted,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              user.isOnline ? styles.statusOnline : styles.statusOffline,
            ]}
            numberOfLines={1}>
            {statusText}
          </Text>
        </View>
      </View>
      <View style={styles.chatIconBox}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={20}
          color={colors.primary}
        />
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
  infoBox: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusOnline: {
    color: colors.online,
  },
  statusOffline: {
    color: colors.textMuted,
  },
  chatIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default ContactItem;


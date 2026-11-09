/**
 * Avatar: hiển thị ảnh đại diện hoặc chữ cái đầu của họ tên,
 * kèm tùy chọn hiển thị chấm trạng thái Online ở góc dưới phải.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { getInitials } from '../utils/chatUtils';
import OnlineIndicator from './OnlineIndicator';

export interface AvatarProps {
  fullName: string;
  uri?: string;
  size?: number;
  showOnline?: boolean;
  isOnline?: boolean;
}

const AVATAR_PALETTE = [
  '#2878F0',
  '#0EA5E9',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
];

function pickColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 100000;
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  fullName,
  uri,
  size = 48,
  showOnline = false,
  isOnline = false,
}) => {
  const initials = getInitials(fullName);
  const bgColor = pickColor(fullName || 'U');
  const dotSize = Math.max(11, Math.round(size * 0.26));

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: bgColor,
            },
          ]}>
          <Text style={[styles.initials, { fontSize: Math.round(size * 0.38) }]}>
            {initials}
          </Text>
        </View>
      )}
      {showOnline && (
        <View style={styles.indicatorWrapper}>
          <OnlineIndicator isOnline={isOnline} size={dotSize} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '700',
  },
  indicatorWrapper: {
    position: 'absolute',
    right: -1,
    bottom: -1,
  },
});

export default Avatar;

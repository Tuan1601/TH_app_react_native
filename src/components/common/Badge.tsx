import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../../theme';

interface BadgeProps {
  label: string;
  type?: 'gioi' | 'kha' | 'trungBinh' | 'yeu' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({ label, type = 'info', size = 'md', style }) => {
  const getColors = () => {
    switch (type) {
      case 'gioi':
        return { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' };
      case 'kha':
        return { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' };
      case 'trungBinh':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' };
      case 'yeu':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' };
      default:
        return { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          size === 'sm' ? styles.labelSm : styles.labelMd,
          { color: colors.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const getBadgeType = (xepLoai: string): 'gioi' | 'kha' | 'trungBinh' | 'yeu' | 'info' => {
  switch (xepLoai) {
    case 'Giỏi':
      return 'gioi';
    case 'Khá':
      return 'kha';
    case 'Trung bình':
      return 'trungBinh';
    case 'Yếu':
      return 'yeu';
    default:
      return 'info';
  }
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: FONTS.sizes.xs,
  },
  labelMd: {
    fontSize: FONTS.sizes.sm,
  },
});

export { getBadgeType };
export default Badge;

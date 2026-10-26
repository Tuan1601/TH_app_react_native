import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius } from '../../theme/spacing';
import typography from '../../theme/typography';

export interface SyncBadgeProps {
  pending?: boolean;
}

export default function SyncBadge({ pending = false }: SyncBadgeProps) {
  if (!pending) {
    return null;
  }
  return <Text style={styles.badge}>Chưa đồng bộ</Text>;
}

const styles = StyleSheet.create({
  badge: {
    ...typography.small,
    color: colors.warning,
    backgroundColor: colors.warningLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    overflow: 'hidden',
  },
});

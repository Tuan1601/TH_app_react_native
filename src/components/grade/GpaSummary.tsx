import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius } from '../../theme/spacing';
import typography from '../../theme/typography';

export interface GpaSummaryProps {
  gpa: number;
  totalCredits: number;
}

export default function GpaSummary({ gpa, totalCredits }: GpaSummaryProps) {
  return (
    <View style={styles.card}>
      <View style={styles.statBox}>
        <Text style={styles.caption}>GPA hệ 4</Text>
        <Text style={styles.value}>{Number(gpa || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={styles.caption}>Tín chỉ tích lũy</Text>
        <Text style={styles.value}>{totalCredits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  value: {
    ...typography.stat,
    color: colors.primary,
    marginTop: spacing.xxs,
  },
});

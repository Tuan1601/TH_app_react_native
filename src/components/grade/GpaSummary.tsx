import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import spacing, { radius, shadows } from '../../theme/spacing';
import typography from '../../theme/typography';

export interface GpaSummaryProps {
  gpa: number;
  totalCredits: number;
}

export default function GpaSummary({ gpa, totalCredits }: GpaSummaryProps) {
  const gpaNum = Number(gpa || 0);

  const xepLoai =
    gpaNum >= 3.6
      ? { text: 'Xuất sắc', color: colors.success }
      : gpaNum >= 3.2
      ? { text: 'Giỏi', color: '#10B981' }
      : gpaNum >= 2.5
      ? { text: 'Khá', color: colors.primary }
      : gpaNum >= 2.0
      ? { text: 'Trung bình', color: colors.warning }
      : { text: 'Yếu', color: colors.danger };

  return (
    <View style={styles.card}>
      <View style={styles.statBox}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="star-outline" size={20} color={colors.primary} />
        </View>
        <Text style={styles.caption}>GPA hệ 4</Text>
        <Text style={styles.value}>{gpaNum.toFixed(2)}</Text>
        <View style={[styles.classificationBadge, { backgroundColor: xepLoai.color + '18' }]}>
          <Text style={[styles.classificationText, { color: xepLoai.color }]}>
            {xepLoai.text}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentLight }]}>
          <MaterialCommunityIcons name="certificate-outline" size={20} color={colors.accent} />
        </View>
        <Text style={styles.caption}>Tín chỉ tích lũy</Text>
        <Text style={[styles.value, { color: colors.accent }]}>{totalCredits}</Text>
        <View style={[styles.classificationBadge, { backgroundColor: colors.accentLight }]}>
          <Text style={[styles.classificationText, { color: colors.accent }]}>
            Hoàn thành
          </Text>
        </View>
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
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  value: {
    ...typography.stat,
    color: colors.primary,
    fontSize: 26,
    marginTop: 2,
  },
  classificationBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
  },
  classificationText: {
    ...typography.small,
    fontSize: 11,
    fontWeight: '700',
  },
});

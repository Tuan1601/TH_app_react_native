import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Grade } from '../../types/models';

export interface GradeRowProps {
  grade: Grade;
  onPress: () => void;
}

function GradeRow({ grade, onPress }: GradeRowProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Xem điểm ${grade.course?.name || ''}`}
      onPress={onPress}
      style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{grade.course?.name || 'Môn học'}</Text>
        <Text style={styles.detail}>
          {grade.course?.credits || 0} tín chỉ · Học kỳ: {grade.semester}
        </Text>
      </View>
      <View style={styles.scoreBadge}>
        <Text style={styles.totalScore}>{grade.total}</Text>
        <Text style={styles.letterScore}>{grade.letter}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(GradeRow);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: sizes.touch,
  },
  info: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
  },
  detail: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  scoreBadge: {
    alignItems: 'flex-end',
  },
  totalScore: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  letterScore: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
});

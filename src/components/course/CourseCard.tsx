import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Course } from '../../types/models';

export interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Mở môn ${course.name}`}
      onPress={onPress}
      style={styles.card}>
      <Text style={styles.code}>
        {course.code} · {course.credits} tín chỉ
      </Text>
      <Text style={styles.name}>{course.name}</Text>
      <Text style={styles.meta}>
        {course.lecturer} · {course.semester}
      </Text>
    </TouchableOpacity>
  );
}

export default React.memo(CourseCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: sizes.touch,
  },
  code: {
    ...typography.captionBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h3,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});

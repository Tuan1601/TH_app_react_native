import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Session } from '../../types/models';

export interface SessionCardProps {
  session: Session;
  onPress: () => void;
}

function SessionCard({ session, onPress }: SessionCardProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Chi tiết buổi học ${session.course?.name || ''}`}
      onPress={onPress}
      style={styles.card}>
      <Text style={styles.time}>
        {session.startTime} – {session.endTime}
      </Text>
      <Text style={styles.name}>{session.course?.name || 'Môn học'}</Text>
      <Text style={styles.meta}>
        Phòng {session.room} · {session.course?.lecturer || 'Giảng viên'}
      </Text>
      {session.note ? <Text style={styles.note}>Ghi chú: {session.note}</Text> : null}
    </TouchableOpacity>
  );
}

export default React.memo(SessionCard);

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
  time: {
    ...typography.captionBold,
    color: colors.primary,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  note: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Assignment } from '../../types/models';

export interface AssignmentItemProps {
  assignment: Assignment;
  pending?: boolean;
  onPress: () => void;
  onToggleStatus: () => void;
}

function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}: AssignmentItemProps) {
  const overdue = isOverdue(assignment.dueDate, assignment.status);

  return (
    <View style={[styles.card, overdue && styles.overdueCard]}>
      <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Chi tiết ${assignment.title}`}
        onPress={onPress}
        style={styles.details}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>
            {assignment.title}
          </Text>
          <SyncBadge pending={pending} />
        </View>
        <Text style={styles.meta}>
          {assignment.course?.name || 'Môn học'} · Hạn: {formatDate(assignment.dueDate)}
        </Text>
        {overdue ? <Text style={styles.overdueText}>Đã quá hạn</Text> : null}
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(AssignmentItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: sizes.touch,
  },
  overdueCard: {
    borderColor: colors.danger,
  },
  details: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  overdueText: {
    ...typography.captionBold,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});

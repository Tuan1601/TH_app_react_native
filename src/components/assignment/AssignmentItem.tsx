import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing, { radius, shadows, sizes } from '../../theme/spacing';
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
  const isDone = assignment.status === 'done';
  const overdue = isOverdue(assignment.dueDate, assignment.status);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Chi tiết ${assignment.title}`}
        style={[
          styles.card,
          isDone && styles.doneCard,
          overdue && styles.overdueCard,
        ]}>
        {/* Thanh màu bên trái thể hiện trạng thái */}
        <View
          style={[
            styles.accentBar,
            isDone
              ? styles.accentDone
              : overdue
              ? styles.accentOverdue
              : styles.accentTodo,
          ]}
        />

        {/* Nút check trạng thái với hiệu ứng micro-interaction */}
        <StatusToggle status={assignment.status} onToggle={onToggleStatus} />

        {/* Nội dung chi tiết */}
        <View style={styles.details}>
          <View style={styles.topRow}>
            <Text
              style={[styles.title, isDone && styles.doneTitle]}
              numberOfLines={2}>
              {assignment.title}
            </Text>
            <SyncBadge pending={pending} />
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="book-open-outline"
              size={14}
              color={colors.textMuted}
            />
            <Text style={styles.courseName} numberOfLines={1}>
              {assignment.course?.name || 'Môn học'}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <View
              style={[
                styles.badge,
                isDone
                  ? styles.badgeDone
                  : overdue
                  ? styles.badgeOverdue
                  : styles.badgeTodo,
              ]}>
              <MaterialCommunityIcons
                name={isDone ? 'check-circle' : overdue ? 'alert-circle' : 'clock-outline'}
                size={13}
                color={isDone ? colors.success : overdue ? colors.danger : colors.primary}
              />
              <Text
                style={[
                  styles.badgeText,
                  isDone
                    ? styles.textDone
                    : overdue
                    ? styles.textOverdue
                    : styles.textTodo,
                ]}>
                {isDone
                  ? 'Đã xong'
                  : overdue
                  ? 'Quá hạn'
                  : `Hạn: ${formatDate(assignment.dueDate)}`}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={colors.textMuted}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(AssignmentItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.sm,
  },
  doneCard: {
    backgroundColor: '#FAFBFD',
    opacity: 0.85,
  },
  overdueCard: {
    borderColor: colors.dangerLight,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  accentTodo: {
    backgroundColor: colors.primary,
  },
  accentDone: {
    backgroundColor: colors.success,
  },
  accentOverdue: {
    backgroundColor: colors.danger,
  },
  details: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  doneTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xxs,
  },
  courseName: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeTodo: {
    backgroundColor: colors.primaryLight,
  },
  badgeDone: {
    backgroundColor: colors.successLight,
  },
  badgeOverdue: {
    backgroundColor: colors.dangerLight,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '700',
  },
  textTodo: {
    color: colors.primary,
  },
  textDone: {
    color: colors.success,
  },
  textOverdue: {
    color: colors.danger,
  },
});

import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import spacing, { radius, shadows, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Grade } from '../../types/models';

export interface GradeRowProps {
  grade: Grade;
  onPress: () => void;
}

function GradeRow({ grade, onPress }: GradeRowProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const totalScore = Number(grade.total || 0);

  const scoreColor =
    totalScore >= 8.5
      ? colors.success
      : totalScore >= 7.0
      ? colors.primary
      : totalScore >= 5.0
      ? colors.warning
      : colors.danger;

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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Xem điểm ${grade.course?.name || ''}`}
        onPress={onPress}
        style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {grade.course?.name || 'Môn học'}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {grade.course?.credits || 0} tín chỉ
            </Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{grade.semester}</Text>
          </View>
        </View>

        {/* Điểm tổng kết & Điểm chữ */}
        <View style={styles.scoreContainer}>
          <View style={[styles.letterBadge, { backgroundColor: scoreColor + '18' }]}>
            <Text style={[styles.letterScore, { color: scoreColor }]}>
              {grade.letter}
            </Text>
          </View>
          <Text style={styles.totalScore}>{grade.total} / 10</Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(GradeRow);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: sizes.touch,
    ...shadows.sm,
  },
  info: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 6,
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: spacing.sm,
    minWidth: 54,
  },
  letterBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
  },
  letterScore: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalScore: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});

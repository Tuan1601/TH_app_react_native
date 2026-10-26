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
import type { Course } from '../../types/models';

export interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

const ICONS = ['code-tags', 'web', 'shield-check', 'cloud-outline', 'chart-bar'];

function CourseCard({ course, onPress }: CourseCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconName = ICONS[Number(course.id) % ICONS.length] || 'book-open-page-variant';

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
        accessibilityLabel={`Mở môn ${course.name}`}
        onPress={onPress}
        style={styles.card}>
        {/* Biểu tượng môn học */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={iconName} size={24} color={colors.primary} />
        </View>

        {/* Nội dung môn học */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.code}>{course.code}</Text>
            <View style={styles.creditBadge}>
              <Text style={styles.creditText}>{course.credits} Tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.name} numberOfLines={2}>
            {course.name}
          </Text>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="account-tie-outline"
              size={14}
              color={colors.textMuted}
            />
            <Text style={styles.metaText} numberOfLines={1}>
              {course.lecturer}
            </Text>
            <View style={styles.dot} />
            <MaterialCommunityIcons
              name="calendar-text-outline"
              size={14}
              color={colors.textMuted}
            />
            <Text style={styles.metaText}>{course.semester}</Text>
          </View>
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

export default React.memo(CourseCard);

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
    minHeight: sizes.touch,
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  code: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  creditBadge: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  creditText: {
    ...typography.small,
    color: colors.textMuted,
    fontSize: 11,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
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
    marginHorizontal: 3,
  },
});

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
import type { Session } from '../../types/models';

export interface SessionCardProps {
  session: Session;
  onPress: () => void;
}

function SessionCard({ session, onPress }: SessionCardProps) {
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Chi tiết buổi học ${session.course?.name || ''}`}
        onPress={onPress}
        style={styles.card}>
        {/* Cột thời gian bên trái */}
        <View style={styles.timeColumn}>
          <Text style={styles.startTime}>{session.startTime}</Text>
          <View style={styles.timeLine} />
          <Text style={styles.endTime}>{session.endTime}</Text>
        </View>

        {/* Nội dung môn & phòng học */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {session.course?.name || 'Môn học'}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.badgeRoom}>
              <MaterialCommunityIcons name="door-open" size={13} color={colors.primary} />
              <Text style={styles.roomText}>Phòng {session.room}</Text>
            </View>

            {session.course?.lecturer ? (
              <View style={styles.lecturerRow}>
                <MaterialCommunityIcons
                  name="account-tie-outline"
                  size={13}
                  color={colors.textMuted}
                />
                <Text style={styles.lecturerText} numberOfLines={1}>
                  {session.course.lecturer}
                </Text>
              </View>
            ) : null}
          </View>

          {session.note ? (
            <View style={styles.noteBox}>
              <MaterialCommunityIcons
                name="information-outline"
                size={13}
                color={colors.warning}
              />
              <Text style={styles.noteText} numberOfLines={1}>
                {session.note}
              </Text>
            </View>
          ) : null}
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

export default React.memo(SessionCard);

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
  timeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    minWidth: 64,
  },
  startTime: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 14,
  },
  timeLine: {
    width: 2,
    height: 12,
    backgroundColor: colors.primaryLight,
    marginVertical: 2,
    borderRadius: 1,
  },
  endTime: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  badgeRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  roomText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
  },
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  lecturerText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  noteText: {
    ...typography.caption,
    color: colors.warning,
    fontSize: 11,
    flex: 1,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';
import { todayDayOfWeek } from '../../utils/date';

const DAYS = [
  { label: 'T2', name: 'Thứ 2', value: 2 },
  { label: 'T3', name: 'Thứ 3', value: 3 },
  { label: 'T4', name: 'Thứ 4', value: 4 },
  { label: 'T5', name: 'Thứ 5', value: 5 },
  { label: 'T6', name: 'Thứ 6', value: 6 },
  { label: 'T7', name: 'Thứ 7', value: 7 },
  { label: 'CN', name: 'Chủ nhật', value: 8 },
];

export interface DaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export default function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  const currentToday = todayDayOfWeek();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {DAYS.map(day => {
        const isSelected = selectedDay === day.value;
        const isToday = currentToday === day.value;

        return (
          <TouchableOpacity
            key={day.value}
            accessibilityRole="button"
            accessibilityLabel={`Chọn ${day.name}`}
            onPress={() => onSelectDay(day.value)}
            activeOpacity={0.8}
            style={[
              styles.button,
              isSelected && styles.selectedButton,
              isToday && !isSelected && styles.todayOutline,
            ]}>
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {day.label}
            </Text>
            {isToday ? (
              <Text
                style={[
                  styles.todayDot,
                  isSelected && styles.todayDotSelected,
                ]}>
                ●
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  button: {
    width: sizes.dayButton,
    height: sizes.dayButton + 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  todayOutline: {
    borderColor: colors.primary,
  },
  text: {
    ...typography.captionBold,
    color: colors.text,
    fontSize: 14,
  },
  selectedText: {
    color: colors.white,
  },
  todayDot: {
    fontSize: 6,
    color: colors.primary,
    marginTop: -2,
  },
  todayDotSelected: {
    color: colors.white,
  },
});

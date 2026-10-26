import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { label: 'T2', value: 2 },
  { label: 'T3', value: 3 },
  { label: 'T4', value: 4 },
  { label: 'T5', value: 5 },
  { label: 'T6', value: 6 },
  { label: 'T7', value: 7 },
  { label: 'CN', value: 8 },
];

export interface DaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export default function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {DAYS.map(day => {
        const isSelected = selectedDay === day.value;
        return (
          <TouchableOpacity
            key={day.value}
            accessibilityRole="button"
            accessibilityLabel={`Chọn ${day.label}`}
            onPress={() => onSelectDay(day.value)}
            style={[styles.button, isSelected && styles.selectedButton]}>
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {day.label}
            </Text>
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
    height: sizes.dayButton,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  selectedText: {
    color: colors.white,
  },
});

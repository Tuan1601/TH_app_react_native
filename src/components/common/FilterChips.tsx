import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';

export interface FilterChipOption {
  label: string;
  value: string;
}

export interface FilterChipsProps {
  options: Array<string | FilterChipOption>;
  selected: string;
  onSelect: (value: string) => void;
}

export default function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {options.map(option => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const isSelected = selected === value;
        return (
          <TouchableOpacity
            key={value}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => onSelect(value)}
            style={[styles.chip, isSelected && styles.selectedChip]}>
            <Text style={[styles.text, isSelected && styles.selectedText]}>{label}</Text>
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
  chip: {
    minHeight: sizes.touch,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChip: {
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

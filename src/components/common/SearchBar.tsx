import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Tìm kiếm"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Xóa tìm kiếm"
          onPress={() => onChangeText('')}
          style={styles.clearButton}>
          <View style={styles.clearDot} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: sizes.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    minHeight: sizes.input - 4,
    paddingVertical: 0,
  },
  clearButton: {
    width: sizes.touch,
    height: sizes.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.textMuted,
  },
});

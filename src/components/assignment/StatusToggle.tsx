import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import { radius, sizes } from '../../theme/spacing';
import type { AssignmentStatus } from '../../types/models';

export interface StatusToggleProps {
  status: AssignmentStatus;
  onToggle: () => void;
}

export default function StatusToggle({ status, onToggle }: StatusToggleProps) {
  const isDone = status === 'done';
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
      accessibilityLabel={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      onPress={onToggle}
      style={[styles.button, isDone && styles.doneButton]}>
      <Text style={[styles.text, isDone && styles.doneText]}>
        {isDone ? '✓' : '○'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: sizes.touch,
    height: sizes.touch,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  doneButton: {
    backgroundColor: colors.successLight,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textMuted,
  },
  doneText: {
    color: colors.success,
  },
});

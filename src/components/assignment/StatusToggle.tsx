import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { radius, sizes } from '../../theme/spacing';
import type { AssignmentStatus } from '../../types/models';

export interface StatusToggleProps {
  status: AssignmentStatus;
  onToggle: () => void;
}

export default function StatusToggle({ status, onToggle }: StatusToggleProps) {
  const isDone = status === 'done';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.25,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDone, scaleAnim]);

  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
      accessibilityLabel={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      onPress={onToggle}
      activeOpacity={0.7}
      style={[styles.button, isDone && styles.doneButton]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialCommunityIcons
          name={isDone ? 'check' : 'checkbox-blank-circle-outline'}
          size={isDone ? 20 : 22}
          color={isDone ? colors.white : colors.textMuted}
        />
      </Animated.View>
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
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  doneButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
});

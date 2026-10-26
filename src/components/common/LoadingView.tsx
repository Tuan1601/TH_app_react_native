import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface LoadingViewProps {
  message?: string;
}

export default function LoadingView({ message = 'Đang tải…' }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.textMuted,
  },
});

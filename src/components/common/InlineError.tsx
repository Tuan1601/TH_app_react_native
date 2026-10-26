import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing, { radius } from '../../theme/spacing';
import typography from '../../theme/typography';

export interface InlineErrorProps {
  message?: string | null;
  onRetry?: () => void;
}

export default function InlineError({ message, onRetry }: InlineErrorProps) {
  if (!message) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <AppButton title="Thử lại" variant="outline" onPress={onRetry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  text: {
    ...typography.caption,
    color: colors.danger,
  },
});

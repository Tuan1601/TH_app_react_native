import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>!</Text>
      </View>
      <Text style={styles.title}>Không thể tải dữ liệu</Text>
      <Text style={styles.message}>{message || 'Đã có lỗi xảy ra.'}</Text>
      {onRetry ? (
        <AppButton title="Thử lại" variant="outline" onPress={onRetry} />
      ) : null}
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
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.danger,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

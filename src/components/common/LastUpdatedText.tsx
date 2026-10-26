import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatDateTime } from '../../utils/date';

export interface LastUpdatedTextProps {
  timestamp?: string | null;
}

export default function LastUpdatedText({ timestamp }: LastUpdatedTextProps) {
  if (!timestamp) {
    return null;
  }
  return (
    <Text style={styles.text}>Cập nhật lần cuối: {formatDateTime(timestamp)}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    marginVertical: spacing.xs,
  },
});

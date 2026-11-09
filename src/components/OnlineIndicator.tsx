/**
 * OnlineIndicator: chấm tròn hiển thị trạng thái Online (xanh lá) / Offline (xám).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../constants/colors';

export interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: number;
}

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({
  isOnline,
  size = 12,
}) => {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isOnline ? colors.online : colors.textMuted,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    borderWidth: 2,
    borderColor: colors.surface,
  },
});

export default OnlineIndicator;


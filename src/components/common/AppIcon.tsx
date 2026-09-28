/**
 * AppIcon - Wrapper around MaterialCommunityIcons
 *
 * Requires react-native-vector-icons to be properly linked.
 * For Android: android/app/build.gradle must contain:
 *   apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
 *
 * If icons still show as boxes after the gradle change, do a clean rebuild:
 *   cd android && ./gradlew clean && cd .. && npx react-native run-android
 */
import React from 'react';
import { Text, TextStyle } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const AppIcon: React.FC<AppIconProps> = ({ name, size = 20, color = '#000', style }) => {
  return (
    <MCIcon
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default AppIcon;

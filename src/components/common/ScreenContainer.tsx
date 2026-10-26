import React, { type PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({
  children,
  scroll = false,
  contentStyle,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
});

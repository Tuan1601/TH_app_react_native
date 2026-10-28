import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useBooks} from '../context/BookContext';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookFormScreen from '../screens/BookFormScreen';
import BookListScreen from '../screens/BookListScreen';
import BorrowingScreen from '../screens/BorrowingScreen';
import {colors, radius, spacing, typography} from '../theme';
import {RootStackParamList} from './types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingScreen(): React.JSX.Element {
  return (
    <View style={styles.stateContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.stateText}>Đang tải thư viện...</Text>
    </View>
  );
}

function LoadErrorScreen(): React.JSX.Element {
  const {error, reload} = useBooks();
  return (
    <View style={styles.stateContainer}>
      <View style={styles.errorIcon}>
        <MaterialCommunityIcons name="database-alert-outline" size={30} color={colors.danger} />
      </View>
      <Text style={styles.errorTitle}>Không thể tải thư viện</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => reload()}
        style={({pressed}) => [styles.retryButton, pressed && styles.pressed]}>
        <Text style={styles.retryText}>Thử lại</Text>
      </Pressable>
    </View>
  );
}

export default function AppNavigator(): React.JSX.Element {
  const {isLoading, error} = useBooks();
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <LoadErrorScreen />;
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="BookList" component={BookListScreen} />
      <Stack.Screen name="BookForm" component={BookFormScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen name="Borrowing" component={BorrowingScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xxl,
  },
  stateText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  errorIcon: {
    width: 62,
    height: 62,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    color: colors.neutral,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  errorMessage: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 21,
  },
  retryButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.body,
  },
  pressed: {
    opacity: 0.8,
  },
});

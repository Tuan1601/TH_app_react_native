/**
 * EmptyState: hiển thị khi danh sách trống hoặc có lỗi xảy ra.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';

export interface EmptyStateProps {
  iconName?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  isError?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'chatbubble-ellipses-outline',
  title,
  description,
  actionLabel,
  onActionPress,
  isError = false,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          isError ? styles.iconCircleError : styles.iconCircleNormal,
        ]}>
        <Ionicons
          name={iconName}
          size={36}
          color={isError ? colors.danger : colors.primary}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onActionPress ? (
        <TouchableOpacity
          style={styles.button}
          onPress={onActionPress}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleNormal: {
    backgroundColor: colors.primaryLight,
  },
  iconCircleError: {
    backgroundColor: colors.dangerLight,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmptyState;


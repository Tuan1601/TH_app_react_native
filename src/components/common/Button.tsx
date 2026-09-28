import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../../theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      ...styles.base,
      ...styles[`size_${size}`],
      ...(fullWidth ? styles.fullWidth : {}),
    };

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: COLORS.primary, ...SHADOWS.lg };
      case 'secondary':
        return { ...base, backgroundColor: COLORS.secondary };
      case 'danger':
        return { ...base, backgroundColor: COLORS.danger };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: COLORS.primary,
        };
      case 'ghost':
        return { ...base, backgroundColor: 'transparent' };
      default:
        return { ...base, backgroundColor: COLORS.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      ...styles.text,
      ...styles[`textSize_${size}`],
    };

    switch (variant) {
      case 'outline':
        return { ...base, color: COLORS.primary };
      case 'ghost':
        return { ...base, color: COLORS.primary };
      default:
        return { ...base, color: '#FFFFFF' };
    }
  };

  return (
    <TouchableOpacity
      style={[
        getContainerStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : '#fff'}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  size_sm: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 36,
  },
  size_md: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },
  size_lg: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textSize_sm: {
    fontSize: FONTS.sizes.sm,
  },
  textSize_md: {
    fontSize: FONTS.sizes.base,
  },
  textSize_lg: {
    fontSize: FONTS.sizes.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;

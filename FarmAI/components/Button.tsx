import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../lib/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    medium: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    large: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  };

  const variantStyles = {
    primary: {
      backgroundColor: isDisabled ? colors.outline : colors.primary,
      borderColor: colors.primary,
    },
    secondary: {
      backgroundColor: isDisabled ? colors.surfaceVariant : colors.secondary,
      borderColor: colors.secondary,
    },
    outline: {
      backgroundColor: colors.surface,
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
  };

  const variantTextStyles = {
    primary: { color: colors.onPrimary },
    secondary: { color: colors.onPrimary },
    outline: { color: colors.primary },
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={isDisabled ? 1 : 0.7}
    >
      <View
        style={[
          styles.button,
          sizeStyles[size],
          variantStyles[variant],
          styles.border,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variantTextStyles[variant].color} />
        ) : (
          <Text
            style={[
              styles.text,
              variantTextStyles[variant],
              { fontSize: size === 'small' ? 12 : size === 'medium' ? 14 : 16 },
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderWidth: 1,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
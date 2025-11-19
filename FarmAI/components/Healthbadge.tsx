import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../lib/theme';

interface HealthBadgeProps {
  status: 'healthy' | 'warning' | 'critical';
  confidence?: number;
}

const statusStyles = {
  healthy: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.success,
    textColor: colors.success,
    label: 'Saludable',
  },
  warning: {
    backgroundColor: '#FFF3E0',
    borderColor: colors.warning,
    textColor: '#E65100',
    label: 'Alerta',
  },
  critical: {
    backgroundColor: '#FFEBEE',
    borderColor: colors.error,
    textColor: colors.error,
    label: 'Crítico',
  },
};

export default function HealthBadge({ status, confidence }: HealthBadgeProps) {
  const style = statusStyles[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
        },
      ]}
    >
      <Text style={[styles.label, { color: style.textColor }]}>
        {style.label}
      </Text>
      {confidence !== undefined && (
        <Text style={[styles.confidence, { color: style.textColor }]}>
          {confidence}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    fontWeight: '600',
  },
  confidence: {
    ...typography.label,
    fontWeight: '700',
  },
});
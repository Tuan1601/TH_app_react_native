import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import AppIcon from './AppIcon';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../../theme';

interface InfoRowProps {
  label: string;
  value: string;
  icon?: string;
  style?: ViewStyle;
  isLast?: boolean;
  accentColor?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  icon,
  style,
  isLast,
  accentColor,
}) => {
  return (
    <View style={[styles.row, isLast && styles.rowLast, style]}>
      {icon ? (
        <View style={[styles.iconWrap, accentColor ? { backgroundColor: accentColor + '18' } : {}]}>
          <AppIcon
            name={icon}
            size={18}
            color={accentColor || COLORS.primary}
          />
        </View>
      ) : null}
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );
};

interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, style }) => {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHeader}>
        {icon && (
          <AppIcon name={icon} size={16} color={COLORS.primary} style={styles.sectionIcon} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDark + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionIcon: {
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 0,
  },
});

export { InfoRow, SectionCard };

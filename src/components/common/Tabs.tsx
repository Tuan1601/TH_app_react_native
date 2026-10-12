import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import AppIcon from './AppIcon';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../../theme';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  color?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  scrollable?: boolean;
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  scrollable = true,
  containerStyle,
  tabStyle,
}) => {
  const renderTab = (item: TabItem) => {
    const isActive = activeTab === item.id;
    const activeColor = item.color || COLORS.primary;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.tabButton,
          isActive
            ? [
                styles.tabButtonActive,
                { backgroundColor: activeColor, borderColor: activeColor },
                SHADOWS.sm,
              ]
            : styles.tabButtonInactive,
          tabStyle,
        ]}
        onPress={() => onTabChange(item.id)}
        activeOpacity={0.75}
      >
        {item.icon ? (
          <AppIcon
            name={item.icon}
            size={16}
            color={isActive ? '#FFFFFF' : item.color || COLORS.textSecondary}
            style={styles.tabIcon}
          />
        ) : null}

        <Text
          style={[
            styles.tabLabel,
            isActive ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          {item.label}
        </Text>

        {typeof item.count === 'number' && (
          <View
            style={[
              styles.countBadge,
              isActive
                ? styles.countBadgeActive
                : [
                    styles.countBadgeInactive,
                    item.color ? { backgroundColor: item.color + '18' } : {},
                  ],
            ]}
          >
            <Text
              style={[
                styles.countText,
                isActive
                  ? styles.countTextActive
                  : [
                      styles.countTextInactive,
                      item.color ? { color: item.color } : {},
                    ],
              ]}
            >
              {item.count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (scrollable) {
    return (
      <View style={[styles.container, containerStyle]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.fixedRow, containerStyle]}>
      {tabs.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingVertical: 2,
  },
  fixedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    minHeight: 38,
  },
  tabButtonActive: {
    borderWidth: 1.5,
  },
  tabButtonInactive: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.border,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: COLORS.textSecondary,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  countBadgeInactive: {
    backgroundColor: COLORS.border,
  },
  countText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  countTextInactive: {
    color: COLORS.textSecondary,
  },
});

export default Tabs;
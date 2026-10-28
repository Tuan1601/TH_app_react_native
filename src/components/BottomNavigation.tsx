import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootStackParamList} from '../navigation/types';
import {colors, radius, spacing} from '../theme';

export type MainTab = 'BookList' | 'BookForm' | 'Borrowing';

type Props = {
  navigation: Pick<NativeStackNavigationProp<RootStackParamList, 'BookList'>, 'navigate'>;
  activeTab: MainTab;
};

const tabs: {route: MainTab; label: string; icon: string}[] = [
  {route: 'BookList', label: 'Sách', icon: 'book-open-page-variant-outline'},
  {route: 'BookForm', label: 'Thêm mới', icon: 'plus-circle-outline'},
  {route: 'Borrowing', label: 'Mượn trả', icon: 'swap-horizontal'},
];

export default function BottomNavigation({navigation, activeTab}: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const selected = activeTab === tab.route;
        return (
          <Pressable
            key={tab.route}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{selected}}
            onPress={() => {
              if (tab.route === 'BookForm' || tab.route === 'Borrowing') {
                navigation.navigate(tab.route, undefined);
              } else {
                navigation.navigate('BookList');
              }
            }}
            style={({pressed}) => [
              styles.tab,
              selected && styles.selectedTab,
              pressed && styles.pressed,
            ]}>
            <MaterialCommunityIcons
              name={tab.icon}
              size={20}
              color={selected ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.label, selected && styles.selectedLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: radius.md,
  },
  selectedTab: {
    backgroundColor: colors.surfaceMuted,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  selectedLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
});

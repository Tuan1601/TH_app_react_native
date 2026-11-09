/**
 * MainTabNavigator: 4 tab chính của ứng dụng sau khi đăng nhập:
 * - HomeScreen (Tin nhắn, có badge tổng số tin chưa đọc)
 * - ContactsScreen (Danh bạ)
 * - NotificationsScreen (Thông báo)
 * - SettingsScreen (Cài đặt)
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { useAuth } from '../hooks/useAuth';
import { useConversations } from '../hooks/useConversations';
import ContactsScreen from '../screens/main/ContactsScreen';
import HomeScreen from '../screens/main/HomeScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<
  keyof MainTabParamList,
  { active: string; inactive: string }
> = {
  Home: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Contacts: { active: 'people', inactive: 'people-outline' },
  Notifications: {
    active: 'notifications',
    inactive: 'notifications-outline',
  },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

function renderTabIcon(
  routeName: keyof MainTabParamList,
  focused: boolean,
  color: string,
  size: number,
) {
  const iconPair = TAB_ICONS[routeName];
  const iconName = focused ? iconPair.active : iconPair.inactive;
  return <Ionicons name={iconName} size={size} color={color} />;
}

export const MainTabNavigator: React.FC = () => {
  const { userProfile } = useAuth();
  const { totalUnread } = useConversations(userProfile?.uid);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) =>
          renderTabIcon(route.name, focused, color, size),
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Tin nhắn',
          tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: 11,
            fontWeight: '700',
          },
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ title: 'Danh bạ' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Thông báo' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Cài đặt' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;


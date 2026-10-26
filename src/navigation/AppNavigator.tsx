import React from 'react';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { TAB_ROUTES } from './routes';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const TAB_ICONS: Record<string, string> = {
  [TAB_ROUTES.OVERVIEW]: 'view-dashboard-outline',
  [TAB_ROUTES.COURSES]: 'book-open-variant',
  [TAB_ROUTES.SCHEDULE]: 'calendar-week',
  [TAB_ROUTES.ASSIGNMENTS]: 'clipboard-text-outline',
  [TAB_ROUTES.PROFILE]: 'account-circle-outline',
};

function renderTabBarIcon(routeName: string, color: string, size: number) {
  const iconName = TAB_ICONS[routeName] || 'circle';
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
}

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { assignments } = useAppData();
  const incompleteCount = (assignments || []).filter(
    item => item.status !== 'done',
  ).length;

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            height: 70,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            elevation: 12,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarIcon: ({ color, size }) => renderTabBarIcon(route.name, color, size),
        })}>
        <Tab.Screen
          name={TAB_ROUTES.OVERVIEW}
          component={HomeStack}
          options={{ title: 'Tổng quan' }}
        />
        <Tab.Screen
          name={TAB_ROUTES.COURSES}
          component={CourseStack}
          options={{ title: 'Môn học' }}
        />
        <Tab.Screen
          name={TAB_ROUTES.SCHEDULE}
          component={ScheduleStack}
          options={{ title: 'Thời khóa biểu' }}
        />
        <Tab.Screen
          name={TAB_ROUTES.ASSIGNMENTS}
          component={AssignmentStack}
          options={{
            title: 'Bài tập',
            tabBarBadge: incompleteCount > 0 ? incompleteCount : undefined,
          }}
        />
        <Tab.Screen
          name={TAB_ROUTES.PROFILE}
          component={ProfileStack}
          options={{ title: 'Cá nhân' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

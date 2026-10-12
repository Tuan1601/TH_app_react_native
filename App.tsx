import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList, TabParamList } from './src/types';
import { COLORS } from './src/theme';
import AppIcon from './src/components/common/AppIcon';


import TongQuanScreen from './src/screens/TongQuanScreen';
import MonHocScreen from './src/screens/MonHocScreen';
import ThoiKhoaBieuScreen from './src/screens/ThoiKhoaBieuScreen';
import BaiTapScreen from './src/screens/BaiTapScreen';
import CaNhanScreen from './src/screens/CaNhanScreen';


import ChiTietMonHocScreen from './src/screens/ChiTietMonHocScreen';
import ChiTietBuoiHocScreen from './src/screens/ChiTietBuoiHocScreen';
import ChiTietBaiTapScreen from './src/screens/ChiTietBaiTapScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, { focused: string; unfocused: string }> = {
  TongQuan: { focused: 'home', unfocused: 'home-outline' },
  MonHoc: { focused: 'book-open-variant', unfocused: 'book-open-outline' },
  ThoiKhoaBieu: { focused: 'calendar', unfocused: 'calendar-outline' },
  BaiTap: { focused: 'clipboard-text', unfocused: 'clipboard-text-outline' },
  CaNhan: { focused: 'account-circle', unfocused: 'account-circle-outline' },
};

const TAB_LABELS: Record<keyof TabParamList, string> = {
  TongQuan: 'Tổng quan',
  MonHoc: 'Môn học',
  ThoiKhoaBieu: 'Lịch học',
  BaiTap: 'Bài tập',
  CaNhan: 'Cá nhân',
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <AppIcon
              name={focused ? icons.focused : icons.unfocused}
              size={size}
              color={color}
            />
          );
        },
        tabBarLabel: TAB_LABELS[route.name],
      })}
    >
      <Tab.Screen name="TongQuan" component={TongQuanScreen} />
      <Tab.Screen name="MonHoc" component={MonHocScreen} />
      <Tab.Screen name="ThoiKhoaBieu" component={ThoiKhoaBieuScreen} />
      <Tab.Screen name="BaiTap" component={BaiTapScreen} />
      <Tab.Screen name="CaNhan" component={CaNhanScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="ChiTietMonHoc"
            component={ChiTietMonHocScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChiTietBuoiHoc"
            component={ChiTietBuoiHocScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChiTietBaiTap"
            component={ChiTietBaiTapScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

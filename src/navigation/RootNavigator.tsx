/**
 * RootNavigator: tự động chuyển đổi giữa AuthNavigator và AppStack (MainTabNavigator + ChatScreen)
 * dựa trên trạng thái đăng nhập từ onAuthStateChanged().
 * Khi đăng xuất, AuthNavigator thay thế hoàn toàn AppStack nên người dùng không thể
 * nhấn nút Back Android để quay lại màn hình đã đăng nhập (TEST 17).
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import ChatScreen from '../screens/chat/ChatScreen';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import type { AppStackParamList } from './types';

const AppStack = createNativeStackNavigator<AppStackParamList>();

export const RootNavigator: React.FC = () => {
  const { firebaseUser, initializing } = useAuth();

  if (initializing) {
    return <Loading message="Đang khởi tạo phiên đăng nhập..." />;
  }

  return (
    <NavigationContainer>
      {firebaseUser ? (
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AppStack.Screen name="MainTabs" component={MainTabNavigator} />
          <AppStack.Screen name="Chat" component={ChatScreen} />
        </AppStack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;


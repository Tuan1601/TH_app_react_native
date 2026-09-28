import React, { useState, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Student, RootStackParamList } from './src/types';
import { INITIAL_STUDENTS } from './src/data/studentData';
import { COLORS } from './src/theme';

import DanhSachScreen from './src/screens/DanhSachScreen';
import ChiTietScreen from './src/screens/ChiTietScreen';
import ThemSinhVienScreen from './src/screens/ThemSinhVienScreen';
import ChinhSuaScreen from './src/screens/ChinhSuaScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  const handleAdd = useCallback((newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  }, []);

  const handleUpdate = useCallback((updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)),
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  }, []);

  const existingIds = students.map(s => s.maSV);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="DanhSach"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 16,
              letterSpacing: 0.2,
            },
            headerBackTitle: '',
            animation: 'slide_from_right',
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          <Stack.Screen
            name="DanhSach"
            options={{
              headerShown: false,
            }}
          >
            {props => (
              <DanhSachScreen
                {...props}
                students={students}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="ChiTiet"
            options={({ route }) => ({
              title: route.params.student.hoTen,
              headerStyle: {
                backgroundColor: getHeaderColor(route.params.student.xepLoai),
              },
            })}
          >
            {props => (
              <ChiTietScreen
                {...props}
                onDelete={handleDelete}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="ThemSinhVien"
            options={{
              title: 'Thêm sinh viên mới',
            }}
          >
            {props => (
              <ThemSinhVienScreen
                {...props}
                onAdd={handleAdd}
                existingIds={existingIds}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="ChinhSua"
            options={{
              title: 'Chỉnh sửa thông tin',
            }}
          >
            {props => (
              <ChinhSuaScreen
                {...props}
                onUpdate={handleUpdate}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const getHeaderColor = (xepLoai: string): string => {
  switch (xepLoai) {
    case 'Giỏi': return COLORS.gioi;
    case 'Khá': return COLORS.kha;
    case 'Trung bình': return COLORS.trungBinh;
    case 'Yếu': return COLORS.yeu;
    default: return COLORS.primary;
  }
};

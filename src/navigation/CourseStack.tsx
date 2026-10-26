import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, type CourseStackParamList } from './routes';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';

const Stack = createNativeStackNavigator<CourseStackParamList>();

export default function CourseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.COURSES}
        component={CourseListScreen}
        options={{ title: 'Môn học' }}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
    </Stack.Navigator>
  );
}

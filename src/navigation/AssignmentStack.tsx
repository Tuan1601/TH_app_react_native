import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, type AssignmentStackParamList } from './routes';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';

const Stack = createNativeStackNavigator<AssignmentStackParamList>();

export default function AssignmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.ASSIGNMENTS}
        component={AssignmentListScreen}
        options={{ title: 'Bài tập' }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_DETAIL}
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_FORM}
        component={AssignmentFormScreen}
        options={{ title: 'Thêm bài tập' }}
      />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, type ScheduleStackParamList } from './routes';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.SCHEDULE}
        component={ScheduleScreen}
        options={{ title: 'Thời khóa biểu' }}
      />
      <Stack.Screen
        name={ROUTES.SESSION_DETAIL}
        component={SessionDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
    </Stack.Navigator>
  );
}

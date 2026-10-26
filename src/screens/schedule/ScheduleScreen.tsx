import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type ScheduleStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import InlineError from '../../components/common/InlineError';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import { todayDayOfWeek } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = NativeStackScreenProps<ScheduleStackParamList, typeof ROUTES.SCHEDULE>;

export default function ScheduleScreen({ navigation }: Props) {
  const [selectedDay, setSelectedDay] = useState(todayDayOfWeek());
  const [refreshing, setRefreshing] = useState(false);
  const { sessions, status, refresh } = useAppData();

  const filtered = useMemo(() => {
    return (sessions || []).filter(
      session => Number(session.dayOfWeek) === selectedDay,
    );
  }, [sessions, selectedDay]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh('sessions', true);
    } finally {
      setRefreshing(false);
    }
  };

  if (!sessions && status.sessions.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!sessions && status.sessions.error) {
    return (
      <ScreenContainer>
        <ErrorView
          message={status.sessions.error.message}
          onRetry={() => refresh('sessions')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <InlineError
              message={status.sessions.error?.message}
              onRetry={() => refresh('sessions')}
            />
            <DaySelector
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
            <Text style={styles.sectionTitle}>Lịch học trong ngày</Text>
            <LastUpdatedText timestamp={status.sessions.lastUpdated} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học"
            description="Bạn không có tiết học nào trong ngày này."
          />
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
});

import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type AssignmentStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import InlineError from '../../components/common/InlineError';
import AppButton from '../../components/common/AppButton';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Assignment } from '../../types/models';

const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'todo', label: 'Chưa xong' },
  { value: 'done', label: 'Đã xong' },
  { value: 'overdue', label: 'Quá hạn' },
];

type Props = NativeStackScreenProps<AssignmentStackParamList, typeof ROUTES.ASSIGNMENTS>;

export default function AssignmentListScreen({ navigation }: Props) {
  const {
    assignments,
    status,
    refresh,
    toggleAssignmentStatus,
    isPending,
  } = useAppData();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    return (assignments || []).filter(item => {
      if (filter === 'todo') {
        return item.status === 'todo';
      }
      if (filter === 'done') {
        return item.status === 'done';
      }
      if (filter === 'overdue') {
        return isOverdue(item.dueDate, item.status);
      }
      return true;
    });
  }, [assignments, filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh('assignments', true);
    } finally {
      setRefreshing(false);
    }
  };

  const onToggle = async (item: Assignment) => {
    try {
      await toggleAssignmentStatus(item.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.';
      Alert.alert('Không thể cập nhật bài tập', msg);
    }
  };

  if (!assignments && status.assignments.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!assignments && status.assignments.error) {
    return (
      <ScreenContainer>
        <ErrorView
          message={status.assignments.error.message}
          onRetry={() => refresh('assignments')}
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
          <AssignmentItem
            assignment={item}
            pending={isPending('assignments', item.id)}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => onToggle(item)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Bài tập</Text>
            <Text style={styles.subtitle}>Theo dõi tiến độ và hạn nộp của bạn</Text>
            <InlineError
              message={status.assignments.error?.message}
              onRetry={() => refresh('assignments')}
            />
            <AppButton
              title="＋  Thêm bài tập"
              onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
              style={styles.addButton}
            />
            <FilterChips
              options={FILTERS}
              selected={filter}
              onSelect={setFilter}
            />
            <LastUpdatedText timestamp={status.assignments.lastUpdated} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập"
            description="Không tìm thấy bài tập nào phù hợp với bộ lọc hiện tại."
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
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  addButton: {
    marginBottom: spacing.md,
  },
});

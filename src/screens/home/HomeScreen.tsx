import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type HomeStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import useOutboxSync from '../../hooks/useOutboxSync';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AppButton from '../../components/common/AppButton';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';
import { daysLeft } from '../../utils/date';
import type { Assignment } from '../../types/models';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.HOME>;

export default function HomeScreen({ navigation }: Props) {
  const {
    student,
    courses,
    assignments,
    isOnline,
    status,
    refreshAll,
    toggleAssignmentStatus,
    isPending,
  } = useAppData();
  const { pendingCount, syncing, syncNow } = useOutboxSync();
  const [refreshing, setRefreshing] = useState(false);

  // Bài tập đến hạn trong 7 ngày tới
  const upcomingAssignments = useMemo(
    () =>
      (assignments || []).filter(item => {
        if (item.status === 'done') {
          return false;
        }
        const left = daysLeft(item.dueDate);
        return !Number.isNaN(left) && left >= 0 && left <= 7;
      }),
    [assignments],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAll(true);
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

  if (!student && !courses && !assignments) {
    if (status.student.error || status.courses.error || status.assignments.error) {
      return (
        <ScreenContainer>
          <ErrorView
            message="Chưa thể tải dữ liệu. Hãy kiểm tra máy chủ json-server."
            onRetry={refreshAll}
          />
        </ScreenContainer>
      );
    }
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={upcomingAssignments}
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
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.name}>{student?.fullName || 'Sinh viên'}</Text>
            <Text style={styles.code}>{student?.studentCode || ''}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{(courses || []).length}</Text>
                <Text style={styles.statLabel}>Môn đang học</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{pendingCount}</Text>
                <Text style={styles.statLabel}>Chưa đồng bộ</Text>
              </View>
            </View>

            {pendingCount > 0 ? (
              <AppButton
                title={syncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
                onPress={syncNow}
                loading={syncing}
                disabled={!isOnline}
                style={styles.syncButton}
              />
            ) : null}

            <Text style={styles.sectionTitle}>Môn đang học</Text>
            {(courses || []).slice(0, 3).map(course => (
              <TouchableOpacity
                key={course.id}
                accessibilityRole="button"
                accessibilityLabel={`Mở môn ${course.name}`}
                style={styles.courseItem}
                onPress={() =>
                  navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })
                }>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseMeta}>
                  {course.code} · {course.credits} tín chỉ
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Bài tập đến hạn trong 7 ngày tới</Text>
            <LastUpdatedText
              timestamp={
                status.assignments.lastUpdated || status.student.lastUpdated
              }
            />
            {!isOnline ? (
              <Text style={styles.offlineNotice}>
                Dữ liệu đang hiển thị từ bộ nhớ đệm (cache).
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập sắp đến hạn"
            description="Các bài tập cần làm trong 7 ngày tới sẽ xuất hiện ở đây."
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
    marginBottom: spacing.md,
  },
  greeting: {
    ...typography.body,
    color: colors.textMuted,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.xxs,
  },
  code: {
    ...typography.bodyBold,
    color: colors.primary,
    marginTop: spacing.xxs,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  statBox: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    ...typography.stat,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  syncButton: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  courseItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: sizes.touch,
    justifyContent: 'center',
  },
  courseName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  courseMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  offlineNotice: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
});

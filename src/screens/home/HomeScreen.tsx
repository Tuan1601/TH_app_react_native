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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, TAB_ROUTES, type HomeStackParamList } from '../../navigation/routes';
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
import spacing, { radius, shadows, sizes } from '../../theme/spacing';
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

  const completedCount = useMemo(
    () => (assignments || []).filter(item => item.status === 'done').length,
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

  const avatarInitial = (student?.fullName || 'S')
    .trim()
    .split(' ')
    .slice(-1)[0]
    .charAt(0)
    .toUpperCase();

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
            {/* Banner thẻ sinh viên phong cách hiện đại */}
            <View style={styles.profileCard}>
              <View style={styles.profileTop}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>{avatarInitial}</Text>
                </View>
                <View style={styles.greetingBox}>
                  <Text style={styles.greetingSmall}>Xin chào 👋</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {student?.fullName || 'Sinh viên'}
                  </Text>
                  <Text style={styles.code}>
                    {student?.studentCode} • {student?.className}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.bellButton}
                  onPress={() => (navigation as any).navigate(TAB_ROUTES.ASSIGNMENTS)}>
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={22}
                    color={colors.white}
                  />
                  {upcomingAssignments.length > 0 ? (
                    <View style={styles.bellBadge}>
                      <Text style={styles.bellBadgeText}>
                        {upcomingAssignments.length}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              </View>

              {/* Các thông số tóm tắt nhanh trên Card */}
              <View style={styles.statsCardRow}>
                <View style={styles.statMini}>
                  <Text style={styles.statMiniNum}>{(courses || []).length}</Text>
                  <Text style={styles.statMiniLabel}>Môn học</Text>
                </View>
                <View style={styles.statMiniDivider} />
                <View style={styles.statMini}>
                  <Text style={styles.statMiniNum}>
                    {completedCount}/{(assignments || []).length}
                  </Text>
                  <Text style={styles.statMiniLabel}>Đã xong</Text>
                </View>
                <View style={styles.statMiniDivider} />
                <View style={styles.statMini}>
                  <Text style={[styles.statMiniNum, { color: colors.warningLight }]}>
                    {pendingCount}
                  </Text>
                  <Text style={styles.statMiniLabel}>Chờ sync</Text>
                </View>
              </View>
            </View>

            {/* Nút đồng bộ nếu có thay đổi offline */}
            {pendingCount > 0 ? (
              <AppButton
                title={syncing ? 'Đang đồng bộ...' : `Đồng bộ ngay (${pendingCount} thay đổi)`}
                onPress={syncNow}
                loading={syncing}
                disabled={!isOnline}
                style={styles.syncButton}
              />
            ) : null}

            {/* Tiêu đề & Danh sách môn học */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Môn đang học</Text>
              </View>
              <TouchableOpacity
                onPress={() => (navigation as any).navigate(TAB_ROUTES.COURSES)}>
                <Text style={styles.seeAll}>Tất cả</Text>
              </TouchableOpacity>
            </View>

            {(courses || []).slice(0, 3).map(course => (
              <TouchableOpacity
                key={course.id}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Mở môn ${course.name}`}
                style={styles.courseItem}
                onPress={() =>
                  navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })
                }>
                <View style={styles.courseIconBox}>
                  <MaterialCommunityIcons
                    name="book-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseMeta}>
                    {course.code} • {course.credits} tín chỉ • {course.lecturer}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ))}

            {/* Tiêu đề bài tập */}
            <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Hạn nộp trong 7 ngày tới</Text>
              </View>
              <TouchableOpacity
                onPress={() => (navigation as any).navigate(TAB_ROUTES.ASSIGNMENTS)}>
                <Text style={styles.seeAll}>Xem thêm</Text>
              </TouchableOpacity>
            </View>

            <LastUpdatedText
              timestamp={status.assignments.lastUpdated || status.student.lastUpdated}
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
            description="Tất cả bài tập trong 7 ngày tới đều đã hoàn thành!"
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
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xs,
  },
  profileCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.primary,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  greetingBox: {
    flex: 1,
  },
  greetingSmall: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  name: {
    ...typography.h2,
    color: colors.white,
    fontSize: 20,
    marginTop: 1,
  },
  code: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  bellButton: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.danger,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bellBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  statsCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  statMini: {
    alignItems: 'center',
    flex: 1,
  },
  statMiniNum: {
    ...typography.stat,
    color: colors.white,
    fontSize: 18,
  },
  statMiniLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  statMiniDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  syncButton: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontSize: 16,
  },
  seeAll: {
    ...typography.captionBold,
    color: colors.primary,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: sizes.touch,
    ...shadows.sm,
  },
  courseIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 14,
  },
  courseMeta: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  offlineNotice: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
});

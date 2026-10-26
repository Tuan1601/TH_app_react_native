import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { courseService } from '../../api/courseService';
import { detailKey } from '../../storage/keys';
import useCachedQuery from '../../hooks/useCachedQuery';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InlineError from '../../components/common/InlineError';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import InfoRow from '../../components/profile/InfoRow';
import { formatDate } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Course } from '../../types/models';

type Props = NativeStackScreenProps<any, any>;

export default function CourseDetailScreen({ route, navigation }: Props) {
  const { id } = route.params as { id: string | number };
  const fetcher = useCallback(() => courseService.getById(id), [id]);
  const {
    data: queriedCourse,
    loading,
    error,
    refresh,
    lastUpdated,
  } = useCachedQuery<Course>(detailKey('course', id), fetcher);

  const { courses, sessions, assignments } = useAppData();
  const course =
    queriedCourse || (courses || []).find(c => String(c.id) === String(id));

  useEffect(() => {
    if (course?.name) {
      navigation.setOptions({ title: course.name });
    }
  }, [course?.name, navigation]);

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refresh(true)} />
      </ScreenContainer>
    );
  }

  if (!course) {
    return (
      <ScreenContainer>
        <ErrorView
          message="Không tìm thấy môn học."
          onRetry={() => refresh(true)}
        />
      </ScreenContainer>
    );
  }

  const courseSessions = (sessions || []).filter(
    s => String(s.courseId) === String(course.id),
  );
  const courseAssignments = (assignments || []).filter(
    a => String(a.courseId) === String(course.id),
  );

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>{course.name}</Text>
      <InlineError message={error?.message} onRetry={() => refresh(true)} />
      <LastUpdatedText timestamp={lastUpdated} />

      <InfoRow label="Mã môn" value={course.code} />
      <InfoRow label="Số tín chỉ" value={course.credits} />
      <InfoRow label="Giảng viên" value={course.lecturer} />
      <InfoRow label="Học kỳ" value={course.semester} />
      <InfoRow label="Mô tả" value={course.description} />

      <Text style={styles.sectionTitle}>Lịch học của môn</Text>
      {courseSessions.length > 0 ? (
        courseSessions.map(session => (
          <View key={session.id} style={styles.bulletItem}>
            <Text style={styles.bulletText}>
              • Thứ {session.dayOfWeek}: {session.startTime} – {session.endTime} (Phòng {session.room})
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Chưa có lịch học cho môn này.</Text>
      )}

      <Text style={styles.sectionTitle}>Bài tập của môn</Text>
      {courseAssignments.length > 0 ? (
        courseAssignments.map(assignment => (
          <View key={assignment.id} style={styles.bulletItem}>
            <Text style={styles.bulletText}>
              • {assignment.title} (Hạn: {formatDate(assignment.dueDate)}) -{' '}
              {assignment.status === 'done' ? 'Đã xong' : 'Chưa xong'}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Chưa có bài tập cho môn này.</Text>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  bulletItem: {
    paddingVertical: spacing.xs,
  },
  bulletText: {
    ...typography.body,
    color: colors.textMuted,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { gradeService } from '../../api/gradeService';
import { detailKey } from '../../storage/keys';
import useCachedQuery from '../../hooks/useCachedQuery';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import InlineError from '../../components/common/InlineError';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Grade } from '../../types/models';

type Props = NativeStackScreenProps<any, any>;

export default function GradeDetailScreen({ route, navigation }: Props) {
  const { id } = route.params as { id: string | number };
  const fetcher = useCallback(() => gradeService.getById(id), [id]);
  const {
    data: queriedGrade,
    loading,
    error,
    refresh,
    lastUpdated,
  } = useCachedQuery<Grade>(detailKey('grade', id), fetcher);

  const { grades } = useAppData();
  const grade =
    queriedGrade || (grades || []).find(g => String(g.id) === String(id));

  useEffect(() => {
    if (grade?.course?.name) {
      navigation.setOptions({ title: grade.course.name });
    }
  }, [grade?.course?.name, navigation]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refresh(true)} />
      </ScreenContainer>
    );
  }

  if (!grade) {
    return (
      <ScreenContainer>
        <ErrorView
          message="Không tìm thấy bảng điểm."
          onRetry={() => refresh(true)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>{grade.course?.name || 'Môn học'}</Text>
      <InlineError message={error?.message} onRetry={() => refresh(true)} />
      <LastUpdatedText timestamp={lastUpdated} />

      <InfoRow label="Học kỳ" value={grade.semester} />
      <InfoRow label="Điểm chuyên cần (10%)" value={`${grade.attendance}/10`} />
      <InfoRow label="Điểm giữa kỳ (30%)" value={`${grade.midterm}/10`} />
      <InfoRow label="Điểm cuối kỳ (60%)" value={`${grade.final}/10`} />
      <InfoRow label="Điểm tổng kết" value={`${grade.total}/10`} />
      <InfoRow label="Điểm chữ" value={grade.letter} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
});

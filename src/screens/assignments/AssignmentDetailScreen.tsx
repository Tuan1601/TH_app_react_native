import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { assignmentService } from '../../api/assignmentService';
import { detailKey } from '../../storage/keys';
import useCachedQuery from '../../hooks/useCachedQuery';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import SyncBadge from '../../components/common/SyncBadge';
import InlineError from '../../components/common/InlineError';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { formatDate } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Assignment } from '../../types/models';

type Props = NativeStackScreenProps<any, any>;

export default function AssignmentDetailScreen({ route, navigation }: Props) {
  const { id } = route.params as { id: string | number };
  const fetcher = useCallback(() => assignmentService.getById(id), [id]);
  const {
    data: queriedAssignment,
    loading,
    error,
    refresh,
    lastUpdated,
  } = useCachedQuery<Assignment>(detailKey('assignment', id), fetcher);

  const { assignments, isPending } = useAppData();
  const assignment =
    queriedAssignment || (assignments || []).find(a => String(a.id) === String(id));

  useEffect(() => {
    if (assignment?.title) {
      navigation.setOptions({ title: assignment.title });
    }
  }, [assignment?.title, navigation]);

  if (loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refresh(true)} />
      </ScreenContainer>
    );
  }

  if (!assignment) {
    return (
      <ScreenContainer>
        <ErrorView
          message="Không tìm thấy bài tập."
          onRetry={() => refresh(true)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>{assignment.title}</Text>
      <SyncBadge pending={isPending('assignments', id)} />
      <InlineError message={error?.message} onRetry={() => refresh(true)} />
      <LastUpdatedText timestamp={lastUpdated} />

      <InfoRow
        label="Môn học"
        value={assignment.course?.name || 'Chưa xác định'}
      />
      <InfoRow label="Hạn nộp" value={formatDate(assignment.dueDate)} />
      <InfoRow
        label="Trạng thái"
        value={assignment.status === 'done' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
      />
      <InfoRow
        label="Mô tả chi tiết"
        value={assignment.description || 'Không có mô tả'}
      />
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

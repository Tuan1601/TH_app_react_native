import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { sessionService } from '../../api/sessionService';
import { detailKey } from '../../storage/keys';
import useCachedQuery from '../../hooks/useCachedQuery';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InlineError from '../../components/common/InlineError';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import InfoRow from '../../components/profile/InfoRow';
import { dayName } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Session } from '../../types/models';

type Props = NativeStackScreenProps<any, any>;

export default function SessionDetailScreen({ route, navigation }: Props) {
  const { id } = route.params as { id: string | number };
  const fetcher = useCallback(() => sessionService.getById(id), [id]);
  const {
    data: queriedSession,
    loading,
    error,
    refresh,
    lastUpdated,
  } = useCachedQuery<Session>(detailKey('session', id), fetcher);

  const { sessions } = useAppData();
  const session =
    queriedSession || (sessions || []).find(s => String(s.id) === String(id));

  useEffect(() => {
    if (session?.course?.name) {
      navigation.setOptions({ title: session.course.name });
    }
  }, [session?.course?.name, navigation]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refresh(true)} />
      </ScreenContainer>
    );
  }

  if (!session) {
    return (
      <ScreenContainer>
        <ErrorView
          message="Không tìm thấy thông tin buổi học."
          onRetry={() => refresh(true)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>{session.course?.name || 'Môn học'}</Text>
      <InlineError message={error?.message} onRetry={() => refresh(true)} />
      <LastUpdatedText timestamp={lastUpdated} />

      <InfoRow label="Thứ" value={dayName(session.dayOfWeek)} />
      <InfoRow
        label="Thời gian"
        value={`${session.startTime} – ${session.endTime}`}
      />
      <InfoRow label="Phòng học" value={session.room} />
      <InfoRow
        label="Giảng viên"
        value={session.course?.lecturer || 'Chưa cập nhật'}
      />
      <InfoRow label="Ghi chú" value={session.note || 'Không có ghi chú'} />
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

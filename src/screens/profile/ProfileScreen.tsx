import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type ProfileStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import AppButton from '../../components/common/AppButton';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SyncBadge from '../../components/common/SyncBadge';
import InlineError from '../../components/common/InlineError';
import GpaSummary from '../../components/grade/GpaSummary';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = NativeStackScreenProps<ProfileStackParamList, typeof ROUTES.PROFILE>;

export default function ProfileScreen({ navigation }: Props) {
  const { student, grades, courses, status, refresh, isPending } = useAppData();

  if (!student && status.student.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!student && status.student.error) {
    return (
      <ScreenContainer>
        <ErrorView
          message={status.student.error.message}
          onRetry={() => refresh('student')}
        />
      </ScreenContainer>
    );
  }

  const { gpa, totalCredits } = calcGpa(grades || [], courses || []);

  return (
    <ScreenContainer scroll>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{student?.fullName || 'Sinh viên'}</Text>
        <SyncBadge pending={isPending('student')} />
      </View>
      <InlineError
        message={status.student.error?.message}
        onRetry={() => refresh('student')}
      />

      <GpaSummary gpa={gpa} totalCredits={totalCredits} />

      <InfoRow label="Mã sinh viên" value={student?.studentCode} />
      <InfoRow label="Lớp sinh hoạt" value={student?.className} />
      <InfoRow label="Chuyên ngành" value={student?.major} />
      <InfoRow label="Email" value={student?.email} />
      <InfoRow label="Số điện thoại" value={student?.phone} />
      <LastUpdatedText timestamp={status.student.lastUpdated} />

      <AppButton
        title="Chỉnh sửa thông tin"
        onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
        style={styles.editButton}
      />
      <AppButton
        title="Kết quả học tập"
        variant="outline"
        onPress={() => navigation.navigate(ROUTES.GRADES)}
        style={styles.gradeButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h1,
    color: colors.text,
  },
  editButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  gradeButton: {
    marginBottom: spacing.xl,
  },
});

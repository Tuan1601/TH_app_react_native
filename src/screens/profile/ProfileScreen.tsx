import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import spacing, { radius, shadows, sizes } from '../../theme/spacing';
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

  const avatarInitial = (student?.fullName || 'S')
    .trim()
    .split(' ')
    .slice(-1)[0]
    .charAt(0)
    .toUpperCase();

  return (
    <ScreenContainer scroll>
      {/* Thẻ Header cá nhân */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.headerEditBtn}
          onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          activeOpacity={0.7}
          accessibilityLabel="Chỉnh sửa thông tin">
          <MaterialCommunityIcons name="account-edit-outline" size={18} color={colors.primary} />
          <Text style={styles.headerEditBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{avatarInitial}</Text>
        </View>

        <Text style={styles.name}>{student?.fullName || 'Sinh viên'}</Text>
        <Text style={styles.studentId}>{student?.studentCode}</Text>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{student?.className || 'Lớp'}</Text>
          </View>
          <View style={[styles.tag, styles.tagMajor]}>
            <Text style={[styles.tagText, styles.tagMajorText]} numberOfLines={1}>
              {student?.major || 'Ngành'}
            </Text>
          </View>
        </View>

        <SyncBadge pending={isPending('student')} />
      </View>

      <InlineError
        message={status.student.error?.message}
        onRetry={() => refresh('student')}
      />

      {/* Tóm tắt GPA */}
      <GpaSummary gpa={gpa} totalCredits={totalCredits} />

      {/* Thông tin liên hệ & sinh viên */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
        <InfoRow label="Email" value={student?.email} />
        <InfoRow label="Số điện thoại" value={student?.phone} />
        <InfoRow label="Lớp sinh hoạt" value={student?.className} />
        <InfoRow label="Chuyên ngành" value={student?.major} />
      </View>

      <LastUpdatedText timestamp={status.student.lastUpdated} />

      {/* Các nút hành động */}
      <View style={styles.actionButtons}>
        <AppButton
          title="Chỉnh sửa thông tin"
          onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          style={styles.editButton}
        />
        <AppButton
          title="Xem kết quả học tập"
          variant="outline"
          onPress={() => navigation.navigate(ROUTES.GRADES)}
          style={styles.gradeButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  headerEditBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  headerEditBtnText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 12,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.primary,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  studentId: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  tagText: {
    ...typography.small,
    color: colors.textMuted,
    fontSize: 11,
  },
  tagMajor: {
    backgroundColor: colors.primaryLight,
    maxWidth: 200,
  },
  tagMajorText: {
    color: colors.primary,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  actionButtons: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  editButton: {
    marginBottom: spacing.sm,
  },
  gradeButton: {
    marginBottom: spacing.md,
  },
});

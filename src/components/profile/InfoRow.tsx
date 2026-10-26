import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import spacing, { radius } from '../../theme/spacing';
import typography from '../../theme/typography';

const ICON_MAP: Record<string, string> = {
  'Mã sinh viên': 'card-account-details-outline',
  'Lớp sinh hoạt': 'google-classroom',
  'Chuyên ngành': 'school-outline',
  'Email': 'email-outline',
  'Số điện thoại': 'phone-outline',
  'Môn học': 'book-open-variant',
  'Hạn nộp': 'calendar-clock',
  'Trạng thái': 'checkbox-marked-circle-outline',
  'Học kỳ': 'calendar-range',
  'Phòng học': 'door-open',
  'Giảng viên': 'account-tie-outline',
  'Thứ': 'calendar-week',
  'Thời gian': 'clock-time-four-outline',
};

export interface InfoRowProps {
  label: string;
  value?: string | number | null;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  const icon = ICON_MAP[label] || 'information-outline';

  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value ?? '—'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: 2,
  },
});

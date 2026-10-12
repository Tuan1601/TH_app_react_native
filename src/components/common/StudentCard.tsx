import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Badge, { getBadgeType } from './Badge';
import AppIcon from './AppIcon';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../../theme';

interface Student {
  id: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: 'Nam' | 'Nữ';
  email: string;
  soDienThoai: string;
  lop: string;
  khoa: string;
  gpa: number;
  xepLoai: string;
}

interface StudentCardProps {
  student: Student;
  onPress: (student: Student) => void;
}

const getAvatarColor = (xepLoai: string): string => {
  switch (xepLoai) {
    case 'Giỏi': return COLORS.gioi;
    case 'Khá': return COLORS.kha;
    case 'Trung bình': return COLORS.trungBinh;
    case 'Yếu': return COLORS.yeu;
    default: return COLORS.primary;
  }
};

const StudentCard: React.FC<StudentCardProps> = ({ student, onPress }) => {
  const initials = student.hoTen
    .split(' ')
    .map((w: string) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const color = getAvatarColor(student.xepLoai);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(student)}
      activeOpacity={0.72}
    >
      {/* Colored left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.initials}>{initials}</Text>
      </View>

      {/* Main info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{student.hoTen}</Text>
        <View style={styles.metaRow}>
          <AppIcon name="card-account-details-outline" size={12} color={COLORS.textMuted} style={styles.metaIcon} />
          <Text style={styles.metaMaSV}>{student.maSV}</Text>
          <View style={styles.dot} />
          <AppIcon name="school-outline" size={12} color={COLORS.textMuted} style={styles.metaIcon} />
          <Text style={styles.metaText}>{student.lop}</Text>
        </View>
        <View style={styles.gpaRow}>
          <AppIcon name="chart-line" size={12} color={color} style={styles.metaIcon} />
          <Text style={[styles.gpaText, { color }]}>GPA: {student.gpa.toFixed(1)}</Text>
        </View>
      </View>

      {/* Badge */}
      <View style={styles.right}>
        <Badge
          label={student.xepLoai}
          type={getBadgeType(student.xepLoai)}
          size="sm"
        />
        <AppIcon name="chevron-right" size={18} color={COLORS.textMuted} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
    marginRight: SPACING.md,
    marginVertical: SPACING.md,
  },
  initials: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    paddingVertical: SPACING.md,
  },
  name: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  metaIcon: {
    marginRight: 3,
  },
  metaMaSV: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginRight: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textMuted,
    marginRight: 4,
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  gpaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpaText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  right: {
    alignItems: 'center',
    paddingRight: SPACING.sm,
    gap: 4,
  },
  chevron: {
    marginTop: 2,
  },
});

export default StudentCard;

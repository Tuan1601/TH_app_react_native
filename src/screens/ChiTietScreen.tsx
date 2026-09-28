import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AppIcon from '../components/common/AppIcon';;
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Student, RootStackParamList } from '../types';
import Badge, { getBadgeType } from '../components/common/Badge';
import { InfoRow, SectionCard } from '../components/common/InfoRow';
import Button from '../components/common/Button';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChiTiet'>;
  route: RouteProp<RootStackParamList, 'ChiTiet'>;
  onDelete: (id: string) => void;
}

const getAccentColor = (xepLoai: string): string => {
  switch (xepLoai) {
    case 'Giỏi': return COLORS.gioi;
    case 'Khá': return COLORS.kha;
    case 'Trung bình': return COLORS.trungBinh;
    case 'Yếu': return COLORS.yeu;
    default: return COLORS.primary;
  }
};

const ChiTietScreen: React.FC<Props> = ({ navigation, route, onDelete }) => {
  const { student } = route.params;
  const accentColor = getAccentColor(student.xepLoai);

  const initials = student.hoTen
    .split(' ')
    .map((w: string) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa sinh viên "${student.hoTen}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            onDelete(student.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const gpaPercent = Math.min((student.gpa / 10) * 100, 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={accentColor} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: accentColor }]}>
          {/* Decor circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Avatar */}
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{student.hoTen}</Text>

          {/* ID badge */}
          <View style={styles.idBadge}>
            <AppIcon name="card-account-details-outline" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.idText}>{student.maSV}</Text>
          </View>

          <View style={styles.headerBadgeRow}>
            <Badge
              label={student.xepLoai}
              type={getBadgeType(student.xepLoai)}
              size="md"
              style={styles.classificationBadge}
            />
          </View>
        </View>

        {/* GPA Card - overlapping header */}
        <View style={styles.gpaCard}>
          <View style={styles.gpaLeft}>
            <Text style={styles.gpaCaption}>ĐIỂM GPA</Text>
            <View style={styles.gpaValueRow}>
              <Text style={[styles.gpaValue, { color: accentColor }]}>
                {student.gpa.toFixed(1)}
              </Text>
              <Text style={styles.gpaMax}>/10</Text>
            </View>
            <Badge
              label={student.xepLoai}
              type={getBadgeType(student.xepLoai)}
              size="sm"
            />
          </View>
          <View style={styles.gpaDivider} />
          <View style={styles.gpaRight}>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Tiến độ học tập</Text>
                <Text style={[styles.progressPct, { color: accentColor }]}>{gpaPercent.toFixed(0)}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${gpaPercent}%` as any, backgroundColor: accentColor },
                  ]}
                />
              </View>
            </View>
            <View style={styles.gpaMetaGrid}>
              <View style={styles.gpaMetaItem}>
                <AppIcon name="school-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.gpaMetaLabel}>Lớp</Text>
                <Text style={styles.gpaMetaVal}>{student.lop}</Text>
              </View>
              <View style={styles.gpaMetaItem}>
                <AppIcon name="domain" size={14} color={COLORS.textMuted} />
                <Text style={styles.gpaMetaLabel}>Khoa</Text>
                <Text style={styles.gpaMetaVal} numberOfLines={1}>{student.khoa}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Thông tin cá nhân */}
        <SectionCard title="Thông tin cá nhân" icon="account-outline">
          <InfoRow
            label="Họ và tên"
            value={student.hoTen}
            icon="account"
            accentColor={accentColor}
          />
          <InfoRow
            label="Ngày sinh"
            value={student.ngaySinh}
            icon="calendar-today"
            accentColor={accentColor}
          />
          <InfoRow
            label="Giới tính"
            value={student.gioiTinh}
            icon="gender-male-female"
            accentColor={accentColor}
          />
          <InfoRow
            label="Email"
            value={student.email}
            icon="email-outline"
            accentColor={accentColor}
          />
          <InfoRow
            label="Số điện thoại"
            value={student.soDienThoai}
            icon="phone-outline"
            accentColor={accentColor}
            isLast
          />
        </SectionCard>

        {/* Thông tin học vấn */}
        <SectionCard title="Thông tin học vấn" icon="school-outline">
          <InfoRow
            label="Mã sinh viên"
            value={student.maSV}
            icon="identifier"
            accentColor={accentColor}
          />
          <InfoRow
            label="Lớp"
            value={student.lop}
            icon="account-group-outline"
            accentColor={accentColor}
          />
          <InfoRow
            label="Khoa"
            value={student.khoa}
            icon="domain"
            accentColor={accentColor}
          />
          <InfoRow
            label="GPA"
            value={`${student.gpa.toFixed(1)} / 10`}
            icon="chart-line"
            accentColor={accentColor}
            isLast
          />
        </SectionCard>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Xóa sinh viên"
            onPress={handleDelete}
            variant="danger"
            size="lg"
            fullWidth
          />
          <Button
            title="Chỉnh sửa sinh viên"
            onPress={() => navigation.navigate('ChinhSua', { student })}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Profile header
  profileHeader: {
    paddingTop: SPACING.xl,
    paddingBottom: 56,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  decorCircle2: {
    position: 'absolute',
    left: -30,
    bottom: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  avatarRing: {
    padding: 4,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  profileName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xxl,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  idText: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerBadgeRow: {
    alignItems: 'center',
  },
  classificationBadge: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },

  // GPA Card
  gpaCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: -28,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
  },
  gpaLeft: {
    gap: SPACING.sm,
    minWidth: 90,
  },
  gpaCaption: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  gpaValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gpaValue: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
  },
  gpaMax: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textMuted,
    fontWeight: '400',
    marginLeft: 2,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  gpaDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.xl,
    alignSelf: 'stretch',
  },
  gpaRight: {
    flex: 1,
    gap: SPACING.md,
  },
  progressSection: {},
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  progressPct: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  progressTrack: {
    height: 7,
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  gpaMetaGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  gpaMetaItem: {
    flex: 1,
    gap: 2,
  },
  gpaMetaLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  gpaMetaVal: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '700',
  },

  // Actions
  actionsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
});

export default ChiTietScreen;

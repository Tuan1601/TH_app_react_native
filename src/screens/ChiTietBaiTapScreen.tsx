import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppIcon from '../components/common/AppIcon';
import {
  formatHanNop,
  getLoaiBaiTapLabel,
  getTrangThaiLabel,
} from '../data/appData';
import { RootStackParamList, TrangThaiBaiTap } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChiTietBaiTap'>;

const TRANG_THAI_OPTIONS: { value: TrangThaiBaiTap; label: string; icon: string; color: string }[] = [
  { value: 'chua_lam', label: 'Chưa làm', icon: 'circle-outline', color: COLORS.danger },
  { value: 'dang_lam', label: 'Đang làm', icon: 'progress-pencil', color: COLORS.warning },
  { value: 'da_nop', label: 'Đã nộp', icon: 'check-circle', color: COLORS.success },
];

const ChiTietBaiTapScreen: React.FC<Props> = ({ route, navigation }) => {
  const { baiTap } = route.params;
  const [trangThai, setTrangThai] = useState<TrangThaiBaiTap>(baiTap.trangThai);

  const currentOption = TRANG_THAI_OPTIONS.find(o => o.value === trangThai)!;

  const isOverdue = trangThai !== 'da_nop' && new Date(baiTap.hanNop) < new Date();
  const daysLeft = Math.ceil(
    (new Date(baiTap.hanNop).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  const handleChangeStatus = (newStatus: TrangThaiBaiTap) => {
    if (trangThai === 'da_nop') {
      Alert.alert('Đã nộp', 'Bài tập đã được nộp, không thể thay đổi.');
      return;
    }
    Alert.alert(
      'Cập nhật trạng thái',
      `Bạn có chắc muốn chuyển sang "${getTrangThaiLabel(newStatus)}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            setTrangThai(newStatus);
            if (newStatus === 'da_nop') {
              Alert.alert('🎉 Đã nộp!', 'Bài tập đã được đánh dấu là nộp thành công.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: baiTap.mauSac }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <AppIcon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.heroIconBox}>
          <AppIcon name={trangThai === 'da_nop' ? 'check-circle' : 'file-document-edit-outline'} size={36} color="#fff" />
        </View>

        <View style={styles.heroBadgeRow}>
          <View style={[styles.heroBadge, { backgroundColor: currentOption.color }]}>
            <AppIcon name={currentOption.icon} size={13} color="#fff" />
            <Text style={styles.heroBadgeText}>{currentOption.label}</Text>
          </View>
          <View style={styles.heroBadgeOutline}>
            <Text style={styles.heroBadgeOutlineText}>{getLoaiBaiTapLabel(baiTap.loai)}</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{baiTap.tieuDe}</Text>
        <Text style={styles.heroMon}>{baiTap.tenMon}</Text>

        {/* Deadline display */}
        {isOverdue ? (
          <View style={styles.overdueBox}>
            <AppIcon name="alert" size={14} color={COLORS.danger} />
            <Text style={styles.overdueText}>Đã quá hạn nộp!</Text>
          </View>
        ) : trangThai !== 'da_nop' ? (
          <View style={styles.deadlineBox}>
            <AppIcon name="clock-alert-outline" size={14} color="#fff" />
            <Text style={styles.deadlineText}>
              {daysLeft === 0 ? 'Hạn nộp hôm nay!' : `Còn ${daysLeft} ngày nữa`}
            </Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cập nhật trạng thái */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cập nhật tiến độ</Text>
          <View style={styles.statusRow}>
            {TRANG_THAI_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.statusOption,
                  trangThai === opt.value && {
                    backgroundColor: opt.color,
                    borderColor: opt.color,
                  },
                  trangThai !== opt.value && { borderColor: COLORS.border },
                ]}
                onPress={() => handleChangeStatus(opt.value)}
                activeOpacity={0.8}
              >
                <AppIcon
                  name={opt.icon}
                  size={20}
                  color={trangThai === opt.value ? '#fff' : opt.color}
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    trangThai === opt.value && { color: '#fff' },
                    trangThai !== opt.value && { color: opt.color },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thông tin hạn nộp */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin bài tập</Text>
          <View style={styles.card}>
            <DetailRow icon="book-open-variant" label="Môn học" value={baiTap.tenMon} color={baiTap.mauSac} />
            <View style={styles.divider} />
            <DetailRow icon="calendar-clock" label="Hạn nộp" value={formatHanNop(baiTap.hanNop)} color={isOverdue ? COLORS.danger : undefined} />
            <View style={styles.divider} />
            <DetailRow
              icon="flag-outline"
              label="Ưu tiên"
              value={baiTap.uuTien === 'cao' ? '🔴 Cao' : baiTap.uuTien === 'trung_binh' ? '🟡 Trung bình' : '🟢 Thấp'}
            />
            {baiTap.diem !== undefined && (
              <>
                <View style={styles.divider} />
                <DetailRow icon="star-outline" label="Điểm số" value={`${baiTap.diem}/10`} color={COLORS.warning} />
              </>
            )}
          </View>
        </View>

        {/* Mô tả chi tiết */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <View style={styles.card}>
            <Text style={styles.moTaText}>{baiTap.moTa}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, color }) => (
  <View style={styles.detailRow}>
    <AppIcon name={icon} size={18} color={color || COLORS.textSecondary} style={styles.detailIcon} />
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    paddingTop: 50,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: SPACING.xxxl,
    borderBottomRightRadius: SPACING.xxxl,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: SPACING.xl,
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconBox: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroBadgeRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  heroBadgeText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: '700' },
  heroBadgeOutline: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroBadgeOutlineText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: '600' },
  heroTitle: {
    color: '#fff',
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: SPACING.sm,
  },
  heroMon: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm, marginBottom: SPACING.md },
  overdueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  overdueText: { color: COLORS.danger, fontWeight: '700', fontSize: FONTS.sizes.sm },
  deadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  deadlineText: { color: '#fff', fontWeight: '600', fontSize: FONTS.sizes.sm },
  content: { padding: SPACING.xl, paddingBottom: 40 },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  statusRow: { flexDirection: 'row', gap: SPACING.sm },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    gap: 6,
    ...SHADOWS.sm,
  },
  statusOptionText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs + 2 },
  detailIcon: { marginRight: SPACING.md },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 2 },
  detailValue: { fontSize: FONTS.sizes.base, fontWeight: '600', color: COLORS.text },
  moTaText: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, lineHeight: 22 },
});

export default ChiTietBaiTapScreen;

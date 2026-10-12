import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AppIcon from '../components/common/AppIcon';
import { SINH_VIEN, MON_HOC_LIST } from '../data/appData';
import { SinhVien, RootStackParamList, TabParamList } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'CaNhan'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, color }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIconBox, { backgroundColor: (color || COLORS.primary) + '18' }]}>
      <AppIcon name={icon} size={18} color={color || COLORS.primary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const CaNhanScreen: React.FC<Props> = ({ navigation }) => {
  const [sinhVien, setSinhVien] = useState<SinhVien>(SINH_VIEN);
  const [isEditing, setIsEditing] = useState(false);
  const [editHoTen, setEditHoTen] = useState(sinhVien.hoTen);
  const [editEmail, setEditEmail] = useState(sinhVien.email);
  const [editSoDT, setEditSoDT] = useState(sinhVien.soDienThoai);

  const gpaColor = sinhVien.gpa >= 3.6
    ? COLORS.success
    : sinhVien.gpa >= 3.0
    ? COLORS.kha
    : sinhVien.gpa >= 2.0
    ? COLORS.warning
    : COLORS.danger;

  const xepLoai =
    sinhVien.gpa >= 3.6
      ? 'Xuất sắc'
      : sinhVien.gpa >= 3.2
      ? 'Giỏi'
      : sinhVien.gpa >= 2.5
      ? 'Khá'
      : sinhVien.gpa >= 2.0
      ? 'Trung bình'
      : 'Yếu';

  const tongTinChi = MON_HOC_LIST.every(m => m.soTinChi === null)
    ? '—'
    : MON_HOC_LIST.reduce((sum, m) => sum + (m.soTinChi ?? 0), 0);

  const handleSave = () => {
    if (!editHoTen.trim()) {
      Alert.alert('Lỗi', 'Họ tên không được để trống');
      return;
    }
    if (!editEmail.includes('@')) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    setSinhVien(prev => ({
      ...prev,
      hoTen: editHoTen.trim(),
      email: editEmail.trim(),
      soDienThoai: editSoDT.trim(),
    }));
    setIsEditing(false);
    Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
  };

  const handleCancel = () => {
    setEditHoTen(sinhVien.hoTen);
    setEditEmail(sinhVien.email);
    setEditSoDT(sinhVien.soDienThoai);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {sinhVien.hoTen.split(' ').slice(-1)[0].charAt(0)}
              </Text>
            </View>
            <View style={[styles.gpaRing, { borderColor: gpaColor }]}>
              <Text style={[styles.gpaValue, { color: gpaColor }]}>
                {sinhVien.gpa.toFixed(2)}
              </Text>
              <Text style={styles.gpaLabel}>GPA</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{sinhVien.hoTen}</Text>
          <Text style={styles.heroMaSV}>{sinhVien.maSV}</Text>
          <View style={styles.heroBadgeRow}>
            <View style={[styles.heroBadge, { backgroundColor: gpaColor }]}>
              <AppIcon name="trophy-outline" size={13} color="#fff" />
              <Text style={styles.heroBadgeText}>{xepLoai}</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: COLORS.secondary }]}>
              <AppIcon name="school-outline" size={13} color="#fff" />
              <Text style={styles.heroBadgeText}>{sinhVien.lop}</Text>
            </View>
          </View>

          {/* Edit button */}
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <AppIcon name="pencil-outline" size={16} color="#fff" />
              <Text style={styles.editBtnText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <AppIcon name="check" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Thống kê học tập */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê học tập</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderTopColor: COLORS.primary }]}>
              <Text style={[styles.statNum, { color: COLORS.primary }]}>{MON_HOC_LIST.length}</Text>
              <Text style={styles.statName}>Môn học</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: COLORS.warning }]}>
              <Text style={[styles.statNum, { color: COLORS.warning }]}>{tongTinChi}</Text>
              <Text style={styles.statName}>Tín chỉ</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: gpaColor }]}>
              <Text style={[styles.statNum, { color: gpaColor }]}>{sinhVien.gpa.toFixed(2)}</Text>
              <Text style={styles.statName}>GPA</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: COLORS.success }]}>
              <Text style={[styles.statNum, { color: COLORS.success }]}>{xepLoai}</Text>
              <Text style={styles.statName}>Xếp loại</Text>
            </View>
          </View>
        </View>

        {/* Thông tin cá nhân */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.card}>
            {isEditing ? (
              <View>
                {/* Editable fields */}
                <View style={styles.editField}>
                  <Text style={styles.editLabel}>Họ và tên *</Text>
                  <View style={styles.editInputWrapper}>
                    <AppIcon name="account-outline" size={18} color={COLORS.textSecondary} />
                    <TextInput
                      style={styles.editInput}
                      value={editHoTen}
                      onChangeText={setEditHoTen}
                      placeholder="Nhập họ và tên"
                      placeholderTextColor={COLORS.textMuted}
                    />
                  </View>
                </View>
                <View style={styles.editField}>
                  <Text style={styles.editLabel}>Email *</Text>
                  <View style={styles.editInputWrapper}>
                    <AppIcon name="email-outline" size={18} color={COLORS.textSecondary} />
                    <TextInput
                      style={styles.editInput}
                      value={editEmail}
                      onChangeText={setEditEmail}
                      placeholder="Nhập email"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View style={styles.editField}>
                  <Text style={styles.editLabel}>Số điện thoại</Text>
                  <View style={styles.editInputWrapper}>
                    <AppIcon name="phone-outline" size={18} color={COLORS.textSecondary} />
                    <TextInput
                      style={styles.editInput}
                      value={editSoDT}
                      onChangeText={setEditSoDT}
                      placeholder="Nhập số điện thoại"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
                <Text style={styles.editNote}>
                  * Các trường không thể chỉnh sửa: Mã SV, Lớp, Ngành, Khóa học
                </Text>
              </View>
            ) : (
              <View>
                <InfoRow icon="badge-account-outline" label="Mã sinh viên" value={sinhVien.maSV} />
                <View style={styles.divider} />
                <InfoRow icon="account-outline" label="Họ và tên" value={sinhVien.hoTen} />
                <View style={styles.divider} />
                <InfoRow
                  icon="gender-male-female"
                  label="Giới tính"
                  value={sinhVien.gioiTinh}
                />
                <View style={styles.divider} />
                <InfoRow icon="cake-variant-outline" label="Ngày sinh" value={sinhVien.ngaySinh} />
                <View style={styles.divider} />
                <InfoRow icon="email-outline" label="Email" value={sinhVien.email} color={COLORS.secondary} />
                <View style={styles.divider} />
                <InfoRow icon="phone-outline" label="Số điện thoại" value={sinhVien.soDienThoai} color={COLORS.success} />
              </View>
            )}
          </View>
        </View>

        {/* Thông tin học vụ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin học vụ</Text>
          <View style={styles.card}>
            <InfoRow icon="account-group-outline" label="Lớp" value={sinhVien.lop} />
            <View style={styles.divider} />
            <InfoRow icon="school-outline" label="Ngành học" value={sinhVien.nganh} color={COLORS.primary} />
            <View style={styles.divider} />
            <InfoRow icon="calendar-range" label="Khóa học" value={sinhVien.khoaHoc} />
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const COLORS_extra = {
  kha: '#3B82F6',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  // Hero
  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: SPACING.xxxl,
    borderBottomRightRadius: SPACING.xxxl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: { color: '#fff', fontSize: FONTS.sizes.xxxl, fontWeight: '800' },
  gpaRing: {
    position: 'absolute',
    bottom: -8,
    right: -12,
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    borderWidth: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpaValue: { fontSize: FONTS.sizes.xs, fontWeight: '800' },
  gpaLabel: { fontSize: 8, color: COLORS.textMuted },
  heroName: { color: '#fff', fontSize: FONTS.sizes.xl, fontWeight: '800', textAlign: 'center' },
  heroMaSV: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm, marginTop: 2, marginBottom: SPACING.sm },
  heroBadgeRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  heroBadgeText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: '700' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editBtnText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: '600' },
  editActionRow: { flexDirection: 'row', gap: SPACING.sm },
  cancelBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  cancelBtnText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: '600' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
  },
  saveBtnText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: '700' },
  // Section
  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  // Info Row
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs + 2 },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: FONTS.sizes.base, fontWeight: '600', color: COLORS.text },
  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  statCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderTopWidth: 3,
    ...SHADOWS.sm,
  },
  statNum: { fontSize: FONTS.sizes.xl, fontWeight: '800', marginBottom: 2 },
  statName: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  // Edit fields
  editField: { marginBottom: SPACING.md },
  editLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  editInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    minHeight: 48,
  },
  editInput: { flex: 1, fontSize: FONTS.sizes.base, color: COLORS.text },
  editNote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
});

export default CaNhanScreen;

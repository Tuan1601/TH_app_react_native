import React, { useState } from 'react';
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
import { Student, RootStackParamList } from '../types';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { getXepLoai } from '../data/studentData';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ThemSinhVien'>;
  onAdd: (student: Student) => void;
  existingIds: string[];
}

interface FormErrors {
  maSV?: string;
  hoTen?: string;
  ngaySinh?: string;
  email?: string;
  soDienThoai?: string;
  lop?: string;
  khoa?: string;
  gpa?: string;
}

const GIOI_TINH_OPTIONS: ('Nam' | 'Nữ')[] = ['Nam', 'Nữ'];

const getXepLoaiColor = (gpa: number): string => {
  if (gpa >= 8.5) return COLORS.gioi;
  if (gpa >= 7.0) return COLORS.kha;
  if (gpa >= 5.0) return COLORS.trungBinh;
  return COLORS.yeu;
};

const ThemSinhVienScreen: React.FC<Props> = ({ navigation, onAdd, existingIds }) => {
  const [maSV, setMaSV] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [gioiTinh, setGioiTinh] = useState<'Nam' | 'Nữ'>('Nam');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [lop, setLop] = useState('');
  const [khoa, setKhoa] = useState('');
  const [gpa, setGpa] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!maSV.trim()) newErrors.maSV = 'Vui lòng nhập mã sinh viên';
    else if (existingIds.includes(maSV.trim().toUpperCase())) newErrors.maSV = 'Mã sinh viên đã tồn tại';
    if (!hoTen.trim()) newErrors.hoTen = 'Vui lòng nhập họ và tên';
    else if (hoTen.trim().length < 3) newErrors.hoTen = 'Họ tên phải có ít nhất 3 ký tự';
    if (!ngaySinh.trim()) newErrors.ngaySinh = 'Vui lòng nhập ngày sinh';
    else if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(ngaySinh.trim())) newErrors.ngaySinh = 'Định dạng ngày: DD/MM/YYYY';
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email không hợp lệ';
    if (!soDienThoai.trim()) newErrors.soDienThoai = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)\d{9,10}$/.test(soDienThoai.replace(/\s/g, ''))) newErrors.soDienThoai = 'Số điện thoại không hợp lệ';
    if (!lop.trim()) newErrors.lop = 'Vui lòng nhập lớp';
    if (!khoa.trim()) newErrors.khoa = 'Vui lòng nhập khoa';
    const gpaNum = parseFloat(gpa);
    if (!gpa.trim()) newErrors.gpa = 'Vui lòng nhập GPA';
    else if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) newErrors.gpa = 'GPA phải từ 0 đến 10';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Lỗi dữ liệu', 'Vui lòng kiểm tra lại thông tin nhập vào.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const gpaNum = parseFloat(gpa);
      const newStudent: Student = {
        id: Date.now().toString(),
        maSV: maSV.trim().toUpperCase(),
        hoTen: hoTen.trim(),
        ngaySinh: ngaySinh.trim(),
        gioiTinh,
        email: email.trim().toLowerCase(),
        soDienThoai: soDienThoai.trim(),
        lop: lop.trim().toUpperCase(),
        khoa: khoa.trim(),
        gpa: gpaNum,
        xepLoai: getXepLoai(gpaNum),
      };
      onAdd(newStudent);
      setLoading(false);
      Alert.alert('Thành công', `Đã thêm sinh viên "${newStudent.hoTen}" vào danh sách.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 600);
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const previewGpa = parseFloat(gpa);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress indicator */}
        <View style={styles.progressHeader}>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.progressDotActive]}>
              <AppIcon name="school-outline" size={14} color="#fff" />
            </View>
            <Text style={[styles.progressLabel, styles.progressLabelActive]}>Học vấn</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.progressDotActive]}>
              <AppIcon name="account-outline" size={14} color="#fff" />
            </View>
            <Text style={[styles.progressLabel, styles.progressLabelActive]}>Cá nhân</Text>
          </View>
        </View>

        {/* GPA preview (shows when GPA is entered) */}
        {gpa && !isNaN(previewGpa) && (
          <View style={[styles.gpaBanner, { borderColor: getXepLoaiColor(previewGpa) + '50' }]}>
            <AppIcon name="chart-line" size={20} color={getXepLoaiColor(previewGpa)} />
            <Text style={styles.gpaBannerLabel}>Xếp loại dự kiến</Text>
            <Text style={[styles.gpaBannerValue, { color: getXepLoaiColor(previewGpa) }]}>
              {previewGpa.toFixed(1)}
            </Text>
            <View style={[styles.gpaBannerBadge, { backgroundColor: getXepLoaiColor(previewGpa) + '18', borderColor: getXepLoaiColor(previewGpa) + '40' }]}>
              <Text style={[styles.gpaBannerBadgeText, { color: getXepLoaiColor(previewGpa) }]}>
                {getXepLoai(previewGpa)}
              </Text>
            </View>
          </View>
        )}

        {/* Section: Học vấn */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon name="school-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Thông tin học vấn</Text>
          </View>
          <View style={styles.sectionDivider} />

          <InputField
            label="Mã sinh viên *"
            value={maSV}
            onChangeText={t => { setMaSV(t); clearError('maSV'); }}
            placeholder="VD: SV001"
            error={errors.maSV}
          />
          <InputField
            label="Lớp *"
            value={lop}
            onChangeText={t => { setLop(t); clearError('lop'); }}
            placeholder="VD: CNTT01"
            error={errors.lop}
          />
          <InputField
            label="Khoa *"
            value={khoa}
            onChangeText={t => { setKhoa(t); clearError('khoa'); }}
            placeholder="VD: Công nghệ thông tin"
            error={errors.khoa}
          />
          <InputField
            label="GPA (0 – 10) *"
            value={gpa}
            onChangeText={t => { setGpa(t); clearError('gpa'); }}
            placeholder="VD: 8.5"
            keyboardType="decimal-pad"
            error={errors.gpa}
          />
        </View>

        {/* Section: Cá nhân */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon name="account-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          </View>
          <View style={styles.sectionDivider} />

          <InputField
            label="Họ và tên *"
            value={hoTen}
            onChangeText={t => { setHoTen(t); clearError('hoTen'); }}
            placeholder="VD: Nguyễn Văn An"
            error={errors.hoTen}
          />
          <InputField
            label="Ngày sinh *"
            value={ngaySinh}
            onChangeText={t => { setNgaySinh(t); clearError('ngaySinh'); }}
            placeholder="DD/MM/YYYY"
            error={errors.ngaySinh}
          />

          {/* Giới tính */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>GIỚI TÍNH *</Text>
            <View style={styles.genderRow}>
              {GIOI_TINH_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.genderOpt, gioiTinh === opt && styles.genderOptActive]}
                  onPress={() => setGioiTinh(opt)}
                  activeOpacity={0.8}
                >
                  <Icon
                    name={opt === 'Nam' ? 'gender-male' : 'gender-female'}
                    size={20}
                    color={gioiTinh === opt ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text style={[styles.genderText, gioiTinh === opt && styles.genderTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InputField
            label="Email *"
            value={email}
            onChangeText={t => { setEmail(t); clearError('email'); }}
            placeholder="VD: example@student.edu.vn"
            keyboardType="email-address"
            error={errors.email}
          />
          <InputField
            label="Số điện thoại *"
            value={soDienThoai}
            onChangeText={t => { setSoDienThoai(t); clearError('soDienThoai'); }}
            placeholder="VD: 0912345678"
            keyboardType="phone-pad"
            error={errors.soDienThoai}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Thêm sinh viên"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          />
          <Button
            title="Hủy"
            onPress={() => navigation.goBack()}
            variant="outline"
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
    padding: SPACING.lg,
    paddingBottom: 40,
  },

  // Progress header
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  progressLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  progressLabelActive: {
    color: COLORS.primary,
  },
  progressLine: {
    height: 2,
    flex: 1,
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
    borderRadius: 1,
  },

  // GPA Banner
  gpaBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    ...SHADOWS.sm,
  },
  gpaBannerLabel: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  gpaBannerValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  gpaBannerBadge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
  },
  gpaBannerBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },

  // Section
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },

  // Field group
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  genderRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  genderOpt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
  },
  genderOptActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  genderText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  genderTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Buttons
  buttonsContainer: {
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
});

export default ThemSinhVienScreen;

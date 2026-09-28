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
import { RouteProp } from '@react-navigation/native';
import { Student, RootStackParamList } from '../types';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { getXepLoai } from '../data/studentData';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChinhSua'>;
  route: RouteProp<RootStackParamList, 'ChinhSua'>;
  onUpdate: (student: Student) => void;
}

interface FormErrors {
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

const getAccentColor = (xepLoai: string): string => {
  switch (xepLoai) {
    case 'Giỏi': return COLORS.gioi;
    case 'Khá': return COLORS.kha;
    case 'Trung bình': return COLORS.trungBinh;
    case 'Yếu': return COLORS.yeu;
    default: return COLORS.primary;
  }
};

const ChinhSuaScreen: React.FC<Props> = ({ navigation, route, onUpdate }) => {
  const { student } = route.params;
  const accentColor = getAccentColor(student.xepLoai);

  const [hoTen, setHoTen] = useState(student.hoTen);
  const [ngaySinh, setNgaySinh] = useState(student.ngaySinh);
  const [gioiTinh, setGioiTinh] = useState<'Nam' | 'Nữ'>(student.gioiTinh);
  const [email, setEmail] = useState(student.email);
  const [soDienThoai, setSoDienThoai] = useState(student.soDienThoai);
  const [lop, setLop] = useState(student.lop);
  const [khoa, setKhoa] = useState(student.khoa);
  const [gpa, setGpa] = useState(student.gpa.toString());
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
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

  const handleUpdate = () => {
    if (!validate()) {
      Alert.alert('Lỗi dữ liệu', 'Vui lòng kiểm tra lại thông tin nhập vào.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const gpaNum = parseFloat(gpa);
      const updatedStudent: Student = {
        ...student,
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
      onUpdate(updatedStudent);
      setLoading(false);
      Alert.alert('Cập nhật thành công', `Thông tin sinh viên "${updatedStudent.hoTen}" đã được cập nhật.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 600);
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const hasChanges =
    hoTen !== student.hoTen || ngaySinh !== student.ngaySinh ||
    gioiTinh !== student.gioiTinh || email !== student.email ||
    soDienThoai !== student.soDienThoai || lop !== student.lop ||
    khoa !== student.khoa || gpa !== student.gpa.toString();

  const initials = student.hoTen.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  const previewGpa = parseFloat(gpa);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Student identity card (readonly) */}
        <View style={[styles.idCard, { borderLeftColor: accentColor }]}>
          <View style={[styles.idAvatar, { backgroundColor: accentColor }]}>
            <Text style={styles.idInitials}>{initials}</Text>
          </View>
          <View style={styles.idInfo}>
            <Text style={styles.idName}>{student.hoTen}</Text>
            <View style={styles.idRow}>
              <AppIcon name="card-account-details-outline" size={13} color={COLORS.textMuted} />
              <Text style={styles.idMaSV}> {student.maSV}</Text>
              <Text style={styles.idSep}> · </Text>
              <AppIcon name="school-outline" size={13} color={COLORS.textMuted} />
              <Text style={styles.idMaSV}> {student.lop}</Text>
            </View>
          </View>
          <View style={[styles.idLock, { backgroundColor: accentColor + '18' }]}>
            <AppIcon name="lock-outline" size={16} color={accentColor} />
          </View>
        </View>

        {/* GPA preview banner */}
        {gpa && !isNaN(previewGpa) && (
          <View style={[styles.gpaBanner, { borderColor: getXepLoaiColor(previewGpa) + '40' }]}>
            <AppIcon name="analytics" size={20} color={getXepLoaiColor(previewGpa)} />
            <Text style={styles.gpaBannerLabel}>Điểm GPA hiện tại</Text>
            <Text style={[styles.gpaBannerValue, { color: getXepLoaiColor(previewGpa) }]}>
              {previewGpa.toFixed(1)}
            </Text>
            <Text style={[styles.gpaBannerXL, { color: getXepLoaiColor(previewGpa) }]}>
              {getXepLoai(previewGpa)}
            </Text>
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
                    size={18}
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
            title="Lưu thay đổi"
            onPress={handleUpdate}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!hasChanges}
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

  // ID Card
  idCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    borderLeftWidth: 4,
  },
  idAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  idInitials: {
    color: '#fff',
    fontSize: FONTS.sizes.base,
    fontWeight: '800',
  },
  idInfo: {
    flex: 1,
    gap: 4,
  },
  idName: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idMaSV: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  idSep: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  idLock: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  gpaBannerXL: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },

  // Sections
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

  // Field group (gender)
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

export default ChinhSuaScreen;

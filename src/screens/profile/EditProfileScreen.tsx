import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type ProfileStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import {
  validateProfile,
  type FormErrors,
  type ProfileFormValues,
} from '../../utils/validators';
import colors from '../../theme/colors';
import spacing, { radius, shadows } from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = NativeStackScreenProps<ProfileStackParamList, typeof ROUTES.EDIT_PROFILE>;

export default function EditProfileScreen({ navigation }: Props) {
  const { student, updateStudent } = useAppData();
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [errors, setErrors] = useState<FormErrors<ProfileFormValues>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFullName(prev => (prev ? prev : student.fullName || ''));
      setEmail(prev => (prev ? prev : student.email || ''));
      setPhone(prev => (prev ? prev : student.phone || ''));
    }
  }, [student]);

  const onSave = async () => {
    const cleanPhone = phone.trim().replace(/[\s.-]/g, '');
    const values: ProfileFormValues = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: cleanPhone,
    };
    const validationErrors = validateProfile(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const result = await updateStudent({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
      });
      if (result.queued) {
        Alert.alert(
          'Đã lưu ngoại tuyến',
          'Không thể kết nối máy chủ, thông tin đã được lưu trong máy và sẽ tự động đồng bộ khi có mạng.',
          [{ text: 'Đóng', onPress: () => navigation.goBack() }],
        );
      } else {
        navigation.goBack();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.';
      Alert.alert('Không thể lưu thông tin', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      {/* Thẻ thông tin cố định */}
      {student && (
        <View style={styles.fixedCard}>
          <View style={styles.fixedHeader}>
            <MaterialCommunityIcons name="shield-account" size={20} color={colors.primary} />
            <Text style={styles.fixedTitle}>Thông tin định danh</Text>
          </View>
          <View style={styles.fixedRow}>
            <Text style={styles.fixedLabel}>Mã sinh viên:</Text>
            <Text style={styles.fixedValue}>{student.studentCode}</Text>
          </View>
          <View style={styles.fixedRow}>
            <Text style={styles.fixedLabel}>Lớp sinh hoạt:</Text>
            <Text style={styles.fixedValue}>{student.className}</Text>
          </View>
          <View style={styles.fixedRow}>
            <Text style={styles.fixedLabel}>Chuyên ngành:</Text>
            <Text style={styles.fixedValue} numberOfLines={1}>
              {student.major}
            </Text>
          </View>
        </View>
      )}

      {/* Form thông tin cho phép sửa */}
      <FormInput
        label="Họ và tên *"
        value={fullName}
        onChangeText={val => {
          setFullName(val);
          if (errors.fullName) {
            setErrors(e => ({ ...e, fullName: undefined }));
          }
        }}
        error={errors.fullName}
        placeholder="Nhập họ và tên..."
      />
      <FormInput
        label="Email *"
        value={email}
        onChangeText={val => {
          setEmail(val);
          if (errors.email) {
            setErrors(e => ({ ...e, email: undefined }));
          }
        }}
        error={errors.email}
        keyboardType="email-address"
        placeholder="name@student.edu.vn"
      />
      <FormInput
        label="Số điện thoại *"
        value={phone}
        onChangeText={val => {
          setPhone(val);
          if (errors.phone) {
            setErrors(e => ({ ...e, phone: undefined }));
          }
        }}
        error={errors.phone}
        keyboardType="phone-pad"
        placeholder="0912345678"
      />

      <AppButton
        title="Lưu thay đổi"
        onPress={onSave}
        loading={saving}
        style={styles.saveButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fixedCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  fixedTitle: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 13,
  },
  fixedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  fixedLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  fixedValue: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
});

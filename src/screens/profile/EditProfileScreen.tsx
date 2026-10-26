import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
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
import spacing from '../../theme/spacing';

type Props = NativeStackScreenProps<ProfileStackParamList, typeof ROUTES.EDIT_PROFILE>;

export default function EditProfileScreen({ navigation }: Props) {
  const { student, updateStudent } = useAppData();
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [errors, setErrors] = useState<FormErrors<ProfileFormValues>>({});
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    const values: ProfileFormValues = {
      fullName,
      email,
      phone,
    };
    const validationErrors = validateProfile(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await updateStudent({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      navigation.goBack();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.';
      Alert.alert('Không thể lưu thông tin', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
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
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

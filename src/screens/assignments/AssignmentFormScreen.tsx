import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type AssignmentStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import {
  validateAssignment,
  type FormErrors,
  type AssignmentFormValues,
} from '../../utils/validators';
import { parseDisplayDate } from '../../utils/date';
import colors from '../../theme/colors';
import spacing, { radius, sizes } from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = NativeStackScreenProps<AssignmentStackParamList, typeof ROUTES.ASSIGNMENT_FORM>;

export default function AssignmentFormScreen({ navigation }: Props) {
  const { courses, createAssignment } = useAppData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [errors, setErrors] = useState<FormErrors<AssignmentFormValues>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courses && courses.length > 0 && !courseId) {
      setCourseId(String(courses[0].id));
    }
  }, [courses, courseId]);

  const onSave = async () => {
    const values: AssignmentFormValues = {
      title,
      dueDate,
      courseId,
    };
    const validationErrors = validateAssignment(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dateObj = parseDisplayDate(dueDate);
    if (!dateObj) {
      setErrors({ dueDate: 'Hạn nộp không hợp lệ.' });
      return;
    }

    setSaving(true);
    try {
      await createAssignment({
        courseId: Number(courseId) || courseId,
        title: title.trim(),
        description: description.trim(),
        dueDate: dateObj.toISOString(),
      });
      navigation.goBack();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu bài tập.';
      Alert.alert('Không thể lưu', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <FormInput
        label="Tiêu đề bài tập *"
        value={title}
        onChangeText={val => {
          setTitle(val);
          if (errors.title) {
            setErrors(e => ({ ...e, title: undefined }));
          }
        }}
        error={errors.title}
        placeholder="Nhập tiêu đề..."
      />

      <FormInput
        label="Hạn nộp (dd/MM/yyyy) *"
        value={dueDate}
        onChangeText={val => {
          setDueDate(val);
          if (errors.dueDate) {
            setErrors(e => ({ ...e, dueDate: undefined }));
          }
        }}
        error={errors.dueDate}
        placeholder="VD: 09/11/2026"
      />

      <Text style={styles.label}>Môn học *</Text>
      {errors.courseId ? (
        <Text style={styles.errorText}>{errors.courseId}</Text>
      ) : null}
      <View style={styles.courseList}>
        {(courses || []).map(course => {
          const isSelected = String(course.id) === courseId;
          return (
            <TouchableOpacity
              key={course.id}
              accessibilityRole="button"
              accessibilityLabel={`Chọn môn ${course.name}`}
              onPress={() => {
                setCourseId(String(course.id));
                if (errors.courseId) {
                  setErrors(e => ({ ...e, courseId: undefined }));
                }
              }}
              style={[styles.courseOption, isSelected && styles.selectedCourse]}>
              <Text
                style={[
                  styles.courseName,
                  isSelected && styles.selectedCourseText,
                ]}>
                {course.name} ({course.code})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FormInput
        label="Mô tả bài tập"
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập ghi chú hoặc yêu cầu bài tập..."
        multiline
      />

      <AppButton
        title="Lưu bài tập"
        onPress={onSave}
        loading={saving}
        style={styles.saveButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  courseList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  courseOption: {
    minHeight: sizes.touch,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  selectedCourse: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  courseName: {
    ...typography.body,
    color: colors.text,
  },
  selectedCourseText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  saveButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
});

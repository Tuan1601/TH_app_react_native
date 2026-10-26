import { parseDisplayDate } from './date';

export interface AssignmentFormValues {
  title: string;
  dueDate: string; // dd/MM/yyyy
  courseId: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

/** Tiêu đề không rỗng, hạn nộp hợp lệ và không ở quá khứ, phải chọn môn. */
export function validateAssignment(values: AssignmentFormValues): FormErrors<AssignmentFormValues> {
  const errors: FormErrors<AssignmentFormValues> = {};
  if (!values.title.trim()) {
    errors.title = 'Vui lòng nhập tiêu đề bài tập.';
  } else if (values.title.trim().length > 120) {
    errors.title = 'Tiêu đề không được dài quá 120 ký tự.';
  }

  if (!values.dueDate.trim()) {
    errors.dueDate = 'Vui lòng nhập hạn nộp.';
  } else {
    const date = parseDisplayDate(values.dueDate);
    if (!date) {
      errors.dueDate = 'Hạn nộp phải có dạng dd/MM/yyyy và là ngày hợp lệ.';
    } else if (date.getTime() < Date.now()) {
      errors.dueDate = 'Hạn nộp không được ở quá khứ.';
    }
  }

  if (!values.courseId) {
    errors.courseId = 'Vui lòng chọn môn học.';
  }
  return errors;
}

export interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
}

export function validateProfile(values: ProfileFormValues): FormErrors<ProfileFormValues> {
  const errors: FormErrors<ProfileFormValues> = {};
  if (!values.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Email không hợp lệ.';
  }
  const cleanPhone = values.phone.trim().replace(/[\s.-]/g, '');
  if (!/^0\d{9,10}$/.test(cleanPhone)) {
    errors.phone = 'Số điện thoại gồm 10–11 chữ số, bắt đầu bằng 0.';
  }
  return errors;
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.values(errors).some(Boolean);
}

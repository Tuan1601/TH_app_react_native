/**
 * Các hàm kiểm tra dữ liệu form. Không phụ thuộc Firebase hay UI.
 */
import { APP_CONFIG } from '../constants/config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

/** Mỗi trường có thể có một thông báo lỗi; không có lỗi thì không có key. */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/** Chuẩn hóa email: bỏ khoảng trắng, chuyển chữ thường. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

/** Kiểm tra form đăng ký. Trả về object rỗng nếu hợp lệ. */
export function validateRegisterForm(
  values: RegisterFormValues,
): FormErrors<RegisterFormValues> {
  const errors: FormErrors<RegisterFormValues> = {};
  const fullName = values.fullName.trim();

  if (!fullName) {
    errors.fullName = 'Vui lòng nhập họ và tên';
  } else if (fullName.length > APP_CONFIG.FULL_NAME_MAX_LENGTH) {
    errors.fullName = `Họ và tên tối đa ${APP_CONFIG.FULL_NAME_MAX_LENGTH} ký tự`;
  }

  if (!values.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Email không đúng định dạng';
  }

  if (!values.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (values.password.length < APP_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.password = `Mật khẩu tối thiểu ${APP_CONFIG.PASSWORD_MIN_LENGTH} ký tự`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu nhập lại không khớp';
  }

  return errors;
}

/** Kiểm tra form đăng nhập. Trả về object rỗng nếu hợp lệ. */
export function validateLoginForm(
  values: LoginFormValues,
): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Email không đúng định dạng';
  }

  if (!values.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  }

  return errors;
}

/** true nếu object lỗi không có trường nào. */
export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}


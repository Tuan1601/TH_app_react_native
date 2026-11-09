
import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Email này đã được sử dụng cho tài khoản khác.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.',
  'auth/network-request-failed':
    'Không có kết nối mạng. Vui lòng kiểm tra Internet và thử lại.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng.',
  'auth/invalid-login-credentials': 'Email hoặc mật khẩu không đúng.',
  'auth/user-not-found': 'Không tìm thấy tài khoản với email này.',
  'auth/wrong-password': 'Mật khẩu không đúng.',
  'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hóa.',
  'auth/too-many-requests':
    'Bạn thao tác quá nhiều lần. Vui lòng đợi một lúc rồi thử lại.',
  'auth/operation-not-allowed':
    'Phương thức Email/Password chưa được bật trong Firebase Console.',
  'auth/invalid-api-key': 'Firebase API key không hợp lệ. Kiểm tra config.ts.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    'Firebase API key không hợp lệ. Kiểm tra config.ts.',
};


function getRawMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === 'string' ? error : '';
}


export function getErrorMessage(
  error: unknown,
  fallback = 'Đã xảy ra lỗi. Vui lòng thử lại.',
): string {
  if (error instanceof FirebaseError && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }

  const raw = getRawMessage(error);
  const upper = raw.toUpperCase();

  if (upper.includes('PERMISSION_DENIED') || upper.includes('PERMISSION DENIED')) {
    return 'Bạn không có quyền thực hiện thao tác này (kiểm tra Database Rules).';
  }
  if (upper.includes('NETWORK') || upper.includes('DISCONNECTED')) {
    return 'Mất kết nối tới máy chủ. Vui lòng kiểm tra Internet.';
  }

  if (raw && !(error instanceof FirebaseError)) {
    return raw;
  }
  return fallback;
}

export function toAppError(error: unknown, fallback?: string): Error {
  return new Error(getErrorMessage(error, fallback));
}


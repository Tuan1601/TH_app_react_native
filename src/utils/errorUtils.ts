/**
 * Chuyển lỗi Firebase (Auth + Realtime Database) thành thông báo tiếng Việt.
 * Các service dùng hàm này để luôn ném ra Error có message dễ hiểu,
 * nhờ vậy UI chỉ cần hiển thị error.message.
 */
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

/** Lấy message gốc từ một giá trị lỗi bất kỳ. */
function getRawMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === 'string' ? error : '';
}

/**
 * Trả về thông báo tiếng Việt cho một lỗi bất kỳ.
 * @param error lỗi bắt được trong catch
 * @param fallback thông báo mặc định khi không nhận diện được lỗi
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'Đã xảy ra lỗi. Vui lòng thử lại.',
): string {
  if (error instanceof FirebaseError && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }

  const raw = getRawMessage(error);
  const upper = raw.toUpperCase();

  // Lỗi từ Realtime Database thường chỉ có message, không có code.
  if (upper.includes('PERMISSION_DENIED') || upper.includes('PERMISSION DENIED')) {
    return 'Bạn không có quyền thực hiện thao tác này (kiểm tra Database Rules).';
  }
  if (upper.includes('NETWORK') || upper.includes('DISCONNECTED')) {
    return 'Mất kết nối tới máy chủ. Vui lòng kiểm tra Internet.';
  }

  // Lỗi do chính service ném ra bằng tiếng Việt thì giữ nguyên.
  if (raw && !(error instanceof FirebaseError)) {
    return raw;
  }
  return fallback;
}

/**
 * Bọc lỗi thành Error có message tiếng Việt để service ném ra ngoài.
 */
export function toAppError(error: unknown, fallback?: string): Error {
  return new Error(getErrorMessage(error, fallback));
}


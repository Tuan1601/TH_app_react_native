/**
 * Kiểu dữ liệu liên quan đến người dùng.
 * Tương ứng với node /users/{uid} và /userStatus/{uid} trong Realtime Database.
 */

/** Trạng thái kết nối của người dùng. */
export type PresenceState = 'online' | 'offline';

/** Hồ sơ người dùng lưu tại /users/{uid}. KHÔNG chứa mật khẩu. */
export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  /** Thời điểm hoạt động gần nhất (ms). */
  lastSeen: number;
  createdAt: number;
}

/** Trạng thái online/offline lưu tại /userStatus/{uid}. */
export interface UserStatus {
  state: PresenceState;
  lastChanged: number;
}

/** Dữ liệu form đăng ký gửi vào authService. */
export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

/** Dữ liệu form đăng nhập gửi vào authService. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Các trường người dùng được phép tự sửa. */
export type UpdateProfilePayload = Partial<
  Pick<UserProfile, 'fullName' | 'avatar'>
>;


import { Platform } from 'react-native';

/**
 * Địa chỉ json-server.
 * - Máy ảo Android: http://10.0.2.2:3000
 * - Máy ảo iOS:     http://localhost:3000
 * - Điện thoại thật: http://<IP-LAN-của-máy-tính>:3000 (cùng mạng Wi-Fi)
 *   hoặc chạy `adb reverse tcp:3000 tcp:3000` rồi dùng http://localhost:3000
 */
const LAN_URL = ''; // ví dụ: 'http://192.168.1.10:3000'

export const BASE_URL = LAN_URL || 'http://127.0.0.1:3000';

/** Timeout cho mỗi request (ms). */
export const TIMEOUT = 10000;

/** Thời gian cache được coi là "mới" (ms). */
export const CACHE_TTL = 5 * 60 * 1000;

/** id sinh viên đang đăng nhập. */
export const CURRENT_STUDENT_ID = 1;

/**
 * Các hàm tiện ích xử lý cuộc trò chuyện, tin nhắn và hiển thị tên/avatar.
 */
import type { LastMessage } from '../types/conversation';

/**
 * Tạo ID cuộc trò chuyện thống nhất từ hai UID.
 * Sắp xếp hai UID theo thứ tự alphabet rồi nối bằng dấu gạch dưới.
 * Đảm bảo createConversationId(A, B) === createConversationId(B, A).
 */
export function createConversationId(uid1: string, uid2: string): string {
  const a = uid1.trim();
  const b = uid2.trim();
  if (!a || !b) {
    throw new Error('UID không hợp lệ để tạo cuộc trò chuyện.');
  }
  return [a, b].sort().join('_');
}

/**
 * Lấy UID của người đối diện từ conversationId hoặc map participants.
 */
export function extractPartnerId(
  conversationId: string,
  currentUid: string,
  participants?: Record<string, boolean>,
): string {
  if (participants) {
    const found = Object.keys(participants).find(uid => uid !== currentUid);
    if (found) {
      return found;
    }
  }
  const parts = conversationId.split('_');
  return parts[0] === currentUid ? parts[1] ?? '' : parts[0] ?? '';
}

/**
 * Định dạng nội dung tin nhắn cuối trên HomeScreen.
 * - Nếu tin nhắn vị trí -> "📍 Đã gửi vị trí"
 * - Nếu do tôi gửi -> thêm tiền tố "Bạn: "
 */
export function formatLastMessagePreview(
  lastMessage: LastMessage | null | undefined,
  currentUid: string,
): string {
  if (!lastMessage) {
    return 'Bắt đầu cuộc trò chuyện';
  }
  const content =
    lastMessage.type === 'location'
      ? '📍 Đã gửi vị trí'
      : lastMessage.text || '';
  if (lastMessage.senderId === currentUid) {
    return `Bạn: ${content}`;
  }
  return content;
}

/**
 * Lấy tối đa 2 chữ cái đầu của họ tên để hiển thị trên Avatar khi chưa có ảnh.
 * Ví dụ: "Nguyen Van A" -> "NA"
 */
export function getInitials(fullName: string): string {
  const cleaned = fullName.trim();
  if (!cleaned) {
    return '?';
  }
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return `${first}${last}`.toUpperCase();
}


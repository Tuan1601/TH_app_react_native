
import type { LastMessage } from '../types/conversation';


export function createConversationId(uid1: string, uid2: string): string {
  const a = uid1.trim();
  const b = uid2.trim();
  if (!a || !b) {
    throw new Error('UID không hợp lệ để tạo cuộc trò chuyện.');
  }
  return [a, b].sort().join('_');
}


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


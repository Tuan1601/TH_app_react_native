/**
 * Các hàm định dạng ngày giờ cho tin nhắn, cuộc trò chuyện và trạng thái hoạt động.
 */

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Định dạng giờ gửi dưới mỗi bong bóng tin nhắn: "14:05". */
export function formatMessageTime(timestamp: number): string {
  if (!timestamp || timestamp <= 0) {
    return '';
  }
  const date = new Date(timestamp);
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/**
 * Nhãn phân nhóm ngày trong ChatScreen:
 * - "Hôm nay"
 * - "Hôm qua"
 * - "dd/MM/yyyy"
 */
export function formatDateHeader(timestamp: number): string {
  if (!timestamp || timestamp <= 0) {
    return 'Hôm nay';
  }
  const date = new Date(timestamp);
  const now = new Date();
  if (isSameDay(date, now)) {
    return 'Hôm nay';
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return 'Hôm qua';
  }
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** Khóa ngày dạng YYYY-MM-DD để kiểm tra hai tin nhắn có khác ngày không. */
export function getDateKey(timestamp: number): string {
  if (!timestamp || timestamp <= 0) {
    return 'unknown';
  }
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Định dạng thời gian tin nhắn cuối trên HomeScreen:
 * - Trong ngày hôm nay: "HH:mm"
 * - Hôm qua: "Hôm qua"
 * - Trong cùng năm: "dd/MM"
 * - Khác năm: "dd/MM/yyyy"
 */
export function formatConversationTime(timestamp: number): string {
  if (!timestamp || timestamp <= 0) {
    return '';
  }
  const date = new Date(timestamp);
  const now = new Date();
  if (isSameDay(date, now)) {
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return 'Hôm qua';
  }
  if (date.getFullYear() === now.getFullYear()) {
    return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`;
  }
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/**
 * Định dạng trạng thái hoạt động gần nhất khi người dùng offline:
 * - "Offline • vừa xong"
 * - "Offline • 5 phút trước"
 * - "Offline • 2 giờ trước"
 * - "Offline • dd/MM HH:mm"
 */
export function formatLastSeen(lastSeen?: number): string {
  if (!lastSeen || lastSeen <= 0) {
    return 'Offline';
  }
  const diffMs = Date.now() - lastSeen;
  if (diffMs < 60_000) {
    return 'Hoạt động vừa xong';
  }
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) {
    return `Hoạt động ${minutes} phút trước`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hoạt động ${hours} giờ trước`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `Hoạt động ${days} ngày trước`;
  }
  const date = new Date(lastSeen);
  return `Hoạt động ${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`;
}


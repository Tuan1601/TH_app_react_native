const pad = (part: number) => String(part).padStart(2, '0');

function toDate(value?: string | number | Date | null): Date | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** dd/MM/yyyy */
export function formatDate(value?: string | number | Date | null): string {
  const date = toDate(value);
  if (!date) {
    return '';
  }
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** HH:mm */
export function formatTime(value?: string | number | Date | null): string {
  if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const date = toDate(value);
  return date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : '';
}

/** HH:mm, dd/MM/yyyy */
export function formatDateTime(value?: string | number | Date | null): string {
  const date = toDate(value);
  return date ? `${formatTime(date)}, ${formatDate(date)}` : '';
}

/** Quá hạn: chưa xong và hạn nộp đã qua. */
export function isOverdue(dueDate: string, status?: string): boolean {
  const date = toDate(dueDate);
  return status !== 'done' && !!date && date.getTime() < Date.now();
}

/** Số ngày còn lại (làm tròn lên). Âm nếu đã quá hạn. */
export function daysLeft(dueDate: string): number {
  const date = toDate(dueDate);
  if (!date) {
    return Number.NaN;
  }
  return Math.ceil((date.getTime() - Date.now()) / 86400000);
}

/** Mô tả ngắn gọn thời hạn: "Còn 3 ngày", "Hôm nay", "Quá hạn 2 ngày". */
export function describeDue(dueDate: string): string {
  const left = daysLeft(dueDate);
  if (Number.isNaN(left)) {
    return '';
  }
  if (left < 0) {
    return `Quá hạn ${Math.abs(left)} ngày`;
  }
  if (left === 0) {
    return 'Hết hạn hôm nay';
  }
  return `Còn ${left} ngày`;
}

const DAY_NAMES: Record<number, string> = {
  2: 'Thứ 2',
  3: 'Thứ 3',
  4: 'Thứ 4',
  5: 'Thứ 5',
  6: 'Thứ 6',
  7: 'Thứ 7',
  8: 'Chủ nhật',
};

/** 2..8 → "Thứ 2".."Chủ nhật" */
export function dayName(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek] ?? '';
}

/** Ngày hôm nay theo quy ước 2 (Thứ 2) → 8 (Chủ nhật). */
export function todayDayOfWeek(): number {
  const day = new Date().getDay();
  return day === 0 ? 8 : day + 1;
}

/** Chuyển "dd/MM/yyyy" thành Date 23:59 cùng ngày (giờ địa phương). */
export function parseDisplayDate(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day, 23, 59, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** So sánh hai mốc ISO; trả về true nếu a mới hơn b. */
export function isNewer(a?: string, b?: string): boolean {
  const left = toDate(a);
  const right = toDate(b);
  if (!left) {
    return false;
  }
  if (!right) {
    return true;
  }
  return left.getTime() > right.getTime();
}

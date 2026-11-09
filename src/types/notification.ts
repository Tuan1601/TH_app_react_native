/**
 * Kiểu dữ liệu thông báo, lưu tại /notifications/{uid}/{notificationId}.
 */

/**
 * - system: thông báo hệ thống (ví dụ: chào mừng khi đăng ký).
 * - new_conversation: có người bắt đầu cuộc trò chuyện với bạn.
 */
export type NotificationType = 'system' | 'new_conversation';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  /** UID người tạo thông báo (người gửi). */
  fromUid: string;
  /** Có khi type === 'new_conversation', dùng để mở đúng cuộc trò chuyện. */
  conversationId?: string;
}


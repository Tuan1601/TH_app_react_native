/**
 * Kiểu dữ liệu tin nhắn, lưu tại /messages/{conversationId}/{messageId}.
 */

export type MessageType = 'text' | 'location';

/** Tọa độ GPS. */
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Message {
  /** ID sinh bởi push() của Firebase. */
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  type: MessageType;
  /** Thời gian do server Firebase gán (ServerValue.TIMESTAMP). */
  createdAt: number;
  /** Chỉ có khi type === 'location'. */
  location?: LocationCoords | null;
}



export type NotificationType = 'system' | 'new_conversation';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  fromUid: string;
  conversationId?: string;
}


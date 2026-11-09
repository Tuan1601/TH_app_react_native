
import type { MessageType } from './message';
import type { UserProfile } from './user';

export interface LastMessage {
  text: string;
  senderId: string;
  type: MessageType;
  createdAt: number;
}

export interface Conversation {

  id: string;
  participants: Record<string, boolean>;
  lastMessage: LastMessage | null;
  updatedAt: number;
}

export type UnreadCountMap = Record<string, number>;

export interface ConversationListItem {
  conversation: Conversation;
  partnerId: string;
  partner: UserProfile | null;
  unreadCount: number;
}


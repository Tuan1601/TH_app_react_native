

export type MessageType = 'text' | 'location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  type: MessageType;
  createdAt: number;
  location?: LocationCoords | null;
}


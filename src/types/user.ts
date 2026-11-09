
export type PresenceState = 'online' | 'offline';
export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: number;
  createdAt: number;
}

export interface UserStatus {
  state: PresenceState;
  lastChanged: number;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export type UpdateProfilePayload = Partial<
  Pick<UserProfile, 'fullName' | 'avatar'>
>;


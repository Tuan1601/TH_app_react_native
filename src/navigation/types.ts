/**
 * Khai báo đầy đủ TypeScript types cho toàn bộ hệ thống React Navigation.
 */
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export interface ChatRouteParams {
  conversationId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
}

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Chat: ChatRouteParams;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<AppStackParamList>
  >;

export type ChatScreenProps = NativeStackScreenProps<AppStackParamList, 'Chat'>;



import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Avatar from '../../components/Avatar';
import ChatBubble from '../../components/ChatBubble';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import type { ChatScreenProps } from '../../navigation/types';
import { openLocationInMaps } from '../../services/locationService';
import type { LocationCoords, Message } from '../../types/message';
import {
  formatDateHeader,
  formatLastSeen,
  getDateKey,
} from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';

export const ChatScreen: React.FC<ChatScreenProps> = ({
  route,
  navigation,
}) => {
  const { conversationId, partnerId, partnerName, partnerAvatar } =
    route.params;
  const { userProfile } = useAuth();
  const currentUid = userProfile?.uid;

  const {
    messages,
    partnerStatus,
    loading,
    sendingText,
    sendingLocation,
    error,
    handleSendText,
    handleSendCurrentLocation,
  } = useMessages({
    conversationId,
    currentUid,
    partnerId,
  });

  const [inputText, setInputText] = useState<string>('');
  const flatListRef = useRef<FlatList<Message> | null>(null);

  const isPartnerOnline = partnerStatus?.state === 'online';
  const partnerStatusLabel = isPartnerOnline
    ? 'Online'
    : partnerStatus?.lastChanged
      ? formatLastSeen(partnerStatus.lastChanged)
      : 'Offline';

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const onPressSendText = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || sendingText) {
      return;
    }
    setInputText('');
    try {
      await handleSendText(trimmed);
    } catch (err) {
      setInputText(trimmed);
      Alert.alert(
        'Không thể gửi tin nhắn',
        getErrorMessage(err, 'Gửi tin nhắn thất bại.'),
      );
    }
  };

  const onPressSendLocation = async () => {
    if (sendingLocation) {
      return;
    }
    try {
      await handleSendCurrentLocation();
    } catch (err) {
      Alert.alert(
        'Không thể gửi vị trí',
        getErrorMessage(err, 'Vui lòng kiểm tra quyền vị trí và GPS.'),
      );
    }
  };

  const onPressOpenMaps = async (coords: LocationCoords) => {
    try {
      await openLocationInMaps(coords);
    } catch (err) {
      Alert.alert('Lỗi mở bản đồ', getErrorMessage(err));
    }
  };

  const canSend = inputText.trim().length > 0 && !sendingText;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Avatar
          fullName={partnerName}
          uri={partnerAvatar}
          size={40}
          showOnline
          isOnline={isPartnerOnline}
        />

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {partnerName}
          </Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isPartnerOnline
                    ? colors.online
                    : colors.textMuted,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                isPartnerOnline ? styles.statusOnline : styles.statusOffline,
              ]}
              numberOfLines={1}>
              {partnerStatusLabel}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        {loading ? (
          <Loading message="Đang tải tin nhắn..." />
        ) : error ? (
          <EmptyState
            iconName="alert-circle-outline"
            title="Không thể tải tin nhắn"
            description={error}
            isError
          />
        ) : messages.length === 0 ? (
          <EmptyState
            iconName="chatbubble-outline"
            title={`Bắt đầu trò chuyện với ${partnerName}`}
            description="Hãy gửi lời chào hoặc chia sẻ vị trí hiện tại của bạn."
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            renderItem={({ item, index }) => {
              const prev = index > 0 ? messages[index - 1] : null;
              const showDate =
                !prev ||
                getDateKey(prev.createdAt) !== getDateKey(item.createdAt);
              const dateHeader = showDate
                ? formatDateHeader(item.createdAt)
                : null;

              return (
                <ChatBubble
                  message={item}
                  isMine={item.senderId === currentUid}
                  dateHeader={dateHeader}
                  onOpenLocation={onPressOpenMaps}
                />
              );
            }}
          />
        )}

        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={onPressSendLocation}
            disabled={sendingLocation}
            activeOpacity={0.75}>
            {sendingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons
                name="location-outline"
                size={23}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !canSend && styles.sendButtonDisabled,
            ]}
            onPress={onPressSendText}
            disabled={!canSend}
            activeOpacity={0.8}>
            {sendingText ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Ionicons name="send" size={18} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusOnline: {
    color: colors.online,
  },
  statusOffline: {
    color: colors.textMuted,
  },
  messagesList: {
    paddingVertical: 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#A9C8F7',
  },
});

export default ChatScreen;


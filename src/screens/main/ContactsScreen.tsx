
import React from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/AppHeader';
import ContactItem from '../../components/ContactItem';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useContacts } from '../../hooks/useContacts';
import type { MainTabScreenProps } from '../../navigation/types';
import {
  createConversationId,
  getOrCreateConversation,
} from '../../services/chatService';
import type { UserProfile } from '../../types/user';

export const ContactsScreen: React.FC<MainTabScreenProps<'Contacts'>> = ({
  navigation,
}) => {
  const { userProfile } = useAuth();
  const currentUid = userProfile?.uid;
  const {
    contacts,
    filteredContacts,
    searchQuery,
    setSearchQuery,
    loading,
    error,
  } = useContacts(currentUid);

  const handleSelectContact = (partner: UserProfile) => {
    if (!currentUid) {
      return;
    }
    const conversationId = createConversationId(currentUid, partner.uid);
    getOrCreateConversation(currentUid, partner.uid).catch(() => undefined);

    navigation.navigate('Chat', {
      conversationId,
      partnerId: partner.uid,
      partnerName: partner.fullName,
      partnerAvatar: partner.avatar,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        title="Danh bạ"
        subtitle={`${contacts.length} người dùng khả dụng`}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên hoặc email..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading ? (
        <Loading message="Đang tải danh bạ người dùng..." />
      ) : error ? (
        <EmptyState
          iconName="alert-circle-outline"
          title="Không thể tải danh bạ"
          description={error}
          isError
        />
      ) : contacts.length === 0 ? (
        <EmptyState
          iconName="people-outline"
          title="Chưa có người dùng nào khác"
          description="Hãy đăng ký thêm một tài khoản thứ hai trên máy ảo khác để bắt đầu trò chuyện."
        />
      ) : filteredContacts.length === 0 ? (
        <EmptyState
          iconName="search-outline"
          title="Không tìm thấy kết quả"
          description={`Không có người dùng nào khớp với "${searchQuery}".`}
        />
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={item => item.uid}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <ContactItem user={item} onPress={handleSelectContact} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    paddingVertical: 0,
  },
  listContent: {
    padding: 16,
  },
});

export default ContactsScreen;


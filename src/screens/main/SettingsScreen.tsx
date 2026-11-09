/**
 * SettingsScreen: hiển thị thông tin tài khoản hiện tại, trạng thái kết nối
 * và nút Đăng xuất có hộp thoại xác nhận trước khi thực hiện.
 */
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/AppHeader';
import Avatar from '../../components/Avatar';
import colors from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import type { MainTabScreenProps } from '../../navigation/types';
import { getErrorMessage } from '../../utils/errorUtils';

export const SettingsScreen: React.FC<
  MainTabScreenProps<'Settings'>
> = () => {
  const { userProfile, firebaseUser, isConnected, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const fullName =
    userProfile?.fullName || firebaseUser?.displayName || 'Người dùng';
  const email = userProfile?.email || firebaseUser?.email || '';
  const uid = userProfile?.uid || firebaseUser?.uid || '';

  const confirmLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert(
                'Lỗi đăng xuất',
                getErrorMessage(error, 'Không thể đăng xuất.'),
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        title="Cài đặt"
        subtitle="Quản lý thông tin tài khoản và phiên đăng nhập"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Avatar
            fullName={fullName}
            uri={userProfile?.avatar}
            size={76}
            showOnline
            isOnline={isConnected}
          />
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isConnected
                    ? colors.online
                    : colors.textMuted,
                },
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected ? 'Đang trực tuyến' : 'Ngoại tuyến'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Họ và tên</Text>
              <Text style={styles.infoValue}>{fullName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Email đăng nhập</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="key-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Mã định danh (UID)</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {uid}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, loggingOut && styles.buttonDisabled]}
          onPress={confirmLogout}
          disabled={loggingOut}
          activeOpacity={0.85}>
          {loggingOut ? (
            <ActivityIndicator color={colors.danger} />
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.danger}
              />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FAC5C5',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: colors.danger,
  },
});

export default SettingsScreen;


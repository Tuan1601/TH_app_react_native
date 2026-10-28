import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography} from '../theme';

type EmptyStateProps = {
  searching: boolean;
};

export default function EmptyState({searching}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name={searching ? 'book-search-outline' : 'bookshelf'}
          size={34}
          color={colors.primary}
        />
      </View>
      <Text style={styles.title}>
        {searching ? 'Không tìm thấy sách' : 'Thư viện chưa có sách'}
      </Text>
      <Text style={styles.message}>
        {searching
          ? 'Thử từ khóa khác hoặc thay đổi bộ lọc thể loại.'
          : 'Thêm đầu sách đầu tiên để bắt đầu quản lý thư viện.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
  },
});

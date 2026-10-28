import React, {useMemo, useRef, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import BottomNavigation from '../components/BottomNavigation';
import {useBooks} from '../context/BookContext';
import {RootStackParamList} from '../navigation/types';
import {colors, radius, shadows, spacing, typography} from '../theme';
import {Book} from '../types/book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

const categoryColors: Record<Book['category'], string> = {
  'Giáo trình': '#DBEAFE',
  'Tiểu thuyết': '#FCE7F3',
  'Khoa học': '#E0E7FF',
  'Thiếu nhi': '#D1FAE5',
};

export default function BookDetailScreen({navigation, route}: Props): React.JSX.Element {
  const {books, returnBook} = useBooks();
  const [busyLoanId, setBusyLoanId] = useState<string | null>(null);
  const busyActionRef = useRef(false);
  const book = useMemo(
    () => books.find(item => item.id === route.params.bookId),
    [books, route.params.bookId],
  );

  const handleReturn = async (loanId: string) => {
    if (!book || busyActionRef.current) {
      return;
    }
    busyActionRef.current = true;
    setBusyLoanId(loanId);
    try {
      await returnBook(book.id, loanId);
    } catch (error) {
      Alert.alert(
        'Không thể cập nhật',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi nhận trả sách.',
      );
    } finally {
      busyActionRef.current = false;
      setBusyLoanId(null);
    }
  };

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.flex}>
          <View style={styles.missingBook}>
            <MaterialCommunityIcons name="book-alert-outline" size={44} color={colors.textSecondary} />
            <Text style={styles.missingTitle}>Sách không còn tồn tại</Text>
            <Text style={styles.missingText}>
              Danh sách đã thay đổi. Hãy quay lại để chọn một đầu sách khác.
            </Text>
            <AppButton title="Quay lại danh sách" icon="arrow-left" onPress={navigation.goBack} />
          </View>
        </View>
        <BottomNavigation navigation={navigation} activeTab="BookList" />
      </SafeAreaView>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại danh sách"
            onPress={navigation.goBack}
            style={({pressed}) => [styles.iconButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="arrow-left" size={21} color={colors.neutral} />
          </Pressable>
          <Text style={styles.topTitle}>Chi tiết sách</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chỉnh sửa sách"
            onPress={() => navigation.navigate('BookForm', {bookId: book.id})}
            style={({pressed}) => [styles.iconButton, styles.editButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="pencil-outline" size={19} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={[styles.cover, {backgroundColor: categoryColors[book.category]}]}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={42}
              color={colors.primary}
            />
            <Text style={styles.coverYear}>{book.year}</Text>
          </View>
          <View style={styles.heroCopy}>
            <View style={styles.badges}>
              <Text style={[styles.categoryBadge, {backgroundColor: categoryColors[book.category]}]}>
                {book.category}
              </Text>
              <Text style={[styles.statusBadge, isOutOfStock ? styles.statusOut : styles.statusIn]}>
                {isOutOfStock ? 'Hết sách' : 'Còn sách'}
              </Text>
            </View>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <View style={styles.authorRow}>
              <MaterialCommunityIcons name="account-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.author}>{book.author}</Text>
            </View>
            <View style={styles.yearRow}>
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={15}
                color={colors.textSecondary}
              />
              <Text style={styles.yearText}>Xuất bản năm {book.year}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Tình trạng kho</Text>
          <View style={[styles.stockPill, isOutOfStock ? styles.stockOut : styles.stockAvailable]}>
            <View style={[styles.stockDot, isOutOfStock ? styles.dotOut : styles.dotAvailable]} />
            <Text
              style={[
                styles.stockPillText,
                isOutOfStock ? styles.stockTextOut : styles.stockTextAvailable,
              ]}>
              {isOutOfStock ? 'Đã hết' : 'Đang có sẵn'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsCard}>
          <Metric icon="bookshelf" label="Tổng số" value={book.quantity} tint={colors.primary} />
          <View style={styles.metricDivider} />
          <Metric
            icon="book-clock-outline"
            label="Đang mượn"
            value={book.borrowed}
            tint={colors.secondary}
          />
          <View style={styles.metricDivider} />
          <Metric
            icon="book-check-outline"
            label="Còn lại"
            value={remaining}
            tint={isOutOfStock ? colors.danger : colors.tertiary}
          />
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionIntro}>
            <Text style={styles.actionTitle}>Quản lý mượn / trả</Text>
            <Text style={styles.actionSubtitle}>Cập nhật số lượng theo từng giao dịch</Text>
          </View>
          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <AppButton
                title="Cho mượn"
                icon="arrow-up-right"
                variant="primary"
                disabled={remaining === 0}
                onPress={() => navigation.navigate('Borrowing', {bookId: book.id})}
              />
            </View>
            <View style={styles.actionButton}>
              <AppButton
                title="Xem người mượn"
                icon="account-multiple-outline"
                variant="outline"
                onPress={() => navigation.navigate('Borrowing', {bookId: book.id})}
              />
            </View>
          </View>
          {isOutOfStock ? (
            <View style={styles.helperRow}>
              <MaterialCommunityIcons name="alert-circle-outline" size={15} color={colors.danger} />
              <Text style={styles.helperText}>Không thể cho mượn vì hiện đã hết sách.</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.borrowersHeading}>
          <View>
            <Text style={styles.sectionTitle}>Người đang mượn</Text>
            <Text style={styles.actionSubtitle}>
              {book.loans.length} lượt mượn của đầu sách này
            </Text>
          </View>
          {book.loans.length > 0 ? (
            <View style={styles.borrowerCount}>
              <Text style={styles.borrowerCountText}>{book.loans.length}</Text>
            </View>
          ) : null}
        </View>
        {book.loans.length === 0 ? (
          <View style={styles.noBorrowersCard}>
            <MaterialCommunityIcons
              name="account-check-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.noBorrowersText}>Hiện chưa có ai mượn sách này.</Text>
          </View>
        ) : (
          book.loans.map(loan => (
            <View key={loan.id} style={styles.borrowerCard}>
              <View style={styles.borrowerIcon}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={19}
                  color={colors.primary}
                />
              </View>
              <View style={styles.borrowerCopy}>
                <Text style={styles.borrowerName}>{loan.borrowerName}</Text>
                <Text style={styles.borrowerDate}>Mượn ngày {loan.borrowedAt}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Nhận trả từ ${loan.borrowerName}`}
                disabled={busyLoanId !== null}
                onPress={() => handleReturn(loan.id)}
                style={({pressed}) => [
                  styles.returnButton,
                  (pressed || busyLoanId === loan.id) && styles.pressed,
                  busyLoanId !== null && styles.returnDisabled,
                ]}>
                {busyLoanId === loan.id ? (
                  <Text style={styles.returnText}>Đang xử lý</Text>
                ) : (
                  <Text style={styles.returnText}>Nhận trả</Text>
                )}
              </Pressable>
            </View>
          ))
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
          </View>
          <Text style={styles.infoText}>
            Thông tin mượn trả được lưu tự động và đồng bộ với danh sách sách.
          </Text>
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="BookList" />
    </SafeAreaView>
  );
}

type MetricProps = {
  icon: string;
  label: string;
  value: number;
  tint: string;
};

function Metric({icon, label, value, tint}: MetricProps): React.JSX.Element {
  return (
    <View style={styles.metric}>
      <MaterialCommunityIcons name={icon} size={19} color={tint} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  editButton: {
    backgroundColor: colors.surfaceMuted,
  },
  topTitle: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  cover: {
    width: 88,
    height: 122,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    marginRight: spacing.lg,
  },
  coverYear: {
    color: colors.primaryDark,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    fontSize: 10,
    fontWeight: '700',
  },
  statusIn: {
    color: colors.success,
    backgroundColor: colors.successSoft,
  },
  statusOut: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  bookTitle: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    lineHeight: 23,
    fontWeight: '800',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  author: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  yearText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  stockAvailable: {
    backgroundColor: colors.successSoft,
  },
  stockOut: {
    backgroundColor: colors.dangerSoft,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotAvailable: {
    backgroundColor: colors.success,
  },
  dotOut: {
    backgroundColor: colors.danger,
  },
  stockPillText: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  stockTextAvailable: {
    color: colors.success,
  },
  stockTextOut: {
    color: colors.danger,
  },
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  metricValue: {
    color: colors.neutral,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  metricDivider: {
    width: StyleSheet.hairlineWidth,
    height: 46,
    backgroundColor: colors.border,
  },
  actionCard: {
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  actionIntro: {
    marginBottom: spacing.lg,
  },
  actionTitle: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  actionSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  borrowersHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  borrowerCount: {
    minWidth: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  borrowerCountText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  borrowerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  borrowerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  borrowerCopy: {
    flex: 1,
    minWidth: 0,
  },
  borrowerName: {
    color: colors.neutral,
    fontSize: typography.small,
    fontWeight: '800',
  },
  borrowerDate: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: 4,
  },
  returnButton: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  returnDisabled: {
    opacity: 0.6,
  },
  returnText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  noBorrowersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  noBorrowersText: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  helperText: {
    flex: 1,
    color: colors.danger,
    fontSize: typography.caption,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  infoIcon: {
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.75,
  },
  missingBook: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  missingTitle: {
    color: colors.neutral,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  missingText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: typography.body,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
});

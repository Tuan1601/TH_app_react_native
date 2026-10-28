import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import BottomNavigation from '../components/BottomNavigation';
import {useBooks} from '../context/BookContext';
import {RootStackParamList} from '../navigation/types';
import {BookLoan} from '../types/book';
import {colors, radius, shadows, spacing, typography} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Borrowing'>;
type LoanWithBook = BookLoan & {bookId: string; bookTitle: string};

export default function BorrowingScreen({navigation, route}: Props): React.JSX.Element {
  const {books, borrowBook, returnBook} = useBooks();
  const [selectedBookId, setSelectedBookId] = useState(route.params?.bookId ?? '');
  const [borrowerName, setBorrowerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const returningLoanRef = useRef<string | null>(null);

  useEffect(() => {
    if (route.params?.bookId) {
      setSelectedBookId(route.params.bookId);
    }
  }, [route.params?.bookId]);

  const availableBooks = useMemo(
    () => books.filter(book => book.borrowed < book.quantity),
    [books],
  );
  const activeLoans = useMemo<LoanWithBook[]>(
    () =>
      books.flatMap(book =>
        book.loans.map(loan => ({
          ...loan,
          bookId: book.id,
          bookTitle: book.title,
        })),
      ),
    [books],
  );
  const selectedBook = books.find(book => book.id === selectedBookId);

  const handleBorrow = async () => {
    if (savingRef.current) {
      return;
    }
    const trimmedName = borrowerName.trim();
    if (!trimmedName) {
      setNameError('Vui lòng nhập tên người mượn.');
      return;
    }
    if (!selectedBook) {
      Alert.alert('Chưa chọn sách', 'Vui lòng chọn một đầu sách còn trong kho.');
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      await borrowBook(selectedBook.id, trimmedName);
      setBorrowerName('');
      setNameError('');
      Alert.alert('Đã ghi nhận mượn sách', `${trimmedName} đã mượn “${selectedBook.title}”.`);
    } catch (error) {
      Alert.alert(
        'Không thể ghi nhận',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi ghi nhận mượn sách.',
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleReturn = async (loan: LoanWithBook) => {
    if (returningLoanRef.current) {
      return;
    }
    returningLoanRef.current = loan.id;
    try {
      await returnBook(loan.bookId, loan.id);
    } catch (error) {
      Alert.alert(
        'Không thể nhận trả',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi nhận trả sách.',
      );
    } finally {
      returningLoanRef.current = null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="swap-horizontal" size={23} color={colors.white} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Mượn và trả</Text>
            <Text style={styles.subtitle}>Ghi nhận người mượn, theo dõi sách đang lưu hành</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="account-multiple-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryNumber}>{activeLoans.length}</Text>
            <Text style={styles.summaryText}>lượt mượn đang hoạt động</Text>
          </View>
          <View style={styles.summaryAccent} />
        </View>

        <View style={styles.formCard}>
          <View style={styles.sectionHeading}>
            <View style={styles.formIcon}>
              <MaterialCommunityIcons name="book-plus-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.sectionTitle}>Ghi nhận cho mượn</Text>
              <Text style={styles.sectionSubtitle}>Chọn sách và nhập thông tin độc giả</Text>
            </View>
          </View>

          <Text style={styles.label}>Chọn sách còn trong kho *</Text>
          {availableBooks.length > 0 ? (
            <View style={styles.bookOptions}>
              {availableBooks.map(book => {
                const selected = selectedBookId === book.id;
                return (
                  <Pressable
                    key={book.id}
                    accessibilityRole="button"
                    accessibilityState={{selected}}
                    onPress={() => setSelectedBookId(book.id)}
                    style={({pressed}) => [
                      styles.bookOption,
                      selected && styles.bookOptionSelected,
                      pressed && styles.pressed,
                    ]}>
                    <MaterialCommunityIcons
                      name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                      size={19}
                      color={selected ? colors.primary : colors.textSecondary}
                    />
                    <View style={styles.flex}>
                      <Text style={styles.bookOptionTitle} numberOfLines={1}>
                        {book.title}
                      </Text>
                      <Text style={styles.bookOptionSub}>
                        {book.author} · Còn {book.quantity - book.borrowed} cuốn
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.noBooks}>
              <MaterialCommunityIcons
                name="book-remove-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.noBooksText}>Hiện không có sách nào còn để cho mượn.</Text>
            </View>
          )}

          <View style={styles.nameField}>
            <Text style={styles.label}>Tên người mượn *</Text>
            <TextInput
              accessibilityLabel="Tên người mượn"
              value={borrowerName}
              onChangeText={value => {
                setBorrowerName(value);
                if (nameError && value.trim()) {
                  setNameError('');
                }
              }}
              placeholder="Nhập họ tên độc giả"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="done"
              style={[styles.input, nameError ? styles.inputError : null]}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>
          <AppButton
            title="Xác nhận cho mượn"
            icon="check"
            loading={saving}
            disabled={availableBooks.length === 0}
            onPress={handleBorrow}
          />
        </View>

        <View style={styles.loanHeading}>
          <View>
            <Text style={styles.sectionTitle}>Đang được mượn</Text>
            <Text style={styles.sectionSubtitle}>Nhấn nhận trả khi độc giả trả sách</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{activeLoans.length}</Text>
          </View>
        </View>

        {activeLoans.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="book-check-outline"
                size={28}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Chưa có lượt mượn nào</Text>
            <Text style={styles.emptyText}>Các lượt mượn mới sẽ xuất hiện ở đây.</Text>
          </View>
        ) : (
          activeLoans.map(loan => (
            <View key={loan.id} style={styles.loanCard}>
              <Pressable
                onPress={() => navigation.navigate('BookDetail', {bookId: loan.bookId})}
                style={({pressed}) => [styles.loanMain, pressed && styles.pressed]}>
                <View style={styles.personIcon}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.loanCopy}>
                  <Text style={styles.borrowerName}>{loan.borrowerName}</Text>
                  <Text style={styles.loanBook} numberOfLines={1}>
                    {loan.bookTitle}
                  </Text>
                  <Text style={styles.loanDate}>Mượn ngày {loan.borrowedAt}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
              </Pressable>
              <View style={styles.loanFooter}>
                <View style={styles.activePill}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Đang mượn</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Nhận trả sách từ ${loan.borrowerName}`}
                  onPress={() => handleReturn(loan)}
                  style={({pressed}) => [styles.returnButton, pressed && styles.pressed]}>
                  <MaterialCommunityIcons
                    name="keyboard-return"
                    size={15}
                    color={colors.primary}
                  />
                  <Text style={styles.returnText}>Nhận trả</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="Borrowing" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    color: colors.neutral,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 17,
    marginTop: 3,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.card,
  },
  summaryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryNumber: {
    color: colors.neutral,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  summaryAccent: {
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  formCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  formIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  sectionTitle: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: 3,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  bookOptions: {
    gap: spacing.sm,
  },
  bookOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  bookOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceMuted,
  },
  bookOptionTitle: {
    color: colors.neutral,
    fontSize: typography.small,
    fontWeight: '700',
  },
  bookOptionSub: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: 3,
  },
  noBooks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  noBooksText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  nameField: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: typography.body,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  loanHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  countBadge: {
    minWidth: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
  },
  countText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: typography.small,
  },
  loanCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  loanMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  loanCopy: {
    flex: 1,
  },
  borrowerName: {
    color: colors.neutral,
    fontSize: typography.body,
    fontWeight: '800',
  },
  loanBook: {
    color: colors.text,
    fontSize: typography.small,
    marginTop: 3,
  },
  loanDate: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: 4,
  },
  loanFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  activeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  returnText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xxl,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.neutral,
    fontSize: typography.body,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.75,
  },
});

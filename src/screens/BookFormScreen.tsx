import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import {useBooks} from '../context/BookContext';
import {RootStackParamList} from '../navigation/types';
import {BookCategory, BookFormValues, BookInput, bookCategories} from '../types/book';
import {colors, radius, shadows, spacing, typography} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;
type FormErrors = Partial<Record<keyof BookFormValues, string>>;
type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  keyboardType?: 'default' | 'number-pad';
  onChangeText: (value: string) => void;
};

const emptyValues: BookFormValues = {
  title: '',
  author: '',
  category: bookCategories[0],
  year: '',
  quantity: '',
};

function validate(values: BookFormValues, borrowed: number): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) {
    errors.title = 'Vui lòng nhập tên sách.';
  }
  if (!values.author.trim()) {
    errors.author = 'Vui lòng nhập tên tác giả.';
  }

  const yearValue = values.year.trim();
  if (!/^\d+$/.test(yearValue)) {
    errors.year = 'Năm xuất bản phải là số nguyên.';
  } else {
    const year = Number(yearValue);
    if (!Number.isSafeInteger(year) || year < 1900 || year > new Date().getFullYear()) {
      errors.year = `Năm xuất bản phải từ 1900 đến ${new Date().getFullYear()}.`;
    }
  }

  const quantityValue = values.quantity.trim();
  if (!/^\d+$/.test(quantityValue)) {
    errors.quantity = 'Số lượng phải là số nguyên.';
  } else {
    const quantity = Number(quantityValue);
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      errors.quantity = 'Số lượng phải lớn hơn 0.';
    } else if (quantity < borrowed) {
      errors.quantity = `Số lượng không thể nhỏ hơn ${borrowed} cuốn đang được mượn.`;
    }
  }
  return errors;
}

export default function BookFormScreen({navigation, route}: Props): React.JSX.Element {
  const {books, addBook, updateBook} = useBooks();
  const bookId = route.params?.bookId;
  const currentBook = useMemo(
    () => (bookId ? books.find(book => book.id === bookId) : undefined),
    [bookId, books],
  );
  const [values, setValues] = useState<BookFormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (currentBook) {
      setValues({
        title: currentBook.title,
        author: currentBook.author,
        category: currentBook.category,
        year: String(currentBook.year),
        quantity: String(currentBook.quantity),
      });
    } else if (!bookId) {
      setValues(emptyValues);
    }
    setErrors({});
  }, [bookId, currentBook]);

  const updateField = useCallback(
    (field: keyof BookFormValues, value: string) => {
      setValues(previous => {
        const nextValues = {...previous, [field]: value};
        setErrors(previousErrors => {
          if (Object.keys(previousErrors).length === 0) {
            return previousErrors;
          }
          const nextErrors = validate(nextValues, currentBook?.borrowed ?? 0);
          if (Object.keys(nextErrors).length === 0) {
            return {};
          }
          return nextErrors;
        });
        return nextValues;
      });
    },
    [currentBook],
  );

  const handleSave = async () => {
    if (savingRef.current) {
      return;
    }
    const nextErrors = validate(values, currentBook?.borrowed ?? 0);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const input: BookInput = {
      title: values.title.trim(),
      author: values.author.trim(),
      category: values.category,
      year: Number(values.year),
      quantity: Number(values.quantity),
    };

    savingRef.current = true;
    setSaving(true);
    try {
      if (bookId) {
        await updateBook(bookId, input);
      } else {
        await addBook(input);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Không thể lưu sách',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lưu sách.',
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  if (bookId && !currentBook) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.missingBook}>
          <MaterialCommunityIcons name="book-alert-outline" size={42} color={colors.textSecondary} />
          <Text style={styles.missingTitle}>Không tìm thấy sách</Text>
          <Text style={styles.missingMessage}>Sách có thể đã bị xóa khỏi thư viện.</Text>
          <AppButton title="Quay lại" icon="arrow-left" variant="outline" onPress={navigation.goBack} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              onPress={navigation.goBack}
              style={({pressed}) => [styles.backButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="arrow-left" size={21} color={colors.neutral} />
            </Pressable>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>{bookId ? 'Cập nhật sách' : 'Thêm sách mới'}</Text>
              <Text style={styles.subtitle}>Điền thông tin để quản lý đầu sách</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formIntro}>
              <View style={styles.formIcon}>
                <MaterialCommunityIcons
                  name={bookId ? 'book-edit-outline' : 'book-plus-multiple-outline'}
                  size={23}
                  color={colors.primary}
                />
              </View>
              <View style={styles.formIntroCopy}>
                <Text style={styles.formIntroTitle}>Thông tin sách</Text>
                <Text style={styles.formIntroSubtitle}>Các mục có dấu * là bắt buộc</Text>
              </View>
            </View>

            <Field
              label="Tên sách *"
              value={values.title}
              placeholder="Ví dụ: Nhà giả kim"
              error={errors.title}
              onChangeText={value => updateField('title', value)}
            />
            <Field
              label="Tác giả *"
              value={values.author}
              placeholder="Nhập tên tác giả"
              error={errors.author}
              onChangeText={value => updateField('author', value)}
            />

            <View style={styles.field}>
              <Text style={styles.label}>Thể loại *</Text>
              <View style={styles.categories}>
                {bookCategories.map(category => {
                  const selected = values.category === category;
                  return (
                    <Pressable
                      key={category}
                      accessibilityRole="button"
                      accessibilityState={{selected}}
                      onPress={() => updateField('category', category as BookCategory)}
                      style={({pressed}) => [
                        styles.categoryChip,
                        selected && styles.categoryChipSelected,
                        pressed && styles.pressed,
                      ]}>
                      <Text
                        style={[
                          styles.categoryText,
                          selected && styles.categoryTextSelected,
                        ]}>
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.numericRow}>
              <View style={styles.numericField}>
                <Field
                  label="Năm xuất bản *"
                  value={values.year}
                  placeholder="2024"
                  error={errors.year}
                  keyboardType="number-pad"
                  onChangeText={value => updateField('year', value)}
                />
              </View>
              <View style={styles.numericField}>
                <Field
                  label="Tổng số cuốn *"
                  value={values.quantity}
                  placeholder="10"
                  error={errors.quantity}
                  keyboardType="number-pad"
                  onChangeText={value => updateField('quantity', value)}
                />
              </View>
            </View>

            {currentBook ? (
              <View style={styles.borrowedNotice}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={17}
                  color={colors.primary}
                />
                <Text style={styles.borrowedText}>
                  Hiện có {currentBook.borrowed} cuốn đang được mượn. Số lượng tổng không thể thấp
                  hơn số này.
                </Text>
              </View>
            ) : null}

            <AppButton
              title={saving ? 'Đang lưu...' : 'Lưu sách'}
              icon={saving ? undefined : 'content-save-outline'}
              loading={saving}
              onPress={handleSave}
            />
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={navigation.goBack}
              style={({pressed}) => [styles.cancelButton, pressed && styles.pressed]}>
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  placeholder,
  error,
  keyboardType = 'default',
  onChangeText,
}: FieldProps): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'default' ? 'sentences' : 'none'}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error ? (
        <View style={styles.errorRow}>
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
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
    fontSize: typography.small,
    marginTop: 3,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  formIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  formIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  formIntroCopy: {
    flex: 1,
  },
  formIntroTitle: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  formIntroSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: 3,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    marginBottom: spacing.sm,
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  categoryChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: colors.white,
  },
  numericRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  numericField: {
    flex: 1,
    minWidth: 0,
  },
  borrowedNotice: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: -spacing.xs,
    marginBottom: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  borrowedText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  cancelButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    borderRadius: radius.md,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '700',
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
  missingMessage: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: typography.body,
    marginBottom: spacing.md,
  },
});

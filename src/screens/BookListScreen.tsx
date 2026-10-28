import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
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
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import {useBooks} from '../context/BookContext';
import {RootStackParamList} from '../navigation/types';
import {bookCategories, Book} from '../types/book';
import {colors, radius, shadows, spacing, typography} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BookList'>;
type CategoryFilter = 'Tất cả' | (typeof bookCategories)[number];
const filters: CategoryFilter[] = ['Tất cả', ...bookCategories];

export default function BookListScreen({navigation}: Props): React.JSX.Element {
  const {books, deleteBook} = useBooks();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Tất cả');

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return books.filter(book => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        book.title.toLocaleLowerCase().includes(normalizedQuery) ||
        book.author.toLocaleLowerCase().includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === 'Tất cả' || book.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [books, query, selectedCategory]);

  const borrowedCount = useMemo(
    () => books.reduce((total, book) => total + book.borrowed, 0),
    [books],
  );

  const confirmDelete = useCallback(
    (book: Book) => {
      if (book.borrowed > 0) {
        Alert.alert(
          'Không thể xóa sách',
          `“${book.title}” hiện có ${book.borrowed} cuốn đang được mượn.`,
        );
        return;
      }
      Alert.alert(
        'Xác nhận xóa',
        `Bạn có chắc chắn muốn xóa “${book.title}” khỏi thư viện không?`,
        [
          {text: 'Hủy', style: 'cancel'},
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: () => {
              deleteBook(book.id).catch(error => {
                Alert.alert(
                  'Không thể xóa sách',
                  error instanceof Error ? error.message : 'Đã xảy ra lỗi khi xóa sách.',
                );
              });
            },
          },
        ],
      );
    },
    [deleteBook],
  );

  const renderBook = useCallback(
    ({item}: {item: Book}) => (
      <BookCard
        book={item}
        onPress={() => navigation.navigate('BookDetail', {bookId: item.id})}
        onLongPress={() => confirmDelete(item)}
      />
    ),
    [confirmDelete, navigation],
  );

  const listHeader = (
    <View>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <MaterialCommunityIcons name="bookshelf" size={22} color={colors.white} />
          </View>
          <View>
            <Text style={styles.brandTitle}>Thư Viện Số</Text>
            <Text style={styles.brandSubtitle}>Danh sách sách</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.versionBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.versionText}>Đang hoạt động</Text>
          </View>
        </View>
      </View>

      <View style={styles.welcomeRow}>
        <View style={styles.welcomeText}>
          <Text style={styles.heading}>Quản lý thư viện</Text>
          <Text style={styles.subheading}>Theo dõi sách và lượt mượn của bạn</Text>
        </View>
        <AppButton
          title="Thêm sách"
          icon="plus"
          compact
          onPress={() => navigation.navigate('BookForm')}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="bookshelf"
          label="Đầu sách"
          value={books.length.toString()}
          tint={colors.primary}
        />
        <StatCard
          icon="book-clock-outline"
          label="Đang mượn"
          value={borrowedCount.toString()}
          tint={colors.secondary}
        />
      </View>

      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={21} color={colors.textSecondary} />
        <TextInput
          accessibilityLabel="Tìm theo tên sách hoặc tác giả"
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo tên sách hoặc tác giả..."
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          style={styles.searchInput}
        />
        {query.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xóa từ khóa tìm kiếm"
            hitSlop={8}
            onPress={() => setQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={19} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}>
        {filters.map(filter => {
          const selected = filter === selectedCategory;
          return (
            <Pressable
              key={filter}
              accessibilityRole="button"
              accessibilityState={{selected}}
              onPress={() => setSelectedCategory(filter)}
              style={({pressed}) => [
                styles.filterChip,
                selected && styles.filterChipSelected,
                pressed && styles.filterPressed,
              ]}>
              {filter === 'Tất cả' ? (
                <MaterialCommunityIcons
                  name="view-grid-outline"
                  size={15}
                  color={selected ? colors.white : colors.textSecondary}
                />
              ) : null}
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Kho sách</Text>
        <Text style={styles.resultCount}>{filteredBooks.length} kết quả</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={book => book.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<EmptyState searching={books.length > 0} />}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={7}
      />
    </SafeAreaView>
  );
}

type StatCardProps = {
  icon: string;
  label: string;
  value: string;
  tint: string;
};

function StatCard({icon, label, value, tint}: StatCardProps): React.JSX.Element {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, {backgroundColor: `${tint}18`}]}>
        <MaterialCommunityIcons name={icon} size={19} color={tint} />
      </View>
      <View style={styles.statCopy}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={[styles.statIndicator, {backgroundColor: tint}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  brandTitle: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.tertiary,
  },
  versionText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  welcomeRow: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  welcomeText: {
    flex: 1,
  },
  heading: {
    color: colors.neutral,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: typography.small,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.card,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  statCopy: {
    flex: 1,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  statValue: {
    color: colors.neutral,
    fontSize: typography.heading,
    lineHeight: 29,
    fontWeight: '800',
  },
  statIndicator: {
    width: 3,
    height: 30,
    borderRadius: 2,
    marginLeft: spacing.xs,
  },
  searchBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  filters: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    minHeight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: colors.white,
  },
  filterPressed: {
    opacity: 0.75,
  },
  sectionHeading: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.neutral,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  resultCount: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
});

import React, {memo, useEffect, useRef} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Book} from '../types/book';
import {colors, radius, shadows, spacing, typography} from '../theme';

type BookCardProps = {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: () => void;
};

const categoryColors: Record<Book['category'], string> = {
  'Giáo trình': '#DBEAFE',
  'Tiểu thuyết': '#FCE7F3',
  'Khoa học': '#E0E7FF',
  'Thiếu nhi': '#D1FAE5',
};

function BookCard({book, onPress, onLongPress, onDelete}: BookCardProps): React.JSX.Element {
  const remaining = book.quantity - book.borrowed;
  const suppressPress = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLongPress = () => {
    suppressPress.current = true;
    onLongPress();
  };

  const handlePressOut = () => {
    if (suppressPress.current) {
      resetTimer.current = setTimeout(() => {
        suppressPress.current = false;
        resetTimer.current = null;
      }, 200);
    }
  };

  const handlePress = () => {
    if (suppressPress.current) {
      suppressPress.current = false;
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
        resetTimer.current = null;
      }
      return;
    }
    onPress();
  };

  useEffect(
    () => () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${book.title}, ${book.author}, nhấn để xem chi tiết, nhấn giữ để xóa`}
        delayLongPress={450}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={({pressed}) => [styles.cardBody, pressed && styles.pressed]}>
        <View style={[styles.cover, {backgroundColor: categoryColors[book.category]}]}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={27}
            color={colors.primary}
          />
          <Text style={styles.coverYear}>{book.year}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <View style={styles.tags}>
                <Text style={[styles.category, {backgroundColor: categoryColors[book.category]}]}>
                  {book.category}
                </Text>
                {remaining === 0 ? (
                  <Text style={styles.outOfStock}>Hết sách</Text>
                ) : (
                  <Text style={styles.availableTag}>Còn {remaining} cuốn</Text>
                )}
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.author} numberOfLines={1}>
                <MaterialCommunityIcons name="account-outline" size={13} color={colors.textSecondary} />
                {'  '}
                {book.author}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <Meta icon="bookshelf" label={`Tổng: ${book.quantity}`} />
            <Meta icon="book-clock-outline" label={`Mượn: ${book.borrowed}`} />
            <Meta
              icon="book-check-outline"
              label={`Còn: ${remaining}`}
              highlight={remaining === 0}
            />
          </View>
        </View>
        </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Xóa ${book.title}`}
        hitSlop={8}
        onPress={onDelete}
        style={({pressed}) => [styles.deleteButton, pressed && styles.deletePressed]}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={18}
          color={colors.danger}
        />
      </Pressable>
    </View>
  );
}

type MetaProps = {
  icon: string;
  label: string;
  highlight?: boolean;
};

function Meta({icon, label, highlight = false}: MetaProps): React.JSX.Element {
  return (
    <View style={styles.metaItem}>
      <MaterialCommunityIcons
        name={icon}
        size={14}
        color={highlight ? colors.danger : colors.textSecondary}
      />
      <Text style={[styles.metaText, highlight && styles.metaDanger]}>{label}</Text>
    </View>
  );
}

export default memo(BookCard);

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  cardBody: {
    flexDirection: 'row',
    padding: spacing.md,
    paddingRight: spacing.xxxl + spacing.md,
  },
  pressed: {
    opacity: 0.78,
  },
  cover: {
    width: 66,
    minHeight: 94,
    borderRadius: radius.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginRight: spacing.md,
  },
  coverYear: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
  },
  deletePressed: {
    opacity: 0.65,
    backgroundColor: '#FECACA',
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  category: {
    overflow: 'hidden',
    borderRadius: radius.pill,
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  availableTag: {
    color: colors.success,
    backgroundColor: colors.successSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    fontSize: 10,
    fontWeight: '600',
  },
  outOfStock: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: colors.neutral,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 20,
  },
  author: {
    color: colors.textSecondary,
    fontSize: typography.small,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  metaDanger: {
    color: colors.danger,
  },
});

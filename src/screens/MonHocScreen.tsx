import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AppIcon from '../components/common/AppIcon';
import { NAM_HOC, MON_HOC_LIST } from '../data/appData';
import { MonHoc, RootStackParamList, TabParamList } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'MonHoc'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

const MonHocScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return MON_HOC_LIST;
    return MON_HOC_LIST.filter(
      m =>
        m.tenMon.toLowerCase().includes(q) ||
        m.maMon.toLowerCase().includes(q) ||
        m.giangVien.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const tongTinChi = useMemo(() => {
    if (MON_HOC_LIST.every(m => m.soTinChi === null)) return '—';
    return MON_HOC_LIST.reduce((sum, m) => sum + (m.soTinChi ?? 0), 0);
  }, []);

  const renderItem = ({ item }: { item: MonHoc }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ChiTietMonHoc', { monHoc: item })}
      activeOpacity={0.85}
    >
      <View style={[styles.cardAccent, { backgroundColor: item.mauSac }]}>
        <AppIcon name={item.icon} size={22} color="#fff" />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.maMon}>{item.maMon}</Text>
          <View style={[styles.tinChiBadge, { backgroundColor: item.mauSac + '18' }]}>
            <Text style={[styles.tinChiText, { color: item.mauSac }]}>
              {item.soTinChi === null ? 'Chưa cập nhật' : `${item.soTinChi} TC`}
            </Text>
          </View>
        </View>
        <Text style={styles.tenMon} numberOfLines={2}>{item.tenMon}</Text>
        <View style={styles.metaRow}>
          <AppIcon name="account-tie-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>{item.giangVien}</Text>
        </View>
        <View style={styles.metaRow}>
          <AppIcon name="clock-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{item.lich}</Text>
          <View style={styles.dot} />
          <AppIcon name="door-open" size={13} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{item.phong}</Text>
        </View>
      </View>
      <AppIcon name="chevron-right" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Năm học {NAM_HOC}</Text>
          <Text style={styles.headerTitle}>Môn học</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNum}>{MON_HOC_LIST.length}</Text>
            <Text style={styles.summaryLabel}>môn</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: COLORS.warning + '18' }]}>
            <Text style={[styles.summaryNum, { color: COLORS.warning }]}>{tongTinChi}</Text>
            <Text style={styles.summaryLabel}>tín chỉ</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <AppIcon name="magnify" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm theo tên, mã môn, giảng viên..."
            placeholderTextColor={COLORS.textMuted}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppIcon name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        {searchQuery !== '' && (
          <Text style={styles.searchResult}>
            Tìm thấy {filtered.length} kết quả
          </Text>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="book-off-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Không tìm thấy môn học</Text>
            <Text style={styles.emptySubtitle}>Thử thay đổi từ khóa tìm kiếm</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '600' },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: SPACING.sm },
  summaryBox: {
    backgroundColor: COLORS.primary + '18',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
  },
  summaryNum: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.primary },
  summaryLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  searchContainer: { padding: SPACING.xl, paddingBottom: SPACING.sm },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    gap: SPACING.sm,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: FONTS.sizes.base, color: COLORS.text },
  searchResult: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    paddingLeft: 4,
  },
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  cardAccent: {
    width: 52,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1, padding: SPACING.md },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  maMon: { fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.textSecondary },
  tinChiBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  tinChiText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  tenMon: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    flexWrap: 'wrap',
  },
  metaText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 2,
  },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: SPACING.md },
  emptyTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary },
});

export default MonHocScreen;

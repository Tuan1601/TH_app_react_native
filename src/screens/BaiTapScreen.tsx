import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AppIcon from '../components/common/AppIcon';
import {
  BAI_TAP_LIST,
  formatHanNop,
  getLoaiBaiTapLabel,
  getTrangThaiLabel,
} from '../data/appData';
import { BaiTap, RootStackParamList, TabParamList, TrangThaiBaiTap } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';
import Tabs, { TabItem } from '../components/common/Tabs';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'BaiTap'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

const FILTER_TABS: TabItem[] = [
  { id: 'tat_ca', label: 'Tất cả', icon: 'clipboard-list-outline' },
  { id: 'chua_lam', label: 'Chưa làm', icon: 'clock-outline', color: COLORS.danger },
  { id: 'dang_lam', label: 'Đang làm', icon: 'progress-pencil', color: COLORS.warning },
  { id: 'da_nop', label: 'Đã nộp', icon: 'check-circle-outline', color: COLORS.success },
];

const LOAI_COLOR: Record<string, string> = {
  bai_tap: COLORS.primary,
  bai_kiem_tra: COLORS.danger,
  do_an: COLORS.success,
  tieu_luan: COLORS.warning,
};

const LOAI_ICON: Record<string, string> = {
  bai_tap: 'file-document-edit-outline',
  bai_kiem_tra: 'pencil-box-outline',
  do_an: 'laptop',
  tieu_luan: 'book-open-page-variant-outline',
};

const BaiTapScreen: React.FC<Props> = ({ navigation }) => {
  const [baiTaps, setBaiTaps] = useState<BaiTap[]>(BAI_TAP_LIST);
  const [activeTab, setActiveTab] = useState('tat_ca');

  const stats = useMemo(() => ({
    tatCa: baiTaps.length,
    chuaLam: baiTaps.filter(b => b.trangThai === 'chua_lam').length,
    dangLam: baiTaps.filter(b => b.trangThai === 'dang_lam').length,
    daNop: baiTaps.filter(b => b.trangThai === 'da_nop').length,
  }), [baiTaps]);

  const tabsWithCounts: TabItem[] = useMemo(() => [
    { ...FILTER_TABS[0], count: stats.tatCa },
    { ...FILTER_TABS[1], count: stats.chuaLam },
    { ...FILTER_TABS[2], count: stats.dangLam },
    { ...FILTER_TABS[3], count: stats.daNop },
  ], [stats]);

  const filtered = useMemo(() => {
    const sorted = [...baiTaps].sort((a, b) => {
      if (a.trangThai === 'da_nop' && b.trangThai !== 'da_nop') return 1;
      if (a.trangThai !== 'da_nop' && b.trangThai === 'da_nop') return -1;
      return new Date(a.hanNop).getTime() - new Date(b.hanNop).getTime();
    });
    if (activeTab === 'tat_ca') return sorted;
    return sorted.filter(b => b.trangThai === activeTab);
  }, [baiTaps, activeTab]);

  const handleToggleStatus = (id: string) => {
    const bt = baiTaps.find(b => b.id === id);
    if (!bt) return;

    if (bt.trangThai === 'da_nop') {
      Alert.alert('Đã nộp', 'Bài tập này đã được nộp, không thể thay đổi trạng thái.');
      return;
    }

    const options = bt.trangThai === 'chua_lam'
      ? [
          { text: 'Đang làm', onPress: () => updateStatus(id, 'dang_lam') },
          { text: 'Đã nộp', onPress: () => updateStatus(id, 'da_nop') },
          { text: 'Hủy', style: 'cancel' as const },
        ]
      : [
          { text: 'Chưa làm', onPress: () => updateStatus(id, 'chua_lam') },
          { text: 'Đã nộp', onPress: () => updateStatus(id, 'da_nop') },
          { text: 'Hủy', style: 'cancel' as const },
        ];

    Alert.alert('Cập nhật trạng thái', `"${bt.tieuDe}"`, options);
  };

  const updateStatus = (id: string, newStatus: TrangThaiBaiTap) => {
    setBaiTaps(prev =>
      prev.map(b => b.id === id ? { ...b, trangThai: newStatus } : b),
    );
  };

  const getTrangThaiStyle = (tt: TrangThaiBaiTap) => {
    if (tt === 'da_nop') return { bg: COLORS.success + '18', color: COLORS.success };
    if (tt === 'dang_lam') return { bg: COLORS.warning + '18', color: COLORS.warning };
    return { bg: COLORS.danger + '18', color: COLORS.danger };
  };

  const getTrangThaiIcon = (tt: TrangThaiBaiTap) => {
    if (tt === 'da_nop') return 'check-circle';
    if (tt === 'dang_lam') return 'progress-pencil';
    return 'circle-outline';
  };

  const isOverdue = (bt: BaiTap) =>
    bt.trangThai !== 'da_nop' && new Date(bt.hanNop) < new Date();

  const renderItem = ({ item }: { item: BaiTap }) => {
    const ttStyle = getTrangThaiStyle(item.trangThai);
    const overdue = isOverdue(item);
    const loaiColor = LOAI_COLOR[item.loai] || COLORS.primary;

    return (
      <TouchableOpacity
        style={[styles.card, overdue && styles.cardOverdue]}
        onPress={() => navigation.navigate('ChiTietBaiTap', { baiTap: item })}
        activeOpacity={0.85}
      >
        {/* Status toggle */}
        <TouchableOpacity
          style={styles.statusToggle}
          onPress={() => handleToggleStatus(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon
            name={getTrangThaiIcon(item.trangThai)}
            size={26}
            color={ttStyle.color}
          />
        </TouchableOpacity>

        <View style={styles.cardBody}>
          {/* Top row */}
          <View style={styles.cardTopRow}>
            <View style={[styles.loaiBadge, { backgroundColor: loaiColor + '18' }]}>
              <AppIcon name={LOAI_ICON[item.loai]} size={12} color={loaiColor} />
              <Text style={[styles.loaiText, { color: loaiColor }]}>
                {getLoaiBaiTapLabel(item.loai)}
              </Text>
            </View>
            {item.uuTien === 'cao' && !overdue && (
              <View style={styles.uuTienBadge}>
                <AppIcon name="fire" size={12} color={COLORS.danger} />
                <Text style={styles.uuTienText}>Ưu tiên cao</Text>
              </View>
            )}
            {overdue && (
              <View style={styles.overdueBadge}>
                <AppIcon name="alert" size={12} color="#fff" />
                <Text style={styles.overdueText}>Quá hạn!</Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.tieuDe,
              item.trangThai === 'da_nop' && styles.tieuDeDone,
            ]}
            numberOfLines={2}
          >
            {item.tieuDe}
          </Text>

          <View style={styles.cardMetaRow}>
            <View
              style={[styles.monBadge, { borderLeftColor: item.mauSac }]}
            >
              <Text style={styles.monText}>{item.tenMon}</Text>
            </View>
          </View>

          <View style={styles.cardBottomRow}>
            {/* Han nop */}
            <View style={styles.hanNopRow}>
              <AppIcon
                name="calendar-clock"
                size={13}
                color={overdue ? COLORS.danger : COLORS.textMuted}
              />
              <Text
                style={[styles.hanNopText, overdue && { color: COLORS.danger }]}
              >
                {formatHanNop(item.hanNop)}
              </Text>
            </View>

            {/* Status */}
            <View style={[styles.statusBadge, { backgroundColor: ttStyle.bg }]}>
              <Text style={[styles.statusText, { color: ttStyle.color }]}>
                {getTrangThaiLabel(item.trangThai)}
              </Text>
            </View>
          </View>

          {/* Diem (nếu đã nộp) */}
          {item.trangThai === 'da_nop' && item.diem !== undefined && (
            <View style={styles.diemRow}>
              <AppIcon name="star" size={13} color={COLORS.warning} />
              <Text style={styles.diemText}>Điểm: {item.diem}/10</Text>
            </View>
          )}
        </View>

        <AppIcon name="chevron-right" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Quản lý bài tập</Text>
          <Text style={styles.headerTitle}>Bài tập</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={[styles.statPill, { backgroundColor: COLORS.danger + '18' }]}>
            <Text style={[styles.statPillNum, { color: COLORS.danger }]}>{stats.chuaLam}</Text>
            <Text style={[styles.statPillLabel, { color: COLORS.danger }]}>chưa làm</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: COLORS.success + '18' }]}>
            <Text style={[styles.statPillNum, { color: COLORS.success }]}>{stats.daNop}</Text>
            <Text style={[styles.statPillLabel, { color: COLORS.success }]}>đã nộp</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <Tabs tabs={tabsWithCounts} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="clipboard-check-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Không có bài tập</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'tat_ca'
                ? 'Bạn chưa có bài tập nào'
                : 'Không có bài tập ở trạng thái này'}
            </Text>
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
  headerStats: { flexDirection: 'row', gap: SPACING.sm },
  statPill: {
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    alignItems: 'center',
  },
  statPillNum: { fontSize: FONTS.sizes.base, fontWeight: '800' },
  statPillLabel: { fontSize: FONTS.sizes.xs },
  tabsContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listContent: { padding: SPACING.xl, paddingBottom: 80 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardOverdue: {
    borderWidth: 1,
    borderColor: COLORS.danger + '50',
    backgroundColor: '#FFF8F8',
  },
  statusToggle: { padding: SPACING.xs, marginRight: SPACING.sm },
  cardBody: { flex: 1 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: 6 },
  loaiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  loaiText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  uuTienBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.danger + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  uuTienText: { fontSize: FONTS.sizes.xs, color: COLORS.danger, fontWeight: '600' },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.danger,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  overdueText: { fontSize: FONTS.sizes.xs, color: '#fff', fontWeight: '700' },
  tieuDe: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  tieuDeDone: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  cardMetaRow: { marginBottom: 6 },
  monBadge: {
    borderLeftWidth: 3,
    paddingLeft: SPACING.sm,
    alignSelf: 'flex-start',
  },
  monText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '600' },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hanNopRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  hanNopText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, flexShrink: 1 },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full, marginLeft: SPACING.sm },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  diemRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  diemText: { fontSize: FONTS.sizes.xs, color: COLORS.warning, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: SPACING.md },
  emptyTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, textAlign: 'center' },
});

export default BaiTapScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AppIcon from '../components/common/AppIcon';
import {
  MON_HOC_LIST,
  BAI_TAP_LIST,
  SINH_VIEN,
  THOI_KHOA_BIEU,
  getTietTime,
  getTietEndTime,
} from '../data/appData';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

const TongQuanScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const homNayThu = (() => {
    const map = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return map[new Date().getDay()];
  })();

  const lichHomNay = THOI_KHOA_BIEU.filter(b => b.thu === homNayThu);

  const baiTapSapHan = BAI_TAP_LIST
    .filter(b => b.trangThai !== 'da_nop')
    .filter(b => new Date(b.hanNop) > new Date())
    .sort((a, b) => new Date(a.hanNop).getTime() - new Date(b.hanNop).getTime())
    .slice(0, 4);

  const stats = {
    tongBaiTap: BAI_TAP_LIST.length,
    daNop: BAI_TAP_LIST.filter(b => b.trangThai === 'da_nop').length,
    chuaLam: BAI_TAP_LIST.filter(b => b.trangThai === 'chua_lam').length,
  };

  const getDaysUntilDeadline = (dateStr: string): number =>
    Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {SINH_VIEN.hoTen.split(' ').slice(-1)[0].charAt(0)}
            </Text>
          </View>
          <View style={styles.greetingBox}>
            <Text style={styles.greetingSmall}>Xin chào </Text>
            <Text style={styles.greetingName} numberOfLines={1}>{SINH_VIEN.hoTen}</Text>
            <Text style={styles.greetingMaSV}>{SINH_VIEN.maSV} • {SINH_VIEN.lop}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('BaiTap')}>
            <AppIcon name="bell-outline" size={22} color="#fff" />
            {stats.chuaLam > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{stats.chuaLam}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{MON_HOC_LIST.length}</Text>
            <Text style={styles.statLabel}>Môn học</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.daNop}/{stats.tongBaiTap}</Text>
            <Text style={styles.statLabel}>Bài đã nộp</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>
              {SINH_VIEN.gpa.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>GPA</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Lịch học hôm nay */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <AppIcon name="calendar-today" size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Lịch hôm nay</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ThoiKhoaBieu')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {lichHomNay.length === 0 ? (
            <View style={styles.emptyCard}>
              <AppIcon name="beach" size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Không có lịch học hôm nay </Text>
            </View>
          ) : (
            lichHomNay.map(buoi => (
              <TouchableOpacity
                key={buoi.id}
                style={[styles.scheduleCard, { borderLeftColor: buoi.mauSac }]}
                onPress={() => navigation.navigate('ChiTietBuoiHoc', { buoiHoc: buoi })}
                activeOpacity={0.85}
              >
                <View style={[styles.scheduleTimeBox, { backgroundColor: buoi.mauSac + '15' }]}>
                  <Text style={[styles.scheduleTime, { color: buoi.mauSac }]}>
                    {getTietTime(buoi.tietBatDau)}
                  </Text>
                  <Text style={[styles.scheduleTimeEnd, { color: buoi.mauSac + 'AA' }]}>
                    {getTietEndTime(buoi.tietBatDau, buoi.soTiet)}
                  </Text>
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleMonHoc} numberOfLines={1}>{buoi.tenMon}</Text>
                  <View style={styles.scheduleMetaRow}>
                    <AppIcon name="door-open" size={13} color={COLORS.textMuted} />
                    <Text style={styles.scheduleMeta}>{buoi.phong}</Text>
                    <View style={[styles.loaiBadge, { backgroundColor: buoi.mauSac + '20' }]}>
                      <Text style={[styles.loaiText, { color: buoi.mauSac }]}>{buoi.loai}</Text>
                    </View>
                  </View>
                </View>
                <AppIcon name="chevron-right" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Danh sách môn học */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <AppIcon name="book-open-variant" size={18} color={COLORS.secondary} />
              <Text style={styles.sectionTitle}>Môn học đang học</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('MonHoc')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monHocRow}>
            {MON_HOC_LIST.map(mon => (
              <TouchableOpacity
                key={mon.id}
                style={[styles.monHocCard, { borderTopColor: mon.mauSac }]}
                onPress={() => navigation.navigate('ChiTietMonHoc', { monHoc: mon })}
                activeOpacity={0.8}
              >
                <View style={[styles.monHocIconBox, { backgroundColor: mon.mauSac + '20' }]}>
                  <AppIcon name={mon.icon} size={22} color={mon.mauSac} />
                </View>
                <Text style={styles.monHocTen} numberOfLines={2}>{mon.tenMon}</Text>
                <View style={styles.monHocFooter}>
                  <AppIcon name="star-circle-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.monHocTinChi}>
                    {mon.soTinChi === null ? 'Chưa cập nhật' : `${mon.soTinChi} TC`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bài tập sắp đến hạn */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <AppIcon name="clipboard-text-clock-outline" size={18} color={COLORS.danger} />
              <Text style={styles.sectionTitle}>Bài tập sắp đến hạn</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('BaiTap')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {baiTapSapHan.length === 0 ? (
            <View style={styles.emptyCard}>
              <AppIcon name="check-circle-outline" size={32} color={COLORS.success} />
              <Text style={styles.emptyText}>Không có bài tập nào sắp đến hạn </Text>
            </View>
          ) : (
            baiTapSapHan.map(bt => {
              const days = getDaysUntilDeadline(bt.hanNop);
              const isUrgent = days <= 2;
              return (
                <TouchableOpacity
                  key={bt.id}
                  style={[styles.baiTapCard, isUrgent && styles.baiTapCardUrgent]}
                  onPress={() => navigation.navigate('ChiTietBaiTap', { baiTap: bt })}
                  activeOpacity={0.85}
                >
                  <View style={[styles.baiTapDot, { backgroundColor: bt.mauSac }]} />
                  <View style={styles.baiTapInfo}>
                    <Text style={styles.baiTapTitle} numberOfLines={1}>{bt.tieuDe}</Text>
                    <Text style={styles.baiTapMon}>{bt.tenMon}</Text>
                  </View>
                  <View style={[styles.deadlineBadge, { backgroundColor: isUrgent ? COLORS.danger + '15' : COLORS.surfaceElevated }]}>
                    <Text style={[styles.deadlineText, { color: isUrgent ? COLORS.danger : COLORS.textSecondary }]}>
                      {days === 0 ? 'Hôm nay' : days === 1 ? 'Ngày mai' : `${days} ngày`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  avatarBox: {
    width: 46, height: 46, borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  avatarText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '800' },
  greetingBox: { flex: 1, marginLeft: SPACING.md },
  greetingSmall: { color: 'rgba(255,255,255,0.75)', fontSize: FONTS.sizes.xs },
  greetingName: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '700', marginTop: 1 },
  greetingMaSV: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.xs, marginTop: 2 },
  bellBtn: {
    width: 40, height: 40, borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  bellBadge: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full, minWidth: 14, height: 14,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2,
  },
  bellBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 4 },
  statNumber: { color: '#fff', fontSize: FONTS.sizes.xl, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: FONTS.sizes.xs, marginTop: 2 },
  scrollView: { flex: 1 },
  section: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  sectionTitle: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  emptyCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl,
    alignItems: 'center', gap: SPACING.sm, ...SHADOWS.sm,
  },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center' },
  scheduleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    marginBottom: SPACING.sm, borderLeftWidth: 4, overflow: 'hidden', ...SHADOWS.sm,
  },
  scheduleTimeBox: { width: 64, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.md },
  scheduleTime: { fontSize: FONTS.sizes.sm, fontWeight: '800' },
  scheduleTimeEnd: { fontSize: FONTS.sizes.xs, marginTop: 2 },
  scheduleInfo: { flex: 1, padding: SPACING.md },
  scheduleMonHoc: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text },
  scheduleMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  scheduleMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, flex: 1 },
  loaiBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  loaiText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  monHocRow: { gap: SPACING.md, paddingBottom: 2 },
  monHocCard: {
    width: 120, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderTopWidth: 3, ...SHADOWS.sm,
  },
  monHocIconBox: {
    width: 42, height: 42, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  monHocTen: { fontSize: FONTS.sizes.xs + 1, fontWeight: '700', color: COLORS.text },
  monHocFooter: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: SPACING.sm },
  monHocTinChi: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  baiTapCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm,
  },
  baiTapCardUrgent: { borderWidth: 1, borderColor: COLORS.danger + '40', backgroundColor: '#FFF5F5' },
  baiTapDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.md },
  baiTapInfo: { flex: 1 },
  baiTapTitle: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  baiTapMon: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  deadlineBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.sm, marginLeft: SPACING.sm },
  deadlineText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
});

export default TongQuanScreen;

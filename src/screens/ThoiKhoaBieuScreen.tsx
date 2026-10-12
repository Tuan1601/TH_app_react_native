import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AppIcon from '../components/common/AppIcon';
import { NAM_HOC, THOI_KHOA_BIEU, getTietTime, getTietEndTime, getThuLabel } from '../data/appData';
import { BuoiHoc, RootStackParamList, TabParamList, ThuTrong } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'ThoiKhoaBieu'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

const DAYS: ThuTrong[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DAY_SHORT: Record<ThuTrong, string> = {
  T2: 'T2',
  T3: 'T3',
  T4: 'T4',
  T5: 'T5',
  T6: 'T6',
  T7: 'T7',
  CN: 'CN',
};

const ThoiKhoaBieuScreen: React.FC<Props> = ({ navigation }) => {
  // Default: hôm nay
  const todayIndex = useMemo(() => {
    const dayMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = dayMap[new Date().getDay()] as ThuTrong;
    const idx = DAYS.indexOf(today);
    return idx >= 0 ? idx : 0;
  }, []);

  const [activeDayIndex, setActiveDayIndex] = useState(todayIndex);
  const activeDay = DAYS[activeDayIndex];

  const lichNgay = useMemo(
    () =>
      THOI_KHOA_BIEU
        .filter(b => b.thu === activeDay)
        .sort((a, b) => a.tietBatDau - b.tietBatDau),
    [activeDay],
  );

  // Summary: số buổi học theo từng ngày
  const buoiByDay = useMemo(() => {
    return DAYS.reduce<Record<string, number>>((acc, day) => {
      acc[day] = THOI_KHOA_BIEU.filter(b => b.thu === day).length;
      return acc;
    }, {});
  }, []);

  const totalBuoi = useMemo(() => THOI_KHOA_BIEU.length, []);
  const totalMon = useMemo(
    () => new Set(THOI_KHOA_BIEU.map(b => b.monHocId)).size,
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Năm học {NAM_HOC}</Text>
          <Text style={styles.headerTitle}>Thời khóa biểu</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNum}>{totalBuoi}</Text>
            <Text style={styles.summaryLabel}>buổi/tuần</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: COLORS.secondary + '18' }]}>
            <Text style={[styles.summaryNum, { color: COLORS.secondary }]}>{totalMon}</Text>
            <Text style={styles.summaryLabel}>môn học</Text>
          </View>
        </View>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DAYS.map((day, idx) => {
            const isActive = idx === activeDayIndex;
            const count = buoiByDay[day];
            const isToday = idx === todayIndex;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayTab, isActive && styles.dayTabActive]}
                onPress={() => setActiveDayIndex(idx)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.dayTabText,
                    isActive && styles.dayTabTextActive,
                    isToday && !isActive && styles.dayTabTextToday,
                  ]}
                >
                  {DAY_SHORT[day]}
                </Text>
                {count > 0 ? (
                  <View
                    style={[
                      styles.dayBadge,
                      isActive ? styles.dayBadgeActive : styles.dayBadgeInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayBadgeText,
                        isActive ? styles.dayBadgeTextActive : styles.dayBadgeTextInactive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.dayBadgeEmpty} />
                )}
                {isToday && <View style={styles.todayDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Day label */}
      <View style={styles.dayLabel}>
        <AppIcon name="calendar-week" size={16} color={COLORS.primary} />
        <Text style={styles.dayLabelText}>{getThuLabel(activeDay)}</Text>
        {activeDayIndex === todayIndex && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>Hôm nay</Text>
          </View>
        )}
      </View>

      {/* Schedule List */}
      <ScrollView
        contentContainerStyle={styles.scheduleContent}
        showsVerticalScrollIndicator={false}
      >
        {lichNgay.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppIcon name="calendar-remove-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Không có lịch học</Text>
            <Text style={styles.emptySubtitle}>Ngày này bạn không có buổi học nào</Text>
          </View>
        ) : (
          lichNgay.map((buoi, index) => (
            <TouchableOpacity
              key={buoi.id}
              style={styles.buoiCard}
              onPress={() => navigation.navigate('ChiTietBuoiHoc', { buoiHoc: buoi })}
              activeOpacity={0.85}
            >
              {/* Timeline connector */}
              <View style={styles.timeline}>
                <View style={[styles.timelineDot, { backgroundColor: buoi.mauSac }]} />
                {index < lichNgay.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.buoiContent}>
                {/* Time */}
                <View style={styles.buoiTimeRow}>
                  <Text style={[styles.buoiTimeStart, { color: buoi.mauSac }]}>
                    {getTietTime(buoi.tietBatDau)}
                  </Text>
                  <Text style={styles.buoiTimeSep}> – </Text>
                  <Text style={styles.buoiTimeEnd}>
                    {getTietEndTime(buoi.tietBatDau, buoi.soTiet)}
                  </Text>
                  <Text style={styles.buoiTiet}>
                    (Tiết {buoi.tietBatDau}–{buoi.tietBatDau + buoi.soTiet - 1})
                  </Text>
                </View>

                {/* Main Card */}
                <View style={[styles.buoiMain, { borderLeftColor: buoi.mauSac }]}>
                  <View style={styles.buoiMainHeader}>
                    <Text style={styles.buoiTenMon} numberOfLines={1}>{buoi.tenMon}</Text>
                    <View style={[styles.loaiBadge, { backgroundColor: buoi.mauSac + '20' }]}>
                      <Text style={[styles.loaiText, { color: buoi.mauSac }]}>
                        {buoi.loai === 'LT' ? 'Lý thuyết' : 'Thực hành'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buoiMetaRow}>
                    <AppIcon name="account-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.buoiMeta}>{buoi.giangVien}</Text>
                  </View>
                  <View style={styles.buoiMetaRow}>
                    <AppIcon name="door-open" size={13} color={COLORS.textMuted} />
                    <Text style={styles.buoiMeta}>Phòng {buoi.phong}</Text>
                    <View style={styles.buoiDot} />
                    <AppIcon name="clock-time-four-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.buoiMeta}>{buoi.soTiet} tiết</Text>
                  </View>
                  <TouchableOpacity style={styles.viewDetailBtn}>
                    <Text style={[styles.viewDetailText, { color: buoi.mauSac }]}>
                      Xem chi tiết
                    </Text>
                    <AppIcon name="chevron-right" size={14} color={buoi.mauSac} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  // Day selector
  daySelector: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayTab: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    marginHorizontal: 3,
    minWidth: 44,
    position: 'relative',
  },
  dayTabActive: {
    backgroundColor: COLORS.primary,
  },
  dayTabText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  dayTabTextActive: { color: '#fff' },
  dayTabTextToday: { color: COLORS.primary },
  dayBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  dayBadgeActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  dayBadgeInactive: { backgroundColor: COLORS.primary + '20' },
  dayBadgeEmpty: { width: 18, height: 18, marginTop: 4 },
  dayBadgeText: { fontSize: 10, fontWeight: '700' },
  dayBadgeTextActive: { color: '#fff' },
  dayBadgeTextInactive: { color: COLORS.primary },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.danger,
  },
  dayLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  dayLabelText: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text },
  todayBadge: {
    backgroundColor: COLORS.primary + '18',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginLeft: SPACING.xs,
  },
  todayBadgeText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },
  // Schedule
  scheduleContent: { paddingHorizontal: SPACING.xl, paddingBottom: 80 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: SPACING.md },
  emptyTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, textAlign: 'center' },
  buoiCard: { flexDirection: 'row', marginBottom: SPACING.lg },
  timeline: { alignItems: 'center', width: 24, marginRight: SPACING.md },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 22 },
  timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 4 },
  buoiContent: { flex: 1 },
  buoiTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  buoiTimeStart: { fontSize: FONTS.sizes.sm, fontWeight: '800' },
  buoiTimeSep: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  buoiTimeEnd: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  buoiTiet: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginLeft: SPACING.xs },
  buoiMain: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  buoiMainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  buoiTenMon: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: SPACING.sm },
  loaiBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  loaiText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  buoiMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  buoiMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  buoiDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLORS.border, marginHorizontal: 4 },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    alignSelf: 'flex-end',
  },
  viewDetailText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
});

export default ThoiKhoaBieuScreen;

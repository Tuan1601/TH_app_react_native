import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppIcon from '../components/common/AppIcon';
import { MON_HOC_LIST, BAI_TAP_LIST } from '../data/appData';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChiTietMonHoc'>;

const ChiTietMonHocScreen: React.FC<Props> = ({ route, navigation }) => {
  const { monHoc } = route.params;

  const baiTapMonNay = BAI_TAP_LIST.filter(b => b.monHocId === monHoc.id);
  const chuaNop = baiTapMonNay.filter(b => b.trangThai !== 'da_nop').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Header */}
      <View style={[styles.hero, { backgroundColor: monHoc.mauSac }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <AppIcon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroIconBox}>
          <AppIcon name={monHoc.icon} size={36} color="#fff" />
        </View>
        <Text style={styles.heroMaMon}>{monHoc.maMon}</Text>
        <Text style={styles.heroTenMon}>{monHoc.tenMon}</Text>
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <AppIcon name="star-circle-outline" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>
              {monHoc.soTinChi === null ? 'Chưa cập nhật tín chỉ' : `${monHoc.soTinChi} tín chỉ`}
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <AppIcon name="calendar-clock" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>{monHoc.hocKy}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông tin chung */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin môn học</Text>
          <View style={styles.card}>
            <InfoItem icon="account-tie-outline" label="Giảng viên" value={monHoc.giangVien} color={monHoc.mauSac} />
            <View style={styles.divider} />
            <InfoItem icon="clock-outline" label="Lịch học" value={monHoc.lich} />
            <View style={styles.divider} />
            <InfoItem icon="door-open" label="Phòng học" value={monHoc.phong} />
          </View>
        </View>

        {/* Mô tả */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả môn học</Text>
          <View style={styles.card}>
            <Text style={styles.moTaText}>{monHoc.moTa}</Text>
          </View>
        </View>

        {/* Bài tập của môn */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bài tập ({baiTapMonNay.length})</Text>
            {chuaNop > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>{chuaNop} chưa nộp</Text>
              </View>
            )}
          </View>
          {baiTapMonNay.length === 0 ? (
            <View style={styles.emptyBox}>
              <AppIcon name="clipboard-check-outline" size={32} color={COLORS.border} />
              <Text style={styles.emptyText}>Chưa có bài tập</Text>
            </View>
          ) : (
            baiTapMonNay.map(bt => (
              <View
                key={bt.id}
                style={[
                  styles.btCard,
                  bt.trangThai === 'da_nop' && styles.btCardDone,
                ]}
              >
                <View
                  style={[
                    styles.btStatus,
                    {
                      backgroundColor:
                        bt.trangThai === 'da_nop'
                          ? COLORS.success
                          : bt.trangThai === 'dang_lam'
                          ? COLORS.warning
                          : COLORS.danger,
                    },
                  ]}
                />
                <View style={styles.btContent}>
                  <Text style={styles.btTitle} numberOfLines={1}>{bt.tieuDe}</Text>
                  <Text style={styles.btHan}>
                    Hạn: {new Date(bt.hanNop).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                {bt.diem !== undefined && (
                  <View style={styles.btDiem}>
                    <Text style={styles.btDiemText}>{bt.diem}</Text>
                    <Text style={styles.btDiemLabel}>/10</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
}
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, color }) => (
  <View style={styles.infoItem}>
    <AppIcon name={icon} size={18} color={color || COLORS.textSecondary} style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    paddingTop: 50,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: SPACING.xxxl,
    borderBottomRightRadius: SPACING.xxxl,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: SPACING.xl,
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconBox: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroMaMon: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm, fontWeight: '700' },
  heroTenMon: {
    color: '#fff',
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  heroBadgeRow: { flexDirection: 'row', gap: SPACING.sm },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  heroBadgeText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: '600' },
  content: { padding: SPACING.xl, paddingBottom: 40 },
  section: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  infoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs + 2 },
  infoIcon: { marginRight: SPACING.md },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 2 },
  infoValue: { fontSize: FONTS.sizes.base, fontWeight: '600', color: COLORS.text },
  moTaText: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary, lineHeight: 22 },
  pendingBadge: {
    backgroundColor: COLORS.danger + '18',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  pendingText: { fontSize: FONTS.sizes.xs, color: COLORS.danger, fontWeight: '600' },
  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  emptyText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  btCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  btCardDone: { opacity: 0.65 },
  btStatus: { width: 4, alignSelf: 'stretch', borderRadius: 2, marginRight: SPACING.md },
  btContent: { flex: 1 },
  btTitle: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text },
  btHan: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 3 },
  btDiem: { flexDirection: 'row', alignItems: 'baseline' },
  btDiemText: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.warning },
  btDiemLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
});

export default ChiTietMonHocScreen;

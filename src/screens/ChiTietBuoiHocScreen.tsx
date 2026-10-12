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
import { getTietTime, getTietEndTime, getThuLabel } from '../data/appData';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChiTietBuoiHoc'>;

const ChiTietBuoiHocScreen: React.FC<Props> = ({ route, navigation }) => {
  const { buoiHoc } = route.params;

  const gioVao = getTietTime(buoiHoc.tietBatDau);
  const gioRa = getTietEndTime(buoiHoc.tietBatDau, buoiHoc.soTiet);
  const tietKetThuc = buoiHoc.tietBatDau + buoiHoc.soTiet - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: buoiHoc.mauSac }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <AppIcon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.heroTimeBox}>
          <Text style={styles.heroTimeMain}>{gioVao}</Text>
          <Text style={styles.heroTimeSep}>→</Text>
          <Text style={styles.heroTimeEnd}>{gioRa}</Text>
        </View>
        <Text style={styles.heroTenMon}>{buoiHoc.tenMon}</Text>
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <AppIcon
              name={buoiHoc.loai === 'LT' ? 'book-open-variant' : 'laptop'}
              size={13}
              color="#fff"
            />
            <Text style={styles.heroBadgeText}>
              {buoiHoc.loai === 'LT' ? 'Lý thuyết' : 'Thực hành'}
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <AppIcon name="calendar" size={13} color="#fff" />
            <Text style={styles.heroBadgeText}>{getThuLabel(buoiHoc.thu)}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông tin buổi học */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin buổi học</Text>
          <View style={styles.card}>
            {/* Time visual */}
            <View style={styles.timeVisual}>
              <View style={styles.timeBlock}>
                <Text style={[styles.timeValue, { color: buoiHoc.mauSac }]}>{gioVao}</Text>
                <Text style={styles.timeLabel}>Giờ vào</Text>
              </View>
              <View style={styles.timeDuration}>
                <View style={[styles.timeDurationBar, { backgroundColor: buoiHoc.mauSac + '30' }]}>
                  <View style={[styles.timeDurationFill, { backgroundColor: buoiHoc.mauSac }]} />
                </View>
                <Text style={styles.timeDurationLabel}>{buoiHoc.soTiet} tiết</Text>
              </View>
              <View style={styles.timeBlock}>
                <Text style={[styles.timeValue, { color: buoiHoc.mauSac }]}>{gioRa}</Text>
                <Text style={styles.timeLabel}>Giờ ra</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <DetailRow
              icon="book-clock-outline"
              label="Tiết học"
              value={`Tiết ${buoiHoc.tietBatDau} – ${tietKetThuc} (${buoiHoc.soTiet} tiết)`}
              color={buoiHoc.mauSac}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="account-tie-outline"
              label="Giảng viên"
              value={buoiHoc.giangVien}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="door-open"
              label="Phòng học"
              value={`Phòng ${buoiHoc.phong}`}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="calendar-week"
              label="Thứ"
              value={getThuLabel(buoiHoc.thu)}
            />
          </View>
        </View>

        {/* Checklist nhắc nhở */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhắc nhở trước buổi học</Text>
          <View style={styles.card}>
            {[
              'Ôn lại bài học tuần trước',
              'Chuẩn bị sách vở và máy tính',
              'Hoàn thành bài tập được giao',
              'Đến đúng giờ',
            ].map((item, idx) => (
              <View key={idx} style={styles.checkItem}>
                <View style={[styles.checkDot, { backgroundColor: buoiHoc.mauSac }]}>
                  <AppIcon name="check" size={12} color="#fff" />
                </View>
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, color }) => (
  <View style={styles.detailRow}>
    <AppIcon name={icon} size={18} color={color || COLORS.textSecondary} style={styles.detailIcon} />
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  heroTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  heroTimeMain: { color: '#fff', fontSize: FONTS.sizes.xxxl, fontWeight: '800' },
  heroTimeSep: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.xl },
  heroTimeEnd: { color: 'rgba(255,255,255,0.85)', fontSize: FONTS.sizes.xxxl, fontWeight: '800' },
  heroTenMon: {
    color: '#fff',
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.md,
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
  sectionTitle: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  timeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  timeBlock: { alignItems: 'center' },
  timeValue: { fontSize: FONTS.sizes.xl, fontWeight: '800' },
  timeLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  timeDuration: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.md },
  timeDurationBar: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  timeDurationFill: { height: '100%', width: '60%', borderRadius: 3 },
  timeDurationLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '600' },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs + 2 },
  detailIcon: { marginRight: SPACING.md },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 2 },
  detailValue: { fontSize: FONTS.sizes.base, fontWeight: '600', color: COLORS.text },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: FONTS.sizes.base, color: COLORS.text },
});

export default ChiTietBuoiHocScreen;

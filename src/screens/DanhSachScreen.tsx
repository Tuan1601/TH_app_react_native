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
import AppIcon from '../components/common/AppIcon';;
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Student, RootStackParamList } from '../types';
import StudentCard from '../components/common/StudentCard';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DanhSach'>;
  students: Student[];
}

const DanhSachScreen: React.FC<Props> = ({ navigation, students }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      s =>
        s.maSV.toLowerCase().includes(q) ||
        s.hoTen.toLowerCase().includes(q),
    );
  }, [students, searchQuery]);

  const stats = useMemo(() => {
    const total = students.length;
    const avgGpa = total > 0
      ? (students.reduce((acc, s) => acc + s.gpa, 0) / total).toFixed(1)
      : '0.0';
    const gioi = students.filter(s => s.xepLoai === 'Giỏi').length;
    const kha = students.filter(s => s.xepLoai === 'Khá').length;
    const tb = students.filter(s => s.xepLoai === 'Trung bình').length;
    const yeu = students.filter(s => s.xepLoai === 'Yếu').length;
    return { total, avgGpa, gioi, kha, tb, yeu };
  }, [students]);

  const ListHeader = () => (
    <View>
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <StatItem icon="account-group-outline" label="Tổng sinh viên" value={String(stats.total)} color={COLORS.primary} />
        <View style={styles.statsDivider} />
        <StatItem icon="chart-bar" label="GPA trung bình" value={stats.avgGpa} color={COLORS.kha} />
        <View style={styles.statsDivider} />
        <StatItem icon="medal-outline" label="Sinh viên Giỏi" value={String(stats.gioi)} color={COLORS.gioi} />
      </View>

      {/* Classification chips */}
      <View style={styles.chipRow}>
        <ClassChip label="Giỏi" count={stats.gioi} color={COLORS.gioi} />
        <ClassChip label="Khá" count={stats.kha} color={COLORS.kha} />
        <ClassChip label="Trung bình" count={stats.tb} color={COLORS.trungBinh} />
        <ClassChip label="Yếu" count={stats.yeu} color={COLORS.yeu} />
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <AppIcon name="magnify" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm theo mã SV hoặc họ tên..."
          placeholderTextColor={COLORS.textMuted}
        />
        {searchQuery !== '' && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setSearchQuery('')}
          >
            <AppIcon name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* List label */}
      <View style={styles.listLabelRow}>
        <Text style={styles.listLabel}>
          {searchQuery
            ? `${filteredStudents.length} kết quả`
            : `${stats.total} sinh viên`}
        </Text>
        <AppIcon name="sort-variant" size={18} color={COLORS.textMuted} />
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <AppIcon name="account-search-outline" size={64} color={COLORS.border} />
      <Text style={styles.emptyTitle}>Không tìm thấy sinh viên</Text>
      <Text style={styles.emptySubtitle}>Thử thay đổi từ khóa tìm kiếm</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Custom Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>TRƯỜNG ĐẠI HỌC</Text>
          <Text style={styles.headerTitle}>Sinh Viên</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <AppIcon name="bell-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <AppIcon name="tune-variant" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <StudentCard
            student={item}
            onPress={student => navigation.navigate('ChiTiet', { student })}
          />
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ThemSinhVien')}
        activeOpacity={0.85}
      >
        <AppIcon name="plus" size={28} color="#fff" />
        <Text style={styles.fabLabel}>Thêm sinh viên</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

interface StatItemProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, color }) => (
  <View style={styles.statItem}>
    <AppIcon name={icon} size={20} color={color} style={styles.statIcon} />
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface ClassChipProps {
  label: string;
  count: number;
  color: string;
}

const ClassChip: React.FC<ClassChipProps> = ({ label, count, color }) => (
  <View style={[styles.chip, { borderColor: color + '40', backgroundColor: color + '12' }]}>
    <View style={[styles.chipDot, { backgroundColor: color }]} />
    <Text style={[styles.chipLabel, { color }]}>{label}</Text>
    <Text style={[styles.chipCount, { color }]}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },

  // Stats
  statsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
  },

  // Classification chips
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 4,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  chipCount: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    height: 50,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.base,
    color: COLORS.text,
  },
  clearBtn: {
    padding: 4,
  },

  // List label
  listLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: 2,
  },
  listLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    left: SPACING.xl,
    right: SPACING.xl,
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...SHADOWS.lg,
  },
  fabLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});

export default DanhSachScreen;

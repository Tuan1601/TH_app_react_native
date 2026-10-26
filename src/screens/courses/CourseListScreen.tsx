import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type CourseStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import InlineError from '../../components/common/InlineError';
import CourseCard from '../../components/course/CourseCard';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = NativeStackScreenProps<CourseStackParamList, typeof ROUTES.COURSES>;

export default function CourseListScreen({ navigation }: Props) {
  const { courses, status, refresh } = useAppData();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('Tất cả');
  const [refreshing, setRefreshing] = useState(false);

  const semesters = useMemo(
    () => ['Tất cả', ...Array.from(new Set((courses || []).map(c => c.semester)))],
    [courses],
  );

  const filtered = useMemo(() => {
    return (courses || []).filter(course => {
      const matchSemester = semester === 'Tất cả' || course.semester === semester;
      const term = search.trim().toLowerCase();
      const matchSearch =
        !term ||
        course.name.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term);
      return matchSemester && matchSearch;
    });
  }, [courses, search, semester]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh('courses', true);
    } finally {
      setRefreshing(false);
    }
  };

  if (!courses && status.courses.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!courses && status.courses.error) {
    return (
      <ScreenContainer>
        <ErrorView
          message={status.courses.error.message}
          onRetry={() => refresh('courses')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.count}>{(courses || []).length} môn học</Text>
            <InlineError
              message={status.courses.error?.message}
              onRetry={() => refresh('courses')}
            />
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm theo tên hoặc mã môn..."
            />
            <FilterChips
              options={semesters}
              selected={semester}
              onSelect={setSemester}
            />
            <LastUpdatedText timestamp={status.courses.lastUpdated} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            description="Thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc học kỳ."
          />
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xs,
  },
  count: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
});

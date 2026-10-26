import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES, type ProfileStackParamList } from '../../navigation/routes';
import { useAppData } from '../../context/AppDataContext';
import { calcGpa } from '../../utils/gpa';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import InlineError from '../../components/common/InlineError';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = NativeStackScreenProps<ProfileStackParamList, typeof ROUTES.GRADES>;

export default function GradeListScreen({ navigation }: Props) {
  const { grades, courses, status, refresh } = useAppData();
  const [semester, setSemester] = useState('Tất cả');
  const [refreshing, setRefreshing] = useState(false);

  const semesters = useMemo(
    () => ['Tất cả', ...Array.from(new Set((grades || []).map(g => g.semester)))],
    [grades],
  );

  const filtered = useMemo(() => {
    return (grades || []).filter(
      grade => semester === 'Tất cả' || grade.semester === semester,
    );
  }, [grades, semester]);

  const summary = useMemo(
    () => calcGpa(filtered, courses || []),
    [filtered, courses],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh('grades', true);
    } finally {
      setRefreshing(false);
    }
  };

  if (!grades && status.grades.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!grades && status.grades.error) {
    return (
      <ScreenContainer>
        <ErrorView
          message={status.grades.error.message}
          onRetry={() => refresh('grades')}
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
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <InlineError
              message={status.grades.error?.message}
              onRetry={() => refresh('grades')}
            />
            <GpaSummary
              gpa={summary.gpa}
              totalCredits={summary.totalCredits}
            />
            <Text style={styles.heading}>Lọc theo học kỳ</Text>
            <FilterChips
              options={semesters}
              selected={semester}
              onSelect={setSemester}
            />
            <LastUpdatedText timestamp={status.grades.lastUpdated} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Chưa có kết quả học tập"
            description="Học kỳ này chưa có điểm thi hoặc dữ liệu môn học."
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
  heading: {
    ...typography.captionBold,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
});

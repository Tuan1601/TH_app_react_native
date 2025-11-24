
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { Student } from '../../types/student.types'
import { COLORS } from '../../constants/layout';

const students: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: `Nguyễn Văn ${String.fromCharCode(65 + i)}`,
  age: 18 + Math.floor(Math.random() * 5),
  class: `CNTT${Math.floor(Math.random() * 3) + 1}K${60 + Math.floor(Math.random() * 5)}`,
}));

const StudentListScreen: React.FC = () => {
  const handlePressStudent = (student: Student): void => {
    Alert.alert(
      'Thông tin sinh viên',
      `Tên: ${student.name}\nTuổi: ${student.age}\nLớp: ${student.class}`,
    );
  };

  const renderItem: ListRenderItem<Student> = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handlePressStudent(item)}
      activeOpacity={0.7}>
      <View style={styles.itemContent}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.info}>
          <Text style={styles.infoText}>🎂 {item.age} tuổi</Text>
          <Text style={styles.infoText}>📚 {item.class}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách Sinh viên</Text>
        <Text style={styles.subHeader}>Tổng: {students.length} sinh viên</Text>
      </View>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default StudentListScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ListRenderItem,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface EditModal {
  visible: boolean;
  id: string | null;
  text: string;
}

const STORAGE_KEY = '@todos';

const TodoScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [editModal, setEditModal] = useState<EditModal>({
    visible: false,
    id: null,
    text: '',
  });

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const loadTodos = async (): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setTodos(JSON.parse(data));
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const saveTodos = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const addTodo = (): void => {
    if (!inputText.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung công việc');
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  const toggleTodo = (id: string): void => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string): void => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa công việc này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setTodos(todos.filter(todo => todo.id !== id));
        },
      },
    ]);
  };

  const openEditModal = (id: string, text: string): void => {
    setEditModal({ visible: true, id, text });
  };

  const saveEdit = (): void => {
    if (!editModal.text.trim()) {
      Alert.alert('Thông báo', 'Nội dung không được để trống');
      return;
    }
    setTodos(
      todos.map(todo =>
        todo.id === editModal.id
          ? { ...todo, text: editModal.text.trim() }
          : todo,
      ),
    );
    setEditModal({ visible: false, id: null, text: '' });
  };

  const renderItem: ListRenderItem<Todo> = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => toggleTodo(item.id)}
        activeOpacity={0.7}>
        <View
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item.id, item.text)}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTodo(item.id)}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách công việc</Text>
        <Text style={styles.subHeader}>
          {completedCount}/{todos.length} hoàn thành
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Thêm công việc mới..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có công việc nào</Text>
          </View>
        }
      />

      <Modal
        visible={editModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEditModal({ visible: false, id: null, text: '' })
        }>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa công việc</Text>
            <TextInput
              style={styles.modalInput}
              value={editModal.text}
              onChangeText={text => setEditModal({ ...editModal, text })}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() =>
                  setEditModal({ visible: false, id: null, text: '' })
                }>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}>
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Lưu
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#673AB7',
    padding: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#673AB7',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  todoItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#673AB7',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#673AB7',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginLeft: 4,
  },
  editButtonText: {
    fontSize: 20,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#673AB7',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TodoScreen;
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>👤</Text>
      <Text style={styles.name}>tuan</Text>
      <Text style={styles.email}>tuan@gmail.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  avatar: { fontSize: 80, marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  email: { fontSize: 16, color: '#666' },
});
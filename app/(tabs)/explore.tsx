import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <IconSymbol name="sparkles" size={60} color="#4F86F7" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>Explore Dashboard</Text>
        <Text style={styles.subtitle}>Discover features and examples</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFFAE5' }]}>
          <IconSymbol name="folder" size={40} color="#F5A623" />
          <Text style={styles.cardTitle}>File-based Routing</Text>
          <Text style={styles.cardText}>Learn how screens and layouts are structured in the app.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#E6F7FF' }]}>
          <IconSymbol name="slider" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Cross-platform</Text>
          <Text style={styles.cardText}>Run this app on Android, iOS, and Web seamlessly.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#FEE6F2' }]}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={{ width: 60, height: 60, marginBottom: 8 }}
          />
          <Text style={styles.cardTitle}>Images & Icons</Text>
          <Text style={styles.cardText}>Use @2x/@3x for different screen densities.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
          <IconSymbol name="moon-stars" size={40} color="#43A047" />
          <Text style={styles.cardTitle}>Light & Dark Mode</Text>
          <Text style={styles.cardText}>Supports color schemes automatically.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <IconSymbol name="animation" size={40} color="#FB8C00" />
          <Text style={styles.cardTitle}>Animations</Text>
          <Text style={styles.cardText}>Example animated components using Reanimated.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  cardsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});

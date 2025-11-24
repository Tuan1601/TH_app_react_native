
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Dimensions,
  ListRenderItem,
} from 'react-native';

const { width } = Dimensions.get('window');
const imageWidth = (width - 48) / 3;

interface ImageItem {
  id: string;
  url: string;
}

const images: ImageItem[] = [
  { id: '1', url: 'https://picsum.photos/400/400?random=1' },
  { id: '2', url: 'https://picsum.photos/400/400?random=2' },
  { id: '3', url: 'https://picsum.photos/400/400?random=3' },
  { id: '4', url: 'https://picsum.photos/400/400?random=4' },
  { id: '5', url: 'https://picsum.photos/400/400?random=5' },
  { id: '6', url: 'https://picsum.photos/400/400?random=6' },
  { id: '7', url: 'https://picsum.photos/400/400?random=7' },
  { id: '8', url: 'https://picsum.photos/400/400?random=8' },
  { id: '9', url: 'https://picsum.photos/400/400?random=9' },
  { id: '10', url: 'https://picsum.photos/400/400?random=10' },
  { id: '11', url: 'https://picsum.photos/400/400?random=11' },
  { id: '12', url: 'https://picsum.photos/400/400?random=12' },
];

const ImageGalleryScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number): void => {
    setSelectedIndex(index);
  };

  const closeModal = (): void => {
    setSelectedIndex(null);
  };

  const goToNext = (): void => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goToPrevious = (): void => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const renderItem: ListRenderItem<ImageItem> = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => openImage(index)}
      activeOpacity={0.8}>
      <Image source={{ uri: item.url }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Thư viện ảnh</Text>
        <Text style={styles.subHeader}>{images.length} ảnh</Text>
      </View>

      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />

      <Modal
        visible={selectedIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {selectedIndex !== null && (
            <>
              <Image
                source={{ uri: images[selectedIndex].url }}
                style={styles.fullImage}
                resizeMode="contain"
              />

              <View style={styles.navigation}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    selectedIndex === 0 && styles.navButtonDisabled,
                  ]}
                  onPress={goToPrevious}
                  disabled={selectedIndex === 0}>
                  <Text style={styles.navButtonText}>←</Text>
                </TouchableOpacity>

                <Text style={styles.counter}>
                  {selectedIndex + 1} / {images.length}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.navButton,
                    selectedIndex === images.length - 1 &&
                      styles.navButtonDisabled,
                  ]}
                  onPress={goToNext}
                  disabled={selectedIndex === images.length - 1}>
                  <Text style={styles.navButtonText}>→</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    backgroundColor: '#E91E63',
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
  grid: {
    padding: 12,
  },
  imageContainer: {
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumbnail: {
    width: imageWidth,
    height: imageWidth,
    backgroundColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullImage: {
    width: width,
    height: width,
  },
  navigation: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 40,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  counter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImageGalleryScreen;
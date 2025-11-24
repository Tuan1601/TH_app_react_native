// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import tất cả màn hình
import ArticlesScreen from '../../src/screens/ArticlesScreen';
import CountdownScreen from '../../src/screens/CountdownScreen';
import ImageGalleryScreen from '../../src/screens/ImageGalleryScreen';
import LoginScreen from '../../src/screens/LoginScreen';
import StudentListScreen from '../../src/screens/StudentListScreen';
import TodoScreen from '../../src/screens/TodoScreen';
import WeatherScreen from '../../src/screens/WeatherScreen';

type ScreenType = 'StudentList' | 'Login' | 'Countdown' | 'Todo' | 'Gallery' | 'Weather' | 'Articles' | null;

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(null);

  const testScreens = [
    { id: 1, name: 'Bài 1: Danh sách sinh viên', screen: 'StudentList' as ScreenType },
    { id: 2, name: 'Bài 2: Form đăng nhập', screen: 'Login' as ScreenType },
    { id: 3, name: 'Bài 3: Đồng hồ đếm ngược', screen: 'Countdown' as ScreenType },
    { id: 4, name: 'Bài 4: To-Do App', screen: 'Todo' as ScreenType },
    { id: 5, name: 'Bài 5: Image Gallery', screen: 'Gallery' as ScreenType },
    { id: 6, name: 'Bài 6: API Thời tiết', screen: 'Weather' as ScreenType },
    { id: 8, name: 'Bài 8: Danh sách bài viết', screen: 'Articles' as ScreenType },
  ];

  const renderScreen = () => {
    switch(currentScreen) {
      case 'StudentList': return <StudentListScreen />;
      case 'Login': return <LoginScreen />;
      case 'Countdown': return <CountdownScreen />;
      case 'Todo': return <TodoScreen />;
      case 'Gallery': return <ImageGalleryScreen />;
      case 'Weather': return <WeatherScreen />;
      case 'Articles': return <ArticlesScreen />;
      default: return null;
    }
  };

  if (currentScreen) {
    return (
      <View style={styles.screenContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen(null)}
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        {renderScreen()}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📚 Danh sách bài tập</Text>
      {testScreens.map(screen => (
        <TouchableOpacity
          key={screen.id}
          style={styles.item}
          onPress={() => setCurrentScreen(screen.screen)}
        >
          <Text style={styles.itemText}>{screen.name}</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenContainer: {
    flex: 1,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
  },
});
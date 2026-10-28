import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BookProvider} from './src/context/BookContext';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <BookProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </BookProvider>
    </SafeAreaProvider>
  );
}

export default App;

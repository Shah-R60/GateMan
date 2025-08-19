import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/Screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}

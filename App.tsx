import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/Screens/HomeScreen';
import SignUp from './src/Auth/signUp';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    console.log('User authenticated, navigating to HomeScreen');
    setIsAuthenticated(true);
  };

  return (
    <SafeAreaProvider>
      {/* {isAuthenticated ? (
        <HomeScreen />
      ) : (
        <SignUp onLoginSuccess={handleLoginSuccess} />
      )} */}
      <HomeScreen/>
    </SafeAreaProvider>
  );
}

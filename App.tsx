import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/Screens/HomeScreen';
import SignUp from './src/Auth/signUp';
import { CityProvider } from './src/context/CityContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    console.log('User authenticated, navigating to HomeScreen');
    setIsAuthenticated(true);
  };

  return (
    <SafeAreaProvider>
      <CityProvider>
        {/* {isAuthenticated ? (
          <HomeScreen />
        ) : (
          <SignUp onLoginSuccess={handleLoginSuccess} />
        )} */}
        <HomeScreen/>
      </CityProvider>
    </SafeAreaProvider>
  );
}

import React from 'react';
import {useFonts} from 'expo-font';
import App from './App';

export default function AppWeb() {
  const [fontsLoaded] = useFonts({
    'tabler-icons': require('../assets/fonts/tabler-icons.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <App />;
}

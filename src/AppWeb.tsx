import React from 'react';
import {useFonts} from 'expo-font';
import App from './App';
import {genericPlatform} from './utils/platform';

export default function AppWeb() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  /**
   * On web we render the app as soon as possible, without waiting for the fonts.
   */
  if (!fontsLoaded && genericPlatform === 'desktop') {
    return null;
  }

  return <App />;
}

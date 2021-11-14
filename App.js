import React, {Suspense} from 'react';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import Router from './src/routes/Router';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import EN from './src/locales/en';
import IT from './src/locales/it';

import {store} from './src/store/store';

i18n.use(initReactI18next).init({
  resources: {
    en: {translation: EN},
    it: {translation: IT},
  },
  lng: 'it',
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
});

export default function App() {
  return (
    <Suspense fallback="Loading...">
      <Provider store={store}>
        <Router />
        <FlashMessage position="top" />
      </Provider>
    </Suspense>
  );
}

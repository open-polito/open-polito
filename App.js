import React, {Suspense, useEffect, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import Router from './src/routes/Router';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import EN from './src/locales/en';
import IT from './src/locales/it';
import * as RNLocalize from 'react-native-localize';

import 'moment/locale/it';

import {store} from './src/store/store';
import moment from 'moment';

let lng = '';
if (RNLocalize.getLocales()[0].languageCode === 'it') {
  lng = 'it';
} else {
  lng = 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: {translation: EN},
    it: {translation: IT},
  },
  lng: lng,
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
  debug: false,
});

moment.locale(lng);

export default function App() {
  useEffect(() => {
    RNLocalize.addEventListener('change', setNewLocale);
    return () => {
      RNLocalize.removeEventListener('change', setNewLocale);
    };
  }, []);

  const setNewLocale = () => {
    if (RNLocalize.getLocales()[0].languageCode === 'it') {
      i18n.changeLanguage('it');
    } else {
      i18n.changeLanguage('en');
    }
  };

  return (
    <Suspense fallback="Loading...">
      <Provider store={store}>
        <Router />
        <FlashMessage position="top" />
      </Provider>
    </Suspense>
  );
}

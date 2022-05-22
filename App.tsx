import React, {Suspense, useEffect} from 'react';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import Router from './src/routes/Router';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import EN from './src/locales/en';
import IT from './src/locales/it';
import * as RNLocalize from 'react-native-localize';

import 'moment/locale/it';

import store from './src/store/store';
import moment from 'moment';
import {Device} from 'open-polito-api/device';
import DeviceProvider from './src/context/Device';
import Dialog from './src/components/dialogs/Dialog';
import {
  RenderHTMLConfigProvider,
  TRenderEngineProvider,
} from 'react-native-render-html';
import Toast from './src/ui/Toast';

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

// Device instance to pass to Context API for global use
const defaultDevice = new Device('', 10000, () => {});

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
      moment.locale('it');
    } else {
      i18n.changeLanguage('en');
      moment.locale('en');
    }
  };

  return (
    <Suspense fallback="Loading...">
      <Provider store={store}>
        <DeviceProvider device={defaultDevice}>
          <TRenderEngineProvider
            tagsStyles={{
              body: {
                color: '#555',
              },
              p: {
                marginTop: 0,
              },
            }}>
            <RenderHTMLConfigProvider>
              <Router />
              <Toast />
              <Dialog />
            </RenderHTMLConfigProvider>
          </TRenderEngineProvider>
        </DeviceProvider>
        <FlashMessage position="top" />
      </Provider>
    </Suspense>
  );
}

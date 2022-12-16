import {changeLanguage, use} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import EN from '../locales/en';
import IT from '../locales/it';

import moment from 'moment';
import 'moment/locale/it';

export type LanguageCode = 'it' | 'en';

export const initI18n = () => {
  const code = getLanguageCode();

  use(initReactI18next).init({
    resources: {
      en: {translation: EN},
      it: {translation: IT},
    },
    lng: code,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });
};

export const getLanguageCode = (): LanguageCode =>
  getLocales()[0].languageCode === 'it' ? 'it' : 'en';

export const languageChangeEventHandler = () => {
  const code = getLanguageCode();
  changeLanguage(code);
  setMomentLocale(code);
};

export const setMomentLocale = (code: LanguageCode) => {
  moment.locale(code);
};

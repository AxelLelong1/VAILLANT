import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationFR from './locals/french.json';
import translationLT from './locals/lithuanian.json';

const resources = {
  fr: {
    translation: translationFR
  },
  lt: {
    translation: translationLT
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'fr',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

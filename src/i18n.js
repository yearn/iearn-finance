import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';
import translationJA from './locales/ja/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  },
  ja: {
    translation: translationJA
  }
};

i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

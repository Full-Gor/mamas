import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translations
import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  ru: { translation: ru },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
};

// Detect device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

// Map to supported languages
const getSupportedLanguage = (lang: string): string => {
  const supported = ['fr', 'en', 'es', 'ru', 'zh', 'ja', 'ar'];
  if (supported.includes(lang)) return lang;
  // Fallback mappings
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ar')) return 'ar';
  return 'en'; // Default fallback
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSupportedLanguage(deviceLanguage),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;

// Export language utilities
export const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const changeLanguage = (langCode: string) => {
  i18n.changeLanguage(langCode);
};

export const getCurrentLanguage = () => i18n.language;

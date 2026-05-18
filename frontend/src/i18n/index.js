import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zh from './locales/zh.json'

const STORAGE_KEY = 'vds.locale'
const DEFAULT_LOCALE = 'en'

function readStoredLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE
}

function applyDocumentLang(lng) {
  document.documentElement.lang = lng === 'zh' ? 'zh-CN' : 'en'
}

const initialLocale = readStoredLocale()

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: initialLocale,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

applyDocumentLang(initialLocale)

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    /* ignore */
  }
  applyDocumentLang(lng)
  document.title = i18n.t('app.title')
})

document.title = i18n.t('app.title')

export function setLocale(lng) {
  return i18n.changeLanguage(lng)
}

export default i18n

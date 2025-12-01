import { createI18n } from 'vue-i18n'

// Import translation files
import en from './locales/en.js'
import pt from './locales/pt.js'
import fr from './locales/fr.js'

const messages = {
  en,
  pt,
  fr
}

// Get saved language from localStorage or default to Portuguese
const savedLanguage = localStorage.getItem('language') || 'pt'

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: savedLanguage,
  fallbackLocale: 'pt',
  messages
})

export default i18n

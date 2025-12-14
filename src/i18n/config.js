import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationFR from './locales/fr.json'
import translationAR from './locales/ar.json'

const resources = {
  fr: {
    translation: translationFR
  },
  ar: {
    translation: translationAR
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // langue par défaut
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })

export default i18n

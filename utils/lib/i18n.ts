import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { about as about_en, faq as faq_en, helpcenter as helpcenter_en, settings_en, terms_en } from './locales/en/settings'
import { faq as faq_fil, about as about_fil, helpcenter as helpcenter_fil, terms_fil, settings_fil } from './locales/fil/settings'
import { weatheralert_en } from './locales/en/home'
import { weatheralert_fil } from './locales/fil/home'
import { drying_en, lessons_en } from './locales/en/drying'
import { drying_fil, lessons_fil } from './locales/fil/drying'

const i18n = createInstance()

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        start_drying: 'Start Drying',
        finish_drying: 'Finish Drying',
        harvested: 'Harvested',
        language: 'Language',
        english: 'English',
        filipino: 'Filipino',
        settings: 'Settings',
        logout: 'Logout',
        preferences: 'Preferences',

        ...faq_en,
        ...about_en,
        ...helpcenter_en,
        ...terms_en,
        ...settings_en,
        ...weatheralert_en,
        ...drying_en,
        ...lessons_en
      },
    },
    fil: {
      translation: {
        start_drying: 'Simulan ang Pagpapatuyo',
        finish_drying: 'Tapusin ang Pagpapatuyo',
        harvested: 'Na-ani',
        language: 'Wika',
        english: 'Ingles',
        filipino: 'Filipino',
        settings: 'Mga Setting',
        logout: 'Mag-logout',
        preferences: 'Mga Kagustuhan',

        ...faq_fil,
        ...about_fil,
        ...helpcenter_fil,
        ...terms_fil,
        ...settings_fil,
        ...weatheralert_fil,
        ...drying_fil,
        ...lessons_fil
      },
    },
  },
})

export default i18n
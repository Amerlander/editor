import { createI18n } from 'vue-i18n'

import de_DE from './locales/de-DE.json'
import en_US from './locales/en-US.json'
import zh_CN from './locales/zh-CN.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'de-DE',
  defaultLocale: 'de-DE',
  fallbackLocale: ['en-US', 'zh-CN'],
  warnHtmlMessage: false,
  messages: {
    'de-DE': de_DE,
    'en-US': en_US,
    'zh-CN': zh_CN,
  },
})

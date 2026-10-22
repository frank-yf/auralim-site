// Interface languages supported by the native app; website routes remain bilingual.
export const supportedAppLanguages = [
  { locale: 'en', name: 'English' },
  { locale: 'zh-Hans', name: '简体中文' },
  { locale: 'ja', name: '日本語' },
  { locale: 'zh-Hant', name: '繁體中文' },
  { locale: 'de', name: 'Deutsch' },
  { locale: 'fr', name: 'Français' },
  { locale: 'es', name: 'Español' },
  { locale: 'pt-BR', name: 'Português (Brasil)' },
  { locale: 'ko', name: '한국어' },
  { locale: 'it', name: 'Italiano' },
  { locale: 'ru', name: 'Русский' },
  { locale: 'nl', name: 'Nederlands' },
] as const;

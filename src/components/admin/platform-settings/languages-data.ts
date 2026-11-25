import type { LanguageItem } from './types'

export const INITIAL_CONFIGURED_LANGUAGES: LanguageItem[] = [
  {
    id: 'lang-en',
    name: 'English',
    code: 'EN',
    isDefault: true,
    status: 'active',
    appliesTo: 'Website and Mobile App',
    direction: 'ltr',
  },
  {
    id: 'lang-es',
    name: 'Spanish',
    code: 'ES',
    isDefault: false,
    status: 'active',
    appliesTo: 'Website and Mobile App',
    direction: 'ltr',
  },
]

export const SUGGESTED_LANGUAGES = [
  { name: 'English', code: 'EN', direction: 'ltr' },
  { name: 'Arabic', code: 'AR', direction: 'rtl' },
  { name: 'Spanish', code: 'ES', direction: 'ltr' },
  { name: 'French', code: 'FR', direction: 'ltr' },
  { name: 'German', code: 'DE', direction: 'ltr' },
  { name: 'Italian', code: 'IT', direction: 'ltr' },
  { name: 'Portuguese', code: 'PT', direction: 'ltr' },
  { name: 'Russian', code: 'RU', direction: 'ltr' },
  { name: 'Turkish', code: 'TR', direction: 'ltr' },
  { name: 'Bengali', code: 'BN', direction: 'ltr' },
  { name: 'Hindi', code: 'HI', direction: 'ltr' },
  { name: 'Chinese (Simplified)', code: 'ZH', direction: 'ltr' },
  { name: 'Japanese', code: 'JA', direction: 'ltr' },
]

import { Building2, Globe, Coins, Receipt, FileText } from 'lucide-react'
import type {
  BusinessDetailsConfig,
  TaxDefaultsConfig,
  PlatformSettingsSection,
  OtherSettingsCard,
  LanguageItem,
  ExchangeRateItem,
  DisplayCurrencyItem,
  CancellationPolicy,
} from './types'

export const EMPTY_TAX_DEFAULT_VALUES = {
  taxLabel: '',
  defaultRate: '',
}

export const DEMO_TAX_DEFAULT_VALUES = {
  taxLabel: 'Demo Tax Label',
  defaultRate: '5',
}

export const INITIAL_TAX_DEFAULTS: TaxDefaultsConfig = {
  isConfigured: false,
  taxName: 'Standard VAT',
  taxRate: 10.0,
  taxType: 'VAT',
  taxNumber: 'TAX-AW-2026',
  calculationMethod: 'inclusive',
  scope: 'All Services',
  appliesTo: ['Flights', 'Hotels', 'Activities'],
  pricingEngineNote: 'Applied at checkout by default',
  lastUpdated: '1 Sep 2026',
  isActive: true,
}

export const SAMPLE_CANCELLATION_POLICY: CancellationPolicy = {
  id: 'policy-demo',
  name: 'Demo Policy',
  text: 'What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
}

export const TAX_TYPE_OPTIONS = ['VAT', 'GST', 'Sales Tax', 'Service Tax', 'Custom'] as const

export const CALCULATION_METHOD_OPTIONS = [
  { value: 'inclusive', label: 'Inclusive (included in base price)' },
  { value: 'exclusive', label: 'Exclusive (added on top of total)' },
]

export const SERVICE_SCOPE_OPTIONS = [
  'All Services',
  'Flights Only',
  'Hotels Only',
  'Packages Only',
  'Activities & Tours',
]

export const INITIAL_CANCELLATION_POLICY: CancellationPolicy = {
  name: 'Demo Policy',
  text: 'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
}

export const INITIAL_BUSINESS_DETAILS: BusinessDetailsConfig = {
  businessName: 'Aero Wing',
  isSampleData: true,
  legalName: 'Aero Wing Travel Solutions Ltd.',
  registrationNumber: 'AW-CORP-2026-88',
  supportEmail: 'admin@aerowing.com',
  supportPhone: '+1 (800) 555-0199',
  headquartersAddress: '742 Aviation Boulevard, Suite 100, New York, NY 10001',
  primaryCurrency: 'USD ($)',
  timezone: 'UTC-05:00 Eastern Time (US & Canada)',
  websiteUrl: 'https://admin.aerowing.com',
}

export const INITIAL_LANGUAGES: LanguageItem[] = [
  {
    id: 'lang-en',
    code: 'en',
    name: 'English',
    nativeName: 'English (US)',
    isDefault: true,
    isActive: true,
  },
  {
    id: 'lang-es',
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    isDefault: false,
    isActive: true,
  },
  {
    id: 'lang-fr',
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isDefault: false,
    isActive: true,
  },
  {
    id: 'lang-ar',
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isDefault: false,
    isActive: true,
  },
]

export const SAMPLE_CONFIRMED_LANGUAGES: LanguageItem[] = INITIAL_LANGUAGES

export const INITIAL_EXCHANGE_RATES: ExchangeRateItem[] = [
  {
    id: 'rate-1',
    fromCurrency: 'USD',
    toCurrency: 'ERO',
    rate: '123',
  },
]

export const INITIAL_DISPLAY_CURRENCIES: DisplayCurrencyItem[] = [
  {
    id: 'curr-usd',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    isPrimary: true,
  },
]

export const AVAILABLE_CURRENCY_OPTIONS = [
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'ERO', name: 'Euro (€)', symbol: '€' },
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar (C$)', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham (AED)', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal (SAR)', symbol: '﷼' },
  { code: 'BDT', name: 'Bangladeshi Taka (৳)', symbol: '৳' },
]

export const SETTINGS_NAVIGATION_SECTIONS: PlatformSettingsSection[] = [
  {
    id: 'business-details',
    title: 'Business Details',
    href: '/platform-settings?section=business-details',
    icon: Building2,
    active: true,
  },
  {
    id: 'languages',
    title: 'Languages',
    href: '/platform-settings?section=languages',
    icon: Globe,
    active: false,
  },
  {
    id: 'currencies',
    title: 'Currencies & Exchange Rates',
    displayTitle: 'Currencies & Exchange\nRates',
    href: '/platform-settings?section=exchange-rates',
    icon: Coins,
    active: false,
  },
  {
    id: 'taxes',
    title: 'Tax Defaults',
    href: '/platform-settings?section=taxes',
    icon: Receipt,
    active: false,
  },
  {
    id: 'cancellation',
    title: 'Default Cancellation Policies',
    displayTitle: 'Default Cancellation\nPolicies',
    href: '/platform-settings?section=cancellation',
    icon: FileText,
    active: false,
  },
]

export const OTHER_SETTINGS_CARDS: OtherSettingsCard[] = [
  {
    id: 'languages',
    title: 'Languages',
    description: 'Manage platform languages.',
    href: '/platform-settings?section=languages',
    icon: Globe,
  },
  {
    id: 'currencies',
    title: 'Currencies & Exchange Rates',
    description: 'Manage supported currencies and conversion rates.',
    href: '/platform-settings?section=exchange-rates',
    icon: Coins,
  },
  {
    id: 'taxes',
    title: 'Tax Defaults',
    description: 'Manage default tax configuration.',
    href: '/platform-settings?section=taxes',
    icon: Receipt,
  },
  {
    id: 'cancellation',
    title: 'Default Cancellation Policies',
    description: 'Manage default cancellation-policy configuration.',
    href: '/platform-settings?section=cancellation',
    icon: FileText,
  },
]

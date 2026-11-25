import type { LucideIcon } from 'lucide-react'

export interface BusinessDetailsConfig {
  businessName: string
  isSampleData: boolean
  legalName?: string
  registrationNumber?: string
  supportEmail?: string
  supportPhone?: string
  headquartersAddress?: string
  primaryCurrency?: string
  timezone?: string
  websiteUrl?: string
}

export interface PlatformSettingsSection {
  id: string
  title: string
  displayTitle?: string
  description?: string
  href: string
  icon: LucideIcon
  active?: boolean
}

export interface OtherSettingsCard {
  id: string
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export interface LanguageItem {
  id: string
  name: string
  code?: string
  nativeName?: string
  isDefault?: boolean
  isActive?: boolean
  isNew?: boolean
  status?: 'active' | 'inactive'
  appliesTo?: string
  direction?: string
}

export interface LanguagesConfig {
  languages: LanguageItem[]
  appliesTo: string
  translationsNote: string
}

export interface LanguagesSettingsViewProps {
  initialNodeId?: string
  initialConfiguring?: boolean
  initialLanguages?: LanguageItem[]
  onSave?: (languages: LanguageItem[]) => void
}

export interface BusinessDetailsPageProps {
  initialNodeId?: string
  initialSection?: string
  initialEditOpen?: boolean
  businessData?: Partial<BusinessDetailsConfig>
  onUpdateBusinessDetails?: (updated: BusinessDetailsConfig) => void
}

export interface EditBusinessDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: BusinessDetailsConfig
  onSave: (data: BusinessDetailsConfig) => void
}

export interface LanguagesPageProps {
  initialNodeId?: string
  initialSection?: string
  initialMode?: string
  initialConfigureMode?: boolean
  initialConfigureOpen?: boolean
  languages?: LanguageItem[]
  initialLanguages?: LanguageItem[]
  onUpdateLanguages?: (languages: LanguageItem[]) => void
  onSaveLanguages?: (languages: LanguageItem[]) => void
}

export interface ExchangeRateItem {
  id: string
  fromCurrency: string
  toCurrency: string
  rate: string
  isNew?: boolean
}

export interface DisplayCurrencyItem {
  id: string
  code: string
  name: string
  symbol: string
  isPrimary?: boolean
}

export interface CurrenciesExchangeRatesPageProps {
  initialNodeId?: string
  initialSection?: string
  initialTab?: 'display-currencies' | 'exchange-rates'
  initialEditMode?: boolean
  initialEmpty?: boolean
  initialSuccessOpen?: boolean
  exchangeRates?: ExchangeRateItem[]
  displayCurrencies?: DisplayCurrencyItem[]
  onSaveExchangeRates?: (rates: ExchangeRateItem[]) => void
  onSaveDisplayCurrencies?: (currencies: DisplayCurrencyItem[]) => void
}

export interface TaxDefaultsConfig {
  isConfigured: boolean
  taxName: string
  taxRate: number
  taxType: string
  taxNumber: string
  calculationMethod: string
  scope: string
  appliesTo: string[]
  pricingEngineNote: string
  lastUpdated: string
  isActive: boolean
}

export interface CancellationPolicy {
  id?: string
  name: string
  text: string
}

export type CancellationPoliciesMode = 'empty' | 'form' | 'configure' | 'view'

export interface CancellationPoliciesPageProps {
  initialNodeId?: string
  initialSection?: string
  initialMode?: CancellationPoliciesMode
  initialPolicy?: CancellationPolicy | null
  onSavePolicy?: (policy: CancellationPolicy) => void
}

export interface TaxDefaultValues {
  taxLabel: string
  defaultRate: string
}

export type TaxDefaultsMode = 'empty' | 'add' | 'view'

export interface TaxDefaultsPageProps {
  initialNodeId?: string
  initialSection?: string
  initialMode?: TaxDefaultsMode
  initialValues?: TaxDefaultValues | null
  onSave?: (values: TaxDefaultValues) => void
}

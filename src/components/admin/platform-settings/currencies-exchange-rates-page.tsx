import * as React from 'react'
import {
  Coins,
  Link2,
  TrendingUp,
  Pencil,
  ChevronRight,
  Info,
  CreditCard,
  Monitor,
  Check,
  DollarSign,
  Plus,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { SidebarProvider } from '#/components/ui/sidebar'
import { AdminSidebar } from '../admin-sidebar'
import { AdminHeader } from '../admin-header'
import {
  AVAILABLE_CURRENCY_OPTIONS,
  INITIAL_DISPLAY_CURRENCIES,
  INITIAL_EXCHANGE_RATES,
  SETTINGS_NAVIGATION_SECTIONS,
} from './data'
import type {
  CurrenciesExchangeRatesPageProps,
  DisplayCurrencyItem,
  ExchangeRateItem,
} from './types'
import { cn } from '#/lib/utils'

type CurrencyTab = 'display-currencies' | 'exchange-rates'

interface DraftCurrencyRow {
  id: string
  code: string
}

interface CurrencyView {
  tab: CurrencyTab
  editing: boolean
  empty: boolean
}

function viewFromNode(nodeId?: string): CurrencyView {
  const id = (nodeId ?? '1015-7535').replace(':', '-')
  if (id.includes('7529') || id.includes('7533')) {
    return { tab: 'display-currencies', editing: true, empty: true }
  }
  if (id.includes('7243')) {
    return { tab: 'display-currencies', editing: false, empty: true }
  }
  if (id.includes('7534')) {
    return { tab: 'display-currencies', editing: false, empty: false }
  }
  if (id.includes('7536')) {
    return { tab: 'exchange-rates', editing: true, empty: false }
  }
  if (id.includes('7537')) {
    return { tab: 'exchange-rates', editing: false, empty: false }
  }
  return { tab: 'exchange-rates', editing: false, empty: true }
}

function blankCurrencyRow(): DraftCurrencyRow {
  return { id: `cur-${Date.now()}`, code: '' }
}

function blankRate(): ExchangeRateItem {
  return {
    id: `rate-${Date.now()}`,
    fromCurrency: 'USD',
    toCurrency: 'ERO',
    rate: '',
  }
}

function currencyFromCode(code: string, index: number): DisplayCurrencyItem {
  const normalized = code.trim().toUpperCase()
  const option = AVAILABLE_CURRENCY_OPTIONS.find((item) => item.code === normalized)
  return {
    id: `curr-${normalized}-${index}`,
    code: normalized,
    name: option?.name ?? normalized,
    symbol: option?.symbol ?? normalized,
    isPrimary: index === 0,
  }
}

export function CurrenciesExchangeRatesPage({
  initialNodeId = '1015-7535',
  initialSection = 'currencies',
  initialTab,
  initialEditMode,
  initialEmpty,
  initialSuccessOpen = false,
  exchangeRates: propExchangeRates,
  displayCurrencies: propDisplayCurrencies,
  onSaveExchangeRates,
  onSaveDisplayCurrencies,
}: CurrenciesExchangeRatesPageProps) {
  const resolved = viewFromNode(initialNodeId)
  const startEmpty = initialEmpty ?? resolved.empty
  const startTab = initialTab ?? resolved.tab
  const startEditing = initialEditMode ?? resolved.editing

  const [, setActiveSection] = React.useState(initialSection)
  const [activeTab, setActiveTab] = React.useState<CurrencyTab>(startTab)
  const [isEditing, setIsEditing] = React.useState(startEditing)
  const [showSuccess, setShowSuccess] = React.useState(
    () =>
      initialSuccessOpen ||
      (initialNodeId ?? '').replace(':', '-').includes('7534'),
  )

  const [rates, setRates] = React.useState<ExchangeRateItem[]>(() => {
    if (startEmpty) return []
    if (propExchangeRates && propExchangeRates.length > 0) return propExchangeRates
    return INITIAL_EXCHANGE_RATES
  })
  const [currencies, setCurrencies] = React.useState<DisplayCurrencyItem[]>(() => {
    if (startEmpty) return []
    if (propDisplayCurrencies && propDisplayCurrencies.length > 0) {
      return propDisplayCurrencies
    }
    return INITIAL_DISPLAY_CURRENCIES
  })

  const [rateDrafts, setRateDrafts] = React.useState<ExchangeRateItem[]>(() =>
    startEmpty ? [blankRate()] : rates.length > 0 ? rates : [blankRate()],
  )
  const [currencyDrafts, setCurrencyDrafts] = React.useState<DraftCurrencyRow[]>(() => [
    blankCurrencyRow(),
  ])

  React.useEffect(() => {
    if (!showSuccess) return
    const timer = window.setTimeout(() => setShowSuccess(false), 3200)
    return () => window.clearTimeout(timer)
  }, [showSuccess])

  const openConfigureCurrencies = () => {
    setCurrencyDrafts([blankCurrencyRow()])
    setActiveTab('display-currencies')
    setIsEditing(true)
  }

  const openEditRates = () => {
    setRateDrafts(rates.length > 0 ? rates.map((rate) => ({ ...rate })) : [blankRate()])
    setActiveTab('exchange-rates')
    setIsEditing(true)
  }

  const openEditCurrencies = () => {
    setCurrencyDrafts([blankCurrencyRow()])
    setActiveTab('display-currencies')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setRateDrafts(rates.length > 0 ? rates.map((rate) => ({ ...rate })) : [blankRate()])
    setCurrencyDrafts([blankCurrencyRow()])
  }

  const saveRates = () => {
    const next = rateDrafts.filter(
      (rate) => rate.fromCurrency && rate.toCurrency && rate.rate.trim(),
    )
    setRates(next)
    onSaveExchangeRates?.(next)
    setIsEditing(false)
    setShowSuccess(true)
  }

  const saveCurrencies = () => {
    const codes = currencyDrafts
      .map((row) => row.code.trim().toUpperCase())
      .filter(Boolean)
    const added = codes.map((code, index) =>
      currencyFromCode(code, currencies.length + index),
    )
    const next = [...currencies, ...added]
    if (next.length === 0) {
      setIsEditing(false)
      return
    }
    const normalized = next.map((item, index) => ({
      ...item,
      isPrimary: index === 0,
    }))
    setCurrencies(normalized)
    onSaveDisplayCurrencies?.(normalized)
    setCurrencyDrafts([blankCurrencyRow()])
    setIsEditing(false)
    setActiveTab('display-currencies')
    setShowSuccess(true)
  }

  return (
    <SidebarProvider defaultOpen>
      <div
        className="flex min-h-screen w-full bg-[#F4F6FA]"
        data-node-id={initialNodeId}
      >
        <AdminSidebar currentTab="Platform Settings" />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            breadcrumbs={[
              { label: 'Admin Panel', href: '/admin' },
              {
                label: 'Platform Settings',
                href: '/platform-settings?section=business-details',
              },
              { label: 'Currencies & Exchange Rates', active: true },
            ]}
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
          />

          <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-6 p-7">
            <div className="space-y-1">
              <p className="text-xs font-extrabold tracking-[0.08em] text-[#0267B8] uppercase">
                Platform Settings
              </p>
              <h1 className="text-[30px] leading-[38px] font-extrabold tracking-tight text-[#012A5E]">
                Platform Settings
              </h1>
              <p className="text-[15px] leading-[22.5px] font-medium text-[#4F5B70]">
                Manage core platform configuration.
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <aside
                aria-label="Platform Settings sections"
                className="w-full shrink-0 rounded-[18px] border border-[#DCE2EB] bg-white p-3 shadow-xs lg:w-[260px]"
              >
                <div className="mb-1 px-2.5 pt-1.5 pb-2">
                  <h2 className="text-[11.5px] leading-[17px] font-extrabold tracking-[0.08em] text-[#4F5B70] uppercase">
                    Settings
                  </h2>
                </div>
                <nav className="flex flex-col gap-1">
                  {SETTINGS_NAVIGATION_SECTIONS.map((section) => {
                    const Icon = section.icon
                    const isActive = section.id === 'currencies'
                    return (
                      <a
                        key={section.id}
                        href={section.href}
                        onClick={(event) => {
                          if (section.id === 'currencies') {
                            event.preventDefault()
                            setActiveSection('currencies')
                          }
                        }}
                        className={cn(
                          'group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all',
                          isActive
                            ? 'bg-[#EEF4FB] font-extrabold text-[#012A5E]'
                            : 'font-bold text-[#141B28] hover:bg-slate-50',
                        )}
                      >
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute top-1/2 left-0 w-[3px] -translate-y-1/2 rounded-r-[3px] bg-[#F1C134]',
                              section.displayTitle?.includes('\n')
                                ? 'h-[34px]'
                                : 'h-[26px]',
                            )}
                          />
                        )}
                        <Icon
                          className={cn(
                            'size-4.5 shrink-0',
                            isActive
                              ? 'text-[#0267B8]'
                              : 'text-[#4F5B70] group-hover:text-[#012A5E]',
                          )}
                        />
                        <span className="leading-snug whitespace-pre-line">
                          {section.displayTitle || section.title}
                        </span>
                      </a>
                    )
                  })}
                </nav>
              </aside>

              <div className="w-full min-w-0 flex-1 space-y-5">
                <Card className="gap-4 rounded-[18px] border border-[#DCE2EB] bg-white px-[22px] py-5 shadow-xs ring-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF4FD]">
                      <Link2 className="size-[18px] text-[#0267B8]" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-[16.5px] leading-[23px] font-extrabold text-[#012A5E]">
                        Currencies & Exchange Rates
                      </h2>
                      <p className="text-[13.5px] leading-5 font-medium text-[#4F5B70]">
                        Manage display currencies and the exchange rates used for
                        price conversion.
                      </p>
                    </div>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(value, eventDetails) => {
                      if (eventDetails.reason !== 'none') return
                      if (value !== 'display-currencies' && value !== 'exchange-rates') return
                      setActiveTab(value)
                      setIsEditing(false)
                    }}
                    className="currency-settings-tabs gap-3.5"
                  >
                    <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-[#DCE2EB] bg-transparent p-0">
                      <TabsTrigger
                        value="display-currencies"
                        className="h-[46px] rounded-t-[10px] border-b-[3px] border-transparent px-3.5 text-[15px] leading-[22.5px] font-extrabold text-[#4F5B70] aria-selected:border-[#012A5E] aria-selected:text-[#012A5E] data-[active]:border-[#012A5E] data-[active]:bg-transparent data-[active]:text-[#012A5E] data-[active]:shadow-none"
                      >
                        <Link2 className="size-[17px]" />
                        Display Currencies
                      </TabsTrigger>
                      <TabsTrigger
                        value="exchange-rates"
                        className="h-[46px] rounded-t-[10px] border-b-[3px] border-transparent px-3.5 text-[15px] leading-[22.5px] font-bold text-[#4F5B70] aria-selected:border-[#012A5E] aria-selected:font-extrabold aria-selected:text-[#012A5E] data-[active]:border-[#012A5E] data-[active]:bg-transparent data-[active]:font-extrabold data-[active]:text-[#012A5E] data-[active]:shadow-none"
                      >
                        <TrendingUp className="size-[17px]" />
                        Exchange Rates
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="exchange-rates" className="pt-0">
                      <ExchangeRatesPanel
                        rates={rates}
                        drafts={rateDrafts}
                        isEditing={isEditing && activeTab === 'exchange-rates'}
                        onConfigure={openConfigureCurrencies}
                        onEdit={openEditRates}
                        onCancel={cancelEditing}
                        onSave={saveRates}
                        onChangeDrafts={setRateDrafts}
                      />
                    </TabsContent>

                    <TabsContent value="display-currencies" className="pt-0">
                      <DisplayCurrenciesPanel
                        currencies={currencies}
                        drafts={currencyDrafts}
                        isEditing={isEditing && activeTab === 'display-currencies'}
                        onConfigure={openConfigureCurrencies}
                        onEdit={openEditCurrencies}
                        onCancel={cancelEditing}
                        onSave={saveCurrencies}
                        onChangeDrafts={setCurrencyDrafts}
                      />
                    </TabsContent>
                  </Tabs>
                </Card>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                  <Card className="gap-0 rounded-2xl border border-[#DCE2EB] bg-linear-to-br from-[#F3F8FE] to-white py-0 shadow-xs ring-0">
                    <div className="flex items-start gap-3 px-[18px] py-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF4FD] text-[#0267B8]">
                        <Info className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-[15px] leading-[22.5px] font-extrabold text-[#012A5E]">
                          Display currency vs payment currency
                        </h3>
                        <p className="text-[13.5px] leading-5 font-medium text-[#4F5B70]">
                          Exchange rates control customer-facing price conversion.
                          Payment is charged only in currencies enabled on the
                          Client&apos;s Stripe account.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="gap-0 rounded-2xl border border-[#DCE2EB] bg-white py-0 shadow-xs ring-0">
                    <div className="space-y-4 p-5">
                      <h3 className="text-[15px] leading-[22.5px] font-extrabold text-[#012A5E]">
                        Currency details
                      </h3>
                      <dl className="space-y-3.5">
                        <div className="flex items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF4FD] text-[#0267B8]">
                            <Monitor className="size-4" />
                          </div>
                          <div className="space-y-0.5">
                            <dt className="text-[12.5px] leading-[19px] font-extrabold text-[#4F5B70]">
                              Applies to
                            </dt>
                            <dd className="text-[14.5px] leading-[22px] font-extrabold text-[#141B28]">
                              Customer-facing price display
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF4FD] text-[#0267B8]">
                            <CreditCard className="size-4" />
                          </div>
                          <div className="space-y-0.5">
                            <dt className="text-[12.5px] leading-[19px] font-extrabold text-[#4F5B70]">
                              Payment currencies
                            </dt>
                            <dd className="text-[14.5px] leading-[22px] font-extrabold text-[#141B28]">
                              Payment availability for a currency is controlled
                              separately by the currencies enabled on the
                              Client&apos;s Stripe account.
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

          </main>
          <footer className="mt-auto border-t border-[#DCE2EB] bg-white px-6 py-4 text-xs text-[#64748B] lg:px-8">
            © 2026 AeroWing. All rights reserved.
          </footer>
        </div>

        {showSuccess && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            <button
              type="button"
              role="status"
              aria-live="polite"
              onClick={() => setShowSuccess(false)}
              className="pointer-events-auto flex w-[220px] cursor-pointer flex-col items-center gap-3 rounded-[28px] bg-[#071933] px-8 py-8 text-center text-white shadow-2xl"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-white text-[#071933]">
                <Check className="size-8 stroke-[3]" />
              </span>
              <span className="text-sm font-bold">Currency settings updated</span>
            </button>
          </div>
        )}
      </div>
    </SidebarProvider>
  )
}

function ExchangeRatesPanel({
  rates,
  drafts,
  isEditing,
  onConfigure,
  onEdit,
  onCancel,
  onSave,
  onChangeDrafts,
}: {
  rates: ExchangeRateItem[]
  drafts: ExchangeRateItem[]
  isEditing: boolean
  onConfigure: () => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onChangeDrafts: React.Dispatch<React.SetStateAction<ExchangeRateItem[]>>
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-[#001A3D]">Exchange Rates</h3>
          <p className="text-sm text-[#64748B]">
            Rates used to convert customer-facing display prices between
            configured currencies.
          </p>
        </div>
        {!isEditing && rates.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="h-9 rounded-xl border-[#DCE2EB] bg-white px-3.5 text-sm font-semibold text-[#001A3D] shadow-xs hover:bg-slate-50"
          >
            <Pencil className="size-3.5" />
            Edit Exchange Rates
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-4 sm:p-5">
            {drafts.map((rate) => (
              <div
                key={rate.id}
                className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#141C2E]">
                    From Currency
                  </Label>
                  <Select
                    value={rate.fromCurrency}
                    onValueChange={(value) => {
                      if (!value) return
                      onChangeDrafts((current) =>
                        current.map((item) =>
                          item.id === rate.id ? { ...item, fromCurrency: value } : item,
                        ),
                      )
                    }}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-[#DCE2EB] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_CURRENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.code} value={option.code}>
                          {option.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#141C2E]">
                    To Currency
                  </Label>
                  <Select
                    value={rate.toCurrency}
                    onValueChange={(value) => {
                      if (!value) return
                      onChangeDrafts((current) =>
                        current.map((item) =>
                          item.id === rate.id ? { ...item, toCurrency: value } : item,
                        ),
                      )
                    }}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-[#DCE2EB] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_CURRENCY_OPTIONS.map((option) => (
                        <SelectItem key={`to-${option.code}`} value={option.code}>
                          {option.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#141C2E]">
                    Exchange Rate
                  </Label>
                  <Input
                    value={rate.rate}
                    onChange={(event) => {
                      const value = event.target.value
                      onChangeDrafts((current) =>
                        current.map((item) =>
                          item.id === rate.id ? { ...item, rate: value } : item,
                        ),
                      )
                    }}
                    className="h-10 rounded-xl border-[#DCE2EB] bg-white font-semibold text-[#001A3D]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChangeDrafts((current) =>
                      current.length <= 1
                        ? [blankRate()]
                        : current.filter((item) => item.id !== rate.id),
                    )
                  }
                  className="pb-2.5 text-sm font-semibold text-[#0052CC] hover:underline"
                >
                  Discard new row
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => onChangeDrafts((current) => [...current, blankRate()])}
              className="h-10 rounded-xl border-dashed border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#001A3D] shadow-xs hover:bg-slate-50"
            >
              <Plus className="size-4 text-[#0052CC]" />
              Add Exchange Rate
            </Button>
          </div>
          <EditorActions onCancel={onCancel} onSave={onSave} />
        </div>
      ) : rates.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B]">
            <Link2 className="size-5" />
          </div>
          <h3 className="text-base font-bold text-[#001A3D]">
            No confirmed currency configuration loaded
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
            Configured display currencies and exchange rates will appear here once
            the platform currency configuration is supplied.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onConfigure}
            className="mt-5 h-11 rounded-xl border-[#DCE2EB] bg-white px-5 text-sm font-semibold text-[#001A3D] shadow-xs hover:bg-slate-50"
          >
            <Pencil className="size-4" />
            Configure Currencies
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[#64748B]">
            {rates.length} {rates.length === 1 ? 'exchange rate' : 'exchange rates'}
          </p>
          <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-5 text-[11px] tracking-wider text-[#64748B]">
                    From
                  </TableHead>
                  <TableHead className="px-5 text-[11px] tracking-wider text-[#64748B]">
                    To
                  </TableHead>
                  <TableHead className="px-5 text-right text-[11px] tracking-wider text-[#64748B]">
                    Exchange Rate
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell className="px-5 py-3.5 font-bold text-[#001A3D]">
                      {rate.fromCurrency}
                    </TableCell>
                    <TableCell className="px-5 py-3.5 font-bold text-[#001A3D]">
                      <span className="inline-flex items-center gap-1.5">
                        <ChevronRight className="size-3.5 text-[#94A3B8]" />
                        {rate.toCurrency}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-right font-bold text-[#001A3D]">
                      {rate.rate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

function DisplayCurrenciesPanel({
  currencies,
  drafts,
  isEditing,
  onConfigure,
  onEdit,
  onCancel,
  onSave,
  onChangeDrafts,
}: {
  currencies: DisplayCurrencyItem[]
  drafts: DraftCurrencyRow[]
  isEditing: boolean
  onConfigure: () => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onChangeDrafts: React.Dispatch<React.SetStateAction<DraftCurrencyRow[]>>
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-[15px] leading-[22px] font-extrabold text-[#012A5E]">
            Display Currencies
          </h3>
          <p className="text-[13.5px] leading-5 font-medium text-[#4F5B70]">
            Currencies customers can select for price display.
          </p>
        </div>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={currencies.length === 0 ? onConfigure : onEdit}
            className="h-auto rounded-[11px] border-[#C5CFDC] bg-white px-3.5 py-2 text-sm font-extrabold text-[#012A5E] shadow-none hover:bg-white"
          >
            <Pencil className="size-4" />
            {currencies.length === 0
              ? 'Configure Currencies'
              : 'Edit Currencies'}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-4 sm:p-5">
            {drafts.map((row) => (
              <div key={row.id} className="space-y-2">
                <Label
                  htmlFor={`currency-code-${row.id}`}
                  className="text-sm font-semibold text-[#001A3D]"
                >
                  Currency Code
                </Label>
                <div className="flex items-center justify-between gap-4">
                  <div className="relative w-full max-w-[460px]">
                    <Link2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
                    <Input
                      id={`currency-code-${row.id}`}
                      value={row.code}
                      onChange={(event) => {
                        const value = event.target.value.toUpperCase()
                        onChangeDrafts((current) =>
                          current.map((item) =>
                            item.id === row.id ? { ...item, code: value } : item,
                          ),
                        )
                      }}
                      className="h-11 rounded-xl border-[#D5DEE8] bg-white pl-10 text-sm uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeDrafts((current) =>
                        current.length <= 1
                          ? [blankCurrencyRow()]
                          : current.filter((item) => item.id !== row.id),
                      )
                    }
                    className="shrink-0 cursor-pointer text-sm font-semibold text-[#0052CC] hover:underline"
                  >
                    Discard new row
                  </button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onChangeDrafts((current) => [...current, blankCurrencyRow()])
              }
              className="h-10 rounded-xl border-dashed border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#001A3D] shadow-xs hover:bg-slate-50"
            >
              <Plus className="size-4 text-[#0052CC]" />
              Add Currency
            </Button>
          </div>
          <EditorActions onCancel={onCancel} onSave={onSave} />
        </div>
      ) : currencies.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-[#CBD5E3] bg-[#FAFCFE] px-4 py-[30px] text-center">
          <div className="mb-1.5 flex size-[52px] items-center justify-center rounded-[15px] bg-[#F1F4F8] text-[#0267B8]">
            <Coins className="size-[22px]" />
          </div>
          <h3 className="text-[16.5px] leading-6 font-extrabold text-[#012A5E]">
            No confirmed currency configuration loaded
          </h3>
          <p className="max-w-[640px] px-3.5 text-sm leading-[21px] font-medium text-[#4F5B70]">
            Configured display currencies and exchange rates will appear here
            once the platform currency configuration is supplied.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[#64748B]">
            {currencies.length} {currencies.length === 1 ? 'currency' : 'currencies'}
          </p>
          <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
            {currencies.map((currency) => (
              <div
                key={currency.id}
                className="flex items-center gap-3 border-b border-[#E2E8F0] px-4 py-3.5 last:border-b-0"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-[#EBF3FC] text-[#0052CC]">
                  <DollarSign className="size-4" />
                </div>
                <span className="text-sm font-bold text-[#001A3D]">
                  {currency.symbol} {currency.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EditorActions({
  onCancel,
  onSave,
}: {
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F1F5F9] pt-4">
      <Badge className="h-auto gap-2 rounded-full border-[#FDE68A] bg-[#FEF9C3] px-3 py-1 text-xs font-semibold text-[#854D0E]">
        <span className="size-2 rounded-full bg-[#EAB308]" />
        Unsaved changes
      </Badge>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-10 rounded-xl border-[#DCE2EB] bg-white px-5 text-sm font-semibold text-[#001A3D] shadow-xs hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSave}
          className="h-10 rounded-xl bg-[#001A3D] px-5 text-sm font-semibold text-white hover:bg-[#002654]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}

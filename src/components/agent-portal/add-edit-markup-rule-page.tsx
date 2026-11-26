import * as React from 'react'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Info,
  Shield,
  Sparkles,
  Tag,
  AlertCircle,
  HelpCircle,
  Calculator,
  Percent as PercentIcon,
  Layers,
  Building,
  CheckCircle2,
  Sliders,
  DollarSign,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { cn } from 'cn'

export interface AddEditMarkupRulePageProps {
  initialRuleName?: string
  initialScope?: 'all' | 'specific_service' | 'specific_supplier'
  initialService?: string
  initialSupplier?: string
  initialType?: 'percentage' | 'fixed'
  initialValue?: string
  initialStatus?: 'active' | 'inactive'
  isEdit?: boolean
}

export const TRAVEL_SERVICES = [
  { id: 'flight', name: 'Flight', icon: '✈️' },
  { id: 'hotel', name: 'Hotel', icon: '🏨' },
  { id: 'travel_package', name: 'Travel Package', icon: '🎒' },
  { id: 'activity', name: 'Activity', icon: '🎟️' },
  { id: 'car_rental', name: 'Car Rental', icon: '🚗' },
  { id: 'esim', name: 'eSIM', icon: '📶' },
  { id: 'bus_train', name: 'Bus / Train', icon: '🚆' },
  { id: 'travel_insurance', name: 'Travel Insurance', icon: '🛡️' },
]

export const SUPPLIERS = [
  { id: 'all', name: 'All suppliers' },
  { id: 'amadeus', name: 'Amadeus GDS' },
  { id: 'sabre', name: 'Sabre GDS' },
  { id: 'travelport', name: 'Travelport (Galileo)' },
  { id: 'emirates', name: 'Emirates Direct (NDC)' },
  { id: 'biman', name: 'Biman Bangladesh Airlines' },
  { id: 'hotelbeds', name: 'Hotelbeds Bedbank' },
  { id: 'expedia', name: 'Expedia Partner Solutions' },
]

export function AddEditMarkupRulePage({
  initialRuleName = '',
  initialScope = 'specific_service',
  initialService = '',
  initialSupplier = 'all',
  initialType = 'percentage',
  initialValue = '',
  initialStatus = 'active',
  isEdit = false,
}: AddEditMarkupRulePageProps) {
  const navigate = useNavigate()
  const { isLoading: isSaving, run } = useActionLoading()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  // Form states
  const [ruleName, setRuleName] = React.useState(initialRuleName)
  const [scope, setScope] = React.useState<
    'all' | 'specific_service' | 'specific_supplier'
  >(initialScope)
  const [service, setService] = React.useState(initialService)
  const [supplier, setSupplier] = React.useState(initialSupplier)
  const [markupType, setMarkupType] = React.useState<'percentage' | 'fixed'>(
    initialType,
  )
  const [markupValue, setMarkupValue] = React.useState(initialValue)
  const [status, setStatus] = React.useState<'active' | 'inactive'>(
    initialStatus,
  )

  // Validation & feedback state
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [saveSuccessOpen, setSaveSuccessOpen] = React.useState(false)
  const [savedData, setSavedData] = React.useState<any>(null)

  // Toggle sample data
  const handlePopulateSample = () => {
    setRuleName('Flight Client Markup')
    setScope('specific_service')
    setService('Flight')
    setSupplier('all')
    setMarkupType('percentage')
    setMarkupValue('3.5')
    setStatus('active')
    setErrors({})
  }

  const handleResetForm = () => {
    setRuleName('')
    setScope('specific_service')
    setService('')
    setSupplier('all')
    setMarkupType('percentage')
    setMarkupValue('')
    setStatus('active')
    setErrors({})
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!ruleName.trim()) {
      newErrors.ruleName = 'Rule name is required'
    }

    if (scope === 'specific_service' && !service) {
      newErrors.service = 'Please select a service'
    }

    if (scope === 'specific_supplier' && !supplier) {
      newErrors.supplier = 'Please select a supplier'
    }

    if (!markupValue.trim()) {
      newErrors.markupValue = 'Markup value is required'
    } else if (isNaN(Number(markupValue)) || Number(markupValue) <= 0) {
      newErrors.markupValue = 'Please enter a valid positive number'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstError = Object.keys(newErrors)[0]
      const el = document.getElementById(
        firstError === 'ruleName' ? 'f-name' : 'f-val',
      )
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setErrors({})
    run(() => {
      setSavedData({
        ruleName,
        scope,
        service: scope === 'all' ? 'All Services' : service,
        supplier: scope === 'specific_supplier' ? supplier : 'All suppliers',
        markupType,
        markupValue,
        status,
      })
      setSaveSuccessOpen(true)
    })
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate({ to: '/agent' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#141B28] flex flex-col font-sans">
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <AgentPortalSidebar
          currentActive="Pricing & Markup"
          activePath="/pricing-markup"
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AgentPortalHeader
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
            breadcrumbs={[
              { label: 'Dashboard', active: false },
              { label: 'Pricing & Markup', active: false },
              { label: isEdit ? 'Edit Rule' : 'Add Rule', active: true },
            ]}
          />

          {/* Body Content */}
          <main className="flex-1 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-38 py-6 pb-12 max-w-[1920px] w-full mx-auto">
            <div className="flex flex-col gap-5">
              {/* Back button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#0267B8] hover:text-[#012A5E] transition-colors rounded-lg py-1 px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267B8]"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Back to Pricing & Markup</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePopulateSample}
                    className="text-xs font-semibold text-[#0267B8] bg-white border border-[#DCE2EB] hover:bg-[#F7FAFE] px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                    title="Fill form with sample data"
                  >
                    Load Sample Data
                  </button>
                  {(ruleName || markupValue || service) && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-xs font-medium text-[#4F5B70] hover:text-[#B42318] px-2 py-1 transition-colors"
                      title="Clear form to empty state"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Page Title & Metadata */}
              <section className="flex flex-col gap-1 pb-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#0267B8]">
                  Agent Portal · M2.3 + M2.4 Pricing & Markup
                </p>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                    {isEdit ? 'Edit Markup Rule' : 'Add Markup Rule'}
                  </h1>
                </div>
                <p className="text-sm text-[#4F5B70]">
                  Create an additional markup rule for client quoting.
                </p>
                <div className="flex items-center gap-2 pt-1 text-sm">
                  <b className="font-bold text-[#141B28]">
                    Skyline Demo Travels Ltd
                  </b>
                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EBEFF5] border-[#DCE2EB] text-[#5F6B80] font-semibold text-xs"
                  >
                    <Tag className="size-3 text-[#5F6B80]" />
                    <span>Sample data</span>
                  </Badge>
                </div>
              </section>

              {/* Two-column Content Container (820px form + 380px aside) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Form Sections A, B, C, D (820px max) */}
                <form
                  onSubmit={handleSave}
                  className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 max-w-205 w-full"
                >
                  {/* SECTION A: Rule Details */}
                  <div
                    id="s-det"
                    className="bg-white rounded-[18px] border border-[#E6EAF0] shadow-xs p-5 sm:p-6 flex flex-col gap-5 transition-shadow hover:shadow-sm"
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-xl bg-[#012A5E] text-[#F1C134] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        A
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-extrabold text-[#012A5E] leading-snug">
                          Rule Details
                        </h2>
                        <p className="text-xs text-[#4F5B70]">
                          Name this rule so it’s easy to find on Pricing &
                          Markup.
                        </p>
                      </div>
                    </div>

                    {/* Section Body */}
                    <div className="flex flex-col gap-4 pt-1">
                      {/* Field: Rule Name */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="f-name"
                            className="text-sm font-bold text-[#141B28]"
                          >
                            Rule Name
                          </Label>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#01559A]">
                            Required
                          </span>
                        </div>
                        <Input
                          id="f-name"
                          value={ruleName}
                          onChange={(e) => {
                            setRuleName(e.target.value)
                            if (errors.ruleName) {
                              setErrors((prev) => ({ ...prev, ruleName: '' }))
                            }
                          }}
                          placeholder="e.g. Flight Client Markup"
                          className={cn(
                            'h-12 rounded-xl border-[#C9D2DF] bg-white px-3.5 text-base text-[#141B28] placeholder:text-[#757575] focus-visible:ring-2 focus-visible:ring-[#0267B8] focus-visible:border-transparent transition-all',
                            errors.ruleName &&
                              'border-[#B42318] ring-1 ring-[#B42318]',
                          )}
                        />
                        {errors.ruleName ? (
                          <p className="text-xs text-[#B42318] flex items-center gap-1 font-medium">
                            <AlertCircle className="size-3.5" />
                            {errors.ruleName}
                          </p>
                        ) : (
                          <small className="text-xs text-[#4F5B70]">
                            Use a name that makes the rule easy to identify.
                          </small>
                        )}
                      </div>

                      {/* Field: Rule Source (Read-only container) */}
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-sm font-bold text-[#141B28]">
                          Rule Source
                        </span>
                        <div className="rounded-xl border border-[#EEF1F5] bg-[#F4F6FA] p-3.5 flex items-start gap-3">
                          <div className="size-8 rounded-lg bg-white border border-[#DCE2EB] text-[#012A5E] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                            <Shield className="size-4" />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Agent configured
                              </b>
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFF6DC] text-[#7A4A06]">
                                <span className="size-1.5 rounded-full bg-[#7A4A06]" />
                                Agent
                              </span>
                            </div>
                            <p className="text-xs text-[#4F5B70]">
                              This rule is managed by Skyline Demo Travels Ltd.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5 pt-0.5 text-xs text-[#4F5B70]">
                          <Info className="size-3.5 shrink-0 text-[#0267B8] mt-0.5" />
                          <span>
                            This page sets your own Agent markup only. Sub-agent
                            markup is managed separately under Sub-agents.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION B: Where This Rule Applies */}
                  <div
                    id="s-where"
                    className="bg-white rounded-[18px] border border-[#E6EAF0] shadow-xs p-5 sm:p-6 flex flex-col gap-5 transition-shadow hover:shadow-sm"
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-xl bg-[#012A5E] text-[#F1C134] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        B
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-extrabold text-[#012A5E] leading-snug">
                          Where This Rule Applies
                        </h2>
                        <p className="text-xs text-[#4F5B70]">
                          Choose the scope for this markup.
                        </p>
                      </div>
                    </div>

                    {/* Section Body */}
                    <div className="flex flex-col gap-4 pt-1">
                      {/* Fieldset: Rule Scope */}
                      <fieldset className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <legend className="text-sm font-bold text-[#141B28]">
                            Rule Scope
                          </legend>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#01559A]">
                            Required
                          </span>
                        </div>

                        {/* Radio options grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Option 1: All Services */}
                          <label
                            onClick={() => {
                              setScope('all')
                              if (errors.service)
                                setErrors((prev) => ({ ...prev, service: '' }))
                            }}
                            className={cn(
                              'cursor-pointer relative rounded-xl border p-3.5 flex flex-col gap-1.5 transition-all text-left select-none',
                              scope === 'all'
                                ? 'bg-[#F7FAFE] border-[#012A5E] ring-1 ring-[#012A5E] shadow-xs'
                                : 'bg-white border-[#D5DDE8] hover:border-[#9AA6B9] hover:bg-gray-50/50',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'size-4 rounded-full border flex items-center justify-center transition-all',
                                  scope === 'all'
                                    ? 'border-[#012A5E] bg-white'
                                    : 'border-[#9AA6B9] bg-white',
                                )}
                              >
                                {scope === 'all' && (
                                  <span className="size-2 rounded-full bg-[#012A5E]" />
                                )}
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                All Services
                              </b>
                            </div>
                            <small className="text-xs text-[#4F5B70] leading-snug pl-6">
                              Apply the Agent markup broadly across service
                              modules.
                            </small>
                          </label>

                          {/* Option 2: Specific Service */}
                          <label
                            onClick={() => setScope('specific_service')}
                            className={cn(
                              'cursor-pointer relative rounded-xl border p-3.5 flex flex-col gap-1.5 transition-all text-left select-none',
                              scope === 'specific_service'
                                ? 'bg-[#F7FAFE] border-[#012A5E] ring-1 ring-[#012A5E] shadow-xs'
                                : 'bg-white border-[#D5DDE8] hover:border-[#9AA6B9] hover:bg-gray-50/50',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'size-4 rounded-full border flex items-center justify-center transition-all',
                                  scope === 'specific_service'
                                    ? 'border-[#012A5E] bg-white'
                                    : 'border-[#9AA6B9] bg-white',
                                )}
                              >
                                {scope === 'specific_service' && (
                                  <span className="size-2 rounded-full bg-[#012A5E]" />
                                )}
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Specific Service
                              </b>
                            </div>
                            <small className="text-xs text-[#4F5B70] leading-snug pl-6">
                              Apply to one selected service module.
                            </small>
                          </label>

                          {/* Option 3: Specific Supplier */}
                          <label
                            onClick={() => setScope('specific_supplier')}
                            className={cn(
                              'cursor-pointer relative rounded-xl border p-3.5 flex flex-col gap-1.5 transition-all text-left select-none',
                              scope === 'specific_supplier'
                                ? 'bg-[#F7FAFE] border-[#012A5E] ring-1 ring-[#012A5E] shadow-xs'
                                : 'bg-white border-[#D5DDE8] hover:border-[#9AA6B9] hover:bg-gray-50/50',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'size-4 rounded-full border flex items-center justify-center transition-all',
                                  scope === 'specific_supplier'
                                    ? 'border-[#012A5E] bg-white'
                                    : 'border-[#9AA6B9] bg-white',
                                )}
                              >
                                {scope === 'specific_supplier' && (
                                  <span className="size-2 rounded-full bg-[#012A5E]" />
                                )}
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Specific Supplier
                              </b>
                            </div>
                            <small className="text-xs text-[#4F5B70] leading-snug pl-6">
                              Apply to a selected supplier context.
                            </small>
                          </label>
                        </div>
                      </fieldset>

                      {/* Dropdown: Service (shown when Specific Service is active, or if Specific Supplier) */}
                      {scope !== 'all' && (
                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="f-svc"
                              className="text-sm font-bold text-[#141B28]"
                            >
                              Service
                            </Label>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#01559A]">
                              Required
                            </span>
                          </div>

                          <Select
                            value={service}
                            onValueChange={(val) => {
                              setService(val)
                              if (errors.service) {
                                setErrors((prev) => ({ ...prev, service: '' }))
                              }
                            }}
                          >
                            <SelectTrigger
                              id="f-svc"
                              className={cn(
                                'h-12 w-full rounded-xl border-[#C9D2DF] bg-white px-3.5 text-base font-semibold text-[#141B28] focus:ring-2 focus:ring-[#0267B8]',
                                errors.service &&
                                  'border-[#B42318] ring-1 ring-[#B42318]',
                              )}
                            >
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#DCE2EB] rounded-xl shadow-lg">
                              {TRAVEL_SERVICES.map((s) => (
                                <SelectItem
                                  key={s.id}
                                  value={s.name}
                                  className="text-sm font-medium py-2.5 cursor-pointer hover:bg-[#F4F6FA] focus:bg-[#EAF4FD]"
                                >
                                  <span className="mr-2">{s.icon}</span>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {errors.service ? (
                            <p className="text-xs text-[#B42318] flex items-center gap-1 font-medium">
                              <AlertCircle className="size-3.5" />
                              {errors.service}
                            </p>
                          ) : (
                            <small className="text-xs text-[#4F5B70]">
                              Select the service module this rule applies to.
                            </small>
                          )}
                        </div>
                      )}

                      {/* Dropdown: Supplier (shown when Specific Supplier is active) */}
                      {scope === 'specific_supplier' && (
                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="f-spl"
                              className="text-sm font-bold text-[#141B28]"
                            >
                              Supplier
                            </Label>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#01559A]">
                              Required
                            </span>
                          </div>

                          <Select
                            value={supplier}
                            onValueChange={(val) => {
                              setSupplier(val)
                              if (errors.supplier) {
                                setErrors((prev) => ({ ...prev, supplier: '' }))
                              }
                            }}
                          >
                            <SelectTrigger
                              id="f-spl"
                              className="h-12 w-full rounded-xl border-[#C9D2DF] bg-white px-3.5 text-base font-semibold text-[#141B28] focus:ring-2 focus:ring-[#0267B8]"
                            >
                              <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#DCE2EB] rounded-xl shadow-lg">
                              {SUPPLIERS.map((sup) => (
                                <SelectItem
                                  key={sup.id}
                                  value={sup.name}
                                  className="text-sm font-medium py-2.5 cursor-pointer hover:bg-[#F4F6FA] focus:bg-[#EAF4FD]"
                                >
                                  {sup.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION C: Markup */}
                  <div
                    id="s-mk"
                    className="bg-white rounded-[18px] border border-[#E6EAF0] shadow-xs p-5 sm:p-6 flex flex-col gap-5 transition-shadow hover:shadow-sm"
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-xl bg-[#012A5E] text-[#F1C134] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        C
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-extrabold text-[#012A5E] leading-snug">
                          Markup
                        </h2>
                        <p className="text-xs text-[#4F5B70]">
                          Your markup is added when quoting customers.
                        </p>
                      </div>
                    </div>

                    {/* Section Body */}
                    <div className="flex flex-col gap-4 pt-1">
                      {/* Fieldset: Markup Type */}
                      <fieldset className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <legend className="text-sm font-bold text-[#141B28]">
                            Markup Type
                          </legend>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#01559A]">
                            Required
                          </span>
                        </div>

                        {/* Radio options grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option 1: Percentage */}
                          <label
                            onClick={() => setMarkupType('percentage')}
                            className={cn(
                              'cursor-pointer relative rounded-xl border p-3.5 flex flex-col gap-1.5 transition-all text-left select-none',
                              markupType === 'percentage'
                                ? 'bg-[#F7FAFE] border-[#012A5E] ring-1 ring-[#012A5E] shadow-xs'
                                : 'bg-white border-[#D5DDE8] hover:border-[#9AA6B9] hover:bg-gray-50/50',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'size-4 rounded-full border flex items-center justify-center transition-all',
                                  markupType === 'percentage'
                                    ? 'border-[#012A5E] bg-white'
                                    : 'border-[#9AA6B9] bg-white',
                                )}
                              >
                                {markupType === 'percentage' && (
                                  <span className="size-2 rounded-full bg-[#012A5E]" />
                                )}
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Percentage
                              </b>
                            </div>
                            <small className="text-xs text-[#4F5B70] leading-snug pl-6">
                              Add a percentage markup when quoting.
                            </small>
                          </label>

                          {/* Option 2: Fixed Amount */}
                          <label
                            onClick={() => setMarkupType('fixed')}
                            className={cn(
                              'cursor-pointer relative rounded-xl border p-3.5 flex flex-col gap-1.5 transition-all text-left select-none',
                              markupType === 'fixed'
                                ? 'bg-[#F7FAFE] border-[#012A5E] ring-1 ring-[#012A5E] shadow-xs'
                                : 'bg-white border-[#D5DDE8] hover:border-[#9AA6B9] hover:bg-gray-50/50',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'size-4 rounded-full border flex items-center justify-center transition-all',
                                  markupType === 'fixed'
                                    ? 'border-[#012A5E] bg-white'
                                    : 'border-[#9AA6B9] bg-white',
                                )}
                              >
                                {markupType === 'fixed' && (
                                  <span className="size-2 rounded-full bg-[#012A5E]" />
                                )}
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Fixed Amount
                              </b>
                            </div>
                            <small className="text-xs text-[#4F5B70] leading-snug pl-6">
                              Add a fixed markup amount when quoting.
                            </small>
                          </label>
                        </div>
                      </fieldset>

                      {/* Field: Markup Value */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="f-val"
                            className="text-sm font-bold text-[#141B28]"
                          >
                            {markupType === 'percentage'
                              ? 'Markup Percentage'
                              : 'Markup Fixed Amount'}
                          </Label>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#01559A]">
                            Required
                          </span>
                        </div>

                        {/* Input with suffix badge matching Figma */}
                        <div className="relative flex items-center w-full max-w-70">
                          <Input
                            id="f-val"
                            type="text"
                            value={markupValue}
                            onChange={(e) => {
                              const val = e.target.value
                              if (/^\d*\.?\d*$/.test(val)) {
                                setMarkupValue(val)
                                if (errors.markupValue) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    markupValue: '',
                                  }))
                                }
                              }
                            }}
                            placeholder={
                              markupType === 'percentage'
                                ? 'Enter percentage'
                                : 'Enter amount'
                            }
                            className={cn(
                              'h-12 rounded-xl border-[#C9D2DF] bg-white pl-4 pr-14 text-lg font-bold text-[#141B28] placeholder:text-[#757575] focus-visible:ring-2 focus-visible:ring-[#0267B8]',
                              errors.markupValue &&
                                'border-[#B42318] ring-1 ring-[#B42318]',
                            )}
                          />
                          <span
                            id="f-val-sfx"
                            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-[9px] bg-[#EEF1F5] text-[#4F5B70] font-extrabold text-sm flex items-center justify-center pointer-events-none border border-[#E6EAF0]"
                          >
                            {markupType === 'percentage' ? '%' : 'BDT'}
                          </span>
                        </div>

                        {errors.markupValue ? (
                          <p className="text-xs text-[#B42318] flex items-center gap-1 font-medium">
                            <AlertCircle className="size-3.5" />
                            {errors.markupValue}
                          </p>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-[#4F5B70]">
                            <Info className="size-3.5 shrink-0 text-[#0267B8]" />
                            <span>
                              {markupType === 'percentage'
                                ? 'Enter the percentage to add when quoting customers.'
                                : 'Enter the fixed amount in BDT to add when quoting customers.'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Fieldset: Status */}
                      <fieldset className="flex flex-col gap-2.5 pt-1">
                        <div className="flex items-center justify-between">
                          <legend className="text-sm font-bold text-[#141B28]">
                            Status
                          </legend>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#01559A]">
                            Required
                          </span>
                        </div>

                        {/* Radio options grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option 1: Active */}
                          <label
                            onClick={() => setStatus('active')}
                            className={cn(
                              'cursor-pointer relative rounded-xl border p-3.5 flex flex-col gap-1.5 transition-all text-left select-none',
                              status === 'active'
                                ? 'bg-[#F7FAFE] border-[#012A5E] ring-1 ring-[#012A5E] shadow-xs'
                                : 'bg-white border-[#D5DDE8] hover:border-[#9AA6B9] hover:bg-gray-50/50',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'size-4 rounded-full border flex items-center justify-center transition-all',
                                  status === 'active'
                                    ? 'border-[#012A5E] bg-white'
                                    : 'border-[#9AA6B9] bg-white',
                                )}
                              >
                                {status === 'active' && (
                                  <span className="size-2 rounded-full bg-[#012A5E]" />
                                )}
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Active
                              </b>
                            </div>
                            <small className="text-xs text-[#4F5B70] leading-snug pl-6">
                              Used when pricing is calculated.
                            </small>
                          </label>

                          {/* Option 2: Inactive */}
                          <label
                            onClick={() => setStatus('inactive')}
                            className={cn(
                              'cursor-pointer relative rounded-xl border p-3.5 flex flex-col gap-1.5 transition-all text-left select-none',
                              status === 'inactive'
                                ? 'bg-[#F7FAFE] border-[#012A5E] ring-1 ring-[#012A5E] shadow-xs'
                                : 'bg-white border-[#D5DDE8] hover:border-[#9AA6B9] hover:bg-gray-50/50',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'size-4 rounded-full border flex items-center justify-center transition-all',
                                  status === 'inactive'
                                    ? 'border-[#012A5E] bg-white'
                                    : 'border-[#9AA6B9] bg-white',
                                )}
                              >
                                {status === 'inactive' && (
                                  <span className="size-2 rounded-full bg-[#012A5E]" />
                                )}
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Inactive
                              </b>
                            </div>
                            <small className="text-xs text-[#4F5B70] leading-snug pl-6">
                              Not used while inactive.
                            </small>
                          </label>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#4F5B70] pt-0.5">
                          <Info className="size-3.5 shrink-0 text-[#0267B8]" />
                          <span>
                            Inactive rules are not used while inactive.
                          </span>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  {/* SECTION D: Admin Limit & Pricing Context */}
                  <div
                    id="s-lim"
                    className="bg-white rounded-[18px] border border-[#E6EAF0] shadow-xs p-5 sm:p-6 flex flex-col gap-5 transition-shadow hover:shadow-sm"
                  >
                    {/* Section Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-xl bg-[#012A5E] text-[#F1C134] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          D
                        </div>
                        <div className="flex flex-col">
                          <h2 className="text-lg font-extrabold text-[#012A5E] leading-snug">
                            Admin Limit & Pricing Context
                          </h2>
                          <p className="text-xs text-[#4F5B70]">
                            Read-only — configured by Aero Wing Admin.
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF1F5] text-[#4F5B70] border border-[#DCE2EB] text-xs font-bold"
                      >
                        <Shield className="size-3" />
                        <span>Read-only</span>
                      </Badge>
                    </div>

                    {/* Section Body */}
                    <div className="flex flex-col gap-5 pt-1">
                      {/* Box 1: Admin Markup Limit (Light Blue #F7FBFF / Alice Blue) */}
                      <div className="rounded-2xl border border-[#CFE3F6] bg-[#F7FBFF] p-4 sm:p-5 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className="size-8 rounded-lg bg-white border border-[#CFE3F6] text-[#0267B8] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                            <Shield className="size-4.5" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <b className="font-extrabold text-sm text-[#141B28]">
                              Admin Markup Limit
                            </b>
                            <p className="text-xs text-[#4F5B70]">
                              Your markup must remain within the limit
                              configured for Skyline Demo Travels Ltd by Aero
                              Wing Admin.
                            </p>
                          </div>
                        </div>

                        {/* Exact Limit Row */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#CFE3F6]/60 flex-wrap gap-2">
                          <span className="font-semibold text-[#4F5B70]">
                            Exact limit
                          </span>
                          <b className="font-bold text-[#141B28]">
                            Exact limit not included in this design-preview
                            dataset
                          </b>
                        </div>

                        {/* Disclaimer Pill */}
                        <div className="rounded-xl bg-[#EBEFF5] p-3 flex items-start gap-2.5 text-xs text-[#4F5B70]">
                          <Info className="size-4 shrink-0 text-[#0267B8] mt-0.5" />
                          <div className="flex flex-col leading-relaxed">
                            <b className="font-bold text-[#141B28]">
                              Limit validation unavailable in this
                              design-preview dataset
                            </b>
                            <span>
                              The exact limit isn’t included, so this value
                              can’t be checked here.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Box 2: Pricing Context list */}
                      <div className="flex flex-col gap-2.5">
                        <p className="text-sm font-bold text-[#141B28]">
                          Pricing Context
                        </p>

                        <ul className="flex flex-col gap-2">
                          {/* Item 1: Admin pricing */}
                          <li className="rounded-xl border border-[#E6EAF0] bg-[#F4F6FA] p-3 flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-white text-[#012A5E] flex items-center justify-center shrink-0 border border-[#DCE2EB]">
                              <CheckCircle2 className="size-4 text-[#0E6A3D]" />
                            </div>
                            <div className="flex items-center justify-between flex-1 text-xs">
                              <span className="font-semibold text-[#4F5B70]">
                                Admin pricing
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Configured
                              </b>
                            </div>
                          </li>

                          {/* Item 2: Your Agent markup */}
                          <li className="rounded-xl border border-[#E6EAF0] bg-[#F4F6FA] p-3 flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-white text-[#012A5E] flex items-center justify-center shrink-0 border border-[#DCE2EB]">
                              <PercentIcon className="size-4 text-[#0267B8]" />
                            </div>
                            <div className="flex items-center justify-between flex-1 text-xs">
                              <span className="font-semibold text-[#4F5B70]">
                                Your Agent markup
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                This rule
                              </b>
                            </div>
                          </li>

                          {/* Item 3: Final client pricing (Highlighted #FFFBEB / Buttery White) */}
                          <li className="rounded-xl border border-[#F3E2A8] bg-[#FFFBEB] p-3 flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-white text-[#7A4A06] flex items-center justify-center shrink-0 border border-[#F3E2A8]">
                              <Calculator className="size-4 text-[#7A4A06]" />
                            </div>
                            <div className="flex items-center justify-between flex-1 text-xs">
                              <span className="font-semibold text-[#7A4A06]">
                                Final client pricing
                              </span>
                              <b className="font-extrabold text-sm text-[#141B28]">
                                Calculated during quoting
                              </b>
                            </div>
                          </li>
                        </ul>

                        <div className="flex items-start gap-1.5 text-xs text-[#4F5B70] pt-1">
                          <Info className="size-3.5 shrink-0 text-[#0267B8] mt-0.5" />
                          <span>
                            When multiple pricing or markup rules apply, the
                            platform resolves them using the configured pricing
                            precedence.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Right Column: SECTION E (Rule Summary, 380px width) */}
                <aside className="lg:col-span-5 xl:col-span-4 w-full sticky top-6">
                  <div
                    id="s-rv"
                    className="bg-white rounded-[18px] border border-[#E6EAF0] shadow-xs flex flex-col overflow-hidden"
                  >
                    {/* Summary Header */}
                    <div className="p-5 border-b border-[#E6EAF0] flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-xl bg-[#012A5E] text-[#F1C134] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          E
                        </div>
                        <div className="flex flex-col">
                          <h2 className="text-base font-extrabold text-[#012A5E] leading-snug">
                            Rule Summary
                          </h2>
                          <p className="text-xs text-[#4F5B70]">
                            Updates as you edit
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBEFF5] border-[#DCE2EB] text-[#5F6B80] font-semibold text-[11px]"
                      >
                        <Tag className="size-2.5" />
                        <span>Sample data</span>
                      </Badge>
                    </div>

                    {/* Definition List (Live dynamic fields) */}
                    <div className="p-5 flex flex-col divide-y divide-[#F1F5F9] text-xs">
                      {/* Row 1: Rule */}
                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#4F5B70] font-medium">Rule</span>
                        {ruleName.trim() ? (
                          <b className="font-extrabold text-sm text-[#141B28] text-right truncate max-w-50">
                            {ruleName}
                          </b>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B42318] bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                            <AlertCircle className="size-3" />
                            Not entered
                          </span>
                        )}
                      </div>

                      {/* Row 2: Rule Source */}
                      <div className="py-2.5 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#4F5B70] font-medium">
                            Rule Source
                          </span>
                          <b className="font-bold text-[#141B28]">
                            Agent configured
                          </b>
                        </div>
                        <span className="text-[11px] text-[#4F5B70] text-right">
                          Skyline Demo Travels Ltd
                        </span>
                      </div>

                      {/* Row 3: Scope */}
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-[#4F5B70] font-medium">
                          Scope
                        </span>
                        <b className="font-bold text-[#141B28]">
                          {scope === 'all'
                            ? 'All Services'
                            : scope === 'specific_service'
                              ? 'Specific Service'
                              : 'Specific Supplier'}
                        </b>
                      </div>

                      {/* Row 4: Service */}
                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#4F5B70] font-medium">
                          Service
                        </span>
                        {scope === 'all' ? (
                          <b className="font-bold text-[#141B28]">
                            All modules
                          </b>
                        ) : service ? (
                          <b className="font-extrabold text-sm text-[#141B28]">
                            {service}
                          </b>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B42318] bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                            <AlertCircle className="size-3" />
                            Not selected
                          </span>
                        )}
                      </div>

                      {/* Row 5: Supplier */}
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-[#4F5B70] font-medium">
                          Supplier
                        </span>
                        <b className="font-bold text-[#141B28]">
                          {scope === 'specific_supplier'
                            ? supplier
                            : 'All suppliers'}
                        </b>
                      </div>

                      {/* Row 6: Type */}
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-[#4F5B70] font-medium">Type</span>
                        <b className="font-bold text-[#141B28]">
                          {markupType === 'percentage'
                            ? 'Percentage'
                            : 'Fixed Amount'}
                        </b>
                      </div>

                      {/* Row 7: Markup */}
                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#4F5B70] font-medium">
                          Markup
                        </span>
                        {markupValue.trim() ? (
                          <b className="font-extrabold text-sm text-[#141B28]">
                            {markupValue}
                            {markupType === 'percentage' ? '%' : ' BDT'}
                          </b>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B42318] bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                            <AlertCircle className="size-3" />
                            Not entered
                          </span>
                        )}
                      </div>

                      {/* Row 8: Status */}
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-[#4F5B70] font-medium">
                          Status
                        </span>
                        <span
                          className={cn(
                            'text-[11px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1',
                            status === 'active'
                              ? 'bg-[#E6F4EC] text-[#0E6A3D]'
                              : 'bg-gray-100 text-[#4F5B70]',
                          )}
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full',
                              status === 'active'
                                ? 'bg-[#0E6A3D]'
                                : 'bg-[#4F5B70]',
                            )}
                          />
                          {status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Row 9: Pricing resolution */}
                      <div className="py-2.5 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#4F5B70] font-medium">
                            Pricing resolution
                          </span>
                          <b className="font-bold text-[#141B28]">
                            Configured precedence
                          </b>
                        </div>
                        <span className="text-[11px] text-[#4F5B70] text-right">
                          Final client pricing is calculated during quoting
                        </span>
                      </div>
                    </div>

                    {/* Helper text */}
                    <div className="px-5 pb-4 flex items-start gap-1.5 text-[11px] text-[#4F5B70] leading-snug">
                      <Info className="size-3.5 shrink-0 text-[#0267B8] mt-0.5" />
                      <span>
                        Markup changes are used according to the platform
                        pricing rules when pricing is calculated.
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="p-5 pt-0 flex flex-col gap-2.5">
                      <Button
                        type="button"
                        onClick={handleSave}
                        loading={isSaving}
                        loadingText="Saving..."
                        className="w-full h-13 rounded-xl bg-[#F1C134] text-[#012A5E] hover:bg-[#E5B320] font-extrabold text-base shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                      >
                        <Check className="size-5 stroke-[2.5]" />
                        <span>Save Markup Rule</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={isSaving}
                        className="w-full h-11 rounded-xl bg-white border-[#DCE2EB] text-[#141B28] hover:bg-gray-50 font-bold text-sm cursor-pointer transition-colors"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-[#E6EAF0] bg-white px-4 sm:px-6 md:px-10 lg:px-12 xl:px-38 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4F5B70] mt-auto">
            <span>
              AeroWing Agent Portal · M2.3 + M2.4 Add / Edit Markup Rule ·
              Website
            </span>
            <span>
              Design prototype — no pricing engine, rule storage or supplier
              system is called.
            </span>
          </footer>
        </div>
      </div>

      {/* Confirmation Dialog upon Save */}
      <Dialog open={saveSuccessOpen} onOpenChange={setSaveSuccessOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border-[#DCE2EB]">
          <DialogHeader>
            <div className="size-12 rounded-full bg-[#E6F4EC] text-[#0E6A3D] flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="size-6" />
            </div>
            <DialogTitle className="text-center font-extrabold text-[#012A5E] text-xl">
              Markup Rule Saved
            </DialogTitle>
            <DialogDescription className="text-center text-[#4F5B70] text-sm">
              Your markup rule <b>&quot;{savedData?.ruleName}&quot;</b> has been
              configured and is ready for customer quoting.
            </DialogDescription>
          </DialogHeader>

          {savedData && (
            <div className="rounded-xl border border-[#E6EAF0] bg-[#F7FAFE] p-3.5 flex flex-col gap-2 text-xs text-[#141B28]">
              <div className="flex justify-between">
                <span className="text-[#4F5B70]">Scope / Service:</span>
                <span className="font-bold">{savedData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4F5B70]">Markup Value:</span>
                <span className="font-bold text-[#0267B8]">
                  {savedData.markupValue}
                  {savedData.markupType === 'percentage' ? '%' : ' BDT'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4F5B70]">Status:</span>
                <span className="font-bold capitalize text-[#0E6A3D]">
                  {savedData.status}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-center gap-2 pt-2">
            <Button
              type="button"
              onClick={() => {
                setSaveSuccessOpen(false)
                handleBack()
              }}
              className="bg-[#012A5E] text-white hover:bg-[#0267B8] rounded-xl font-bold px-6"
            >
              Return to Pricing & Markup
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaveSuccessOpen(false)}
              className="rounded-xl font-semibold border-[#DCE2EB]"
            >
              Keep Editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

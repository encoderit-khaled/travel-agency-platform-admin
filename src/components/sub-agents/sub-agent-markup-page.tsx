import * as React from 'react'
import {
  ArrowLeft,
  Percent,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  Info,
  Check,
  CheckCircle2,
  Trash2,
  Building2,
  Mail,
  Tag,
  Plane,
  Luggage,
  Compass,
  Car,
  Smartphone,
  Train,
  ShieldCheck,
  ShieldAlert,
  GitCommit,
  Wallet,
  Eye,
  CalendarDays,
  X,
  Store,
  Calculator,
  MinusCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import { Label } from '#/components/ui/label'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '#/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { AgentPortalSidebar } from '#/components/agent-portal/agent-portal-sidebar'
import { AgentPortalHeader } from '#/components/agent-portal/agent-portal-header'
import { cn } from 'cn'

export interface MarkupRuleItem {
  id: string
  scope: 'all' | 'service' | 'supplier'
  service?: string
  supplier?: string
  type: 'percentage' | 'fixed'
  value: number
  currency?: string
  description?: string
  createdAt?: string
}

export interface ServiceModuleItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
}

export const SERVICE_MODULES: ServiceModuleItem[] = [
  { id: 'flights', name: 'Flights', icon: Plane },
  { id: 'hotels', name: 'Hotels', icon: Building2 },
  { id: 'packages', name: 'Travel Packages', icon: Luggage },
  { id: 'activities', name: 'Activities', icon: Compass },
  { id: 'car-rental', name: 'Car Rental', icon: Car },
  { id: 'esim', name: 'eSIM', icon: Smartphone },
  { id: 'bus-train', name: 'Bus / Train', icon: Train },
  { id: 'insurance', name: 'Travel Insurance', icon: ShieldCheck },
]

export const SUPPLIER_OPTIONS = [
  { id: 'biman', name: 'Biman Bangladesh Airlines (BG)' },
  { id: 'emirates', name: 'Emirates (EK)' },
  { id: 'saudia', name: 'Saudia (SV)' },
  { id: 'qatar', name: 'Qatar Airways (QR)' },
  { id: 'amadeus', name: 'Amadeus GDS Inventory' },
  { id: 'sabre', name: 'Sabre GDS Inventory' },
]

interface SubAgentMarkupPageProps {
  deskId?: string
  deskName?: string
  agentBusiness?: string
  initialAddRuleOpen?: boolean
  onBack?: () => void
}

export function SubAgentMarkupPage({
  deskId: _deskId = 'sa-mirpur-05',
  deskName = 'Mirpur Desk',
  agentBusiness = 'Skyline Demo Travels Ltd',
  initialAddRuleOpen = true,
  onBack,
}: SubAgentMarkupPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileMenuOpen((prev) => !prev)
    } else {
      setSidebarCollapsed((prev) => !prev)
    }
  }

  // Markup rules state (default starts empty matching Figma #691:4490 & #691:5509)
  const [rules, setRules] = React.useState<MarkupRuleItem[]>([])

  // Add Markup Rule Sheet state (open by default matching Figma #691:5509)
  const [sheetOpen, setSheetOpen] = React.useState<boolean>(initialAddRuleOpen)
  const [contextDialogOpen, setContextDialogOpen] = React.useState(false)

  // Form states inside Add Rule Sheet
  const [ruleScope, setRuleScope] = React.useState<
    'all' | 'service' | 'supplier'
  >('all')
  const [selectedService, setSelectedService] = React.useState('Flights')
  const [selectedSupplier, setSelectedSupplier] = React.useState(
    SUPPLIER_OPTIONS[0].name,
  )
  const [markupType, setMarkupType] = React.useState<'percentage' | 'fixed'>(
    'percentage',
  )
  const [markupValue, setMarkupValue] = React.useState('2.5')
  const [formDescription] = React.useState('')

  // Toast notifications
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle go back
  const handleGoBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.location.href = '/sub-agents/details'
    }
  }

  // Add rule submit
  const handleSaveRule = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const numericVal = parseFloat(markupValue)
    if (isNaN(numericVal) || numericVal < 0) {
      alert('Please enter a valid markup value of 0 or greater.')
      return
    }

    let scopeLabel = 'All services'
    if (ruleScope === 'service') {
      scopeLabel = selectedService
    } else if (ruleScope === 'supplier') {
      scopeLabel = selectedSupplier
    }

    const defaultDesc =
      markupType === 'percentage'
        ? `${numericVal}% markup applied on top of applicable rates.`
        : `Fixed BDT ${numericVal} markup per booking segment.`

    const newRule: MarkupRuleItem = {
      id: `rule-${Date.now()}`,
      scope: ruleScope,
      service: ruleScope === 'service' ? selectedService : undefined,
      supplier: ruleScope === 'supplier' ? selectedSupplier : undefined,
      type: markupType,
      value: numericVal,
      currency: markupType === 'fixed' ? 'BDT' : undefined,
      description: formDescription.trim() || defaultDesc,
      createdAt: new Date().toISOString(),
    }

    setRules((prev) => [...prev, newRule])
    setSheetOpen(false)
    showToast(
      `Markup rule for ${scopeLabel} (${numericVal}${markupType === 'percentage' ? '%' : ' BDT'}) saved successfully.`,
    )
  }

  // Delete rule
  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
    showToast('Markup rule removed.')
  }

  const columns = React.useMemo<ColumnDef<MarkupRuleItem>[]>(
    () => [
      {
        id: 'scope',
        header: 'Scope / Target',
        cell: ({ row }) => {
          const r = row.original
          return r.scope === 'all' ? 'All services' : r.service || r.supplier
        },
        meta: {
          headerClassName: 'py-2.5 px-3',
          cellClassName: 'py-2.5 px-3 font-black text-[#012A5E]',
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => row.original.type,
        meta: {
          headerClassName: 'py-2.5 px-3',
          cellClassName: 'py-2.5 px-3 capitalize text-[#4F5B70]',
        },
      },
      {
        id: 'value',
        header: 'Rate / Amount',
        cell: ({ row }) => {
          const r = row.original
          return r.type === 'percentage' ? `+${r.value}%` : `+BDT ${r.value}`
        },
        meta: {
          headerClassName: 'py-2.5 px-3',
          cellClassName: 'py-2.5 px-3 font-black text-[#B45309]',
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => row.original.description,
        meta: {
          headerClassName: 'py-2.5 px-3',
          cellClassName: 'py-2.5 px-3 text-[#4F5B70] max-w-xs truncate',
        },
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleDeleteRule(row.original.id)}
            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        ),
        meta: {
          headerClassName: 'py-2.5 px-3 text-right',
          cellClassName: 'py-2.5 px-3 text-right',
        },
      },
    ],
    [handleDeleteRule],
  )

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] text-[#012A5E] antialiased">
      {/* Sidebar: Desktop */}
      <AgentPortalSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        currentActive="Sub-agents"
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        className="hidden lg:flex"
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AgentPortalHeader
          onToggleSidebar={handleToggleSidebar}
          onToggleMobileMenu={handleToggleSidebar}
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Sub-agents', active: false },
            { label: deskName, active: false },
            { label: 'Markup', active: true },
          ]}
        />

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 xl:px-16 py-6 max-w-[1664px] w-full mx-auto space-y-5">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-[#0E6A3D] text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-white/80 hover:text-white ml-4 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Back link */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors py-1 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to {deskName}</span>
            </button>
          </div>

          {/* Desk Header / Identity Section */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-1">
            <div className="flex items-start gap-4">
              {/* Avatar MD */}
              <div className="relative size-16 shrink-0 rounded-2xl bg-[#D9E9F9] border border-[#BFD5ED] flex items-center justify-center shadow-xs">
                <span className="text-[22px] font-black text-[#003A7B] tracking-tight">
                  MD
                </span>
              </div>

              {/* Titles & Meta */}
              <div className="flex-1 space-y-1">
                <p className="text-[11px] font-black text-[#003A7B] uppercase tracking-[0.11em]">
                  {deskName.toUpperCase()} • M2.2 SUB-AGENT MARKUP
                </p>
                <h1 className="text-2xl sm:text-[28px] font-black text-[#012A5E] tracking-tight leading-tight sm:leading-9">
                  Sub-agent Markup
                </h1>
                <p className="text-xs sm:text-[13.5px] font-semibold text-[#4F5B70] leading-5">
                  Configure markup for {deskName} on top of {agentBusiness}’s
                  applicable rates.
                </p>

                {/* Tags Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1.5">
                  <span className="text-xs font-extrabold text-[#012A5E]">
                    {deskName}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EEF1F5] text-xs font-bold text-[#012A5E]">
                    <Building2 className="size-3 text-[#0267B8]" />
                    Sub-agent / Staff
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F5B70]">
                    <Mail className="size-3.5 text-[#8C9BAE]" />
                    mirpur.desk@example.com
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F2F5F9] border border-[#E6EAF0] text-[11px] font-bold text-[#5C677A]">
                    <Info className="size-3 text-[#8C9BAE]" />
                    Sample data
                  </span>
                </div>

                {/* Status Row */}
                <div className="flex items-center pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF1F5] text-[11.5px] font-bold text-[#4F5B70]">
                    {rules.length > 0 ? (
                      <>
                        <CheckCircle2 className="size-3 text-[#0E6A3D]" />
                        <span>
                          Current status: Configured ({rules.length} active{' '}
                          {rules.length === 1 ? 'rule' : 'rules'})
                        </span>
                      </>
                    ) : (
                      <>
                        <MinusCircle className="size-3 text-[#5C677A]" />
                        <span>Current status: Not configured</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Top-Right Action Button */}
            <div className="shrink-0 pt-1">
              <Button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="bg-[#F1C134] hover:bg-[#E5B52B] text-[#012A5E] font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-black/5"
              >
                <Plus className="size-4 stroke-[2.5]" />
                <span>Add Markup Rule</span>
              </Button>
            </div>
          </div>

          {/* Sub-agent Sections Tab Bar */}
          <div className="border-b border-[#DCE2EB] overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              <a
                href="/sub-agents/details?tab=overview"
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-[#4F5B70] hover:text-[#012A5E] transition-colors border-b-2 border-transparent"
              >
                <Eye className="size-3.5" />
                <span>Overview</span>
              </a>
              <a
                href="/sub-agents/permissions"
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-[#4F5B70] hover:text-[#012A5E] transition-colors border-b-2 border-transparent"
              >
                <ShieldCheck className="size-3.5" />
                <span>Permissions</span>
              </a>
              <div className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-black text-[#012A5E] border-b-[3px] border-[#F1C134]">
                <Percent className="size-3.5 text-[#012A5E]" />
                <span>Markup</span>
              </div>
              <a
                href="/sub-agents/details?tab=bookings"
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-[#4F5B70] hover:text-[#012A5E] transition-colors border-b-2 border-transparent"
              >
                <CalendarDays className="size-3.5" />
                <span>Bookings</span>
              </a>
              <a
                href="/sub-agents/details?tab=performance"
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-[#4F5B70] hover:text-[#012A5E] transition-colors border-b-2 border-transparent"
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Performance</span>
              </a>
            </div>
          </div>

          {/* Explanatory Banner: How Sub-agent markup works */}
          <section className="bg-[#F2F8FE] border border-[#CFE3F6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-[#0267B8]" />
              <h2 className="text-sm font-black text-[#012A5E]">
                How Sub-agent markup works
              </h2>
            </div>
            <p className="text-xs font-semibold text-[#4F5B70] leading-4.5">
              Sub-agent markup is applied on top of the Parent Agent’s
              applicable rates.
            </p>

            {/* Formula Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 pt-1">
              {/* Block 1: Parent Agent rate */}
              <div className="flex-1 bg-white border border-[#CFE3F6] rounded-xl p-3 sm:px-3.5 sm:py-3 flex items-center gap-3 shadow-2xs">
                <div className="size-9 shrink-0 rounded-lg bg-[#E8EDF5] flex items-center justify-center text-[#012A5E]">
                  <Store className="size-4 text-[#012A5E]" />
                </div>
                <div className="min-w-0">
                  <b className="block text-xs font-black text-[#012A5E] leading-tight">
                    Parent Agent applicable rate
                  </b>
                  <small className="block text-[11px] font-semibold text-[#4F5B70] leading-tight mt-0.5">
                    From {agentBusiness}’s pricing
                  </small>
                </div>
              </div>

              {/* Operator + */}
              <div className="text-center font-black text-xl text-[#0267B8] leading-none shrink-0 px-1">
                +
              </div>

              {/* Block 2: Sub-agent markup */}
              <div className="flex-1 bg-white border border-[#CFE3F6] rounded-xl p-3 sm:px-3.5 sm:py-3 flex items-center gap-3 shadow-2xs">
                <div className="size-9 shrink-0 rounded-lg bg-[#FFF6DC] flex items-center justify-center text-[#B45309]">
                  <Tag className="size-4 text-[#B45309]" />
                </div>
                <div className="min-w-0">
                  <b className="block text-xs font-black text-[#012A5E] leading-tight">
                    Sub-agent markup
                  </b>
                  <small className="block text-[11px] font-semibold text-[#4F5B70] leading-tight mt-0.5">
                    Set on this page
                  </small>
                </div>
              </div>

              {/* Operator = */}
              <div className="text-center font-black text-xl text-[#0267B8] leading-none shrink-0 px-1">
                =
              </div>

              {/* Block 3: Price used when quoting */}
              <div className="flex-1 bg-[#FFFBEB] border border-[#F3E2A8] rounded-xl p-3 sm:px-3.5 sm:py-3 flex items-center gap-3 shadow-2xs">
                <div className="size-9 shrink-0 rounded-lg bg-[#E6F4EC] flex items-center justify-center text-[#0E6A3D]">
                  <Calculator className="size-4 text-[#0E6A3D]" />
                </div>
                <div className="min-w-0">
                  <b className="block text-xs font-black text-[#012A5E] leading-tight">
                    Price used when quoting the client
                  </b>
                  <small className="block text-[11px] font-semibold text-[#4F5B70] leading-tight mt-0.5">
                    Calculated during pricing / quoting
                  </small>
                </div>
              </div>
            </div>

            {/* Footnote */}
            <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold text-[#5F6B80]">
              <Info className="size-3.5 shrink-0 text-[#5F6B80]" />
              <span>
                Explanatory model only. Additional quote-level markup, where
                permitted, is handled during the quoting flow.
              </span>
            </div>
          </section>

          {/* Main 2-Column Content Grid */}
          <div className="flex flex-col lg:flex-row items-start gap-5">
            {/* Left Column (flex-1) */}
            <div className="flex-1 w-full space-y-4">
              {/* Card 1: Current Markup */}
              <section
                id="c-cur"
                className="bg-white border border-[#DCE2EB] rounded-2xl shadow-xs overflow-hidden"
              >
                <div className="px-5 py-4 pb-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#FFF6DC] flex items-center justify-center shrink-0">
                    <Tag className="size-4 text-[#B45309]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-[#012A5E]">
                      Current Markup
                    </h2>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-3">
                  {rules.length === 0 ? (
                    <div className="space-y-1">
                      <b className="block text-sm font-black text-[#141B28]">
                        No Sub-agent markup configured
                      </b>
                      <p className="text-xs font-semibold text-[#4F5B70] leading-relaxed">
                        {deskName} currently uses {agentBusiness}’s applicable
                        rates without an additional Sub-agent markup.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-[#0E6A3D]">
                        Active Sub-agent rules applied on top of base rates:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rules.map((rule) => (
                          <div
                            key={rule.id}
                            className="p-3 rounded-xl border border-[#DCE2EB] bg-[#FAFBFD] flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-black text-[#012A5E] block truncate">
                                {rule.scope === 'all'
                                  ? 'All services'
                                  : rule.service || rule.supplier || 'Custom'}
                              </span>
                              <span className="text-[11px] text-[#4F5B70] block truncate">
                                {rule.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="px-2 py-0.5 rounded-md bg-[#FFF6DC] text-[#B45309] text-xs font-black">
                                {rule.type === 'percentage'
                                  ? `+${rule.value}%`
                                  : `+${rule.currency || 'BDT'} ${rule.value}`}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                                title="Remove rule"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 border-t border-[#EEF1F5] flex flex-wrap items-center justify-between gap-3 bg-[#FAFBFD]/50">
                  <Button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="bg-[#F1C134] hover:bg-[#E5B52B] text-[#012A5E] font-black text-xs px-4 py-2 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-3.5 stroke-[2.5]" />
                    <span>Add Markup Rule</span>
                  </Button>

                  <button
                    type="button"
                    onClick={() => setContextDialogOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer py-1"
                  >
                    <span>View pricing context</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </section>

              {/* Card 2: Markup Rules */}
              <section
                id="c-rules"
                className="bg-white border border-[#DCE2EB] rounded-2xl shadow-xs overflow-hidden"
              >
                <div className="px-5 py-4 pb-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#F2F8FE] flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="size-4 text-[#0267B8]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-[#012A5E]">
                      Markup Rules
                    </h2>
                    <p className="text-xs font-semibold text-[#4F5B70]">
                      Persistent Sub-agent markup for {deskName}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  {rules.length === 0 ? (
                    /* Figma-matching empty state */
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      {/* Gradient icon with corner saffron plus */}
                      <div className="relative size-16 rounded-2xl bg-linear-to-br from-[#EAF4FD] to-[#E8EDF5] flex items-center justify-center shadow-xs mb-3">
                        <Tag className="size-7 text-[#0267B8]" />
                      </div>
                      <h3 className="text-base font-black text-[#012A5E]">
                        No custom markup rules yet
                      </h3>
                      <p className="text-xs font-semibold text-[#64748B] max-w-sm mt-1 leading-relaxed">
                        Add a rule to apply markup for all services or for a
                        specific service or supplier.
                      </p>
                      <Button
                        type="button"
                        onClick={() => setSheetOpen(true)}
                        className="mt-4 bg-[#F1C134] hover:bg-[#E5B52B] text-[#012A5E] font-black text-xs px-4 py-2 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="size-3.5 stroke-[2.5]" />
                        <span>Add Markup Rule</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="overflow-x-auto rounded-xl border border-[#DCE2EB]">
                        <DataTable
                          data={rules}
                          columns={columns}
                          getRowId={(row) => row.id}
                          tableClassName="w-full text-xs text-left"
                          headerClassName="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-bold border-b border-[#DCE2EB]"
                          headerRowClassName="hover:bg-transparent"
                          headClassName="h-auto"
                          bodyClassName="divide-y divide-[#EEF1F5]"
                          rowClassName="hover:bg-[#FAFBFD]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Card 3: Coverage Across Service Modules */}
              <section
                id="c-cov"
                className="bg-white border border-[#DCE2EB] rounded-2xl shadow-xs overflow-hidden"
              >
                <div className="px-5 py-4 pb-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#E8EDF5] flex items-center justify-center shrink-0">
                    <Tag className="size-4 text-[#012A5E]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-[#012A5E]">
                      Coverage across service modules
                    </h2>
                    <p className="text-xs font-semibold text-[#4F5B70]">
                      The eight service modules where Sub-agent markup can apply
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SERVICE_MODULES.map((mod) => {
                      const Icon = mod.icon
                      const hasRule = rules.some(
                        (r) =>
                          r.scope === 'all' ||
                          r.service?.toLowerCase() === mod.name.toLowerCase(),
                      )
                      return (
                        <div
                          key={mod.id}
                          className="p-3 rounded-xl border border-[#E6EAF0] bg-[#FAFBFD] flex flex-col justify-between h-20"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="size-3.5 text-[#0267B8] shrink-0" />
                            <span className="text-xs font-black text-[#012A5E] truncate">
                              {mod.name}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'text-[10.5px] font-bold px-2 py-0.5 rounded-full w-fit',
                              hasRule
                                ? 'bg-[#EAFBF1] text-[#0B6A45]'
                                : 'bg-[#F1F3F6] text-[#64748B]',
                            )}
                          >
                            {hasRule ? 'Rule Active' : 'No rule active'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column (lg:w-[380px]) */}
            <div className="lg:w-95 w-full space-y-4 shrink-0">
              {/* Card 1: Admin pricing limits */}
              <section
                id="c-lim"
                className="bg-white border border-[#DCE2EB] rounded-2xl shadow-xs overflow-hidden"
              >
                <div className="px-5 py-4 pb-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#FFF6DC] flex items-center justify-center shrink-0">
                    <ShieldAlert className="size-4 text-[#B45309]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-[#012A5E]">
                      Admin pricing limits
                    </h2>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-3">
                  <p className="text-xs font-semibold text-[#4F5B70] leading-relaxed">
                    Markup must remain within limits configured by Aero Wing
                    Admin.
                  </p>

                  <div className="p-2.5 px-3 rounded-xl bg-[#F6F8FB] flex items-center justify-between gap-2 border border-[#E6EAF0]">
                    <span className="text-xs font-semibold text-[#4F5B70]">
                      Configured limits
                    </span>
                    <b className="text-xs font-black text-[#141B28]">
                      Not available
                    </b>
                  </div>

                  <p className="text-[11px] text-[#64748B] leading-normal">
                    When Admin limits are supplied, they will show here and be
                    checked when you save a rule.
                  </p>
                </div>
              </section>

              {/* Card 2: Rule Precedence */}
              <section
                id="c-prec"
                className="bg-white border border-[#DCE2EB] rounded-2xl shadow-xs overflow-hidden"
              >
                <div className="px-5 py-4 pb-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#E8EDF5] flex items-center justify-center shrink-0">
                    <GitCommit className="size-4 text-[#012A5E]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-[#012A5E]">
                      Rule Precedence
                    </h2>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-3">
                  <p className="text-xs font-semibold text-[#4F5B70] leading-relaxed">
                    When multiple markup rules apply to the same booking, Aero
                    Wing uses the pricing rule precedence configured by the
                    platform.
                  </p>

                  <div className="p-2.5 px-3 rounded-xl bg-[#F6F8FB] flex flex-col gap-1 border border-[#E6EAF0]">
                    <span className="text-xs font-semibold text-[#4F5B70]">
                      Exact precedence
                    </span>
                    <b className="text-xs font-black text-[#141B28]">
                      Not defined in the supplied requirement
                    </b>
                  </div>
                </div>
              </section>

              {/* Card 3: Pricing Context */}
              <section
                id="c-ctx"
                className="bg-white border border-[#DCE2EB] rounded-2xl shadow-xs overflow-hidden"
              >
                <div className="px-5 py-4 pb-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#F2F8FE] flex items-center justify-center shrink-0">
                    <Info className="size-4 text-[#0267B8]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-[#012A5E]">
                      Pricing Context
                    </h2>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-3">
                  <dl className="divide-y divide-[#EEF1F5] text-xs">
                    <div className="py-2 first:pt-0">
                      <dt className="text-[#4F5B70] font-semibold">
                        Parent Agent
                      </dt>
                      <dd className="text-[#141B28] font-bold mt-0.5">
                        {agentBusiness}
                      </dd>
                    </div>

                    <div className="py-2">
                      <dt className="text-[#4F5B70] font-semibold">
                        Sub-agent
                      </dt>
                      <dd className="text-[#141B28] font-bold mt-0.5">
                        {deskName}
                      </dd>
                    </div>

                    <div className="py-2">
                      <dt className="text-[#4F5B70] font-semibold">
                        Parent Agent applicable pricing
                      </dt>
                      <dd className="text-[#141B28] font-bold mt-0.5">
                        Available from Agent pricing configuration
                      </dd>
                    </div>

                    <div className="py-2">
                      <dt className="text-[#4F5B70] font-semibold">
                        Additional Sub-agent markup
                      </dt>
                      <dd className="text-[#141B28] font-bold mt-0.5">
                        {rules.length > 0
                          ? `${rules.length} configured rule(s)`
                          : 'Not configured'}
                      </dd>
                    </div>

                    <div className="py-2">
                      <dt className="text-[#4F5B70] font-semibold">
                        Effective client quote
                      </dt>
                      <dd className="text-[#141B28] font-bold mt-0.5">
                        Calculated during pricing / quoting
                      </dd>
                    </div>
                  </dl>

                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Fixed markup values and final pricing follow the platform’s
                    configured currency rules.
                  </p>
                </div>
              </section>

              {/* Card 4: Booking Settlement */}
              <section
                id="c-set"
                className="bg-white border border-[#DCE2EB] rounded-2xl shadow-xs overflow-hidden"
              >
                <div className="px-5 py-4 pb-3 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#E8EDF5] flex items-center justify-center shrink-0">
                    <Wallet className="size-4 text-[#012A5E]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-[#012A5E]">
                      Booking Settlement
                    </h2>
                  </div>
                </div>

                <div className="px-5 pb-4">
                  <p className="text-xs font-semibold text-[#4F5B70] leading-relaxed">
                    Sub-agent bookings use {agentBusiness}’s wallet and
                    available credit. Markup here doesn’t create a separate
                    Sub-agent wallet or credit.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 border-t border-[#DCE2EB] bg-white px-6 sm:px-12 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4F5B70]">
          <div>AeroWing Agent Portal · M2.2 / M2.3 / M2.4 Sub-agent Markup</div>
          <div>
            Website only · configuration prototype — no prices are calculated
            and the real pricing engine is not changed.
          </div>
        </footer>
      </div>

      {/* Add Markup Rule Slide-Over Sheet (Exact Figma #691:5509 match) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-135 md:max-w-140 p-0 flex flex-col justify-between border-l border-[#DCE2EB] shadow-2xl bg-white"
        >
          {/* Header */}
          <div className="p-6 pb-5 border-b border-[#EEF1F5] flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-2xl font-black text-[#012A5E] tracking-tight">
                Add Markup Rule
              </SheetTitle>
              <SheetDescription className="text-xs font-semibold text-[#4F5B70] mt-1">
                For {deskName}, on top of {agentBusiness}’s applicable rates.
              </SheetDescription>
            </div>
            <SheetClose className="size-8 rounded-lg border border-[#DCE2EB] text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] flex items-center justify-center transition-colors focus:outline-none shrink-0 cursor-pointer">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>

          {/* Body Content / Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: Rule Scope */}
            <div className="border border-[#DCE2EB] rounded-2xl p-4 sm:p-5 bg-white space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="size-6 rounded-full bg-[#012A5E] text-white text-xs font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <h3 className="text-sm font-black text-[#012A5E]">
                  Rule Scope
                </h3>
              </div>

              <div>
                <Label className="text-xs font-extrabold text-[#141B28] mb-2 block">
                  Applies To
                </Label>
                <div className="space-y-2.5">
                  {/* Option 1: All services */}
                  <div
                    onClick={() => setRuleScope('all')}
                    className={cn(
                      'rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all',
                      ruleScope === 'all'
                        ? 'border-2 border-[#012A5E] bg-white shadow-2xs'
                        : 'border border-[#DCE2EB] bg-white hover:border-[#B8C5D6]',
                    )}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={cn(
                          'size-5 rounded-full border-2 flex items-center justify-center transition-all',
                          ruleScope === 'all'
                            ? 'border-[#012A5E]'
                            : 'border-[#B8C5D6]',
                        )}
                      >
                        {ruleScope === 'all' && (
                          <div className="size-2.5 rounded-full bg-[#012A5E]" />
                        )}
                      </div>
                    </div>
                    <div>
                      <b className="text-sm font-black text-[#012A5E] block leading-tight">
                        All services
                      </b>
                      <span className="text-xs font-semibold text-[#4F5B70] block mt-0.5 leading-tight">
                        Apply one Sub-agent markup rule across applicable
                        services.
                      </span>
                    </div>
                  </div>

                  {/* Option 2: Specific service */}
                  <div
                    onClick={() => setRuleScope('service')}
                    className={cn(
                      'rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all',
                      ruleScope === 'service'
                        ? 'border-2 border-[#012A5E] bg-white shadow-2xs'
                        : 'border border-[#DCE2EB] bg-white hover:border-[#B8C5D6]',
                    )}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={cn(
                          'size-5 rounded-full border-2 flex items-center justify-center transition-all',
                          ruleScope === 'service'
                            ? 'border-[#012A5E]'
                            : 'border-[#B8C5D6]',
                        )}
                      >
                        {ruleScope === 'service' && (
                          <div className="size-2.5 rounded-full bg-[#012A5E]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <b className="text-sm font-bold text-[#012A5E] block leading-tight">
                        Specific service
                      </b>
                      <span className="text-xs font-semibold text-[#4F5B70] block mt-0.5 leading-tight">
                        Apply markup to one service module.
                      </span>

                      {ruleScope === 'service' && (
                        <div
                          className="mt-3 pt-2 border-t border-[#EEF1F5]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Label className="text-[11px] font-bold text-[#4F5B70] mb-1.5 block">
                            Select Service Module
                          </Label>
                          <Select
                            value={selectedService}
                            onValueChange={(val) =>
                              val && setSelectedService(val)
                            }
                          >
                            <SelectTrigger className="w-full text-xs font-bold">
                              <SelectValue placeholder="Choose service" />
                            </SelectTrigger>
                            <SelectContent>
                              {SERVICE_MODULES.map((s) => (
                                <SelectItem key={s.id} value={s.name}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Option 3: Specific supplier */}
                  <div
                    onClick={() => setRuleScope('supplier')}
                    className={cn(
                      'rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all',
                      ruleScope === 'supplier'
                        ? 'border-2 border-[#012A5E] bg-white shadow-2xs'
                        : 'border border-[#DCE2EB] bg-white hover:border-[#B8C5D6]',
                    )}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={cn(
                          'size-5 rounded-full border-2 flex items-center justify-center transition-all',
                          ruleScope === 'supplier'
                            ? 'border-[#012A5E]'
                            : 'border-[#B8C5D6]',
                        )}
                      >
                        {ruleScope === 'supplier' && (
                          <div className="size-2.5 rounded-full bg-[#012A5E]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <b className="text-sm font-bold text-[#012A5E] block leading-tight">
                        Specific supplier
                      </b>
                      <span className="text-xs font-semibold text-[#4F5B70] block mt-0.5 leading-tight">
                        Use only when supplier-level configuration is available.
                      </span>

                      {ruleScope === 'supplier' && (
                        <div
                          className="mt-3 pt-2 border-t border-[#EEF1F5]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Label className="text-[11px] font-bold text-[#4F5B70] mb-1.5 block">
                            Select Supplier / GDS
                          </Label>
                          <Select
                            value={selectedSupplier}
                            onValueChange={(val) =>
                              val && setSelectedSupplier(val)
                            }
                          >
                            <SelectTrigger className="w-full text-xs font-bold">
                              <SelectValue placeholder="Choose supplier" />
                            </SelectTrigger>
                            <SelectContent>
                              {SUPPLIER_OPTIONS.map((sup) => (
                                <SelectItem key={sup.id} value={sup.name}>
                                  {sup.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Markup Type */}
            <div className="border border-[#DCE2EB] rounded-2xl p-4 sm:p-5 bg-white space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="size-6 rounded-full bg-[#012A5E] text-white text-xs font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <h3 className="text-sm font-black text-[#012A5E]">
                  Markup Type
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Type 1: Percentage */}
                <div
                  onClick={() => setMarkupType('percentage')}
                  className={cn(
                    'rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all',
                    markupType === 'percentage'
                      ? 'border-2 border-[#012A5E] bg-white shadow-2xs'
                      : 'border border-[#DCE2EB] bg-white hover:border-[#B8C5D6]',
                  )}
                >
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={cn(
                        'size-5 rounded-full border-2 flex items-center justify-center transition-all',
                        markupType === 'percentage'
                          ? 'border-[#012A5E]'
                          : 'border-[#B8C5D6]',
                      )}
                    >
                      {markupType === 'percentage' && (
                        <div className="size-2.5 rounded-full bg-[#012A5E]" />
                      )}
                    </div>
                  </div>
                  <div>
                    <b className="text-sm font-black text-[#012A5E] block leading-tight">
                      Percentage
                    </b>
                    <span className="text-xs font-semibold text-[#4F5B70] block mt-0.5 leading-snug">
                      A percentage on top of the Parent Agent’s applicable rate.
                    </span>
                  </div>
                </div>

                {/* Type 2: Fixed Amount */}
                <div
                  onClick={() => setMarkupType('fixed')}
                  className={cn(
                    'rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all',
                    markupType === 'fixed'
                      ? 'border-2 border-[#012A5E] bg-white shadow-2xs'
                      : 'border border-[#DCE2EB] bg-white hover:border-[#B8C5D6]',
                  )}
                >
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={cn(
                        'size-5 rounded-full border-2 flex items-center justify-center transition-all',
                        markupType === 'fixed'
                          ? 'border-[#012A5E]'
                          : 'border-[#B8C5D6]',
                      )}
                    >
                      {markupType === 'fixed' && (
                        <div className="size-2.5 rounded-full bg-[#012A5E]" />
                      )}
                    </div>
                  </div>
                  <div>
                    <b className="text-sm font-bold text-[#012A5E] block leading-tight">
                      Fixed Amount
                    </b>
                    <span className="text-xs font-semibold text-[#4F5B70] block mt-0.5 leading-snug">
                      A fixed amount on top of the Parent Agent’s applicable
                      rate.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Markup Value */}
            <div className="border border-[#DCE2EB] rounded-2xl p-4 sm:p-5 bg-white space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="size-6 rounded-full bg-[#012A5E] text-white text-xs font-black flex items-center justify-center shrink-0">
                  3
                </div>
                <h3 className="text-sm font-black text-[#012A5E]">
                  Markup Value
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="drawer-markup-val"
                    className="text-xs font-black text-[#012A5E]"
                  >
                    {markupType === 'percentage'
                      ? 'Markup Percentage'
                      : 'Markup Fixed Amount'}
                  </Label>
                  <span className="px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#0267B8] text-[10.5px] font-bold">
                    Required
                  </span>
                </div>

                {/* Input with Suffix */}
                <div className="border border-[#DCE2EB] rounded-xl bg-white flex items-stretch focus-within:border-[#0267B8] focus-within:ring-2 focus-within:ring-[#0267B8]/20 transition-all overflow-hidden">
                  <input
                    id="drawer-markup-val"
                    type="number"
                    step="0.1"
                    min="0"
                    value={markupValue}
                    onChange={(e) => setMarkupValue(e.target.value)}
                    placeholder={markupType === 'percentage' ? '0' : '0.00'}
                    className="flex-1 px-4 py-2.5 text-base font-bold text-[#012A5E] placeholder:text-gray-400 outline-none"
                  />
                  <div className="px-4 py-2.5 bg-[#F4F6FA] border-l border-[#DCE2EB] text-[#4F5B70] font-bold text-sm select-none flex items-center justify-center min-w-12.5">
                    {markupType === 'percentage' ? '%' : 'BDT'}
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#64748B]">
                  Enter 0 or more. Admin limits: not available.
                </p>

                {/* Currency note */}
                <div className="flex items-start gap-2 pt-1 text-xs text-[#4F5B70]">
                  <Info className="size-4 text-[#0267B8] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Fixed markup values and final pricing follow the platform’s
                    configured currency rules.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-[#E6EAF0] bg-white p-4 sm:px-6 flex items-center justify-end gap-3 mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSheetOpen(false)}
              className="border border-[#DCE2EB] text-[#012A5E] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#F4F6FA] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleSaveRule()}
              className="bg-[#F1C134] hover:bg-[#E5B52B] text-[#012A5E] font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="size-4 stroke-[2.5]" />
              <span>Save Markup Rule</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Pricing Context Dialog (Shadcn Dialog) */}
      <Dialog open={contextDialogOpen} onOpenChange={setContextDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <div className="size-11 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-1">
              <Info className="size-5" />
            </div>
            <DialogTitle className="text-xl font-black text-[#012A5E]">
              Pricing & Inheritance Context
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4F5B70]">
              How rates, taxes, and sub-agent markups interact across{' '}
              {agentBusiness}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-3 text-xs text-[#4F5B70]">
            <div className="p-3 rounded-xl bg-[#FAFBFD] border border-[#DCE2EB] space-y-2">
              <div className="font-extrabold text-[#012A5E]">
                Pricing Architecture
              </div>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong>B2B Inventory Base Fare:</strong> Net fares negotiated
                  with airlines, global distribution systems (Amadeus, Sabre),
                  and bedbanks.
                </li>
                <li>
                  <strong>Parent Agent Pricing:</strong> Commission split or
                  primary agency markup set by {agentBusiness}.
                </li>
                <li>
                  <strong>Sub-agent Markup:</strong> Margin added on this screen
                  for bookings created by {deskName}.
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8FB] border border-[#E6EAF0]">
              <div className="font-bold text-[#141B28] mb-1">
                Settlement & Currency Note
              </div>
              <p>
                All ticket issuance transactions deduct directly from{' '}
                {agentBusiness}’s central wallet and available agency credit
                line.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setContextDialogOpen(false)}
              className="bg-[#012A5E] hover:bg-[#012048] text-white text-xs font-bold"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

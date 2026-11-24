import * as React from 'react'
import { useForm, useStore } from '@tanstack/react-form'
import {
  BarChart3,
  Calendar,
  CalendarDays,
  Coins,
  CreditCard,
  Download,
  Info,
  Layers,
  Plane,
  Building2,
  TrendingUp,
  Users,
  Wallet,
  ArrowRight,
  Filter,
  CheckCircle2,
  RotateCcw,
  Clock,
  Sparkles,
  Percent,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Database,
  Briefcase,
  Hotel,
  ShieldCheck,
  FileText,
  FileCheck2,
  Ban,
  AlertCircle,
  Eye,
  Ticket,
  Car,
  Smartphone,
  Train,
  Package,
  Compass,
  ArrowDownToLine,
  ListFilter,
  Check,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Building,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { AgentReportsExportDialog } from './agent-reports-export-dialog'
import { BookingPreviewSheet } from './booking-preview-sheet'
import type {
  ReportBookingRecord,
  ServiceBreakdownItem,
  StatusBreakdownItem,
  WalletReportTransaction,
  CreditFacilityRequest,
} from './agent-reports-data'
import {
  BOOKINGS_BY_SERVICE_DATA,
  BOOKINGS_BY_STATUS_DATA,
  REPORT_BOOKING_RECORDS,
  INITIAL_REPORT_KPIS,
  INITIAL_REPORT_AREAS,
  SERVICE_BREAKDOWN_DATA,
  STATUS_BREAKDOWN_DATA,
  SUBAGENT_PERFORMANCE_DATA,
  WALLET_CREDIT_REPORT_SUMMARY,
  WALLET_REPORT_TRANSACTIONS,
  CREDIT_FACILITY_REQUESTS,
  initialSalesSummary,
  initialSalesTransactions,
  initialServiceBreakdown,
} from './agent-reports-data'
import { AGENT_BOOKINGS_DATA } from './agent-bookings-data'
import type { AgentBookingItem } from './agent-bookings-data'
import { cn } from 'cn'
import { TopUpWalletDialog } from './top-up-wallet-dialog'
import { WalletLedgerTransactionDetailsSheet } from './wallet-ledger-transaction-details-sheet'
import { CommissionDetailsSheet } from './commission-details-sheet'
import { INITIAL_COMMISSION_RECORDS } from './commission-tracking-data'
import type { CommissionRecord } from './commission-tracking-data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'

export type ReportTabType =
  | 'overview'
  | 'sales'
  | 'bookings'
  | 'commissions'
  | 'wallet-credit'
  | 'sub-agents'

interface AgentReportsPageProps {
  initialTab?: ReportTabType
  initialExportOpen?: boolean
  initialNodeId?: string
}

export function AgentReportsPage({
  initialTab = 'bookings',
  initialExportOpen = false,
  initialNodeId,
}: AgentReportsPageProps) {
  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Active Report Tab: default to 'bookings' to match Figma node 821:1921
  const [activeTab, setActiveTab] = React.useState<ReportTabType>(() => {
    if (initialNodeId === '821-920' || initialNodeId === '821:920')
      return 'overview'
    if (initialNodeId === '821-1920' || initialNodeId === '821:1920')
      return 'sales'
    if (initialNodeId === '821-1921' || initialNodeId === '821:1921')
      return 'bookings'
    if (initialNodeId === '821-1922' || initialNodeId === '821:1922')
      return 'commissions'
    if (initialNodeId === '821-1923' || initialNodeId === '821:1923')
      return 'wallet-credit'
    if (initialNodeId === '821-1924' || initialNodeId === '821:1924')
      return 'sub-agents'
    return initialTab
  })

  // TanStack Form for Report Filters (#821:1577)
  const filterForm = useForm({
    defaultValues: {
      periodPreset: 'custom' as
        'this-month' | 'previous-month' | 'last-30-days' | 'custom',
      fromDate: '2026-10-01',
      toDate: '2026-11-16',
      serviceFilter: 'all',
      statusFilter: 'all',
      createdByFilter: 'all',
      supplier: 'unavailable',
    },
    onSubmit: async ({ value }) => {
      const filtersUsed: string[] = []
      if (value.serviceFilter !== 'all')
        filtersUsed.push(`Service: ${value.serviceFilter}`)
      if (value.statusFilter !== 'all')
        filtersUsed.push(`Status: ${value.statusFilter}`)
      if (value.createdByFilter !== 'all')
        filtersUsed.push(`Created: ${value.createdByFilter}`)
      if (searchQuery.trim()) filtersUsed.push(`Search: "${searchQuery}"`)

      const filterText =
        filtersUsed.length > 0
          ? filtersUsed.join(', ')
          : 'No additional filters'
      setAppliedInfo(
        `Applied: ${formatDateDisplay(value.fromDate)} – ${formatDateDisplay(value.toDate)} · ${filterText}`,
      )
    },
  })

  const formValues = useStore(filterForm.store, (state) => state.values)
  const {
    periodPreset,
    fromDate,
    toDate,
    serviceFilter,
    statusFilter,
    createdByFilter,
  } = formValues

  const [searchQuery, setSearchQuery] = React.useState('')

  // Export Dialog State
  const [exportDialogOpen, setExportDialogOpen] =
    React.useState(initialExportOpen)

  // Selected Booking for Preview Drawer
  const [selectedBooking, setSelectedBooking] =
    React.useState<AgentBookingItem | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)

  // Commission Details Sheet
  const [commissionDetailsOpen, setCommissionDetailsOpen] =
    React.useState(false)
  const [selectedCommissionRecord, setSelectedCommissionRecord] =
    React.useState<CommissionRecord | null>(null)
  const [commissionSearchQuery, setCommissionSearchQuery] = React.useState('')
  const [commissionStatusFilter, setCommissionStatusFilter] =
    React.useState<string>('all')
  const [commissionServiceFilter, setCommissionServiceFilter] =
    React.useState<string>('all')

  const handleOpenCommissionDetails = (record: CommissionRecord) => {
    setSelectedCommissionRecord(record)
    setCommissionDetailsOpen(true)
  }

  const filteredCommissions = React.useMemo(() => {
    return INITIAL_COMMISSION_RECORDS.filter((rec: CommissionRecord) => {
      if (commissionSearchQuery.trim()) {
        const query = commissionSearchQuery.toLowerCase()
        const matchesQuery =
          rec.bookingId.toLowerCase().includes(query) ||
          rec.customer.toLowerCase().includes(query) ||
          rec.createdByName.toLowerCase().includes(query) ||
          rec.service.toLowerCase().includes(query)
        if (!matchesQuery) return false
      }

      if (commissionStatusFilter !== 'all') {
        if (rec.commissionStatus !== commissionStatusFilter) return false
      }

      if (commissionServiceFilter !== 'all') {
        if (rec.service !== commissionServiceFilter) return false
      }

      return true
    })
  }, [commissionSearchQuery, commissionStatusFilter, commissionServiceFilter])

  // Applied notification badge / confirmation
  const [appliedInfo, setAppliedInfo] = React.useState(
    'Applied: 01 Oct 2026 – 16 Nov 2026 · No additional filters',
  )

  // Wallet & Credit tab state (Node #821:1923)
  const [topUpOpen, setTopUpOpen] = React.useState(false)
  const [selectedWalletTx, setSelectedWalletTx] = React.useState<any | null>(
    null,
  )
  const [walletDetailsOpen, setWalletDetailsOpen] = React.useState(false)
  const [walletSearch, setWalletSearch] = React.useState('')
  const [walletDirection, setWalletDirection] = React.useState<
    'All' | 'Credit' | 'Debit'
  >('All')
  const [walletType, setWalletType] = React.useState<string>('All')
  const [selectedCreditRequest, setSelectedCreditRequest] =
    React.useState<CreditFacilityRequest | null>(null)
  const [creditDetailsOpen, setCreditDetailsOpen] = React.useState(false)

  // Filtered wallet transactions
  const filteredWalletTransactions = React.useMemo(() => {
    return WALLET_REPORT_TRANSACTIONS.filter((tx) => {
      const matchSearch =
        walletSearch === '' ||
        tx.id.toLowerCase().includes(walletSearch.toLowerCase()) ||
        tx.reference.toLowerCase().includes(walletSearch.toLowerCase()) ||
        tx.description.toLowerCase().includes(walletSearch.toLowerCase()) ||
        tx.source.toLowerCase().includes(walletSearch.toLowerCase())

      const matchDirection =
        walletDirection === 'All' || tx.direction === walletDirection

      const matchType = walletType === 'All' || tx.type === walletType

      return matchSearch && matchDirection && matchType
    })
  }, [walletSearch, walletDirection, walletType])

  const handlePresetSelect = (
    preset: 'this-month' | 'previous-month' | 'last-30-days' | 'custom',
  ) => {
    filterForm.setFieldValue('periodPreset', preset)
    if (preset === 'this-month') {
      filterForm.setFieldValue('fromDate', '2026-11-01')
      filterForm.setFieldValue('toDate', '2026-11-30')
      setAppliedInfo('Applied: 01 Nov 2026 – 30 Nov 2026 (This Month)')
    } else if (preset === 'previous-month') {
      filterForm.setFieldValue('fromDate', '2026-10-01')
      filterForm.setFieldValue('toDate', '2026-10-31')
      setAppliedInfo('Applied: 01 Oct 2026 – 31 Oct 2026 (Previous Month)')
    } else if (preset === 'last-30-days') {
      filterForm.setFieldValue('fromDate', '2026-10-18')
      filterForm.setFieldValue('toDate', '2026-11-16')
      setAppliedInfo('Applied: 18 Oct 2026 – 16 Nov 2026 (Last 30 Days)')
    } else {
      filterForm.setFieldValue('fromDate', '2026-10-01')
      filterForm.setFieldValue('toDate', '2026-11-16')
      setAppliedInfo('Applied: 01 Oct 2026 – 16 Nov 2026 · Custom period')
    }
  }

  const handleApplyFilter = () => {
    filterForm.handleSubmit()
  }

  function formatDateDisplay(dStr: string) {
    if (!dStr) return ''
    const parts = dStr.split('-')
    if (parts.length !== 3) return dStr
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const mIdx = parseInt(parts[1], 10) - 1
    return `${parts[2]} ${months[mIdx] || parts[1]} ${parts[0]}`
  }

  // Filter booking records
  const filteredBookingRecords = React.useMemo(() => {
    return REPORT_BOOKING_RECORDS.filter((rec) => {
      // Service filter
      if (
        serviceFilter !== 'all' &&
        rec.service.toLowerCase() !== serviceFilter.toLowerCase()
      ) {
        return false
      }
      // Status filter
      if (
        statusFilter !== 'all' &&
        rec.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false
      }
      // Created by filter
      if (
        createdByFilter === 'parent' &&
        rec.createdByType !== 'Parent Agent'
      ) {
        return false
      }
      if (createdByFilter === 'sub' && rec.createdByType !== 'Sub-agent') {
        return false
      }
      if (
        createdByFilter === 'mirpur' &&
        !rec.createdBy.toLowerCase().includes('mirpur')
      ) {
        return false
      }
      if (
        createdByFilter === 'banani' &&
        !rec.createdBy.toLowerCase().includes('banani')
      ) {
        return false
      }
      if (
        createdByFilter === 'uttara' &&
        !rec.createdBy.toLowerCase().includes('uttara')
      ) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesRef = rec.ref.toLowerCase().includes(q)
        const matchesCustomer = rec.customer.toLowerCase().includes(q)
        const matchesService = rec.service.toLowerCase().includes(q)
        const matchesStatus = rec.status.toLowerCase().includes(q)
        if (
          !matchesRef &&
          !matchesCustomer &&
          !matchesService &&
          !matchesStatus
        ) {
          return false
        }
      }
      return true
    })
  }, [serviceFilter, statusFilter, createdByFilter, searchQuery])

  // Open booking preview sheet
  const handleViewBooking = (record: ReportBookingRecord) => {
    const fullBooking = AGENT_BOOKINGS_DATA.find((b) => b.ref === record.ref)
    if (fullBooking) {
      setSelectedBooking(fullBooking)
    } else {
      // Fallback object matching AgentBookingItem
      setSelectedBooking({
        id: record.id,
        ref: record.ref,
        customer: record.customer,
        customerEmail: `${record.customer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        customerPhone: '+880 1712 000000',
        onBehalf: true,
        service: record.service as AgentBookingItem['service'],
        travelDate: '15 Dec 2026',
        travelDateRaw: '2026-12-15',
        createdBy: record.createdBy,
        createdByType: record.createdByType,
        status: record.status,
        documentStatus: 'Voucher available',
        routeOrItem: `${record.service} booking confirmation for ${record.customer}`,
        supplier: record.supplier,
        fareAmount: record.totalAmount || 'BDT 15,000',
        markupAmount: 'BDT 1,500',
        totalAmount: record.totalAmount || 'BDT 16,500',
        bookingDate: record.bookingDate,
      })
    }
    setPreviewOpen(true)
  }

  // Icons for Service Breakdown
  const renderServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'flight':
        return <Plane className="size-4 text-[#0267B8]" />
      case 'hotel':
        return <Hotel className="size-4 text-[#0267B8]" />
      case 'travel package':
        return <Package className="size-4 text-[#0267B8]" />
      case 'activity':
        return <Compass className="size-4 text-[#0267B8]" />
      case 'car rental':
        return <Car className="size-4 text-[#0267B8]" />
      case 'esim':
        return <Smartphone className="size-4 text-[#0267B8]" />
      case 'bus / train':
        return <Train className="size-4 text-[#0267B8]" />
      case 'travel insurance':
        return <ShieldCheck className="size-4 text-[#0267B8]" />
      default:
        return <Briefcase className="size-4 text-[#0267B8]" />
    }
  }

  // Icons for Status Breakdown
  const renderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="size-3.5 text-[#B54708]" />
      case 'confirmed':
        return <CheckCircle2 className="size-3.5 text-[#0E6A3D]" />
      case 'ticketed':
        return <Ticket className="size-3.5 text-[#026AA2]" />
      case 'issued':
        return <FileCheck2 className="size-3.5 text-[#027A48]" />
      case 'cancelled':
        return <Ban className="size-3.5 text-[#475467]" />
      case 'refunded':
        return <RotateCcw className="size-3.5 text-[#344054]" />
      case 'failed':
        return <AlertCircle className="size-3.5 text-[#B42318]" />
      default:
        return <Info className="size-3.5 text-[#4F5B70]" />
    }
  }

  // Status Badge in Table
  const renderStatusBadge = (status: ReportBookingRecord['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F4EC] text-[#0E6A3D] border border-[#C5E9D5]">
            <CheckCircle2 className="size-3 shrink-0" />
            Confirmed
          </span>
        )
      case 'Issued':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF3] text-[#027A48] border border-[#ABEFC6]">
            <FileCheck2 className="size-3 shrink-0" />
            Issued
          </span>
        )
      case 'Ticketed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0F9FF] text-[#026AA2] border border-[#B9E6FE]">
            <Ticket className="size-3 shrink-0" />
            Ticketed
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]">
            <Clock className="size-3 shrink-0" />
            Pending
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F2F4F7] text-[#475467] border border-[#EAECF0]">
            <Ban className="size-3 shrink-0" />
            Cancelled
          </span>
        )
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0F4F8] text-[#344054] border border-[#D0D5DD]">
            <RotateCcw className="size-3 shrink-0" />
            Refunded
          </span>
        )
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
            <AlertCircle className="size-3 shrink-0" />
            Failed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F6FA] overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <AgentPortalSidebar
        activePath="/reports"
        currentActive="Reports"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <AgentPortalHeader
          breadcrumbCurrent="Reports"
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Reports', active: true },
          ]}
          onToggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Page Top Section (#821:1550) */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-[#0267B8] uppercase tracking-wider">
                Agent Portal · M2.12 Agent Reports
              </p>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                Agent Reports
              </h1>
              <p className="text-xs sm:text-sm text-[#4F5B70] max-w-2xl leading-relaxed">
                Review sales, booking, commission, wallet, credit and Sub-agent
                performance for your Agent account.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-bold text-[#012A5E]">
                  Skyline Demo Travels Ltd
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF2FA] text-[#4F5B70] border border-[#DCE2EB]">
                  <Database className="size-2.5 text-[#0267B8]" />
                  Sample data
                </span>
              </div>
            </div>

            {/* Top Action */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                type="button"
                onClick={() => setExportDialogOpen(true)}
                className="bg-[#F1C134] hover:bg-[#E5B324] text-[#012A5E] font-extrabold text-xs sm:text-sm px-5 py-2.5 h-11 rounded-xl shadow-xs transition-all flex items-center gap-2 border border-[#E0B228] cursor-pointer"
              >
                <Download className="size-4 text-[#012A5E]" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Filter Bar Card (#821:1572) using TanStack Form */}
          <section className="bg-white border border-[#DCE2EB] rounded-[18px] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Clock className="size-4 text-[#012A5E]" />
              <h2 className="text-sm font-bold text-[#012A5E] tracking-tight">
                Report Period & Filters
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                filterForm.handleSubmit()
              }}
              className="space-y-4"
            >
              {/* Presets Row */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('this-month')}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer',
                    periodPreset === 'this-month'
                      ? 'bg-[#DEE8F5] text-[#012A5E] border-[#012A5E] font-bold'
                      : 'bg-white text-[#4F5B70] border-[#DCE2EB] hover:bg-[#F4F6FA]',
                  )}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('previous-month')}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer',
                    periodPreset === 'previous-month'
                      ? 'bg-[#DEE8F5] text-[#012A5E] border-[#012A5E] font-bold'
                      : 'bg-white text-[#4F5B70] border-[#DCE2EB] hover:bg-[#F4F6FA]',
                  )}
                >
                  Previous Month
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('last-30-days')}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer',
                    periodPreset === 'last-30-days'
                      ? 'bg-[#DEE8F5] text-[#012A5E] border-[#012A5E] font-bold'
                      : 'bg-white text-[#4F5B70] border-[#DCE2EB] hover:bg-[#F4F6FA]',
                  )}
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('custom')}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer',
                    periodPreset === 'custom'
                      ? 'bg-[#DEE8F5] text-[#012A5E] border-[#012A5E] font-bold shadow-2xs'
                      : 'bg-white text-[#4F5B70] border-[#DCE2EB] hover:bg-[#F4F6FA]',
                  )}
                >
                  Custom
                </button>
              </div>

              {/* Inputs Grid: 6 columns powered by TanStack Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                {/* FROM */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4F5B70] uppercase tracking-wider block">
                    From
                  </label>
                  <filterForm.Field
                    name="fromDate"
                    children={(field) => (
                      <div className="relative">
                        <Input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            filterForm.setFieldValue('periodPreset', 'custom')
                          }}
                          className="h-10 text-xs rounded-xl bg-white border-[#DCE2EB] text-[#012A5E] font-semibold pr-8"
                        />
                        <Calendar className="size-4 text-[#8C9BB0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  />
                </div>

                {/* TO */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4F5B70] uppercase tracking-wider block">
                    To
                  </label>
                  <filterForm.Field
                    name="toDate"
                    children={(field) => (
                      <div className="relative">
                        <Input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            filterForm.setFieldValue('periodPreset', 'custom')
                          }}
                          className="h-10 text-xs rounded-xl bg-white border-[#DCE2EB] text-[#012A5E] font-semibold pr-8"
                        />
                        <Calendar className="size-4 text-[#8C9BB0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  />
                </div>

                {/* SERVICE */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4F5B70] uppercase tracking-wider block">
                    Service
                  </label>
                  <filterForm.Field
                    name="serviceFilter"
                    children={(field) => (
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                      >
                        <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-[#DCE2EB] text-[#012A5E] font-semibold">
                          <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          <SelectItem value="flight">Flight</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="travel package">
                            Travel Package
                          </SelectItem>
                          <SelectItem value="activity">Activity</SelectItem>
                          <SelectItem value="car rental">Car Rental</SelectItem>
                          <SelectItem value="esim">eSIM</SelectItem>
                          <SelectItem value="bus / train">
                            Bus / Train
                          </SelectItem>
                          <SelectItem value="travel insurance">
                            Travel Insurance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* BOOKING STATUS */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4F5B70] uppercase tracking-wider block">
                    Booking Status
                  </label>
                  <filterForm.Field
                    name="statusFilter"
                    children={(field) => (
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                      >
                        <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-[#DCE2EB] text-[#012A5E] font-semibold">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="ticketed">Ticketed</SelectItem>
                          <SelectItem value="issued">Issued</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* CREATED BY */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4F5B70] uppercase tracking-wider block">
                    Created By
                  </label>
                  <filterForm.Field
                    name="createdByFilter"
                    children={(field) => (
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                      >
                        <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-[#DCE2EB] text-[#012A5E] font-semibold">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="parent">
                            Skyline Demo Travels (HQ)
                          </SelectItem>
                          <SelectItem value="sub">Sub-agents only</SelectItem>
                          <SelectItem value="mirpur">Mirpur Desk</SelectItem>
                          <SelectItem value="banani">Banani Desk</SelectItem>
                          <SelectItem value="uttara">Uttara Desk</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* SUPPLIER */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4F5B70] uppercase tracking-wider block">
                    Supplier
                  </label>
                  <Select value="unavailable" disabled>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-[#F4F6FA] border-[#DCE2EB] text-[#8C9BB0] opacity-80 cursor-not-allowed">
                      <SelectValue placeholder="Supplier data unavail..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unavailable">
                        Supplier data unavailable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-[#F1C134] hover:bg-[#E5B324] text-[#012A5E] font-bold text-xs px-5 h-9 rounded-xl shadow-2xs border border-[#E0B228] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="size-3.5 stroke-3" />
                  Apply
                </Button>
                <span className="text-xs text-[#4F5B70] font-medium">
                  {appliedInfo}
                </span>
              </div>
            </form>
          </section>

          {/* Report Sections Tab Navigation (#821:1664) */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-1.5 shadow-2xs flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                activeTab === 'overview'
                  ? 'bg-[#EBF2FA] text-[#012A5E] shadow-2xs'
                  : 'text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]',
              )}
            >
              <Layers className="size-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sales')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                activeTab === 'sales'
                  ? 'bg-[#EBF2FA] text-[#012A5E] shadow-2xs'
                  : 'text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]',
              )}
            >
              <TrendingUp className="size-4" />
              <span>Sales</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer relative',
                activeTab === 'bookings'
                  ? 'bg-[#EBF2FA] text-[#012A5E] shadow-2xs'
                  : 'text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]',
              )}
            >
              <CalendarDays className="size-4" />
              <span>Bookings</span>
              {activeTab === 'bookings' && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#012A5E] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('commissions')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                activeTab === 'commissions'
                  ? 'bg-[#EBF2FA] text-[#012A5E] shadow-2xs'
                  : 'text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]',
              )}
            >
              <Percent className="size-4" />
              <span>Commissions</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wallet-credit')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                activeTab === 'wallet-credit'
                  ? 'bg-[#EBF2FA] text-[#012A5E] shadow-2xs'
                  : 'text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]',
              )}
            >
              <Wallet className="size-4" />
              <span>Wallet & Credit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sub-agents')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                activeTab === 'sub-agents'
                  ? 'bg-[#EBF2FA] text-[#012A5E] shadow-2xs'
                  : 'text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]',
              )}
            >
              <Users className="size-4" />
              <span>Sub-agent Performance</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB: BOOKINGS (NODE 821:1921 — THE TARGET FIGMA PAGE)   */}
          {/* ======================================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Row 1: Two Breakdown Cards (Grid 2 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1: Bookings by Service */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#DEE8F5] flex items-center justify-center shrink-0 text-[#0267B8]">
                          <Plane className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#012A5E]">
                            Bookings by Service
                          </h3>
                          <p className="text-xs text-[#6B778C]">
                            12 bookings across the 8 service modules
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                        <Info className="size-3 text-[#0267B8]" />
                        Sample data
                      </span>
                    </div>

                    {/* Service Rows */}
                    <div className="space-y-3.5">
                      {BOOKINGS_BY_SERVICE_DATA.map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center gap-3 text-xs"
                        >
                          {/* Label with Icon */}
                          <div className="flex items-center gap-2 w-36 shrink-0 font-bold text-[#012A5E]">
                            {renderServiceIcon(srv.service)}
                            <span>{srv.service}</span>
                          </div>

                          {/* Progress Track & Bar */}
                          <div className="flex-1 bg-[#DEE8F5]/50 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#0267B8] h-full rounded-full transition-all duration-500"
                              style={{ width: `${srv.percentage}%` }}
                            />
                          </div>

                          {/* Count & Share */}
                          <div className="w-16 text-right shrink-0 font-extrabold text-[#012A5E]">
                            {srv.count} · {srv.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card 2: Bookings by Status */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#DEE8F5] flex items-center justify-center shrink-0 text-[#0267B8]">
                          <FileCheck2 className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#012A5E]">
                            Bookings by Status
                          </h3>
                          <p className="text-xs text-[#6B778C]">
                            Approved booking lifecycle
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                        <Info className="size-3 text-[#0267B8]" />
                        Sample data
                      </span>
                    </div>

                    {/* Status Rows */}
                    <div className="space-y-3.5">
                      {BOOKINGS_BY_STATUS_DATA.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center gap-3 text-xs"
                        >
                          {/* Label with Status Icon */}
                          <div className="flex items-center gap-2 w-32 shrink-0 font-bold text-[#012A5E]">
                            {renderStatusIcon(st.status)}
                            <span>{st.status}</span>
                          </div>

                          {/* Progress Bar (proportional to 4 max) */}
                          <div className="flex-1 bg-[#DEE8F5]/50 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#0267B8] h-full rounded-full transition-all duration-500"
                              style={{ width: `${(st.count / 4) * 100}%` }}
                            />
                          </div>

                          {/* Count */}
                          <div className="w-12 text-right shrink-0 font-extrabold text-[#012A5E]">
                            {st.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Total */}
                  <div className="border-t border-[#DCE2EB] pt-3.5 mt-5 flex items-center justify-between text-xs font-extrabold text-[#012A5E]">
                    <span>Total</span>
                    <span>12</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Bookings by Supplier Notice Card */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#DEE8F5] flex items-center justify-center shrink-0 text-[#0267B8]">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#012A5E]">
                      Bookings by Supplier
                    </h3>
                    <p className="text-xs text-[#6B778C]">
                      Supplier-based reporting
                    </p>
                  </div>
                </div>

                {/* Info Callout */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3.5">
                  <Database className="size-5 text-[#64748B] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                      Supplier information unavailable in this design-preview
                      dataset
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Bookings by Supplier is supported: when supplier data is
                      provided, bookings are grouped by supplier here and the
                      Supplier filter becomes available.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 3: Booking records Table Card */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                {/* Table Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#FFF6E3] flex items-center justify-center shrink-0 text-[#B54708]">
                      <Ticket className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#012A5E]">
                        Booking records
                      </h3>
                      <p className="text-xs text-[#6B778C]">
                        Supporting rows — the full list is in Booking History
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quick Search */}
                    <div className="relative w-48 sm:w-60">
                      <Search className="size-3.5 text-[#8C9BB0] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-xs rounded-lg border-[#DCE2EB]"
                      />
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                      <Info className="size-3 text-[#0267B8]" />
                      Sample data
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#DCE2EB] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F8F9FB]">
                      <TableRow className="border-b border-[#DCE2EB]">
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                          Booking Reference
                        </TableHead>
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                          Customer
                        </TableHead>
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                          Service
                        </TableHead>
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                          Status
                        </TableHead>
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                          Created By
                        </TableHead>
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                          Supplier
                        </TableHead>
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                          Booking Date
                        </TableHead>
                        <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookingRecords.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="py-8 text-center text-xs text-[#64748B]"
                          >
                            No booking records match the selected filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookingRecords.map((rec) => (
                          <TableRow
                            key={rec.id}
                            className="hover:bg-[#F4F6FA]/60 border-b border-[#DCE2EB]/80 transition-colors"
                          >
                            <TableCell className="font-mono text-xs font-bold text-[#012A5E] py-3.5 px-4">
                              {rec.ref}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-[#0F172A] py-3.5 px-4">
                              {rec.customer}
                            </TableCell>
                            <TableCell className="text-xs text-[#334155] py-3.5 px-4">
                              {rec.service}
                            </TableCell>
                            <TableCell className="py-3.5 px-4">
                              {renderStatusBadge(rec.status)}
                            </TableCell>
                            <TableCell className="py-3.5 px-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#0F172A]">
                                  {rec.createdBy}
                                </span>
                                <span className="text-[10px] text-[#64748B]">
                                  {rec.createdByType}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-[#94A3B8] py-3.5 px-4">
                              {rec.supplier}
                            </TableCell>
                            <TableCell className="text-xs text-[#334155] py-3.5 px-4 whitespace-nowrap">
                              {rec.bookingDate}
                            </TableCell>
                            <TableCell className="text-right py-3.5 px-4 whitespace-nowrap">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewBooking(rec)}
                                className="h-8 px-3 text-xs font-semibold rounded-lg border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F8FAFC] shadow-2xs gap-1.5 cursor-pointer"
                              >
                                <Eye className="size-3.5 text-[#64748B]" />
                                <span>View Booking</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Table Footer Note */}
                <p className="text-xs text-[#64748B] italic pt-1">
                  Booking dates are fictional samples (same as the approved
                  Agent Statements).
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: OVERVIEW (NODE 821:920)                             */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top 5 KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {INITIAL_REPORT_KPIS.map((kpi) => (
                  <div
                    key={kpi.id}
                    className="bg-white border border-[#DCE2EB] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-3 hover:border-[#0267B8]/30 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'size-8 rounded-lg flex items-center justify-center shrink-0',
                          kpi.badgeBg,
                          kpi.iconColor,
                        )}
                      >
                        {kpi.iconType === 'bookings' && (
                          <CalendarDays className="size-4" />
                        )}
                        {kpi.iconType === 'sales' && (
                          <TrendingUp className="size-4" />
                        )}
                        {kpi.iconType === 'commission' && (
                          <Coins className="size-4" />
                        )}
                        {kpi.iconType === 'wallet' && (
                          <Wallet className="size-4" />
                        )}
                        {kpi.iconType === 'subagents' && (
                          <Users className="size-4" />
                        )}
                      </div>
                      <h3 className="text-xs font-semibold text-[#4F5B70] leading-tight">
                        {kpi.title}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <div className="text-lg sm:text-xl font-bold text-[#012A5E] tracking-tight">
                        {kpi.metric}
                      </div>
                      <p className="text-[11px] text-[#6B778C] leading-snug">
                        {kpi.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 8 Detailed Report Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {INITIAL_REPORT_AREAS.map((area) => (
                  <div
                    key={area.id}
                    className="bg-white border border-[#DCE2EB] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-4 hover:shadow-sm hover:border-[#0267B8]/40 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'size-7 rounded-lg flex items-center justify-center shrink-0',
                            area.iconBgColor,
                            area.iconColor,
                          )}
                        >
                          {area.iconType === 'sales' && (
                            <TrendingUp className="size-3.5" />
                          )}
                          {area.iconType === 'service' && (
                            <Plane className="size-3.5" />
                          )}
                          {area.iconType === 'supplier' && (
                            <Building2 className="size-3.5" />
                          )}
                          {area.iconType === 'status' && (
                            <FileCheck2 className="size-3.5" />
                          )}
                          {area.iconType === 'commission' && (
                            <Percent className="size-3.5" />
                          )}
                          {area.iconType === 'wallet' && (
                            <Wallet className="size-3.5" />
                          )}
                          {area.iconType === 'credit' && (
                            <CreditCard className="size-3.5" />
                          )}
                          {area.iconType === 'subagent' && (
                            <Users className="size-3.5" />
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[#012A5E]">
                          {area.title}
                        </h4>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm sm:text-base font-extrabold text-[#012A5E]">
                          {area.metric}
                        </div>
                        <p className="text-[11px] text-[#4F5B70] leading-snug">
                          {area.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab(area.targetTab)}
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1.5 pt-2 border-t border-[#DCE2EB]/60 group-hover:translate-x-0.5 transition-all w-fit cursor-pointer"
                    >
                      <span>Open report</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footnote Banner */}
              <div className="bg-[#EBF2FA]/80 border border-[#DCE2EB] rounded-xl px-4 py-3 flex items-start sm:items-center gap-3 text-xs text-[#4F5B70]">
                <Info className="size-4 text-[#0267B8] shrink-0 mt-0.5 sm:mt-0" />
                <p className="leading-relaxed">
                  Agent-level reports for{' '}
                  <span className="font-bold text-[#012A5E]">
                    Skyline Demo Travels Ltd
                  </span>{' '}
                  and its Sub-agents only. Platform-wide Admin reporting (M16)
                  is separate.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: SALES (NODE 821:1920)                               */}
          {/* ======================================================== */}
          {activeTab === 'sales' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs">
                  <span className="text-xs text-[#4F5B70] font-semibold uppercase">
                    Total Gross Sales
                  </span>
                  <div className="text-2xl font-extrabold text-[#012A5E] mt-1">
                    BDT 1,485,600
                  </div>
                  <span className="text-[11px] text-[#00875A] font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="size-3" /> +14.2% vs previous period
                  </span>
                </div>
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs">
                  <span className="text-xs text-[#4F5B70] font-semibold uppercase">
                    Net Sales (After Payout)
                  </span>
                  <div className="text-2xl font-extrabold text-[#012A5E] mt-1">
                    BDT 1,382,200
                  </div>
                  <span className="text-[11px] text-[#4F5B70] mt-1">
                    Settled & ticketed volume
                  </span>
                </div>
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs">
                  <span className="text-xs text-[#4F5B70] font-semibold uppercase">
                    Total Commission Earned
                  </span>
                  <div className="text-2xl font-extrabold text-[#0267B8] mt-1">
                    BDT 103,400
                  </div>
                  <span className="text-[11px] text-[#4F5B70] mt-1">
                    Agency average margin: 6.96%
                  </span>
                </div>
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs">
                  <span className="text-xs text-[#4F5B70] font-semibold uppercase">
                    Average Order Value (AOV)
                  </span>
                  <div className="text-2xl font-extrabold text-[#012A5E] mt-1">
                    BDT 123,800
                  </div>
                  <span className="text-[11px] text-[#4F5B70] mt-1">
                    Across 12 confirmed bookings
                  </span>
                </div>
              </div>

              {/* Service Sales Breakdown */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#012A5E]">
                    Sales Breakdown by Travel Service
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExportDialogOpen(true)}
                    className="text-xs font-semibold text-[#0267B8] border-[#DCE2EB] cursor-pointer"
                  >
                    Export Sales CSV
                  </Button>
                </div>

                <div className="rounded-xl border border-[#DCE2EB] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F8F9FB]">
                      <TableRow>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Service Category
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Bookings
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Gross Sales
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Commission
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Net Sales
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Revenue Share
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SERVICE_BREAKDOWN_DATA.map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-[#F4F6FA]/50">
                          <TableCell className="font-bold text-[#012A5E] text-xs">
                            {item.service}
                          </TableCell>
                          <TableCell className="text-center font-medium text-xs text-[#4F5B70]">
                            {item.bookingsCount}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs text-[#012A5E]">
                            {item.grossSales}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs text-[#00875A]">
                            {item.commissionEarned}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs text-[#012A5E]">
                            {item.netSales}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-[#EBF2FA] h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#0267B8] h-full rounded-full"
                                  style={{ width: `${item.sharePercentage}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-[#4F5B70] w-7 text-right">
                                {item.sharePercentage}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: COMMISSIONS (NODE 821:1922)                         */}
          {/* ======================================================== */}
          {activeTab === 'commissions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header card with summary & quick action */}
              <div className="bg-white p-6 rounded-2xl border border-[#DCE2EB] shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#012A5E]">
                        Commission Tracking & Settlement Report
                      </h2>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-[#EBF2FA] text-[#0267B8] border-[#CFE4FA]"
                      >
                        Node #821:1922
                      </Badge>
                    </div>
                    <p className="text-xs text-[#4F5B70] mt-0.5">
                      Track commissions generated from confirmed bookings and
                      review settlement status
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#FFF6E3] text-[#B54708] border-[#FADBB3] font-bold">
                      3 Active · 2 Reversed
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = '/commissions'
                      }}
                      className="text-xs font-semibold text-[#0267B8] border-[#CFE4FA] hover:bg-[#EBF2FA] flex items-center gap-1.5 h-8 cursor-pointer"
                    >
                      <ExternalLink className="size-3.5" />
                      Full Ledger
                    </Button>
                  </div>
                </div>

                {/* 4 Summary KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {/* Card 1: Pending */}
                  <div className="p-4 rounded-xl bg-[#FFFBF0] border border-[#FADBB3] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#B54708] font-bold uppercase tracking-wider">
                        Pending
                      </span>
                      <div className="size-7 rounded-lg bg-white/90 border border-[#FADBB3] flex items-center justify-center text-[#B54708]">
                        <Clock className="size-3.5" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-[#012A5E]">
                        1 Booking
                      </div>
                      <p className="text-xs font-bold text-[#B54708] mt-0.5">
                        AW-DEMO-FL-006
                      </p>
                      <p className="text-[11px] text-[#4F5B70] mt-1">
                        Commission currently shown as pending
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Earned */}
                  <div className="p-4 rounded-xl bg-[#F0F7FD] border border-[#CFE4FA] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#0267B8] font-bold uppercase tracking-wider">
                        Earned
                      </span>
                      <div className="size-7 rounded-lg bg-white/90 border border-[#CFE4FA] flex items-center justify-center text-[#0267B8]">
                        <TrendingUp className="size-3.5" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-[#012A5E]">
                        1 Booking
                      </div>
                      <p className="text-xs font-bold text-[#0267B8] mt-0.5">
                        AW-DEMO-HT-002
                      </p>
                      <p className="text-[11px] text-[#4F5B70] mt-1">
                        Commission currently shown as earned
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Settled */}
                  <div className="p-4 rounded-xl bg-[#EBF7EF] border border-[#C5E9D5] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#0E6A3D] font-bold uppercase tracking-wider">
                        Settled
                      </span>
                      <div className="size-7 rounded-lg bg-white/90 border border-[#C5E9D5] flex items-center justify-center text-[#0E6A3D]">
                        <CheckCircle2 className="size-3.5" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-[#012A5E]">
                        1 Booking
                      </div>
                      <p className="text-xs font-bold text-[#0E6A3D] mt-0.5">
                        AW-DEMO-PK-003
                      </p>
                      <p className="text-[11px] text-[#4F5B70] mt-1">
                        Commission settlement recorded by Aero Wing
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Reversed */}
                  <div className="p-4 rounded-xl bg-[#FEE4E2] border border-[#FECDCA] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#B42318] font-bold uppercase tracking-wider">
                        Reversed
                      </span>
                      <div className="size-7 rounded-lg bg-white/90 border border-[#FECDCA] flex items-center justify-center text-[#B42318]">
                        <RotateCcw className="size-3.5" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-[#012A5E]">
                        2 Bookings
                      </div>
                      <p className="text-xs font-bold text-[#B42318] mt-0.5">
                        AW-DEMO-AC-011 · CR-005
                      </p>
                      <p className="text-[11px] text-[#4F5B70] mt-1">
                        Reversals due to cancellation & refund
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Configuration Card (#745:6210) */}
              <div className="bg-white p-5 rounded-2xl border border-[#DCE2EB] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-[#F2F4F7] flex items-center justify-center text-[#012A5E]">
                      <Lock className="size-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[#012A5E]">
                      Commission Configuration
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[11px] text-[#4F5B70]"
                  >
                    Managed by Aero Wing Admin
                  </Badge>
                </div>
                <p className="text-xs text-[#4F5B70]">
                  Commission rules are configured by Aero Wing Admin. Agents
                  cannot edit commission rates.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC]">
                    <span className="text-[10px] font-bold text-[#4F5B70] uppercase">
                      Agent
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-0.5">
                      Skyline Demo Travels Ltd
                    </p>
                    <p className="text-[10px] text-[#4F5B70]">
                      M2-A001 · Active
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC]">
                    <span className="text-[10px] font-bold text-[#4F5B70] uppercase">
                      Supplier
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-0.5">
                      Admin Managed
                    </p>
                    <p className="text-[10px] text-[#4F5B70]">
                      Platform-wide agreements
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC]">
                    <span className="text-[10px] font-bold text-[#4F5B70] uppercase">
                      Commission Rule
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-0.5">
                      Admin configured
                    </p>
                    <p className="text-[10px] text-[#4F5B70]">
                      Tier 1 Agency schedule
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC]">
                    <span className="text-[10px] font-bold text-[#4F5B70] uppercase">
                      Rate Schedule
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-0.5">
                      Rate configured by Aero Wing
                    </p>
                    <p className="text-[10px] text-[#4F5B70]">
                      Auto-credited upon settlement
                    </p>
                  </div>
                </div>
              </div>

              {/* Commission History / Records Table */}
              <div className="bg-white rounded-2xl border border-[#DCE2EB] shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-[#DCE2EB] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#012A5E]">
                      Commission History & Activity
                    </h3>
                    <p className="text-xs text-[#4F5B70]">
                      Booking-level commission tracking · review settlement
                      status
                    </p>
                  </div>

                  {/* Filter controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="size-3.5 text-[#4F5B70] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <Input
                        placeholder="Search commissions..."
                        value={commissionSearchQuery}
                        onChange={(e) =>
                          setCommissionSearchQuery(e.target.value)
                        }
                        className="h-8 text-xs pl-8 w-44 rounded-lg border-[#D0D5DD]"
                      />
                    </div>

                    <Select
                      value={commissionStatusFilter}
                      onValueChange={(val) =>
                        setCommissionStatusFilter(val || 'all')
                      }
                    >
                      <SelectTrigger className="h-8 text-xs w-36 rounded-lg border-[#D0D5DD]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Earned">Earned</SelectItem>
                        <SelectItem value="Settled">Settled</SelectItem>
                        <SelectItem value="Commission reversed">
                          Reversed
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={commissionServiceFilter}
                      onValueChange={(val) =>
                        setCommissionServiceFilter(val || 'all')
                      }
                    >
                      <SelectTrigger className="h-8 text-xs w-32 rounded-lg border-[#D0D5DD]">
                        <SelectValue placeholder="Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="Flight">Flight</SelectItem>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Travel Package">Package</SelectItem>
                        <SelectItem value="Activity">Activity</SelectItem>
                        <SelectItem value="Car Rental">Car Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 bg-[#F8F9FB] border-b border-[#DCE2EB] flex items-center justify-between text-xs text-[#4F5B70]">
                  <span>
                    Showing {filteredCommissions.length} of{' '}
                    {INITIAL_COMMISSION_RECORDS.length} commission records
                  </span>
                  <span className="text-[11px]">
                    Click any record to inspect full audit details
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#F8F9FB]">
                      <TableRow>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Booking Ref
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Customer
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Service
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Created By
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Booking Status
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Commission Status
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Commission
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCommissions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-8 text-xs text-[#4F5B70]"
                          >
                            No commission records match your search or filter
                            criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCommissions.map((rec) => {
                          const getServiceIcon = () => {
                            switch (rec.service) {
                              case 'Flight':
                                return (
                                  <Plane className="size-3.5 text-[#0267B8]" />
                                )
                              case 'Hotel':
                                return (
                                  <Building className="size-3.5 text-[#12B76A]" />
                                )
                              case 'Travel Package':
                                return (
                                  <Package className="size-3.5 text-[#F79009]" />
                                )
                              case 'Activity':
                                return (
                                  <Compass className="size-3.5 text-[#7F56D9]" />
                                )
                              case 'Car Rental':
                                return (
                                  <Car className="size-3.5 text-[#06AED4]" />
                                )
                              default:
                                return (
                                  <Coins className="size-3.5 text-[#4F5B70]" />
                                )
                            }
                          }

                          return (
                            <TableRow
                              key={rec.id}
                              className="hover:bg-[#F4F6FA]/70 cursor-pointer transition-colors"
                              onClick={() => handleOpenCommissionDetails(rec)}
                            >
                              <TableCell className="font-bold text-xs text-[#0267B8]">
                                <div className="flex items-center gap-1.5">
                                  {getServiceIcon()}
                                  <span>{rec.bookingId}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs font-semibold text-[#012A5E]">
                                {rec.customer}
                              </TableCell>
                              <TableCell className="text-xs text-[#4F5B70]">
                                {rec.service}
                              </TableCell>
                              <TableCell className="text-xs text-[#4F5B70]">
                                <div className="flex items-center gap-1">
                                  <span>{rec.createdByName}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                      rec.createdBySource === 'Sub-agent'
                                        ? 'bg-[#EBF7EF] text-[#0E6A3D]'
                                        : 'bg-[#F2F4F7] text-[#4F5B70]'
                                    }`}
                                  >
                                    {rec.createdBySource}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] font-semibold ${
                                    rec.bookingStatus === 'Confirmed'
                                      ? 'bg-[#EBF7EF] text-[#0E6A3D] border-[#C5E9D5]'
                                      : rec.bookingStatus === 'Refunded'
                                        ? 'bg-[#FFF6E3] text-[#B54708] border-[#FADBB3]'
                                        : 'bg-[#FEE4E2] text-[#B42318] border-[#FECDCA]'
                                  }`}
                                >
                                  {rec.bookingStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                    rec.commissionStatus === 'Settled'
                                      ? 'bg-[#EBF7EF] text-[#0E6A3D]'
                                      : rec.commissionStatus === 'Pending'
                                        ? 'bg-[#FFF6E3] text-[#B54708]'
                                        : rec.commissionStatus === 'Earned'
                                          ? 'bg-[#E0F2FE] text-[#0369A1]'
                                          : 'bg-[#FEE4E2] text-[#B42318]'
                                  }`}
                                >
                                  {rec.commissionStatus}
                                </span>
                                {rec.reversedReason && (
                                  <div className="text-[10px] text-[#4F5B70] mt-0.5">
                                    {rec.reversedReason}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right text-xs font-bold text-[#012A5E]">
                                {rec.amount}
                              </TableCell>
                              <TableCell
                                className="text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenCommissionDetails(rec)
                                  }
                                  className="h-7 px-2 text-xs text-[#0267B8] hover:text-[#014A85] hover:bg-[#EBF2FA] flex items-center gap-1 mx-auto cursor-pointer"
                                >
                                  <Eye className="size-3.5" />
                                  <span>Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Guidance & Policy Callout Cards (#745:6579-6630) */}
              <div className="bg-white p-5 rounded-2xl border border-[#DCE2EB] shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="size-4.5 text-[#0267B8]" />
                  <h4 className="text-sm font-bold text-[#012A5E]">
                    Commission Rules & Settlement Policies
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] space-y-1">
                    <p className="text-xs font-bold text-[#012A5E]">
                      Status Lifecycle
                    </p>
                    <p className="text-[11px] text-[#4F5B70]">
                      Commission progresses through <strong>Pending</strong>,{' '}
                      <strong>Earned</strong>, and <strong>Settled</strong>.
                      Reversed commissions reflect refunds or cancellations.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] space-y-1">
                    <p className="text-xs font-bold text-[#012A5E]">
                      Automatic Calculation
                    </p>
                    <p className="text-[11px] text-[#4F5B70]">
                      Commission is calculated on each confirmed booking based
                      on the rule set by Aero Wing Admin.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] space-y-1">
                    <p className="text-xs font-bold text-[#012A5E]">
                      Manual Settlement
                    </p>
                    <p className="text-[11px] text-[#4F5B70]">
                      Settlement payments are recorded manually by Aero Wing
                      Admin directly into your Agency wallet or credit ledger.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] space-y-1">
                    <p className="text-xs font-bold text-[#012A5E]">
                      Cancellation Reversals
                    </p>
                    <p className="text-[11px] text-[#4F5B70]">
                      Commission is reversed automatically on booking
                      cancellation or customer refund and excluded from active
                      settlement totals.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] space-y-1">
                    <p className="text-xs font-bold text-[#012A5E]">
                      Created By Source
                    </p>
                    <p className="text-[11px] text-[#4F5B70]">
                      Created By displays where a booking originated (Parent
                      Agent HQ or authorized Sub-agent desks).
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E4E7EC] space-y-1">
                    <p className="text-xs font-bold text-[#012A5E]">
                      Wallet Separation
                    </p>
                    <p className="text-[11px] text-[#4F5B70]">
                      Commission is tracked separately from client pricing
                      markups and agency cash top-up balances.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: WALLET & CREDIT (NODE 821:1923)                     */}
          {/* ======================================================== */}
          {activeTab === 'wallet-credit' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Action Banner */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-[#012A5E]">
                      Wallet & Credit Facility Reports
                    </h2>
                    <Badge className="bg-[#E6F4EA] text-[#137333] border-[#C3E6CD] text-[11px] font-bold">
                      ● Active B2B Partner
                    </Badge>
                    <Badge className="bg-[#EBF2FA] text-[#0267B8] border-[#CFE4FA] text-[11px] font-semibold">
                      Skyline Demo Travels Ltd (AG-8842)
                    </Badge>
                  </div>
                  <p className="text-xs text-[#4F5B70]">
                    Consolidated cash ledger activity, top-up funding, airline
                    ticketing debits, and credit line facility status for the
                    applied reporting period.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Button
                    type="button"
                    onClick={() => setTopUpOpen(true)}
                    className="bg-[#F1C134] hover:bg-[#E5B324] text-[#012A5E] font-bold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-3.5 stroke-3" />
                    <span>Top-up Wallet</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setExportDialogOpen(true)}
                    className="text-xs font-bold text-[#012A5E] border-[#DCE2EB] hover:bg-[#F4F6FA] h-9 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="size-3.5 text-[#0267B8]" />
                    <span>Export CSV</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      window.location.href = '/credit'
                    }}
                    className="text-xs font-bold text-[#0267B8] border-[#DCE2EB] hover:bg-[#F4F6FA] h-9 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Credit Facility</span>
                  </Button>
                </div>
              </div>

              {/* 4 Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Available Balance */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#0267B8]/30 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#4F5B70] font-semibold uppercase tracking-wider">
                      Available Balance
                    </span>
                    <div className="size-8 rounded-lg bg-[#E6F4EA] flex items-center justify-center text-[#137333] shrink-0">
                      <Wallet className="size-4.5" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-2xl font-extrabold text-[#012A5E]">
                      {WALLET_CREDIT_REPORT_SUMMARY.availableBalanceFormatted}
                    </div>
                    <div className="text-[11px] font-bold text-[#137333] flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      <span>Ready for instant booking</span>
                    </div>
                    <p className="text-[11px] text-[#6B778C] pt-0.5">
                      Unencumbered cash liquidity across all branches
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F4F6FA] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setTopUpOpen(true)}
                      className="text-xs font-bold text-[#0267B8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>+ Instant Top-up</span>
                    </button>
                    <span className="text-[11px] text-[#6B778C]">
                      Pre-funded
                    </span>
                  </div>
                </div>

                {/* Total Period Inflows (Credits) */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#0267B8]/30 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#4F5B70] font-semibold uppercase tracking-wider">
                      Period Deposits & Credits
                    </span>
                    <div className="size-8 rounded-lg bg-[#EBF2FA] flex items-center justify-center text-[#0267B8] shrink-0">
                      <TrendingUp className="size-4.5" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-2xl font-extrabold text-[#00875A]">
                      {WALLET_CREDIT_REPORT_SUMMARY.totalCreditsFormatted}
                    </div>
                    <div className="text-[11px] font-bold text-[#0267B8] flex items-center gap-1">
                      <ArrowUpRight className="size-3.5" />
                      <span>
                        {WALLET_CREDIT_REPORT_SUMMARY.creditsCount} Credit
                        Inflow Records
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B778C] pt-0.5">
                      Bank wire deposits, refunds & commissions
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F4F6FA] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4F5B70]">
                      4 Transactions
                    </span>
                    <span className="text-[11px] font-bold text-[#00875A]">
                      100% Verified
                    </span>
                  </div>
                </div>

                {/* Total Period Outflows (Debits) */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#0267B8]/30 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#4F5B70] font-semibold uppercase tracking-wider">
                      Period Booking Debits
                    </span>
                    <div className="size-8 rounded-lg bg-[#FEECEB] flex items-center justify-center text-[#DE350B] shrink-0">
                      <RotateCcw className="size-4.5" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-2xl font-extrabold text-[#DE350B]">
                      {WALLET_CREDIT_REPORT_SUMMARY.totalDebitsFormatted}
                    </div>
                    <div className="text-[11px] font-bold text-[#DE350B] flex items-center gap-1">
                      <ArrowDownLeft className="size-3.5" />
                      <span>
                        {WALLET_CREDIT_REPORT_SUMMARY.debitsCount} Ticket &
                        Booking Debits
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B778C] pt-0.5">
                      Flights, hotels & administrative adjustments
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F4F6FA] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4F5B70]">
                      6 Bookings Settled
                    </span>
                    <span className="text-[11px] font-bold text-[#4F5B70]">
                      Instant Deductions
                    </span>
                  </div>
                </div>

                {/* Net Cashflow (Wallet) */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#0267B8]/30 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#4F5B70] font-semibold uppercase tracking-wider">
                      Net Wallet Cashflow
                    </span>
                    <div className="size-8 rounded-lg bg-[#FEF7E0] flex items-center justify-center text-[#B06000] shrink-0">
                      <Coins className="size-4.5" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-2xl font-extrabold text-[#012A5E]">
                      {WALLET_CREDIT_REPORT_SUMMARY.netFlowFormatted}
                    </div>
                    <div className="text-[11px] font-bold text-[#00875A] flex items-center gap-1">
                      <Check className="size-3.5" />
                      <span>+335.3% Net Inflow Surplus</span>
                    </div>
                    <p className="text-[11px] text-[#6B778C] pt-0.5">
                      Healthy operating liquidity maintained in period
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F4F6FA] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4F5B70]">
                      Cashflow Status
                    </span>
                    <span className="text-[11px] font-bold text-[#00875A]">
                      Surplus
                    </span>
                  </div>
                </div>
              </div>

              {/* Credit Line Facility Utilization Section */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#EBF2FA] flex items-center justify-center text-[#0267B8] shrink-0">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#012A5E]">
                        Approved B2B Credit Facility Overview
                      </h3>
                      <p className="text-xs text-[#6B778C]">
                        Revolving booking credit line issued by AeroWing
                        Platform
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#E6F4EA] text-[#137333] border-[#C3E6CD] text-xs font-bold py-1 px-3">
                      {WALLET_CREDIT_REPORT_SUMMARY.settlementStatus}
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar of Credit Line */}
                <div className="space-y-2 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#4F5B70]">
                      Facility Utilization:{' '}
                      <strong className="text-[#012A5E]">
                        {WALLET_CREDIT_REPORT_SUMMARY.creditUtilizationPercent}%
                      </strong>
                    </span>
                    <span className="font-bold text-[#0267B8]">
                      Limit: {WALLET_CREDIT_REPORT_SUMMARY.creditLimitFormatted}
                    </span>
                  </div>

                  <div className="w-full bg-[#DCE2EB] h-3.5 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-[#0267B8] h-full rounded-l-full transition-all duration-500"
                      style={{
                        width: `${WALLET_CREDIT_REPORT_SUMMARY.creditUtilizationPercent}%`,
                      }}
                      title={`Used: ${WALLET_CREDIT_REPORT_SUMMARY.creditUsedFormatted} (${WALLET_CREDIT_REPORT_SUMMARY.creditUtilizationPercent}%)`}
                    />
                    <div
                      className="bg-[#00875A]/20 h-full rounded-r-full transition-all duration-500"
                      style={{
                        width: `${100 - WALLET_CREDIT_REPORT_SUMMARY.creditUtilizationPercent}%`,
                      }}
                      title={`Available Headroom: ${WALLET_CREDIT_REPORT_SUMMARY.creditAvailableFormatted}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#4F5B70] pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="size-2 rounded-full bg-[#0267B8]" />
                      Used Credit:{' '}
                      <strong className="text-[#012A5E]">
                        {WALLET_CREDIT_REPORT_SUMMARY.creditUsedFormatted}
                      </strong>{' '}
                      ({WALLET_CREDIT_REPORT_SUMMARY.creditUtilizationPercent}%)
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="size-2 rounded-full bg-[#00875A]" />
                      Available Borrowing Headroom:{' '}
                      <strong className="text-[#00875A]">
                        {WALLET_CREDIT_REPORT_SUMMARY.creditAvailableFormatted}
                      </strong>{' '}
                      (63.2%)
                    </span>
                  </div>
                </div>

                {/* 4 Detail Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-white border border-[#DCE2EB] rounded-xl">
                    <span className="text-[11px] text-[#6B778C] uppercase font-semibold">
                      Total Credit Limit
                    </span>
                    <div className="text-base font-extrabold text-[#012A5E] mt-0.5">
                      {WALLET_CREDIT_REPORT_SUMMARY.creditLimitFormatted}
                    </div>
                    <span className="text-[10px] text-[#6B778C]">
                      Approved facility
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-[#DCE2EB] rounded-xl">
                    <span className="text-[11px] text-[#6B778C] uppercase font-semibold">
                      Outstanding Drawn
                    </span>
                    <div className="text-base font-extrabold text-[#0267B8] mt-0.5">
                      {
                        WALLET_CREDIT_REPORT_SUMMARY.outstandingSettlementFormatted
                      }
                    </div>
                    <span className="text-[10px] text-[#4F5B70]">
                      Drawn for ticketing
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-[#DCE2EB] rounded-xl">
                    <span className="text-[11px] text-[#6B778C] uppercase font-semibold">
                      Available Headroom
                    </span>
                    <div className="text-base font-extrabold text-[#00875A] mt-0.5">
                      {WALLET_CREDIT_REPORT_SUMMARY.creditAvailableFormatted}
                    </div>
                    <span className="text-[10px] text-[#00875A] font-semibold">
                      Ready for issuance
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-[#DCE2EB] rounded-xl">
                    <span className="text-[11px] text-[#6B778C] uppercase font-semibold">
                      Settlement Due
                    </span>
                    <div className="text-base font-extrabold text-[#B06000] mt-0.5">
                      {WALLET_CREDIT_REPORT_SUMMARY.settlementDueDate}
                    </div>
                    <span className="text-[10px] text-[#B06000] font-semibold">
                      Net 15 days cycle
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE2EB]">
                  <p className="text-xs text-[#4F5B70]">
                    Need extra booking capacity for seasonal peak travel?
                    Request an authorized limit increment.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = '/statements'
                      }}
                      className="text-xs font-bold text-[#012A5E] border-[#DCE2EB] hover:bg-[#F4F6FA] cursor-pointer"
                    >
                      <FileText className="size-3.5 mr-1" />
                      View Statements
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        window.location.href = '/credit'
                      }}
                      className="bg-[#0267B8] hover:bg-[#025699] text-white text-xs font-bold px-3.5 rounded-xl cursor-pointer"
                    >
                      Request Limit Increase
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cashflow Allocation Channels (Dual Columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inflows Breakdown */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-[#EBF2FA] flex items-center justify-center text-[#0267B8]">
                        <ArrowUpRight className="size-4.5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#012A5E]">
                          Inflow Channels (Credits)
                        </h3>
                        <p className="text-xs text-[#6B778C]">
                          Total deposits and credits: $18,500.00
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#EBF2FA] text-[#0267B8] border-[#DCE2EB] font-bold text-xs">
                      +$18,500.00
                    </Badge>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#012A5E]">
                          Online Banking Gateway Deposits (City Bank)
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          Direct API verification · Instant settlement
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#00875A]">
                          +$10,000.00
                        </div>
                        <span className="text-[11px] font-semibold text-[#4F5B70]">
                          54.1%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#012A5E]">
                          Direct Bank Wire Deposits (Standard Chartered)
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          Verified deposit slip #SCB-88301
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#00875A]">
                          +$5,000.00
                        </div>
                        <span className="text-[11px] font-semibold text-[#4F5B70]">
                          27.0%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#012A5E]">
                          Airline GDS Ticket Cancellation Refunds
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          Reconciled from TG-322 ticket refund
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#00875A]">
                          +$2,445.00
                        </div>
                        <span className="text-[11px] font-semibold text-[#4F5B70]">
                          13.2%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#012A5E]">
                          Bi-weekly Commission Auto-Settlements
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          Agency commission payout cycle
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#00875A]">
                          +$1,055.00
                        </div>
                        <span className="text-[11px] font-semibold text-[#4F5B70]">
                          5.7%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outflows Breakdown */}
                <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-[#FEECEB] flex items-center justify-center text-[#DE350B]">
                        <ArrowDownLeft className="size-4.5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#012A5E]">
                          Outflow Allocation (Debits)
                        </h3>
                        <p className="text-xs text-[#6B778C]">
                          Total ticket issuance & debits: $4,250.00
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#FEECEB] text-[#DE350B] border-[#DCE2EB] font-bold text-xs">
                      -$4,250.00
                    </Badge>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#012A5E]">
                          Flight Ticket Issuance (Emirates & Biman)
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          AW-BK-9802 & AW-BK-9808 ticket issuance
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#DE350B]">
                          -$2,100.00
                        </div>
                        <span className="text-[11px] font-semibold text-[#4F5B70]">
                          49.4%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#012A5E]">
                          Hotel Accommodations (Grand Hyatt & Radisson)
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          AW-BK-9803 & AW-BK-9806 reservations
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#DE350B]">
                          -$2,150.00
                        </div>
                        <span className="text-[11px] font-semibold text-[#4F5B70]">
                          50.6%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#012A5E]">
                          Administrative Service Fee Correction
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          Periodic billing reconciliation by Finance
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#DE350B]">
                          -$150.00
                        </div>
                        <span className="text-[11px] font-semibold text-[#4F5B70]">
                          3.5%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#EBF2FA]/50 border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#0267B8]">
                          Operational Cashflow Margin
                        </div>
                        <div className="text-[11px] text-[#6B778C]">
                          Inflows exceed outflows by +$14,250.00
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00875A]">
                          +335.3%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Period Wallet Ledger Transactions Table */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#012A5E]">
                      Period Wallet Transactions Ledger
                    </h3>
                    <p className="text-xs text-[#6B778C]">
                      Itemized ledger of all credits, top-ups, and booking
                      debits in the selected date range.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExportDialogOpen(true)}
                      className="text-xs font-bold text-[#0267B8] border-[#DCE2EB] hover:bg-[#F4F6FA] cursor-pointer"
                    >
                      <Download className="size-3.5 mr-1" />
                      Export Ledger CSV
                    </Button>
                  </div>
                </div>

                {/* Table Filters */}
                <div className="bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3">
                  {/* Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B778C]" />
                    <Input
                      type="text"
                      placeholder="Search by ID, reference, description..."
                      value={walletSearch}
                      onChange={(e) => setWalletSearch(e.target.value)}
                      className="pl-9 h-9 text-xs bg-white border-[#DCE2EB] text-[#012A5E] rounded-lg"
                    />
                  </div>

                  {/* Direction Tabs */}
                  <div className="flex items-center gap-1.5 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setWalletDirection('All')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        walletDirection === 'All'
                          ? 'bg-[#012A5E] text-white shadow-xs'
                          : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:text-[#012A5E]',
                      )}
                    >
                      All (10)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWalletDirection('Credit')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        walletDirection === 'Credit'
                          ? 'bg-[#00875A] text-white shadow-xs'
                          : 'bg-white border border-[#DCE2EB] text-[#00875A] hover:bg-[#E6F4EA]',
                      )}
                    >
                      Credits (+4)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWalletDirection('Debit')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        walletDirection === 'Debit'
                          ? 'bg-[#DE350B] text-white shadow-xs'
                          : 'bg-white border border-[#DCE2EB] text-[#DE350B] hover:bg-[#FEECEB]',
                      )}
                    >
                      Debits (-6)
                    </button>
                  </div>

                  {/* Type Filter Select */}
                  <div className="w-full md:w-48">
                    <Select value={walletType} onValueChange={setWalletType}>
                      <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-[#012A5E] font-medium h-9 text-xs rounded-lg">
                        <SelectValue placeholder="All Transaction Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#DCE2EB]">
                        <SelectItem value="All">
                          All Transaction Types
                        </SelectItem>
                        <SelectItem value="Top-up">Top-up Deposits</SelectItem>
                        <SelectItem value="Booking Debit">
                          Booking Debits
                        </SelectItem>
                        <SelectItem value="Commission Credit">
                          Commission Credits
                        </SelectItem>
                        <SelectItem value="Refund">Ticket Refunds</SelectItem>
                        <SelectItem value="Manual Adjustment">
                          Manual Adjustments
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#DCE2EB] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F8F9FB]">
                      <TableRow>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Transaction ID
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Date & Time
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Type
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Description & Reference
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Channel / Source
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Direction
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Amount
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Balance After
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWalletTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-8 text-xs text-[#6B778C]"
                          >
                            No matching wallet transactions found for the
                            applied filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredWalletTransactions.map((tx) => (
                          <TableRow
                            key={tx.id}
                            className="hover:bg-[#F4F6FA]/50 transition-colors"
                          >
                            <TableCell className="font-mono font-bold text-xs text-[#0267B8]">
                              {tx.id}
                            </TableCell>
                            <TableCell className="text-xs text-[#4F5B70] whitespace-nowrap">
                              {tx.dateTime}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={cn(
                                  'text-[10px] font-bold border',
                                  tx.type === 'Top-up'
                                    ? 'bg-[#EBF2FA] text-[#0267B8] border-[#CFE4FA]'
                                    : tx.type === 'Commission Credit'
                                      ? 'bg-[#FEF7E0] text-[#B06000] border-[#FCE2A6]'
                                      : tx.type === 'Refund'
                                        ? 'bg-[#E6F4EA] text-[#137333] border-[#C3E6CD]'
                                        : tx.type === 'Manual Adjustment'
                                          ? 'bg-[#F4F6FA] text-[#4F5B70] border-[#DCE2EB]'
                                          : 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
                                )}
                              >
                                {tx.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              <div className="font-semibold text-[#012A5E]">
                                {tx.description}
                              </div>
                              <div className="text-[11px] text-[#6B778C]">
                                Ref:{' '}
                                <span className="font-mono font-medium text-[#4F5B70]">
                                  {tx.reference}
                                </span>
                                {tx.subDescription
                                  ? ` · ${tx.subDescription}`
                                  : ''}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-[#4F5B70]">
                              {tx.source}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={cn(
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold',
                                  tx.direction === 'Credit'
                                    ? 'bg-[#E6F4EA] text-[#00875A]'
                                    : 'bg-[#FEECEB] text-[#DE350B]',
                                )}
                              >
                                {tx.direction === 'Credit'
                                  ? '+ Credit'
                                  : '- Debit'}
                              </span>
                            </TableCell>
                            <TableCell
                              className={cn(
                                'text-right font-bold text-xs whitespace-nowrap',
                                tx.direction === 'Credit'
                                  ? 'text-[#00875A]'
                                  : 'text-[#DE350B]',
                              )}
                            >
                              {tx.amountFormatted}
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-xs text-[#012A5E]">
                              {tx.runningBalanceFormatted}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedWalletTx(tx)
                                  setWalletDetailsOpen(true)
                                }}
                                className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:bg-[#EBF2FA] h-7 px-2.5 rounded-lg cursor-pointer"
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Credit Facility Requests in Period Table */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#012A5E]">
                      Credit Facility Requests & Admin Review Log
                    </h3>
                    <p className="text-xs text-[#6B778C]">
                      History of credit limit augmentations and emergency top-up
                      requests in this period.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = '/credit'
                    }}
                    className="text-xs font-bold text-[#0267B8] border-[#DCE2EB] hover:bg-[#F4F6FA] cursor-pointer"
                  >
                    <ExternalLink className="size-3.5 mr-1" />
                    New Credit Request
                  </Button>
                </div>

                <div className="rounded-xl border border-[#DCE2EB] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F8F9FB]">
                      <TableRow>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Request ID
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Submitted Date
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Request Type
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Requested Amount
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Approved Amount
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Status
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Admin Decision Note
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CREDIT_FACILITY_REQUESTS.map((req) => (
                        <TableRow
                          key={req.id}
                          className="hover:bg-[#F4F6FA]/50 transition-colors"
                        >
                          <TableCell className="font-mono font-bold text-xs text-[#0267B8]">
                            {req.id}
                          </TableCell>
                          <TableCell className="text-xs text-[#4F5B70] whitespace-nowrap">
                            {req.date} · {req.time}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-[#012A5E]">
                            <div>{req.requestType}</div>
                            <div className="text-[11px] text-[#6B778C] font-normal">
                              {req.typeDescription}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-xs text-[#012A5E]">
                            {req.requestedAmountFormatted}
                          </TableCell>
                          <TableCell className="text-right font-bold text-xs text-[#00875A]">
                            {req.approvedAmountFormatted || '—'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={cn(
                                'text-[11px] font-bold border',
                                req.status === 'Approved'
                                  ? 'bg-[#E6F4EA] text-[#00875A] border-[#C3E6CD]'
                                  : req.status === 'Pending'
                                    ? 'bg-[#FEF7E0] text-[#B06000] border-[#FCE2A6]'
                                    : 'bg-[#FEECEB] text-[#DE350B] border-[#F8D7DA]',
                              )}
                            >
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-[#4F5B70] max-w-xs truncate">
                            {req.decisionNote}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCreditRequest(req)
                                setCreditDetailsOpen(true)
                              }}
                              className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:bg-[#EBF2FA] h-7 px-2.5 rounded-lg cursor-pointer"
                            >
                              View Request
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: SUB-AGENT PERFORMANCE (NODE 821:1924)               */}
          {/* ======================================================== */}
          {activeTab === 'sub-agents' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#012A5E]">
                    Sub-agent Booking & Sales Contribution
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = '/sub-agents'
                    }}
                    className="text-xs font-bold text-[#0267B8] border-[#DCE2EB] cursor-pointer"
                  >
                    Manage Sub-agents
                  </Button>
                </div>

                <div className="rounded-xl border border-[#DCE2EB] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F8F9FB]">
                      <TableRow>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Sub-agent Branch
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs">
                          Location
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Bookings
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Gross Sales
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-right">
                          Commission
                        </TableHead>
                        <TableHead className="font-bold text-[#012A5E] text-xs text-center">
                          Contribution
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SUBAGENT_PERFORMANCE_DATA.map((sub, idx) => (
                        <TableRow key={idx} className="hover:bg-[#F4F6FA]/50">
                          <TableCell className="font-bold text-[#012A5E] text-xs">
                            {sub.agentName}
                          </TableCell>
                          <TableCell className="text-xs text-[#4F5B70]">
                            {sub.location}
                          </TableCell>
                          <TableCell className="text-center font-bold text-xs text-[#012A5E]">
                            {sub.bookingsCount}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs text-[#012A5E]">
                            {sub.grossSales}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs text-[#00875A]">
                            {sub.commissionEarned}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF2FA] text-[#0267B8]">
                              {sub.sharePercent}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Page Bottom Footer (#821:1873) */}
          <footer className="pt-6 pb-2 border-t border-[#DCE2EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6B778C]">
            <span>AeroWing Agent Portal · M2.12 Agent Reports · Website</span>
            <span>
              Design prototype — no analytics, accounting, supplier or export
              service is called.
            </span>
          </footer>
        </main>
      </div>

      {/* Export CSV Dialog */}
      <AgentReportsExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        currentTab={activeTab}
        transactions={initialSalesTransactions}
        services={initialServiceBreakdown}
        period={`${fromDate} to ${toDate}`}
      />

      {/* Booking Details Preview Drawer */}
      <BookingPreviewSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        booking={selectedBooking}
      />

      {/* Commission Details Sheet (Reusable #745:6678 / #821:1922) */}
      <CommissionDetailsSheet
        open={commissionDetailsOpen}
        onOpenChange={setCommissionDetailsOpen}
        record={selectedCommissionRecord}
      />

      {/* Top Up Wallet Dialog (Reusable #725:27231) */}
      <TopUpWalletDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        agencyName="Skyline Demo Travels Ltd"
      />

      {/* Wallet Ledger Transaction Details Sheet (Reusable #728:29736) */}
      <WalletLedgerTransactionDetailsSheet
        open={walletDetailsOpen}
        onOpenChange={setWalletDetailsOpen}
        transaction={selectedWalletTx}
      />

      {/* Credit Request Details Dialog */}
      <Dialog open={creditDetailsOpen} onOpenChange={setCreditDetailsOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-[#DCE2EB] rounded-2xl p-6 shadow-xl">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-[#EBF2FA] flex items-center justify-center text-[#0267B8]">
                <CreditCard className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-[#012A5E]">
                  Credit Facility Request Details
                </DialogTitle>
                <DialogDescription className="text-xs text-[#6B778C]">
                  {selectedCreditRequest?.id} · {selectedCreditRequest?.date} at{' '}
                  {selectedCreditRequest?.time}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedCreditRequest && (
            <div className="space-y-4 py-2">
              <div className="p-3.5 bg-[#F8F9FB] border border-[#DCE2EB] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6B778C] uppercase font-semibold">
                    Request Type
                  </span>
                  <div className="text-sm font-bold text-[#012A5E] mt-0.5">
                    {selectedCreditRequest.requestType}
                  </div>
                  <div className="text-xs text-[#4F5B70]">
                    {selectedCreditRequest.typeDescription}
                  </div>
                </div>
                <Badge
                  className={cn(
                    'text-xs font-bold border',
                    selectedCreditRequest.status === 'Approved'
                      ? 'bg-[#E6F4EA] text-[#00875A] border-[#C3E6CD]'
                      : selectedCreditRequest.status === 'Pending'
                        ? 'bg-[#FEF7E0] text-[#B06000] border-[#FCE2A6]'
                        : 'bg-[#FEECEB] text-[#DE350B] border-[#F8D7DA]',
                  )}
                >
                  {selectedCreditRequest.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#DCE2EB] rounded-lg">
                  <span className="text-[11px] text-[#6B778C]">
                    Requested Amount
                  </span>
                  <div className="text-base font-extrabold text-[#012A5E] mt-0.5">
                    {selectedCreditRequest.requestedAmountFormatted}
                  </div>
                </div>
                <div className="p-3 bg-white border border-[#DCE2EB] rounded-lg">
                  <span className="text-[11px] text-[#6B778C]">
                    Approved Facility
                  </span>
                  <div className="text-base font-extrabold text-[#00875A] mt-0.5">
                    {selectedCreditRequest.approvedAmountFormatted || '—'}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#012A5E]">
                  Agency Request Reason
                </span>
                <p className="text-xs text-[#4F5B70] bg-[#F8F9FB] p-3 rounded-lg border border-[#DCE2EB]">
                  {selectedCreditRequest.reason}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#012A5E]">
                  AeroWing Admin Assessment
                </span>
                <p className="text-xs text-[#4F5B70] bg-[#F8F9FB] p-3 rounded-lg border border-[#DCE2EB]">
                  {selectedCreditRequest.decisionNote}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-[#DCE2EB]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreditDetailsOpen(false)}
              className="w-full text-xs font-bold text-[#012A5E] border-[#DCE2EB]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

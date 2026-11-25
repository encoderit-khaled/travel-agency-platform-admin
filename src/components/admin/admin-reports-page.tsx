import * as React from 'react'
import {
  CalendarDays,
  Download,
  Filter,
  Info,
  Plane,
  Building2,
  Hotel,
  Package,
  Compass,
  Car,
  Smartphone,
  Train,
  Shield,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  CreditCard,
  Percent,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Globe,
  DollarSign,
  Ticket,
  Coins,
  ChevronDown,
} from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminFooter } from './admin-footer'
import { SidebarProvider } from '#/components/ui/sidebar'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
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
import { BookingDetailsDialog } from './booking-details-dialog'
import { ExportReportDialog } from './export-report-dialog'
import {
  INITIAL_BOOKING_RECORDS,
  BOOKINGS_BY_SERVICE_ITEMS,
  BOOKINGS_BY_STATUS_ITEMS,
  BOOKINGS_BY_CHANNEL_ITEMS,
  BOOKINGS_BY_SUPPLIER_ITEMS,
  INITIAL_BOOKINGS_KPIS,
} from './admin-reports-bookings-data'
import {
  REPORT_TABS,
  SERVICES_FILTER_OPTIONS,
  SUPPLIERS_FILTER_OPTIONS,
  CHANNELS_FILTER_OPTIONS,
  INITIAL_SALES_REPORT_ROWS,
  INITIAL_SERVICE_BREAKDOWNS,
} from './admin-reports-sales-data'
import { INITIAL_PAYMENT_REPORTS } from './admin-reports-data'
import type {
  BookingRecordItem,
  BookingStatus,
} from './admin-reports-bookings-types'
import type { ReportTab } from './admin-reports-sales-types'
import { cn } from '#/lib/utils'

export interface AdminReportsPageProps {
  initialTab?: ReportTab
  initialNodeId?: string
  initialFrom?: string
  initialTo?: string
  initialService?: string
  initialSupplier?: string
  initialChannel?: string
  className?: string
}

function getServiceIcon(service: string) {
  switch (service) {
    case 'Flights':
      return <Plane className="size-4 text-[#0267B8]" />
    case 'Hotels':
      return <Hotel className="size-4 text-[#3B82F6]" />
    case 'Travel Packages':
      return <Package className="size-4 text-[#6366F1]" />
    case 'Activities':
      return <Compass className="size-4 text-[#F59E0B]" />
    case 'Car Rental':
      return <Car className="size-4 text-[#EC4899]" />
    case 'eSIM':
      return <Smartphone className="size-4 text-[#10B981]" />
    case 'Bus / Train':
      return <Train className="size-4 text-[#8B5CF6]" />
    case 'Travel Insurance':
      return <Shield className="size-4 text-[#14B8A6]" />
    default:
      return <Package className="size-4 text-[#0267B8]" />
  }
}

function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case 'Confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
          <CheckCircle2 className="size-3" />
          Confirmed
        </span>
      )
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EBF2FA] text-[#012A5E] border border-[#D3E3F5]">
          <CheckCircle2 className="size-3 text-[#0267B8]" />
          Completed
        </span>
      )
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]">
          <Clock className="size-3 text-[#B06000]" />
          Pending
        </span>
      )
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]">
          <XCircle className="size-3 text-[#C5221F]" />
          Cancelled
        </span>
      )
  }
}

export function AdminReportsPage({
  initialTab = 'bookings',
  initialNodeId = '1005-5341',
  initialFrom = '01/09/2026',
  initialTo = '30/09/2026',
  initialService = 'All Services',
  initialSupplier = 'All Suppliers',
  initialChannel = 'All Channels',
  className,
}: AdminReportsPageProps) {
  const [activeTab, setActiveTab] = React.useState<ReportTab>(initialTab)

  // Filter Form States
  const [dateFrom, setDateFrom] = React.useState<string>(initialFrom)
  const [dateTo, setDateTo] = React.useState<string>(initialTo)
  const [selectedService, setSelectedService] =
    React.useState<string>(initialService)
  const [selectedSupplier, setSelectedSupplier] =
    React.useState<string>(initialSupplier)
  const [selectedChannel, setSelectedChannel] =
    React.useState<string>(initialChannel)

  // Applied Filters State
  const [appliedFilters, setAppliedFilters] = React.useState({
    service: initialService,
    supplier: initialSupplier,
    channel: initialChannel,
    from: initialFrom,
    to: initialTo,
  })

  // Table In-Card Search and Filter
  const [tableSearch, setTableSearch] = React.useState('')
  const [tableStatusFilter, setTableStatusFilter] = React.useState('all')

  // Modals
  const [selectedBooking, setSelectedBooking] =
    React.useState<BookingRecordItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isExportOpen, setIsExportOpen] = React.useState(false)

  // Apply filters button handler
  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setAppliedFilters({
      service: selectedService,
      supplier: selectedSupplier,
      channel: selectedChannel,
      from: dateFrom,
      to: dateTo,
    })
  }

  // Reset filters
  const handleResetFilters = () => {
    setDateFrom('01/09/2026')
    setDateTo('30/09/2026')
    setSelectedService('All Services')
    setSelectedSupplier('All Suppliers')
    setSelectedChannel('All Channels')
    setTableSearch('')
    setTableStatusFilter('all')
    setAppliedFilters({
      service: 'All Services',
      supplier: 'All Suppliers',
      channel: 'All Channels',
      from: '01/09/2026',
      to: '30/09/2026',
    })
  }

  // Filtered Bookings dataset
  const filteredBookings = React.useMemo(() => {
    return INITIAL_BOOKING_RECORDS.filter((item) => {
      // Global toolbar filters
      if (
        appliedFilters.service !== 'All Services' &&
        item.service !== appliedFilters.service
      ) {
        return false
      }
      if (
        appliedFilters.supplier !== 'All Suppliers' &&
        item.supplier !== appliedFilters.supplier
      ) {
        return false
      }
      if (
        appliedFilters.channel !== 'All Channels' &&
        item.channel !== appliedFilters.channel
      ) {
        return false
      }

      // Card-level search
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim()
        const matchRef = item.bookingRef.toLowerCase().includes(q)
        const matchCust = item.customerName.toLowerCase().includes(q)
        const matchService = item.service.toLowerCase().includes(q)
        const matchSupplier = item.supplier.toLowerCase().includes(q)
        const matchPnr = item.pnr.toLowerCase().includes(q)
        if (
          !matchRef &&
          !matchCust &&
          !matchService &&
          !matchSupplier &&
          !matchPnr
        ) {
          return false
        }
      }

      // Card-level status filter
      if (tableStatusFilter !== 'all' && item.status !== tableStatusFilter) {
        return false
      }

      return true
    })
  }, [appliedFilters, tableSearch, tableStatusFilter])

  // Computed KPIs based on filtered bookings
  const computedTotalGross = React.useMemo(() => {
    return filteredBookings.reduce((acc, curr) => acc + curr.amount, 0)
  }, [filteredBookings])

  const confirmedCount = React.useMemo(() => {
    return filteredBookings.filter((b) => b.status === 'Confirmed').length
  }, [filteredBookings])

  const completedCount = React.useMemo(() => {
    return filteredBookings.filter((b) => b.status === 'Completed').length
  }, [filteredBookings])

  const pendingCount = React.useMemo(() => {
    return filteredBookings.filter((b) => b.status === 'Pending').length
  }, [filteredBookings])

  const cancelledCount = React.useMemo(() => {
    return filteredBookings.filter((b) => b.status === 'Cancelled').length
  }, [filteredBookings])

  return (
    <SidebarProvider defaultOpen>
      <div
        className={cn(
          'flex min-h-screen w-full bg-[#F4F6FA] text-[#141B28] antialiased',
          className,
        )}
      >
        {/* Admin Navigation Sidebar */}
        <AdminSidebar currentTab="Reports" />

        {/* Main Column */}
        <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
          {/* Top Admin Header */}
          <AdminHeader
            breadcrumbs={[
              { label: 'Admin Panel', href: '/admin' },
              { label: 'Reports', href: '/admin-reports?tab=sales' },
              {
                label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
              },
            ]}
            userName="Super Admin"
            userRole="Operations & Finance"
            userInitials="SA"
          />

          {/* Page Main Content Area */}
          <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-[1720px] w-full mx-auto space-y-6">
            {/* Header (Figma div.ph2) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1.5 border-b border-[#E2E8F0]/60">
              <div className="space-y-1">
                <span className="text-[12px] font-extrabold tracking-[0.08em] uppercase text-[#0267B8]">
                  Platform Modules
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#012A5E]">
                  Reports
                </h1>
                <p className="text-sm font-normal text-[#4F5B70]">
                  Review platform sales, bookings, payments and commissions.
                </p>
              </div>

              {/* Action Button: Export CSV */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="h-10 px-4.5 bg-[#012A5E] hover:bg-[#001D42] text-white text-xs font-bold rounded-xl shadow-xs gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <Download className="size-4" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            {/* Navigation Tabs (Figma div.rtw) */}
            <div className="border-b border-[#DCE2EB] overflow-x-auto">
              <div className="flex items-center gap-1 min-w-max">
                {REPORT_TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all relative cursor-pointer rounded-t-lg',
                        isActive
                          ? 'text-[#012A5E] bg-white border-t border-x border-[#DCE2EB]'
                          : 'text-[#6B778C] hover:text-[#012A5E] hover:bg-white/50',
                      )}
                    >
                      {tab.id === 'sales' && <TrendingUp className="size-4" />}
                      {tab.id === 'bookings' && (
                        <CalendarDays className="size-4 text-[#0267B8]" />
                      )}
                      {tab.id === 'payments' && (
                        <CreditCard className="size-4" />
                      )}
                      {tab.id === 'commissions' && (
                        <Percent className="size-4" />
                      )}
                      <span>{tab.label}</span>
                      {isActive && (
                        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#012A5E]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter Toolbar (Figma Report filters) */}
            <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs p-4 sm:p-5 space-y-4">
              <form
                onSubmit={handleApplyFilters}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end"
              >
                {/* From Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="f-from"
                    className="text-xs font-extrabold text-[#012A5E]"
                  >
                    From
                  </label>
                  <Input
                    id="f-from"
                    type="text"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="01/09/2026"
                    className="h-10 bg-white border-[#DCE2EB] rounded-xl text-xs text-[#141B28] font-medium"
                  />
                </div>

                {/* To Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="f-to"
                    className="text-xs font-extrabold text-[#012A5E]"
                  >
                    To
                  </label>
                  <Input
                    id="f-to"
                    type="text"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="30/09/2026"
                    className="h-10 bg-white border-[#DCE2EB] rounded-xl text-xs text-[#141B28] font-medium"
                  />
                </div>

                {/* Service Filter */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="f-svc"
                    className="text-xs font-extrabold text-[#012A5E]"
                  >
                    Service
                  </label>
                  <Select
                    value={selectedService}
                    onValueChange={(val) =>
                      setSelectedService(val || 'All Services')
                    }
                  >
                    <SelectTrigger
                      id="f-svc"
                      className="h-10 bg-white border-[#DCE2EB] rounded-xl text-xs font-semibold text-[#141B28] px-3 focus-visible:border-[#0267B8]"
                    >
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-md">
                      {SERVICES_FILTER_OPTIONS.map((svc) => (
                        <SelectItem
                          key={svc}
                          value={svc}
                          className="text-xs font-medium"
                        >
                          {svc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Supplier Filter */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="f-sup"
                    className="text-xs font-extrabold text-[#012A5E]"
                  >
                    Supplier
                  </label>
                  <Select
                    value={selectedSupplier}
                    onValueChange={(val) =>
                      setSelectedSupplier(val || 'All Suppliers')
                    }
                  >
                    <SelectTrigger
                      id="f-sup"
                      className="h-10 bg-white border-[#DCE2EB] rounded-xl text-xs font-semibold text-[#141B28] px-3 focus-visible:border-[#0267B8]"
                    >
                      <SelectValue placeholder="All Suppliers" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-md">
                      {SUPPLIERS_FILTER_OPTIONS.map((sup) => (
                        <SelectItem
                          key={sup}
                          value={sup}
                          className="text-xs font-medium"
                        >
                          {sup}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Channel Filter */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="f-ch"
                    className="text-xs font-extrabold text-[#012A5E]"
                  >
                    Channel
                  </label>
                  <Select
                    value={selectedChannel}
                    onValueChange={(val) =>
                      setSelectedChannel(val || 'All Channels')
                    }
                  >
                    <SelectTrigger
                      id="f-ch"
                      className="h-10 bg-white border-[#DCE2EB] rounded-xl text-xs font-semibold text-[#141B28] px-3 focus-visible:border-[#0267B8]"
                    >
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-md">
                      {CHANNELS_FILTER_OPTIONS.map((ch) => (
                        <SelectItem
                          key={ch}
                          value={ch}
                          className="text-xs font-medium"
                        >
                          {ch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Buttons: Apply & Reset */}
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    className="h-10 flex-1 bg-[#012A5E] hover:bg-[#001D42] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs gap-1.5"
                  >
                    <Filter className="size-3.5" />
                    <span>Apply Filters</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetFilters}
                    title="Reset Filters"
                    className="h-10 px-3 border-[#DCE2EB] text-[#64748B] hover:text-[#012A5E] hover:bg-[#F4F6FA] rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                  </Button>
                </div>
              </form>

              {/* Filter Active Summary Pill */}
              <div className="pt-3 border-t border-[#F0F3F7] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#012A5E]">
                    Report period:
                  </span>
                  <span>
                    {appliedFilters.from} – {appliedFilters.to}
                  </span>
                  <span>·</span>
                  <span className="bg-[#EBF2FA] text-[#012A5E] px-2 py-0.5 rounded font-medium text-[11px]">
                    {appliedFilters.service}
                  </span>
                  <span>·</span>
                  <span className="bg-[#EBF2FA] text-[#012A5E] px-2 py-0.5 rounded font-medium text-[11px]">
                    {appliedFilters.supplier}
                  </span>
                  <span>·</span>
                  <span className="bg-[#EBF2FA] text-[#012A5E] px-2 py-0.5 rounded font-medium text-[11px]">
                    {appliedFilters.channel}
                  </span>
                </div>
                <span className="text-[11px] text-[#8C9BAE]">
                  Showing {filteredBookings.length} matching bookings
                </span>
              </div>
            </section>

            {/* TAB CONTENT: BOOKINGS (FIGMA NODE 1005:5341 / 1005:5344) */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Row 1: KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* KPI 1: Total Bookings */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between">
                      <div className="size-10 rounded-xl bg-[#EBF2FA] text-[#0267B8] flex items-center justify-center">
                        <CalendarDays className="size-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB]">
                        <Info className="size-3 text-[#0267B8]" />
                        Sample data
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                        Booking Count
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#012A5E] tracking-tight mt-1">
                        {filteredBookings.length}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1">
                        Total customer reservations in period
                      </p>
                    </div>
                  </div>

                  {/* KPI 2: Gross Value */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between">
                      <div className="size-10 rounded-xl bg-[#E6F4EA] text-[#137333] flex items-center justify-center">
                        <DollarSign className="size-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB]">
                        <Info className="size-3 text-[#0267B8]" />
                        Sample amount
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                        Gross Bookings Value
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#012A5E] tracking-tight mt-1">
                        $
                        {computedTotalGross.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1">
                        Platform reservation volume
                      </p>
                    </div>
                  </div>

                  {/* KPI 3: Confirmed & Completed */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between">
                      <div className="size-10 rounded-xl bg-[#EBF2FA] text-[#012A5E] flex items-center justify-center">
                        <CheckCircle2 className="size-5 text-[#0267B8]" />
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                        {filteredBookings.length > 0
                          ? Math.round(
                              ((confirmedCount + completedCount) /
                                filteredBookings.length) *
                                100,
                            )
                          : 0}
                        % Success
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                        Confirmed / Completed
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#012A5E] tracking-tight mt-1">
                        {confirmedCount + completedCount}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1">
                        {confirmedCount} confirmed · {completedCount} completed
                      </p>
                    </div>
                  </div>

                  {/* KPI 4: Pending / Issues */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs flex flex-col justify-between gap-3">
                    <div className="size-10 rounded-xl bg-[#FFF6E3] text-[#B54708] flex items-center justify-center">
                      <Clock className="size-5" />
                    </div>
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">
                      {pendingCount} Pending
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      Pending / Cancelled
                    </p>
                    <h3 className="text-3xl font-extrabold text-[#012A5E] tracking-tight mt-1">
                      {pendingCount + cancelledCount}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      {pendingCount} pending · {cancelledCount} cancelled
                    </p>
                  </div>
                </div>

                {/* Row 2: Breakdown Cards (2 columns on large screen) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card 1: Bookings by Service */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-[#DEE8F5] flex items-center justify-center shrink-0 text-[#0267B8]">
                            <Plane className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#012A5E]">
                              Bookings by Service
                            </h3>
                            <p className="text-xs text-[#6B778C]">
                              Distribution across the 8 travel modules
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                          <Info className="size-3 text-[#0267B8]" />
                          Sample data
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {BOOKINGS_BY_SERVICE_ITEMS.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2 w-36 shrink-0 font-bold text-[#012A5E]">
                              {getServiceIcon(item.label)}
                              <span>{item.label}</span>
                            </div>
                            <div className="flex-1 bg-[#DEE8F5]/50 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0267B8] h-full rounded-full transition-all duration-500"
                                style={{ width: `${item.percentage * 3.5}%` }}
                              />
                            </div>
                            <div className="w-24 text-right shrink-0 font-extrabold text-[#012A5E]">
                              {item.count} · {item.percentage}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-[#EEF1F5] pt-3.5 mt-5 flex items-center justify-between text-xs font-extrabold text-[#012A5E]">
                      <span>Total Service Bookings</span>
                      <span>16</span>
                    </div>
                  </div>

                  {/* Card 2: Bookings by Status */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-[#DEE8F5] flex items-center justify-center shrink-0 text-[#0267B8]">
                            <CheckCircle2 className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#012A5E]">
                              Bookings by Status
                            </h3>
                            <p className="text-xs text-[#6B778C]">
                              Reservation lifecycle progression
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                          <Info className="size-3 text-[#0267B8]" />
                          Sample data
                        </span>
                      </div>

                      <div className="space-y-4">
                        {BOOKINGS_BY_STATUS_ITEMS.map((st) => (
                          <div
                            key={st.id}
                            className="flex items-center gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2 w-32 shrink-0 font-bold text-[#012A5E]">
                              {st.label === 'Confirmed' && (
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                              )}
                              {st.label === 'Completed' && (
                                <CheckCircle2 className="size-3.5 text-[#0267B8]" />
                              )}
                              {st.label === 'Pending' && (
                                <Clock className="size-3.5 text-amber-600" />
                              )}
                              {st.label === 'Cancelled' && (
                                <XCircle className="size-3.5 text-rose-600" />
                              )}
                              <span>{st.label}</span>
                            </div>
                            <div className="flex-1 bg-[#DEE8F5]/50 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${(st.count / 6) * 100}%`,
                                  backgroundColor: st.color,
                                }}
                              />
                            </div>
                            <div className="w-20 text-right shrink-0 font-extrabold text-[#012A5E]">
                              {st.count} bookings
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-[#EEF1F5] pt-3.5 mt-5 flex items-center justify-between text-xs font-extrabold text-[#012A5E]">
                      <span>Total Tracked Statuses</span>
                      <span>16</span>
                    </div>
                  </div>

                  {/* Card 3: Bookings by Channel */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-[#EBF2FA] flex items-center justify-center shrink-0 text-[#0267B8]">
                            <Globe className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#012A5E]">
                              Bookings by Sales Channel
                            </h3>
                            <p className="text-xs text-[#6B778C]">
                              Origination of incoming customer reservations
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                          <Info className="size-3 text-[#0267B8]" />
                          Sample data
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {BOOKINGS_BY_CHANNEL_ITEMS.map((ch) => (
                          <div
                            key={ch.id}
                            className="flex items-center gap-3 text-xs"
                          >
                            <div className="w-36 shrink-0 font-bold text-[#012A5E]">
                              {ch.label}
                            </div>
                            <div className="flex-1 bg-[#DEE8F5]/50 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0267B8] h-full rounded-full transition-all duration-500"
                                style={{ width: `${ch.percentage * 2.2}%` }}
                              />
                            </div>
                            <div className="w-28 text-right shrink-0 font-extrabold text-[#012A5E]">
                              {ch.count} ({ch.percentage}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-[#EEF1F5] pt-3.5 mt-5 flex items-center justify-between text-xs font-extrabold text-[#012A5E]">
                      <span>Total Channel Volume</span>
                      <span>16</span>
                    </div>
                  </div>

                  {/* Card 4: Bookings by Supplier */}
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-[#EBF2FA] flex items-center justify-center shrink-0 text-[#0267B8]">
                            <Building2 className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#012A5E]">
                              Bookings by Supplier
                            </h3>
                            <p className="text-xs text-[#6B778C]">
                              Inventory fulfillment sources
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                          <Info className="size-3 text-[#0267B8]" />
                          Sample data
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {BOOKINGS_BY_SUPPLIER_ITEMS.map((sup) => (
                          <div
                            key={sup.id}
                            className="flex items-center gap-3 text-xs"
                          >
                            <div className="w-40 shrink-0 font-bold text-[#012A5E] truncate">
                              {sup.label}
                            </div>
                            <div className="flex-1 bg-[#DEE8F5]/50 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0267B8] h-full rounded-full transition-all duration-500"
                                style={{ width: `${sup.percentage * 3.8}%` }}
                              />
                            </div>
                            <div className="w-24 text-right shrink-0 font-extrabold text-[#012A5E]">
                              {sup.count} ({sup.percentage}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-[#EEF1F5] pt-3.5 mt-5 flex items-center justify-between text-xs font-extrabold text-[#012A5E]">
                      <span>Total Supplier Bookings</span>
                      <span>16</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Booking Records Report Table Card */}
                <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                  {/* Table Toolbar Header */}
                  <div className="p-4 sm:p-5 border-b border-[#EEF1F5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-[#EBF2FA] text-[#012A5E] flex items-center justify-center shrink-0">
                        <Ticket className="size-5 text-[#0267B8]" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#012A5E]">
                          Booking Records
                        </h3>
                        <p className="text-xs text-[#6B778C]">
                          {filteredBookings.length} rows · grouped by reference,
                          customer, service, supplier and channel
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search */}
                      <div className="relative w-full sm:w-64">
                        <Search className="size-3.5 text-[#8C9BB0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          type="text"
                          placeholder="Search ref, customer, PNR..."
                          value={tableSearch}
                          onChange={(e) => setTableSearch(e.target.value)}
                          className="h-9 pl-9 pr-3 text-xs bg-white border-[#DCE2EB] rounded-xl focus-visible:border-[#0267B8]"
                        />
                      </div>

                      {/* Status Filter Dropdown */}
                      <Select
                        value={tableStatusFilter}
                        onValueChange={(val) =>
                          setTableStatusFilter(val || 'all')
                        }
                      >
                        <SelectTrigger className="h-9 w-36 bg-white border-[#DCE2EB] rounded-xl text-xs font-semibold text-[#141B28]">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-md">
                          <SelectItem value="all" className="text-xs">
                            All Statuses
                          </SelectItem>
                          <SelectItem value="Confirmed" className="text-xs">
                            Confirmed
                          </SelectItem>
                          <SelectItem value="Completed" className="text-xs">
                            Completed
                          </SelectItem>
                          <SelectItem value="Pending" className="text-xs">
                            Pending
                          </SelectItem>
                          <SelectItem value="Cancelled" className="text-xs">
                            Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB] shrink-0">
                        <Info className="size-3 text-[#0267B8]" />
                        Sample data
                      </span>
                    </div>
                  </div>

                  {/* Responsive Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#F8FAFC]">
                        <TableRow className="border-b border-[#DCE2EB] hover:bg-transparent">
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Booking Ref
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Date & Time
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Customer / Booker
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Service
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Supplier
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Channel
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-right">
                            Amount
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-center">
                            Status
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-right">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="text-center py-12 text-[#64748B] text-xs"
                            >
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Ticket className="size-8 text-[#A0AEC0]" />
                                <span className="font-bold text-[#012A5E]">
                                  No bookings match current filters
                                </span>
                                <span className="text-xs text-[#8C9BAE]">
                                  Try adjusting your dates or dropdown filters
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleResetFilters}
                                  className="mt-2 text-xs rounded-xl border-[#DCE2EB]"
                                >
                                  Reset Filters
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBookings.map((b) => (
                            <TableRow
                              key={b.id}
                              className="border-b border-[#EEF1F5] hover:bg-[#F9FAFC] transition-colors"
                            >
                              {/* Booking Reference */}
                              <TableCell className="py-3 px-4 font-bold text-[#012A5E] text-xs font-mono">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBooking(b)
                                    setIsDetailsOpen(true)
                                  }}
                                  className="hover:underline hover:text-[#0267B8] cursor-pointer text-left font-bold"
                                >
                                  {b.bookingRef}
                                </button>
                                <span className="block text-[10px] text-[#8C9BAE] font-normal font-sans">
                                  PNR: {b.pnr}
                                </span>
                              </TableCell>

                              {/* Date */}
                              <TableCell className="py-3 px-4 text-xs text-[#141B28] whitespace-nowrap">
                                <div>{b.date}</div>
                                <div className="text-[10px] text-[#8C9BAE]">
                                  {b.time}
                                </div>
                              </TableCell>

                              {/* Customer */}
                              <TableCell className="py-3 px-4 text-xs text-[#141B28]">
                                <div className="font-bold text-[#012A5E]">
                                  {b.customerName}
                                </div>
                                <div className="text-[11px] text-[#64748B] truncate max-w-[180px]">
                                  {b.customerEmail}
                                </div>
                              </TableCell>

                              {/* Service */}
                              <TableCell className="py-3 px-4 text-xs text-[#141B28]">
                                <div className="flex items-center gap-1.5 font-semibold text-[#012A5E]">
                                  {getServiceIcon(b.service)}
                                  <span>{b.service}</span>
                                </div>
                              </TableCell>

                              {/* Supplier */}
                              <TableCell className="py-3 px-4 text-xs text-[#4F5B70]">
                                {b.supplier}
                              </TableCell>

                              {/* Channel */}
                              <TableCell className="py-3 px-4 text-xs text-[#4F5B70]">
                                <span className="bg-[#F4F6FA] text-[#012A5E] px-2 py-0.5 rounded text-[11px] font-medium border border-[#E2E8F0]">
                                  {b.channel}
                                </span>
                              </TableCell>

                              {/* Amount */}
                              <TableCell className="py-3 px-4 text-xs text-right font-extrabold text-[#012A5E]">
                                ${b.amountFormatted}
                              </TableCell>

                              {/* Status */}
                              <TableCell className="py-3 px-4 text-center">
                                {getStatusBadge(b.status)}
                              </TableCell>

                              {/* Action */}
                              <TableCell className="py-3 px-4 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(b)
                                    setIsDetailsOpen(true)
                                  }}
                                  className="h-8 px-2.5 text-xs text-[#0267B8] hover:bg-[#EBF2FA] hover:text-[#012A5E] rounded-lg cursor-pointer"
                                >
                                  <Eye className="size-3.5 mr-1" />
                                  <span>View</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Table Footer */}
                  <div className="p-4 border-t border-[#EEF1F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
                    <span>
                      Showing 1 to {filteredBookings.length} of{' '}
                      {filteredBookings.length} entries
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 text-xs rounded-lg border-[#DCE2EB] text-[#8C9BAE]"
                      >
                        Previous
                      </Button>
                      <span className="px-3 py-1 bg-[#012A5E] text-white font-bold rounded-lg text-xs">
                        1
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 text-xs rounded-lg border-[#DCE2EB] text-[#8C9BAE]"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB CONTENT: SALES TAB */}
            {activeTab === 'sales' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Sales KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="size-10 rounded-xl bg-[#EBF2FA] text-[#0267B8] flex items-center justify-center">
                        <TrendingUp className="size-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB]">
                        <Info className="size-3 text-[#0267B8]" />
                        Sample data
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#64748B] uppercase">
                        Booking Count
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#012A5E]">
                        16
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="size-10 rounded-xl bg-[#E6F4EA] text-[#137333] flex items-center justify-center">
                        <DollarSign className="size-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB]">
                        <Info className="size-3 text-[#0267B8]" />
                        Sample amount
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#64748B] uppercase">
                        Sales Amount
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#012A5E]">
                        $5,155.00
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Sales by Service Card */}
                <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#012A5E]">
                        Sales by Service
                      </h3>
                      <p className="text-xs text-[#6B778C]">
                        Sales Amount per service for the selected filters.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB]">
                      <Info className="size-3 text-[#0267B8]" />
                      Sample data
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {INITIAL_SERVICE_BREAKDOWNS.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 w-36 shrink-0 font-bold text-[#012A5E]">
                          {getServiceIcon(item.service)}
                          <span>{item.service}</span>
                        </div>
                        <div className="flex-1 bg-[#DEE8F5]/50 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0267B8] h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="w-40 text-right shrink-0 font-extrabold text-[#012A5E]">
                          ${item.amountFormatted} · {item.bookingText}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Report Table */}
                <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-[#EEF1F5] flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#012A5E]">
                        Sales Report
                      </h3>
                      <p className="text-xs text-[#6B778C]">
                        15 rows · grouped by date, service, supplier and channel
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB]">
                      <Info className="size-3 text-[#0267B8]" />
                      Sample data
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#F8FAFC]">
                        <TableRow className="border-b border-[#DCE2EB]">
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Date
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Service
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Supplier
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Channel
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-center">
                            Booking Count
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-right">
                            Sales Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {INITIAL_SALES_REPORT_ROWS.map((row) => (
                          <TableRow
                            key={row.id}
                            className="border-b border-[#EEF1F5]"
                          >
                            <TableCell className="py-3 px-4 text-xs font-medium text-[#141B28]">
                              {row.date}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs font-semibold text-[#012A5E]">
                              {row.service}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs text-[#4F5B70]">
                              {row.supplier}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs text-[#4F5B70]">
                              {row.channel}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs text-center font-bold text-[#012A5E]">
                              {row.bookingCount}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs text-right font-extrabold text-[#012A5E]">
                              ${row.amountFormatted}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              </div>
            )}

            {/* TAB CONTENT: PAYMENTS */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs">
                    <p className="text-xs font-bold text-[#64748B] uppercase">
                      Total Collected
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#012A5E] mt-1">
                      $4,850.00
                    </h3>
                    <p className="text-xs text-[#137333] mt-1 font-semibold">
                      14 Successful Settlements
                    </p>
                  </div>
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs">
                    <p className="text-xs font-bold text-[#64748B] uppercase">
                      Pending Settlement
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#B06000] mt-1">
                      $190.00
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      1 Awaiting Gateway Clearing
                    </p>
                  </div>
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs">
                    <p className="text-xs font-bold text-[#64748B] uppercase">
                      Refunds & Chargebacks
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#C5221F] mt-1">
                      $115.00
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      1 Refunded Booking
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#012A5E]">
                    Payment Methods Distribution
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#012A5E]">
                        Credit / Debit Card (Stripe Gateway)
                      </span>
                      <span className="font-extrabold text-[#012A5E]">
                        $3,195.00 (62%)
                      </span>
                    </div>
                    <div className="w-full bg-[#EBF2FA] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#0267B8] h-full w-[62%] rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="font-bold text-[#012A5E]">
                        B2B Agent Wallet Balance
                      </span>
                      <span className="font-extrabold text-[#012A5E]">
                        $1,250.00 (24%)
                      </span>
                    </div>
                    <div className="w-full bg-[#EBF2FA] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#6366F1] h-full w-[24%] rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="font-bold text-[#012A5E]">
                        Credit Facility (Corporate / Post-Paid)
                      </span>
                      <span className="font-extrabold text-[#012A5E]">
                        $710.00 (14%)
                      </span>
                    </div>
                    <div className="w-full bg-[#EBF2FA] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#10B981] h-full w-[14%] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Payments Table */}
                <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-[#EEF1F5] flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#012A5E]">
                        Payment Transactions
                      </h3>
                      <p className="text-xs text-[#6B778C]">
                        15 rows · processed payments & refunds
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#F8FAFC]">
                        <TableRow className="border-b border-[#DCE2EB]">
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Date
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Booking Ref
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Service
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4">
                            Supplier
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-center">
                            Status
                          </TableHead>
                          <TableHead className="font-extrabold text-[#64748B] text-[11px] uppercase tracking-wider py-3.5 px-4 text-right">
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {INITIAL_PAYMENT_REPORTS.map((row) => (
                          <TableRow
                            key={row.id}
                            className="border-b border-[#EEF1F5]"
                          >
                            <TableCell className="py-3 px-4 text-xs font-medium text-[#141B28]">
                              {row.date}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs font-bold text-[#012A5E] font-mono">
                              {row.bookingReference}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs text-[#141B28]">
                              {row.service}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs text-[#4F5B70]">
                              {row.supplier}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-center">
                              <span
                                className={cn(
                                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border',
                                  row.paymentStatus === 'Paid' &&
                                    'bg-[#E6F9F0] text-[#0E9355] border-[#A6E8C4]',
                                  row.paymentStatus === 'Refunded' &&
                                    'bg-[#EDE9FE] text-[#6366F1] border-[#DDD6FE]',
                                  row.paymentStatus === 'Failed' &&
                                    'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
                                )}
                              >
                                {row.paymentStatus}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs text-right font-extrabold text-[#012A5E]">
                              ${row.paymentAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              </div>
            )}

            {/* TAB CONTENT: COMMISSIONS */}
            {activeTab === 'commissions' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs">
                    <p className="text-xs font-bold text-[#64748B] uppercase">
                      Total Platform Margin
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#012A5E] mt-1">
                      $568.20
                    </h3>
                    <p className="text-xs text-[#137333] mt-1 font-semibold">
                      11.0% Average Gross Margin
                    </p>
                  </div>
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs">
                    <p className="text-xs font-bold text-[#64748B] uppercase">
                      Agent Commissions Paid
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#0267B8] mt-1">
                      $342.50
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      Credited to Agent Wallets
                    </p>
                  </div>
                  <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 shadow-xs">
                    <p className="text-xs font-bold text-[#64748B] uppercase">
                      Net Retained Revenue
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#137333] mt-1">
                      $225.70
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      Net Travel Platform Yield
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-[18px] border border-[#DCE2EB] p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#012A5E]">
                    Commission Breakdown by Channel
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#012A5E]">
                        B2C Direct Channels (100% Platform Retained)
                      </span>
                      <span className="font-extrabold text-[#012A5E]">
                        $225.70
                      </span>
                    </div>
                    <div className="w-full bg-[#EBF2FA] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#137333] h-full w-[40%] rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="font-bold text-[#012A5E]">
                        B2B Agent Shared Margins (Paid out to Partners)
                      </span>
                      <span className="font-extrabold text-[#012A5E]">
                        $342.50
                      </span>
                    </div>
                    <div className="w-full bg-[#EBF2FA] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#0267B8] h-full w-[60%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Admin Footer */}
          <AdminFooter />
        </div>

        {/* Booking Details Modal */}
        <BookingDetailsDialog
          booking={selectedBooking}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />

        {/* Export CSV / JSON Modal */}
        <ExportReportDialog
          open={isExportOpen}
          onOpenChange={setIsExportOpen}
          records={filteredBookings}
          reportName="Admin Reports - Bookings"
          dateFrom={appliedFilters.from}
          dateTo={appliedFilters.to}
        />
      </div>
    </SidebarProvider>
  )
}

import * as React from 'react'
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Percent,
  Download,
  Filter,
  RotateCcw,
  Plane,
  Building2,
  Package,
  Compass,
  Car,
  Smartphone,
  Train,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Receipt,
  Calendar,
  Layers,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
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
import { SidebarProvider } from '#/components/ui/sidebar'
import { AdminSidebar } from '../admin-sidebar'
import { AdminHeader } from '../admin-header'
import { AdminFooter } from '../admin-footer'
import { AdminReportsExportDialog } from './admin-reports-export-dialog'
import {
  SERVICES_OPTIONS,
  SUPPLIERS_OPTIONS,
  CHANNELS_OPTIONS,
  INITIAL_SERVICE_BREAKDOWN,
  INITIAL_COMMISSION_ROWS,
} from './admin-reports-data'
import type {
  AdminReportsPageProps,
  ReportTab,
  ServiceFilter,
  SupplierFilter,
  ChannelFilter,
  CommissionReportRow,
} from './admin-reports-types'
import { cn } from '#/lib/utils'

function getServiceIcon(service: string) {
  switch (service.toLowerCase()) {
    case 'flights':
    case 'flight':
      return <Plane className="size-4 text-[#0265FF]" />
    case 'hotels':
    case 'hotel':
      return <Building2 className="size-4 text-blue-500" />
    case 'travel packages':
    case 'package':
      return <Package className="size-4 text-emerald-600" />
    case 'activities':
    case 'activity':
      return <Compass className="size-4 text-amber-500" />
    case 'car rental':
    case 'car':
      return <Car className="size-4 text-purple-500" />
    case 'esim':
      return <Smartphone className="size-4 text-pink-500" />
    case 'bus / train':
    case 'train':
      return <Train className="size-4 text-cyan-600" />
    case 'travel insurance':
    case 'insurance':
      return <Shield className="size-4 text-slate-500" />
    default:
      return <Layers className="size-4 text-[#0265FF]" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Settled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="size-3" />
          Settled
        </span>
      )
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="size-3" />
          Pending
        </span>
      )
    case 'In-Review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <AlertCircle className="size-3" />
          In-Review
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
          {status}
        </span>
      )
  }
}

function getChannelBadge(channel: string) {
  switch (channel) {
    case 'B2C Website':
      return (
        <Badge
          variant="outline"
          className="bg-blue-50/60 border-blue-200 text-blue-800 text-[11px] font-medium"
        >
          B2C Website
        </Badge>
      )
    case 'Mobile App':
      return (
        <Badge
          variant="outline"
          className="bg-purple-50/60 border-purple-200 text-purple-800 text-[11px] font-medium"
        >
          Mobile App
        </Badge>
      )
    case 'B2B Agent Portal':
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50/60 border-emerald-200 text-emerald-800 text-[11px] font-medium"
        >
          B2B Agent Portal
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="bg-slate-50 border-slate-200 text-slate-700 text-[11px]"
        >
          {channel}
        </Badge>
      )
  }
}

export function AdminReportsPage({
  initialTab = 'commissions',
  initialNodeId = '1005-5346',
  initialFromDate = '2026-09-01',
  initialToDate = '2026-09-30',
  initialService = 'all',
  initialSupplier = 'all',
  initialChannel = 'all',
  initialExportOpen = false,
  className,
}: AdminReportsPageProps) {
  // Navigation & Active tab state
  const [activeTab, setActiveTab] = React.useState<ReportTab>(initialTab)
  const [exportModalOpen, setExportModalOpen] =
    React.useState<boolean>(initialExportOpen)

  // Filter form state
  const [fromDate, setFromDate] = React.useState<string>(initialFromDate)
  const [toDate, setToDate] = React.useState<string>(initialToDate)
  const [serviceFilter, setServiceFilter] =
    React.useState<ServiceFilter>(initialService)
  const [supplierFilter, setSupplierFilter] =
    React.useState<SupplierFilter>(initialSupplier)
  const [channelFilter, setChannelFilter] =
    React.useState<ChannelFilter>(initialChannel)

  // Applied filter state (applied when user clicks "Apply Filters")
  const [appliedFilters, setAppliedFilters] = React.useState({
    from: initialFromDate,
    to: initialToDate,
    service: initialService,
    supplier: initialSupplier,
    channel: initialChannel,
  })

  // Table search
  const [tableSearch, setTableSearch] = React.useState<string>('')

  // Handle applying filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      from: fromDate,
      to: toDate,
      service: serviceFilter,
      supplier: supplierFilter,
      channel: channelFilter,
    })
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setFromDate('2026-09-01')
    setToDate('2026-09-30')
    setServiceFilter('all')
    setSupplierFilter('all')
    setChannelFilter('all')
    setAppliedFilters({
      from: '2026-09-01',
      to: '2026-09-30',
      service: 'all',
      supplier: 'all',
      channel: 'all',
    })
    setTableSearch('')
  }

  // Filter rows based on applied criteria
  const filteredRows = React.useMemo(() => {
    return INITIAL_COMMISSION_ROWS.filter((row: CommissionReportRow) => {
      // Service filter
      if (
        appliedFilters.service !== 'all' &&
        row.service !== appliedFilters.service
      ) {
        return false
      }
      // Supplier filter
      if (
        appliedFilters.supplier !== 'all' &&
        row.supplier !== appliedFilters.supplier
      ) {
        return false
      }
      // Channel filter
      if (
        appliedFilters.channel !== 'all' &&
        row.channel !== appliedFilters.channel
      ) {
        return false
      }
      // Table search query
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase()
        const match =
          row.service.toLowerCase().includes(q) ||
          row.supplier.toLowerCase().includes(q) ||
          row.channel.toLowerCase().includes(q) ||
          row.date.toLowerCase().includes(q) ||
          row.status.toLowerCase().includes(q) ||
          (row.bookingRef && row.bookingRef.toLowerCase().includes(q)) ||
          (row.agentName && row.agentName.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [appliedFilters, tableSearch])

  // Calculate totals
  const totalBookings = React.useMemo(
    () => filteredRows.reduce((acc, row) => acc + row.bookingCount, 0),
    [filteredRows],
  )
  const totalSales = React.useMemo(
    () => filteredRows.reduce((acc, row) => acc + row.salesAmount, 0),
    [filteredRows],
  )
  const totalCommission = React.useMemo(
    () => filteredRows.reduce((acc, row) => acc + row.commissionAmount, 0),
    [filteredRows],
  )
  const settledCommission = React.useMemo(
    () =>
      filteredRows
        .filter((r) => r.status === 'Settled')
        .reduce((acc, row) => acc + row.commissionAmount, 0),
    [filteredRows],
  )
  const pendingCommission = React.useMemo(
    () =>
      filteredRows
        .filter((r) => r.status === 'Pending' || r.status === 'In-Review')
        .reduce((acc, row) => acc + row.commissionAmount, 0),
    [filteredRows],
  )

  // Dynamic Service Breakdown based on filtered rows
  const dynamicServiceBreakdown = React.useMemo(() => {
    return INITIAL_SERVICE_BREAKDOWN.map((item) => {
      const serviceRows = filteredRows.filter((r) => r.service === item.service)
      const count = serviceRows.reduce((acc, r) => acc + r.bookingCount, 0)
      const amount =
        activeTab === 'commissions'
          ? serviceRows.reduce((acc, r) => acc + r.commissionAmount, 0)
          : serviceRows.reduce((acc, r) => acc + r.salesAmount, 0)
      const totalAmount =
        activeTab === 'commissions' ? totalCommission : totalSales
      const percentage =
        totalAmount > 0 ? (amount / totalAmount) * 100 : item.percentage

      return {
        ...item,
        bookingCount: count > 0 ? count : item.bookingCount,
        amount: count > 0 ? amount : item.amount,
        percentage: Number(percentage.toFixed(1)),
      }
    })
  }, [filteredRows, activeTab, totalCommission, totalSales])

  const tabTitle =
    activeTab === 'commissions'
      ? 'Commissions'
      : activeTab === 'sales'
        ? 'Sales'
        : activeTab === 'bookings'
          ? 'Bookings'
          : 'Payments'

  return (
    <SidebarProvider defaultOpen className="h-screen w-screen overflow-hidden flex bg-[#F8FAFC]">
      {/* Admin Sidebar with active "Reports" */}
      <AdminSidebar currentTab="Reports" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F8FAFC]">
        {/* Top Header */}
        <AdminHeader
          breadcrumbs={[
            { label: 'Admin Panel', href: '/admin' },
            { label: 'Reports', href: '/admin?view=reports' },
            { label: tabTitle },
          ]}
          userName="Sample Admin"
          userRole="Super Admin"
          userInitials="SA"
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Title & Actions (div.ph2) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0265FF]">
                  Reports
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#001A3D] tracking-tight">
                  Reports
                </h1>
                <p className="text-xs md:text-sm text-[#5D6B82]">
                  Review platform sales, bookings, payments and commissions.
                </p>
              </div>

              {/* Action Button: Export CSV (button#exp) */}
              <div className="flex items-center gap-2">
                <Button
                  id="exp"
                  onClick={() => setExportModalOpen(true)}
                  className="bg-[#001A3D] hover:bg-[#012A5E] text-white font-semibold shadow-xs flex items-center gap-2 px-4 py-2 h-10 rounded-lg text-sm"
                >
                  <Download className="size-4 shrink-0" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            {/* Report Type Tabs (div.rtw / Report type) */}
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar pt-1">
              {/* Sales Tab */}
              <button
                id="tab-sales"
                type="button"
                onClick={() => setActiveTab('sales')}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'sales'
                    ? 'bg-white text-[#001A3D] shadow-xs border-t border-x border-[#E2E8F0]'
                    : 'text-[#5D6B82] hover:text-[#001A3D] hover:bg-slate-100/70',
                )}
              >
                <BarChart3 className="size-4.5 shrink-0" />
                <span>Sales</span>
                {activeTab === 'sales' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0265FF]" />
                )}
              </button>

              {/* Bookings Tab */}
              <button
                id="tab-bookings"
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'bookings'
                    ? 'bg-white text-[#001A3D] shadow-xs border-t border-x border-[#E2E8F0]'
                    : 'text-[#5D6B82] hover:text-[#001A3D] hover:bg-slate-100/70',
                )}
              >
                <CalendarDays className="size-4.5 shrink-0" />
                <span>Bookings</span>
                {activeTab === 'bookings' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0265FF]" />
                )}
              </button>

              {/* Payments Tab */}
              <button
                id="tab-payments"
                type="button"
                onClick={() => setActiveTab('payments')}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'payments'
                    ? 'bg-white text-[#001A3D] shadow-xs border-t border-x border-[#E2E8F0]'
                    : 'text-[#5D6B82] hover:text-[#001A3D] hover:bg-slate-100/70',
                )}
              >
                <CreditCard className="size-4.5 shrink-0" />
                <span>Payments</span>
                {activeTab === 'payments' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0265FF]" />
                )}
              </button>

              {/* Commissions Tab (ACTIVE in node 1005-5346) */}
              <button
                id="tab-commissions"
                type="button"
                onClick={() => setActiveTab('commissions')}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'commissions'
                    ? 'bg-white text-[#001A3D] shadow-xs border-t border-x border-[#E2E8F0]'
                    : 'text-[#5D6B82] hover:text-[#001A3D] hover:bg-slate-100/70',
                )}
              >
                <Percent className="size-4.5 shrink-0 text-[#0265FF]" />
                <span className="font-bold">Commissions</span>
                {activeTab === 'commissions' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0265FF]" />
                )}
              </button>
            </div>

            {/* Report Filters Card (Report filters) */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#001A3D]">
                  <Filter className="size-4 text-[#0265FF]" />
                  <span>Report Filters</span>
                </div>
                {(appliedFilters.service !== 'all' ||
                  appliedFilters.supplier !== 'all' ||
                  appliedFilters.channel !== 'all' ||
                  tableSearch) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#0265FF] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>

              {/* Filter Form Grid (div.rf-g) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* From Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="f-from"
                    className="text-xs font-semibold text-[#001A3D] flex items-center gap-1"
                  >
                    From
                  </label>
                  <div className="relative">
                    <Input
                      id="f-from"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="h-10 text-xs bg-[#F8FAFC] border-[#E2E8F0] focus-visible:ring-[#0265FF]"
                    />
                  </div>
                </div>

                {/* To Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="f-to"
                    className="text-xs font-semibold text-[#001A3D] flex items-center gap-1"
                  >
                    To
                  </label>
                  <div className="relative">
                    <Input
                      id="f-to"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="h-10 text-xs bg-[#F8FAFC] border-[#E2E8F0] focus-visible:ring-[#0265FF]"
                    />
                  </div>
                </div>

                {/* Service Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#001A3D]">
                    Service
                  </label>
                  <Select
                    value={serviceFilter}
                    onValueChange={(v) => setServiceFilter(v as ServiceFilter)}
                  >
                    <SelectTrigger
                      id="f-svc"
                      className="h-10 text-xs bg-[#F8FAFC] border-[#E2E8F0]"
                    >
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="text-xs"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Supplier Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#001A3D]">
                    Supplier
                  </label>
                  <Select
                    value={supplierFilter}
                    onValueChange={(v) => setSupplierFilter(v as SupplierFilter)}
                  >
                    <SelectTrigger
                      id="f-sup"
                      className="h-10 text-xs bg-[#F8FAFC] border-[#E2E8F0]"
                    >
                      <SelectValue placeholder="All Suppliers" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLIERS_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="text-xs"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Channel Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#001A3D]">
                    Channel
                  </label>
                  <Select
                    value={channelFilter}
                    onValueChange={(v) => setChannelFilter(v as ChannelFilter)}
                  >
                    <SelectTrigger
                      id="f-ch"
                      className="h-10 text-xs bg-[#F8FAFC] border-[#E2E8F0]"
                    >
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="text-xs"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Summary Footer (div.rf-f) */}
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div id="fsum" className="flex items-center flex-wrap gap-2 text-xs">
                  <span className="text-[#5D6B82] font-medium mr-1">
                    Report period
                  </span>
                  <span className="fch inline-flex items-center px-2.5 py-1 rounded-md bg-[#EBF3FF] text-[#001A3D] font-semibold border border-blue-100">
                    {appliedFilters.from === '2026-09-01' &&
                    appliedFilters.to === '2026-09-30'
                      ? '1 Sep 2026 – 30 Sep 2026'
                      : `${appliedFilters.from} – ${appliedFilters.to}`}
                  </span>
                  <span className="fch inline-flex items-center px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#001A3D] font-medium border border-[#E2E8F0]">
                    {appliedFilters.service === 'all'
                      ? 'All Services'
                      : appliedFilters.service}
                  </span>
                  <span className="fch inline-flex items-center px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#001A3D] font-medium border border-[#E2E8F0]">
                    {appliedFilters.supplier === 'all'
                      ? 'All Suppliers'
                      : appliedFilters.supplier}
                  </span>
                  <span className="fch inline-flex items-center px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#001A3D] font-medium border border-[#E2E8F0]">
                    {appliedFilters.channel === 'all'
                      ? 'All Channels'
                      : appliedFilters.channel}
                  </span>
                </div>

                <Button
                  id="apply"
                  type="button"
                  onClick={handleApplyFilters}
                  className="bg-[#001A3D] hover:bg-[#012A5E] text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-xs"
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* KPI Cards Grid (div#panel) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Booking Count */}
              <div className="kpi bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs relative overflow-hidden space-y-3">
                <div className="kpi-t flex items-center justify-between">
                  <span className="kpi-ic size-10 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0265FF]">
                    <CalendarDays className="size-5" />
                  </span>
                  <span className="tag px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#5D6B82] border border-[#E2E8F0]">
                    Sample data
                  </span>
                </div>
                <div>
                  <p className="kpi-l text-xs font-semibold text-[#5D6B82] uppercase tracking-wider">
                    Booking Count
                  </p>
                  <p className="kpi-v text-2xl md:text-3xl font-extrabold text-[#001A3D]">
                    {totalBookings}
                  </p>
                  <p className="text-[11px] text-[#5D6B82] mt-1">
                    Eligible bookings in period
                  </p>
                </div>
              </div>

              {/* Card 2: Commission Earned / Sales */}
              <div className="kpi bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs relative overflow-hidden space-y-3">
                <div className="kpi-t flex items-center justify-between">
                  <span className="kpi-ic size-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="size-5" />
                  </span>
                  <span className="tag px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#5D6B82] border border-[#E2E8F0]">
                    Sample data
                  </span>
                </div>
                <div>
                  <p className="kpi-l text-xs font-semibold text-[#5D6B82] uppercase tracking-wider">
                    {activeTab === 'commissions'
                      ? 'Total Commission'
                      : 'Sales Amount'}
                  </p>
                  <p className="kpi-v text-2xl md:text-3xl font-extrabold text-[#001A3D]">
                    $
                    {activeTab === 'commissions'
                      ? totalCommission.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : totalSales.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </p>
                  <p className="kpi-n text-[11px] text-[#5D6B82] mt-1">
                    {activeTab === 'commissions'
                      ? 'Average 9.4% platform commission'
                      : 'Sample amount across all channels'}
                  </p>
                </div>
              </div>

              {/* Card 3: Settled Commission */}
              <div className="kpi bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs relative overflow-hidden space-y-3">
                <div className="kpi-t flex items-center justify-between">
                  <span className="kpi-ic size-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0265FF]">
                    <CheckCircle2 className="size-5" />
                  </span>
                  <span className="tag px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#5D6B82] border border-[#E2E8F0]">
                    Sample data
                  </span>
                </div>
                <div>
                  <p className="kpi-l text-xs font-semibold text-[#5D6B82] uppercase tracking-wider">
                    Settled Commission
                  </p>
                  <p className="kpi-v text-2xl md:text-3xl font-extrabold text-[#001A3D]">
                    $
                    {settledCommission.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    {filteredRows.filter((r) => r.status === 'Settled').length}{' '}
                    cleared transactions
                  </p>
                </div>
              </div>

              {/* Card 4: Pending / In-Review */}
              <div className="kpi bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs relative overflow-hidden space-y-3">
                <div className="kpi-t flex items-center justify-between">
                  <span className="kpi-ic size-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock className="size-5" />
                  </span>
                  <span className="tag px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#5D6B82] border border-[#E2E8F0]">
                    Sample data
                  </span>
                </div>
                <div>
                  <p className="kpi-l text-xs font-semibold text-[#5D6B82] uppercase tracking-wider">
                    Pending Settlement
                  </p>
                  <p className="kpi-v text-2xl md:text-3xl font-extrabold text-[#001A3D]">
                    $
                    {pendingCommission.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-[11px] text-amber-600 font-medium mt-1">
                    {
                      filteredRows.filter(
                        (r) => r.status === 'Pending' || r.status === 'In-Review',
                      ).length
                    }{' '}
                    pending verification
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown by Service Section (section#w-ch) */}
            <section
              id="w-ch"
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-5"
            >
              <div className="wd-h flex items-center justify-between">
                <div>
                  <h2
                    id="ch-h"
                    className="text-lg font-bold text-[#001A3D] tracking-tight"
                  >
                    {activeTab === 'commissions'
                      ? 'Commissions by Service'
                      : 'Sales by Service'}
                  </h2>
                  <p className="text-xs text-[#5D6B82]">
                    {activeTab === 'commissions'
                      ? 'Commission amount per service for the selected filters.'
                      : 'Sales Amount per service for the selected filters.'}
                  </p>
                </div>
                <span className="tag px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-[#5D6B82] border border-[#E2E8F0]">
                  Sample data
                </span>
              </div>

              {/* Service Values List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {dynamicServiceBreakdown.map((item) => (
                  <div key={item.service} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(item.service)}
                        <span className="text-[#001A3D] font-semibold">
                          {item.service}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#001A3D]">
                          $
                          {item.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <small className="text-[#5D6B82] text-[11px]">
                          ({item.bookingCount}{' '}
                          {item.bookingCount === 1 ? 'booking' : 'bookings'})
                        </small>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(4, item.percentage))}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Table Section (section.tc2) */}
            <section
              className="tc2 bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden"
            >
              {/* Table Header Container */}
              <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2
                    id="tb-h"
                    className="text-lg font-bold text-[#001A3D] tracking-tight"
                  >
                    {activeTab === 'commissions'
                      ? 'Commissions Report'
                      : activeTab === 'sales'
                        ? 'Sales Report'
                        : activeTab === 'bookings'
                          ? 'Bookings Report'
                          : 'Payments Report'}
                  </h2>
                  <p className="text-xs text-[#5D6B82]">
                    {filteredRows.length} rows · grouped by date, service,
                    supplier and channel
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Table Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5D6B82]" />
                    <Input
                      type="text"
                      placeholder="Search within report..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="pl-9 h-9 text-xs bg-[#F8FAFC] border-[#CBD5E1]"
                    />
                  </div>

                  <span className="tag px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-[#5D6B82] border border-[#E2E8F0] whitespace-nowrap hidden sm:inline-block">
                    Sample data
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F8FAFC]">
                    <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5 pl-5">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5">
                        Service
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5">
                        Supplier
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5">
                        Channel
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5 text-right">
                        Booking Count
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5 text-right">
                        Sales Amount
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5 text-right">
                        Rate
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5 text-right">
                        Commission
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#001A3D] py-3.5 text-center pr-5">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="h-32 text-center text-xs text-[#5D6B82]"
                        >
                          No commission records found matching the selected
                          filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-[#F1F5F9] hover:bg-slate-50/80 transition-colors"
                        >
                          <TableCell className="text-xs font-medium text-[#001A3D] pl-5 py-3 whitespace-nowrap">
                            {row.date}
                          </TableCell>
                          <TableCell className="text-xs text-[#001A3D] py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getServiceIcon(row.service)}
                              <span className="font-medium">{row.service}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-[#5D6B82] py-3 whitespace-nowrap">
                            {row.supplier}
                          </TableCell>
                          <TableCell className="text-xs py-3 whitespace-nowrap">
                            {getChannelBadge(row.channel)}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-[#001A3D] text-right py-3">
                            {row.bookingCount}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-[#001A3D] text-right py-3 whitespace-nowrap">
                            $
                            {row.salesAmount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-[#5D6B82] text-right py-3">
                            {row.commissionRate.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-xs font-bold text-[#0265FF] text-right py-3 whitespace-nowrap">
                            $
                            {row.commissionAmount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-xs text-center pr-5 py-3 whitespace-nowrap">
                            {getStatusBadge(row.status)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}

                    {/* Summary Row at Bottom (Figma match) */}
                    {filteredRows.length > 0 && (
                      <TableRow className="bg-[#F8FAFC] border-t-2 border-[#CBD5E1] font-bold hover:bg-[#F8FAFC]">
                        <TableCell
                          colSpan={4}
                          className="text-xs font-bold text-[#001A3D] pl-5 py-3.5"
                        >
                          Total ({filteredRows.length} rows)
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#001A3D] text-right py-3.5">
                          {totalBookings}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#001A3D] text-right py-3.5 whitespace-nowrap">
                          $
                          {totalSales.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#5D6B82] text-right py-3.5">
                          -
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#0265FF] text-right py-3.5 whitespace-nowrap">
                          $
                          {totalCommission.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-xs text-center pr-5 py-3.5 text-[#5D6B82]">
                          Summary
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>
          </div>
        </main>

        {/* Page Footer */}
        <AdminFooter />
      </div>

      {/* Export Dialog */}
      <AdminReportsExportDialog
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        reportTitle={`${tabTitle} Report`}
        totalRows={filteredRows.length}
        currentFilters={{
          period: `${appliedFilters.from} – ${appliedFilters.to}`,
          service: appliedFilters.service,
          supplier: appliedFilters.supplier,
          channel: appliedFilters.channel,
        }}
      />
    </SidebarProvider>
  )
}

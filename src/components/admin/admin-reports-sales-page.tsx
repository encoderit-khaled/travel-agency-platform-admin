import * as React from 'react'
import {
  CalendarDays,
  DollarSign,
  Download,
  Calendar,
  ChevronDown,
  Check,
  TrendingUp,
  CreditCard,
  Percent,
} from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminFooter } from './admin-footer'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { SidebarProvider } from '#/components/ui/sidebar'
import {
  REPORT_TABS,
  SERVICES_FILTER_OPTIONS,
  SUPPLIERS_FILTER_OPTIONS,
  CHANNELS_FILTER_OPTIONS,
  INITIAL_SALES_REPORT_ROWS,
  INITIAL_SERVICE_BREAKDOWNS,
} from './admin-reports-sales-data'
import type {
  AdminReportsSalesPageProps,
  ReportTab,
  SalesReportRow,
  ServiceSalesBreakdown,
  SalesReportFilters,
} from './admin-reports-sales-types'
import { cn } from '#/lib/utils'

export function AdminReportsSalesPage({
  initialTab = 'sales',
  initialFrom = '2026-09-01',
  initialTo = '2026-09-30',
  initialService = 'All Services',
  initialSupplier = 'All Suppliers',
  initialChannel = 'All Channels',
}: AdminReportsSalesPageProps) {
  const [activeTab, setActiveTab] = React.useState<ReportTab>(initialTab)

  // Filter state
  const [filters, setFilters] = React.useState<SalesReportFilters>({
    dateFrom: initialFrom,
    dateTo: initialTo,
    service: initialService,
    supplier: initialSupplier,
    channel: initialChannel,
  })

  // Applied filter state (what actually drives the data display)
  const [appliedFilters, setAppliedFilters] =
    React.useState<SalesReportFilters>(filters)

  // Feedback banner state on Export
  const [exportNotice, setExportNotice] = React.useState<string | null>(null)

  // Compute filtered table rows based on applied filters
  const displayedRows = React.useMemo(() => {
    return INITIAL_SALES_REPORT_ROWS.filter((row) => {
      if (
        appliedFilters.service !== 'All Services' &&
        row.service !== appliedFilters.service
      ) {
        return false
      }
      if (
        appliedFilters.supplier !== 'All Suppliers' &&
        row.supplier !== appliedFilters.supplier
      ) {
        return false
      }
      if (
        appliedFilters.channel !== 'All Channels' &&
        row.channel !== appliedFilters.channel
      ) {
        return false
      }
      return true
    })
  }, [appliedFilters])

  // Compute dynamic KPIs and breakdowns based on displayed rows
  const {
    totalBookings,
    totalSalesAmount,
    formattedTotalSales,
    serviceBreakdown,
  } = React.useMemo(() => {
    const bookings = displayedRows.reduce((sum, r) => sum + r.bookingCount, 0)
    const sales = displayedRows.reduce((sum, r) => sum + r.amount, 0)

    // Service breakdown recalculation
    const breakdownMap = new Map<string, { amount: number; bookings: number }>()

    for (const row of displayedRows) {
      const existing = breakdownMap.get(row.service) || {
        amount: 0,
        bookings: 0,
      }
      existing.amount += row.amount
      existing.bookings += row.bookingCount
      breakdownMap.set(row.service, existing)
    }

    // If viewing all, preserve canonical list of 8 services with computed percentages
    const maxAmount = Math.max(
      ...INITIAL_SERVICE_BREAKDOWNS.map((s) => s.amount),
      1,
    )

    const breakdown: ServiceSalesBreakdown[] = INITIAL_SERVICE_BREAKDOWNS.map(
      (base) => {
        const stats = breakdownMap.get(base.service)
        const amount = stats ? stats.amount : 0
        const bCount = stats ? stats.bookings : 0
        const pct = Math.min(
          100,
          Math.round((amount / maxAmount) * 100 * 10) / 10,
        )

        return {
          ...base,
          amount,
          amountFormatted:
            amount > 0
              ? amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : base.amountFormatted,
          bookingCount: bCount > 0 ? bCount : base.bookingCount,
          bookingText:
            bCount > 0
              ? `${bCount} booking${bCount === 1 ? '' : 's'}`
              : base.bookingText,
          percentage:
            appliedFilters.service === 'All Services' ? base.percentage : pct,
        }
      },
    )

    return {
      totalBookings: bookings > 0 ? bookings : 16,
      totalSalesAmount: sales > 0 ? sales : 5155.0,
      formattedTotalSales:
        sales > 0
          ? sales.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '5,155.00',
      serviceBreakdown: breakdown,
    }
  }, [displayedRows, appliedFilters])

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters })
  }

  // Handle Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Service',
      'Supplier',
      'Channel',
      'Booking Count',
      'Sales Amount',
    ]
    const csvRows = [headers.join(',')]

    displayedRows.forEach((r) => {
      csvRows.push(
        [
          `"${r.date}"`,
          `"${r.service}"`,
          `"${r.supplier}"`,
          `"${r.channel}"`,
          r.bookingCount,
          r.amount.toFixed(2),
        ].join(','),
      )
    })

    // Add total row
    csvRows.push(
      [
        `"Total"`,
        `""`,
        `""`,
        `""`,
        totalBookings,
        totalSalesAmount.toFixed(2),
      ].join(','),
    )

    const blob = new Blob([csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `sales-report-2026-09.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setExportNotice(
      `Exported ${displayedRows.length} rows to sales-report-2026-09.csv`,
    )
    setTimeout(() => {
      setExportNotice(null)
    }, 4000)
  }

  return (
    <SidebarProvider defaultOpen className="h-full min-h-0 w-auto">
      <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar currentTab="Reports" />

        {/* Main Column */}
        <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
          {/* Header */}
          <AdminHeader
            breadcrumbs={[
              { label: 'Admin Panel', href: '/admin' },
              { label: 'Reports' },
            ]}
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
          />

          {/* Page Content (div#page) */}
          <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
            {/* Export Notice Banner */}
            {exportNotice && (
              <div className="rounded-xl border border-[#0267B8]/30 bg-[#EAF4FD] px-4 py-3 text-sm text-[#012A5E] flex items-center justify-between shadow-xs transition-all">
                <span className="font-semibold flex items-center gap-2">
                  <Check className="size-4 text-[#0267B8]" />
                  {exportNotice}
                </span>
                <button
                  type="button"
                  onClick={() => setExportNotice(null)}
                  className="text-xs text-[#012A5E]/70 hover:text-[#012A5E] font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Page Header (div.ph2) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0267B8]">
                  Reports
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                  Reports
                </h1>
                <p className="text-sm text-[#4F5B70]">
                  Review platform sales, bookings, payments and commissions.
                </p>
              </div>

              {/* Action: Export CSV */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  id="exp"
                  onClick={handleExportCsv}
                  className="h-10 px-4 rounded-xl bg-[#012A5E] hover:bg-[#001A3D] text-white font-bold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="size-4.5" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            {/* Report Type Tabs (div.rtw) */}
            <div className="border-b border-[#DCE2EB] overflow-x-auto flex items-center gap-1 scrollbar-none">
              {REPORT_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative h-12 px-4 flex items-center gap-2 rounded-t-lg text-sm transition-all whitespace-nowrap cursor-pointer',
                      isActive
                        ? 'text-[#012A5E] font-extrabold'
                        : 'text-[#4F5B70] hover:text-[#012A5E] font-bold hover:bg-[#EEF2F7]/50',
                    )}
                  >
                    {tab.id === 'sales' && <TrendingUp className="size-4" />}
                    {tab.id === 'bookings' && (
                      <CalendarDays className="size-4" />
                    )}
                    {tab.id === 'payments' && <CreditCard className="size-4" />}
                    {tab.id === 'commissions' && <Percent className="size-4" />}
                    <span>{tab.label}</span>

                    {/* Active Tab Bottom Indicator Bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#012A5E] rounded-t-sm" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Report Filters Card (Report filters) */}
            <Card className="rounded-[18px] border border-[#DCE2EB] bg-white overflow-hidden shadow-2xs">
              {/* Form Row */}
              <div className="p-4 sm:p-5 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* From Date */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="f-from"
                    className="text-[13px] font-bold text-[#141B28]"
                  >
                    From
                  </label>
                  <div className="relative">
                    <input
                      id="f-from"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) =>
                        setFilters({ ...filters, dateFrom: e.target.value })
                      }
                      className="w-full h-10 px-3.5 py-2 text-sm font-semibold rounded-xl border border-[#DCE2EB] bg-white text-[#141B28] focus:outline-none focus:border-[#0267B8] focus:ring-1 focus:ring-[#0267B8] shadow-2xs"
                    />
                  </div>
                </div>

                {/* To Date */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="f-to"
                    className="text-[13px] font-bold text-[#141B28]"
                  >
                    To
                  </label>
                  <div className="relative">
                    <input
                      id="f-to"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) =>
                        setFilters({ ...filters, dateTo: e.target.value })
                      }
                      className="w-full h-10 px-3.5 py-2 text-sm font-semibold rounded-xl border border-[#DCE2EB] bg-white text-[#141B28] focus:outline-none focus:border-[#0267B8] focus:ring-1 focus:ring-[#0267B8] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Service Select */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="f-svc"
                    className="text-[13px] font-bold text-[#141B28]"
                  >
                    Service
                  </label>
                  <div className="relative">
                    <select
                      id="f-svc"
                      value={filters.service}
                      onChange={(e) =>
                        setFilters({ ...filters, service: e.target.value })
                      }
                      className="w-full h-10 appearance-none px-3.5 pr-8 py-2 text-sm font-semibold rounded-xl border border-[#DCE2EB] bg-white text-[#141B28] focus:outline-none focus:border-[#0267B8] focus:ring-1 focus:ring-[#0267B8] shadow-2xs cursor-pointer"
                    >
                      {SERVICES_FILTER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-[#8C9BAE]" />
                  </div>
                </div>

                {/* Supplier Select */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="f-sup"
                    className="text-[13px] font-bold text-[#141B28]"
                  >
                    Supplier
                  </label>
                  <div className="relative">
                    <select
                      id="f-sup"
                      value={filters.supplier}
                      onChange={(e) =>
                        setFilters({ ...filters, supplier: e.target.value })
                      }
                      className="w-full h-10 appearance-none px-3.5 pr-8 py-2 text-sm font-semibold rounded-xl border border-[#DCE2EB] bg-white text-[#141B28] focus:outline-none focus:border-[#0267B8] focus:ring-1 focus:ring-[#0267B8] shadow-2xs cursor-pointer"
                    >
                      {SUPPLIERS_FILTER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-[#8C9BAE]" />
                  </div>
                </div>

                {/* Channel Select */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="f-ch"
                    className="text-[13px] font-bold text-[#141B28]"
                  >
                    Channel
                  </label>
                  <div className="relative">
                    <select
                      id="f-ch"
                      value={filters.channel}
                      onChange={(e) =>
                        setFilters({ ...filters, channel: e.target.value })
                      }
                      className="w-full h-10 appearance-none px-3.5 pr-8 py-2 text-sm font-semibold rounded-xl border border-[#DCE2EB] bg-white text-[#141B28] focus:outline-none focus:border-[#0267B8] focus:ring-1 focus:ring-[#0267B8] shadow-2xs cursor-pointer"
                    >
                      {CHANNELS_FILTER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-[#8C9BAE]" />
                  </div>
                </div>
              </div>

              {/* Filter Summary Footer (div.rf-f) */}
              <div className="px-4 sm:px-5 py-3 border-t border-[#EEF1F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFBFD]">
                <div
                  id="fsum"
                  className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px]"
                >
                  <span className="text-[#4F5B70] font-medium mr-1">
                    Report period
                  </span>
                  <span className="rounded-md bg-[#EEF2F7] px-2 py-0.5 font-bold text-[#012A5E]">
                    1 Sep 2026 – 30 Sep 2026
                  </span>
                  <span className="rounded-md bg-[#EEF2F7] px-2 py-0.5 font-bold text-[#012A5E]">
                    {appliedFilters.service}
                  </span>
                  <span className="rounded-md bg-[#EEF2F7] px-2 py-0.5 font-bold text-[#012A5E]">
                    {appliedFilters.supplier}
                  </span>
                  <span className="rounded-md bg-[#EEF2F7] px-2 py-0.5 font-bold text-[#012A5E]">
                    {appliedFilters.channel}
                  </span>
                </div>

                <Button
                  id="apply"
                  type="button"
                  onClick={handleApplyFilters}
                  variant="outline"
                  className="h-9 px-4 rounded-xl border border-[#DCE2EB] bg-white hover:bg-[#EEF2F7] text-[#012A5E] font-bold text-xs sm:text-sm shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  Apply Filters
                </Button>
              </div>
            </Card>

            {/* Main Panel (div#panel) */}
            <div id="panel" className="flex flex-col gap-6">
              {/* Row 1: KPI Cards + Sales by Service Breakdown */}
              <div className="flex flex-col lg:flex-row items-stretch gap-5">
                {/* Column 1: 2 KPI Cards (fixed width 300px on desktop) */}
                <div className="w-full lg:w-[300px] flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
                  {/* KPI Card 1: Booking Count */}
                  <Card className="relative flex-1 overflow-hidden rounded-[18px] border border-[#DCE2EB] bg-white p-[18px_20px] shadow-2xs hover:border-[#C5CFDC] transition-all">
                    {/* Corner Radial Gradient Decoration (EL-dbc05c97) */}
                    <div className="pointer-events-none absolute -top-8 -right-8 size-28 rounded-full bg-radial from-[#0A76CC]/10 to-transparent" />

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex size-10.5 items-center justify-center rounded-xl bg-[#EAF4FD] text-[#012A5E] shadow-2xs">
                        <CalendarDays className="size-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-extrabold text-[#4F5B70] shadow-none"
                      >
                        Sample data
                      </Badge>
                    </div>

                    <p className="text-[13.5px] font-bold text-[#4F5B70] mb-0.5">
                      Booking Count
                    </p>
                    <p className="text-3xl font-extrabold text-[#141B28] tracking-tight">
                      {totalBookings}
                    </p>
                  </Card>

                  {/* KPI Card 2: Sales Amount */}
                  <Card className="relative flex-1 overflow-hidden rounded-[18px] border border-[#DCE2EB] bg-white p-[18px_20px] shadow-2xs hover:border-[#C5CFDC] transition-all">
                    {/* Corner Radial Gradient Decoration (EL-dbc05c97) */}
                    <div className="pointer-events-none absolute -top-8 -right-8 size-28 rounded-full bg-radial from-[#0A76CC]/10 to-transparent" />

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex size-10.5 items-center justify-center rounded-xl bg-[#012A5E] text-white shadow-2xs">
                        <DollarSign className="size-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-extrabold text-[#4F5B70] shadow-none"
                      >
                        Sample data
                      </Badge>
                    </div>

                    <p className="text-[13.5px] font-bold text-[#4F5B70] mb-0.5">
                      Sales Amount
                    </p>
                    <p className="text-3xl font-extrabold text-[#141B28] tracking-tight">
                      {formattedTotalSales}
                    </p>
                    <p className="text-xs font-medium text-[#4F5B70] mt-1">
                      Sample amount
                    </p>
                  </Card>
                </div>

                {/* Column 2: Sales by Service Breakdown (section#w-ch) */}
                <Card
                  id="w-ch"
                  className="flex-1 rounded-[18px] border border-[#DCE2EB] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 mb-2 border-b border-[#EEF1F5]">
                    <div>
                      <h2
                        id="ch-h"
                        className="text-[16.5px] font-extrabold text-[#012A5E]"
                      >
                        Sales by Service
                      </h2>
                      <p className="text-xs sm:text-[13px] text-[#4F5B70]">
                        Sales Amount per service for the selected filters.
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="self-start rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-extrabold text-[#4F5B70] shadow-none"
                    >
                      Sample data
                    </Badge>
                  </div>

                  {/* Values List */}
                  <ul className="flex flex-col gap-3">
                    {serviceBreakdown.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 sm:gap-4 text-sm"
                      >
                        {/* Service Name (fixed width 150px) */}
                        <span className="w-28 sm:w-[150px] shrink-0 text-[13.5px] font-bold text-[#141B28] truncate">
                          {item.service}
                        </span>

                        {/* Progress Bar Track & Bar */}
                        <div className="flex-1 h-3 rounded-full bg-[#EEF2F7] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0267B8] transition-all duration-300"
                            style={{
                              width: `${Math.max(item.percentage, 1)}%`,
                            }}
                          />
                        </div>

                        {/* Amount & Booking Count */}
                        <div className="w-20 sm:w-[84px] shrink-0 text-right flex flex-col items-end leading-tight">
                          <span className="text-[13.5px] font-extrabold text-[#141B28]">
                            {item.amountFormatted}
                          </span>
                          <small className="text-[11px] text-[#4F5B70]">
                            {item.bookingText}
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Row 2: Sales Report Table (section.tc2) */}
              <Card className="rounded-[18px] border border-[#DCE2EB] bg-white overflow-hidden shadow-2xs">
                {/* Table Header Section */}
                <div className="p-5 sm:p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF1F5]">
                  <div>
                    <h2
                      id="tb-h"
                      className="text-[16.5px] font-extrabold text-[#012A5E]"
                    >
                      Sales Report
                    </h2>
                    <p className="text-xs sm:text-[13px] text-[#4F5B70]">
                      {displayedRows.length} rows · grouped by date, service,
                      supplier and channel
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="self-start rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-extrabold text-[#4F5B70] shadow-none"
                  >
                    Sample data
                  </Badge>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#EEF1F5] text-[11.5px] font-extrabold uppercase tracking-wider text-[#4F5B70]">
                        <th className="py-3 px-4.5 font-extrabold">Date</th>
                        <th className="py-3 px-4.5 font-extrabold">Service</th>
                        <th className="py-3 px-4.5 font-extrabold">Supplier</th>
                        <th className="py-3 px-4.5 font-extrabold">Channel</th>
                        <th className="py-3 px-4.5 font-extrabold text-right">
                          Booking Count
                        </th>
                        <th className="py-3 px-4.5 font-extrabold text-right">
                          Sales Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF1F5] text-sm">
                      {displayedRows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-[#F8FAFC]/80 transition-colors"
                        >
                          <td className="py-3.5 px-4.5 font-medium text-[#141B28] whitespace-nowrap">
                            {row.date}
                          </td>
                          <td className="py-3.5 px-4.5 font-bold text-[#141B28] whitespace-nowrap">
                            {row.service}
                          </td>
                          <td className="py-3.5 px-4.5 text-[#4F5B70] whitespace-nowrap">
                            {row.supplier}
                          </td>
                          <td className="py-3.5 px-4.5 text-[#4F5B70] whitespace-nowrap">
                            {row.channel}
                          </td>
                          <td className="py-3.5 px-4.5 text-right font-bold text-[#141B28]">
                            {row.bookingCount}
                          </td>
                          <td className="py-3.5 px-4.5 text-right font-bold text-[#141B28]">
                            {row.amountFormatted}
                          </td>
                        </tr>
                      ))}

                      {displayedRows.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-12 text-center text-sm text-[#4F5B70]"
                          >
                            No sales data matching the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {/* Total Row */}
                    <tfoot>
                      <tr className="bg-[#F8FAFC] border-t border-[#DCE2EB] text-sm">
                        <td
                          colSpan={4}
                          className="py-3.5 px-4.5 font-extrabold text-[#012A5E]"
                        >
                          Total
                        </td>
                        <td className="py-3.5 px-4.5 text-right font-extrabold text-[#012A5E]">
                          {totalBookings}
                        </td>
                        <td className="py-3.5 px-4.5 text-right font-extrabold text-[#012A5E]">
                          {formattedTotalSales}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            </div>
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}

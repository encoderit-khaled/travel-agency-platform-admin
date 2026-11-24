import * as React from 'react'
import {
  ArrowLeft,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Plane,
  Building2,
  Luggage,
  Compass,
  Car,
  Smartphone,
  Train,
  ShieldCheck,
  Building,
  Info,
  ArrowRight,
  TrendingUp,
  Wallet,
  CreditCard,
  Tag,
  BarChart2,
  ExternalLink,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '#/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import {
  AgentPortalSidebar,
  AgentPortalHeader,
} from '#/components/agent-portal'
import { BookingDetailsSheet } from './booking-details-sheet'
import { MIRPUR_DESK_DETAILS, SUB_AGENT_BOOKINGS } from './data'
import type { SubAgentBookingRecord, BookingServiceType } from './types'

export interface SubAgentPerformancePageProps {
  deskName?: string
  initialBookingRef?: string
  isStandalone?: boolean
}

interface ServiceMetric {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  count: number
  total: number
}

interface StatusMetric {
  status: string
  count: number
  badgeColor: string
  dotColor: string
}

export function SubAgentPerformancePage({
  deskName = 'Mirpur Desk',
  initialBookingRef,
  isStandalone = true,
}: SubAgentPerformancePageProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const desk = MIRPUR_DESK_DETAILS

  // Filter states
  const [dateRange, setDateRange] = React.useState('all')
  const [selectedService, setSelectedService] = React.useState('all')
  const [selectedStatus, setSelectedStatus] = React.useState('all')

  // Selected booking for slideover
  const [selectedBooking, setSelectedBooking] =
    React.useState<SubAgentBookingRecord | null>(() => {
      if (initialBookingRef) {
        return (
          SUB_AGENT_BOOKINGS.find((b) => b.ref === initialBookingRef) || null
        )
      }
      return null
    })
  const [isBookingSheetOpen, setIsBookingSheetOpen] = React.useState(
    Boolean(initialBookingRef),
  )

  // Wallet and Credit dialog state
  const [walletDialogOpen, setWalletDialogOpen] = React.useState(false)
  const [creditDialogOpen, setCreditDialogOpen] = React.useState(false)

  // Filter the booking records
  const filteredBookings = React.useMemo(() => {
    return SUB_AGENT_BOOKINGS.filter((bk) => {
      if (selectedService !== 'all' && bk.service !== selectedService) {
        return false
      }
      if (selectedStatus !== 'all' && bk.status !== selectedStatus) {
        return false
      }
      return true
    })
  }, [selectedService, selectedStatus])

  // Computed KPIs based on filtered bookings
  const totalBookings = filteredBookings.length
  const confirmedCount = filteredBookings.filter(
    (b) => b.status === 'Confirmed',
  ).length
  const ticketedCount = filteredBookings.filter(
    (b) => b.status === 'Ticketed',
  ).length
  const confirmedTicketedTotal = confirmedCount + ticketedCount
  const pendingCount = filteredBookings.filter(
    (b) => b.status === 'Pending',
  ).length
  const cancelledCount = filteredBookings.filter(
    (b) => b.status === 'Cancelled',
  ).length

  // Service breakdown (All 8 services)
  const servicesList: ServiceMetric[] = [
    {
      id: 'flight',
      name: 'Flight',
      icon: Plane,
      count: filteredBookings.filter((b) => b.service === 'Flight').length,
      total: 5,
    },
    {
      id: 'hotel',
      name: 'Hotel',
      icon: Building,
      count: filteredBookings.filter((b) => b.service === 'Hotel').length,
      total: 5,
    },
    {
      id: 'package',
      name: 'Travel Package',
      icon: Luggage,
      count: filteredBookings.filter((b) => b.service === 'Travel Package')
        .length,
      total: 5,
    },
    {
      id: 'activity',
      name: 'Activity',
      icon: Compass,
      count: filteredBookings.filter((b) => b.service === 'Activity').length,
      total: 5,
    },
    {
      id: 'car-rental',
      name: 'Car Rental',
      icon: Car,
      count: filteredBookings.filter((b) => b.service === 'Car Rental').length,
      total: 5,
    },
    {
      id: 'esim',
      name: 'eSIM',
      icon: Smartphone,
      count: 0,
      total: 5,
    },
    {
      id: 'bus-train',
      name: 'Bus / Train',
      icon: Train,
      count: 0,
      total: 5,
    },
    {
      id: 'insurance',
      name: 'Travel Insurance',
      icon: ShieldCheck,
      count: 0,
      total: 5,
    },
  ]

  // Status breakdown (M8 lifecycle: Pending, Confirmed, Ticketed, Cancelled, Refunded, Failed)
  const statusList: StatusMetric[] = [
    {
      status: 'Pending',
      count: pendingCount,
      badgeColor: 'bg-[#FFF8E7] text-[#B45309]',
      dotColor: 'bg-[#F59E0B]',
    },
    {
      status: 'Confirmed',
      count: confirmedCount,
      badgeColor: 'bg-[#EAFBF1] text-[#0B6A45]',
      dotColor: 'bg-[#10B981]',
    },
    {
      status: 'Ticketed',
      count: ticketedCount,
      badgeColor: 'bg-[#EBF4FC] text-[#0267B8]',
      dotColor: 'bg-[#0267B8]',
    },
    {
      status: 'Cancelled',
      count: cancelledCount,
      badgeColor: 'bg-[#FEF2F2] text-[#DC2626]',
      dotColor: 'bg-[#EF4444]',
    },
    {
      status: 'Refunded',
      count: 0,
      badgeColor: 'bg-[#F1F5F9] text-[#64748B]',
      dotColor: 'bg-[#94A3B8]',
    },
    {
      status: 'Failed',
      count: 0,
      badgeColor: 'bg-[#F1F5F9] text-[#64748B]',
      dotColor: 'bg-[#94A3B8]',
    },
  ]

  // Distinct services used in filtered data
  const servicesUsedCount = new Set(filteredBookings.map((b) => b.service)).size

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = [
      'Booking Reference',
      'Customer Name',
      'Service',
      'Travel Date',
      'Status',
      'Amount',
      'Sub Agent',
      'Parent Agent',
    ]

    const rows = filteredBookings.map((b) => [
      b.ref,
      `"${b.customer}"`,
      b.service,
      `"${b.travelDate}"`,
      b.status,
      `"${b.amount || 'N/A'}"`,
      `"${deskName}"`,
      `"${desk.parentAgent}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `mirpur-desk-performance-report-${new Date().toISOString().slice(0, 10)}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenBooking = (bk: SubAgentBookingRecord) => {
    setSelectedBooking(bk)
    setIsBookingSheetOpen(true)
  }

  const getServiceBadgeIcon = (service: BookingServiceType) => {
    switch (service) {
      case 'Flight':
        return <Plane className="size-3.5 text-[#0267B8]" />
      case 'Hotel':
        return <Building className="size-3.5 text-[#0267B8]" />
      case 'Travel Package':
        return <Luggage className="size-3.5 text-[#0267B8]" />
      case 'Activity':
        return <Compass className="size-3.5 text-[#0267B8]" />
      case 'Car Rental':
        return <Car className="size-3.5 text-[#0267B8]" />
      default:
        return <Plane className="size-3.5 text-[#0267B8]" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ticketed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF4FD] text-[#0267B8] border border-[#C5DFF8]">
            <span className="size-1.5 rounded-full bg-[#0267B8]" />
            Ticketed
          </span>
        )
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Confirmed
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF9EB] text-[#B45309] border border-amber-200">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-rose-200">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#64748B] border border-slate-200">
            {status}
          </span>
        )
    }
  }

  const mainBody = (
    <div className="space-y-5">
      {/* Sub-agent Report Info Aside */}
      <aside className="bg-[#EBF3FC] border border-[#D4E5F9] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="size-9 rounded-xl bg-[#0267B8]/10 text-[#0267B8] flex items-center justify-center shrink-0">
            <BarChart2 className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#012A5E]">
              Sub-agent report
            </h2>
            <p className="text-xs text-[#5B6B82] mt-0.5">
              This is the {deskName} report within Skyline Demo Travels Ltd’s
              Agent Reports. Values are counted from the selected booking
              records.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.href = '/reports?tab=sub-agents'
            }}
            className="text-xs font-bold text-[#0267B8] hover:text-[#014A85] hover:bg-[#DDF0FD] h-8 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Agent Reports</span>
            <ExternalLink className="size-3" />
          </Button>
          <Link
            to="/sub-agents/details"
            search={{ tab: 'bookings' }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] hover:bg-[#DDF0FD] h-8 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <span>View All {deskName} Bookings</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </aside>

      {/* Report Filters Section */}
      <section
        id="c-flt"
        className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs space-y-4"
      >
        {/* Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F3F6]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#F4F6FA] text-[#012A5E] flex items-center justify-center">
              <Calendar className="size-4.5 text-[#0267B8]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#012A5E]">
                Report filters
              </h2>
              <p className="text-xs text-[#5B6B82]">
                Date, service and status apply to every section below and to the
                CSV export.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-[#5B6B82] bg-[#F4F6FA] border border-[#E2E8F0] self-start sm:self-auto">
            <Tag className="size-3 text-[#64748B]" />
            Sample data for design preview
          </span>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Date Range Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5B6B82]">
              Date range
            </label>
            <Select
              value={dateRange}
              onValueChange={(val) => val && setDateRange(val)}
            >
              <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E] h-10 rounded-xl">
                <SelectValue placeholder="All Demo Data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Demo Data</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="last7">Last 7 Days</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="coverage">
                  18 Dec 2026 – 14 Jan 2027
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5B6B82]">Service</label>
            <Select
              value={selectedService}
              onValueChange={(val) => val && setSelectedService(val)}
            >
              <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E] h-10 rounded-xl">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="Flight">Flight</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Travel Package">Travel Package</SelectItem>
                <SelectItem value="Activity">Activity</SelectItem>
                <SelectItem value="Car Rental">Car Rental</SelectItem>
                <SelectItem value="eSIM">eSIM</SelectItem>
                <SelectItem value="Bus / Train">Bus / Train</SelectItem>
                <SelectItem value="Travel Insurance">
                  Travel Insurance
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5B6B82]">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => val && setSelectedStatus(val)}
            >
              <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E] h-10 rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Ticketed">Ticketed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Result Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs font-medium text-[#5B6B82] border-t border-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Info className="size-3.5 text-[#0267B8]" />
            <span>
              All Demo Data · coverage{' '}
              <strong className="text-[#012A5E] font-bold">
                18 Dec 2026 – 14 Jan 2027
              </strong>
            </span>
          </div>
          <div>
            Showing{' '}
            <strong className="text-[#012A5E] font-extrabold">
              {totalBookings}
            </strong>{' '}
            bookings · 18 Dec 2026 – 14 Jan 2027
          </div>
        </div>
      </section>

      {/* Performance Summary (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Bookings */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
              <BarChart2 className="size-5" />
            </div>
            <span className="text-[11px] font-bold text-[#5B6B82]">
              Total Bookings
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#012A5E]">
              {totalBookings}
            </div>
            <div className="text-xs text-[#5B6B82] mt-0.5">
              In the selected records
            </div>
          </div>
        </div>

        {/* 2. Confirmed / Ticketed */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-[#EAFBF1] text-[#0B6A45] flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
            <span className="text-[11px] font-bold text-[#5B6B82]">
              Confirmed / Ticketed
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#012A5E]">
              {confirmedTicketedTotal}
            </div>
            <div className="text-xs text-[#5B6B82] mt-0.5">
              {confirmedCount} Confirmed · {ticketedCount} Ticketed / Issued
            </div>
          </div>
        </div>

        {/* 3. Pending */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-[#F4F6FA] text-[#64748B] flex items-center justify-center">
              <Clock className="size-5" />
            </div>
            <span className="text-[11px] font-bold text-[#5B6B82]">
              Pending
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#012A5E]">
              {pendingCount}
            </div>
            <div className="text-xs text-[#5B6B82] mt-0.5">
              Awaiting confirmation
            </div>
          </div>
        </div>

        {/* 4. Cancelled */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <XCircle className="size-5" />
            </div>
            <span className="text-[11px] font-bold text-[#5B6B82]">
              Cancelled
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#012A5E]">
              {cancelledCount}
            </div>
            <div className="text-xs text-[#5B6B82] mt-0.5">
              Shown as status only
            </div>
          </div>
        </div>
      </div>

      {/* Row 1 of Two Grids: Bookings by Service & Bookings by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bookings by Service */}
        <section
          id="c-svc"
          className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                  <Plane className="size-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#012A5E]">
                    Bookings by Service
                  </h2>
                  <p className="text-xs text-[#5B6B82]">
                    All 8 service modules
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#5B6B82] bg-[#F4F6FA] border border-[#E2E8F0]">
                <BarChart2 className="size-3 text-[#0267B8]" />
                Metric: Booking count
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {servicesList.map((svc) => {
                const IconComponent = svc.icon
                const percentage = (svc.count / 5) * 100
                return (
                  <div key={svc.id} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 w-36 shrink-0 text-[#012A5E] font-bold">
                      <IconComponent className="size-3.5 text-[#0267B8]" />
                      <span>{svc.name}</span>
                    </div>
                    <div className="flex-1 bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0267B8] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-[#5B6B82] font-semibold shrink-0">
                      {svc.count} {svc.count === 1 ? 'booking' : 'bookings'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Bookings by Status */}
        <section
          id="c-st"
          className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#EAFBF1] text-[#0B6A45] flex items-center justify-center">
                  <CheckCircle2 className="size-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#012A5E]">
                    Bookings by Status
                  </h2>
                  <p className="text-xs text-[#5B6B82]">M8 booking lifecycle</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#5B6B82] bg-[#F4F6FA] border border-[#E2E8F0]">
                <BarChart2 className="size-3 text-[#0B6A45]" />
                Metric: Booking count
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {statusList.map((st) => {
                const percentage = (st.count / 5) * 100
                return (
                  <div
                    key={st.status}
                    className="flex items-center gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 w-32 shrink-0 text-[#012A5E] font-bold">
                      <span className={`size-2 rounded-full ${st.dotColor}`} />
                      <span>{st.status}</span>
                    </div>
                    <div className="flex-1 bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${st.count > 0 ? 'bg-[#012A5E]' : 'bg-transparent'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-[#5B6B82] font-semibold shrink-0">
                      {st.count} {st.count === 1 ? 'booking' : 'bookings'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Row 2 of Two Grids: Bookings by Supplier & Operational Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bookings by Supplier */}
        <section
          id="c-sup"
          className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                  <Building2 className="size-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#012A5E]">
                    Bookings by Supplier
                  </h2>
                  <p className="text-xs text-[#5B6B82]">
                    Airlines, bedbanks, car and activity aggregators
                  </p>
                </div>
              </div>
            </div>

            <div className="my-8 py-8 px-4 rounded-xl border border-dashed border-[#DCE2EB] bg-[#F8FAFC] flex flex-col items-center justify-center text-center space-y-2.5">
              <div className="size-11 rounded-2xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                <Building2 className="size-5" />
              </div>
              <h3 className="text-xs font-bold text-[#012A5E]">
                Supplier data not available
              </h3>
              <p className="text-xs text-[#5B6B82] max-w-sm">
                Supplier information is not included in the current
                design-preview dataset.
              </p>
            </div>
          </div>
        </section>

        {/* Sub-agent Performance */}
        <section
          id="c-perf"
          className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#EAFBF1] text-[#0B6A45] flex items-center justify-center">
                  <TrendingUp className="size-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#012A5E]">
                    Sub-agent Performance
                  </h2>
                  <p className="text-xs text-[#5B6B82]">
                    Booking-derived operational summary for {deskName}
                  </p>
                </div>
              </div>
            </div>

            {/* 4x2 Metric Grid Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <div className="text-[11px] font-bold text-[#5B6B82]">
                  Total Bookings
                </div>
                <div className="text-xl font-black text-[#012A5E] mt-1">
                  {totalBookings}
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <div className="text-[11px] font-bold text-[#5B6B82]">
                  Confirmed / Ticketed
                </div>
                <div className="text-xl font-black text-[#012A5E] mt-1">
                  {confirmedTicketedTotal}
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <div className="text-[11px] font-bold text-[#5B6B82]">
                  Pending
                </div>
                <div className="text-xl font-black text-[#012A5E] mt-1">
                  {pendingCount}
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <div className="text-[11px] font-bold text-[#5B6B82]">
                  Cancelled
                </div>
                <div className="text-xl font-black text-[#012A5E] mt-1">
                  {cancelledCount}
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 col-span-2 sm:col-span-4">
                <div className="text-[11px] font-bold text-[#5B6B82]">
                  Service Coverage
                </div>
                <div className="text-base font-extrabold text-[#012A5E] mt-1">
                  {servicesUsedCount} service types used
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-[#5B6B82]">
              <Info className="size-3.5 text-[#0267B8] shrink-0" />
              <span>
                Performance values shown here are based on the currently
                selected booking records.
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Activity Section */}
      <section
        id="c-act"
        className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#EAFBF1] text-[#0B6A45] flex items-center justify-center">
              <Calendar className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#012A5E]">
                Booking Activity
              </h2>
              <p className="text-xs text-[#5B6B82]">
                The records behind this report
              </p>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-xl border border-[#DCE2EB]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F4F6FA] hover:bg-[#F4F6FA]">
                <TableHead className="text-xs font-extrabold text-[#5B6B82]">
                  Booking Reference
                </TableHead>
                <TableHead className="text-xs font-extrabold text-[#5B6B82]">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-extrabold text-[#5B6B82]">
                  Service
                </TableHead>
                <TableHead className="text-xs font-extrabold text-[#5B6B82]">
                  Travel Date
                </TableHead>
                <TableHead className="text-xs font-extrabold text-[#5B6B82]">
                  Status
                </TableHead>
                <TableHead className="text-xs font-extrabold text-[#5B6B82] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-xs text-[#5B6B82]"
                  >
                    No booking records match the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((bk) => (
                  <TableRow
                    key={bk.id}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <TableCell className="font-bold text-xs text-[#0267B8]">
                      <button
                        onClick={() => handleOpenBooking(bk)}
                        className="hover:underline cursor-pointer flex items-center gap-1 font-mono text-xs"
                      >
                        <span>{bk.ref}</span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-xs text-[#012A5E]">
                        {bk.customer}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Booked on behalf of customer
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#012A5E]">
                        {getServiceBadgeIcon(bk.service)}
                        <span>{bk.service}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#5B6B82]">
                      {bk.travelDate}
                    </TableCell>
                    <TableCell>{getStatusBadge(bk.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenBooking(bk)}
                        className="bg-white border-[#DCE2EB] text-[#012A5E] hover:bg-[#F4F6FA] text-xs font-bold h-8 rounded-lg cursor-pointer"
                      >
                        View Booking
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View All Bookings Link */}
        <div className="pt-2 text-center sm:text-left">
          <Link
            to="/sub-agents/details"
            search={{ tab: 'bookings' }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors"
          >
            <span>View All {deskName} Bookings</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </section>

      {/* Financial Summary Section */}
      <section
        id="c-fin"
        className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
              <Wallet className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#012A5E]">
                Financial Summary
              </h2>
              <p className="text-xs text-[#5B6B82]">
                Sales, commission, wallet and credit report availability
              </p>
            </div>
          </div>
        </div>

        {/* 4 Financial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sales Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#012A5E]">Sales</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#64748B]">
                  Not available
                </span>
              </div>
              <p className="text-xs text-[#5B6B82] mt-2">
                Booking amount data is not included in this design-preview
                dataset.
              </p>
            </div>
          </div>

          {/* Commissions Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#012A5E]">
                  Commissions
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#64748B]">
                  Not available
                </span>
              </div>
              <p className="text-xs text-[#5B6B82] mt-2">
                Commission amounts depend on configured commission rules and
                booking financial data.
              </p>
            </div>
          </div>

          {/* Wallet Summary Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#012A5E]">
                  Wallet Summary
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#0267B8]">
                  Parent Agent level
                </span>
              </div>
              <p className="text-xs text-[#5B6B82] mt-2">
                {deskName} bookings settle against Skyline Demo Travels Ltd’s
                wallet.
              </p>
            </div>
            <button
              onClick={() => setWalletDialogOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors mt-3 pt-2 border-t border-[#E2E8F0] cursor-pointer"
            >
              <span>View Wallet</span>
              <ArrowRight className="size-3" />
            </button>
          </div>

          {/* Credit Summary Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#012A5E]">
                  Credit Summary
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#0267B8]">
                  Parent Agent level
                </span>
              </div>
              <p className="text-xs text-[#5B6B82] mt-2">
                Available credit is managed under Skyline Demo Travels Ltd.
              </p>
            </div>
            <button
              onClick={() => setCreditDialogOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors mt-3 pt-2 border-t border-[#E2E8F0] cursor-pointer"
            >
              <span>View Credit</span>
              <ArrowRight className="size-3" />
            </button>
          </div>
        </div>

        {/* Informational Notes */}
        <div className="space-y-2 pt-2 border-t border-[#F1F3F6]">
          <div className="flex items-start gap-2 text-xs text-[#5B6B82]">
            <Info className="size-3.5 text-[#0267B8] shrink-0 mt-0.5" />
            <span>
              Financial reports will use real booking amounts and financial
              ledgers when those modules are connected. Nothing here is
              estimated from booking counts.
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-[#5B6B82]">
            <Info className="size-3.5 text-[#0267B8] shrink-0 mt-0.5" />
            <span>
              Agent Statements (M2.10) and Commission Tracking (M2.9) are
              separate screens. This page is the Sub-agent performance report
              only.
            </span>
          </div>
        </div>
      </section>
    </div>
  )

  const dialogs = (
    <>
      {/* Booking Details Slide-Over Sheet */}
      <BookingDetailsSheet
        open={isBookingSheetOpen}
        onOpenChange={setIsBookingSheetOpen}
        booking={selectedBooking}
        subAgentName={deskName}
        parentAgentName={desk.parentAgent}
      />

      {/* Wallet Information Dialog */}
      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <div className="size-11 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-2">
              <Wallet className="size-6" />
            </div>
            <DialogTitle className="text-base font-extrabold text-[#012A5E]">
              Parent Agent Wallet
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5B6B82]">
              {deskName} is configured as an internal sub-agent desk. All
              transactions settle centrally through Skyline Demo Travels Ltd’s
              wallet balance.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 my-2 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#5B6B82]">Wallet Balance:</span>
              <span className="font-extrabold text-[#012A5E]">
                BDT 1,450,000.00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5B6B82]">Reserved for Bookings:</span>
              <span className="font-extrabold text-[#012A5E]">
                BDT 98,900.00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5B6B82]">Sub-agent Access:</span>
              <span className="font-bold text-[#DC2626]">Restricted</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setWalletDialogOpen(false)}
              className="w-full bg-[#012A5E] text-white hover:bg-[#023E8A] text-xs font-bold h-9 rounded-xl cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credit Information Dialog */}
      <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <div className="size-11 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-2">
              <CreditCard className="size-6" />
            </div>
            <DialogTitle className="text-base font-extrabold text-[#012A5E]">
              Parent Agent Credit Line
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5B6B82]">
              Credit terms are managed centrally by AeroWing for Skyline Demo
              Travels Ltd.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 my-2 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#5B6B82]">Approved Credit Limit:</span>
              <span className="font-extrabold text-[#012A5E]">
                BDT 5,000,000.00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5B6B82]">Utilised Credit:</span>
              <span className="font-extrabold text-[#012A5E]">
                BDT 1,820,000.00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5B6B82]">Available Credit:</span>
              <span className="font-extrabold text-[#0B6A45]">
                BDT 3,180,000.00
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setCreditDialogOpen(false)}
              className="w-full bg-[#012A5E] text-white hover:bg-[#023E8A] text-xs font-bold h-9 rounded-xl cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )

  if (!isStandalone) {
    return (
      <div className="space-y-5">
        {mainBody}
        {dialogs}
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6FA] text-[#012A5E]">
      {/* Sidebar Navigation */}
      <AgentPortalSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        activePath="sub-agents"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          userName="Nusrat Jahan · Agent Owner"
          agencyName="Skyline Demo Travels Ltd"
        />

        <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 py-6 pb-20 space-y-5">
          {/* Back link */}
          <div>
            <Link
              to="/sub-agents/details"
              search={{ tab: 'overview' }}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors py-1 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to {deskName}</span>
            </Link>
          </div>

          {/* Page & Desk Header Banner */}
          <section className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="size-16 rounded-[18px] bg-[#F4F6FA] border border-[#D5DDE8] text-[#012A5E] font-black text-xl flex items-center justify-center shrink-0 shadow-inner">
                  {desk.initials}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0267B8] tracking-wide mb-0.5">
                    {deskName} · M2.2 Sub-agent Performance
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#012A5E] tracking-tight">
                    Performance
                  </h1>
                  <p className="text-xs text-[#5B6B82] mt-0.5">
                    Review booking activity and report data for {deskName}.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5 text-xs text-[#4F5B70]">
                    <span className="font-semibold text-[#012A5E]">
                      {deskName} · {desk.email}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#012A5E] bg-[#F1F5F9] border border-[#E2E8F0]">
                      <Building2 className="size-3 text-[#0267B8]" />
                      Parent: {desk.parentAgent}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0]">
                      <Info className="size-3 text-[#64748B]" />
                      Sample data
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Export CSV */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExportCSV}
                  className="bg-[#F1C134] text-[#012A5E] hover:bg-[#E5B52B] font-extrabold text-xs px-5 py-2.5 h-auto rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer border-b-2 border-[#D9A81E]"
                >
                  <Download className="size-4" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>
          </section>

          {/* Sub-agent Sections Tab Navigation */}
          <div className="border-b border-[#DCE2EB] flex items-center gap-1 overflow-x-auto pb-px">
            <Link
              to="/sub-agents/details"
              search={{ tab: 'overview' }}
              className="px-4 py-3 text-xs font-bold text-[#5B6B82] hover:text-[#012A5E] border-b-3 border-transparent transition-all cursor-pointer whitespace-nowrap"
            >
              Overview
            </Link>
            <Link
              to="/sub-agents/permissions"
              className="px-4 py-3 text-xs font-bold text-[#5B6B82] hover:text-[#012A5E] border-b-3 border-transparent transition-all cursor-pointer whitespace-nowrap"
            >
              Permissions
            </Link>
            <Link
              to="/sub-agents/markup"
              className="px-4 py-3 text-xs font-bold text-[#5B6B82] hover:text-[#012A5E] border-b-3 border-transparent transition-all cursor-pointer whitespace-nowrap"
            >
              Markup
            </Link>
            <Link
              to="/sub-agents/details"
              search={{ tab: 'bookings' }}
              className="px-4 py-3 text-xs font-bold text-[#5B6B82] hover:text-[#012A5E] border-b-3 border-transparent transition-all cursor-pointer whitespace-nowrap"
            >
              Bookings
            </Link>
            <button className="px-4 py-3 text-xs font-extrabold text-[#012A5E] border-b-3 border-[#F1C134] transition-all cursor-pointer whitespace-nowrap">
              Performance
            </button>
          </div>

          {/* Page Body */}
          {mainBody}

          {/* Footer Banner */}
          <footer className="pt-6 pb-4 border-t border-[#DCE2EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5B6B82]">
            <div>
              AeroWing Agent Portal · M2.2 Sub-agent Hierarchy + M2.12 Agent
              Reports · Sub-agent Performance
            </div>
            <div>
              Website only · design prototype — no analytics, financial or
              export service is called.
            </div>
          </footer>
        </main>
      </div>

      {dialogs}
    </div>
  )
}

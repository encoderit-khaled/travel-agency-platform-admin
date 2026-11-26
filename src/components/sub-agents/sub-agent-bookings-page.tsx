import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  ArrowLeft,
  Wallet,
  Plane,
  Building,
  Package,
  Compass,
  Car,
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  FileCheck2,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Mail,
  Users,
  Building2,
} from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  AgentPortalSidebar,
  AgentPortalHeader,
} from '#/components/agent-portal'
import { BookingDetailsSheet } from './booking-details-sheet'
import { MIRPUR_DESK_DETAILS, SUB_AGENT_BOOKINGS } from './data'
import type { SubAgentBookingRecord, BookingServiceType } from './types'

export interface SubAgentBookingsPageProps {
  initialBookingRef?: string
  initialTab?:
    'overview' | 'permissions' | 'markup' | 'bookings' | 'performance'
  isStandalone?: boolean
}

function getServiceIcon(service: BookingServiceType) {
  switch (service) {
    case 'Flight':
      return <Plane className="size-4 text-[#0267B8]" />
    case 'Hotel':
      return <Building className="size-4 text-[#0267B8]" />
    case 'Travel Package':
      return <Package className="size-4 text-[#0267B8]" />
    case 'Activity':
      return <Compass className="size-4 text-[#0267B8]" />
    case 'Car Rental':
      return <Car className="size-4 text-[#0267B8]" />
    default:
      return <Ticket className="size-4 text-[#0267B8]" />
  }
}

export function SubAgentBookingsPage({
  initialBookingRef,
  initialTab = 'bookings',
  isStandalone = true,
}: SubAgentBookingsPageProps) {
  const isContentLoading = useContentLoading()
  const navigate = useNavigate()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [_activeTab, setActiveTab] = React.useState<
    'overview' | 'permissions' | 'markup' | 'bookings' | 'performance'
  >(initialTab)

  const desk = MIRPUR_DESK_DETAILS
  const allBookings = SUB_AGENT_BOOKINGS

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedService, setSelectedService] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [selectedTravelDate, setSelectedTravelDate] =
    React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('oldest')
  const [statusChipFilter, setStatusChipFilter] = React.useState<string | null>(
    null,
  )

  // Booking details slide-over state
  const [selectedBooking, setSelectedBooking] =
    React.useState<SubAgentBookingRecord | null>(
      initialBookingRef
        ? allBookings.find((b) => b.ref === initialBookingRef) || null
        : null,
    )
  const [isBookingSheetOpen, setIsBookingSheetOpen] = React.useState(
    Boolean(initialBookingRef),
  )

  const handleOpenBooking = (bk: SubAgentBookingRecord) => {
    setSelectedBooking(bk)
    setIsBookingSheetOpen(true)
  }

  const bookingColumns = React.useMemo<ColumnDef<SubAgentBookingRecord>[]>(
    () => [
      {
        accessorKey: 'ref',
        header: 'Booking Reference',
        cell: ({ row }) => {
          const bk = row.original
          return (
            <Button variant="plain"
              onClick={() => handleOpenBooking(bk)}
              className="font-mono text-xs font-extrabold text-[#0267B8] hover:text-[#014A85] hover:underline cursor-pointer block text-left"
            >
              {bk.ref}
            </Button>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3.5 pl-6 min-w-45',
          cellClassName: 'py-4 pl-6',
        },
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <>
            <div className="text-xs font-extrabold text-[#012A5E]">
              {row.original.customer}
            </div>
            <div className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
              <Users className="size-3 text-[#94A3B8]" />
              <span>Booked on behalf of customer</span>
            </div>
          </>
        ),
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3.5 min-w-55',
          cellClassName: 'py-4',
        },
      },
      {
        accessorKey: 'service',
        header: 'Service',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs font-bold text-[#012A5E]">
            {getServiceIcon(row.original.service)}
            <span>{row.original.service}</span>
          </div>
        ),
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3.5 min-w-37.5',
          cellClassName: 'py-4',
        },
      },
      {
        accessorKey: 'travelDate',
        header: 'Travel / Service Date',
        cell: ({ row }) => row.original.travelDate,
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3.5 min-w-45',
          cellClassName: 'py-4 text-xs font-semibold text-[#4F5B70]',
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const bk = row.original
          return (
            <>
              {bk.status === 'Ticketed' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
                  <CheckCircle2 className="size-3" />
                  Ticketed
                </span>
              )}
              {bk.status === 'Confirmed' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
                  <CheckCircle2 className="size-3" />
                  Confirmed
                </span>
              )}
              {bk.status === 'Pending' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF6E7] text-[#9A6400] border border-amber-200">
                  <Clock className="size-3" />
                  Pending
                </span>
              )}
              {bk.status === 'Cancelled' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F3F6] text-[#64748B] border border-slate-200">
                  <XCircle className="size-3" />
                  Cancelled
                </span>
              )}
            </>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3.5 min-w-32.5',
          cellClassName: 'py-4',
        },
      },
      {
        accessorKey: 'documentStatus',
        header: 'Documents',
        cell: ({ row }) => {
          const bk = row.original
          return (
            <div className="space-y-1">
              {bk.documentStatus === 'E-ticket available' ? (
                <>
                  <div className="text-xs font-bold text-[#0B6A45] flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>E-ticket available</span>
                  </div>
                  <Button variant="plain"
                    onClick={() => handleOpenBooking(bk)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0267B8] hover:text-[#014A85] hover:underline cursor-pointer"
                  >
                    <span>View E-ticket</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </>
              ) : bk.documentStatus === 'Voucher available' ? (
                <>
                  <div className="text-xs font-bold text-[#0B6A45] flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Voucher available</span>
                  </div>
                  <Button variant="plain"
                    onClick={() => handleOpenBooking(bk)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0267B8] hover:text-[#014A85] hover:underline cursor-pointer"
                  >
                    <span>View Voucher</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </>
              ) : (
                <span className="text-xs text-[#8C9BAE]">
                  {bk.documentStatus}
                </span>
              )}
            </div>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3.5 min-w-45',
          cellClassName: 'py-4',
        },
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          const bk = row.original
          return (
            <Button
              onClick={() => handleOpenBooking(bk)}
              variant="outline"
              size="sm"
              className="border-[#DCE2EB] text-[#012A5E] hover:bg-[#EAF4FD] hover:text-[#0267B8] font-bold text-xs h-8 px-3 rounded-lg gap-1.5 cursor-pointer bg-white"
            >
              <Eye className="size-3.5" />
              <span>View Booking</span>
            </Button>
          )
        },
        meta: {
          headerClassName:
            'text-right text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3.5 pr-6 min-w-35',
          cellClassName: 'py-4 text-right pr-6',
        },
      },
    ],
    [handleOpenBooking],
  )

  // Counts for status pills matching Figma
  const counts = React.useMemo(() => {
    return {
      pending: allBookings.filter((b) => b.status === 'Pending').length,
      confirmed: allBookings.filter((b) => b.status === 'Confirmed').length,
      ticketed: allBookings.filter((b) => b.status === 'Ticketed').length,
      cancelled: allBookings.filter((b) => b.status === 'Cancelled').length,
      refunded: 0,
      failed: 0,
      total: allBookings.length,
      upcoming: allBookings.filter((b) => b.status !== 'Cancelled').length,
      docsAvailable: allBookings.filter(
        (b) =>
          b.documentStatus === 'E-ticket available' ||
          b.documentStatus === 'Voucher available',
      ).length,
      attention: allBookings.filter((b) => b.status === 'Pending').length,
    }
  }, [allBookings])

  // Filtered & Sorted bookings
  const filteredBookings = React.useMemo(() => {
    let list = [...allBookings]

    // Chip filter
    if (statusChipFilter) {
      if (statusChipFilter === 'Pending') {
        list = list.filter((b) => b.status === 'Pending')
      } else if (statusChipFilter === 'Confirmed') {
        list = list.filter((b) => b.status === 'Confirmed')
      } else if (statusChipFilter === 'Ticketed') {
        list = list.filter((b) => b.status === 'Ticketed')
      } else if (statusChipFilter === 'Cancelled') {
        list = list.filter((b) => b.status === 'Cancelled')
      } else if (statusChipFilter === 'Refunded') {
        list = []
      } else if (statusChipFilter === 'Failed') {
        list = []
      }
    }

    // Dropdown status filter
    if (selectedStatus !== 'all') {
      list = list.filter(
        (b) => b.status.toLowerCase() === selectedStatus.toLowerCase(),
      )
    }

    // Dropdown service filter
    if (selectedService !== 'all') {
      list = list.filter(
        (b) => b.service.toLowerCase() === selectedService.toLowerCase(),
      )
    }

    // Text search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (b) =>
          b.ref.toLowerCase().includes(q) ||
          b.customer.toLowerCase().includes(q) ||
          b.service.toLowerCase().includes(q) ||
          (b.routeOrItem && b.routeOrItem.toLowerCase().includes(q)) ||
          (b.pnr && b.pnr.toLowerCase().includes(q)),
      )
    }

    // Sort order
    if (sortBy === 'oldest') {
      // By default Figma has oldest travel date first (18 Dec 2026 -> 14 Jan 2027)
      return list
    } else if (sortBy === 'newest') {
      return list.reverse()
    } else if (sortBy === 'ref') {
      return list.sort((a, b) => a.ref.localeCompare(b.ref))
    }

    return list
  }, [
    allBookings,
    statusChipFilter,
    selectedStatus,
    selectedService,
    searchQuery,
    sortBy,
  ])

  const handleTabClick = (
    tabId: 'overview' | 'permissions' | 'markup' | 'bookings' | 'performance',
  ) => {
    setActiveTab(tabId)
    if (tabId === 'permissions') {
      navigate({ to: '/sub-agents/permissions' })
    } else if (tabId === 'overview') {
      navigate({ to: '/sub-agents/details', search: { tab: 'overview' } })
    } else if (tabId === 'markup') {
      navigate({ to: '/sub-agents/details', search: { tab: 'markup' } })
    } else if (tabId === 'performance') {
      navigate({ to: '/sub-agents/details', search: { tab: 'performance' } })
    } else {
      navigate({ to: '/sub-agents/details', search: { tab: 'bookings' } })
    }
  }

  const content = (
    <div className="space-y-6">
      {isStandalone && (
        <>
          {/* Back button */}
          <div className="flex items-center">
            <Link
              to="/sub-agents/details"
              search={{ tab: 'overview' }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors group cursor-pointer"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Mirpur Desk</span>
            </Link>
          </div>

          {/* Desk Identification Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs">
            <div className="flex items-start gap-4">
              <div className="size-13 rounded-2xl bg-[#EAF4FD] text-[#0267B8] font-black text-xl flex items-center justify-center shrink-0 border border-[#D0E1FD] shadow-xs">
                {desk.initials}
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0267B8]">
                  {desk.displayName} · M2.2 Sub-agent Bookings
                </div>
                <h1 className="text-2xl font-black text-[#012A5E] tracking-tight">
                  Bookings
                </h1>
                <p className="text-xs text-[#64748B]">
                  View bookings created by {desk.displayName}, including
                  bookings made on behalf of customers.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1 font-semibold text-[#012A5E]">
                    <Mail className="size-3 text-[#0267B8]" />
                    {desk.displayName} · {desk.email}
                  </span>
                  <span className="text-[#CBD5E1]">·</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#475569]">
                    {desk.role}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#0267B8] border border-[#BFDBFE]">
                    Sample data
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-agent Navigation Tabs */}
          <div className="border-b border-[#DCE2EB] flex items-center gap-2 overflow-x-auto pb-px">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'permissions', label: 'Permissions' },
              { id: 'markup', label: 'Markup' },
              { id: 'bookings', label: `Bookings (${allBookings.length})` },
              { id: 'performance', label: 'Performance' },
            ].map((tab) => (
              <Button variant="plain"
                key={tab.id}
                onClick={() => handleTabClick(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold transition-all relative border-b-2 cursor-pointer whitespace-nowrap ${
                  tab.id === 'bookings'
                    ? 'border-[#012A5E] text-[#012A5E]'
                    : 'border-transparent text-[#64748B] hover:text-[#012A5E] hover:border-[#CBD5E1]'
                }`)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </>
      )}

      {/* Context Banners (Sub-agent booking view & Booking settlement) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Banner: Sub-agent booking view */}
        <div className="lg:col-span-7 bg-[#F0F6FE] border border-[#D0E1FD] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="size-10 rounded-xl bg-white text-[#0267B8] flex items-center justify-center shrink-0 border border-[#BFDBFE] shadow-2xs">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#012A5E]">
                Sub-agent booking view
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                This is the Mirpur Desk view of Skyline Demo Travels Ltd’s Agent
                Booking History.
              </p>
            </div>
          </div>
          <Link
            to="/agent-dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] hover:underline whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
          >
            <span>View All Agent Bookings</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Right Banner: Booking settlement */}
        <div className="lg:col-span-5 bg-white border border-[#DCE2EB] rounded-2xl p-4 flex items-start sm:items-center gap-3 shadow-2xs">
          <div className="size-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 border border-[#DCFCE7] shadow-2xs">
            <Wallet className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#012A5E]">
              Booking settlement
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Bookings created by Mirpur Desk are settled against Skyline Demo
              Travels Ltd’s wallet and available credit.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Summary 4 KPI Cards */}
      {isContentLoading ? (
        <CardGridSkeleton
          count={4}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          cardClassName="h-28 rounded-2xl"
        />
      ) : null}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isContentLoading ? "hidden" : ""}`}>
        {/* Card 1: Total Bookings */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-4 shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center shrink-0">
              <Calendar className="size-4.5" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Total Bookings
            </div>
          </div>
          <div className="text-2xl font-black text-[#012A5E] mt-3">
            {counts.total}
          </div>
          <div className="text-xs text-[#64748B] mt-0.5">
            Created by Mirpur Desk
          </div>
        </div>

        {/* Card 2: Upcoming / Active */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-4 shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#EFF6FE] text-[#2563EB] flex items-center justify-center shrink-0">
              <Clock className="size-4.5" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Upcoming / Active
            </div>
          </div>
          <div className="text-2xl font-black text-[#012A5E] mt-3">
            {counts.upcoming}
          </div>
          <div className="text-xs text-[#64748B] mt-0.5">
            Travel from 15 Nov 2026, not cancelled
          </div>
        </div>

        {/* Card 3: Documents Available */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-4 shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <FileCheck2 className="size-4.5" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Documents Available
            </div>
          </div>
          <div className="text-2xl font-black text-[#012A5E] mt-3">
            {counts.docsAvailable}
          </div>
          <div className="text-xs text-[#64748B] mt-0.5">
            E-tickets and vouchers ready
          </div>
        </div>

        {/* Card 4: Needs Attention */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-4 shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#FEF6E7] text-[#D97706] flex items-center justify-center shrink-0">
              <AlertCircle className="size-4.5" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Needs Attention
            </div>
          </div>
          <div className="text-2xl font-black text-[#012A5E] mt-3">
            {counts.attention}
          </div>
          <div className="text-xs text-[#64748B] mt-0.5">
            Pending or failed bookings
          </div>
        </div>
      </div>

      {/* Main Section: Bookings by Mirpur Desk */}
      <div className="bg-white rounded-2xl border border-[#DCE2EB] shadow-2xs overflow-hidden">
        {/* Section Header */}
        <div className="p-5 md:p-6 border-b border-[#F1F3F6] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center shrink-0 border border-[#D0E1FD]">
              <Ticket className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#012A5E]">
                Bookings by Mirpur Desk
              </h2>
              <p className="text-xs text-[#64748B]">
                Including bookings made on behalf of customers
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] self-start md:self-auto">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sample data for design preview
          </span>
        </div>

        {/* Filter by status pills */}
        <div className="px-5 md:px-6 pt-4 pb-2 border-b border-[#F1F3F6] flex items-center gap-2 overflow-x-auto">
          <Button variant="plain"
            onClick={() => setStatusChipFilter(null)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              statusChipFilter === null
                ? 'bg-[#012A5E] text-white border-[#012A5E]'
                : 'bg-white text-[#475569] border-[#DCE2EB] hover:bg-[#F8FAFC]'
            }`)}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusChipFilter === null
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              {counts.total}
            </span>
          </Button>

          <Button variant="plain"
            onClick={() =>
              setStatusChipFilter(
                statusChipFilter === 'Pending' ? null : 'Pending',
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              statusChipFilter === 'Pending'
                ? 'bg-[#012A5E] text-white border-[#012A5E]'
                : 'bg-white text-[#475569] border-[#DCE2EB] hover:bg-[#F8FAFC]'
            }`)}
          >
            <span>Pending</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusChipFilter === 'Pending'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              {counts.pending}
            </span>
          </Button>

          <Button variant="plain"
            onClick={() =>
              setStatusChipFilter(
                statusChipFilter === 'Confirmed' ? null : 'Confirmed',
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              statusChipFilter === 'Confirmed'
                ? 'bg-[#012A5E] text-white border-[#012A5E]'
                : 'bg-white text-[#475569] border-[#DCE2EB] hover:bg-[#F8FAFC]'
            }`)}
          >
            <span>Confirmed</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusChipFilter === 'Confirmed'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              {counts.confirmed}
            </span>
          </Button>

          <Button variant="plain"
            onClick={() =>
              setStatusChipFilter(
                statusChipFilter === 'Ticketed' ? null : 'Ticketed',
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              statusChipFilter === 'Ticketed'
                ? 'bg-[#012A5E] text-white border-[#012A5E]'
                : 'bg-white text-[#475569] border-[#DCE2EB] hover:bg-[#F8FAFC]'
            }`)}
          >
            <span>Ticketed / Issued</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusChipFilter === 'Ticketed'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              {counts.ticketed}
            </span>
          </Button>

          <Button variant="plain"
            onClick={() =>
              setStatusChipFilter(
                statusChipFilter === 'Cancelled' ? null : 'Cancelled',
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              statusChipFilter === 'Cancelled'
                ? 'bg-[#012A5E] text-white border-[#012A5E]'
                : 'bg-white text-[#475569] border-[#DCE2EB] hover:bg-[#F8FAFC]'
            }`)}
          >
            <span>Cancelled</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusChipFilter === 'Cancelled'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              {counts.cancelled}
            </span>
          </Button>

          <Button variant="plain"
            onClick={() =>
              setStatusChipFilter(
                statusChipFilter === 'Refunded' ? null : 'Refunded',
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border opacity-60 cursor-pointer ${
              statusChipFilter === 'Refunded'
                ? 'bg-[#012A5E] text-white border-[#012A5E]'
                : 'bg-white text-[#475569] border-[#DCE2EB] hover:bg-[#F8FAFC]'
            }`)}
          >
            <span>Refunded</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]">
              {counts.refunded}
            </span>
          </Button>

          <Button variant="plain"
            onClick={() =>
              setStatusChipFilter(
                statusChipFilter === 'Failed' ? null : 'Failed',
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border opacity-60 cursor-pointer ${
              statusChipFilter === 'Failed'
                ? 'bg-[#012A5E] text-white border-[#012A5E]'
                : 'bg-white text-[#475569] border-[#DCE2EB] hover:bg-[#F8FAFC]'
            }`)}
          >
            <span>Failed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]">
              {counts.failed}
            </span>
          </Button>
        </div>

        {/* Search and filter controls grid (5 columns matching Figma #694:7359) */}
        <div className="p-5 md:p-6 bg-[#FAFBFD] border-b border-[#F1F3F6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search bookings */}
          <div className="lg:col-span-4 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8C9BAE]" />
              <Input
                type="text"
                placeholder="Search bookings by ref, customer, PNR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs bg-white border-[#DCE2EB] text-[#012A5E] rounded-lg focus-visible:ring-1 focus-visible:ring-[#0267B8]"
              />
              {searchQuery && (
                <Button variant="plain"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Service filter */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Service
            </label>
            <Select
              value={selectedService}
              items={{
                all: 'All Services',
                flight: 'Flight',
                hotel: 'Hotel',
                'travel package': 'Travel Package',
                activity: 'Activity',
                'car rental': 'Car Rental',
              }}
              onValueChange={(val) => {
                if (val) setSelectedService(val)
              }}
            >
              <SelectTrigger className="w-full h-9 rounded-lg bg-white border-[#DCE2EB] text-xs font-medium text-[#012A5E]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="travel package">Travel Package</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="car rental">Car Rental</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Status
            </label>
            <Select
              value={selectedStatus}
              items={{
                all: 'All Statuses',
                ticketed: 'Ticketed',
                confirmed: 'Confirmed',
                pending: 'Pending',
                cancelled: 'Cancelled',
              }}
              onValueChange={(val) => {
                if (val) setSelectedStatus(val)
              }}
            >
              <SelectTrigger className="w-full h-9 rounded-lg bg-white border-[#DCE2EB] text-xs font-medium text-[#012A5E]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ticketed">Ticketed</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Travel date */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Travel date
            </label>
            <Select
              value={selectedTravelDate}
              items={{
                all: 'All dates',
                upcoming: 'Upcoming',
                '30days': 'Next 30 days',
                thisyear: 'This year (2026-2027)',
              }}
              onValueChange={(val) => {
                if (val) setSelectedTravelDate(val)
              }}
            >
              <SelectTrigger className="w-full h-9 rounded-lg bg-white border-[#DCE2EB] text-xs font-medium text-[#012A5E]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="30days">Next 30 days</SelectItem>
                <SelectItem value="thisyear">This year (2026-2027)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Sort by
            </label>
            <Select
              value={sortBy}
              items={{
                oldest: 'Oldest travel date',
                newest: 'Newest travel date',
                ref: 'Booking reference',
              }}
              onValueChange={(val) => {
                if (val) setSortBy(val)
              }}
            >
              <SelectTrigger className="w-full h-9 rounded-lg bg-white border-[#DCE2EB] text-xs font-medium text-[#012A5E]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oldest">Oldest travel date</SelectItem>
                <SelectItem value="newest">Newest travel date</SelectItem>
                <SelectItem value="ref">Booking reference</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic summary count */}
        <div className="px-5 md:px-6 py-3 border-b border-[#F1F3F6] flex items-center justify-between text-xs text-[#64748B] bg-white">
          <div>
            Showing{' '}
            <strong className="font-extrabold text-[#012A5E]">
              {filteredBookings.length}
            </strong>{' '}
            of{' '}
            <strong className="font-extrabold text-[#012A5E]">
              {allBookings.length}
            </strong>{' '}
            bookings
          </div>
          {(searchQuery ||
            selectedService !== 'all' ||
            selectedStatus !== 'all' ||
            statusChipFilter) && (
            <Button variant="plain"
              onClick={() => {
                setSearchQuery('')
                setSelectedService('all')
                setSelectedStatus('all')
                setStatusChipFilter(null)
              }}
              className="text-xs font-bold text-[#0267B8] hover:underline cursor-pointer"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <DataTable
            data={filteredBookings}
            columns={bookingColumns}
            getRowId={(row) => row.id}
            headerClassName="bg-[#F4F7FB]"
            headerRowClassName="border-[#E6EAF0] hover:bg-[#F8FAFC]"
            rowClassName="hover:bg-[#F8FAFC] border-[#E6EAF0] transition-colors"
            emptyCellClassName="py-12 text-center"
            empty={
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Search className="size-5" />
                </div>
                <div className="text-sm font-bold text-[#012A5E]">
                  No bookings match your filters
                </div>
                <div className="text-xs text-[#64748B]">
                  Try searching with different terms or reset your filters.
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedService('all')
                    setSelectedStatus('all')
                    setStatusChipFilter(null)
                  }}
                  className="mt-2 text-xs font-bold text-[#0267B8] border-[#DCE2EB]"
                >
                  Reset All Filters
                </Button>
              </div>
            }
          />
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#F1F3F6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] bg-white">
          <div>Page 1 of 1 · {filteredBookings.length} bookings</div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="size-8 p-0 border-[#DCE2EB] text-[#8C9BAE] rounded-lg"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="size-8 p-0 bg-[#012A5E] text-white hover:bg-[#023E8A] font-bold text-xs rounded-lg"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="size-8 p-0 border-[#DCE2EB] text-[#8C9BAE] rounded-lg"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Details Sheet */}
      <BookingDetailsSheet
        open={isBookingSheetOpen}
        onOpenChange={setIsBookingSheetOpen}
        booking={selectedBooking}
        subAgentName={desk.displayName}
        parentAgentName={desk.parentAgent}
      />
    </div>
  )

  if (!isStandalone) {
    return content
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6FA] text-[#012A5E]">
      {/* Sidebar Navigation */}
      <AgentPortalSidebar
        mobileOpen={mobileSidebarOpen}
        activePath="/sub-agents"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AgentPortalHeader
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          userName="Nusrat Jahan"
          agencyName="Skyline Demo Travels Ltd"
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {content}
        </main>

        {/* Page Footer matching Figma #694:7632 */}
        <footer className="bg-white border-t border-[#E2E8F0] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>
            AeroWing Agent Portal · M2.2 Sub-agent Hierarchy + M2.11 Agent
            Booking History · Sub-agent Bookings
          </span>
          <span>
            Website only · design prototype — no booking, document, cancellation
            or refund system is called.
          </span>
        </footer>
      </div>
    </div>
  )
}

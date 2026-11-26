import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Search,
  Ticket,
  Plane,
  Building,
  Package,
  Compass,
  Car,
  Bus,
  Wifi,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  FileCheck2,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  X,
  Plus,
} from 'lucide-react'
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { AGENT_BOOKING_HISTORY_DATA } from './booking-history-data'
import type {
  AgentBookingItem,
  BookingServiceType,
  BookingStatus,
} from './booking-history-data'

export interface AgentBookingHistoryPageProps {
  initialBookingRef?: string
  initialNodeId?: string
  initialStatusFilter?: string
  initialServiceFilter?: string
}

export function AgentBookingHistoryPage({
  initialBookingRef,
  initialNodeId,
  initialStatusFilter,
  initialServiceFilter,
}: AgentBookingHistoryPageProps) {
  const isContentLoading = useContentLoading()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusChipFilter, setStatusChipFilter] = React.useState<string | null>(
    initialStatusFilter || null,
  )
  const [sourceFilter, setSourceFilter] = React.useState<string>('all')
  const [createdByFilter, setCreatedByFilter] = React.useState<string>('all')
  const [serviceFilter, setServiceFilter] = React.useState<string>(
    initialServiceFilter || 'all',
  )
  const [statusDropdownFilter, setStatusDropdownFilter] =
    React.useState<string>('all')
  const [dateFilter, setDateFilter] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('soonest')

  // Selected Booking for Slide-over
  const [selectedBooking, setSelectedBooking] =
    React.useState<AgentBookingItem | null>(() => {
      const targetRef =
        initialBookingRef ||
        (initialNodeId === '706-17471' || initialNodeId === '706:17471'
          ? 'AW-DEMO-FL-001'
          : undefined)
      if (targetRef) {
        return (
          AGENT_BOOKING_HISTORY_DATA.find(
            (b) => b.ref.toLowerCase() === targetRef.toLowerCase(),
          ) || null
        )
      }
      return null
    })

  // Selected Document for Modal Preview
  const [previewDocument, setPreviewDocument] =
    React.useState<AgentBookingItem | null>(() => {
      if (initialNodeId === '707-19883' || initialNodeId === '707:19883') {
        return (
          AGENT_BOOKING_HISTORY_DATA.find((b) => b.ref === 'AW-DEMO-FL-001') ||
          null
        )
      }
      return null
    })

  // New Booking Dialog
  const [newBookingModalOpen, setNewBookingModalOpen] = React.useState(false)

  // KPI Metrics Calculation
  const totalBookingsCount = AGENT_BOOKING_HISTORY_DATA.length // 12
  const parentAgentCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.createdBySource === 'Parent Agent',
  ).length // 4
  const subAgentCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.createdBySource === 'Sub-agent',
  ).length // 8
  const documentsAvailableCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) =>
      b.documentStatus === 'Voucher available' ||
      b.documentStatus === 'E-ticket available' ||
      b.documentStatus === 'Voucher / document available',
  ).length // 7
  const needsAttentionCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.status === 'Pending' || b.status === 'Failed',
  ).length // 2

  // Status Chip Counts
  const pendingCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.status === 'Pending',
  ).length // 1
  const confirmedCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.status === 'Confirmed',
  ).length // 4
  const ticketedIssuedCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.status === 'Ticketed' || b.status === 'Issued',
  ).length // 4
  const cancelledCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.status === 'Cancelled',
  ).length // 1
  const refundedCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.status === 'Refunded',
  ).length // 1
  const failedCount = AGENT_BOOKING_HISTORY_DATA.filter(
    (b) => b.status === 'Failed',
  ).length // 1

  // Filtered Bookings
  const filteredBookings = React.useMemo(() => {
    return AGENT_BOOKING_HISTORY_DATA.filter((b) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesRef = b.ref.toLowerCase().includes(q)
        const matchesCustomer = b.customer.toLowerCase().includes(q)
        const matchesService = b.service.toLowerCase().includes(q)
        const matchesCreatedBy = b.createdByName.toLowerCase().includes(q)
        const matchesPnr = b.pnr.toLowerCase().includes(q)
        const matchesRoute = b.routeOrItem.toLowerCase().includes(q)
        if (
          !matchesRef &&
          !matchesCustomer &&
          !matchesService &&
          !matchesCreatedBy &&
          !matchesPnr &&
          !matchesRoute
        ) {
          return false
        }
      }

      // Status Chip Filter
      if (statusChipFilter) {
        if (statusChipFilter === 'pending' && b.status !== 'Pending')
          return false
        if (statusChipFilter === 'confirmed' && b.status !== 'Confirmed')
          return false
        if (
          statusChipFilter === 'ticketed_issued' &&
          b.status !== 'Ticketed' &&
          b.status !== 'Issued'
        )
          return false
        if (statusChipFilter === 'cancelled' && b.status !== 'Cancelled')
          return false
        if (statusChipFilter === 'refunded' && b.status !== 'Refunded')
          return false
        if (statusChipFilter === 'failed' && b.status !== 'Failed') return false
      }

      // Source Filter
      if (sourceFilter === 'parent' && b.createdBySource !== 'Parent Agent') {
        return false
      }
      if (sourceFilter === 'subagent' && b.createdBySource !== 'Sub-agent') {
        return false
      }

      // Created By Filter
      if (createdByFilter !== 'all' && b.createdByName !== createdByFilter) {
        return false
      }

      // Service Filter
      if (serviceFilter !== 'all' && b.service !== serviceFilter) {
        return false
      }

      // Status Dropdown Filter
      if (
        statusDropdownFilter !== 'all' &&
        b.status.toLowerCase() !== statusDropdownFilter.toLowerCase()
      ) {
        return false
      }

      // Date Filter
      if (dateFilter === 'dec_2026' && !b.travelDate.includes('Dec 2026')) {
        return false
      }
      if (dateFilter === 'jan_2027' && !b.travelDate.includes('Jan 2027')) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'soonest') {
        return a.id.localeCompare(b.id, undefined, { numeric: true })
      }
      if (sortBy === 'latest') {
        return b.id.localeCompare(a.id, undefined, { numeric: true })
      }
      if (sortBy === 'ref') {
        return a.ref.localeCompare(b.ref)
      }
      if (sortBy === 'customer') {
        return a.customer.localeCompare(b.customer)
      }
      return 0
    })
  }, [
    searchQuery,
    statusChipFilter,
    sourceFilter,
    createdByFilter,
    serviceFilter,
    statusDropdownFilter,
    dateFilter,
    sortBy,
  ])

  const hasActiveFilters =
    searchQuery !== '' ||
    statusChipFilter !== null ||
    sourceFilter !== 'all' ||
    createdByFilter !== 'all' ||
    serviceFilter !== 'all' ||
    statusDropdownFilter !== 'all' ||
    dateFilter !== 'all' ||
    sortBy !== 'soonest'

  const resetFilters = () => {
    setSearchQuery('')
    setStatusChipFilter(null)
    setSourceFilter('all')
    setCreatedByFilter('all')
    setServiceFilter('all')
    setStatusDropdownFilter('all')
    setDateFilter('all')
    setSortBy('soonest')
  }

  const renderServiceIcon = (service: BookingServiceType) => {
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
      case 'Bus / Train':
        return <Bus className="size-4 text-[#0267B8]" />
      case 'eSIM':
        return <Wifi className="size-4 text-[#0267B8]" />
      case 'Travel Insurance':
        return <Shield className="size-4 text-[#0267B8]" />
      default:
        return <Ticket className="size-4 text-[#0267B8]" />
    }
  }

  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
            <CheckCircle2 className="size-3.5 text-[#0B6A45]" />
            Confirmed
          </span>
        )
      case 'Ticketed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
            <Ticket className="size-3.5 text-[#0B6A45]" />
            Ticketed
          </span>
        )
      case 'Issued':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
            <CheckCircle2 className="size-3.5 text-[#0B6A45]" />
            Issued
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF6E7] text-[#9A6400] border border-amber-200">
            <Clock className="size-3.5 text-[#9A6400]" />
            Pending
          </span>
        )
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F3F6] text-[#4F5B70] border border-slate-200">
            <RotateCcw className="size-3.5 text-[#4F5B70]" />
            Refunded
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F3F6] text-[#64748B] border border-slate-200">
            <XCircle className="size-3.5 text-[#64748B]" />
            Cancelled
          </span>
        )
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF2F2] text-[#DC2626] border border-rose-200">
            <AlertTriangle className="size-3.5 text-[#DC2626]" />
            Failed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        )
    }
  }

  const renderCreatedByBadge = (
    name: string,
    source: 'Parent Agent' | 'Sub-agent',
  ) => {
    const isParent = source === 'Parent Agent'
    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-sm text-[#012A5E] leading-tight">
          {name}
        </span>
        <div>
          {isParent ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[11px] font-semibold bg-[#EEF4FF] text-[#0267B8] border border-blue-200">
              <Building2 className="size-3" />
              Parent Agent
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[11px] font-semibold bg-[#F5F3FF] text-[#7C3AED] border border-purple-200">
              <Users className="size-3" />
              Sub-agent
            </span>
          )}
        </div>
      </div>
    )
  }

  const renderDocumentCell = (booking: AgentBookingItem) => {
    const isVoucher = booking.documentStatus.includes('Voucher')
    const isEticket = booking.documentStatus.includes('E-ticket')
    const isDoc = booking.documentStatus.includes('document')

    if (isVoucher || isEticket || isDoc) {
      let buttonText = 'View Voucher'
      if (isEticket) buttonText = 'View E-ticket'
      else if (booking.ref === 'AW-DEMO-TI-010') buttonText = 'View Document'

      return (
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-semibold text-[#0B6A45] flex items-center gap-1">
            <CheckCircle2 className="size-3.5 text-[#0B6A45]" />
            {booking.documentStatus}
          </span>
          <Button variant="plain"
            type="button"
            onClick={() => setPreviewDocument(booking)}
            className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            {buttonText}
            <ArrowRight className="size-3" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <span className="size-1.5 rounded-full bg-slate-300 inline-block" />
        <span>{booking.documentStatus}</span>
      </div>
    )
  }

  const columns = React.useMemo<ColumnDef<AgentBookingItem>[]>(
    () => [
      {
        accessorKey: 'ref',
        header: 'Booking Reference',
        cell: ({ row }) => {
          const booking = row.original
          return (
            <Button variant="plain"
              type="button"
              onClick={() => setSelectedBooking(booking)}
              className="text-[#0267B8] hover:text-[#012A5E] hover:underline cursor-pointer transition-colors"
            >
              {booking.ref}
            </Button>
          )
        },
        meta: {
          headerClassName:
            'w-42.5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5 pl-6',
          cellClassName: 'py-4 pl-6 align-middle font-mono text-sm font-bold',
        },
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm text-[#0F172A]">
              {row.original.customer}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
              <span className="size-1.5 rounded-full bg-slate-300 inline-block" />
              On behalf
            </span>
          </div>
        ),
        meta: {
          headerClassName:
            'w-42.5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-middle',
        },
      },
      {
        accessorKey: 'service',
        header: 'Service',
        cell: ({ row }) => {
          const booking = row.original
          return (
            <div className="flex items-center gap-2 text-sm font-semibold text-[#012A5E]">
              {renderServiceIcon(booking.service)}
              <span>{booking.service}</span>
            </div>
          )
        },
        meta: {
          headerClassName:
            'w-38.75 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-middle',
        },
      },
      {
        accessorKey: 'travelDate',
        header: 'Travel / Service Date',
        cell: ({ row }) => row.original.travelDate,
        meta: {
          headerClassName:
            'w-42.5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName:
            'py-4 align-middle text-sm font-medium text-[#0F172A]',
        },
      },
      {
        id: 'createdBy',
        header: 'Created By',
        cell: ({ row }) =>
          renderCreatedByBadge(
            row.original.createdByName,
            row.original.createdBySource,
          ),
        meta: {
          headerClassName:
            'w-50 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-middle',
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => renderStatusBadge(row.original.status),
        meta: {
          headerClassName:
            'w-32.5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-middle',
        },
      },
      {
        id: 'documents',
        header: 'Documents',
        cell: ({ row }) => renderDocumentCell(row.original),
        meta: {
          headerClassName:
            'w-55 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-middle',
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const booking = row.original
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedBooking(booking)}
              className="h-8.5 px-3 rounded-lg border-[#DCE2EB] text-xs font-bold text-[#012A5E] hover:bg-[#F4F6FA] hover:text-[#0267B8] shadow-2xs gap-1.5 cursor-pointer"
            >
              <Eye className="size-3.5 text-[#0267B8]" />
              View Booking
            </Button>
          )
        },
        meta: {
          headerClassName:
            'w-32.5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3.5 pr-6 text-right',
          cellClassName: 'py-4 pr-6 align-middle text-right',
        },
      },
    ],
    [
      renderCreatedByBadge,
      renderDocumentCell,
      renderServiceIcon,
      renderStatusBadge,
    ],
  )

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col antialiased text-[#1E293B]">
      {/* Shell Container */}
      <div className="flex-1 flex w-full">
        {/* Left Navigation Sidebar */}
        <AgentPortalSidebar
          currentActive="Bookings"
          activePath="/bookings"
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Right Main Container */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AgentPortalHeader
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
            breadcrumbCurrent="Bookings"
            breadcrumbs={[
              { label: 'Dashboard', active: false },
              { label: 'Bookings', active: true },
            ]}
          />

          {/* Main Content Area */}
          <main className="flex-1 px-4 sm:px-6 lg:px-12 py-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Top Page Heading & Actions Section */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-[#0267B8] tracking-wider uppercase">
                  Agent Portal · M2.11 Agent Booking History
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001A3D] tracking-tight">
                  Booking History
                </h1>
                <p className="text-sm text-[#4F5B70]">
                  View bookings made by Skyline Demo Travels Ltd and its
                  Sub-agents.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm font-bold text-[#001A3D]">
                    Skyline Demo Travels Ltd
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#475569] bg-[#EAEFF5] border border-[#DCE2EB]">
                    <Info className="size-3 text-[#64748B]" />
                    Sample data
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-start md:items-end gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    variant="outline"
                    onClick={() => setNewBookingModalOpen(true)}
                    className="h-11 px-4.5 rounded-xl border-[#DCE2EB] text-[#001A3D] font-bold text-sm bg-white hover:bg-[#F4F6FA] shadow-2xs gap-2 cursor-pointer"
                  >
                    <Search className="size-4 text-[#0267B8]" />
                    Search & Book
                  </Button>
                  <Button
                    onClick={() => setNewBookingModalOpen(true)}
                    className="h-11 px-5 rounded-xl bg-[#012A5E] hover:bg-[#001A3D] text-white font-bold text-sm shadow-sm gap-2 cursor-pointer"
                  >
                    <Plus className="size-4 text-[#F1C134]" />
                    New Booking
                  </Button>
                </div>
                <small className="text-xs text-[#64748B] font-medium">
                  Book on behalf of a customer
                </small>
              </div>
            </div>

            {/* Blue Callout Banner */}
            <div className="rounded-2xl bg-[#EBF5FF] border border-[#CBE2FE] px-5 py-3.5 flex items-center gap-3 text-[#012A5E] shadow-2xs">
              <Sparkles className="size-5 text-[#0267B8] shrink-0" />
              <span className="text-sm font-semibold leading-relaxed">
                Booking History combines bookings created directly by the Parent
                Agent and bookings created by its Sub-agents.
              </span>
            </div>

            {/* 5 KPI Summary Cards */}
            {isContentLoading ? (
              <CardGridSkeleton
                count={5}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
                cardClassName="h-32 rounded-2xl"
              />
            ) : null}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${isContentLoading ? "hidden" : ""}`}>
              {/* Card 1: Total Bookings */}
              <div
                onClick={() => {
                  setSourceFilter('all')
                  setStatusChipFilter(null)
                }}
                className="rounded-2xl border border-[#DCE2EB] bg-white p-5 shadow-2xs hover:border-[#0267B8] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-[#EEF4FF] text-[#0267B8] flex items-center justify-center">
                    <Ticket className="size-4.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Total Bookings
                  </span>
                </div>
                <div className="pt-4 space-y-0.5">
                  <div className="text-3xl font-black text-[#0F172A] tracking-tight">
                    {totalBookingsCount}
                  </div>
                  <p className="text-xs text-[#64748B] font-medium">
                    Parent Agent and Sub-agents
                  </p>
                </div>
              </div>

              {/* Card 2: Parent Agent Bookings */}
              <div
                onClick={() => setSourceFilter('parent')}
                className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${
                  sourceFilter === 'parent'
                    ? 'border-[#0267B8] ring-2 ring-[#0267B8]/20 bg-blue-50/20'
                    : 'border-[#DCE2EB] hover:border-[#0267B8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-[#EEF4FF] text-[#0267B8] flex items-center justify-center">
                    <Building2 className="size-4.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Parent Agent Bookings
                  </span>
                </div>
                <div className="pt-4 space-y-1">
                  <div className="text-3xl font-black text-[#0F172A] tracking-tight">
                    {parentAgentCount}
                  </div>
                  <p className="text-xs text-[#64748B] font-medium leading-tight">
                    Created by Skyline Demo Travels Ltd
                  </p>
                  <Button variant="plain"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSourceFilter('parent')
                    }}
                    className="pt-1 text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Show these
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Card 3: Sub-agent Bookings */}
              <div
                onClick={() => setSourceFilter('subagent')}
                className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${
                  sourceFilter === 'subagent'
                    ? 'border-[#0267B8] ring-2 ring-[#0267B8]/20 bg-blue-50/20'
                    : 'border-[#DCE2EB] hover:border-[#0267B8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center">
                    <Users className="size-4.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Sub-agent Bookings
                  </span>
                </div>
                <div className="pt-4 space-y-1">
                  <div className="text-3xl font-black text-[#0F172A] tracking-tight">
                    {subAgentCount}
                  </div>
                  <p className="text-xs text-[#64748B] font-medium leading-tight">
                    Mirpur, Banani and Uttara Desk
                  </p>
                  <Button variant="plain"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSourceFilter('subagent')
                    }}
                    className="pt-1 text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Show these
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Card 4: Documents Available */}
              <div
                onClick={() => {
                  setStatusChipFilter('ticketed_issued')
                }}
                className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${
                  statusChipFilter === 'ticketed_issued'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-[#DCE2EB] hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-[#EAFBF1] text-[#0B6A45] flex items-center justify-center">
                    <FileCheck2 className="size-4.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Documents Available
                  </span>
                </div>
                <div className="pt-4 space-y-0.5">
                  <div className="text-3xl font-black text-[#0F172A] tracking-tight">
                    {documentsAvailableCount}
                  </div>
                  <p className="text-xs text-[#64748B] font-medium">
                    E-tickets and vouchers ready
                  </p>
                </div>
              </div>

              {/* Card 5: Needs Attention */}
              <div
                onClick={() => {
                  setStatusChipFilter(
                    statusChipFilter === 'pending' ? 'failed' : 'pending',
                  )
                }}
                className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${
                  statusChipFilter === 'pending' ||
                  statusChipFilter === 'failed'
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20'
                    : 'border-[#DCE2EB] hover:border-amber-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-[#FEF6E7] text-[#9A6400] flex items-center justify-center">
                    <Clock className="size-4.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Needs Attention
                  </span>
                </div>
                <div className="pt-4 space-y-0.5">
                  <div className="text-3xl font-black text-[#0F172A] tracking-tight">
                    {needsAttentionCount}
                  </div>
                  <p className="text-xs text-[#64748B] font-medium">
                    Pending or failed bookings
                  </p>
                </div>
              </div>
            </div>

            {/* Main Table Card Section */}
            <div className="rounded-2xl border border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
              {/* Card Header */}
              <div className="p-5 pb-4 border-b border-[#F1F3F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#EEF4FF] text-[#0267B8] flex items-center justify-center">
                    <Ticket className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#012A5E]">
                      All bookings
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Including bookings made on behalf of customers
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0]">
                  <Info className="size-3.5 text-[#64748B]" />
                  Sample data for design preview
                </span>
              </div>

              {/* Status Filter Chips Row */}
              <div className="px-5 pt-4 pb-2 border-b border-[#F1F3F6] flex flex-wrap items-center gap-2">
                <Button variant="plain"
                  type="button"
                  onClick={() => setStatusChipFilter(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    statusChipFilter === null
                      ? 'bg-[#012A5E] text-white shadow-xs'
                      : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F8FAFC]'
                  }`}
                >
                  All
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      statusChipFilter === null
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {totalBookingsCount}
                  </span>
                </Button>

                <Button variant="plain"
                  type="button"
                  onClick={() =>
                    setStatusChipFilter(
                      statusChipFilter === 'pending' ? null : 'pending',
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    statusChipFilter === 'pending'
                      ? 'bg-[#9A6400] text-white shadow-xs'
                      : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Pending
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      statusChipFilter === 'pending'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FEF6E7] text-[#9A6400]'
                    }`}
                  >
                    {pendingCount}
                  </span>
                </Button>

                <Button variant="plain"
                  type="button"
                  onClick={() =>
                    setStatusChipFilter(
                      statusChipFilter === 'confirmed' ? null : 'confirmed',
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    statusChipFilter === 'confirmed'
                      ? 'bg-[#0B6A45] text-white shadow-xs'
                      : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Confirmed
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      statusChipFilter === 'confirmed'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#EAFBF1] text-[#0B6A45]'
                    }`}
                  >
                    {confirmedCount}
                  </span>
                </Button>

                <Button variant="plain"
                  type="button"
                  onClick={() =>
                    setStatusChipFilter(
                      statusChipFilter === 'ticketed_issued'
                        ? null
                        : 'ticketed_issued',
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    statusChipFilter === 'ticketed_issued'
                      ? 'bg-[#0267B8] text-white shadow-xs'
                      : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Ticketed / Issued
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      statusChipFilter === 'ticketed_issued'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#EEF4FF] text-[#0267B8]'
                    }`}
                  >
                    {ticketedIssuedCount}
                  </span>
                </Button>

                <Button variant="plain"
                  type="button"
                  onClick={() =>
                    setStatusChipFilter(
                      statusChipFilter === 'cancelled' ? null : 'cancelled',
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    statusChipFilter === 'cancelled'
                      ? 'bg-[#475569] text-white shadow-xs'
                      : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Cancelled
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      statusChipFilter === 'cancelled'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {cancelledCount}
                  </span>
                </Button>

                <Button variant="plain"
                  type="button"
                  onClick={() =>
                    setStatusChipFilter(
                      statusChipFilter === 'refunded' ? null : 'refunded',
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    statusChipFilter === 'refunded'
                      ? 'bg-[#475569] text-white shadow-xs'
                      : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Refunded
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      statusChipFilter === 'refunded'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {refundedCount}
                  </span>
                </Button>

                <Button variant="plain"
                  type="button"
                  onClick={() =>
                    setStatusChipFilter(
                      statusChipFilter === 'failed' ? null : 'failed',
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    statusChipFilter === 'failed'
                      ? 'bg-[#DC2626] text-white shadow-xs'
                      : 'bg-white border border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Failed
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      statusChipFilter === 'failed'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FEF2F2] text-[#DC2626]'
                    }`}
                  >
                    {failedCount}
                  </span>
                </Button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-5 bg-[#FAFBFC] border-b border-[#F1F3F6] flex flex-col gap-3.5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search bookings"
                      className="pl-10 pr-9 h-10 rounded-xl bg-white border-[#DCE2EB] text-sm text-[#012A5E] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
                    />
                    {searchQuery && (
                      <Button variant="plain"
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Booking Source */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] pl-1">
                        Booking Source
                      </span>
                      <Select
                        value={sourceFilter}
                        items={{
                          all: 'All Bookings',
                          parent: 'Parent Agent Only',
                          subagent: 'Sub-agents Only',
                        }}
                        onValueChange={(val) => {
                          if (val) setSourceFilter(val)
                        }}
                      >
                        <SelectTrigger className="h-10 min-w-40 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Bookings</SelectItem>
                          <SelectItem value="parent">
                            Parent Agent Only
                          </SelectItem>
                          <SelectItem value="subagent">
                            Sub-agents Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Created By */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] pl-1">
                        Created By
                      </span>
                      <Select
                        value={createdByFilter}
                        items={{
                          all: 'All',
                          'Skyline Demo Travels Ltd': 'Skyline Demo Travels Ltd',
                          'Mirpur Desk': 'Mirpur Desk',
                          'Banani Desk': 'Banani Desk',
                          'Uttara Desk': 'Uttara Desk',
                        }}
                        onValueChange={(val) => {
                          if (val) setCreatedByFilter(val)
                        }}
                      >
                        <SelectTrigger className="h-10 min-w-45 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="Skyline Demo Travels Ltd">
                            Skyline Demo Travels Ltd
                          </SelectItem>
                          <SelectItem value="Mirpur Desk">
                            Mirpur Desk
                          </SelectItem>
                          <SelectItem value="Banani Desk">
                            Banani Desk
                          </SelectItem>
                          <SelectItem value="Uttara Desk">
                            Uttara Desk
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] pl-1">
                        Service
                      </span>
                      <Select
                        value={serviceFilter}
                        items={{
                          all: 'All Services',
                          Flight: 'Flight',
                          Hotel: 'Hotel',
                          'Travel Package': 'Travel Package',
                          Activity: 'Activity',
                          'Car Rental': 'Car Rental',
                          'Bus / Train': 'Bus / Train',
                          eSIM: 'eSIM',
                          'Travel Insurance': 'Travel Insurance',
                        }}
                        onValueChange={(val) => {
                          if (val) setServiceFilter(val)
                        }}
                      >
                        <SelectTrigger className="h-10 min-w-37.5 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          <SelectItem value="Flight">Flight</SelectItem>
                          <SelectItem value="Hotel">Hotel</SelectItem>
                          <SelectItem value="Travel Package">
                            Travel Package
                          </SelectItem>
                          <SelectItem value="Activity">Activity</SelectItem>
                          <SelectItem value="Car Rental">Car Rental</SelectItem>
                          <SelectItem value="Bus / Train">
                            Bus / Train
                          </SelectItem>
                          <SelectItem value="eSIM">eSIM</SelectItem>
                          <SelectItem value="Travel Insurance">
                            Travel Insurance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] pl-1">
                        Status
                      </span>
                      <Select
                        value={statusDropdownFilter}
                        items={{
                          all: 'All Statuses',
                          confirmed: 'Confirmed',
                          ticketed: 'Ticketed',
                          issued: 'Issued',
                          pending: 'Pending',
                          cancelled: 'Cancelled',
                          refunded: 'Refunded',
                          failed: 'Failed',
                        }}
                        onValueChange={(val) => {
                          if (val) setStatusDropdownFilter(val)
                        }}
                      >
                        <SelectTrigger className="h-10 min-w-35 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E]">
                          <SelectValue />
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
                    </div>

                    {/* Travel / Service Date */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] pl-1">
                        Travel / Service Date
                      </span>
                      <Select
                        value={dateFilter}
                        items={{
                          all: 'All dates',
                          dec_2026: 'December 2026',
                          jan_2027: 'January 2027',
                        }}
                        onValueChange={(val) => {
                          if (val) setDateFilter(val)
                        }}
                      >
                        <SelectTrigger className="h-10 min-w-35 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All dates</SelectItem>
                          <SelectItem value="dec_2026">
                            December 2026
                          </SelectItem>
                          <SelectItem value="jan_2027">January 2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort by */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] pl-1">
                        Sort by
                      </span>
                      <Select
                        value={sortBy}
                        items={{
                          soonest: 'Travel date — Soonest',
                          latest: 'Travel date — Latest',
                          ref: 'Booking Reference',
                          customer: 'Customer Name',
                        }}
                        onValueChange={(val) => {
                          if (val) setSortBy(val)
                        }}
                      >
                        <SelectTrigger className="h-10 min-w-45 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#012A5E]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soonest">
                            Travel date — Soonest
                          </SelectItem>
                          <SelectItem value="latest">
                            Travel date — Latest
                          </SelectItem>
                          <SelectItem value="ref">
                            Booking Reference
                          </SelectItem>
                          <SelectItem value="customer">
                            Customer Name
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                      <div className="flex flex-col justify-end">
                        <Button
                          variant="plain"
                          size="sm"
                          onClick={resetFilters}
                          className="h-10 px-3 text-xs font-bold text-[#DC2626] hover:bg-rose-50 hover:text-[#B91C1C] cursor-pointer"
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Showing X bookings summary text */}
                <div className="pt-1 text-xs text-[#4F5B70]">
                  Showing{' '}
                  <strong className="text-[#012A5E] font-black">
                    {filteredBookings.length}
                  </strong>{' '}
                  bookings
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <DataTable
                  data={filteredBookings}
                  columns={columns}
                  getRowId={(row) => row.id}
                  headerRowClassName="bg-[#EBF2FA] border-y border-[#DCE2EB] hover:bg-[#EBF2FA]"
                  rowClassName="hover:bg-[#F9FAFC] border-b border-[#F1F3F6] transition-colors"
                  emptyCellClassName="py-12 text-center"
                  empty={
                    <div className="max-w-sm mx-auto space-y-2">
                      <Ticket className="size-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-bold text-[#012A5E]">
                        No bookings found matching filters
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Try adjusting your search terms or clearing the
                        active filters.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="mt-2 text-xs"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  }
                />
              </div>

              {/* Table Pagination */}
              <div className="p-4 px-6 border-t border-[#F1F3F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748B]">
                <div>
                  Page 1 of 1 · all {filteredBookings.length} bookings on one
                  page
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="size-8 p-0 rounded-lg border-[#DCE2EB] text-slate-400 opacity-50"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="size-8 p-0 rounded-lg bg-[#012A5E] text-white border-[#012A5E] font-bold"
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="size-8 p-0 rounded-lg border-[#DCE2EB] text-slate-400 opacity-50"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-[#DCE2EB] bg-white py-3.5 px-6 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748B]">
            <span>AeroWing Agent Portal · M2.11 Agent Booking History</span>
            <span>
              Website only · configuration prototype — no prices are calculated
              and the real pricing engine is not changed.
            </span>
          </footer>
        </div>
      </div>

      {/* Slide-over Booking Details Sheet */}
      <Sheet
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null)
        }}
      >
        <SheetContent
          side="right"
          className="sm:max-w-130 p-0 flex flex-col justify-between bg-[#F8FAFC]"
        >
          {selectedBooking && (
            <>
              {/* Header */}
              <div className="p-6 pb-4 bg-white border-b border-[#E6EAF0]">
                <SheetHeader className="pr-8">
                  <SheetTitle className="text-2xl font-black text-[#012A5E]">
                    Booking Details
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[#4F5B70] leading-relaxed mt-1">
                    Booking summary from the Agent Booking History. The full
                    booking detail screen is designed separately.
                  </SheetDescription>
                </SheetHeader>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Main Card */}
                <div className="rounded-2xl border border-[#DCE2EB] bg-white p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
                    <h3 className="text-base font-extrabold text-[#012A5E]">
                      Booking Overview
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0]">
                      <Info className="size-3 text-[#64748B]" />
                      Sample data
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Booking Reference
                      </span>
                      <div className="text-sm font-bold text-[#012A5E] font-mono">
                        {selectedBooking.ref}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Customer
                      </span>
                      <div className="text-sm font-bold text-[#012A5E]">
                        {selectedBooking.customer}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        · booked on behalf of customer
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Service
                      </span>
                      <div className="text-sm font-bold text-[#012A5E] flex items-center gap-1.5">
                        {renderServiceIcon(selectedBooking.service)}
                        <span>{selectedBooking.service}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Travel Date
                      </span>
                      <div className="text-sm font-bold text-[#012A5E]">
                        {selectedBooking.travelDate}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Status
                      </span>
                      <div className="pt-0.5">
                        {renderStatusBadge(selectedBooking.status)}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Amount
                      </span>
                      <div className="text-sm font-extrabold text-[#012A5E]">
                        {selectedBooking.amount}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Created By
                      </span>
                      <div className="text-sm font-bold text-[#012A5E]">
                        {selectedBooking.createdByName}
                      </div>
                      <span className="text-[11px] text-[#64748B]">
                        {selectedBooking.createdBySource}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        Parent Agency
                      </span>
                      <div className="text-sm font-bold text-[#012A5E]">
                        Skyline Demo Travels Ltd
                      </div>
                    </div>
                  </div>

                  {/* Route / Service Item */}
                  <div className="pt-3 border-t border-[#F1F3F6] space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Itinerary / Service Item
                    </span>
                    <p className="text-xs font-semibold text-[#012A5E] leading-relaxed">
                      {selectedBooking.routeOrItem}
                    </p>
                    {selectedBooking.cabinOrRoom && (
                      <p className="text-xs text-[#64748B]">
                        {selectedBooking.cabinOrRoom}
                      </p>
                    )}
                  </div>
                </div>

                {/* Document Card if available */}
                {(selectedBooking.documentStatus === 'Voucher available' ||
                  selectedBooking.documentStatus === 'E-ticket available' ||
                  selectedBooking.documentStatus ===
                    'Voucher / document available') && (
                  <div className="rounded-2xl border border-[#DCE2EB] bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#012A5E]">
                        Booking Document
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B6A45]">
                        <CheckCircle2 className="size-3.5" />
                        Ready
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">
                      {selectedBooking.service === 'Flight'
                        ? 'Electronic air ticket generated by the GDS reservation engine.'
                        : 'Official reservation voucher generated by the provider service.'}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setPreviewDocument(selectedBooking)
                        }}
                        className="h-9 px-4 rounded-xl bg-[#0267B8] hover:bg-[#012A5E] text-white font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Eye className="size-3.5" />
                        View Document
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sheet Footer */}
              <div className="p-4 bg-white border-t border-[#E6EAF0] flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl border-[#DCE2EB] text-[#4F5B70] text-xs font-bold"
                >
                  Close
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="rounded-xl border-[#DCE2EB] text-[#012A5E] text-xs font-bold gap-1.5"
                  >
                    <Printer className="size-3.5" />
                    Print
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Document Preview Modal */}
      <Dialog
        open={Boolean(previewDocument)}
        onOpenChange={(open) => {
          if (!open) setPreviewDocument(null)
        }}
      >
        <DialogContent className="sm:max-w-140 p-0 overflow-hidden bg-white border-[#DCE2EB] rounded-2xl shadow-xl">
          {previewDocument && (
            <div>
              {/* Modal Header */}
              <div className="p-5 bg-linear-to-r from-[#001A3D] to-[#012A5E] text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200">
                    AeroWing Travel Partner Portal
                  </span>
                  <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    {previewDocument.service === 'Flight' ? (
                      <Plane className="size-5 text-[#F1C134]" />
                    ) : (
                      <Ticket className="size-5 text-[#F1C134]" />
                    )}
                    {previewDocument.service === 'Flight'
                      ? 'Electronic Flight Ticket'
                      : 'Official Service Voucher'}
                  </h3>
                </div>
              </div>

              {/* Modal Body: Ticket / Voucher Design */}
              <div className="p-6 space-y-5 bg-[#FAFBFC]">
                {/* Boarding / Voucher Paper Card */}
                <div className="rounded-xl border border-[#DCE2EB] bg-white p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#CBD5E1]">
                    <div>
                      <span className="text-[10px] font-bold text-[#64748B] uppercase">
                        Passenger / Guest
                      </span>
                      <p className="text-base font-extrabold text-[#012A5E]">
                        {previewDocument.customer}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase">
                        Reference Number
                      </span>
                      <p className="text-sm font-mono font-bold text-[#0267B8]">
                        {previewDocument.ref}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#64748B] font-bold">
                        Service Type:
                      </span>
                      <p className="font-semibold text-[#0F172A]">
                        {previewDocument.service}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#64748B] font-bold">
                        Travel / Date:
                      </span>
                      <p className="font-semibold text-[#0F172A]">
                        {previewDocument.travelDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#64748B] font-bold">
                        PNR / Code:
                      </span>
                      <p className="font-mono font-bold text-[#0F172A]">
                        {previewDocument.pnr}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#64748B] font-bold">
                        Issuing Desk:
                      </span>
                      <p className="font-semibold text-[#0F172A]">
                        {previewDocument.createdByName}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F1F3F6] space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B]">
                      Itinerary Description:
                    </span>
                    <p className="text-xs font-semibold text-[#012A5E]">
                      {previewDocument.routeOrItem}
                    </p>
                    {previewDocument.cabinOrRoom && (
                      <p className="text-[11px] text-[#64748B]">
                        {previewDocument.cabinOrRoom}
                      </p>
                    )}
                  </div>

                  {/* Simulated Barcode / QR */}
                  <div className="pt-3 border-t border-dashed border-[#CBD5E1] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-8 w-44 bg-[repeating-linear-gradient(90deg,#0F172A,#0F172A_2px,transparent_2px,transparent_4px,#0F172A_4px,#0F172A_7px,transparent_7px,transparent_9px)] rounded-xs opacity-75" />
                      <span className="text-[10px] font-mono text-[#64748B]">
                        *{previewDocument.pnr}*{previewDocument.ref}*
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAFBF1] text-[#0B6A45]">
                        <CheckCircle2 className="size-3.5" />
                        Valid & Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewDocument(null)}
                    className="rounded-xl border-[#DCE2EB] text-xs font-bold text-[#4F5B70]"
                  >
                    Close
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="rounded-xl border-[#DCE2EB] text-[#012A5E] text-xs font-bold gap-1.5 cursor-pointer"
                    >
                      <Printer className="size-3.5" />
                      Print Document
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        alert(`Downloading document for ${previewDocument.ref}`)
                      }}
                      className="rounded-xl bg-[#012A5E] hover:bg-[#001A3D] text-white text-xs font-bold gap-1.5 cursor-pointer"
                    >
                      <Download className="size-3.5" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Booking / Search Dialog */}
      <Dialog open={newBookingModalOpen} onOpenChange={setNewBookingModalOpen}>
        <DialogContent className="sm:max-w-135 p-0 rounded-2xl overflow-hidden bg-white border-[#DCE2EB] shadow-xl">
          <div className="p-6 bg-linear-to-r from-[#001A3D] to-[#012A5E] text-white space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
              Skyline Demo Travels Ltd
            </span>
            <DialogTitle className="text-xl font-black text-white">
              Create New Booking
            </DialogTitle>
            <DialogDescription className="text-xs text-blue-100">
              Search available inventory and book on behalf of your customers or
              sub-agents.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#012A5E]">
                Select Service Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Flight', icon: Plane },
                  { name: 'Hotel', icon: Building },
                  { name: 'Package', icon: Package },
                  { name: 'Activity', icon: Compass },
                ].map((s) => (
                  <Button variant="plain"
                    key={s.name}
                    type="button"
                    className="p-3 rounded-xl border border-[#DCE2EB] hover:border-[#0267B8] hover:bg-blue-50/30 flex flex-col items-center gap-1.5 text-xs font-bold text-[#012A5E] cursor-pointer transition-colors"
                  >
                    <s.icon className="size-5 text-[#0267B8]" />
                    {s.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4F5B70]">
                  Passenger / Customer Name
                </label>
                <Input
                  placeholder="e.g. Amina Rahman"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4F5B70]">
                  Contact Mobile
                </label>
                <Input
                  placeholder="+880 1711 000000"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4F5B70]">
                  Origin / Departure
                </label>
                <Input
                  placeholder="DAC - Dhaka"
                  defaultValue="DAC - Dhaka"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4F5B70]">
                  Destination
                </label>
                <Input
                  placeholder="DXB - Dubai"
                  defaultValue="DXB - Dubai"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F1F3F6] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewBookingModalOpen(false)}
                className="rounded-xl border-[#DCE2EB] text-xs font-bold text-[#4F5B70]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  alert('Searching available inventory in B2B platform...')
                  setNewBookingModalOpen(false)
                }}
                className="rounded-xl bg-[#012A5E] hover:bg-[#001A3D] text-white text-xs font-bold px-4"
              >
                Search Available Inventory
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

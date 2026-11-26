import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Percent,
  Clock,
  TrendingUp,
  CheckCircle2,
  ListFilter,
  Info,
  Lock,
  Building2,
  Users,
  Search,
  Eye,
  RotateCcw,
  Calendar,
  Wallet,
  Tag,
  ArrowRight,
  Plane,
  Building,
  Package,
  Compass,
  Car,
  AlertCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import { DatePicker } from '#/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { CommissionDetailsSheet } from './commission-details-sheet'
import { INITIAL_COMMISSION_RECORDS } from './commission-tracking-data'
import type { CommissionRecord } from './commission-tracking-data'
import { cn } from 'cn'

interface CommissionTrackingPageProps {
  initialSelectedBookingId?: string
  initialDetailsOpen?: boolean
  initialNodeId?: string
}

export function CommissionTrackingPage({
  initialSelectedBookingId,
  initialDetailsOpen,
  initialNodeId,
}: CommissionTrackingPageProps) {
  const isContentLoading = useContentLoading()
  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Node based detection matching Figma #745:6678
  const isDetailsNode =
    initialNodeId === '745-6678' ||
    initialNodeId === '745:6678' ||
    initialDetailsOpen === true

  const defaultBookingId =
    initialSelectedBookingId || (isDetailsNode ? 'AW-DEMO-FL-006' : undefined)

  // Sheet state
  const [sheetOpen, setSheetOpen] = React.useState(
    Boolean(isDetailsNode || defaultBookingId),
  )
  const [selectedRecord, setSelectedRecord] =
    React.useState<CommissionRecord | null>(() => {
      if (defaultBookingId) {
        return (
          INITIAL_COMMISSION_RECORDS.find(
            (r) => r.bookingId === defaultBookingId,
          ) || INITIAL_COMMISSION_RECORDS[0]
        )
      }
      return null
    })

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState('')
  const [commissionStatusFilter, setCommissionStatusFilter] =
    React.useState<string>('all')
  const [bookingStatusFilter, setBookingStatusFilter] =
    React.useState<string>('all')
  const [serviceFilter, setServiceFilter] = React.useState<string>('all')
  const [createdByFilter, setCreatedByFilter] = React.useState<string>('all')
  const [fromDate, setFromDate] = React.useState('')
  const [toDate, setToDate] = React.useState('')

  // Filter records
  const filteredRecords = React.useMemo(() => {
    return INITIAL_COMMISSION_RECORDS.filter((record) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesQuery =
          record.bookingId.toLowerCase().includes(query) ||
          record.customer.toLowerCase().includes(query) ||
          record.createdByName.toLowerCase().includes(query) ||
          record.service.toLowerCase().includes(query)
        if (!matchesQuery) return false
      }

      // Commission status filter
      if (commissionStatusFilter !== 'all') {
        if (record.commissionStatus !== commissionStatusFilter) return false
      }

      // Booking status filter
      if (bookingStatusFilter !== 'all') {
        if (record.bookingStatus !== bookingStatusFilter) return false
      }

      // Service filter
      if (serviceFilter !== 'all') {
        if (record.service !== serviceFilter) return false
      }

      // Created By filter
      if (createdByFilter !== 'all') {
        if (record.createdByName !== createdByFilter) return false
      }

      return true
    })
  }, [
    searchQuery,
    commissionStatusFilter,
    bookingStatusFilter,
    serviceFilter,
    createdByFilter,
  ])

  const handleOpenDetails = (record: CommissionRecord) => {
    setSelectedRecord(record)
    setSheetOpen(true)
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Flight':
        return Plane
      case 'Hotel':
        return Building
      case 'Travel Package':
        return Package
      case 'Activity':
        return Compass
      case 'Car Rental':
        return Car
      default:
        return Plane
    }
  }

  const columns = React.useMemo<ColumnDef<CommissionRecord>[]>(
    () => [
      {
        accessorKey: 'bookingId',
        header: 'Booking',
        cell: ({ row }) => {
          const record = row.original
          return (
            <button
              type="button"
              onClick={() => handleOpenDetails(record)}
              className="text-left font-extrabold text-[#0066CC] hover:underline cursor-pointer"
            >
              {record.bookingId}
            </button>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName:
            'font-extrabold text-xs text-[#0066CC] hover:underline cursor-pointer py-3.5',
        },
      },
      {
        accessorKey: 'service',
        header: 'Service',
        cell: ({ row }) => {
          const record = row.original
          const ServiceIcon = getServiceIcon(record.service)
          return (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#001A3D]">
              <ServiceIcon className="size-3.5 text-[#0066CC] shrink-0" />
              <span>{record.service}</span>
            </div>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'py-3.5',
        },
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        cell: ({ row }) => row.original.customer,
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'text-xs font-bold text-[#001A3D] py-3.5',
        },
      },
      {
        id: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => {
          const record = row.original
          return (
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#001A3D]">
                {record.createdByName}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-[#5A6E85]">
                <Users className="size-2.5 text-[#0066CC]" />
                <span>{record.createdBySource}</span>
              </div>
            </div>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'py-3.5',
        },
      },
      {
        accessorKey: 'bookingStatus',
        header: 'Booking Status',
        cell: ({ row }) => {
          const record = row.original
          return (
            <>
              {record.bookingStatus === 'Confirmed' && (
                <Badge
                  variant="outline"
                  className="bg-[#ECFDF5] text-[#107C41] border-[#A7F3D0] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                >
                  <CheckCircle2 className="size-3" />
                  Confirmed
                </Badge>
              )}
              {record.bookingStatus === 'Refunded' && (
                <Badge
                  variant="outline"
                  className="bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                >
                  <RotateCcw className="size-3" />
                  Refunded
                </Badge>
              )}
              {record.bookingStatus === 'Cancelled' && (
                <Badge
                  variant="outline"
                  className="bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                >
                  <AlertCircle className="size-3" />
                  Cancelled
                </Badge>
              )}
            </>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'py-3.5',
        },
      },
      {
        accessorKey: 'commissionStatus',
        header: 'Commission Status',
        cell: ({ row }) => {
          const record = row.original
          return (
            <>
              {record.commissionStatus === 'Pending' && (
                <Badge
                  variant="outline"
                  className="bg-[#EFF6FF] text-[#0284C7] border-[#BFDBFE] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                >
                  <Clock className="size-3" />
                  Pending
                </Badge>
              )}
              {record.commissionStatus === 'Earned' && (
                <Badge
                  variant="outline"
                  className="bg-[#FEF6E9] text-[#D97706] border-[#FDE3B5] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                >
                  <TrendingUp className="size-3" />
                  Earned
                </Badge>
              )}
              {record.commissionStatus === 'Settled' && (
                <Badge
                  variant="outline"
                  className="bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                >
                  <CheckCircle2 className="size-3" />
                  Settled
                </Badge>
              )}
              {record.commissionStatus === 'Commission reversed' && (
                <Badge
                  variant="outline"
                  className="bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                >
                  <RotateCcw className="size-3" />
                  Commission reversed
                </Badge>
              )}
            </>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'py-3.5',
        },
      },
      {
        accessorKey: 'amount',
        header: 'Commission',
        cell: ({ row }) => {
          const record = row.original
          return (
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#001A3D]">{record.amount}</p>
              {record.reversedReason && (
                <p className="text-[10px] text-[#5A6E85] max-w-37.5 leading-tight">
                  {record.reversedReason}
                </p>
              )}
            </div>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'py-3.5',
        },
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier',
        cell: ({ row }) => row.original.supplier,
        meta: {
          headerClassName:
            'text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'text-xs text-[#5A6E85] py-3.5',
        },
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const record = row.original
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenDetails(record)}
              className="rounded-lg border-[#DCE2EB] bg-white hover:bg-slate-50 text-[#001A3D] font-bold text-xs px-2.5 py-1.5 h-auto shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
            >
              <Eye className="size-3 text-[#0066CC]" />
              <span>View Details</span>
            </Button>
          )
        },
        meta: {
          headerClassName:
            'text-right text-[11px] font-extrabold text-[#5A6E85] uppercase tracking-wider py-3.5',
          cellClassName: 'text-right py-3.5',
        },
      },
    ],
    [getServiceIcon, handleOpenDetails],
  )

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex">
      {/* Sidebar */}
      <AgentPortalSidebar
        currentActive="Commissions"
        activePath="/commissions"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileMenuOpen((prev) => !prev)}
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Commissions', active: true },
          ]}
          breadcrumbCurrent="Commissions"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Page Title & Context Header */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#0066CC] uppercase tracking-wider">
              AGENT PORTAL · M2.9 COMMISSION TRACKING
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001A3D] tracking-tight">
              Commissions
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85]">
              Track commissions generated from confirmed bookings and review
              settlement status.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="font-extrabold text-sm text-[#001A3D]">
                Skyline Demo Travels Ltd
              </span>
              <Badge
                variant="outline"
                className="bg-[#F4F6FA] text-[#5A6E85] border-[#DCE2EB] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1"
              >
                <Eye className="size-3 text-[#5A6E85]" />
                Sample data
              </Badge>
            </div>
          </div>

          {/* Section 1: Commission Summary Card */}
          <section className="bg-white rounded-2xl border border-[#E6EAF0] shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6EAF0]">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
                  <Percent className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#001A3D]">
                    Commission Summary
                  </h2>
                  <p className="text-xs text-[#5A6E85]">
                    Active Pending, Earned and Settled records only — reversed
                    commission is excluded
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-[#F4F6FA] text-[#5A6E85] border-[#DCE2EB] text-[11px] font-semibold py-0.5 px-2.5 rounded-full flex items-center gap-1 self-start sm:self-center"
              >
                <Eye className="size-3 text-[#5A6E85]" />
                Sample data
              </Badge>
            </div>

            {/* 4 KPI Cards */}
            {isContentLoading ? (
              <CardGridSkeleton
                count={4}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                cardClassName="h-28 rounded-xl"
              />
            ) : null}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isContentLoading ? "hidden" : ""}`}>
              {/* KPI 1: Pending */}
              <div className="rounded-xl border border-[#E6EAF0] bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#0284C7]">
                    <Clock className="size-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#5A6E85]">Pending</h3>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#001A3D] leading-none">
                    1{' '}
                    <span className="text-xs font-normal text-[#5A6E85]">
                      record
                    </span>
                  </p>
                  <p className="text-xs text-[#5A6E85] pt-1">
                    Amount:{' '}
                    <span className="font-extrabold text-[#001A3D]">
                      Sample amount
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-[#5A6E85] leading-relaxed pt-1 border-t border-[#E6EAF0]">
                  Commission currently shown as pending.
                </p>
              </div>

              {/* KPI 2: Earned */}
              <div className="rounded-xl border border-[#E6EAF0] bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-[#FEF6E9] border border-[#FDE3B5] flex items-center justify-center text-[#D97706]">
                    <TrendingUp className="size-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#5A6E85]">Earned</h3>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#001A3D] leading-none">
                    1{' '}
                    <span className="text-xs font-normal text-[#5A6E85]">
                      record
                    </span>
                  </p>
                  <p className="text-xs text-[#5A6E85] pt-1">
                    Amount:{' '}
                    <span className="font-extrabold text-[#001A3D]">
                      Sample amount
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-[#5A6E85] leading-relaxed pt-1 border-t border-[#E6EAF0]">
                  Commission currently shown as earned.
                </p>
              </div>

              {/* KPI 3: Settled */}
              <div className="rounded-xl border border-[#E6EAF0] bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#5A6E85]">Settled</h3>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#001A3D] leading-none">
                    1{' '}
                    <span className="text-xs font-normal text-[#5A6E85]">
                      record
                    </span>
                  </p>
                  <p className="text-xs text-[#5A6E85] pt-1">
                    Amount:{' '}
                    <span className="font-extrabold text-[#001A3D]">
                      Sample amount
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-[#5A6E85] leading-relaxed pt-1 border-t border-[#E6EAF0]">
                  Commission settlement recorded by Aero Wing Admin.
                </p>
              </div>

              {/* KPI 4: Commission Records */}
              <div className="rounded-xl border border-[#E6EAF0] bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#0066CC]">
                    <ListFilter className="size-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#5A6E85]">
                    Commission Records
                  </h3>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#001A3D] leading-none">
                    5{' '}
                    <span className="text-xs font-normal text-[#5A6E85]">
                      total
                    </span>
                  </p>
                  <p className="text-xs text-[#5A6E85] pt-1">
                    Active / reversed:{' '}
                    <span className="font-extrabold text-[#001A3D]">3 / 2</span>
                  </p>
                </div>
                <p className="text-[11px] text-[#5A6E85] leading-relaxed pt-1 border-t border-[#E6EAF0]">
                  Derived from the sample commission records below.
                </p>
              </div>
            </div>

            {/* Note at bottom of summary */}
            <div className="flex items-center gap-2 text-xs text-[#5A6E85] pt-1">
              <Info className="size-3.5 text-[#94A3B8] shrink-0" />
              <span>
                Commission amounts, rates and currency are not included in this
                design-preview dataset.
              </span>
            </div>
          </section>

          {/* Banner: Settlements Admin Notice */}
          <div className="rounded-2xl border border-[#BFDBFE] bg-[#F0F7FF] p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
            <div className="size-9 rounded-xl bg-white border border-[#BFDBFE] flex items-center justify-center text-[#0066CC] shrink-0 mt-0.5 shadow-xs">
              <Building2 className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-extrabold text-[#001A3D]">
                Commission settlements are recorded by Aero Wing Admin
              </p>
              <p className="text-xs text-[#5A6E85] leading-relaxed">
                Agent users can review settlement status but cannot record
                settlement payments.
              </p>
            </div>
          </div>

          {/* Section 2: Commission Configuration */}
          <section className="bg-white rounded-2xl border border-[#E6EAF0] shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6EAF0]">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#0066CC] shrink-0">
                  <Lock className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#001A3D]">
                    Commission Configuration
                  </h2>
                  <p className="text-xs text-[#5A6E85]">
                    Commission rules are configured by Aero Wing Admin for the
                    Agent, service and supplier.
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-[#F8FAFC] text-[#5A6E85] border-[#DCE2EB] text-[11px] font-semibold py-0.5 px-2.5 rounded-full flex items-center gap-1 self-start sm:self-center"
              >
                <Lock className="size-3" />
                Read-only
              </Badge>
            </div>

            {/* 5 Config Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-1">
              <div>
                <p className="text-xs font-medium text-[#5A6E85] mb-1">Agent</p>
                <p className="text-xs sm:text-sm font-bold text-[#001A3D]">
                  Skyline Demo Travels Ltd
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#5A6E85] mb-1">
                  Service
                </p>
                <p className="text-xs font-medium text-[#5A6E85] leading-relaxed">
                  Depends on applicable commission rule
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#5A6E85] mb-1">
                  Supplier
                </p>
                <p className="text-xs font-medium text-[#5A6E85] leading-relaxed">
                  Depends on applicable commission rule
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#5A6E85] mb-1">
                  Commission Rule
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#001A3D]">
                  Admin configured
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#5A6E85] mb-1">Rate</p>
                <p className="text-xs font-bold text-[#001A3D] leading-relaxed">
                  Rate configured by Aero Wing Admin
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Commission History Card (Main Table & Filters) */}
          <section className="bg-white rounded-2xl border border-[#E6EAF0] shadow-sm p-5 sm:p-6 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6EAF0]">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#0066CC] shrink-0">
                  <ListFilter className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#001A3D]">
                    Commission History
                  </h2>
                  <p className="text-xs text-[#5A6E85]">
                    Booking-level commission tracking · read-only
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-[#F4F6FA] text-[#5A6E85] border-[#DCE2EB] text-[11px] font-semibold py-0.5 px-2.5 rounded-full flex items-center gap-1 self-start sm:self-center"
              >
                <Eye className="size-3 text-[#5A6E85]" />
                Sample data
              </Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commissions"
                className="pl-10 h-10 rounded-xl border-[#DCE2EB] bg-white text-xs text-[#001A3D] placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {/* Filter 1: Commission Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider">
                  Commission Status
                </label>
                <Select
                  value={commissionStatusFilter}
                  onValueChange={(val) =>
                    setCommissionStatusFilter(val || 'all')
                  }
                >
                  <SelectTrigger className="h-9 rounded-lg border-[#DCE2EB] text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Earned">Earned</SelectItem>
                    <SelectItem value="Settled">Settled</SelectItem>
                    <SelectItem value="Commission reversed">
                      Commission reversed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 2: Booking Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider">
                  Booking Status
                </label>
                <Select
                  value={bookingStatusFilter}
                  onValueChange={(val) => setBookingStatusFilter(val || 'all')}
                >
                  <SelectTrigger className="h-9 rounded-lg border-[#DCE2EB] text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 3: Service */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider">
                  Service
                </label>
                <Select
                  value={serviceFilter}
                  onValueChange={(val) => setServiceFilter(val || 'all')}
                >
                  <SelectTrigger className="h-9 rounded-lg border-[#DCE2EB] text-xs">
                    <SelectValue placeholder="All Services" />
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
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 4: Created By */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider">
                  Created By
                </label>
                <Select
                  value={createdByFilter}
                  onValueChange={(val) => setCreatedByFilter(val || 'all')}
                >
                  <SelectTrigger className="h-9 rounded-lg border-[#DCE2EB] text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Skyline Demo Travels Ltd">
                      Skyline Demo Travels Ltd
                    </SelectItem>
                    <SelectItem value="Banani Desk">Banani Desk</SelectItem>
                    <SelectItem value="Mirpur Desk">Mirpur Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 5: Supplier */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider">
                  Supplier
                </label>
                <Select defaultValue="unavailable" disabled>
                  <SelectTrigger className="h-9 rounded-lg border-[#DCE2EB] text-xs bg-[#F8FAFC] text-[#94A3B8]">
                    <SelectValue placeholder="Supplier data unavailable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unavailable">
                      Supplier data unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 6: From Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider truncate block">
                  Booking Date — From
                </label>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder="Select start date"
                  className="h-9 rounded-lg text-xs"
                  clearable
                />
              </div>

              {/* Filter 7: To Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider block">
                  To
                </label>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  placeholder="Select end date"
                  className="h-9 rounded-lg text-xs"
                  clearable
                />
              </div>
            </div>

            {/* Records count line */}
            <div className="pt-2 text-xs text-[#5A6E85]">
              Showing{' '}
              <span className="font-extrabold text-[#001A3D]">
                {filteredRecords.length}
              </span>{' '}
              commission records
            </div>

            {/* Table */}
            <div className="rounded-xl border border-[#E6EAF0] overflow-x-auto bg-white shadow-xs">
              <DataTable
                data={filteredRecords}
                columns={columns}
                getRowId={(row) => row.id}
                headerClassName="bg-[#F8FAFC]"
                headerRowClassName="border-b border-[#E6EAF0] hover:bg-transparent"
                rowClassName={(row) =>
                  cn(
                    'border-b border-[#E6EAF0] hover:bg-[#F8FAFC] transition-colors',
                    row.original.commissionStatus === 'Commission reversed' &&
                      'bg-slate-50/50',
                  )
                }
                emptyCellClassName="text-center py-8 text-xs text-[#5A6E85]"
                empty="No commission records found matching the active filters."
              />
            </div>

            {/* Table Footnote */}
            <p className="text-[11px] text-[#5A6E85] leading-relaxed pt-1">
              Commission statuses: Pending, Earned, Settled. A cancellation or
              refund reverses commission — shown as an impact, not a status.
            </p>
          </section>

          {/* Section 4: 6 Bottom Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Confirmed bookings */}
            <div className="bg-white rounded-2xl border border-[#E6EAF0] p-5 space-y-2 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A3D]">
                  <CheckCircle2 className="size-4 text-[#107C41]" />
                  <span>Confirmed bookings</span>
                </div>
                <p className="text-xs text-[#5A6E85] leading-relaxed">
                  Commission is calculated on each confirmed booking, where an
                  applicable commission rule exists.
                </p>
              </div>
            </div>

            {/* Card 2: Cancellations and refunds */}
            <div className="bg-white rounded-2xl border border-[#E6EAF0] p-5 space-y-2 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A3D]">
                  <RotateCcw className="size-4 text-[#0066CC]" />
                  <span>Cancellations and refunds</span>
                </div>
                <p className="text-xs text-[#5A6E85] leading-relaxed">
                  Commission is reversed on cancellation or refund. Reversed
                  commission is not included in active commission totals.
                </p>
              </div>
            </div>

            {/* Card 3: Settlement */}
            <div className="bg-white rounded-2xl border border-[#E6EAF0] p-5 space-y-2 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A3D]">
                  <Building2 className="size-4 text-[#0066CC]" />
                  <span>Settlement</span>
                </div>
                <p className="text-xs text-[#5A6E85] leading-relaxed">
                  Settlement payments are recorded manually by Aero Wing Admin.
                  The settlement method is not shown here.
                </p>
              </div>
            </div>

            {/* Card 4: Created By */}
            <div className="bg-white rounded-2xl border border-[#E6EAF0] p-5 space-y-2 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A3D]">
                  <Users className="size-4 text-[#0066CC]" />
                  <span>Created By</span>
                </div>
                <p className="text-xs text-[#5A6E85] leading-relaxed">
                  Created By shows where a booking came from (Parent Agent or
                  Sub-agent). This page tracks Skyline Demo Travels Ltd’s Agent
                  commission.
                </p>
              </div>
            </div>

            {/* Card 5: Wallet Ledger */}
            <div className="bg-white rounded-2xl border border-[#E6EAF0] p-5 space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A3D]">
                  <Wallet className="size-4 text-[#0066CC]" />
                  <span>Wallet Ledger</span>
                </div>
                <p className="text-xs text-[#5A6E85] leading-relaxed">
                  Commission-related wallet activity may appear in the Wallet
                  Ledger where recorded.
                </p>
              </div>
              <div>
                <a
                  href="/wallet?view=ledger"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0066CC] hover:underline"
                >
                  <span>View Wallet Ledger</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Card 6: Commission and markup */}
            <div className="bg-white rounded-2xl border border-[#E6EAF0] p-5 space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A3D]">
                  <Tag className="size-4 text-[#0066CC]" />
                  <span>Commission and markup</span>
                </div>
                <p className="text-xs text-[#5A6E85] leading-relaxed">
                  Commission is separate from your client markup. Markup rules
                  are managed under Pricing & Markup.
                </p>
              </div>
              <div>
                <a
                  href="/pricing-markup"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0066CC] hover:underline"
                >
                  <span>View Pricing & Markup</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Page Footer */}
        <footer className="mt-auto border-t border-[#DCE2EB] bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5A6E85]">
          <p>AeroWing Agent Portal · M2.9 Commission Tracking · Website</p>
          <p>
            Design prototype — no commission, settlement, booking or supplier
            system is called.
          </p>
        </footer>
      </div>

      {/* Commission Details Sheet / Drawer */}
      <CommissionDetailsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        record={selectedRecord}
      />
    </div>
  )
}

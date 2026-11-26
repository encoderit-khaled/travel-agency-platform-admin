import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  ArrowLeft,
  Info,
  Building2,
  CheckCircle2,
  Eye,
  Percent,
  Plane,
  Building,
  Package,
  Compass,
  Car,
  Ticket,
  Clock,
  XCircle,
  BarChart2,
  Shield,
  ArrowRight,
  TrendingUp,
  CreditCard,
  User,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  AgentPortalSidebar,
  AgentPortalHeader,
} from '#/components/agent-portal'
import { SubAgentPermissionsModal } from './sub-agent-permissions-modal'
import { BookingDetailsSheet } from './booking-details-sheet'
import { SubAgentBookingsPage } from './sub-agent-bookings-page'
import { SubAgentPerformancePage } from './sub-agent-performance-page'
import {
  MIRPUR_DESK_DETAILS,
  SUB_AGENT_BOOKINGS,
  SUB_AGENT_PERMISSIONS,
} from './data'
import type {
  SubAgentBookingRecord,
  BookingServiceType,
  PermissionItem,
} from './types'

interface SubAgentDetailsPageProps {
  initialBookingRef?: string
  initialTab?:
    'overview' | 'permissions' | 'markup' | 'bookings' | 'performance'
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

export function SubAgentDetailsPage({
  initialBookingRef = 'AW-DEMO-FL-001',
  initialTab = 'overview',
}: SubAgentDetailsPageProps) {
  const isContentLoading = useContentLoading()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'permissions' | 'markup' | 'bookings' | 'performance'
  >(initialTab)

  // Sub-agent details state
  const desk = MIRPUR_DESK_DETAILS
  const [bookings] = React.useState<SubAgentBookingRecord[]>(SUB_AGENT_BOOKINGS)
  const [permissions] = React.useState<PermissionItem[]>(SUB_AGENT_PERMISSIONS)

  // Booking details slide-over state
  const initialBooking =
    bookings.find((b) => b.ref === initialBookingRef) || bookings[0] || null
  const [selectedBooking, setSelectedBooking] =
    React.useState<SubAgentBookingRecord | null>(initialBooking)
  const [isBookingSheetOpen, setIsBookingSheetOpen] = React.useState(
    Boolean(initialBookingRef),
  )

  // Permissions modal state
  const [permissionsModalOpen, setPermissionsModalOpen] = React.useState(false)

  const handleOpenBooking = (bk: SubAgentBookingRecord) => {
    setSelectedBooking(bk)
    setIsBookingSheetOpen(true)
  }

  const bookingColumns = React.useMemo<ColumnDef<SubAgentBookingRecord>[]>(
    () => [
      {
        id: 'reference',
        header: 'BOOKING REFERENCE / CUSTOMER',
        cell: ({ row }) => {
          const bk = row.original
          return (
            <>
              <div className="font-mono text-xs font-bold text-[#0267B8]">
                {bk.ref}
              </div>
              <div className="text-xs font-extrabold text-[#012A5E] mt-0.5">
                {bk.customer}
              </div>
            </>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3',
          cellClassName: 'py-3',
        },
      },
      {
        accessorKey: 'service',
        header: 'SERVICE',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs font-bold text-[#012A5E]">
            {getServiceIcon(row.original.service)}
            <span>{row.original.service}</span>
          </div>
        ),
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3',
          cellClassName: 'py-3',
        },
      },
      {
        accessorKey: 'travelDate',
        header: 'TRAVEL DATE',
        cell: ({ row }) => row.original.travelDate,
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3',
          cellClassName: 'py-3 text-xs font-semibold text-[#4F5B70]',
        },
      },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => {
          const bk = row.original
          return (
            <>
              {bk.status === 'Ticketed' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
                  <Ticket className="size-3" />
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
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3',
          cellClassName: 'py-3',
        },
      },
      {
        accessorKey: 'documentStatus',
        header: 'DOCUMENT',
        cell: ({ row }) => {
          const bk = row.original
          return bk.documentStatus === 'E-ticket available' ? (
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0B6A45] flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>E-ticket available</span>
              </div>
              <button
                onClick={() => handleOpenBooking(bk)}
                className="text-[11px] font-bold text-[#0267B8] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>View E-ticket</span>
                <ArrowRight className="size-2.5" />
              </button>
            </div>
          ) : bk.documentStatus === 'Voucher available' ? (
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0B6A45] flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Voucher available</span>
              </div>
              <button
                onClick={() => handleOpenBooking(bk)}
                className="text-[11px] font-bold text-[#0267B8] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>View Voucher</span>
                <ArrowRight className="size-2.5" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-[#8C9BAE] font-medium">
              {bk.documentStatus}
            </span>
          )
        },
        meta: {
          headerClassName:
            'text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3',
          cellClassName: 'py-3',
        },
      },
      {
        id: 'action',
        header: 'ACTION',
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
            'text-right text-[11px] font-bold uppercase tracking-wider text-[#64748B] py-3 pr-4',
          cellClassName: 'py-3 text-right pr-4',
        },
      },
    ],
    [handleOpenBooking],
  )

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
          userName="Demo Staff User"
          agencyName="Skyline Demo Travels Ltd"
        />

        <main className="flex-1 max-w-350 w-full mx-auto px-4 sm:px-8 py-6 pb-20 space-y-6">
          {/* Back link */}
          <div>
            <Link
              to="/sub-agents"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors py-1 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Sub-agents</span>
            </Link>
          </div>

          {/* Desk Header Banner */}
          <section className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="size-14 rounded-2xl bg-[#012A5E] text-[#F1C134] font-black text-xl flex items-center justify-center ring-4 ring-[#EAF4FD] shadow-sm shrink-0">
                  {desk.initials}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0267B8] tracking-wide mb-0.5">
                    {desk.eyebrow}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#012A5E] tracking-tight">
                    {desk.displayName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs text-[#4F5B70]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <User className="size-3.5 text-[#0267B8]" />
                      {desk.role}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-semibold text-[#012A5E]">
                      <Building2 className="size-3.5 text-[#0267B8]" />
                      Parent: {desk.parentAgent}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0]">
                      <Info className="size-3 text-[#64748B]" />
                      Sample data
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  onClick={() => setPermissionsModalOpen(true)}
                  className="bg-white border border-[#DCE2EB] text-[#012A5E] hover:bg-[#F8FAFC] font-extrabold text-xs px-4 py-2.5 h-auto rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Shield className="size-4 text-[#0267B8]" />
                  <span>Configure Permissions</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    alert(
                      'Markup configuration dialog: Default markup is applied to flight and hotel search.',
                    )
                  }
                  className="bg-white border border-[#DCE2EB] text-[#012A5E] hover:bg-[#F8FAFC] font-extrabold text-xs px-4 py-2.5 h-auto rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Percent className="size-4 text-[#0267B8]" />
                  <span>Configure Markup</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    alert('Edit Details modal for ' + desk.displayName)
                  }
                  className="border-[#DCE2EB] text-[#0267B8] hover:bg-[#F4F6FA] font-extrabold text-xs px-4 py-2.5 h-auto rounded-xl transition-colors flex items-center gap-2 cursor-pointer bg-white"
                >
                  <span>Edit Details</span>
                </Button>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <div className="border-b border-[#DCE2EB] flex items-center gap-2 overflow-x-auto pb-px">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'permissions', label: 'Permissions' },
              { id: 'markup', label: 'Markup' },
              { id: 'bookings', label: `Bookings (${bookings.length})` },
              { id: 'performance', label: 'Performance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#0267B8] text-[#0267B8]'
                    : 'border-transparent text-[#64748B] hover:text-[#012A5E]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 KPI Summary Cards */}
              {isContentLoading ? (
                <CardGridSkeleton
                  count={4}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  cardClassName="h-32 rounded-2xl"
                />
              ) : null}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isContentLoading ? "hidden" : ""}`}>
                {/* 1. Permissions Card */}
                <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-3">
                      <Shield className="size-4.5" />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Permissions
                    </div>
                    <div className="text-base font-extrabold text-[#012A5E] mt-1">
                      {desk.permissionsPreset}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B6A45] mt-1">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>Configured</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPermissionsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors mt-4 pt-3 border-t border-[#F1F3F6] cursor-pointer"
                  >
                    <span>View Permissions</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>

                {/* 2. Markup Card */}
                <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-3">
                      <Percent className="size-4.5" />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Markup
                    </div>
                    <div className="text-base font-extrabold text-[#012A5E] mt-1">
                      {desk.markupStatusText}
                    </div>
                    <div className="text-xs text-[#64748B] mt-1">
                      {desk.markupNote}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('markup')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors mt-4 pt-3 border-t border-[#F1F3F6] cursor-pointer"
                  >
                    <span>Configure Markup</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>

                {/* 3. Bookings Card */}
                <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-3">
                      <Ticket className="size-4.5" />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Bookings
                    </div>
                    <div className="text-base font-extrabold text-[#012A5E] mt-1">
                      {desk.bookingsCount} Bookings
                    </div>
                    <div className="text-xs text-[#64748B] mt-1">
                      {desk.bookingsNote}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors mt-4 pt-3 border-t border-[#F1F3F6] cursor-pointer"
                  >
                    <span>View Bookings</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>

                {/* 4. Performance Card */}
                <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-3">
                      <TrendingUp className="size-4.5" />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Performance
                    </div>
                    <div className="text-base font-extrabold text-[#012A5E] mt-1">
                      Performance Available
                    </div>
                    <div className="text-xs text-[#64748B] mt-1">
                      {desk.performanceNote}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('performance')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors mt-4 pt-3 border-t border-[#F1F3F6] cursor-pointer"
                  >
                    <span>View Performance</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>

              {/* Desk Information Card */}
              <div className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                      <Building2 className="size-4" />
                    </div>
                    <h2 className="text-base font-extrabold text-[#012A5E]">
                      Desk Information
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Edit information modal')}
                    className="text-xs font-bold text-[#0267B8] border-[#DCE2EB]"
                  >
                    Edit Info
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Role
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-1">
                      {desk.role}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Parent Agency
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-1">
                      {desk.parentAgent}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Contact Person
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-1">
                      {desk.contactPerson}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Login Email
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-1">
                      {desk.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Mobile
                    </span>
                    <p className="text-xs font-bold text-[#012A5E] mt-1">
                      {desk.mobile}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Internal Note
                    </span>
                    <p className="text-xs font-medium text-[#4F5B70] mt-1">
                      {desk.internalNote}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mt-4 flex items-center gap-3">
                  <CreditCard className="size-4.5 text-[#0267B8] shrink-0" />
                  <div className="text-xs text-[#4F5B70]">
                    <span className="font-bold text-[#012A5E]">
                      Settlement Terms:{' '}
                    </span>
                    {desk.settlementTerms}
                  </div>
                </div>
              </div>

              {/* Recent Bookings Section & Table */}
              <div className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                      <Ticket className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-[#012A5E]">
                        Recent Bookings
                      </h2>
                      <p className="text-xs text-[#64748B]">
                        Recent bookings created by {desk.displayName}.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-[#0267B8] border-[#DCE2EB]"
                  >
                    View All {bookings.length} Bookings →
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-[#E6EAF0]">
                  <DataTable
                    data={bookings}
                    columns={bookingColumns}
                    getRowId={(row) => row.id}
                    headerClassName="bg-[#F8FAFC]"
                    headerRowClassName="border-[#E6EAF0] hover:bg-[#F8FAFC]"
                    rowClassName="hover:bg-[#F8FAFC] border-[#E6EAF0] transition-colors"
                  />
                </div>
              </div>

              {/* Performance Section */}
              <div className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F1F3F6]">
                  <div className="size-8 rounded-lg bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                    <BarChart2 className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#012A5E]">
                      Performance
                    </h2>
                    <p className="text-xs text-[#64748B]">Sub-agent report</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-dashed border-[#DCE2EB] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-slate-100 text-[#8C9BAE] flex items-center justify-center">
                      <BarChart2 className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#012A5E]">
                        No performance data available yet
                      </div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">
                        Performance appears once this Sub-agent has booking
                        activity.
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('performance')}
                    className="text-xs font-bold text-[#0267B8] border-[#DCE2EB] bg-white cursor-pointer"
                  >
                    View Sub-agent Report →
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PERMISSIONS TAB */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
                  <div>
                    <h2 className="text-base font-extrabold text-[#012A5E]">
                      Sub-agent Permissions Matrix
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Active access permissions configured for{' '}
                      {desk.displayName}.
                    </p>
                  </div>
                  <Button
                    onClick={() => setPermissionsModalOpen(true)}
                    className="bg-[#012A5E] text-white hover:bg-[#012248] text-xs font-bold"
                  >
                    Manage Permissions
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissions.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-[#E6EAF0] bg-white flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#012A5E]">
                          {p.label}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-1">
                          {p.description}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${
                          p.status === 'allowed'
                            ? 'bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200'
                            : p.status === 'view_only'
                              ? 'bg-[#EAF4FD] text-[#0267B8] border border-blue-200'
                              : 'bg-[#F1F3F6] text-[#64748B] border border-slate-200'
                        }`}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MARKUP TAB */}
          {activeTab === 'markup' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
                  <div>
                    <h2 className="text-base font-extrabold text-[#012A5E]">
                      Markup Configuration
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Pricing adjustment rules applied to sub-agent searches.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      window.location.href = '/sub-agents/markup'
                    }}
                    className="bg-[#012A5E] text-white hover:bg-[#012248] text-xs font-bold cursor-pointer"
                  >
                    Configure Markup Now
                  </Button>
                </div>

                <div className="p-8 rounded-xl border border-dashed border-[#DCE2EB] bg-[#F8FAFC] text-center max-w-lg mx-auto">
                  <Percent className="size-8 text-[#8C9BAE] mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-bold text-[#012A5E]">
                    Markup was not configured during desk creation
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    "Configure later" was selected. Parent agency base prices
                    are currently passed through without markup.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <SubAgentBookingsPage
              isStandalone={false}
              initialBookingRef={initialBookingRef}
            />
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'performance' && (
            <SubAgentPerformancePage
              deskName={desk.displayName}
              initialBookingRef={initialBookingRef}
              isStandalone={false}
            />
          )}

          {/* Bottom attribution */}
          <div className="text-center pt-8 pb-4">
            <p className="text-xs text-[#8C9BAE]">
              AeroWing Agent Portal · M2.2 Sub-agent Functionality and Hierarchy
              · Sub-agent Details (Figma #686:2127 & #696:9753)
            </p>
          </div>
        </main>
      </div>

      {/* Booking Details Drawer / Slide-Over Sheet (Figma Node #696:9753) */}
      <BookingDetailsSheet
        open={isBookingSheetOpen}
        onOpenChange={setIsBookingSheetOpen}
        booking={selectedBooking}
        subAgentName={desk.displayName}
        parentAgentName={desk.parentAgent}
      />

      {/* Configure Permissions Modal */}
      <SubAgentPermissionsModal
        open={permissionsModalOpen}
        onOpenChange={setPermissionsModalOpen}
        subAgentName={desk.displayName}
        parentAgentName={desk.parentAgent}
        initialPreset="standard"
        onSave={() => {
          alert('Permissions saved successfully.')
          setPermissionsModalOpen(false)
        }}
      />
    </div>
  )
}

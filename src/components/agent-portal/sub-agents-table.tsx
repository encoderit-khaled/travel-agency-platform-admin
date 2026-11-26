import * as React from 'react'
import {
  Users,
  Search,
  X,
  RotateCcw,
  Info,
  Mail,
  Phone,
  Check,
  Minus,
  CalendarDays,
  Eye,
  MoreHorizontal,
  ArrowRight,
  Shield,
  Percent,
} from 'lucide-react'
import { Input } from '#/components/ui/input'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/components/ui/select'
import { EmptyState } from '#/components/ui/empty-state'
import type {
  SubAgent,
  SubAgentFilterStatus,
  SubAgentFilterBooking,
} from './types'

interface SubAgentsTableProps {
  subAgents: SubAgent[]
  searchQuery: string
  onSearchChange: (q: string) => void
  statusFilter: SubAgentFilterStatus
  onStatusFilterChange: (status: SubAgentFilterStatus) => void
  bookingFilter: SubAgentFilterBooking
  onBookingFilterChange: (booking: SubAgentFilterBooking) => void
  onClearFilters: () => void
  onViewDetails: (sa: SubAgent) => void
  onViewPermissions: (sa: SubAgent) => void
  onViewMarkup: (sa: SubAgent) => void
  onViewBookings: (sa: SubAgent) => void
  onToggleStatus: (sa: SubAgent) => void
  initialDropdownOpen?: boolean
  dropdownSubAgentId?: string
}

export function SubAgentsTable({
  subAgents,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  bookingFilter,
  onBookingFilterChange,
  onClearFilters,
  onViewDetails,
  onViewPermissions,
  onViewMarkup,
  onViewBookings,
  onToggleStatus,
  initialDropdownOpen = false,
  dropdownSubAgentId,
}: SubAgentsTableProps) {
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(
    () => {
      if (initialDropdownOpen) {
        return dropdownSubAgentId || subAgents[0]?.id || null
      }
      return null
    },
  )

  React.useEffect(() => {
    if (initialDropdownOpen) {
      setOpenDropdownId(dropdownSubAgentId || subAgents[0]?.id || null)
    }
  }, [initialDropdownOpen, dropdownSubAgentId, subAgents])

  // Filter sub-agents
  const filteredSubAgents = React.useMemo(() => {
    return subAgents.filter((sa) => {
      // Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesName = sa.name.toLowerCase().includes(query)
        const matchesEmail = sa.email.toLowerCase().includes(query)
        const matchesPhone = sa.phone
          ? sa.phone.toLowerCase().includes(query)
          : false
        if (!matchesName && !matchesEmail && !matchesPhone) return false
      }

      // Status filter
      if (
        statusFilter === 'permissions_configured' &&
        !sa.permissionsConfigured
      )
        return false
      if (statusFilter === 'permissions_needed' && sa.permissionsConfigured)
        return false
      if (statusFilter === 'markup_configured' && !sa.markupConfigured)
        return false
      if (statusFilter === 'markup_needed' && sa.markupConfigured) return false

      // Booking filter
      if (bookingFilter === 'has_bookings' && sa.bookingsCount === 0)
        return false
      if (bookingFilter === 'no_bookings' && sa.bookingsCount > 0) return false

      return true
    })
  }, [subAgents, searchQuery, statusFilter, bookingFilter])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    bookingFilter !== 'all'

  const columns = React.useMemo<ColumnDef<SubAgent>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Sub-agent',
        cell: ({ row }) => {
          const sa = row.original
          return (
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-[#012A5E] text-[#F1C134] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {sa.avatarInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-[#141C2E] text-sm leading-snug">
                  {sa.name}
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EAF4FD] text-[#0267B8] text-[11px] font-bold">
                    {sa.role}
                  </span>
                  {sa.status === 'suspended' && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                      Suspended
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        },
        meta: {
          headerClassName:
            'w-75 text-xs font-extrabold text-[#4F5B70] uppercase tracking-wider py-3.5 pl-6',
          cellClassName: 'py-4 pl-6 align-top',
        },
      },
      {
        id: 'login',
        header: 'Login / Contact',
        cell: ({ row }) => {
          const sa = row.original
          return (
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-[11px] font-bold text-[#8C9BAE] uppercase tracking-wider">
                Login
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-[#141C2E]">
                <Mail className="size-3.5 text-[#0267B8] shrink-0" />
                <span className="truncate max-w-50" title={sa.email}>
                  {sa.email}
                </span>
              </div>
              {sa.phone && (
                <div className="flex items-center gap-1.5 font-medium text-[#4F5B70] mt-0.5">
                  <Phone className="size-3.5 text-[#8C9BAE] shrink-0" />
                  <span>{sa.phone}</span>
                </div>
              )}
            </div>
          )
        },
        meta: {
          headerClassName:
            'w-70 text-xs font-extrabold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-top',
        },
      },
      {
        id: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
          const sa = row.original
          return (
            <div className="flex flex-col items-start gap-1.5">
              {sa.permissionsConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAFBF1] text-[#0B6A45] text-xs font-bold">
                  <Check className="size-3.5" />
                  Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F3F6] text-[#4F5B70] text-xs font-bold">
                  <Minus className="size-3" />
                  Not configured
                </span>
              )}
              <button
                type="button"
                onClick={() => onViewPermissions(sa)}
                className="group flex items-center gap-1 text-xs font-bold text-[#0267B8] hover:text-[#012A5E] mt-0.5 cursor-pointer"
              >
                <span>View Permissions</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )
        },
        meta: {
          headerClassName:
            'w-50 text-xs font-extrabold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-top',
        },
      },
      {
        id: 'markup',
        header: 'Markup',
        cell: ({ row }) => {
          const sa = row.original
          return (
            <div className="flex flex-col items-start gap-1.5">
              {sa.markupConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAFBF1] text-[#0B6A45] text-xs font-bold">
                  <Check className="size-3.5" />
                  Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F3F6] text-[#4F5B70] text-xs font-bold">
                  <Minus className="size-3" />
                  Not configured
                </span>
              )}
              <button
                type="button"
                onClick={() => onViewMarkup(sa)}
                className="group flex items-center gap-1 text-xs font-bold text-[#0267B8] hover:text-[#012A5E] mt-0.5 cursor-pointer"
              >
                <span>View Markup</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )
        },
        meta: {
          headerClassName:
            'w-45 text-xs font-extrabold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-top',
        },
      },
      {
        id: 'bookings',
        header: 'Bookings',
        cell: ({ row }) => {
          const sa = row.original
          return (
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-xs font-extrabold text-[#141C2E]">
                {sa.bookingsCount === 0
                  ? 'No bookings'
                  : `${sa.bookingsCount} ${sa.bookingsCount === 1 ? 'booking' : 'bookings'}`}
              </span>
              <button
                type="button"
                onClick={() => onViewBookings(sa)}
                className="group flex items-center gap-1 text-xs font-bold text-[#0267B8] hover:text-[#012A5E] mt-0.5 cursor-pointer"
              >
                <span>View Bookings</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )
        },
        meta: {
          headerClassName:
            'w-40 text-xs font-extrabold text-[#4F5B70] uppercase tracking-wider py-3.5',
          cellClassName: 'py-4 align-top',
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const sa = row.original
          const isDropdownOpen = openDropdownId === sa.id
          return (
            <div className="relative inline-flex items-center justify-end gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewDetails(sa)}
                className="size-9 rounded-xl border-[#DCE2EB] text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]"
                title={`View ${sa.name} Details`}
                aria-label={`View Sub-agent ${sa.name}`}
              >
                <Eye className="size-4" />
              </Button>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={(open) =>
                  setOpenDropdownId(open ? sa.id : null)
                }
              >
                <DropdownMenuTrigger
                  className={`size-9 rounded-xl border border-[#DCE2EB] bg-white text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] ${
                    isDropdownOpen
                      ? 'bg-[#F4F6FA] text-[#012A5E] border-[#012A5E]/30'
                      : ''
                  }`}
                  title={`More actions for ${sa.name}`}
                  aria-label={`More actions for ${sa.name}`}
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 p-1.5 text-left"
                >
                  <DropdownMenuItem
                    onClick={() => onViewDetails(sa)}
                    className="gap-2.5 px-3 py-2 text-xs font-bold text-[#141C2E]"
                  >
                    <Eye className="size-3.5 text-[#0267B8]" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onViewPermissions(sa)}
                    className="gap-2.5 px-3 py-2 text-xs font-bold text-[#141C2E]"
                  >
                    <Shield className="size-3.5 text-[#0267B8]" />
                    <span>Configure Permissions</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onViewMarkup(sa)}
                    className="gap-2.5 px-3 py-2 text-xs font-bold text-[#141C2E]"
                  >
                    <Percent className="size-3.5 text-[#B45309]" />
                    <span>Set Markup Rules</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onViewBookings(sa)}
                    className="gap-2.5 px-3 py-2 text-xs font-bold text-[#141C2E]"
                  >
                    <CalendarDays className="size-3.5 text-[#0B6A45]" />
                    <span>View Bookings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#F1F3F6]" />
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(sa)}
                    className={`gap-2.5 px-3 py-2 text-xs font-bold ${
                      sa.status === 'active'
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600'
                        : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600'
                    }`}
                  >
                    <span>
                      {sa.status === 'active'
                        ? 'Suspend Sub-agent'
                        : 'Reactivate Sub-agent'}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
        meta: {
          headerClassName:
            'w-30 text-xs font-extrabold text-[#4F5B70] uppercase tracking-wider py-3.5 text-right pr-6',
          cellClassName: 'py-4 pr-6 align-top text-right',
        },
      },
    ],
    [
      onToggleStatus,
      onViewBookings,
      onViewDetails,
      onViewMarkup,
      onViewPermissions,
      openDropdownId,
    ],
  )

  return (
    <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Table Section Header */}
      <div className="px-5 py-4 border-b border-[#F1F3F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
            <Users className="size-4" />
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#012A5E] tracking-tight">
            All Sub-agents
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F6FA] border border-[#E6EAF0] text-[#4F5B70] text-xs font-semibold">
          <Info className="size-3.5 text-[#0267B8]" />
          <span>Sample data for design preview</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 bg-white border-b border-[#F1F3F6] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#7B7B7B] pointer-events-none" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by sub-agent name, email, or phone..."
            className="h-11 pl-9 pr-8 rounded-xl bg-white border-[#DCE2EB] text-xs sm:text-sm text-[#012A5E] placeholder:text-[#7B7B7B] focus-visible:ring-1 focus-visible:ring-[#0267B8]/20 focus-visible:border-[#0267B8]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#7B7B7B] hover:text-[#012A5E]"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Reset */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5">
          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                if (val) onStatusFilterChange(val)
              }}
            >
              <SelectTrigger className="h-11 rounded-xl text-xs sm:text-sm bg-white border-[#DCE2EB]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All sub-agents</SelectItem>
                <SelectItem value="permissions_configured">
                  Permissions: Configured
                </SelectItem>
                <SelectItem value="permissions_needed">
                  Permissions: Need config
                </SelectItem>
                <SelectItem value="markup_configured">
                  Markup: Configured
                </SelectItem>
                <SelectItem value="markup_needed">
                  Markup: Need config
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={bookingFilter}
              onValueChange={(val) => {
                if (val) onBookingFilterChange(val)
              }}
            >
              <SelectTrigger className="h-11 rounded-xl text-xs sm:text-sm bg-white border-[#DCE2EB]">
                <SelectValue placeholder="Booking activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Activity: All</SelectItem>
                <SelectItem value="has_bookings">Has bookings</SelectItem>
                <SelectItem value="no_bookings">No bookings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-11 px-3.5 rounded-xl border-[#DCE2EB] text-[#0267B8] hover:bg-[#F4F6FA] text-xs font-bold shrink-0"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Summary Count Bar */}
      <div className="px-5 py-2.5 bg-[#FAFBFD] border-b border-[#F1F3F6] flex items-center justify-between text-xs font-bold text-[#4F5B70]">
        <p>
          Showing{' '}
          <span className="font-extrabold text-[#012A5E]">
            {filteredSubAgents.length}
          </span>{' '}
          of{' '}
          <span className="font-extrabold text-[#012A5E]">
            {subAgents.length}
          </span>{' '}
          Sub-agents
        </p>
      </div>

      {/* Sub-agents Table */}
      <div className="overflow-x-auto">
        <DataTable
          data={filteredSubAgents}
          columns={columns}
          getRowId={(row) => row.id}
          tableClassName="w-full min-w-235"
          headerRowClassName="bg-[#D7E3F4]/50 hover:bg-[#D7E3F4]/50 border-y border-[#DCE2EB]"
          rowClassName="hover:bg-[#F8FAFC] border-b border-[#E6EAF0] transition-colors"
          emptyCellClassName="h-64 text-center"
          empty={
            <div className="max-w-md mx-auto py-8">
              <EmptyState
                title="No matching sub-agents"
                description="No sub-agents match the applied search query or status filter. Try clearing your search parameters."
                action={{
                  label: 'Reset all filters',
                  onClick: onClearFilters,
                }}
              />
            </div>
          }
        />
      </div>

      {/* Table Footer matching Figma #665:7284 */}
      <div className="px-5 py-3.5 bg-white border-t border-[#F1F3F6] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8C9BAE]">
        <span className="font-semibold text-[#4F5B70] text-center sm:text-left">
          AeroWing Agent Portal · M2.2 Sub-agent Functionality and Hierarchy ·
          Sub-agent Management Overview
        </span>
        <span className="text-[11px] font-medium">
          Showing all {filteredSubAgents.length} records
        </span>
      </div>
    </section>
  )
}

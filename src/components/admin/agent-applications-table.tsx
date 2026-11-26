import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import type {
  SortingState,
  ColumnFiltersState,
  FilterFn,
} from '@tanstack/react-table'
import {
  Search,
  X,
  Clock,
  CheckCircle2,
  CircleX as XCircle,
  AlertOctagon,
  ArrowRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '#/components/ui/table'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { FlightOrbitLoader } from '#/components/ui/flight-orbit-loader'
import { useContentLoading } from '#/hooks/use-content-loading'
import { Badge } from '#/components/ui/badge'
import { EmptyState } from '#/components/ui/empty-state'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/components/ui/select'
import type { AgentApplication, ApplicationStatus } from './types'

interface AgentApplicationsTableProps {
  applications: AgentApplication[]
  activeTab: 'pending' | 'all'
  onTabChange: (tab: 'pending' | 'all') => void
  selectedStatusFilter?: ApplicationStatus | null
  statusFilter?: ApplicationStatus | null
  onStatusFilterChange?: (status: ApplicationStatus | null) => void
  onReviewClick: (app: AgentApplication) => void
  initialSearch?: string
  forceNoDataMatch?: boolean
  onToggleForceNoData?: () => void
}

const columnHelper = createColumnHelper<AgentApplication>()

// Custom global filter searching across application text fields
const globalFilterFn: FilterFn<AgentApplication> = (
  row,
  _columnId,
  filterValue: string,
) => {
  if (!filterValue) return true
  const q = filterValue.toLowerCase().trim()
  const app = row.original
  return (
    app.reference.toLowerCase().includes(q) ||
    app.businessName.toLowerCase().includes(q) ||
    app.tradingName.toLowerCase().includes(q) ||
    app.primaryContact.toLowerCase().includes(q) ||
    app.email.toLowerCase().includes(q) ||
    app.country.toLowerCase().includes(q) ||
    app.city.toLowerCase().includes(q) ||
    app.businessType.toLowerCase().includes(q)
  )
}

export function AgentApplicationsTable({
  applications,
  activeTab,
  onTabChange,
  selectedStatusFilter,
  statusFilter,
  onStatusFilterChange,
  onReviewClick,
  initialSearch = '',
  forceNoDataMatch = false,
  onToggleForceNoData: _onToggleForceNoData,
}: AgentApplicationsTableProps) {
  const currentStatusFilter =
    statusFilter !== undefined ? statusFilter : selectedStatusFilter
  const [globalFilter, setGlobalFilter] = React.useState(initialSearch)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [countryFilter, setCountryFilter] = React.useState('all')
  const [docFilter, setDocFilter] = React.useState('all')
  const isContentLoading = useContentLoading()

  // Keep search in sync if initialSearch changes
  React.useEffect(() => {
    setGlobalFilter(initialSearch)
  }, [initialSearch])

  // If forceNoDataMatch is active, use empty data set
  const dataToUse = React.useMemo(() => {
    if (forceNoDataMatch) return []
    return applications
  }, [applications, forceNoDataMatch])

  // Available unique countries from dataset
  const countries = React.useMemo(() => {
    const list = Array.from(new Set(applications.map((a) => a.country)))
    return list.filter(Boolean)
  }, [applications])

  // Status Badge Renderer matching Figma colors exactly
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-[#DDE9F8] text-[#012A5E] hover:bg-[#DDE9F8] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
            <Clock className="size-3.5" />
            Pending Review
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#E8F5E9] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
            <CheckCircle2 className="size-3.5" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-[#FCE8E6] text-[#B71C1C] hover:bg-[#FCE8E6] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
            <XCircle className="size-3.5" />
            Rejected
          </Badge>
        )
      case 'suspended':
        return (
          <Badge className="bg-[#FFF8E1] text-[#B45309] hover:bg-[#FFF8E1] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
            <AlertOctagon className="size-3.5" />
            Suspended
          </Badge>
        )
    }
  }

  // TanStack Table Column Definitions
  const columns = React.useMemo(
    () => [
      columnHelper.accessor('reference', {
        header: ({ column }) => (
          <Button
            variant="plain"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-2 h-7 font-bold text-[#4F5B70] hover:text-[#012A5E] uppercase tracking-wider text-[11px]"
          >
            <span>Application</span>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 size-3 text-[#0267B8]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 size-3 text-[#0267B8]" />
            ) : (
              <ArrowUpDown className="ml-1 size-3 opacity-40" />
            )}
          </Button>
        ),
        cell: (info) => {
          const app = info.row.original
          return (
            <div className="flex flex-col items-start gap-1 py-1">
              <span className="text-xs text-[#4F5B70] font-semibold tracking-tight">
                {info.getValue()}
              </span>
              {app.isDemo && (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#FFF8E7] text-[#92400E] border border-[#E1BA6D]/60 tracking-wider">
                  QA DEMO DATA
                </span>
              )}
            </div>
          )
        },
      }),

      columnHelper.accessor('businessName', {
        header: ({ column }) => (
          <Button
            variant="plain"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-2 h-7 font-bold text-[#4F5B70] hover:text-[#012A5E] uppercase tracking-wider text-[11px]"
          >
            <span>Business</span>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 size-3 text-[#0267B8]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 size-3 text-[#0267B8]" />
            ) : (
              <ArrowUpDown className="ml-1 size-3 opacity-40" />
            )}
          </Button>
        ),
        cell: (info) => {
          const app = info.row.original
          return (
            <div className="flex flex-col py-1">
              <span className="font-extrabold text-[#012A5E] text-sm">
                {info.getValue()}
              </span>
              <span className="text-xs text-[#4F5B70] font-medium">
                {app.businessType}
              </span>
              <span className="text-xs text-[#8C9BAE]">
                {app.city ? `${app.city}, ${app.country}` : app.country}
              </span>
            </div>
          )
        },
      }),

      columnHelper.accessor('primaryContact', {
        header: 'Primary Contact',
        cell: (info) => {
          const app = info.row.original
          return (
            <div className="flex flex-col py-1">
              <span className="font-bold text-[#141C2E] text-sm">
                {info.getValue()}
              </span>
              <span className="text-xs text-[#4F5B70] font-medium">
                {app.email}
              </span>
              {app.phone && (
                <span className="text-[11px] text-[#8C9BAE]">{app.phone}</span>
              )}
            </div>
          )
        },
      }),

      columnHelper.accessor('country', {
        header: 'Country',
        cell: (info) => (
          <span className="font-semibold text-[#141C2E] text-sm">
            {info.getValue()}
          </span>
        ),
        filterFn: (row, id, filterVal) => {
          if (!filterVal || filterVal === 'all') return true
          return row.getValue(id) === filterVal
        },
      }),

      columnHelper.accessor('documents', {
        header: 'Documents',
        cell: (info) => {
          const val = String(info.getValue())
          const isUploaded = val.includes('uploaded')
          return (
            <span
              className={`text-xs font-semibold ${
                isUploaded ? 'text-[#0267B8]' : 'text-[#4F5B70]'
              }`}
            >
              {val}
            </span>
          )
        },
        filterFn: (row, id, filterVal) => {
          if (!filterVal || filterVal === 'all') return true
          const val = String(row.getValue(id))
          if (filterVal === 'none') return val === 'No documents'
          if (filterVal === 'uploaded') return val.includes('uploaded')
          return true
        },
      }),

      columnHelper.accessor('submittedDate', {
        header: ({ column }) => (
          <Button
            variant="plain"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-2 h-7 font-bold text-[#4F5B70] hover:text-[#012A5E] uppercase tracking-wider text-[11px]"
          >
            <span>Submitted</span>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 size-3 text-[#0267B8]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 size-3 text-[#0267B8]" />
            ) : (
              <ArrowUpDown className="ml-1 size-3 opacity-40" />
            )}
          </Button>
        ),
        cell: (info) => (
          <span className="text-xs text-[#4F5B70] font-medium">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => renderStatusBadge(info.getValue()),
        filterFn: (row, id, filterVal) => {
          if (!filterVal || filterVal === 'all') return true
          return row.getValue(id) === filterVal
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Action</div>,
        cell: (info) => (
          <div className="text-right">
            <Button
              type="button"
              onClick={() => onReviewClick(info.row.original)}
              className="h-9 px-3.5 rounded-[10px] bg-[#F1C134] text-[#012A5E] hover:bg-[#DEAC23] active:bg-[#CCA020] font-bold text-xs gap-1.5 shadow-2xs cursor-pointer border border-[#D5A926]"
            >
              <span>Review</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        ),
      }),
    ],
    [onReviewClick],
  )

  // Synchronize Tab filter and Status card filter
  React.useEffect(() => {
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== 'status')
      if (activeTab === 'pending') {
        next.push({ id: 'status', value: 'pending' })
      } else if (currentStatusFilter) {
        next.push({ id: 'status', value: currentStatusFilter })
      }
      return next
    })
  }, [activeTab, currentStatusFilter])

  // Synchronize Country filter
  const handleCountryChange = (val: string | null) => {
    const selected = val || 'all'
    setCountryFilter(selected)
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== 'country')
      if (selected !== 'all') {
        next.push({ id: 'country', value: selected })
      }
      return next
    })
  }

  // Synchronize Document filter
  const handleDocChange = (val: string | null) => {
    const selected = val || 'all'
    setDocFilter(selected)
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== 'documents')
      if (selected !== 'all') {
        next.push({ id: 'documents', value: selected })
      }
      return next
    })
  }

  // Status Filter Change from dropdown in All Applications tab
  const handleStatusDropdownChange = (val: string | null) => {
    const selected = val || 'all'
    const statusVal =
      selected === 'all' ? null : (selected as ApplicationStatus)
    if (onStatusFilterChange) {
      onStatusFilterChange(statusVal)
    }
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== 'status')
      if (statusVal) {
        next.push({ id: 'status', value: statusVal })
      }
      return next
    })
  }

  const handleClearFilters = () => {
    setGlobalFilter('')
    setCountryFilter('all')
    setDocFilter('all')
    if (onStatusFilterChange) {
      onStatusFilterChange(null)
    }
    setColumnFilters(
      activeTab === 'pending' ? [{ id: 'status', value: 'pending' }] : [],
    )
  }

  // Initialize TanStack Table instance
  const table = useReactTable({
    data: dataToUse,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const pendingCount = applications.filter((a) => a.status === 'pending').length
  const allCount = applications.length
  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className="bg-white rounded-2xl border border-[#DCE2EB] shadow-xs overflow-hidden flex flex-col">
      {/* 1. Tabs Row (Pending Review vs All Applications) */}
      <div className="border-b border-[#E6EAF0] px-4 pt-2 flex items-center gap-1 bg-[#FCFCFD]">
        <Button variant="plain"
          type="button"
          onClick={() => {
            onTabChange('pending')
            if (onStatusFilterChange) onStatusFilterChange('pending')
          }}
          className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold transition-all border-b-3 outline-none cursor-pointer ${
            activeTab === 'pending'
              ? 'border-[#F1C134] text-[#012A5E]'
              : 'border-transparent text-[#4F5B70] hover:text-[#012A5E]'
          }`)}
        >
          <span>Pending Review</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              activeTab === 'pending'
                ? 'bg-[#012A5E] text-white'
                : 'bg-[#EFEFF4] text-[#4F5B70]'
            }`}
          >
            {pendingCount}
          </span>
        </Button>

        <Button variant="plain"
          type="button"
          onClick={() => {
            onTabChange('all')
            if (onStatusFilterChange) onStatusFilterChange(null)
          }}
          className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold transition-all border-b-3 outline-none cursor-pointer ${
            activeTab === 'all'
              ? 'border-[#F1C134] text-[#012A5E]'
              : 'border-transparent text-[#4F5B70] hover:text-[#012A5E]'
          }`)}
        >
          <span>All Applications</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              activeTab === 'all'
                ? 'bg-[#012A5E] text-white'
                : 'bg-[#EFEFF4] text-[#4F5B70]'
            }`}
          >
            {allCount}
          </span>
        </Button>
      </div>

      {/* 2. TanStack Table Search & Filters Bar matching Figma #645:427 */}
      <div className="p-4 sm:p-5 border-b border-[#F0F2F6] bg-white flex flex-col xl:flex-row items-stretch xl:items-end justify-between gap-4">
        {/* Search Input powered by TanStack Table Global Filter */}
        <div className="flex-1 min-w-70">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#7B7B7B] pointer-events-none" />
            <Input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search reference, business, contact or email"
              className="h-11 pl-10 pr-9 rounded-xl border-[#CFD7E3] bg-white text-sm placeholder:text-[#7B7B7B] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
            />
            {globalFilter && (
              <Button variant="plain"
                type="button"
                onClick={() => setGlobalFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B7B7B] hover:text-[#141C2E] p-0.5 rounded-full cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filters Group powered by TanStack Table Column Filters */}
        <div className="flex flex-wrap items-end gap-3">
          {/* Status Dropdown (Shown in All Applications tab) */}
          {activeTab === 'all' && (
            <div className="flex flex-col gap-1 w-full sm:w-40">
              <span className="text-xs font-bold text-[#4F5B70]">Status</span>
              <Select
                value={currentStatusFilter ?? 'all'}
                onValueChange={handleStatusDropdownChange}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-[#CFD7E3] text-sm bg-white">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Country Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-40">
            <span className="text-xs font-bold text-[#4F5B70]">Country</span>
            <Select value={countryFilter} onValueChange={handleCountryChange}>
              <SelectTrigger className="h-11 w-full rounded-xl border-[#CFD7E3] text-sm bg-white">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Documents Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-36">
            <span className="text-xs font-bold text-[#4F5B70]">Documents</span>
            <Select value={docFilter} onValueChange={handleDocChange}>
              <SelectTrigger className="h-11 w-full rounded-xl border-[#CFD7E3] text-sm bg-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="none">No documents</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons matching Figma button#f-clear and button#f-apply */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className="h-11 rounded-xl border-[#CFD7E3] text-[#0267B8] hover:text-[#012A5E] hover:bg-[#F4F6FA] text-sm font-bold cursor-pointer"
            >
              Clear Filters
            </Button>
            <Button
              type="button"
              onClick={() => {
                // Trigger re-render or notification if needed
              }}
              className="h-11 rounded-xl bg-[#F1C134] text-[#012A5E] hover:bg-[#DEAC23] text-sm font-bold cursor-pointer shadow-2xs border border-[#D5A926]"
            >
              <SlidersHorizontal className="size-3.5 mr-1" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Result Count Summary matching Figma p#flt-sum */}
      <div className="px-5 py-3 text-xs font-semibold text-[#4F5B70] bg-[#FAFBFC] border-b border-[#F0F2F6] flex items-center justify-between">
        <div>
          Showing {filteredCount} of{' '}
          {activeTab === 'pending' ? pendingCount : allCount}{' '}
          {activeTab === 'pending' ? 'pending application' : 'application'}
          {filteredCount === 1 ? '' : 's'}
          {currentStatusFilter && activeTab === 'all' && (
            <span className="ml-2 font-bold text-[#0267B8]">
              (Filtered by status: {currentStatusFilter})
            </span>
          )}
        </div>
        {sorting.length > 0 && (
          <div className="text-[11px] text-[#0267B8] font-bold">
            Sorted by {sorting[0].id} (
            {sorting[0].desc ? 'descending' : 'ascending'})
          </div>
        )}
      </div>

      {/* 4. Table rendered via TanStack Table flexRender */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[#F4F6FA] hover:bg-[#F4F6FA] border-y border-[#E6EAF0]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-bold text-[#4F5B70] uppercase tracking-wider py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isContentLoading ? (
              <TableRow className="hover:bg-transparent border-b border-[#EDF2F7]">
                <TableCell colSpan={columns.length} className="py-10">
                  <div className="flex justify-center">
                    <FlightOrbitLoader />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              /* Figma No Data Match State (#648:1253) */
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10">
                  <EmptyState
                    title="No Data Match"
                    description="No agent applications match your current search query or filter settings. Try clearing active filters to see all applications."
                    activeFilters={[
                      ...(globalFilter
                        ? [
                            {
                              id: 'search',
                              label: 'Search',
                              value: globalFilter,
                              onRemove: () => setGlobalFilter(''),
                            },
                          ]
                        : []),
                      ...(countryFilter !== 'all'
                        ? [
                            {
                              id: 'country',
                              label: 'Country',
                              value: countryFilter,
                              onRemove: () => handleCountryChange('all'),
                            },
                          ]
                        : []),
                      ...(docFilter !== 'all'
                        ? [
                            {
                              id: 'documents',
                              label: 'Documents',
                              value: docFilter,
                              onRemove: () => handleDocChange('all'),
                            },
                          ]
                        : []),
                      ...(currentStatusFilter && activeTab === 'all'
                        ? [
                            {
                              id: 'status',
                              label: 'Status',
                              value: currentStatusFilter,
                              onRemove: () => handleStatusDropdownChange('all'),
                            },
                          ]
                        : []),
                    ]}
                    action={{
                      label: 'Reset All Filters',
                      onClick: handleClearFilters,
                    }}
                    onClearAll={handleClearFilters}
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-[#F8FAFC] border-b border-[#EDF2F7]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. TanStack Table Pagination Bar */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#F0F2F6] bg-[#FAFBFC] text-xs">
          <div className="text-[#4F5B70] font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-2.5 rounded-lg border-[#DCE2EB] text-[#012A5E] font-bold"
            >
              <ChevronLeft className="size-3.5 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-2.5 rounded-lg border-[#DCE2EB] text-[#012A5E] font-bold"
            >
              Next
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

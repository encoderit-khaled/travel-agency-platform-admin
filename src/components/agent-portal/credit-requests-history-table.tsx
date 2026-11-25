import * as React from 'react'
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  TrendingUp,
  Plus,
  Eye,
  Filter,
  Calendar,
} from 'lucide-react'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { DatePicker } from '#/components/ui/date-picker'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import type {
  CreditRequest,
  CreditRequestStatus,
} from './credit-requests-types'
import { cn } from 'cn'

export interface CreditRequestsHistoryTableProps {
  requests: CreditRequest[]
  onSelectRequest: (request: CreditRequest) => void
}

export function CreditRequestsHistoryTable({
  requests,
  onSelectRequest,
}: CreditRequestsHistoryTableProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [dateFilter, setDateFilter] = React.useState('')

  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      if (
        searchQuery &&
        !req.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !req.reason.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !req.requestType.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (typeFilter !== 'all' && req.requestType !== typeFilter) {
        return false
      }
      if (statusFilter !== 'all' && req.status !== statusFilter) {
        return false
      }
      if (
        dateFilter &&
        req.requestedDate &&
        !req.requestedDate.includes(dateFilter)
      ) {
        return false
      }
      return true
    })
  }, [requests, searchQuery, typeFilter, statusFilter, dateFilter])

  const pendingCount = requests.filter((r) => r.status === 'Pending').length
  const approvedAdjustedCount = requests.filter(
    (r) => r.status === 'Approved' || r.status === 'Adjusted',
  ).length
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length

  const getStatusBadge = (status: CreditRequestStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0369A1]">
            <Clock className="size-3 text-[#0369A1]" />
            Pending
          </span>
        )
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#10B981]">
            <CheckCircle2 className="size-3 text-[#10B981]" />
            Approved
          </span>
        )
      case 'Adjusted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
            <SlidersHorizontal className="size-3 text-[#D97706]" />
            Adjusted
          </span>
        )
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#DC2626]">
            <XCircle className="size-3 text-[#DC2626]" />
            Rejected
          </span>
        )
    }
  }

  const columns = React.useMemo<ColumnDef<CreditRequest>[]>(
    () => [
      {
        accessorKey: 'submittedDate',
        header: 'SUBMITTED',
        cell: ({ row }) => {
          const req = row.original
          return (
            <div className="contents" onClick={() => onSelectRequest(req)}>
              <div className="text-xs font-bold text-[#001A3D]">
                {req.submittedDate}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {req.submittedTime}
              </div>
            </div>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#64748B] py-3 pl-6',
          cellClassName: 'py-4 pl-6',
        },
      },
      {
        accessorKey: 'requestType',
        header: 'REQUEST TYPE',
        cell: ({ row }) => {
          const req = row.original
          return (
            <div className="contents" onClick={() => onSelectRequest(req)}>
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    'size-8 rounded-lg flex items-center justify-center shrink-0',
                    req.requestType === 'Credit-limit increase'
                      ? 'bg-[#EBF4FE] text-[#0267B8]'
                      : 'bg-[#E8F8F0] text-[#10B981]',
                  )}
                >
                  {req.requestType === 'Credit-limit increase' ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#001A3D]">
                    {req.requestType}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {req.typeDescription}
                  </div>
                </div>
              </div>
            </div>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#64748B] py-3',
          cellClassName: 'py-4',
        },
      },
      {
        accessorKey: 'requestedAmount',
        header: 'REQUESTED AMOUNT',
        cell: ({ row }) => {
          const req = row.original
          return (
            <div className="contents" onClick={() => onSelectRequest(req)}>
              <div className="text-xs font-bold text-[#001A3D]">
                {req.requestedAmountNumeric
                  ? `$${req.requestedAmountNumeric.toLocaleString()}`
                  : req.requestedAmount}
              </div>
              {req.adjustedAmount && (
                <div className="text-[11px] text-[#D97706] font-medium">
                  {req.adjustedAmount}
                </div>
              )}
            </div>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#64748B] py-3',
          cellClassName: 'py-4',
        },
      },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => (
          <div
            className="contents"
            onClick={() => onSelectRequest(row.original)}
          >
            {getStatusBadge(row.original.status)}
          </div>
        ),
        meta: {
          headerClassName: 'text-xs font-bold text-[#64748B] py-3',
          cellClassName: 'py-4',
        },
      },
      {
        accessorKey: 'decision',
        header: 'DECISION',
        cell: ({ row }) => {
          const req = row.original
          return (
            <div className="contents" onClick={() => onSelectRequest(req)}>
              <div className="text-xs font-medium text-[#001A3D]">
                {req.decision}
              </div>
              {req.decisionDate && (
                <div className="text-[11px] text-[#64748B]">
                  {req.decisionDate}
                </div>
              )}
            </div>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#64748B] py-3',
          cellClassName: 'py-4',
        },
      },
      {
        id: 'action',
        header: 'ACTION',
        cell: ({ row }) => {
          const req = row.original
          return (
            <div className="contents" onClick={() => onSelectRequest(req)}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectRequest(req)
                }}
                className="size-8 p-0 rounded-lg hover:bg-[#E8F1FC] text-[#0267B8]"
              >
                <Eye className="size-4" />
              </Button>
            </div>
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#64748B] py-3 pr-6 text-right',
          cellClassName: 'py-4 pr-6 text-right',
        },
      },
    ],
    [getStatusBadge, onSelectRequest],
  )

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-8 rounded-lg bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
            <span className="text-xs font-semibold text-[#5A6578]">
              Total Requests
            </span>
          </div>
          <div className="text-2xl font-bold text-[#001A3D]">
            {requests.length}
          </div>
          <p className="text-xs text-[#5A6578] mt-1">
            Credit-limit increase and credit top-up
          </p>
        </div>

        {/* KPI 2: Pending */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
              <Clock className="size-4" />
            </div>
            <span className="text-xs font-semibold text-[#5A6578]">
              Pending
            </span>
          </div>
          <div className="text-2xl font-bold text-[#001A3D]">
            {pendingCount}
          </div>
          <p className="text-xs text-[#5A6578] mt-1">
            Awaiting an Admin decision
          </p>
        </div>

        {/* KPI 3: Approved / Adjusted */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-8 rounded-lg bg-[#E8F8F0] text-[#10B981] flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
            <span className="text-xs font-semibold text-[#5A6578]">
              Approved / Adjusted
            </span>
          </div>
          <div className="text-2xl font-bold text-[#001A3D]">
            {approvedAdjustedCount}
          </div>
          <p className="text-xs text-[#5A6578] mt-1">
            Decided by Aero Wing Admin
          </p>
        </div>

        {/* KPI 4: Rejected */}
        <div className="bg-white rounded-2xl border border-[#DCE2EB] p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-8 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <XCircle className="size-4" />
            </div>
            <span className="text-xs font-semibold text-[#5A6578]">
              Rejected
            </span>
          </div>
          <div className="text-2xl font-bold text-[#001A3D]">
            {rejectedCount}
          </div>
          <p className="text-xs text-[#5A6578] mt-1">
            Decided by Aero Wing Admin
          </p>
        </div>
      </div>

      {/* 2. Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#DCE2EB] shadow-xs overflow-hidden">
        {/* Table Title Header */}
        <div className="p-6 border-b border-[#F1F5F9]">
          <h2 className="text-lg font-bold text-[#001A3D]">Request History</h2>
          <p className="text-xs text-[#5A6578] mt-0.5">
            Submitted requests are read-only. Decisions are made by Aero Wing
            Admin.
          </p>

          {/* Search and Filters */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            {/* Search */}
            <div className="sm:col-span-5 relative">
              <Search className="size-4 text-[#94A3B8] absolute left-3.5 top-3" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests"
                className="pl-9 h-10 rounded-xl border-[#DCE2EB] text-xs font-medium focus-visible:ring-[#0267B8]"
              />
            </div>

            {/* Request Type filter */}
            <div className="sm:col-span-3">
              <Select
                value={typeFilter}
                items={{
                  all: 'All Types',
                  'Credit-limit increase': 'Credit-limit increase',
                  'Credit top-up': 'Credit top-up',
                }}
                onValueChange={(val) => {
                  if (val) setTypeFilter(val)
                }}
              >
                <SelectTrigger className="w-full h-10 rounded-xl border-[#DCE2EB] bg-white text-xs font-medium text-[#001A3D]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Credit-limit increase">
                    Credit-limit increase
                  </SelectItem>
                  <SelectItem value="Credit top-up">Credit top-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status filter */}
            <div className="sm:col-span-2">
              <Select
                value={statusFilter}
                items={{
                  all: 'All Statuses',
                  Pending: 'Pending',
                  Approved: 'Approved',
                  Adjusted: 'Adjusted',
                  Rejected: 'Rejected',
                }}
                onValueChange={(val) => {
                  if (val) setStatusFilter(val)
                }}
              >
                <SelectTrigger className="w-full h-10 rounded-xl border-[#DCE2EB] bg-white text-xs font-medium text-[#001A3D]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Adjusted">Adjusted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date filter with shadcn DatePicker & Calendar */}
            <div className="sm:col-span-2">
              <DatePicker
                value={dateFilter}
                onChange={setDateFilter}
                placeholder="Filter by date"
                className="h-10 rounded-xl"
                clearable
              />
            </div>
          </div>
        </div>

        {/* Showing Count */}
        <div className="px-6 py-2.5 bg-[#F8FAFC] border-b border-[#F1F5F9] text-xs font-medium text-[#64748B]">
          Showing {filteredRequests.length} requests
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <DataTable
            data={filteredRequests}
            columns={columns}
            getRowId={(row) => row.id}
            headerClassName="bg-[#F8FAFC]"
            headerRowClassName="border-[#F1F5F9] hover:bg-transparent"
            rowClassName="border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
          />
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#F1F5F9] text-xs text-[#64748B]">
          Statuses: Pending, Approved, Adjusted, Rejected. Sample submission
          dates are fictional.
        </div>
      </div>
    </div>
  )
}

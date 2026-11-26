import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  ArrowLeft,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  FileText,
  Lock,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  Building2,
  Check,
  CreditCard,
  DollarSign,
  Send,
  X,
  Eye,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import { Textarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { DatePicker } from '#/components/ui/date-picker'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { CreditRequestDetailsSheet } from './credit-request-details-sheet'
import { CreditRequestSubmittedDialog } from './credit-request-submitted-dialog'
import {
  INITIAL_CREDIT_REQUESTS,
  CREDIT_KPI_DATA,
} from './credit-requests-data'
import type {
  CreditRequest,
  CreditRequestType,
  CreditRequestStatus,
} from './credit-requests-types'
import { cn } from 'cn'

interface CreditRequestsPageProps {
  initialTab?: 'history' | 'new'
  initialSelectedRequestId?: string | null
  initialRequestId?: string | null
  initialDrawerOpen?: boolean
  initialSheetOpen?: boolean
  initialSubmitSuccessOpen?: boolean
}

export function CreditRequestsPage({
  initialTab = 'history',
  initialSelectedRequestId,
  initialRequestId,
  initialDrawerOpen = false,
  initialSheetOpen = false,
  initialSubmitSuccessOpen = false,
}: CreditRequestsPageProps) {
  const isContentLoading = useContentLoading()
  // Mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  // Tab state: 'history' or 'new'
  const [activeTab, setActiveTab] = React.useState<'history' | 'new'>(
    initialTab,
  )

  // Requests state
  const [requests, setRequests] = React.useState<CreditRequest[]>(
    INITIAL_CREDIT_REQUESTS,
  )

  // Selected request for details sheet
  const [selectedRequestId, setSelectedRequestId] = React.useState<
    string | null
  >(initialSelectedRequestId || initialRequestId || requests[0]?.id || null)

  const [isDetailsOpen, setIsDetailsOpen] = React.useState<boolean>(
    initialDrawerOpen || initialSheetOpen || false,
  )

  // Success dialog state
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState<boolean>(
    initialSubmitSuccessOpen,
  )
  const [recentlySubmittedRequest, setRecentlySubmittedRequest] =
    React.useState<CreditRequest | null>(
      initialSubmitSuccessOpen
        ? {
            id: 'REQ-2026-004',
            submittedDate: '12 Nov 2026',
            submittedTime: '10:20',
            submittedTimestamp: '12 Nov 2026 · 10:20',
            requestType: 'Credit-limit increase',
            typeDescription: 'Additional booking capacity',
            requestedAmount: '1000',
            requestedAmountNumeric: 1000,
            status: 'Pending',
            reason: 'Explain why you need this credit change',
            decision: 'Pending',
            decisionDate: null,
            decisionNote: 'Awaiting an Aero Wing Admin decision.',
            creditRecord: 'Pending decision',
            agentNotification: 'Notification will follow after a decision',
          }
        : null,
    )

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('All Types')
  const [statusFilter, setStatusFilter] = React.useState<string>('All Statuses')
  const [fromDate, setFromDate] = React.useState('')
  const [toDate, setToDate] = React.useState('')

  // New Request form state
  const [newRequestType, setNewRequestType] = React.useState<CreditRequestType>(
    'Credit-limit increase',
  )
  const [newRequestedAmount, setNewRequestedAmount] =
    React.useState<string>('1000')
  const [newReason, setNewReason] = React.useState<string>(
    'Explain why you need this credit change',
  )

  // Selected request object
  const selectedRequest =
    requests.find(
      (r) =>
        r.id === selectedRequestId ||
        (selectedRequestId === 'req-1' && r.status === 'Pending') ||
        (selectedRequestId === 'req-01' && r.status === 'Pending'),
    ) ||
    requests[0] ||
    null

  // KPI Calculations
  const totalCount = requests.length
  const pendingCount = requests.filter((r) => r.status === 'Pending').length
  const approvedAdjustedCount = requests.filter(
    (r) => r.status === 'Approved' || r.status === 'Adjusted',
  ).length
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length

  // Filtered requests list
  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesQuery =
          req.id.toLowerCase().includes(q) ||
          req.requestType.toLowerCase().includes(q) ||
          req.reason.toLowerCase().includes(q) ||
          req.submittedDate.toLowerCase().includes(q) ||
          req.status.toLowerCase().includes(q)
        if (!matchesQuery) return false
      }

      // Type filter
      if (typeFilter !== 'All Types' && req.requestType !== typeFilter) {
        return false
      }

      // Status filter
      if (statusFilter !== 'All Statuses' && req.status !== statusFilter) {
        return false
      }

      // Date Range filter
      if (fromDate) {
        const fromTs = new Date(fromDate).getTime()
        const reqTs = new Date(req.submittedDate).getTime()
        if (!isNaN(fromTs) && !isNaN(reqTs) && reqTs < fromTs) {
          return false
        }
      }
      if (toDate) {
        const toDateObj = new Date(toDate)
        toDateObj.setHours(23, 59, 59, 999)
        const toTs = toDateObj.getTime()
        const reqTs = new Date(req.submittedDate).getTime()
        if (!isNaN(toTs) && !isNaN(reqTs) && reqTs > toTs) {
          return false
        }
      }

      return true
    })
  }, [requests, searchQuery, typeFilter, statusFilter, fromDate, toDate])

  // Open details for a request
  const handleOpenDetails = (req: CreditRequest) => {
    setSelectedRequestId(req.id)
    setIsDetailsOpen(true)
  }

  // Handle Form Submission
  const handleSubmitNewRequest = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const newReqId = `REQ-2026-${String(requests.length + 1).padStart(3, '0')}`
    const created: CreditRequest = {
      id: newReqId,
      submittedDate: '16 Nov 2026',
      submittedTime: '12:00',
      submittedTimestamp: '16 Nov 2026 · 12:00',
      requestType: newRequestType,
      typeDescription:
        newRequestType === 'Credit-limit increase'
          ? 'Additional booking capacity'
          : 'Wallet/credit replenishment',
      requestedAmount: newRequestedAmount || 'Sample amount',
      requestedAmountNumeric: parseFloat(newRequestedAmount) || 1000,
      status: 'Pending',
      reason: newReason || 'Additional booking capacity',
      decision: 'Pending',
      decisionDate: null,
      decisionNote: 'Awaiting an Aero Wing Admin decision.',
      creditRecord: 'Pending decision',
      agentNotification: 'Notification will follow after a decision',
    }

    setRequests([created, ...requests])
    setRecentlySubmittedRequest(created)
    setSelectedRequestId(created.id)
    setIsSuccessDialogOpen(true)
  }

  const columns = React.useMemo<ColumnDef<CreditRequest>[]>(
    () => [
      {
        accessorKey: 'submittedDate',
        header: 'Submitted',
        cell: ({ row }) => {
          const req = row.original
          return (
            <>
              <span className="font-bold text-[#001A3D] block">
                {req.submittedDate}
              </span>
              <span className="text-[11px] text-[#5A6E85] block">
                {req.submittedTime}
              </span>
            </>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 sm:px-6',
          cellClassName: 'py-3.5 px-4 sm:px-6 align-top',
        },
      },
      {
        accessorKey: 'requestType',
        header: 'Request Type',
        cell: ({ row }) => {
          const req = row.original
          return (
            <div className="flex items-start gap-2.5">
              <div
                className={cn(
                  'size-6 rounded-md flex items-center justify-center shrink-0 mt-0.5',
                  req.requestType === 'Credit-limit increase'
                    ? 'bg-[#E8F2FC] text-[#0267B8]'
                    : 'bg-[#EBFDF2] text-[#16A34A]',
                )}
              >
                {req.requestType === 'Credit-limit increase' ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <Plus className="size-3.5 stroke-[2.5]" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-[#001A3D] block">
                  {req.requestType}
                </span>
                <span className="text-[11px] text-[#5A6E85] block">
                  {req.typeDescription}
                </span>
              </div>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 sm:px-6',
          cellClassName: 'py-3.5 px-4 sm:px-6 align-top',
        },
      },
      {
        accessorKey: 'requestedAmount',
        header: 'Requested Amount',
        cell: ({ row }) => {
          const req = row.original
          return (
            <>
              <span className="font-bold text-[#001A3D] block">
                {req.requestedAmount}
              </span>
              {req.adjustedAmount && (
                <span className="text-[11px] text-[#B45309] font-medium block">
                  {req.adjustedAmount}
                </span>
              )}
            </>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 sm:px-6',
          cellClassName: 'py-3.5 px-4 sm:px-6 align-top',
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const req = row.original
          return (
            <>
              {req.status === 'Pending' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F2FC] text-[#0267B8] border border-[#B8D8F8]">
                  <Clock className="size-3" />
                  Pending
                </span>
              )}
              {req.status === 'Approved' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBFDF2] text-[#16A34A] border border-[#A7F3D0]">
                  <CheckCircle2 className="size-3" />
                  Approved
                </span>
              )}
              {req.status === 'Adjusted' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                  <SlidersHorizontal className="size-3" />
                  Adjusted
                </span>
              )}
              {req.status === 'Rejected' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                  <XCircle className="size-3" />
                  Rejected
                </span>
              )}
            </>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 sm:px-6',
          cellClassName: 'py-3.5 px-4 sm:px-6 align-top',
        },
      },
      {
        accessorKey: 'decision',
        header: 'Decision',
        cell: ({ row }) => {
          const req = row.original
          return (
            <>
              <span className="font-semibold text-[#001A3D] block">
                {req.decision}
              </span>
              {req.decisionDate && (
                <span className="text-[11px] text-[#5A6E85] block">
                  {req.decisionDate}
                </span>
              )}
            </>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 sm:px-6',
          cellClassName: 'py-3.5 px-4 sm:px-6 align-top',
        },
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          const req = row.original
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenDetails(req)}
              className="text-xs font-semibold text-[#001A3D] border-[#DCE2EB] bg-white hover:bg-[#F1F5F9] cursor-pointer"
            >
              View Details
            </Button>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 sm:px-6 text-right',
          cellClassName: 'py-3.5 px-4 sm:px-6 align-top text-right',
        },
      },
    ],
    [handleOpenDetails],
  )

  return (
    <div className="min-h-screen flex bg-[#F4F6FA] text-[#001A3D]">
      {/* Sidebar navigation */}
      <AgentPortalSidebar
        currentActive="Credit"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        activePath="/credit"
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Credit', active: false },
            { label: 'Requests', active: true },
          ]}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Back button */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'new') {
                  setActiveTab('history')
                } else {
                  window.location.href = '/wallet'
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0267B8] hover:text-[#001A3D] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Credit</span>
            </button>
          </div>

          {/* Page Title & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#DCE2EB]">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0267B8] tracking-wider uppercase">
                Agent Portal · M2.8 Credit Requests
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001A3D] tracking-tight">
                Credit Requests
              </h1>
              <p className="text-xs sm:text-sm text-[#5A6E85]">
                Request changes to your Agent credit and review previous
                decisions.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-bold text-[#001A3D]">
                  Skyline Demo Travels Ltd
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F2FC] text-[#0267B8] border border-[#B8D8F8]">
                  <Info className="size-3" />
                  Sample data
                </span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => setActiveTab('new')}
                className="bg-[#F1C134] hover:bg-[#E2B124] text-[#001A3D] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Plus className="size-4 mr-1.5 stroke-[2.5]" />
                New Credit Request
              </Button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#DCE2EB]">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={cn(
                'relative px-4 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2',
                activeTab === 'history'
                  ? 'text-[#001A3D]'
                  : 'text-[#5A6E85] hover:text-[#001A3D]',
              )}
            >
              <FileText className="size-4" />
              <span>Request History</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E2E8F0] text-[#475569]">
                {requests.length}
              </span>
              {activeTab === 'history' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#001A3D] rounded-t-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={cn(
                'relative px-4 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2',
                activeTab === 'new'
                  ? 'text-[#001A3D]'
                  : 'text-[#5A6E85] hover:text-[#001A3D]',
              )}
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Request</span>
              {activeTab === 'new' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#001A3D] rounded-t-full" />
              )}
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: REQUEST HISTORY                                  */}
          {/* ======================================================== */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* KPI Cards Grid */}
              {isContentLoading ? (
                <CardGridSkeleton
                  count={4}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  cardClassName="h-28 rounded-xl"
                />
              ) : null}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isContentLoading ? "hidden" : ""}`}>
                {/* KPI 1 */}
                <div className="bg-white rounded-xl border border-[#DCE2EB] p-4.5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#E8F2FC] text-[#0267B8] flex items-center justify-center">
                      <FileText className="size-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#5A6E85]">
                      Total Requests
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-[#001A3D] block tracking-tight">
                      {totalCount}
                    </span>
                    <span className="text-[11px] text-[#5A6E85] block mt-0.5">
                      Credit-limit increase and credit top-up
                    </span>
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-white rounded-xl border border-[#DCE2EB] p-4.5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#E8F2FC] text-[#0267B8] flex items-center justify-center">
                      <Clock className="size-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#5A6E85]">
                      Pending
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-[#001A3D] block tracking-tight">
                      {pendingCount}
                    </span>
                    <span className="text-[11px] text-[#5A6E85] block mt-0.5">
                      Awaiting an Admin decision
                    </span>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-white rounded-xl border border-[#DCE2EB] p-4.5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#EBFDF2] text-[#16A34A] flex items-center justify-center">
                      <CheckCircle2 className="size-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#5A6E85]">
                      Approved / Adjusted
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-[#001A3D] block tracking-tight">
                      {approvedAdjustedCount}
                    </span>
                    <span className="text-[11px] text-[#5A6E85] block mt-0.5">
                      Decided by Aero Wing Admin
                    </span>
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="bg-white rounded-xl border border-[#DCE2EB] p-4.5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                      <XCircle className="size-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#5A6E85]">
                      Rejected
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-[#001A3D] block tracking-tight">
                      {rejectedCount}
                    </span>
                    <span className="text-[11px] text-[#5A6E85] block mt-0.5">
                      No credit change applied
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Table Section Card */}
              <div className="bg-white rounded-xl border border-[#DCE2EB] shadow-xs overflow-hidden">
                {/* Header of Section */}
                <div className="p-4 sm:p-5 border-b border-[#EDF2F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-[#F1F5F9] text-[#001A3D] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="size-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-sm sm:text-base font-extrabold text-[#001A3D]">
                        Request History
                      </h2>
                      <p className="text-xs text-[#5A6E85]">
                        Submitted requests are read-only. Decisions are made by
                        Aero Wing Admin.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] self-start sm:self-center">
                    <Info className="size-3" />
                    Sample data
                  </span>
                </div>

                {/* Filters Toolbar */}
                <div className="p-4 sm:p-5 bg-[#F8FAFC] border-b border-[#EDF2F7]">
                  <div className="flex flex-col xl:flex-row gap-3">
                    {/* Search Input */}
                    <div className="flex-1 min-w-55 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#5A6E85] uppercase tracking-wider block">
                        Search
                      </span>
                      <div className="relative">
                        <Search className="size-4 text-[#5A6E85] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          type="text"
                          placeholder="Search requests"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9.5 bg-white border-[#DCE2EB] text-xs sm:text-sm h-10! rounded-xl focus-visible:ring-1 focus-visible:ring-[#0267B8]"
                        />
                      </div>
                    </div>

                    {/* Filter controls row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {/* Request Type filter */}
                      <div className="space-y-1.5 min-w-32.5">
                        <span className="text-[10px] font-bold text-[#5A6E85] uppercase tracking-wider block">
                          Request Type
                        </span>
                        <Select
                          value={typeFilter}
                          onValueChange={(val) => setTypeFilter(val)}
                        >
                          <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs sm:text-sm h-10! rounded-xl">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Types">All Types</SelectItem>
                            <SelectItem value="Credit-limit increase">
                              Credit-limit increase
                            </SelectItem>
                            <SelectItem value="Credit top-up">
                              Credit top-up
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Status filter */}
                      <div className="space-y-1.5 min-w-30">
                        <span className="text-[10px] font-bold text-[#5A6E85] uppercase tracking-wider block">
                          Status
                        </span>
                        <Select
                          value={statusFilter}
                          onValueChange={(val) => setStatusFilter(val)}
                        >
                          <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs sm:text-sm h-10! rounded-xl">
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Statuses">
                              All Statuses
                            </SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Adjusted">Adjusted</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* From Date */}
                      <div className="space-y-1.5 min-w-27.5">
                        <span className="text-[10px] font-bold text-[#5A6E85] uppercase tracking-wider block">
                          From
                        </span>
                        <DatePicker
                          value={fromDate}
                          onChange={setFromDate}
                          placeholder="dd-mm-yy"
                          className="h-10! rounded-xl bg-white border-[#DCE2EB] text-xs sm:text-sm"
                          clearable
                        />
                      </div>

                      {/* To Date */}
                      <div className="space-y-1.5 min-w-27.5">
                        <span className="text-[10px] font-bold text-[#5A6E85] uppercase tracking-wider block">
                          To
                        </span>
                        <DatePicker
                          value={toDate}
                          onChange={setToDate}
                          placeholder="dd-mm-yy"
                          className="h-10! rounded-xl bg-white border-[#DCE2EB] text-xs sm:text-sm"
                          clearable
                        />
                      </div>
                    </div>
                  </div>

                  {/* Showing count */}
                  <div className="text-xs text-[#5A6E85] pt-3 font-medium">
                    Showing{' '}
                    <span className="font-bold text-[#001A3D]">
                      {filteredRequests.length}
                    </span>{' '}
                    requests
                  </div>
                </div>

                {/* Table of Requests */}
                <div className="overflow-x-auto">
                  <DataTable
                    data={filteredRequests}
                    columns={columns}
                    getRowId={(row) => row.id}
                    tableClassName="w-full text-left border-collapse"
                    headerRowClassName="border-b border-[#EDF2F7] bg-[#F8FAFC]/50 text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider hover:bg-[#F8FAFC]/50"
                    headClassName="h-auto"
                    bodyClassName="divide-y divide-[#EDF2F7] text-xs"
                    rowClassName={(row) =>
                      cn(
                        'hover:bg-[#F8FAFC] transition-colors',
                        selectedRequestId === row.original.id &&
                          isDetailsOpen &&
                          'bg-[#F0F7FF]',
                      )
                    }
                    emptyCellClassName="py-12 text-center text-[#5A6E85]"
                    empty={
                      <>
                        <FileText className="size-8 mx-auto mb-2 text-[#94A3B8]" />
                        <p className="font-semibold text-sm text-[#001A3D]">
                          No credit requests found
                        </p>
                        <p className="text-xs text-[#64748B] mt-1">
                          Try clearing filters or search criteria.
                        </p>
                      </>
                    }
                  />
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-[#F8FAFC] border-t border-[#EDF2F7] text-[11px] text-[#5A6E85]">
                  Statuses: Pending, Approved, Adjusted, Rejected. Sample
                  submission dates are fictional.
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: NEW REQUEST                                      */}
          {/* ======================================================== */}
          {activeTab === 'new' && (
            <div className="space-y-6">
              {/* Current Credit Summary Card (M2.7 context) */}
              <div className="bg-white rounded-xl border border-[#DCE2EB] p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDF2F7]">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-md bg-[#E8F2FC] text-[#0267B8] flex items-center justify-center">
                      <CreditCard className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#001A3D]">
                        Current Credit
                      </h3>
                      <p className="text-xs text-[#5A6E85]">
                        Read-only context from Credit Overview (M2.7)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                      <Info className="size-3" />
                      Sample data
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                      <Lock className="size-3" />
                      Read-only
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-[#5A6E85] uppercase tracking-wide block mb-1">
                      Current Credit Limit
                    </span>
                    <span className="text-xs font-bold text-[#001A3D] block">
                      Limit configured
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-[#5A6E85] uppercase tracking-wide block mb-1">
                      Used Credit
                    </span>
                    <span className="text-xs font-bold text-[#001A3D] block">
                      —
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-[#5A6E85] uppercase tracking-wide block mb-1">
                      Available Credit
                    </span>
                    <span className="text-xs font-bold text-[#001A3D] block">
                      Tracked
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-[#5A6E85] uppercase tracking-wide block mb-1">
                      Outstanding Balance
                    </span>
                    <span className="text-xs font-bold text-[#001A3D] block">
                      Outstanding balance tracked
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#5A6E85] pt-1 flex items-center gap-1.5">
                  <Info className="size-3 text-[#0267B8]" />
                  Exact amounts are not included in this sample dataset.
                </div>
              </div>

              {/* Form & Summary 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Card (col-span-8) */}
                <form
                  onSubmit={handleSubmitNewRequest}
                  className="lg:col-span-8 bg-white rounded-xl border border-[#DCE2EB] p-5 sm:p-6 shadow-xs space-y-6"
                >
                  <div className="flex items-start gap-3 pb-4 border-b border-[#EDF2F7]">
                    <div className="size-8 rounded-lg bg-[#FFFBEB] text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                      <Plus className="size-4.5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-base font-extrabold text-[#001A3D]">
                        New Credit Request
                      </h2>
                      <p className="text-xs text-[#5A6E85]">
                        Submitted to Aero Wing Admin for review.
                      </p>
                    </div>
                  </div>

                  {/* Field 1: Request Type */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-bold text-[#001A3D]">
                        Request Type
                      </Label>
                      <span className="text-[10px] font-bold text-[#0267B8] bg-[#E8F2FC] px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Option 1: Credit-limit increase */}
                      <button
                        type="button"
                        onClick={() =>
                          setNewRequestType('Credit-limit increase')
                        }
                        className={cn(
                          'p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3',
                          newRequestType === 'Credit-limit increase'
                            ? 'border-[#0267B8] bg-[#F0F7FF] ring-2 ring-[#0267B8]/20 shadow-xs'
                            : 'border-[#DCE2EB] bg-white hover:bg-[#F8FAFC]',
                        )}
                      >
                        <div
                          className={cn(
                            'size-4.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5',
                            newRequestType === 'Credit-limit increase'
                              ? 'border-[#0267B8] bg-[#0267B8] text-white'
                              : 'border-[#94A3B8]',
                          )}
                        >
                          {newRequestType === 'Credit-limit increase' && (
                            <div className="size-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#001A3D] block">
                            Credit-limit increase
                          </span>
                          <span className="text-[11px] text-[#5A6E85] block leading-tight">
                            Request a higher credit limit for the agency
                          </span>
                        </div>
                      </button>

                      {/* Option 2: Credit top-up */}
                      <button
                        type="button"
                        onClick={() => setNewRequestType('Credit top-up')}
                        className={cn(
                          'p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3',
                          newRequestType === 'Credit top-up'
                            ? 'border-[#0267B8] bg-[#F0F7FF] ring-2 ring-[#0267B8]/20 shadow-xs'
                            : 'border-[#DCE2EB] bg-white hover:bg-[#F8FAFC]',
                        )}
                      >
                        <div
                          className={cn(
                            'size-4.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5',
                            newRequestType === 'Credit top-up'
                              ? 'border-[#0267B8] bg-[#0267B8] text-white'
                              : 'border-[#94A3B8]',
                          )}
                        >
                          {newRequestType === 'Credit top-up' && (
                            <div className="size-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#001A3D] block">
                            Credit top-up
                          </span>
                          <span className="text-[11px] text-[#5A6E85] block leading-tight">
                            Request immediate wallet/credit replenishment
                          </span>
                        </div>
                      </button>
                    </div>

                    <p className="text-[11px] text-[#5A6E85] pt-1">
                      ⓘ Request a higher credit limit for Skyline Demo Travels
                      Ltd.
                    </p>
                  </div>

                  {/* Field 2: Requested Amount */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="requested-amount"
                        className="text-xs font-bold text-[#001A3D]"
                      >
                        Requested Amount
                      </Label>
                      <span className="text-[10px] font-bold text-[#0267B8] bg-[#E8F2FC] px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    </div>

                    <Input
                      id="requested-amount"
                      type="text"
                      value={newRequestedAmount}
                      onChange={(e) => setNewRequestedAmount(e.target.value)}
                      placeholder="e.g. 1000"
                      className="bg-white border-[#DCE2EB] text-xs h-10 rounded-lg max-w-sm"
                    />

                    <p className="text-[11px] text-[#5A6E85]">
                      ⓘ Enter the amount you want to request.
                    </p>
                  </div>

                  {/* Field 3: Reason */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="request-reason"
                          className="text-xs font-bold text-[#001A3D]"
                        >
                          Reason
                        </Label>
                        <span className="text-[10px] font-bold text-[#0267B8] bg-[#E8F2FC] px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5A6E85]">
                        {newReason.length} characters
                      </span>
                    </div>

                    <Textarea
                      id="request-reason"
                      rows={4}
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="Explain why you need this credit change"
                      className="bg-white border-[#DCE2EB] text-xs rounded-lg resize-y"
                    />

                    <p className="text-[11px] text-[#5A6E85]">
                      ⓘ After submission the request is Pending until Aero Wing
                      Admin approves, adjusts or rejects it. Submitted requests
                      can't be edited here.
                    </p>
                  </div>
                </form>

                {/* Right Summary Card (col-span-4) */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-[#DCE2EB] p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="flex items-start gap-2.5 pb-3 border-b border-[#EDF2F7]">
                    <div className="size-7 rounded-md bg-[#F1F5F9] text-[#001A3D] flex items-center justify-center shrink-0">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#001A3D]">
                        Request Summary
                      </h3>
                      <p className="text-xs text-[#5A6E85]">
                        Updates as you type
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-left text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-[#5A6E85] uppercase tracking-wider block mb-0.5">
                        Request Type
                      </span>
                      <span className="font-bold text-[#001A3D] block">
                        {newRequestType}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#5A6E85] uppercase tracking-wider block mb-0.5">
                        Requested Amount
                      </span>
                      <span className="font-bold text-[#001A3D] block">
                        {newRequestedAmount || '1000'}
                      </span>
                      <span className="text-[11px] text-[#5A6E85] block mt-0.5">
                        Currency context follows the Agent credit setup
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#5A6E85] uppercase tracking-wider block mb-0.5">
                        Reason
                      </span>
                      <span className="font-medium text-[#001A3D] block leading-relaxed line-clamp-3">
                        {newReason || 'Explain why you need this credit change'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#EDF2F7]">
                      <span className="text-[10px] font-semibold text-[#5A6E85] uppercase tracking-wider block mb-1">
                        Status after submission
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F2FC] text-[#0267B8] border border-[#B8D8F8]">
                          <Clock className="size-3" />
                          Pending
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5A6E85] block mt-1">
                        Awaiting an Aero Wing Admin decision
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2 border-t border-[#EDF2F7]">
                    <Button
                      type="button"
                      onClick={() => handleSubmitNewRequest()}
                      className="w-full bg-[#E5A823] hover:bg-[#D49917] text-[#001A3D] font-extrabold text-xs py-2.5 shadow-md cursor-pointer"
                    >
                      <Check className="size-4 mr-1.5 stroke-[2.5]" />
                      Submit Request
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('history')}
                      className="w-full text-xs font-semibold text-[#001A3D] border-[#DCE2EB] bg-white hover:bg-[#F8FAFC]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Page Footer */}
        <footer className="mt-auto p-4 sm:p-6 border-t border-[#DCE2EB] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A6E85]">
          <span>
            AeroWing Agent Portal · M2.8 Credit Request & Request History ·
            Website
          </span>
          <span>
            Design prototype — no credit, approval, ledger or notification
            system is called.
          </span>
        </footer>
      </div>

      {/* Credit Request Details Sheet (Figma #743:4134) */}
      <CreditRequestDetailsSheet
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        request={selectedRequest}
        onViewInHistory={() => {
          setIsDetailsOpen(false)
          setActiveTab('history')
        }}
      />

      {/* Credit Request Submitted Dialog (Figma #743:4132) */}
      <CreditRequestSubmittedDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        request={recentlySubmittedRequest}
        onSubmitAnother={() => {
          setIsSuccessDialogOpen(false)
          setNewRequestedAmount('1000')
          setNewReason('Explain why you need this credit change')
          setActiveTab('new')
        }}
        onBackToCredit={() => {
          setIsSuccessDialogOpen(false)
          window.location.href = '/wallet'
        }}
        onViewRequest={() => {
          setIsSuccessDialogOpen(false)
          setActiveTab('history')
          setIsDetailsOpen(true)
        }}
      />
    </div>
  )
}

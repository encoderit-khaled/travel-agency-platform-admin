import * as React from 'react'
import {
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  Search,
  RotateCw,
  Printer,
  X,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { DatePicker } from '#/components/ui/date-picker'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { AgentStatementsExportDialog } from './agent-statements-export-dialog'
import {
  initialStatementSummary,
  initialStatementBookings,
  initialStatementWalletTransactions,
  initialStatementCreditUsage,
  initialStatementCommissions,
} from './agent-statements-data'
import type {
  BookingStatus,
  CommissionStatus,
  StatementBooking,
  StatementCommission,
  StatementWalletTransaction,
} from './agent-statements-types'

interface AgentStatementsPageProps {
  initialExportOpen?: boolean
  initialExportFormat?: 'csv' | 'pdf'
  initialNodeId?: string
}

export function AgentStatementsPage({
  initialExportOpen = false,
  initialExportFormat = 'csv',
  initialNodeId,
}: AgentStatementsPageProps) {
  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Statement period preset state: 'this-month' | 'previous-month' | 'custom'
  const [periodPreset, setPeriodPreset] = React.useState<
    'this-month' | 'previous-month' | 'custom'
  >('custom')
  const [fromDate, setFromDate] = React.useState('2026-10-01')
  const [toDate, setToDate] = React.useState('2026-11-16')
  const [formattedPeriod, setFormattedPeriod] = React.useState(
    '01 Oct 2026 – 16 Nov 2026',
  )
  const [refreshing, setRefreshing] = React.useState(false)

  // Collapsible section states
  const [bookingsExpanded, setBookingsExpanded] = React.useState(true)
  const [walletExpanded, setWalletExpanded] = React.useState(true)
  const [creditExpanded, setCreditExpanded] = React.useState(true)
  const [commissionsExpanded, setCommissionsExpanded] = React.useState(true)

  // Export modal & preview states (handles nodes 749-10386 and 749-10388)
  const isCSVNode =
    initialNodeId === '749-10386' || initialNodeId === '749:10386'
  const isPDFNode =
    initialNodeId === '749-10388' || initialNodeId === '749:10388'

  const [exportModalOpen, setExportModalOpen] = React.useState(
    initialExportOpen || isCSVNode || isPDFNode,
  )
  const [exportFormat, setExportFormat] = React.useState<'csv' | 'pdf'>(
    isPDFNode || initialExportFormat === 'pdf' ? 'pdf' : 'csv',
  )
  const [pdfPreviewMode, setPdfPreviewMode] = React.useState(isPDFNode)

  React.useEffect(() => {
    if (initialExportOpen || isCSVNode || isPDFNode) {
      setExportModalOpen(true)
      if (isPDFNode || initialExportFormat === 'pdf') {
        setExportFormat('pdf')
        if (isPDFNode) {
          setPdfPreviewMode(true)
        }
      } else {
        setExportFormat('csv')
      }
    }
  }, [
    initialExportOpen,
    initialExportFormat,
    initialNodeId,
    isCSVNode,
    isPDFNode,
  ])

  const handlePresetChange = (
    preset: 'this-month' | 'previous-month' | 'custom',
  ) => {
    setPeriodPreset(preset)
    if (preset === 'this-month') {
      setFromDate('2026-11-01')
      setToDate('2026-11-30')
      setFormattedPeriod('01 Nov 2026 – 30 Nov 2026')
    } else if (preset === 'previous-month') {
      setFromDate('2026-10-01')
      setToDate('2026-10-31')
      setFormattedPeriod('01 Oct 2026 – 31 Oct 2026')
    } else {
      setFromDate('2026-10-01')
      setToDate('2026-11-16')
      setFormattedPeriod('01 Oct 2026 – 16 Nov 2026')
    }
  }

  const handleApplyFilter = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 400)
  }

  const openExport = (format: 'csv' | 'pdf') => {
    if (format === 'pdf') {
      setPdfPreviewMode(true)
    } else {
      setExportModalOpen(true)
    }
  }

  // Helper for Booking Status Badge
  const renderBookingStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E6F4EC] text-[#0E6A3D] border border-[#C5E9D5]">
            Confirmed
          </span>
        )
      case 'Ticketed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E6F4EC] text-[#0E6A3D] border border-[#C5E9D5]">
            Ticketed
          </span>
        )
      case 'Issued':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4FD] text-[#0267B8] border border-[#CFE4FA]">
            Issued
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF6E6] text-[#B54708] border border-[#FADBB3]">
            Pending
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA]">
            Cancelled
          </span>
        )
      case 'Refunded':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F4F3FF] text-[#5925DC] border border-[#DDD6FE]">
            Refunded
          </span>
        )
      case 'Failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
            Failed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        )
    }
  }

  // Helper for Commission Status Badge
  const renderCommissionStatusBadge = (status: CommissionStatus) => {
    switch (status) {
      case 'Settled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E6F4EC] text-[#0E6A3D] border border-[#C5E9D5]">
            Settled
          </span>
        )
      case 'Earned':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4FD] text-[#0267B8] border border-[#CFE4FA]">
            Earned
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF6E6] text-[#B54708] border border-[#FADBB3]">
            Pending
          </span>
        )
      case 'Commission reversed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
            Commission reversed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        )
    }
  }

  // Helper for Wallet Direction Badge
  const renderWalletDirectionBadge = (direction: 'Credit' | 'Debit') => {
    if (direction === 'Credit') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E6F4EC] text-[#0E6A3D] border border-[#C5E9D5]">
          Credit
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA]">
        Debit
      </span>
    )
  }

  const statementBookingColumns = React.useMemo<
    ColumnDef<StatementBooking>[]
  >(() => {
    const head = 'text-xs font-bold text-[#4F5B70]'
    return [
      {
        id: 'reference',
        header: 'Booking Reference',
        meta: {
          headerClassName: head,
          cellClassName: 'font-semibold text-[#0267B8]',
        },
        cell: ({ row }) => row.original.reference,
      },
      {
        id: 'customer',
        header: 'Customer',
        meta: {
          headerClassName: head,
          cellClassName: 'font-medium text-[#141B28]',
        },
        cell: ({ row }) => row.original.customer,
      },
      {
        id: 'service',
        header: 'Service',
        meta: {
          headerClassName: head,
          cellClassName: 'text-[#4F5B70]',
        },
        cell: ({ row }) => row.original.service,
      },
      {
        id: 'createdBy',
        header: 'Created By',
        meta: { headerClassName: head },
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <div className="font-medium text-[#141B28]">
              {row.original.createdBy}
            </div>
            <div className="text-[10px] text-[#4F5B70]">
              {row.original.creatorType}
            </div>
          </div>
        ),
      },
      {
        id: 'date',
        header: 'Booking Date',
        meta: {
          headerClassName: head,
          cellClassName: 'text-[#4F5B70] whitespace-nowrap',
        },
        cell: ({ row }) => row.original.date,
      },
      {
        id: 'status',
        header: 'Booking Status',
        meta: { headerClassName: head },
        cell: ({ row }) => renderBookingStatusBadge(row.original.status),
      },
      {
        id: 'amount',
        header: 'Booking Amount',
        meta: {
          headerClassName: `${head} text-right`,
          cellClassName: 'text-right font-medium text-[#141B28]',
        },
        cell: ({ row }) => row.original.amount,
      },
    ]
  }, [renderBookingStatusBadge])

  const statementWalletColumns = React.useMemo<
    ColumnDef<StatementWalletTransaction>[]
  >(() => {
    const head = 'text-xs font-bold text-[#4F5B70]'
    return [
      {
        id: 'dateTime',
        header: 'Date / Time',
        meta: {
          headerClassName: head,
          cellClassName: 'text-[#4F5B70] whitespace-nowrap',
        },
        cell: ({ row }) => row.original.dateTime,
      },
      {
        id: 'type',
        header: 'Type',
        meta: {
          headerClassName: head,
          cellClassName: 'font-semibold text-[#141B28]',
        },
        cell: ({ row }) => row.original.type,
      },
      {
        id: 'description',
        header: 'Description',
        meta: {
          headerClassName: head,
          cellClassName: 'text-[#4F5B70]',
        },
        cell: ({ row }) => row.original.description,
      },
      {
        id: 'reference',
        header: 'Reference',
        meta: {
          headerClassName: head,
          cellClassName: 'text-[#0267B8] font-mono',
        },
        cell: ({ row }) => row.original.reference,
      },
      {
        id: 'direction',
        header: 'Direction',
        meta: { headerClassName: head },
        cell: ({ row }) => renderWalletDirectionBadge(row.original.direction),
      },
      {
        id: 'amount',
        header: 'Amount',
        meta: {
          headerClassName: `${head} text-right`,
          cellClassName: 'text-right font-semibold',
        },
        cell: ({ row }) => (
          <span
            className={
              row.original.direction === 'Credit'
                ? 'text-[#0E6A3D]'
                : 'text-[#D92D20]'
            }
          >
            {row.original.amount}
          </span>
        ),
      },
      {
        id: 'runningBalance',
        header: 'Running Balance',
        meta: {
          headerClassName: `${head} text-right`,
          cellClassName: 'text-right font-medium text-[#141B28]',
        },
        cell: ({ row }) => row.original.runningBalance,
      },
    ]
  }, [renderWalletDirectionBadge])

  const statementCommissionColumns = React.useMemo<
    ColumnDef<StatementCommission>[]
  >(() => {
    const head = 'text-xs font-bold text-[#4F5B70]'
    return [
      {
        id: 'bookingReference',
        header: 'Booking',
        meta: {
          headerClassName: head,
          cellClassName: 'font-semibold text-[#0267B8]',
        },
        cell: ({ row }) => row.original.bookingReference,
      },
      {
        id: 'service',
        header: 'Service',
        meta: {
          headerClassName: head,
          cellClassName: 'text-[#141B28]',
        },
        cell: ({ row }) => row.original.service,
      },
      {
        id: 'status',
        header: 'Commission Status',
        meta: { headerClassName: head },
        cell: ({ row }) => renderCommissionStatusBadge(row.original.status),
      },
      {
        id: 'commissionAmount',
        header: 'Commission',
        meta: {
          headerClassName: `${head} text-right`,
          cellClassName: 'text-right font-medium text-[#141B28]',
        },
        cell: ({ row }) => row.original.commissionAmount,
      },
      {
        id: 'settlementImpact',
        header: 'Settlement / Impact',
        meta: { headerClassName: head },
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <div className="font-medium text-[#141B28]">
              {row.original.settlementImpact}
            </div>
            {row.original.impactNote && (
              <div className="text-[10px] text-[#D92D20]">
                {row.original.impactNote}
              </div>
            )}
          </div>
        ),
      },
    ]
  }, [renderCommissionStatusBadge])

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col font-sans text-[#141B28]">
      {/* Shell with Sidebar + Main Content */}
      <div className="flex flex-1 min-h-screen">
        {/* Navigation Sidebar */}
        <div className="hidden lg:block shrink-0 print:hidden">
          <AgentPortalSidebar
            currentActive="Statements"
            activePath="/statements"
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <div className="sticky top-0 z-20 print:hidden">
            <AgentPortalHeader
              onToggleMobileSidebar={() => setMobileMenuOpen(true)}
              breadcrumbCurrent="Statements"
              breadcrumbs={[
                { label: 'Agent Portal', active: false },
                { label: 'Statements', active: true },
              ]}
            />
          </div>

          {/* Main page body */}
          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-[1520px] w-full mx-auto space-y-6 print:p-0 print:m-0 print:max-w-none">
            {/* PDF Statement Export Preview Banner (Figma #749:10388) */}
            {pdfPreviewMode ? (
              <div className="bg-[#012A5E] text-white p-4 sm:px-6 sm:py-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 print:hidden">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    PDF statement export preview
                  </h3>
                  <p className="text-xs text-blue-100">
                    All sections are expanded. Choose &ldquo;Save as PDF&rdquo;
                    in the print dialog — this prototype has no PDF backend.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-[#F1C134] hover:bg-[#E5B52A] text-[#012A5E] font-bold text-xs h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Open Print Dialog</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPdfPreviewMode(false)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-medium text-xs h-9 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Exit Preview</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Page Title & Top Actions Section (#749:9513) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0267B8]">
                        Agent Portal · M2.10 Agent Statements
                      </span>
                      {isPDFNode && (
                        <Badge className="bg-[#EBF3FC] text-[#0267B8] border-[#C6DDF7] text-[10px] font-extrabold px-2 py-0.5 rounded">
                          Figma #749:10388 (Download PDF)
                        </Badge>
                      )}
                      {isCSVNode && (
                        <Badge className="bg-[#F1F5F9] text-[#1E293B] border-[#E2E8F0] text-[10px] font-extrabold px-2 py-0.5 rounded">
                          Figma #749:10386 (Download CSV)
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                      Agent Statements
                    </h1>
                    <p className="text-sm text-[#4F5B70]">
                      Review account activity for a selected period and download
                      your statement.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-semibold text-sm text-[#141B28]">
                        {initialStatementSummary.agentName}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#EBEFF5] text-[#4F5B70] border border-[#DCE2EB]">
                        Sample data
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Download CSV & Download PDF */}
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={() => openExport('csv')}
                      variant="outline"
                      className="h-10 px-4 bg-white border border-[#B7C0CF] text-[#012A5E] hover:bg-[#F4F6FA] font-medium text-xs rounded-xl shadow-sm gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#012A5E]" />
                      <span>Download CSV</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={() => openExport('pdf')}
                      className="h-10 px-5 bg-[#F1C134] hover:bg-[#E5B52A] text-[#012A5E] font-bold text-xs rounded-xl shadow-sm gap-2 border border-[#E0B228] transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#012A5E]" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                </div>

                {/* Statement Period Control Bar (#749:9540) */}
                <section className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#DCE2EB] shadow-sm space-y-4 print:hidden">
                  <div className="flex items-center gap-2 text-[#012A5E]">
                    <Calendar className="w-4 h-4 text-[#0267B8]" />
                    <h2 className="text-sm font-bold tracking-tight">
                      Statement Period
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* Period Presets */}
                    <div className="md:col-span-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handlePresetChange('this-month')}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          periodPreset === 'this-month'
                            ? 'bg-[#EAF4FD] border-[#012A5E] text-[#012A5E]'
                            : 'bg-white border-[#C9D2DF] text-[#4F5B70] hover:bg-[#F4F6FA]'
                        }`}
                      >
                        This Month
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetChange('previous-month')}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          periodPreset === 'previous-month'
                            ? 'bg-[#EAF4FD] border-[#012A5E] text-[#012A5E]'
                            : 'bg-white border-[#C9D2DF] text-[#4F5B70] hover:bg-[#F4F6FA]'
                        }`}
                      >
                        Previous Month
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetChange('custom')}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          periodPreset === 'custom'
                            ? 'bg-[#EAF4FD] border-[#012A5E] text-[#012A5E]'
                            : 'bg-white border-[#C9D2DF] text-[#4F5B70] hover:bg-[#F4F6FA]'
                        }`}
                      >
                        Custom
                      </button>
                    </div>

                    {/* Date Inputs: From & To */}
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-[#4F5B70]">
                        From
                      </label>
                      <DatePicker
                        value={fromDate}
                        onChange={(val) => {
                          setFromDate(val)
                          setPeriodPreset('custom')
                        }}
                        placeholder="Select start date"
                        className="h-10 text-xs rounded-xl"
                        clearable
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-[#4F5B70]">
                        To
                      </label>
                      <DatePicker
                        value={toDate}
                        onChange={(val) => {
                          setToDate(val)
                          setPeriodPreset('custom')
                        }}
                        placeholder="Select end date"
                        className="h-10 text-xs rounded-xl"
                        clearable
                      />
                    </div>

                    {/* View Statement Button */}
                    <div className="md:col-span-1">
                      <Button
                        type="button"
                        onClick={handleApplyFilter}
                        disabled={refreshing}
                        className="w-full h-10 bg-[#012A5E] hover:bg-[#001A3D] text-white text-xs font-semibold rounded-xl px-3 shadow-sm gap-1.5"
                      >
                        {refreshing ? (
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        <span>View</span>
                      </Button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Official Statement Document Paper Container (#749:9594) */}
            <div
              id="statement-document-paper"
              className="bg-white rounded-[20px] border border-[#E6EAF0] shadow-md overflow-hidden print:border-none print:shadow-none print:m-0 print:p-0"
            >
              {/* Document Header with Gradient Linear (#749:9594) */}
              <div
                className="p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{
                  background:
                    'linear-gradient(174deg, rgba(0, 26, 61, 1) 0%, rgba(1, 42, 94, 1) 100%, rgba(15, 63, 125, 1) 100%)',
                }}
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Agent Statement
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white/90 border border-white/20">
                      Sample data
                    </span>
                  </div>
                </div>

                {/* Metadata List: Agent, Statement Period, Statement Type */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-right">
                  <div className="text-left sm:text-right">
                    <dt className="text-white/60 text-[11px]">Agent</dt>
                    <dd className="font-semibold text-white tracking-wide">
                      {initialStatementSummary.agentName}
                    </dd>
                  </div>
                  <div className="text-left sm:text-right">
                    <dt className="text-white/60 text-[11px]">
                      Statement Period
                    </dt>
                    <dd className="font-semibold text-white tracking-wide">
                      {formattedPeriod}
                    </dd>
                  </div>
                  <div className="text-left sm:text-right">
                    <dt className="text-white/60 text-[11px]">
                      Statement Type
                    </dt>
                    <dd className="font-semibold text-white tracking-wide">
                      {initialStatementSummary.statementType}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Document Body (#749:9621) */}
              <div className="p-4 sm:p-7 space-y-6">
                {/* Statement Summary Row (#749:9622) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Card 1: Bookings */}
                  <div className="p-3.5 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                    <div className="text-[11px] font-medium text-[#4F5B70]">
                      Bookings
                    </div>
                    <div className="text-sm font-bold text-[#141B28]">
                      Activity available
                    </div>
                    <div className="text-xs text-[#4F5B70]">12 in period</div>
                  </div>

                  {/* Card 2: Wallet Transactions */}
                  <div className="p-3.5 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                    <div className="text-[11px] font-medium text-[#4F5B70]">
                      Wallet Transactions
                    </div>
                    <div className="text-sm font-bold text-[#141B28]">
                      Activity available
                    </div>
                    <div className="text-xs text-[#4F5B70]">10 in period</div>
                  </div>

                  {/* Card 3: Credit Usage */}
                  <div className="p-3.5 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                    <div className="text-[11px] font-medium text-[#4F5B70]">
                      Credit Usage
                    </div>
                    <div className="text-sm font-bold text-[#141B28]">
                      Usage available
                    </div>
                    <div
                      className="text-[11px] text-[#4F5B70] line-clamp-1"
                      title="Credit Limit, Used, Available, Outstanding"
                    >
                      Credit Limit, Used, Available, Outstanding
                    </div>
                  </div>

                  {/* Card 4: Commissions */}
                  <div className="p-3.5 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                    <div className="text-[11px] font-medium text-[#4F5B70]">
                      Commissions
                    </div>
                    <div className="text-sm font-bold text-[#141B28]">
                      Activity available
                    </div>
                    <div className="text-xs text-[#4F5B70]">5 in period</div>
                  </div>

                  {/* Card 5: Closing Balance (Highlighted yellow card) */}
                  <div className="col-span-2 sm:col-span-1 p-3.5 bg-[#FEF9E7] rounded-xl border border-[#F6DC79] space-y-1">
                    <div className="text-[11px] font-medium text-[#8F6B00]">
                      Closing Balance
                    </div>
                    <div className="text-sm font-bold text-[#141B28]">
                      Statement value
                    </div>
                    <div className="text-xs text-[#8F6B00]">
                      System-provided
                    </div>
                  </div>
                </div>

                {/* Section 1: Bookings (#749:9658) */}
                <section className="border border-[#E6EAF0] rounded-2xl overflow-hidden shadow-xs">
                  {/* Section Header */}
                  <div className="p-4 bg-white flex items-center justify-between border-b border-[#E6EAF0]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingsExpanded(!bookingsExpanded)}
                        className="w-7 h-7 rounded-lg border border-[#DCE2EB] flex items-center justify-center text-[#4F5B70] hover:bg-[#F4F6FA]"
                        aria-label="Toggle Bookings"
                      >
                        {bookingsExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <h3 className="text-base font-bold text-[#012A5E]">
                        Bookings
                      </h3>
                      <Badge className="bg-[#EAF4FD] text-[#0267B8] font-bold text-xs px-2 py-0.5 rounded-full border border-[#D0E2FA]">
                        12
                      </Badge>
                    </div>

                    <a
                      href="/bookings"
                      className="text-xs font-semibold text-[#0267B8] hover:underline flex items-center gap-1 print:hidden"
                    >
                      <span>View Booking History</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Section Content: Table */}
                  {bookingsExpanded && (
                    <div className="overflow-x-auto">
                      <DataTable
                        data={initialStatementBookings}
                        columns={statementBookingColumns}
                        getRowId={(row) => row.id}
                        headerClassName="bg-[#F8FAFC]"
                        headerRowClassName="border-b border-[#E6EAF0] hover:bg-transparent"
                        rowClassName="hover:bg-[#F9FAFC] border-b border-[#F0F2F6] text-xs transition-colors"
                      />

                      {/* Informational footnote */}
                      <div className="p-3 bg-[#FAFBFD] border-t border-[#E6EAF0] text-[11px] text-[#4F5B70] flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-[#0267B8] shrink-0" />
                        <span>
                          Created By shows booking origin. Sub-agent bookings
                          settle against the Parent Agent account; no separate
                          Sub-agent statement exists. Booking dates are
                          fictional samples.
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Section 2: Wallet Transactions (#749:9942) */}
                <section className="border border-[#E6EAF0] rounded-2xl overflow-hidden shadow-xs">
                  {/* Section Header */}
                  <div className="p-4 bg-white flex items-center justify-between border-b border-[#E6EAF0]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setWalletExpanded(!walletExpanded)}
                        className="w-7 h-7 rounded-lg border border-[#DCE2EB] flex items-center justify-center text-[#4F5B70] hover:bg-[#F4F6FA]"
                        aria-label="Toggle Wallet Transactions"
                      >
                        {walletExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <h3 className="text-base font-bold text-[#012A5E]">
                        Wallet Transactions
                      </h3>
                      <Badge className="bg-[#EAF4FD] text-[#0267B8] font-bold text-xs px-2 py-0.5 rounded-full border border-[#D0E2FA]">
                        10
                      </Badge>
                    </div>

                    <a
                      href="/wallet-ledger"
                      className="text-xs font-semibold text-[#0267B8] hover:underline flex items-center gap-1 print:hidden"
                    >
                      <span>View Wallet Ledger</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Section Content: Table */}
                  {walletExpanded && (
                    <div className="overflow-x-auto">
                      <DataTable
                        data={initialStatementWalletTransactions}
                        columns={statementWalletColumns}
                        getRowId={(row) => row.id}
                        headerClassName="bg-[#F8FAFC]"
                        headerRowClassName="border-b border-[#E6EAF0] hover:bg-transparent"
                        rowClassName="hover:bg-[#F9FAFC] border-b border-[#F0F2F6] text-xs transition-colors"
                      />

                      {/* Informational footnote */}
                      <div className="p-3 bg-[#FAFBFD] border-t border-[#E6EAF0] text-[11px] text-[#4F5B70] flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-[#0267B8] shrink-0" />
                        <span>
                          Wallet entries are read-only ledger records. A manual
                          deposit recorded by Admin is a Top-up; corrections are
                          Manual Adjustment entries.
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Section 3: Credit Usage (#749:10164) */}
                <section className="border border-[#E6EAF0] rounded-2xl overflow-hidden shadow-xs">
                  {/* Section Header */}
                  <div className="p-4 bg-white flex items-center justify-between border-b border-[#E6EAF0]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCreditExpanded(!creditExpanded)}
                        className="w-7 h-7 rounded-lg border border-[#DCE2EB] flex items-center justify-center text-[#4F5B70] hover:bg-[#F4F6FA]"
                        aria-label="Toggle Credit Usage"
                      >
                        {creditExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <h3 className="text-base font-bold text-[#012A5E]">
                        Credit Usage
                      </h3>
                    </div>

                    <a
                      href="/wallet"
                      className="text-xs font-semibold text-[#0267B8] hover:underline flex items-center gap-1 print:hidden"
                    >
                      <span>View Credit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Section Content: 4 Metric Cards */}
                  {creditExpanded && (
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                          <div className="text-xs font-semibold text-[#4F5B70]">
                            Credit Limit
                          </div>
                          <div className="text-sm font-bold text-[#141B28]">
                            {initialStatementCreditUsage.creditLimit}
                          </div>
                        </div>

                        <div className="p-4 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                          <div className="text-xs font-semibold text-[#4F5B70]">
                            Used Credit
                          </div>
                          <div className="text-sm font-bold text-[#141B28]">
                            {initialStatementCreditUsage.usedCredit}
                          </div>
                        </div>

                        <div className="p-4 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                          <div className="text-xs font-semibold text-[#4F5B70]">
                            Available Credit
                          </div>
                          <div className="text-sm font-bold text-[#141B28]">
                            {initialStatementCreditUsage.availableCredit}
                          </div>
                        </div>

                        <div className="p-4 bg-[#F4F6FA] rounded-xl border border-[#E6EAF0] space-y-1">
                          <div className="text-xs font-semibold text-[#4F5B70]">
                            Outstanding Balance
                          </div>
                          <div className="text-sm font-bold text-[#141B28]">
                            {initialStatementCreditUsage.outstandingBalance}
                          </div>
                        </div>
                      </div>

                      {/* Informational footnote */}
                      <div className="p-3 bg-[#FAFBFD] rounded-xl border border-[#E6EAF0] text-[11px] text-[#4F5B70] flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-[#0267B8] shrink-0" />
                        <span>{initialStatementCreditUsage.note}</span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Section 4: Commissions (#749:10208) */}
                <section className="border border-[#E6EAF0] rounded-2xl overflow-hidden shadow-xs">
                  {/* Section Header */}
                  <div className="p-4 bg-white flex items-center justify-between border-b border-[#E6EAF0]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setCommissionsExpanded(!commissionsExpanded)
                        }
                        className="w-7 h-7 rounded-lg border border-[#DCE2EB] flex items-center justify-center text-[#4F5B70] hover:bg-[#F4F6FA]"
                        aria-label="Toggle Commissions"
                      >
                        {commissionsExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <h3 className="text-base font-bold text-[#012A5E]">
                        Commissions
                      </h3>
                      <Badge className="bg-[#EAF4FD] text-[#0267B8] font-bold text-xs px-2 py-0.5 rounded-full border border-[#D0E2FA]">
                        5
                      </Badge>
                    </div>

                    <a
                      href="/pricing-markup"
                      className="text-xs font-semibold text-[#0267B8] hover:underline flex items-center gap-1 print:hidden"
                    >
                      <span>View Commissions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Section Content: Table */}
                  {commissionsExpanded && (
                    <div className="overflow-x-auto">
                      <DataTable
                        data={initialStatementCommissions}
                        columns={statementCommissionColumns}
                        getRowId={(row) => row.id}
                        headerClassName="bg-[#F8FAFC]"
                        headerRowClassName="border-b border-[#E6EAF0] hover:bg-transparent"
                        rowClassName="hover:bg-[#F9FAFC] border-b border-[#F0F2F6] text-xs transition-colors"
                      />

                      {/* Informational footnote */}
                      <div className="p-3 bg-[#FAFBFD] border-t border-[#E6EAF0] text-[11px] text-[#4F5B70] flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-[#0267B8] shrink-0" />
                        <span>
                          Commission statuses: Pending, Earned, Settled. A
                          cancellation or refund reverses commission — shown as
                          an impact, not a status. Rules are configured by Aero
                          Wing Admin.
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Section 5: Closing Balance (#749:10320) */}
                <div
                  className="p-5 sm:p-6 rounded-[18px] border flex flex-col md:flex-row md:items-center justify-between gap-4"
                  style={{
                    background:
                      'linear-gradient(175deg, rgba(255, 251, 235, 1) 0%, rgba(255, 243, 204, 1) 100%)',
                    borderColor: '#F1C134',
                  }}
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#012A5E]">
                      Closing Balance
                    </h3>
                    <p className="text-xs text-[#4F5B70] max-w-xl">
                      {initialStatementSummary.closingBalanceNote}
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xs px-5 py-3 rounded-xl border border-[#F1C134]/60 text-right space-y-0.5 shrink-0">
                    <div className="text-sm font-bold text-[#141B28]">
                      {initialStatementSummary.closingBalanceStatus}
                    </div>
                    <div className="text-xs font-semibold text-[#8F6B00]">
                      {formattedPeriod}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Footer (#749:10333) */}
              <div className="px-6 py-4 bg-[#FAFBFD] border-t border-[#E6EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#4F5B70]">
                <span>
                  Agent Statement · {initialStatementSummary.agentName} ·{' '}
                  {formattedPeriod}
                </span>
                <span className="italic">
                  Sample data — fictional design-preview content · Read-only
                  statement
                </span>
              </div>
            </div>

            {/* Bottom Page Footer (#749:10338) */}
            <footer className="pt-4 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#4F5B70] border-t border-[#E6EAF0] print:hidden">
              <span>
                AeroWing Agent Portal · M2.10 Agent Statements · Website
              </span>
              <span className="text-slate-400">
                Design prototype — no accounting, PDF or export service is
                called.
              </span>
            </footer>
          </main>
        </div>
      </div>

      {/* Export Dialog (#749:10386 & #749:10388) */}
      <AgentStatementsExportDialog
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        summary={{
          ...initialStatementSummary,
          formattedPeriod,
        }}
        bookings={initialStatementBookings}
        walletTx={initialStatementWalletTransactions}
        commissions={initialStatementCommissions}
        initialFormat={exportFormat}
      />
    </div>
  )
}

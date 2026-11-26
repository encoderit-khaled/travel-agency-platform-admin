import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Wallet,
  ArrowLeft,
  Download,
  Search,
  Lock,
  SlidersHorizontal,
  Percent,
  RotateCcw,
  Ticket,
  Plus,
  MinusCircle,
  PlusCircle,
  Info,
  Calendar,
  Eye,
  Clock,
  BookOpen,
  Filter,
  X,
  Building2,
  RefreshCw,
  ExternalLink,
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
import { TopUpWalletDialog } from './top-up-wallet-dialog'
import { TransactionDetailsSheet } from './transaction-details-sheet'
import { WalletLedgerExportDialog } from './wallet-ledger-export-dialog'
import { initialTransactions, initialWalletSummary } from './wallet-ledger-data'
import type {
  WalletTransaction,
  TransactionType,
  TransactionDirection,
  FundingSourceFilter,
  SortOrder,
} from './wallet-ledger-types'

interface WalletLedgerPageProps {
  initialTransactionId?: string
  initialSelectedTransactionId?: string
  initialDrawerOpen?: boolean
  initialExportOpen?: boolean
  initialNodeId?: string
}

export function WalletLedgerPage({
  initialTransactionId,
  initialSelectedTransactionId,
  initialDrawerOpen,
  initialExportOpen,
  initialNodeId,
}: WalletLedgerPageProps) {
  const isContentLoading = useContentLoading()
  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Node-based modal defaults matching Figma #728:29735 and #728:29736
  const isExportNode =
    initialNodeId === '728-29735' ||
    initialNodeId === '728:29735' ||
    initialExportOpen === true ||
    (initialExportOpen === undefined && initialNodeId === undefined) // default open for Figma 728-29735 request

  const isDetailsNode =
    initialNodeId === '728-29736' ||
    initialNodeId === '728:29736' ||
    initialDrawerOpen === true

  // Modals state
  const [exportOpen, setExportOpen] = React.useState(Boolean(isExportNode))
  const [topUpOpen, setTopUpOpen] = React.useState(false)

  const activeTxId =
    initialSelectedTransactionId || initialTransactionId || 'tx-01'
  const shouldOpenDrawer =
    initialDrawerOpen !== undefined
      ? initialDrawerOpen
      : isDetailsNode || Boolean(initialSelectedTransactionId && !isExportNode)

  const [selectedTx, setSelectedTx] = React.useState<WalletTransaction | null>(
    () => {
      const found = initialTransactions.find(
        (t) =>
          t.id === activeTxId ||
          t.id === activeTxId.replace('tx-', 'tx-0') ||
          t.id.replace('0', '') === activeTxId,
      )
      return found || initialTransactions[0] || null
    },
  )
  const [detailsDrawerOpen, setDetailsDrawerOpen] =
    React.useState(shouldOpenDrawer)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] =
    React.useState<TransactionType>('All Types')
  const [directionFilter, setDirectionFilter] =
    React.useState<TransactionDirection>('All')
  const [sourceFilter, setSourceFilter] =
    React.useState<FundingSourceFilter>('All')
  const [fromDate, setFromDate] = React.useState('')
  const [toDate, setToDate] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('Newest first')

  // Filter logic
  const filteredTransactions = React.useMemo(() => {
    let result = [...initialTransactions]

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q) ||
          (t.subtitle && t.subtitle.toLowerCase().includes(q)) ||
          t.dateTime.toLowerCase().includes(q),
      )
    }

    // Type filter
    if (typeFilter !== 'All Types') {
      result = result.filter((t) => t.type === typeFilter)
    }

    // Direction filter
    if (directionFilter !== 'All') {
      result = result.filter((t) => t.direction === directionFilter)
    }

    // Source filter
    if (sourceFilter !== 'All') {
      result = result.filter((t) => {
        if (sourceFilter === 'Stripe') return t.source === 'Stripe'
        if (sourceFilter === 'Admin Deposit') return t.source === 'Admin'
        return true
      })
    }

    // From date
    if (fromDate) {
      result = result.filter((t) => t.rawDate >= fromDate)
    }

    // To date
    if (toDate) {
      result = result.filter((t) => t.rawDate <= toDate)
    }

    // Sorting
    if (sortOrder === 'Oldest first') {
      result.reverse()
    }

    return result
  }, [
    searchQuery,
    typeFilter,
    directionFilter,
    sourceFilter,
    fromDate,
    toDate,
    sortOrder,
  ])

  const hasActiveFilters =
    Boolean(searchQuery) ||
    typeFilter !== 'All Types' ||
    directionFilter !== 'All' ||
    sourceFilter !== 'All' ||
    Boolean(fromDate) ||
    Boolean(toDate)

  const clearFilters = () => {
    setSearchQuery('')
    setTypeFilter('All Types')
    setDirectionFilter('All')
    setSourceFilter('All')
    setFromDate('')
    setToDate('')
    setSortOrder('Newest first')
  }

  const handleOpenTransaction = (tx: WalletTransaction) => {
    setSelectedTx(tx)
    setDetailsDrawerOpen(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Manual Adjustment':
        return (
          <div className="size-8 rounded-lg bg-[#EAEFF7] text-[#012A5E] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="size-4" />
          </div>
        )
      case 'Commission Credit':
        return (
          <div className="size-8 rounded-lg bg-[#FFF7E6] text-[#D97706] flex items-center justify-center shrink-0">
            <Percent className="size-4" />
          </div>
        )
      case 'Refund':
        return (
          <div className="size-8 rounded-lg bg-[#EBF5FF] text-[#0267B8] flex items-center justify-center shrink-0">
            <RotateCcw className="size-4" />
          </div>
        )
      case 'Booking Debit':
        return (
          <div className="size-8 rounded-lg bg-[#E6F0FA] text-[#012A5E] flex items-center justify-center shrink-0">
            <Ticket className="size-4" />
          </div>
        )
      case 'Top-up':
        return (
          <div className="size-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <Plus className="size-4" />
          </div>
        )
      default:
        return (
          <div className="size-8 rounded-lg bg-[#F0F4F8] text-[#001A3D] flex items-center justify-center shrink-0">
            <Wallet className="size-4" />
          </div>
        )
    }
  }

  const columns = React.useMemo<ColumnDef<WalletTransaction, unknown>[]>(() => {
    const clickable = (tx: WalletTransaction, node: React.ReactNode) => (
      <div className="contents" onClick={() => handleOpenTransaction(tx)}>
        {node}
      </div>
    )

    return [
      {
        accessorKey: 'dateTime',
        header: 'Date & Time',
        cell: ({ row }) => {
          const tx = row.original
          return clickable(
            tx,
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-[#001A3D]">
                {tx.dateTime}
              </span>
              <span className="text-[11px] font-bold text-[#718096]">
                {tx.time}
              </span>
            </div>,
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 w-32.5',
          cellClassName: 'py-4 px-4 align-middle',
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const tx = row.original
          return clickable(
            tx,
            <div className="flex items-center gap-2.5">
              {getTypeIcon(tx.type)}
              <span className="font-bold text-xs text-[#001A3D]">{tx.type}</span>
            </div>,
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 min-w-50',
          cellClassName: 'py-4 px-4 align-middle',
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
          const tx = row.original
          return clickable(
            tx,
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-[#001A3D]">
                {tx.description}
              </span>
              {tx.subtitle && (
                <span className="text-[11px] text-[#718096]">{tx.subtitle}</span>
              )}
            </div>,
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 min-w-60',
          cellClassName: 'py-4 px-4 align-middle',
        },
      },
      {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => {
          const tx = row.original
          return clickable(
            tx,
            tx.reference !== '—' ? (
              <span className="font-bold text-xs text-[#0267B8]">
                {tx.reference}
              </span>
            ) : (
              <span className="text-xs text-[#718096] font-medium">—</span>
            ),
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 w-35',
          cellClassName: 'py-4 px-4 align-middle',
        },
      },
      {
        accessorKey: 'direction',
        header: 'Direction',
        cell: ({ row }) => {
          const tx = row.original
          const isDebit = tx.direction === 'Debit'
          return clickable(
            tx,
            isDebit ? (
              <span className="inline-flex items-center gap-1.5 text-[#DC2626] font-bold text-xs bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                <MinusCircle className="size-3 text-[#DC2626]" />
                Debit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#059669] font-bold text-xs bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <PlusCircle className="size-3 text-[#059669]" />
                Credit
              </span>
            ),
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 w-30',
          cellClassName: 'py-4 px-4 align-middle',
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
          const tx = row.original
          const isDebit = tx.direction === 'Debit'
          return clickable(
            tx,
            <span
              className={`font-bold text-xs ${
                isDebit ? 'text-[#DC2626]' : 'text-[#059669]'
              }`}
            >
              {tx.amount}
            </span>,
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 text-right w-37.5',
          cellClassName: 'py-4 px-4 align-middle text-right',
        },
      },
      {
        accessorKey: 'runningBalance',
        header: 'Running Balance',
        cell: ({ row }) =>
          clickable(row.original, row.original.runningBalance),
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 text-right w-40',
          cellClassName:
            'py-4 px-4 align-middle text-right font-extrabold text-xs text-[#001A3D]',
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const tx = row.original
          return clickable(
            tx,
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenTransaction(tx)
              }}
              className="h-8 rounded-lg border-[#DCE2EB] bg-white text-[#001A3D] font-bold text-xs hover:bg-[#F0F4F8] gap-1.5 shadow-2xs"
            >
              <Eye className="size-3.5 text-[#0267B8]" />
              <span>View Details</span>
            </Button>,
          )
        },
        meta: {
          headerClassName:
            'text-xs font-bold text-[#5A6578] uppercase tracking-wider py-3.5 px-4 text-right w-37.5',
          cellClassName: 'py-4 px-4 align-middle text-right',
        },
      },
    ]
  }, [getTypeIcon, handleOpenTransaction])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <AgentPortalSidebar
          currentActive="Wallet"
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AgentPortalHeader
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            breadcrumbCurrent="Wallet Ledger"
            breadcrumbs={[
              { label: 'Agent Portal' },
              { label: 'Wallet', active: true },
              { label: 'Ledger', active: true },
            ]}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Top Navigation Row: Back Link */}
            <div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/agent'
                }}
                className="text-sm font-semibold text-[#0267B8] hover:text-[#014882] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back to Wallet</span>
              </button>
            </div>

            {/* Page Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#0267B8] tracking-wider uppercase">
                  Agent Portal · M2.6 Wallet Ledger
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001A3D] tracking-tight">
                  Wallet Ledger
                </h1>
                <p className="text-sm text-[#5A6578] max-w-2xl leading-relaxed">
                  View the complete transaction history for Skyline Demo Travels
                  Ltd’s Agent wallet.
                </p>
                <div className="flex items-center gap-2.5 pt-1">
                  <span className="text-sm font-bold text-[#001A3D]">
                    Skyline Demo Travels Ltd
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-[#F0F4F8] text-[#5A6578] border-[#DCE2EB] text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    Sample data
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/wallet'
                  }}
                  className="bg-white hover:bg-[#F8FAFC] text-[#001A3D] border-[#DCE2EB] font-bold rounded-xl h-11 px-4 gap-2 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="size-4 text-[#001A3D]" />
                  <span>Back to Wallet</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => setExportOpen(true)}
                  className="bg-[#F5B800] hover:bg-[#E5AC00] text-[#001A3D] font-bold rounded-xl h-11 px-5 gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Download className="size-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            {/* 3 KPI Summary Cards */}
            {isContentLoading ? (
              <CardGridSkeleton
                count={3}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                cardClassName="h-36 rounded-2xl"
              />
            ) : null}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isContentLoading ? "hidden" : ""}`}>
              {/* Card 1: Current Wallet Balance */}
              <div className="bg-linear-to-br from-[#001A3D] via-[#012A5E] to-[#0F3F7D] rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-9 rounded-xl bg-[#F5B800]/20 border border-[#F5B800]/30 flex items-center justify-center text-[#F5B800]">
                      <Wallet className="size-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white/90 border-white/20 text-xs font-medium"
                    >
                      Sample data
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">
                    Current Wallet Balance
                  </p>
                  <h3 className="text-2xl font-black tracking-tight text-white mt-1">
                    {initialWalletSummary.currentBalanceLabel}
                  </h3>
                </div>
                <p className="text-xs text-white/60 mt-4">
                  {initialWalletSummary.balanceSubtext}
                </p>
              </div>

              {/* Card 2: Ledger Records */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-9 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center">
                      <BookOpen className="size-5" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#5A6578] uppercase tracking-wide">
                    Ledger Records
                  </p>
                  <h3 className="text-2xl font-black tracking-tight text-[#001A3D] mt-1">
                    {filteredTransactions.length}
                  </h3>
                </div>
                <p className="text-xs text-[#5A6578] mt-4">
                  {initialWalletSummary.recordsSubtext}
                </p>
              </div>

              {/* Card 3: Last Activity */}
              <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                      <Clock className="size-5" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#5A6578] uppercase tracking-wide">
                    Last Activity
                  </p>
                  <h3 className="text-lg font-bold tracking-tight text-[#001A3D] mt-1">
                    {initialWalletSummary.lastActivityTitle}
                  </h3>
                </div>
                <p className="text-xs text-[#5A6578] mt-4">
                  {initialWalletSummary.lastActivitySubtext}
                </p>
              </div>
            </div>

            {/* Immutability / Read-Only Banner */}
            <div className="bg-[#F0F4F8] border border-[#DCE2EB] rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
              <div className="size-8 rounded-lg bg-white border border-[#DCE2EB] text-[#012A5E] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Lock className="size-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#001A3D]">
                  Wallet ledger entries cannot be edited
                </h4>
                <p className="text-xs text-[#5A6578] leading-relaxed">
                  Each transaction is a permanent wallet record. Corrections are
                  recorded through new adjustment entries.
                </p>
              </div>
            </div>

            {/* Transactions Section Card */}
            <div className="bg-white border border-[#DCE2EB] rounded-2xl shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="p-5 sm:p-6 border-b border-[#E6EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center shrink-0">
                    <Wallet className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-[#001A3D]">
                        Transactions
                      </h2>
                      <Badge
                        variant="outline"
                        className="bg-[#F8FAFC] text-[#5A6578] border-[#E2E8F0] text-xs font-semibold"
                      >
                        Sample data
                      </Badge>
                    </div>
                    <p className="text-xs text-[#5A6578] mt-0.5">
                      Time-stamped wallet records with running balance
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[#5A6578] font-medium">
                  Showing{' '}
                  <span className="font-bold text-[#001A3D]">
                    {filteredTransactions.length}
                  </span>{' '}
                  transactions · {sortOrder}
                </div>
              </div>

              {/* Filters Area */}
              <div className="p-5 sm:p-6 bg-[#FAFBFD] border-b border-[#E6EAF0] space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096]" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions by description, type, reference, date..."
                    className="pl-10 pr-10 h-11 rounded-xl bg-white border-[#DCE2EB] text-sm focus-visible:ring-1 focus-visible:ring-[#0267B8]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#001A3D]"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* 6 Grid Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {/* Filter 1: Transaction Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A6578]">
                      Transaction Type
                    </label>
                    <Select
                      value={typeFilter}
                      onValueChange={(val) =>
                        setTypeFilter(val as TransactionType)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#001A3D]">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="Manual Adjustment">
                          Manual Adjustment
                        </SelectItem>
                        <SelectItem value="Commission Credit">
                          Commission Credit
                        </SelectItem>
                        <SelectItem value="Refund">Refund</SelectItem>
                        <SelectItem value="Booking Debit">
                          Booking Debit
                        </SelectItem>
                        <SelectItem value="Top-up">Top-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter 2: Direction */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A6578]">
                      Direction
                    </label>
                    <Select
                      value={directionFilter}
                      onValueChange={(val) =>
                        setDirectionFilter(val as TransactionDirection)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#001A3D]">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Directions</SelectItem>
                        <SelectItem value="Credit">Credit (+)</SelectItem>
                        <SelectItem value="Debit">Debit (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter 3: Funding Source */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A6578]">
                      Funding Source (Top-up)
                    </label>
                    <Select
                      value={sourceFilter}
                      onValueChange={(val) =>
                        setSourceFilter(val as FundingSourceFilter)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#001A3D]">
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Sources</SelectItem>
                        <SelectItem value="Stripe">Stripe</SelectItem>
                        <SelectItem value="Admin Deposit">
                          Admin Deposit
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter 4: From Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A6578]">
                      From
                    </label>
                    <DatePicker
                      value={fromDate}
                      onChange={setFromDate}
                      placeholder="Start date"
                      className="h-10 rounded-xl"
                      clearable
                    />
                  </div>

                  {/* Filter 5: To Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A6578]">
                      To
                    </label>
                    <DatePicker
                      value={toDate}
                      onChange={setToDate}
                      placeholder="End date"
                      className="h-10 rounded-xl"
                      clearable
                    />
                  </div>

                  {/* Filter 6: Sort Order */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A6578]">
                      Sort By
                    </label>
                    <Select
                      value={sortOrder}
                      onValueChange={(val) => setSortOrder(val as SortOrder)}
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white border-[#DCE2EB] text-xs font-semibold text-[#001A3D]">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Newest first">
                          Newest first
                        </SelectItem>
                        <SelectItem value="Oldest first">
                          Oldest first
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reset Filters Option if any active */}
                {hasActiveFilters && (
                  <div className="flex justify-end pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-[#DC2626] hover:bg-red-50 hover:text-red-700 h-8 gap-1.5 cursor-pointer"
                    >
                      <X className="size-3.5" />
                      <span>Clear all filters</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <DataTable
                  data={filteredTransactions}
                  columns={
                    columns as unknown as ColumnDef<
                      (typeof filteredTransactions)[number],
                      unknown
                    >[]
                  }
                  getRowId={(row) => row.id}
                  headerRowClassName="bg-[#F8FAFC] border-b border-[#E6EAF0] hover:bg-[#F8FAFC]"
                  rowClassName={(row) =>
                    `border-b border-[#E6EAF0] transition-colors cursor-pointer ${
                      selectedTx?.id === row.original.id && detailsDrawerOpen
                        ? 'bg-[#F0F6FE]'
                        : 'hover:bg-[#F9FAFC]'
                    }`
                  }
                  emptyCellClassName="h-48 text-center text-[#5A6578]"
                  empty={
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Info className="size-8 text-[#718096]" />
                      <p className="font-bold text-sm text-[#001A3D]">
                        No transactions found
                      </p>
                      <p className="text-xs text-[#5A6578]">
                        Try adjusting your search or filter parameters.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="mt-2 text-xs rounded-xl"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  }
                />
              </div>

              {/* Table Footer Disclaimers */}
              <div className="p-4 bg-[#FAFBFD] border-t border-[#E6EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5A6578]">
                <div className="flex items-center gap-1.5">
                  <Info className="size-3.5 text-[#718096] shrink-0" />
                  <span>
                    Sample timestamps, amounts and balances are fictional
                    design-preview data.
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="size-3.5 text-[#718096] shrink-0" />
                  <span>
                    Read-only records · corrections are new adjustment entries
                  </span>
                </div>
              </div>
            </div>
          </main>

          {/* Page Footer */}
          <footer className="border-t border-[#E6EAF0] bg-white py-4 px-6 sm:px-8 mt-auto text-xs text-[#5A6578] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>AeroWing Agent Portal · M2.6 Wallet Ledger · Website</span>
            <span>
              Design prototype — no payment, Stripe, ledger or export service is
              called.
            </span>
          </footer>
        </div>
      </div>

      {/* Transaction Details Sheet (Figma #728:29736) */}
      <TransactionDetailsSheet
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        transaction={selectedTx}
        onNavigateToBooking={(ref) => {
          window.location.href = `/agent-booking-details?booking=${ref}`
        }}
      />

      {/* Top Up Wallet Dialog */}
      <TopUpWalletDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        agencyName={initialWalletSummary.agencyName}
      />

      {/* Export Dialog */}
      <WalletLedgerExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        transactions={filteredTransactions}
        agencyName={initialWalletSummary.agencyName}
      />
    </div>
  )
}

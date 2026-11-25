import * as React from 'react'
import {
  Wallet,
  ArrowRight,
  Plus,
  CreditCard,
  Building2,
  Lock,
  Info,
  Layers,
  FileSpreadsheet,
  Coins,
  Receipt,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Users,
  ShieldCheck,
  Percent,
} from 'lucide-react'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { TopUpWalletDialog } from './top-up-wallet-dialog'
import { WalletLedgerExportDialog } from './wallet-ledger-export-dialog'
import { BookingPreviewSheet } from './booking-preview-sheet'
import { AGENT_BOOKINGS_DATA } from './agent-bookings-data'
import { initialTransactions } from './wallet-ledger-data'
import type { AgentBookingItem } from './agent-bookings-data'
import { cn } from 'cn'

export interface AgentWalletPageProps {
  initialTopUpOpen?: boolean
  initialMenu?: 'dropdown' | 'notifications'
}

interface WalletTransactionItem {
  id: string
  dateTime: string
  type:
    | 'Top-up'
    | 'Booking Debit'
    | 'Refund'
    | 'Commission Credit'
    | 'Manual Adjustment'
  description: string
  subDescription?: string
  linkText?: string
  linkHref?: string
  reference: string
  amount: string
  direction: 'credit' | 'debit' | 'adjustment'
  runningBalance: string
}

const WALLET_TRANSACTIONS: WalletTransactionItem[] = [
  {
    id: 'tx-1',
    dateTime: 'Demo date · Demo time',
    type: 'Top-up',
    description: 'Stripe wallet top-up',
    reference: '—',
    amount: '+ Sample amount',
    direction: 'credit',
    runningBalance: 'Sample balance',
  },
  {
    id: 'tx-2',
    dateTime: 'Demo date · Demo time',
    type: 'Booking Debit',
    description: 'Booking payment',
    reference: 'AW-DEMO-FL-001',
    amount: '− Sample amount',
    direction: 'debit',
    runningBalance: 'Sample balance',
  },
  {
    id: 'tx-3',
    dateTime: 'Demo date · Demo time',
    type: 'Refund',
    description: 'Booking refund',
    reference: 'AW-DEMO-AC-011',
    amount: '+ Sample amount',
    direction: 'credit',
    runningBalance: 'Sample balance',
  },
  {
    id: 'tx-4',
    dateTime: 'Demo date · Demo time',
    type: 'Commission Credit',
    description: 'Commission credit',
    linkText: 'View Commissions',
    linkHref: '/sub-agents/markup',
    reference: '—',
    amount: '+ Sample amount',
    direction: 'credit',
    runningBalance: 'Sample balance',
  },
  {
    id: 'tx-5',
    dateTime: 'Demo date · Demo time',
    type: 'Manual Adjustment',
    description: 'Admin adjustment',
    subDescription: 'Recorded by Aero Wing Admin',
    reference: '—',
    amount: '± Sample amount',
    direction: 'adjustment',
    runningBalance: 'Sample balance',
  },
]

export function AgentWalletPage({
  initialTopUpOpen = false,
  initialMenu,
}: AgentWalletPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [topUpOpen, setTopUpOpen] = React.useState(initialTopUpOpen)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [selectedBooking, setSelectedBooking] =
    React.useState<AgentBookingItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [successToast, setSuccessToast] = React.useState<string | null>(null)

  // Sync state if initialTopUpOpen changes (e.g. navigation via URL query params)
  React.useEffect(() => {
    setTopUpOpen(initialTopUpOpen)
  }, [initialTopUpOpen])

  const handleTopUpSuccess = (amount: string) => {
    setSuccessToast(`Top up request of ${amount} initiated via Stripe.`)
    setTimeout(() => {
      setSuccessToast(null)
    }, 4000)
  }

  const handleBookingClick = (reference: string) => {
    const booking =
      AGENT_BOOKINGS_DATA.find((b) => b.ref === reference) ||
      AGENT_BOOKINGS_DATA[0]
    setSelectedBooking(booking)
  }

  const columns = React.useMemo<ColumnDef<WalletTransactionItem>[]>(
    () => [
      {
        accessorKey: 'dateTime',
        header: 'Date / Time',
        cell: ({ row }) => row.original.dateTime,
        meta: {
          headerClassName: 'py-3 px-4 w-[231px]',
          cellClassName:
            'py-4 px-4 font-medium text-[#012A5E] whitespace-nowrap text-xs sm:text-sm',
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const tx = row.original
          return (
            <div className="flex items-center gap-2">
              {tx.type === 'Top-up' && (
                <span className="size-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowDownLeft className="size-3.5" />
                </span>
              )}
              {tx.type === 'Booking Debit' && (
                <span className="size-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ArrowUpRight className="size-3.5" />
                </span>
              )}
              {tx.type === 'Refund' && (
                <span className="size-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                  <RotateCcw className="size-3.5" />
                </span>
              )}
              {tx.type === 'Commission Credit' && (
                <span className="size-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Coins className="size-3.5" />
                </span>
              )}
              {tx.type === 'Manual Adjustment' && (
                <span className="size-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
                  <SlidersHorizontal className="size-3.5" />
                </span>
              )}
              <span className="font-semibold text-[#012A5E] text-xs sm:text-sm">
                {tx.type}
              </span>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 w-[257px]',
          cellClassName: 'py-4 px-4 whitespace-nowrap',
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
          const tx = row.original
          return (
            <div className="space-y-0.5">
              <span className="font-medium text-[#012A5E] text-xs sm:text-sm">
                {tx.description}
              </span>
              {tx.subDescription && (
                <p className="text-[11px] text-[#4F5B70]">
                  {tx.subDescription}
                </p>
              )}
              {tx.linkText && (
                <div className="pt-0.5">
                  <a
                    href={tx.linkHref}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0267B8] hover:underline"
                  >
                    <span>{tx.linkText}</span>
                    <ArrowRight className="size-3" />
                  </a>
                </div>
              )}
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 w-[277px]',
          cellClassName: 'py-4 px-4',
        },
      },
      {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => {
          const tx = row.original
          return tx.reference !== '—' ? (
            <button
              type="button"
              onClick={() => handleBookingClick(tx.reference)}
              className="font-semibold text-[#0267B8] underline hover:text-[#012A5E] cursor-pointer"
            >
              {tx.reference}
            </button>
          ) : (
            <span className="text-[#8D99AE]">—</span>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 w-[176px]',
          cellClassName: 'py-4 px-4 whitespace-nowrap text-xs sm:text-sm',
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
          const tx = row.original
          return (
            <div className="flex flex-col items-end">
              <span
                className={cn(
                  'font-bold text-xs sm:text-sm',
                  tx.direction === 'credit' && 'text-emerald-600',
                  tx.direction === 'debit' && 'text-rose-600',
                  tx.direction === 'adjustment' && 'text-[#012A5E]',
                )}
              >
                {tx.amount}
              </span>
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block mt-0.5',
                  tx.direction === 'credit' && 'bg-emerald-50 text-emerald-700',
                  tx.direction === 'debit' && 'bg-rose-50 text-rose-700',
                  tx.direction === 'adjustment' &&
                    'bg-slate-100 text-slate-700',
                )}
              >
                {tx.direction === 'credit' && 'Credit'}
                {tx.direction === 'debit' && 'Debit'}
                {tx.direction === 'adjustment' && 'Adjustment'}
              </span>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 text-right w-[198px]',
          cellClassName: 'py-4 px-4 text-right whitespace-nowrap',
        },
      },
      {
        accessorKey: 'runningBalance',
        header: 'Running Balance',
        cell: ({ row }) => row.original.runningBalance,
        meta: {
          headerClassName: 'py-3 px-4 text-right w-[202px]',
          cellClassName:
            'py-4 px-4 text-right whitespace-nowrap font-extrabold text-[#012A5E] text-xs sm:text-sm',
        },
      },
    ],
    [handleBookingClick],
  )

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex text-[#001A3D]">
      {/* Sidebar Navigation */}
      <AgentPortalSidebar
        currentActive="Wallet"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activePath="/wallet"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
          breadcrumbCurrent="Wallet"
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Wallet', active: true },
          ]}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          initialMenu={initialMenu}
        />

        {/* Success notification toast if triggered */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-6 py-3 text-sm font-medium flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="text-white/80 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 lg:p-8 space-y-7 max-w-[1600px] w-full mx-auto">
          {/* Page Title & Top Actions */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#0267B8] tracking-wider uppercase">
                Agent Portal · M2.5 Wallet
              </span>
              <h1 className="text-3xl font-extrabold text-[#001A3D] tracking-tight">
                Wallet
              </h1>
              <p className="text-sm text-[#4F5B70]">
                View your Agent wallet balance and recent wallet activity.
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-sm font-bold text-[#001A3D]">
                  Skyline Demo Travels Ltd
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F1FC] text-[#0267B8] border border-[#D0E2FB]">
                  <Info className="size-3" />
                  Sample data
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                className="h-10 px-4 rounded-xl border-[#DCE2EB] bg-white text-[#001A3D] font-semibold hover:bg-[#F4F6FA] shadow-xs flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  window.location.href = '/wallet-ledger'
                }}
              >
                <FileSpreadsheet className="size-4 text-[#4F5B70]" />
                <span>View Full Ledger</span>
              </Button>

              <Button
                className="h-10 px-4 rounded-xl bg-[#F1C134] hover:bg-[#E5B52B] text-[#012A5E] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                onClick={() => setTopUpOpen(true)}
              >
                <Plus className="size-4" />
                <span>Top Up Wallet</span>
              </Button>
            </div>
          </section>

          {/* Hero Section: Balance Card & Summary Metrics */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Hero: Available Wallet Balance (7 cols) */}
            <div className="lg:col-span-7 rounded-[22px] p-7 text-white shadow-xl flex flex-col justify-between relative overflow-hidden bg-[linear-gradient(149deg,#001A3D_0%,#012A5E_57%,#0F3F7D_100%)] border border-white/10">
              {/* Exact decorative geometric circles from Figma */}
              <div className="absolute -top-20 -right-10 w-[336px] h-[336px] rounded-full border-[38px] border-[#F1C134]/12 pointer-events-none" />
              <div className="absolute -bottom-16 right-10 w-[200px] h-[200px] rounded-full bg-[#0267B8]/25 blur-[10px] pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl bg-[#F1C134]/16 flex items-center justify-center text-[#F1C134] shadow-xs">
                      <Wallet className="size-4.5" />
                    </div>
                    <h2 className="text-[15px] font-extrabold text-[#D7E3F4] tracking-wide">
                      Available Wallet Balance
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/12 text-[#D7E3F4] border border-white/18 backdrop-blur-xs">
                    <Info className="size-3 text-[#F1C134]" />
                    Sample data
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Balance available
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/8 text-[#D7E3F4] border border-white/12 backdrop-blur-xs max-w-xl">
                    <Info className="size-3.5 text-[#F1C134] shrink-0" />
                    <span>
                      Exact balance is not included in this design-preview
                      dataset.
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#C9D7EA] max-w-lg font-medium">
                  Wallet funds can be used for eligible booking payments.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6 relative z-10">
                <Button
                  className="h-11 px-5 rounded-xl bg-[#F1C134] hover:bg-[#E5B52B] text-[#012A5E] font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                  onClick={() => setTopUpOpen(true)}
                >
                  <Plus className="size-4" />
                  <span>Top Up Wallet</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-11 px-5 rounded-xl border-white/40 bg-white/5 hover:bg-white/15 text-white font-medium shadow-xs cursor-pointer transition-colors backdrop-blur-xs"
                  onClick={() => {
                    window.location.href = '/wallet-ledger'
                  }}
                >
                  <span>View Full Ledger</span>
                </Button>
              </div>
            </div>

            {/* Right Stack: 3 KPI Summary Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
              {/* Card 1: Recent Transactions */}
              <div className="bg-white rounded-2xl p-4.5 border border-[#DCE2EB] shadow-xs flex flex-col justify-center space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5B70]">
                  <div className="size-6 rounded-lg bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center">
                    <Receipt className="size-3.5" />
                  </div>
                  <span className="font-extrabold text-sm text-[#4F5B70]">
                    Recent Transactions
                  </span>
                </div>
                <div className="text-lg font-extrabold text-[#012A5E]">
                  5 sample records
                </div>
                <div className="text-xs text-[#4F5B70]">
                  Top-up, booking debit, refund, commission credit and
                  adjustment
                </div>
              </div>

              {/* Card 2: Funding */}
              <div className="bg-white rounded-2xl p-4.5 border border-[#DCE2EB] shadow-xs flex flex-col justify-center space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5B70]">
                  <div className="size-6 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
                    <CreditCard className="size-3.5" />
                  </div>
                  <span className="font-extrabold text-sm text-[#4F5B70]">
                    Funding
                  </span>
                </div>
                <div className="text-lg font-extrabold text-[#012A5E]">
                  Stripe + Admin-recorded manual deposit
                </div>
                <div className="text-xs text-[#4F5B70]">
                  Top up with Stripe; manual deposits are recorded by Aero Wing
                  Admin
                </div>
              </div>

              {/* Card 3: Need more purchasing capacity? */}
              <div className="bg-white rounded-2xl p-4.5 border border-[#DCE2EB] shadow-xs flex flex-col justify-center space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5B70]">
                    <div className="size-6 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
                      <Layers className="size-3.5" />
                    </div>
                    <span className="font-extrabold text-sm text-[#4F5B70]">
                      Need more purchasing capacity?
                    </span>
                  </div>
                </div>
                <div className="text-lg font-extrabold text-[#012A5E]">
                  Credit is separate
                </div>
                <div className="text-xs text-[#4F5B70]">
                  Wallet balance and available credit are shown separately.
                </div>
                <div className="pt-1">
                  <a
                    href="/sub-agents/permissions"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0267B8] hover:underline"
                  >
                    <span>View Credit</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Add Funds Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center">
                <Plus className="size-4.5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#012A5E]">
                  Add Funds
                </h2>
                <p className="text-xs text-[#4F5B70]">
                  Two ways funds are added to your Agent wallet
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Stripe Top-up Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#DCE2EB] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="size-10 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center">
                      <CreditCard className="size-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#012A5E]">
                      Stripe Top-up
                    </h3>
                    <p className="text-xs text-[#4F5B70] mt-1">
                      Add funds using a payment method available through Stripe.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#4F5B70] pt-1">
                    <Lock className="size-3.5 text-[#0267B8]" />
                    <span>
                      Card details are entered with Stripe, not on AeroWing.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    className="h-10 px-4 rounded-xl bg-[#F1C134] hover:bg-[#E5B52B] text-[#012A5E] font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                    onClick={() => setTopUpOpen(true)}
                  >
                    <span>Top Up with Stripe</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Manual Deposits Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#DCE2EB] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="size-10 rounded-xl bg-[#F1F5F9] text-[#012A5E] flex items-center justify-center">
                      <Building2 className="size-5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[#F4F6FA] text-[#012A5E] border border-[#DCE2EB] font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"
                    >
                      <Lock className="size-3" />
                      Admin recorded
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#012A5E]">
                      Manual Deposits
                    </h3>
                    <p className="text-xs text-[#4F5B70] mt-1">
                      Manual deposits are recorded by Aero Wing Admin and appear
                      in your Wallet Ledger.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#4F5B70] pt-1">
                    <Info className="size-3.5 text-[#4F5B70]" />
                    <span>
                      You can’t create or edit manual deposits from the Agent
                      Portal.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="h-10 px-4 rounded-xl border-[#DCE2EB] bg-white text-[#012A5E] font-semibold hover:bg-[#F4F6FA] shadow-xs flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      window.location.href = '/wallet-ledger'
                    }}
                  >
                    <span>View in Ledger</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Wallet Activity Section */}
          <section id="recent-activity-section" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center">
                  <Receipt className="size-4.5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#012A5E]">
                    Recent Wallet Activity
                  </h2>
                  <p className="text-xs text-[#4F5B70]">
                    A preview of your Wallet Ledger · oldest to newest
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F1FC] text-[#0267B8] border border-[#D0E2FB] self-start sm:self-auto">
                <Info className="size-3" />
                Sample data
              </span>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-[#DCE2EB] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <DataTable
                  data={WALLET_TRANSACTIONS}
                  columns={columns}
                  getRowId={(row) => row.id}
                  tableClassName="w-full text-left border-collapse text-sm"
                  headerRowClassName="bg-[#EBF1F9] border-b border-[#DCE2EB] text-xs font-semibold text-[#4F5B70] hover:bg-[#EBF1F9]"
                  headClassName="h-auto"
                  bodyClassName="divide-y divide-[#EBF0F7]"
                  rowClassName="hover:bg-[#F9FAFC] transition-colors"
                />
              </div>

              {/* Table Footer Bar */}
              <div className="bg-[#FAFBFD] px-5 py-3 border-t border-[#DCE2EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#4F5B70]">
                  <Info className="size-4 shrink-0 text-[#8D99AE]" />
                  <span>
                    Ledger entries are read-only. Corrections are recorded
                    through adjustment entries.
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#DCE2EB] bg-white text-[#012A5E] font-semibold hover:bg-[#F4F6FA] text-xs shadow-xs self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    window.location.href = '/wallet-ledger'
                  }}
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>View Full Wallet Ledger</span>
                </Button>
              </div>
            </div>
          </section>

          {/* 6 Policy & Information Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCE2EB] shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#012A5E] flex items-center gap-2">
                  <CreditCard className="size-4 text-[#0267B8]" />
                  <span>Booking Payments</span>
                </h3>
                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  Eligible booking payments can be deducted from your Agent
                  wallet.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCE2EB] shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#012A5E] flex items-center gap-2">
                  <Users className="size-4 text-[#0267B8]" />
                  <span>Sub-agent Bookings</span>
                </h3>
                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  Bookings made by your Sub-agents are settled against Skyline
                  Demo Travels Ltd’s wallet and available credit.
                </p>
              </div>
              <div>
                <a
                  href="/sub-agents"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0267B8] hover:underline"
                >
                  <span>View Sub-agents</span>
                  <ArrowRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCE2EB] shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#012A5E] flex items-center gap-2">
                  <RotateCcw className="size-4 text-[#0267B8]" />
                  <span>Refunds to Wallet</span>
                </h3>
                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  When an applicable booking cancellation is refunded to the
                  Agent wallet, the refund appears as a wallet credit.
                </p>
              </div>
            </div>

            {/* Card 4 - Tinted background Catskill White */}
            <div className="bg-[#F4F6FA] rounded-2xl p-5 border border-[#DCE2EB] shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#012A5E] flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#0267B8]" />
                  <span>Wallet records cannot be edited</span>
                </h3>
                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  Wallet ledger entries are permanent records. Corrections are
                  recorded through adjustment entries.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl p-5 border border-[#DCE2EB] shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#012A5E] flex items-center gap-2">
                  <Percent className="size-4 text-[#0267B8]" />
                  <span>Commission Credits</span>
                </h3>
                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  Commission credits can appear in your Wallet Ledger.
                  Commission tracking has its own screen.
                </p>
              </div>
              <div>
                <a
                  href="/sub-agents/markup"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0267B8] hover:underline"
                >
                  <span>View Commissions</span>
                  <ArrowRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Card 6 - Hawkes Blue background */}
            <div className="bg-[#EAF1FB] rounded-2xl p-5 border border-[#C9D7EA] shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#012A5E] flex items-center gap-2">
                  <Layers className="size-4 text-[#0267B8]" />
                  <span>Wallet and Credit</span>
                </h3>
                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  Your wallet balance and available credit are separate. Need
                  more purchasing capacity?
                </p>
              </div>
              <div>
                <a
                  href="/sub-agents/permissions"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0267B8] hover:underline"
                >
                  <span>View Credit</span>
                  <ArrowRight className="size-3" />
                </a>
              </div>
            </div>
          </section>

          {/* Footer Branding & Disclaimer */}
          <footer className="pt-6 pb-12 border-t border-[#DCE2EB] flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-[#4F5B70] gap-2">
            <p>AeroWing Agent Portal · M2.5 Agent Wallet Overview · Website</p>
            <p className="text-[#8D99AE] font-normal">
              Design prototype — no payment, Stripe, ledger or booking system is
              called.
            </p>
          </footer>
        </main>
      </div>

      {/* Top Up Wallet Reusable Shadcn Dialog */}
      <TopUpWalletDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        agencyName="Skyline Demo Travels Ltd"
        onSuccess={handleTopUpSuccess}
      />

      {/* Wallet Ledger Export Dialog */}
      <WalletLedgerExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        transactions={initialTransactions}
      />

      {/* Booking Details Preview Sheet */}
      <BookingPreviewSheet
        open={Boolean(selectedBooking)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedBooking(null)
        }}
        booking={selectedBooking}
      />
    </div>
  )
}

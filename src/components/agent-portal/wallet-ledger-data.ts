export type TransactionType =
  | 'All Types'
  | 'Manual Adjustment'
  | 'Commission Credit'
  | 'Refund'
  | 'Booking Debit'
  | 'Top-up'

export type TransactionDirection = 'All' | 'Credit' | 'Debit'

export type FundingSourceFilter =
  'All' | 'Stripe' | 'Admin Deposit' | 'Bank Transfer'

export type SortOrder =
  'Newest first' | 'Oldest first' | 'Amount high to low' | 'Amount low to high'

export interface WalletTransaction {
  id: string
  date: string
  dateTime?: string
  time: string
  isoDate: string
  rawDate?: string
  type: Exclude<TransactionType, 'All Types'>
  description: string
  subDescription?: string
  subtitle?: string
  reference: string
  direction: 'Credit' | 'Debit'
  amount: string
  rawAmount?: number
  runningBalance: string
  source: string
  isAdjustment?: boolean
}

export interface WalletLedgerSummary {
  agencyName: string
  currentBalanceLabel: string
  balanceSubtext: string
  ledgerRecordsCount: number
  recordsSubtext: string
  lastActivityTitle: string
  lastActivitySubtext: string
}

export const initialWalletSummary: WalletLedgerSummary = {
  agencyName: 'Skyline Demo Travels Ltd',
  currentBalanceLabel: 'Balance available',
  balanceSubtext:
    'Exact balance is not included in this design-preview dataset.',
  ledgerRecordsCount: 10,
  recordsSubtext: 'Sample records across all 5 transaction types',
  lastActivityTitle: 'Sample activity available',
  lastActivitySubtext: 'Manual Adjustment · Admin adjustment',
}

export const initialTransactions: WalletTransaction[] = [
  {
    id: 'tx-01',
    date: '12 Nov 2026',
    dateTime: '12 Nov 2026',
    time: '11:20',
    isoDate: '2026-11-12',
    rawDate: '2026-11-12',
    type: 'Manual Adjustment',
    description: 'Admin adjustment',
    subDescription: 'Recorded by Admin',
    subtitle: 'Recorded by Admin',
    reference: '—',
    direction: 'Debit',
    amount: '− Sample amount',
    rawAmount: -150,
    runningBalance: 'Sample balance',
    source: 'Admin',
    isAdjustment: true,
  },
  {
    id: 'tx-02',
    date: '10 Nov 2026',
    dateTime: '10 Nov 2026',
    time: '16:30',
    isoDate: '2026-11-10',
    rawDate: '2026-11-10',
    type: 'Commission Credit',
    description: 'Commission credit',
    reference: '—',
    direction: 'Credit',
    amount: '+ Sample amount',
    rawAmount: 245.5,
    runningBalance: 'Sample balance',
    source: 'Commission System',
  },
  {
    id: 'tx-03',
    date: '08 Nov 2026',
    dateTime: '08 Nov 2026',
    time: '09:05',
    isoDate: '2026-11-08',
    rawDate: '2026-11-08',
    type: 'Refund',
    description: 'Booking refund',
    reference: 'AW-DEMO-AC-011',
    direction: 'Credit',
    amount: '+ Sample amount',
    rawAmount: 420.0,
    runningBalance: 'Sample balance',
    source: 'Refund Gateway',
  },
  {
    id: 'tx-04',
    date: '05 Nov 2026',
    dateTime: '05 Nov 2026',
    time: '14:40',
    isoDate: '2026-11-05',
    rawDate: '2026-11-05',
    type: 'Booking Debit',
    description: 'Booking payment',
    reference: 'AW-DEMO-FL-001',
    direction: 'Debit',
    amount: '− Sample amount',
    rawAmount: -680.0,
    runningBalance: 'Sample balance',
    source: 'Booking System',
  },
  {
    id: 'tx-05',
    date: '03 Nov 2026',
    dateTime: '03 Nov 2026',
    time: '10:15',
    isoDate: '2026-11-03',
    rawDate: '2026-11-03',
    type: 'Top-up',
    description: 'Stripe wallet top-up',
    subDescription: 'Stripe top-up',
    subtitle: 'Stripe top-up',
    reference: '—',
    direction: 'Credit',
    amount: '+ Sample amount',
    rawAmount: 1000.0,
    runningBalance: 'Sample balance',
    source: 'Stripe',
  },
  {
    id: 'tx-06',
    date: '27 Oct 2026',
    dateTime: '27 Oct 2026',
    time: '16:00',
    isoDate: '2026-10-27',
    rawDate: '2026-10-27',
    type: 'Manual Adjustment',
    description: 'Admin correction',
    subDescription: 'Recorded by Admin',
    subtitle: 'Recorded by Admin',
    reference: '—',
    direction: 'Credit',
    amount: '+ Sample amount',
    rawAmount: 75.0,
    runningBalance: 'Sample balance',
    source: 'Admin',
    isAdjustment: true,
  },
  {
    id: 'tx-07',
    date: '20 Oct 2026',
    dateTime: '20 Oct 2026',
    time: '13:20',
    isoDate: '2026-10-20',
    rawDate: '2026-10-20',
    type: 'Refund',
    description: 'Booking refund',
    reference: '—',
    direction: 'Credit',
    amount: '+ Sample amount',
    rawAmount: 310.0,
    runningBalance: 'Sample balance',
    source: 'Refund Gateway',
  },
  {
    id: 'tx-08',
    date: '14 Oct 2026',
    dateTime: '14 Oct 2026',
    time: '10:05',
    isoDate: '2026-10-14',
    rawDate: '2026-10-14',
    type: 'Booking Debit',
    description: 'Booking payment',
    reference: 'AW-DEMO-BT-009',
    direction: 'Debit',
    amount: '− Sample amount',
    rawAmount: -520.0,
    runningBalance: 'Sample balance',
    source: 'Booking System',
  },
  {
    id: 'tx-09',
    date: '08 Oct 2026',
    dateTime: '08 Oct 2026',
    time: '15:45',
    isoDate: '2026-10-08',
    rawDate: '2026-10-08',
    type: 'Top-up',
    description: 'Manual deposit recorded by Admin',
    subDescription: 'Recorded by Admin',
    subtitle: 'Recorded by Admin',
    reference: '—',
    direction: 'Credit',
    amount: '+ Sample amount',
    rawAmount: 2500.0,
    runningBalance: 'Sample balance',
    source: 'Admin',
  },
  {
    id: 'tx-10',
    date: '02 Oct 2026',
    dateTime: '02 Oct 2026',
    time: '09:30',
    isoDate: '2026-10-02',
    rawDate: '2026-10-02',
    type: 'Top-up',
    description: 'Stripe wallet top-up',
    subDescription: 'Stripe top-up',
    subtitle: 'Stripe top-up',
    reference: '—',
    direction: 'Credit',
    amount: '+ Sample amount',
    rawAmount: 1500.0,
    runningBalance: 'Sample balance',
    source: 'Stripe',
  },
]

export function generateLedgerCSV(transactions: WalletTransaction[]): string {
  const header =
    'Date / Time,Type,Description,Reference,Direction,Amount,Running Balance'
  const rows = transactions.map((t) => {
    const dateTime = `${t.date} ${t.time}`
    const ref = t.reference === '—' ? '' : t.reference
    return `${dateTime},${t.type},${t.description},${ref},${t.direction},${t.amount},${t.runningBalance}`
  })
  return [header, ...rows].join('\n')
}

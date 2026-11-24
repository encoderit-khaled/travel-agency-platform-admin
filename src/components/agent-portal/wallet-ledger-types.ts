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
  dateTime: string
  date?: string
  time: string
  rawDate: string
  type: Exclude<TransactionType, 'All Types'>
  description: string
  subtitle?: string
  subDescription?: string
  reference: string
  direction: 'Credit' | 'Debit'
  amount: string
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

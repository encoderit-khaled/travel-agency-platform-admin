export type BookingServiceType =
  | 'Flight'
  | 'Hotel'
  | 'Car Rental'
  | 'Travel Package'
  | 'Bus / Train'
  | 'Activity'
  | 'Travel Insurance'
  | 'eSIM'

export type StatementBookingStatus =
  | 'Confirmed'
  | 'Issued'
  | 'Ticketed'
  | 'Pending'
  | 'Cancelled'
  | 'Refunded'
  | 'Failed'

export type BookingStatus = StatementBookingStatus

export interface StatementBooking {
  id: string
  reference: string
  customer: string
  service: BookingServiceType
  createdBy: string
  creatorType: 'Sub-agent' | 'Parent Agent'
  date: string
  status: BookingStatus
  amount: string
  currency?: string
}

export type WalletEntryType =
  | 'Top-up'
  | 'Booking Debit'
  | 'Refund'
  | 'Manual Adjustment'
  | 'Commission Credit'

export interface StatementWalletTransaction {
  id: string
  dateTime: string
  type: WalletEntryType
  description: string
  reference: string
  direction: 'Credit' | 'Debit'
  amount: string
  runningBalance: string
}

export interface StatementCreditUsage {
  creditLimit: string
  usedCredit: string
  availableCredit: string
  outstandingBalance: string
  note: string
}

export type CommissionStatus =
  'Settled' | 'Earned' | 'Pending' | 'Commission reversed'

export interface StatementCommission {
  id: string
  bookingReference: string
  service: BookingServiceType
  status: CommissionStatus
  commissionAmount: string
  settlementImpact: string
  impactNote?: string
}

export interface StatementSummaryData {
  agentName: string
  statementType: string
  startDate: string
  endDate: string
  formattedPeriod: string
  bookingsCount: number
  walletTxCount: number
  commissionsCount: number
  bookingsSummary: string
  walletSummary: string
  creditSummary: string
  commissionsSummary: string
  closingBalanceStatus: string
  closingBalanceNote: string
}

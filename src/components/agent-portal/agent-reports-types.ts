export type ReportTab =
  | 'overview'
  | 'sales'
  | 'bookings'
  | 'commissions'
  | 'wallet-credit'
  | 'sub-agents'

export type PeriodPreset =
  'this-month' | 'previous-month' | 'last-30-days' | 'custom'

export interface ReportFilterState {
  periodPreset: PeriodPreset
  fromDate: string
  toDate: string
  service: string
  bookingStatus: string
  createdBy: string
  supplier: string
}

export interface SummaryKPI {
  id: string
  title: string
  metric: string
  note: string
  iconType: 'bookings' | 'sales' | 'commission' | 'wallet' | 'subagents'
  badgeBg: string
  iconColor: string
}

export type ReportKpiCard = SummaryKPI

export interface ReportAreaCard {
  id: string
  title: string
  metric: string
  subtitle: string
  targetTab: ReportTab
  iconType:
    | 'sales'
    | 'service'
    | 'supplier'
    | 'status'
    | 'commission'
    | 'wallet'
    | 'credit'
    | 'subagent'
  iconBgColor: string
  iconColor: string
}

export interface SalesKPISummary {
  grossSales: number
  netSales: number
  agentCommission: number
  avgMarginPercent: number
  avgOrderValue: number
  paidViaWallet: number
  paidViaCredit: number
  bookingCount: number
}

export interface ServiceSalesBreakdown {
  service: string
  bookings: number
  grossSales: number
  netPayable: number
  agentCommission: number
  sharePercent: number
  color: string
}

export interface SubAgentSalesBreakdown {
  agentName: string
  role: string
  location: string
  bookingsCount: number
  grossSales: number
  commissionEarned: number
  sharePercent: number
  status: 'Active' | 'Inactive'
}

export interface SalesTransactionRow {
  invoiceNumber: string
  bookingReference: string
  dateTime: string
  service: string
  customerName: string
  paxCount: number
  createdBy: string
  paymentMethod: 'Wallet' | 'Credit Line' | 'Bank Transfer'
  grossAmount: number
  agentMarkup: number
  netPayable: number
  status: 'Confirmed' | 'Ticketed' | 'Issued' | 'Pending' | 'Completed'
}

export interface BookingStatusBreakdown {
  status: string
  count: number
  color: string
  percentage: number
}

export interface SubAgentPerformanceItem {
  id: string
  name: string
  desk: string
  bookingsCount: number
  grossVolume: string
  commissionShare: string
  active: boolean
  conversionRate: string
}

export interface WalletReportTransaction {
  id: string
  date: string
  time: string
  dateTime: string
  type:
    | 'Top-up'
    | 'Booking Debit'
    | 'Commission Credit'
    | 'Refund'
    | 'Manual Adjustment'
  description: string
  subDescription?: string
  reference: string
  direction: 'Credit' | 'Debit'
  amount: number
  amountFormatted: string
  runningBalance: number
  runningBalanceFormatted: string
  source: string
  status: 'Completed' | 'Pending' | 'Reconciled'
}

export interface CreditFacilityRequest {
  id: string
  date: string
  time: string
  requestType: string
  typeDescription: string
  requestedAmount: number
  requestedAmountFormatted: string
  approvedAmount?: number
  approvedAmountFormatted?: string
  status: 'Approved' | 'Pending' | 'Rejected' | 'Adjusted'
  reason: string
  decision: string
  decisionDate: string | null
  decisionNote: string
}

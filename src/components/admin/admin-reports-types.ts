export type PaymentStatus = 'Paid' | 'Refunded' | 'Failed'

export type ReportTab = 'sales' | 'bookings' | 'payments' | 'commissions'

export interface PaymentReportItem {
  id: string
  date: string
  bookingReference: string
  service: string
  supplier: string
  channel: string
  paymentStatus: PaymentStatus
  paymentAmount: number
}

export interface PaymentStatusSummary {
  status: PaymentStatus
  count: number
  amount: number
  percentage: number
}

export interface AdminReportsFilterState {
  dateFrom: string
  dateTo: string
  service: string
  supplier: string
  channel: string
  statusFilter?: PaymentStatus | 'All'
}

export interface AdminReportsPageProps {
  initialTab?: ReportTab
  initialNodeId?: string
  initialDateFrom?: string
  initialDateTo?: string
  initialService?: string
  initialSupplier?: string
  initialChannel?: string
  className?: string
}

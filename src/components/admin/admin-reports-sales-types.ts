export interface SalesReportRow {
  id: string
  date: string
  service: string
  supplier: string
  channel: string
  bookingCount: number
  amount: number
  amountFormatted: string
}

export interface ServiceSalesBreakdown {
  id: string
  service: string
  amount: number
  amountFormatted: string
  bookingCount: number
  bookingText: string
  percentage: number
}

export interface SalesReportFilters {
  dateFrom: string
  dateTo: string
  service: string
  supplier: string
  channel: string
}

export type ReportTab = 'sales' | 'bookings' | 'payments' | 'commissions'

export interface AdminReportsSalesPageProps {
  initialTab?: ReportTab
  initialNodeId?: string
  initialFrom?: string
  initialTo?: string
  initialService?: string
  initialSupplier?: string
  initialChannel?: string
}

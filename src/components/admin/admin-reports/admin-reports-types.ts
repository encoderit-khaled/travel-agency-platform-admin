export type ReportTab = 'sales' | 'bookings' | 'payments' | 'commissions'

export type ServiceFilter =
  | 'all'
  | 'Flights'
  | 'Hotels'
  | 'Travel Packages'
  | 'Activities'
  | 'Car Rental'
  | 'eSIM'
  | 'Bus / Train'
  | 'Travel Insurance'

export type SupplierFilter =
  | 'all'
  | 'Sample supplier'
  | 'Amadeus GDS'
  | 'Sabre'
  | 'Hotelbeds'
  | 'Viator'

export type ChannelFilter =
  | 'all'
  | 'B2C Website'
  | 'Mobile App'
  | 'B2B Agent Portal'

export type CommissionStatus = 'Settled' | 'Pending' | 'In-Review' | 'Reversed'

export interface CommissionReportRow {
  id: string
  date: string
  service: string
  supplier: string
  channel: string
  bookingCount: number
  salesAmount: number
  commissionRate: number
  commissionAmount: number
  status: CommissionStatus
  bookingRef?: string
  agentName?: string
}

export interface ServiceBreakdownItem {
  service: string
  amount: number
  bookingCount: number
  percentage: number
  color: string
}

export interface ReportKpiCard {
  label: string
  value: string
  subtitle?: string
  tag: string
  iconType: 'chart' | 'dollar' | 'percent' | 'check' | 'clock' | 'wallet'
}

export interface AdminReportsPageProps {
  initialTab?: ReportTab
  initialNodeId?: string
  initialFromDate?: string
  initialToDate?: string
  initialService?: ServiceFilter
  initialSupplier?: SupplierFilter
  initialChannel?: ChannelFilter
  initialExportOpen?: boolean
  className?: string
}

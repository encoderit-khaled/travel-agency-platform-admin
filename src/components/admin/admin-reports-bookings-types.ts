export type BookingStatus = 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled'

export type BookingService =
  | 'Flights'
  | 'Hotels'
  | 'Travel Packages'
  | 'Activities'
  | 'Car Rental'
  | 'eSIM'
  | 'Bus / Train'
  | 'Travel Insurance'

export type BookingChannel =
  | 'B2C Website'
  | 'Mobile App'
  | 'B2B Agent Portal'
  | 'Corporate Portal'

export interface BookingRecordItem {
  id: string
  bookingRef: string
  date: string
  time: string
  dateTimeFormatted: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: BookingService
  serviceDetails: string
  supplier: string
  channel: BookingChannel
  amount: number
  amountFormatted: string
  currency: string
  status: BookingStatus
  pnr: string
  paymentMethod: string
  paymentStatus: 'Paid' | 'Authorized' | 'Refunded' | 'Pending'
  notes?: string
}

export interface BookingBreakdownItem {
  id: string
  label: string
  count: number
  percentage: number
  amount?: number
  amountFormatted?: string
  color?: string
}

export interface BookingsKpiMetrics {
  totalBookings: number
  totalGrossAmount: number
  totalGrossFormatted: string
  confirmedCount: number
  completedCount: number
  pendingCount: number
  cancelledCount: number
  confirmedCompletedRate: number
  cancellationRate: number
}

export interface AdminReportsFilterState {
  dateFrom: string
  dateTo: string
  service: string
  supplier: string
  channel: string
}

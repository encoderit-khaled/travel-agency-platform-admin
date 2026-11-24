import type { CommissionStatus } from './agent-statements-types'

export type { CommissionStatus }

export type BookingStatus = 'Confirmed' | 'Refunded' | 'Cancelled'

export type CommissionService =
  'Flight' | 'Hotel' | 'Travel Package' | 'Activity' | 'Car Rental'

export interface CommissionRecord {
  id: string
  bookingId: string
  service: CommissionService
  customer: string
  createdByName: string
  createdBySource: 'Sub-agent' | 'Parent Agent'
  bookingStatus: BookingStatus
  commissionStatus: CommissionStatus
  amount: string
  supplier: string
  date: string
  rule: string
  reversedReason?: string
  notes?: string
}

export interface CommissionSummaryStats {
  pendingCount: number
  pendingAmount: string
  earnedCount: number
  earnedAmount: string
  settledCount: number
  settledAmount: string
  totalRecords: number
  activeCount: number
  reversedCount: number
}

export const INITIAL_COMMISSION_SUMMARY: CommissionSummaryStats = {
  pendingCount: 1,
  pendingAmount: 'Sample amount',
  earnedCount: 1,
  earnedAmount: 'Sample amount',
  settledCount: 1,
  settledAmount: 'Sample amount',
  totalRecords: 5,
  activeCount: 3,
  reversedCount: 2,
}

export const INITIAL_COMMISSION_RECORDS: CommissionRecord[] = [
  {
    id: 'comm-1',
    bookingId: 'AW-DEMO-FL-006',
    service: 'Flight',
    customer: 'Mahin Chowdhury',
    createdByName: 'Banani Desk',
    createdBySource: 'Sub-agent',
    bookingStatus: 'Confirmed',
    commissionStatus: 'Pending',
    amount: 'Sample amount',
    supplier: 'Unavailable',
    date: '04 Nov 2026',
    rule: 'Admin configured',
  },
  {
    id: 'comm-2',
    bookingId: 'AW-DEMO-HT-002',
    service: 'Hotel',
    customer: 'Karim Hasan',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    bookingStatus: 'Confirmed',
    commissionStatus: 'Earned',
    amount: 'Sample amount',
    supplier: 'Unavailable',
    date: '06 Nov 2026',
    rule: 'Admin configured',
  },
  {
    id: 'comm-3',
    bookingId: 'AW-DEMO-PK-003',
    service: 'Travel Package',
    customer: 'Nadia Islam',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    bookingStatus: 'Confirmed',
    commissionStatus: 'Settled',
    amount: 'Sample amount',
    supplier: 'Unavailable',
    date: '08 Nov 2026',
    rule: 'Admin configured',
  },
  {
    id: 'comm-4',
    bookingId: 'AW-DEMO-AC-011',
    service: 'Activity',
    customer: 'Nafisa Rahman',
    createdByName: 'Skyline Demo Travels Ltd',
    createdBySource: 'Parent Agent',
    bookingStatus: 'Refunded',
    commissionStatus: 'Commission reversed',
    amount: 'Sample amount',
    reversedReason: 'Reversed due to refund · not in active totals',
    supplier: 'Unavailable',
    date: '02 Nov 2026',
    rule: 'Admin configured',
  },
  {
    id: 'comm-5',
    bookingId: 'AW-DEMO-CR-005',
    service: 'Car Rental',
    customer: 'Farhana Noor',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    bookingStatus: 'Cancelled',
    commissionStatus: 'Commission reversed',
    amount: 'Sample amount',
    reversedReason: 'Reversed due to cancellation · not in active totals',
    supplier: 'Unavailable',
    date: '01 Nov 2026',
    rule: 'Admin configured',
  },
]

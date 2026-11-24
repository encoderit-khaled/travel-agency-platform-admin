import type {
  SummaryKPI,
  ReportAreaCard,
  SalesKPISummary,
  ServiceSalesBreakdown,
  SubAgentSalesBreakdown,
  SalesTransactionRow,
} from './agent-reports-types'
import type { AgentBookingItem } from './agent-bookings-data'
import { AGENT_BOOKINGS_DATA } from './agent-bookings-data'

export interface ServiceBreakdownItem {
  id: string
  service: string
  count: number
  percentage: number
  icon: string
}

export interface StatusBreakdownItem {
  id: string
  status: string
  count: number
  icon: string
  badgeVariant:
    | 'confirmed'
    | 'issued'
    | 'ticketed'
    | 'pending'
    | 'cancelled'
    | 'refunded'
    | 'failed'
}

export interface ReportBookingRecord {
  id: string
  ref: string
  customer: string
  service: string
  status:
    | 'Confirmed'
    | 'Issued'
    | 'Ticketed'
    | 'Pending'
    | 'Cancelled'
    | 'Refunded'
    | 'Failed'
  createdBy: string
  createdByType: 'Parent Agent' | 'Sub-agent'
  supplier: string
  bookingDate: string
  fareAmount?: string
  totalAmount?: string
}

// ==========================================
// 1. BOOKINGS REPORT SPECIFIC DATA (NODE 821:1921)
// ==========================================

export const BOOKINGS_BY_SERVICE_DATA: ServiceBreakdownItem[] = [
  { id: 'srv-fl', service: 'Flight', count: 3, percentage: 25, icon: 'Plane' },
  { id: 'srv-ht', service: 'Hotel', count: 2, percentage: 17, icon: 'Hotel' },
  {
    id: 'srv-pk',
    service: 'Travel Package',
    count: 1,
    percentage: 8,
    icon: 'Package',
  },
  {
    id: 'srv-ac',
    service: 'Activity',
    count: 2,
    percentage: 17,
    icon: 'Compass',
  },
  { id: 'srv-cr', service: 'Car Rental', count: 1, percentage: 8, icon: 'Car' },
  {
    id: 'srv-es',
    service: 'eSIM',
    count: 1,
    percentage: 8,
    icon: 'Smartphone',
  },
  {
    id: 'srv-bt',
    service: 'Bus / Train',
    count: 1,
    percentage: 8,
    icon: 'Train',
  },
  {
    id: 'srv-ti',
    service: 'Travel Insurance',
    count: 1,
    percentage: 8,
    icon: 'ShieldCheck',
  },
]

export const BOOKINGS_BY_STATUS_DATA: StatusBreakdownItem[] = [
  {
    id: 'st-pending',
    status: 'Pending',
    count: 1,
    icon: 'Clock',
    badgeVariant: 'pending',
  },
  {
    id: 'st-confirmed',
    status: 'Confirmed',
    count: 4,
    icon: 'CheckCircle2',
    badgeVariant: 'confirmed',
  },
  {
    id: 'st-ticketed',
    status: 'Ticketed',
    count: 1,
    icon: 'Ticket',
    badgeVariant: 'ticketed',
  },
  {
    id: 'st-issued',
    status: 'Issued',
    count: 3,
    icon: 'FileCheck2',
    badgeVariant: 'issued',
  },
  {
    id: 'st-cancelled',
    status: 'Cancelled',
    count: 1,
    icon: 'Ban',
    badgeVariant: 'cancelled',
  },
  {
    id: 'st-refunded',
    status: 'Refunded',
    count: 1,
    icon: 'RotateCcw',
    badgeVariant: 'refunded',
  },
  {
    id: 'st-failed',
    status: 'Failed',
    count: 1,
    icon: 'AlertCircle',
    badgeVariant: 'failed',
  },
]

export const REPORT_BOOKING_RECORDS: ReportBookingRecord[] = [
  {
    id: 'bkg-rec-1',
    ref: 'AW-DEMO-PK-003',
    customer: 'Nadia Islam',
    service: 'Travel Package',
    status: 'Confirmed',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '05 Oct 2026',
    totalAmount: 'BDT 85,000',
  },
  {
    id: 'bkg-rec-2',
    ref: 'AW-DEMO-CR-005',
    customer: 'Farhana Noor',
    service: 'Car Rental',
    status: 'Cancelled',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '12 Oct 2026',
    totalAmount: 'BDT 8,000',
  },
  {
    id: 'bkg-rec-3',
    ref: 'AW-DEMO-BT-009',
    customer: 'Maliha Khan',
    service: 'Bus / Train',
    status: 'Confirmed',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    supplier: 'Unavailable',
    bookingDate: '14 Oct 2026',
    totalAmount: 'BDT 2,400',
  },
  {
    id: 'bkg-rec-4',
    ref: 'AW-DEMO-AC-011',
    customer: 'Nafisa Rahman',
    service: 'Activity',
    status: 'Refunded',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    supplier: 'Unavailable',
    bookingDate: '18 Oct 2026',
    totalAmount: 'BDT 9,300',
  },
  {
    id: 'bkg-rec-5',
    ref: 'AW-DEMO-HT-002',
    customer: 'Karim Hasan',
    service: 'Hotel',
    status: 'Confirmed',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '22 Oct 2026',
    totalAmount: 'BDT 28,000',
  },
  {
    id: 'bkg-rec-6',
    ref: 'AW-DEMO-HT-007',
    customer: 'Tania Sultana',
    service: 'Hotel',
    status: 'Issued',
    createdBy: 'Banani Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '26 Oct 2026',
    totalAmount: 'BDT 37,200',
  },
  {
    id: 'bkg-rec-7',
    ref: 'AW-DEMO-TI-010',
    customer: 'Tasnim Karim',
    service: 'Travel Insurance',
    status: 'Issued',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    supplier: 'Unavailable',
    bookingDate: '30 Oct 2026',
    totalAmount: 'BDT 6,500',
  },
  {
    id: 'bkg-rec-8',
    ref: 'AW-DEMO-ES-008',
    customer: 'Rafi Ahmed',
    service: 'eSIM',
    status: 'Issued',
    createdBy: 'Uttara Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '02 Nov 2026',
    totalAmount: 'BDT 3,600',
  },
  {
    id: 'bkg-rec-9',
    ref: 'AW-DEMO-FL-006',
    customer: 'Mahin Chowdhury',
    service: 'Flight',
    status: 'Confirmed',
    createdBy: 'Banani Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '04 Nov 2026',
    totalAmount: 'BDT 33,500',
  },
  {
    id: 'bkg-rec-10',
    ref: 'AW-DEMO-FL-001',
    customer: 'Amina Rahman',
    service: 'Flight',
    status: 'Ticketed',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '05 Nov 2026',
    totalAmount: 'BDT 42,500',
  },
  {
    id: 'bkg-rec-11',
    ref: 'AW-DEMO-AC-004',
    customer: 'Samiul Ahmed',
    service: 'Activity',
    status: 'Pending',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    supplier: 'Unavailable',
    bookingDate: '09 Nov 2026',
    totalAmount: 'BDT 13,200',
  },
  {
    id: 'bkg-rec-12',
    ref: 'AW-DEMO-FL-012',
    customer: 'Imran Hossain',
    service: 'Flight',
    status: 'Failed',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    supplier: 'Unavailable',
    bookingDate: '11 Nov 2026',
    totalAmount: 'BDT 49,500',
  },
]

// ==========================================
// 2. OVERVIEW REPORT DATA (NODE 821:920)
// ==========================================

export const INITIAL_REPORT_KPIS: SummaryKPI[] = [
  {
    id: 'kpi-bookings',
    title: 'Booking Volume',
    metric: '12 bookings',
    note: 'In the applied period and filters',
    iconType: 'bookings',
    badgeBg: 'bg-[#DEE8F5]', // Hawkes Blue
    iconColor: 'text-[#0267B8]', // Science Blue
  },
  {
    id: 'kpi-sales',
    title: 'Sales Activity',
    metric: 'Sales activity available',
    note: 'Sales values not included in sample data',
    iconType: 'sales',
    badgeBg: 'bg-[#EBF7EF]', // Panache light green
    iconColor: 'text-[#0E6A3D]',
  },
  {
    id: 'kpi-commission',
    title: 'Commission Activity',
    metric: 'Commission activity available',
    note: '3 active · 2 reversed',
    iconType: 'commission',
    badgeBg: 'bg-[#FFF6E3]', // Varden light yellow
    iconColor: 'text-[#B54708]',
  },
  {
    id: 'kpi-wallet-credit',
    title: 'Wallet / Credit Status',
    metric: 'Wallet activity available',
    note: 'Credit usage available',
    iconType: 'wallet',
    badgeBg: 'bg-[#F0F4F8]', // Catskill White
    iconColor: 'text-[#475467]',
  },
  {
    id: 'kpi-subagents',
    title: 'Active Sub-agents',
    metric: '3 of 5',
    note: 'Sub-agents with bookings in the period',
    iconType: 'subagents',
    badgeBg: 'bg-[#DEE8F5]',
    iconColor: 'text-[#0267B8]',
  },
]

export const initialSummaryKPIs = INITIAL_REPORT_KPIS

export const INITIAL_REPORT_AREAS: ReportAreaCard[] = [
  {
    id: 'area-sales',
    title: 'Sales',
    metric: 'Sales activity available',
    subtitle: 'Reported sales activity for the period',
    targetTab: 'sales',
    iconType: 'sales',
    iconBgColor: 'bg-[#EBF7EF]',
    iconColor: 'text-[#0E6A3D]',
  },
  {
    id: 'area-bookings-service',
    title: 'Bookings by Service',
    metric: '8 of 8 services',
    subtitle: 'Booking count per service module',
    targetTab: 'bookings',
    iconType: 'service',
    iconBgColor: 'bg-[#DEE8F5]',
    iconColor: 'text-[#0267B8]',
  },
  {
    id: 'area-bookings-supplier',
    title: 'Bookings by Supplier',
    metric: 'Supplier data unavailable',
    subtitle: 'Supplier-based booking reporting',
    targetTab: 'bookings',
    iconType: 'supplier',
    iconBgColor: 'bg-[#F2F4F7]',
    iconColor: 'text-[#667085]',
  },
  {
    id: 'area-bookings-status',
    title: 'Bookings by Status',
    metric: '12 across 7 statuses',
    subtitle: 'Approved booking lifecycle',
    targetTab: 'bookings',
    iconType: 'status',
    iconBgColor: 'bg-[#DEE8F5]',
    iconColor: 'text-[#0267B8]',
  },
  {
    id: 'area-commissions',
    title: 'Commissions',
    metric: '3 active · 2 reversed',
    subtitle: 'Pending, Earned, Settled',
    targetTab: 'commissions',
    iconType: 'commission',
    iconBgColor: 'bg-[#FFF6E3]',
    iconColor: 'text-[#B54708]',
  },
  {
    id: 'area-wallet',
    title: 'Wallet Summary',
    metric: '10 wallet transactions',
    subtitle: 'Credits and debits in the period',
    targetTab: 'wallet-credit',
    iconType: 'wallet',
    iconBgColor: 'bg-[#EBF7EF]',
    iconColor: 'text-[#0E6A3D]',
  },
  {
    id: 'area-credit',
    title: 'Credit Summary',
    metric: 'Credit usage available',
    subtitle: 'Limit, Used, Available, Outstanding',
    targetTab: 'wallet-credit',
    iconType: 'credit',
    iconBgColor: 'bg-[#F2F4F7]',
    iconColor: 'text-[#667085]',
  },
  {
    id: 'area-subagents',
    title: 'Sub-agent Performance',
    metric: '8 Sub-agent bookings',
    subtitle: '3 of 5 Sub-agents active',
    targetTab: 'sub-agents',
    iconType: 'subagent',
    iconBgColor: 'bg-[#DEE8F5]',
    iconColor: 'text-[#0267B8]',
  },
]

export const initialReportAreaCards = INITIAL_REPORT_AREAS

// ==========================================
// 3. SALES & BREAKDOWN DATA
// ==========================================

export const initialSalesSummary: SalesKPISummary = {
  grossSales: 1485600,
  netSales: 1382200,
  agentCommission: 103400,
  avgMarginPercent: 6.96,
  avgOrderValue: 123800,
  paidViaWallet: 620000,
  paidViaCredit: 865600,
  bookingCount: 12,
}

export const SERVICE_BREAKDOWN_DATA: {
  service: string
  bookingsCount: number
  grossSales: string
  commissionEarned: string
  netSales: string
  sharePercentage: number
}[] = [
  {
    service: 'Flights (Domestic & Intl)',
    bookingsCount: 3,
    grossSales: 'BDT 125,500',
    commissionEarned: 'BDT 10,000',
    netSales: 'BDT 115,500',
    sharePercentage: 25,
  },
  {
    service: 'Hotels & Resorts',
    bookingsCount: 2,
    grossSales: 'BDT 65,200',
    commissionEarned: 'BDT 5,700',
    netSales: 'BDT 59,500',
    sharePercentage: 17,
  },
  {
    service: 'Tour & Holiday Packages',
    bookingsCount: 1,
    grossSales: 'BDT 85,000',
    commissionEarned: 'BDT 9,000',
    netSales: 'BDT 76,000',
    sharePercentage: 8,
  },
  {
    service: 'Activities & Tours',
    bookingsCount: 2,
    grossSales: 'BDT 22,500',
    commissionEarned: 'BDT 2,000',
    netSales: 'BDT 20,500',
    sharePercentage: 17,
  },
  {
    service: 'Car Rental & Transfers',
    bookingsCount: 1,
    grossSales: 'BDT 8,000',
    commissionEarned: 'BDT 800',
    netSales: 'BDT 7,200',
    sharePercentage: 8,
  },
  {
    service: 'eSIM Connectivity',
    bookingsCount: 1,
    grossSales: 'BDT 3,600',
    commissionEarned: 'BDT 400',
    netSales: 'BDT 3,200',
    sharePercentage: 8,
  },
  {
    service: 'Bus / Train',
    bookingsCount: 1,
    grossSales: 'BDT 2,400',
    commissionEarned: 'BDT 200',
    netSales: 'BDT 2,200',
    sharePercentage: 8,
  },
  {
    service: 'Travel Insurance',
    bookingsCount: 1,
    grossSales: 'BDT 6,500',
    commissionEarned: 'BDT 700',
    netSales: 'BDT 5,800',
    sharePercentage: 8,
  },
]

export const initialServiceBreakdown: ServiceSalesBreakdown[] = [
  {
    service: 'Flights (Domestic & Intl)',
    bookings: 3,
    grossSales: 125500,
    netPayable: 115500,
    agentCommission: 10000,
    sharePercent: 25,
    color: '#0267B8',
  },
  {
    service: 'Hotels & Accommodations',
    bookings: 2,
    grossSales: 65200,
    netPayable: 59500,
    agentCommission: 5700,
    sharePercent: 17,
    color: '#12B76A',
  },
  {
    service: 'Tour & Holiday Packages',
    bookings: 1,
    grossSales: 85000,
    netPayable: 76000,
    agentCommission: 9000,
    sharePercent: 8,
    color: '#F79009',
  },
  {
    service: 'Activities & Tours',
    bookings: 2,
    grossSales: 22500,
    netPayable: 20500,
    agentCommission: 2000,
    sharePercent: 17,
    color: '#7F56D9',
  },
  {
    service: 'Car Rental',
    bookings: 1,
    grossSales: 8000,
    netPayable: 7200,
    agentCommission: 800,
    sharePercent: 8,
    color: '#06AED4',
  },
  {
    service: 'eSIM Connectivity',
    bookings: 1,
    grossSales: 3600,
    netPayable: 3200,
    agentCommission: 400,
    sharePercent: 8,
    color: '#EE46BC',
  },
  {
    service: 'Bus / Train',
    bookings: 1,
    grossSales: 2400,
    netPayable: 2200,
    agentCommission: 200,
    sharePercent: 8,
    color: '#107569',
  },
  {
    service: 'Travel Insurance',
    bookings: 1,
    grossSales: 6500,
    netPayable: 5800,
    agentCommission: 700,
    sharePercent: 8,
    color: '#D92D20',
  },
]

export const STATUS_BREAKDOWN_DATA: {
  status: string
  count: number
  percentage: number
  color: string
}[] = [
  { status: 'Confirmed', count: 4, percentage: 33.3, color: 'bg-[#12B76A]' },
  { status: 'Issued', count: 3, percentage: 25.0, color: 'bg-[#027A48]' },
  { status: 'Ticketed', count: 1, percentage: 8.3, color: 'bg-[#0267B8]' },
  { status: 'Pending', count: 1, percentage: 8.3, color: 'bg-[#F79009]' },
  { status: 'Cancelled', count: 1, percentage: 8.3, color: 'bg-[#667085]' },
  { status: 'Refunded', count: 1, percentage: 8.3, color: 'bg-[#7F56D9]' },
  { status: 'Failed', count: 1, percentage: 8.3, color: 'bg-[#F04438]' },
]

export const SUBAGENT_PERFORMANCE_DATA = [
  {
    agentName: 'Skyline Demo Travels (HQ)',
    role: 'Parent Agent',
    location: 'Dhaka Main Office',
    bookingsCount: 4,
    grossSales: 'BDT 67,700',
    commissionEarned: 'BDT 5,200',
    sharePercent: 33.3,
    status: 'Active',
  },
  {
    agentName: 'Mirpur Desk Branch',
    role: 'Sub-agent Tier 1',
    location: 'Mirpur 10, Dhaka',
    bookingsCount: 5,
    grossSales: 'BDT 176,700',
    commissionEarned: 'BDT 15,400',
    sharePercent: 41.7,
    status: 'Active',
  },
  {
    agentName: 'Banani Desk Branch',
    role: 'Sub-agent Tier 1',
    location: 'Road 11, Banani',
    bookingsCount: 2,
    grossSales: 'BDT 70,700',
    commissionEarned: 'BDT 5,700',
    sharePercent: 16.7,
    status: 'Active',
  },
  {
    agentName: 'Uttara Desk Branch',
    role: 'Sub-agent Tier 1',
    location: 'Sector 3, Uttara',
    bookingsCount: 1,
    grossSales: 'BDT 3,600',
    commissionEarned: 'BDT 400',
    sharePercent: 8.3,
    status: 'Active',
  },
]

export const initialSubAgentBreakdown: SubAgentSalesBreakdown[] = [
  {
    agentName: 'Skyline Demo Travels (HQ)',
    role: 'Parent Agent',
    location: 'Dhaka Main Office',
    bookingsCount: 4,
    grossSales: 67700,
    commissionEarned: 5200,
    sharePercent: 33.3,
    status: 'Active',
  },
  {
    agentName: 'Mirpur Desk Branch',
    role: 'Sub-agent Tier 1',
    location: 'Mirpur 10, Dhaka',
    bookingsCount: 5,
    grossSales: 176700,
    commissionEarned: 15400,
    sharePercent: 41.7,
    status: 'Active',
  },
  {
    agentName: 'Banani Desk Branch',
    role: 'Sub-agent Tier 1',
    location: 'Road 11, Banani',
    bookingsCount: 2,
    grossSales: 70700,
    commissionEarned: 5700,
    sharePercent: 16.7,
    status: 'Active',
  },
  {
    agentName: 'Uttara Desk Branch',
    role: 'Sub-agent Tier 1',
    location: 'Sector 3, Uttara',
    bookingsCount: 1,
    grossSales: 3600,
    commissionEarned: 400,
    sharePercent: 8.3,
    status: 'Active',
  },
]

export const initialSalesTransactions: SalesTransactionRow[] = [
  {
    invoiceNumber: 'INV-2026-1001',
    bookingReference: 'AW-DEMO-PK-003',
    dateTime: '05 Oct 2026, 14:30',
    service: 'Travel Package',
    customerName: 'Nadia Islam',
    paxCount: 2,
    createdBy: 'Mirpur Desk',
    paymentMethod: 'Credit Line',
    grossAmount: 85000,
    agentMarkup: 9000,
    netPayable: 76000,
    status: 'Confirmed',
  },
  {
    invoiceNumber: 'INV-2026-1002',
    bookingReference: 'AW-DEMO-CR-005',
    dateTime: '12 Oct 2026, 09:15',
    service: 'Car Rental',
    customerName: 'Farhana Noor',
    paxCount: 2,
    createdBy: 'Mirpur Desk',
    paymentMethod: 'Wallet',
    grossAmount: 8000,
    agentMarkup: 800,
    netPayable: 7200,
    status: 'Confirmed',
  },
  {
    invoiceNumber: 'INV-2026-1003',
    bookingReference: 'AW-DEMO-BT-009',
    dateTime: '14 Oct 2026, 16:45',
    service: 'Bus / Train',
    customerName: 'Maliha Khan',
    paxCount: 1,
    createdBy: 'Skyline Demo Travels Ltd',
    paymentMethod: 'Wallet',
    grossAmount: 2400,
    agentMarkup: 200,
    netPayable: 2200,
    status: 'Confirmed',
  },
]

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

export interface WalletCreditReportSummary {
  availableBalance: number
  availableBalanceFormatted: string
  totalCredits: number
  totalCreditsFormatted: string
  creditsCount: number
  totalDebits: number
  totalDebitsFormatted: string
  debitsCount: number
  netFlow: number
  netFlowFormatted: string
  creditLimit: number
  creditLimitFormatted: string
  creditUsed: number
  creditUsedFormatted: string
  creditAvailable: number
  creditAvailableFormatted: string
  creditUtilizationPercent: number
  outstandingSettlement: number
  outstandingSettlementFormatted: string
  settlementDueDate: string
  settlementStatus: string
}

export const WALLET_CREDIT_REPORT_SUMMARY: WalletCreditReportSummary = {
  availableBalance: 14250.0,
  availableBalanceFormatted: '$14,250.00',
  totalCredits: 18500.0,
  totalCreditsFormatted: '+$18,500.00',
  creditsCount: 4,
  totalDebits: 4250.0,
  totalDebitsFormatted: '-$4,250.00',
  debitsCount: 6,
  netFlow: 14250.0,
  netFlowFormatted: '+$14,250.00',
  creditLimit: 50000.0,
  creditLimitFormatted: '$50,000.00',
  creditUsed: 18400.0,
  creditUsedFormatted: '$18,400.00',
  creditAvailable: 31600.0,
  creditAvailableFormatted: '$31,600.00',
  creditUtilizationPercent: 36.8,
  outstandingSettlement: 18400.0,
  outstandingSettlementFormatted: '$18,400.00',
  settlementDueDate: '30 Nov 2026',
  settlementStatus: 'Good Standing · Payment due in 6 days',
}

export const WALLET_REPORT_TRANSACTIONS: WalletReportTransaction[] = [
  {
    id: 'TX-WLT-2026-081',
    date: '15 Nov 2026',
    time: '14:35',
    dateTime: '15 Nov 2026 · 14:35',
    type: 'Top-up',
    description: 'Online Bank Deposit Top-up',
    subDescription: 'City Bank Gateway · Verified',
    reference: 'DEP-99412',
    direction: 'Credit',
    amount: 10000.0,
    amountFormatted: '+$10,000.00',
    runningBalance: 14250.0,
    runningBalanceFormatted: '$14,250.00',
    source: 'Online Banking Deposit',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-080',
    date: '14 Nov 2026',
    time: '11:22',
    dateTime: '14 Nov 2026 · 11:22',
    type: 'Booking Debit',
    description: 'Ticket Issuance: DAC-DXB Emirates EK-583',
    subDescription: 'Passenger: Tariqul Islam · 1 Pax',
    reference: 'AW-BK-9802',
    direction: 'Debit',
    amount: 1850.0,
    amountFormatted: '-$1,850.00',
    runningBalance: 4250.0,
    runningBalanceFormatted: '$4,250.00',
    source: 'Mirpur Desk Branch',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-079',
    date: '13 Nov 2026',
    time: '16:48',
    dateTime: '13 Nov 2026 · 16:48',
    type: 'Booking Debit',
    description: 'Hotel Booking: Grand Hyatt Dubai 3 Nights',
    subDescription: 'Guest: Ayesha Siddiqua · Deluxe Room',
    reference: 'AW-BK-9803',
    direction: 'Debit',
    amount: 1200.0,
    amountFormatted: '-$1,200.00',
    runningBalance: 6100.0,
    runningBalanceFormatted: '$6,100.00',
    source: 'Uttara Desk Branch',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-078',
    date: '11 Nov 2026',
    time: '10:15',
    dateTime: '11 Nov 2026 · 10:15',
    type: 'Commission Credit',
    description: 'Bi-Weekly Commission Automatic Settlement',
    subDescription: 'Oct 16 – Oct 31 Period Auto-Credit',
    reference: 'COM-SET-044',
    direction: 'Credit',
    amount: 1055.0,
    amountFormatted: '+$1,055.00',
    runningBalance: 7300.0,
    runningBalanceFormatted: '$7,300.00',
    source: 'AeroWing Commission Engine',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-077',
    date: '09 Nov 2026',
    time: '09:42',
    dateTime: '09 Nov 2026 · 09:42',
    type: 'Booking Debit',
    description: 'Hotel Booking: Radisson Blu Chittagong 2 Nights',
    subDescription: 'Guest: Kamal Hossain · Business Suite',
    reference: 'AW-BK-9806',
    direction: 'Debit',
    amount: 950.0,
    amountFormatted: '-$950.00',
    runningBalance: 6245.0,
    runningBalanceFormatted: '$6,245.00',
    source: 'Skyline Demo Travels (HQ)',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-076',
    date: '06 Nov 2026',
    time: '15:30',
    dateTime: '06 Nov 2026 · 15:30',
    type: 'Refund',
    description: 'Air Ticket Refund: DAC-BKK TG-322',
    subDescription: 'Full Refund Processed via Airline GDS',
    reference: 'AW-BK-9755',
    direction: 'Credit',
    amount: 2445.0,
    amountFormatted: '+$2,445.00',
    runningBalance: 7195.0,
    runningBalanceFormatted: '$7,195.00',
    source: 'GDS Refund Engine',
    status: 'Reconciled',
  },
  {
    id: 'TX-WLT-2026-075',
    date: '05 Nov 2026',
    time: '13:12',
    dateTime: '05 Nov 2026 · 13:12',
    type: 'Booking Debit',
    description: 'Domestic Flight: DAC-CXB Biman BG-433',
    subDescription: 'Passenger: Mahmudul Hasan · Economy',
    reference: 'AW-BK-9808',
    direction: 'Debit',
    amount: 250.0,
    amountFormatted: '-$250.00',
    runningBalance: 4750.0,
    runningBalanceFormatted: '$4,750.00',
    source: 'Uttara Desk Branch',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-074',
    date: '02 Nov 2026',
    time: '17:00',
    dateTime: '02 Nov 2026 · 17:00',
    type: 'Top-up',
    description: 'Bank Wire Transfer Deposit Confirmation',
    subDescription: 'Standard Chartered Bank · Slip #SCB-88301',
    reference: 'DEP-99104',
    direction: 'Credit',
    amount: 5000.0,
    amountFormatted: '+$5,000.00',
    runningBalance: 5000.0,
    runningBalanceFormatted: '$5,000.00',
    source: 'AeroWing Finance Admin',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-073',
    date: '01 Nov 2026',
    time: '10:08',
    dateTime: '01 Nov 2026 · 10:08',
    type: 'Booking Debit',
    description: 'Airport VIP Transfer: DAC Int Airport to Hotel',
    subDescription: 'Passenger: Sayed Anwar · Private Sedan',
    reference: 'AW-BK-9812',
    direction: 'Debit',
    amount: 250.0,
    amountFormatted: '-$250.00',
    runningBalance: 0.0,
    runningBalanceFormatted: '$0.00',
    source: 'Uttara Desk Branch',
    status: 'Completed',
  },
  {
    id: 'TX-WLT-2026-072',
    date: '31 Oct 2026',
    time: '18:20',
    dateTime: '31 Oct 2026 · 18:20',
    type: 'Manual Adjustment',
    description: 'Administrative Service Fee Correction',
    subDescription: 'Periodic billing reconciliation by Finance',
    reference: 'ADJ-2026-019',
    direction: 'Debit',
    amount: 150.0,
    amountFormatted: '-$150.00',
    runningBalance: 250.0,
    runningBalanceFormatted: '$250.00',
    source: 'Admin Audit Team',
    status: 'Completed',
  },
]

export const CREDIT_FACILITY_REQUESTS: CreditFacilityRequest[] = [
  {
    id: 'REQ-2026-004',
    date: '12 Nov 2026',
    time: '10:20',
    requestType: 'Credit-limit increase',
    typeDescription: 'Seasonal holiday peak booking headroom',
    requestedAmount: 10000.0,
    requestedAmountFormatted: '$10,000.00',
    status: 'Pending',
    reason:
      'Anticipated winter holiday flights surge across European & Middle East routes.',
    decision: 'Under Review',
    decisionDate: null,
    decisionNote:
      'Awaiting AeroWing Credit Committee assessment. Expected completion 18 Nov 2026.',
  },
  {
    id: 'REQ-2026-003',
    date: '28 Oct 2026',
    time: '15:05',
    requestType: 'Emergency Credit Top-up',
    typeDescription: 'Short-term credit window expansion',
    requestedAmount: 5000.0,
    requestedAmountFormatted: '$5,000.00',
    approvedAmount: 5000.0,
    approvedAmountFormatted: '$5,000.00',
    status: 'Approved',
    reason: 'Group corporate tour booking issuance over the weekend.',
    decision: 'Approved in Full',
    decisionDate: '30 Oct 2026',
    decisionNote:
      'Approved based on pristine 100% on-time settlement record and strong collateral rating.',
  },
  {
    id: 'REQ-2026-002',
    date: '15 Oct 2026',
    time: '09:30',
    requestType: 'Credit-limit increase',
    typeDescription: 'Baseline credit quota augmentation',
    requestedAmount: 20000.0,
    requestedAmountFormatted: '$20,000.00',
    status: 'Rejected',
    reason: 'General branch expansion planning.',
    decision: 'Request Declined',
    decisionDate: '17 Oct 2026',
    decisionNote:
      'Existing $50,000.00 facility retains >$31,000.00 in available headroom. Reapply upon 80% utilization.',
  },
  {
    id: 'REQ-2026-001',
    date: '24 Sep 2026',
    time: '13:45',
    requestType: 'Credit-limit increase',
    typeDescription: 'Quarterly credit revision',
    requestedAmount: 15000.0,
    requestedAmountFormatted: '$15,000.00',
    approvedAmount: 10000.0,
    approvedAmountFormatted: '$10,000.00',
    status: 'Adjusted',
    reason: 'Q3 booking volume growth across sub-agent network.',
    decision: 'Adjusted Limit Granted',
    decisionDate: '26 Sep 2026',
    decisionNote:
      'Approved at $10,000.00 increment bringing total agency credit limit to $50,000.00.',
  },
]

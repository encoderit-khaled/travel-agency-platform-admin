export type PermissionStatus = 'allowed' | 'view_only' | 'not_allowed'

export type PermissionPreset = 'standard' | 'limited' | 'custom'

export type MarkupOption = 'later' | 'now'

export type MarkupType = 'percentage' | 'fixed'

export interface PermissionItem {
  id: string
  label: string
  status: PermissionStatus
  description?: string
  category?: string
}

export type BookingServiceType =
  'Flight' | 'Hotel' | 'Travel Package' | 'Activity' | 'Car Rental'

export type BookingStatusType =
  'Ticketed' | 'Confirmed' | 'Pending' | 'Cancelled'

export type DocumentStatusType =
  | 'E-ticket available'
  | 'Voucher available'
  | 'Not available yet'
  | 'Not available'

export interface SubAgentBookingRecord {
  id: string
  ref: string
  customer: string
  customerEmail?: string
  customerPhone?: string
  service: BookingServiceType
  travelDate: string
  status: BookingStatusType
  documentStatus: DocumentStatusType
  documentType?: 'eticket' | 'voucher'
  amount?: string
  pnr?: string
  routeOrItem?: string
}

export interface SubAgentPerformanceMetrics {
  totalBookings: number
  confirmedTicketed: number
  pending: number
  cancelled: number
  serviceCoverage: string
  breakdown: {
    confirmed: number
    ticketed: number
    pending: number
    cancelled: number
  }
}

export interface SubAgentDetails {
  id: string
  displayName: string
  initials: string
  eyebrow: string
  role: string
  parentAgent: string
  parentAgentInitials: string
  contactPerson: string
  email: string
  mobile: string
  internalNote?: string
  isSampleData: boolean
  status: 'active' | 'suspended'
  permissionsPreset: string
  permissionsConfigured: boolean
  markupConfigured: boolean
  markupStatusText: string
  markupNote: string
  bookingsCount: number
  bookingsNote: string
  performanceNote: string
  settlementTerms: string
}

export interface CreateSubAgentFormData {
  displayName: string
  contactPerson: string
  mobileNumber: string
  internalNote: string
  loginEmail: string
  loginStatus: 'not_created' | 'pending' | 'active'
  permissionPreset: PermissionPreset
  customPermissions: Record<string, PermissionStatus>
  markupOption: MarkupOption
  markupType: MarkupType
  markupValue: string
  parentAgentName: string
  settlementTerms: string
}

export const DEFAULT_PERMISSIONS: PermissionItem[] = [
  {
    id: 'search_book',
    label: 'Search & Book',
    status: 'allowed',
    description: 'Search flights and issue bookings immediately',
  },
  {
    id: 'view_own_bookings',
    label: 'View Own Bookings',
    status: 'allowed',
    description: 'Access and review booking history created by this Sub-agent',
  },
  {
    id: 'customer_bookings',
    label: 'Customer Bookings',
    status: 'allowed',
    description: 'Manage passenger details and ticket reissuing requests',
  },
  {
    id: 'pricing_markup',
    label: 'Pricing / Markup View',
    status: 'view_only',
    description: 'View applied markup rules without ability to modify',
  },
  {
    id: 'wallet_summary',
    label: 'Wallet Summary',
    status: 'not_allowed',
    description: 'Parent Agent financial wallet is restricted from sub-agents',
  },
  {
    id: 'commission_summary',
    label: 'Commission Summary',
    status: 'not_allowed',
    description: 'Parent Agent commissions and incentives are confidential',
  },
]

export const INITIAL_SUB_AGENT_DATA: CreateSubAgentFormData = {
  displayName: 'Mirpur Desk',
  contactPerson: 'Demo Staff User',
  mobileNumber: '+880 1555 080910',
  internalNote:
    'Internal booking desk dedicated to walk-in clients in Mirpur branch.',
  loginEmail: 'mirpur.desk@example.com',
  loginStatus: 'not_created',
  permissionPreset: 'standard',
  customPermissions: {
    search_book: 'allowed',
    view_own_bookings: 'allowed',
    customer_bookings: 'allowed',
    pricing_markup: 'view_only',
    wallet_summary: 'not_allowed',
    commission_summary: 'not_allowed',
  },
  markupOption: 'later',
  markupType: 'percentage',
  markupValue: '3.5',
  parentAgentName: 'Skyline Demo Travels Ltd',
  settlementTerms: 'Parent Agent wallet and available credit',
}

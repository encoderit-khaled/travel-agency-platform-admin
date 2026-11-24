export type TravelServiceId =
  | 'flights'
  | 'hotels'
  | 'holidays'
  | 'visa'
  | 'umrah'
  | 'activities'
  | 'insurance'

export interface TravelService {
  id: TravelServiceId
  name: string
  label: string
  description?: string
  iconName: string
}

export type NotificationCategory =
  'all' | 'booking' | 'wallet' | 'commission' | 'system'

export interface AgentNotification {
  id: string
  title: string
  description: string
  category: 'booking' | 'wallet' | 'commission' | 'system'
  timestamp: string
  read: boolean
  link?: string
  priority?: 'normal' | 'high'
}

export interface AgentProfile {
  businessName: string
  tradingName: string
  ownerName: string
  role: string
  initials: string
  email: string
  phone: string
  avatarColor: string
  isDemo: boolean
}

export interface DashboardMetricSummary {
  walletBalance: string
  walletAvailable: boolean
  availableCredit: string
  creditAvailable: boolean
  commissions: {
    thisMonth: string
    pending: string
    totalEarned: string
  }
  bookings: {
    upcoming: string
    confirmed: string
    pending: string
  }
}

export interface ReportItem {
  id: string
  name: string
  type: string
  color: string
}

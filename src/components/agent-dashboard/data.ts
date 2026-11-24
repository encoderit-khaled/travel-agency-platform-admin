import type {
  AgentNotification,
  AgentProfile,
  DashboardMetricSummary,
  ReportItem,
  TravelService,
} from './types'

export const CURRENT_AGENT_PROFILE: AgentProfile = {
  businessName: 'Skyline Demo Travels Ltd',
  tradingName: 'Skyline Demo Travels',
  ownerName: 'Nusrat Jahan',
  role: 'Agent Owner',
  initials: 'SD',
  email: 'nusrat.jahan@example.com',
  phone: '+880 1712 000000',
  avatarColor: '#001A3D',
  isDemo: true,
}

export const TRAVEL_SERVICES: TravelService[] = [
  {
    id: 'flights',
    name: 'Flights',
    label: 'Flights',
    iconName: 'Plane',
  },
  {
    id: 'hotels',
    name: 'Hotels',
    label: 'Hotels',
    iconName: 'Building2',
  },
  {
    id: 'holidays',
    name: 'Holidays',
    label: 'Holidays',
    iconName: 'Palmtree',
  },
  {
    id: 'visa',
    name: 'Visa',
    label: 'Visa',
    iconName: 'FileCheck',
  },
  {
    id: 'umrah',
    name: 'Umrah',
    label: 'Umrah',
    iconName: 'Moon',
  },
  {
    id: 'activities',
    name: 'Activities',
    label: 'Activities',
    iconName: 'Compass',
  },
  {
    id: 'insurance',
    name: 'Travel Insurance',
    label: 'Travel Insurance',
    iconName: 'ShieldPlus',
  },
]

export const DASHBOARD_METRICS: DashboardMetricSummary = {
  walletBalance: '—',
  walletAvailable: false,
  availableCredit: '—',
  creditAvailable: false,
  commissions: {
    thisMonth: '—',
    pending: '—',
    totalEarned: '—',
  },
  bookings: {
    upcoming: '—',
    confirmed: '—',
    pending: '—',
  },
}

export const INITIAL_NOTIFICATIONS: AgentNotification[] = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed #AW-2026-904',
    description:
      'Dhaka (DAC) → Dubai (DXB) flight ticket issued for 2 passengers.',
    category: 'booking',
    timestamp: '12 min ago',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif-2',
    title: 'Wallet Credit Approved',
    description:
      '$5,000.00 top-up recorded for Skyline Demo Travels Ltd account.',
    category: 'wallet',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Commission Recorded',
    description: 'Commission of $142.50 recorded for B2B booking #AW-2026-880.',
    category: 'commission',
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Portal Account Verified',
    description:
      'Welcome to AeroWing Agent Portal. All agent features are now active.',
    category: 'system',
    timestamp: 'Yesterday',
    read: true,
  },
]

export const DASHBOARD_REPORTS: ReportItem[] = [
  { id: 'sales', name: 'Sales', type: 'Report', color: '#EDF7EE' },
  { id: 'bookings', name: 'Bookings', type: 'Report', color: '#F4F6FA' },
  { id: 'commissions', name: 'Commissions', type: 'Report', color: '#FEF7E6' },
  { id: 'wallet', name: 'Wallet / Credit', type: 'Report', color: '#EAF0F8' },
  {
    id: 'sub-agents',
    name: 'Sub-agent Performance',
    type: 'Report',
    color: '#F4F6FA',
  },
]

export const STATEMENT_ITEMS = [
  'Bookings',
  'Wallet transactions',
  'Credit usage',
  'Commissions',
  'Closing balance',
]

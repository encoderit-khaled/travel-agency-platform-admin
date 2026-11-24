export interface SubAgentBooking {
  id: string
  pnr: string
  route: string
  passenger: string
  date: string
  amount: string
  status: 'ticketed' | 'confirmed' | 'pending'
}

export interface SubAgentPermission {
  id: string
  name: string
  description: string
  enabled: boolean
  category: 'Booking & Ticketing' | 'Financial & Wallet' | 'Customer & Desk'
}

export interface SubAgentMarkupRule {
  service: string
  type: 'percentage' | 'fixed'
  value: number
  currency?: string
  description: string
}

export interface SubAgent {
  id: string
  name: string
  avatarInitials: string
  role: string
  email: string
  phone?: string
  permissionsConfigured: boolean
  permissions: SubAgentPermission[]
  markupConfigured: boolean
  markupRules: SubAgentMarkupRule[]
  bookingsCount: number
  bookings: SubAgentBooking[]
  status: 'active' | 'suspended'
  createdAt: string
  lastActive?: string
}

export type SubAgentFilterStatus =
  | 'all'
  | 'permissions_configured'
  | 'permissions_needed'
  | 'markup_configured'
  | 'markup_needed'

export type SubAgentFilterBooking = 'all' | 'has_bookings' | 'no_bookings'

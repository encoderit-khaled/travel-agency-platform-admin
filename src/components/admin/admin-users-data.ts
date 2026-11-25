export type AdminRole =
  'Super Admin' | 'Content' | 'Finance' | 'Operations' | 'Support'

export type AvatarColor = 'saffron' | 'endeavour'

export interface AdminUser {
  id: string
  name: string
  initials: string
  email: string
  role: AdminRole
  avatarBg: AvatarColor
  status: 'active' | 'suspended'
  joinedDate?: string
  lastActive?: string
}

export interface RoleDefinition {
  name: AdminRole
  description: string
  userCount: number
  badgeColor: string
  permissions: string[]
}

export const PREDEFINED_ROLES: RoleDefinition[] = [
  {
    name: 'Super Admin',
    description:
      'Full access to platform configuration, billing, security, and administrative controls.',
    userCount: 2,
    badgeColor: 'bg-[#012A5E] text-white',
    permissions: [
      'Manage all platform settings',
      'Manage admin users & permissions',
      'Approve & reject agent applications',
      'Manage wallet credits & payouts',
      'View & export all system audit logs',
    ],
  },
  {
    name: 'Operations',
    description:
      'Manage bookings, ticketing status, supplier connections, and operational workflows.',
    userCount: 4,
    badgeColor: 'bg-[#EAF4FD] text-[#012A5E]',
    permissions: [
      'View & manage all agent bookings',
      'Issue & reissue electronic tickets',
      'Monitor supplier gateway health',
      'Handle passenger itinerary amendments',
    ],
  },
  {
    name: 'Support',
    description:
      'Handle customer queries, agent tickets, cancellation requests, and basic inquiries.',
    userCount: 3,
    badgeColor: 'bg-[#EEF2F7] text-[#012A5E]',
    permissions: [
      'Access customer support tickets',
      'Initiate booking cancellation workflows',
      'View agent profile details',
      'Send communication to travel agents',
    ],
  },
  {
    name: 'Finance',
    description:
      'Access to wallet balances, top-ups, transaction logs, statements, and payouts.',
    userCount: 2,
    badgeColor: 'bg-[#FEF7E6] text-[#8C5D00]',
    permissions: [
      'Top-up & adjust agent wallet credits',
      'Review & reconcile payment transactions',
      'Generate monthly financial statements',
      'Set agency credit limits & markup defaults',
    ],
  },
  {
    name: 'Content',
    description:
      'Manage CMS content, destinations, blog posts, and site marketing materials.',
    userCount: 1,
    badgeColor: 'bg-[#F0FDF4] text-[#166534]',
    permissions: [
      'Publish & edit destination guides',
      'Manage promotional marketing banners',
      'Update platform static FAQ content',
    ],
  },
]

// The exact 12 users from Figma Design Node 975:3024
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-01',
    name: 'Demo Admin',
    initials: 'DA',
    email: 'demo.admin@example.com',
    role: 'Super Admin',
    avatarBg: 'saffron',
    status: 'active',
    joinedDate: 'Jan 15, 2026',
    lastActive: '5 mins ago',
  },
  {
    id: 'user-02',
    name: 'Demo Content User',
    initials: 'DC',
    email: 'content.user@example.com',
    role: 'Content',
    avatarBg: 'endeavour',
    status: 'active',
    joinedDate: 'Feb 02, 2026',
    lastActive: '2 hours ago',
  },
  {
    id: 'user-03',
    name: 'Demo Finance User',
    initials: 'DF',
    email: 'finance.user@example.com',
    role: 'Finance',
    avatarBg: 'saffron',
    status: 'active',
    joinedDate: 'Jan 20, 2026',
    lastActive: '1 day ago',
  },
  {
    id: 'user-04',
    name: 'Demo Operations User',
    initials: 'DO',
    email: 'operations.user@example.com',
    role: 'Operations',
    avatarBg: 'endeavour',
    status: 'active',
    joinedDate: 'Jan 18, 2026',
    lastActive: 'Just now',
  },
  {
    id: 'user-05',
    name: 'Demo Support User',
    initials: 'DS',
    email: 'support.user@example.com',
    role: 'Support',
    avatarBg: 'saffron',
    status: 'active',
    joinedDate: 'Feb 10, 2026',
    lastActive: '30 mins ago',
  },
  {
    id: 'user-06',
    name: 'Finance User B',
    initials: 'FB',
    email: 'finance.user.b@example.com',
    role: 'Finance',
    avatarBg: 'endeavour',
    status: 'active',
    joinedDate: 'Mar 01, 2026',
    lastActive: '3 days ago',
  },
  {
    id: 'user-07',
    name: 'Operations User B',
    initials: 'OB',
    email: 'operations.user.b@example.com',
    role: 'Operations',
    avatarBg: 'saffron',
    status: 'active',
    joinedDate: 'Feb 22, 2026',
    lastActive: '1 hour ago',
  },
  {
    id: 'user-08',
    name: 'Operations User C',
    initials: 'OC',
    email: 'operations.user.c@example.com',
    role: 'Operations',
    avatarBg: 'endeavour',
    status: 'active',
    joinedDate: 'Feb 25, 2026',
    lastActive: '4 hours ago',
  },
  {
    id: 'user-09',
    name: 'Operations User D',
    initials: 'OD',
    email: 'operations.user.d@example.com',
    role: 'Operations',
    avatarBg: 'saffron',
    status: 'active',
    joinedDate: 'Mar 05, 2026',
    lastActive: 'Yesterday',
  },
  {
    id: 'user-10',
    name: 'Sample Admin',
    initials: 'SA',
    email: 'sample.admin@example.com',
    role: 'Super Admin',
    avatarBg: 'endeavour',
    status: 'active',
    joinedDate: 'Jan 05, 2026',
    lastActive: '12 mins ago',
  },
  {
    id: 'user-11',
    name: 'Support User B',
    initials: 'SB',
    email: 'support.user.b@example.com',
    role: 'Support',
    avatarBg: 'saffron',
    status: 'active',
    joinedDate: 'Mar 10, 2026',
    lastActive: '2 days ago',
  },
  {
    id: 'user-12',
    name: 'Support User C',
    initials: 'SC',
    email: 'support.user.c@example.com',
    role: 'Support',
    avatarBg: 'endeavour',
    status: 'active',
    joinedDate: 'Mar 14, 2026',
    lastActive: '6 hours ago',
  },
]

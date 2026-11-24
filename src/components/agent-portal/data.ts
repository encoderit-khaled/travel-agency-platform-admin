import type { SubAgent, SubAgentPermission } from './types'

export const DEFAULT_PERMISSIONS_TEMPLATE: SubAgentPermission[] = [
  {
    id: 'perm-search-flights',
    name: 'Search & Hold Flights',
    description:
      'Allows searching airfares, checking seat availability and creating flight holds (PNRs).',
    enabled: true,
    category: 'Booking & Ticketing',
  },
  {
    id: 'perm-issue-tickets',
    name: 'Issue Air Tickets',
    description:
      'Issue e-tickets immediately against agency wallet balance and credit lines.',
    enabled: true,
    category: 'Booking & Ticketing',
  },
  {
    id: 'perm-void-reissue',
    name: 'Reissue & Cancellation',
    description:
      'Submit ticket changes, date changes, voids within 24 hours, and refund requests.',
    enabled: false,
    category: 'Booking & Ticketing',
  },
  {
    id: 'perm-view-wallet',
    name: 'View Wallet Balance',
    description:
      'Displays current parent agency wallet balance and available credit line on dashboard.',
    enabled: false,
    category: 'Financial & Wallet',
  },
  {
    id: 'perm-set-markup',
    name: 'Manage Sub-agent Markup',
    description:
      'Allows staff at this desk to adjust end-client markup within defined agency limits.',
    enabled: true,
    category: 'Financial & Wallet',
  },
  {
    id: 'perm-manage-customers',
    name: 'Customer Profiles & History',
    description:
      'Create and view customer profiles, frequent flyer numbers and passport details.',
    enabled: true,
    category: 'Customer & Desk',
  },
]

export const INITIAL_SUB_AGENTS: SubAgent[] = [
  {
    id: 'sa-banani-01',
    name: 'Banani Desk',
    avatarInitials: 'BD',
    role: 'Sub-agent / Staff',
    email: 'banani.desk@example.com',
    phone: '+880 1555 040506',
    permissionsConfigured: true,
    permissions: DEFAULT_PERMISSIONS_TEMPLATE.map((p) => ({
      ...p,
      enabled: p.id !== 'perm-void-reissue',
    })),
    markupConfigured: true,
    markupRules: [
      {
        service: 'International Air Tickets',
        type: 'percentage',
        value: 2.5,
        description:
          'Standard 2.5% markup added on top of B2B net airline fare.',
      },
      {
        service: 'Domestic Flights',
        type: 'fixed',
        value: 300,
        currency: 'BDT',
        description: 'Fixed BDT 300 markup per domestic flight segment.',
      },
      {
        service: 'Hotel Bookings & Stays',
        type: 'percentage',
        value: 4.0,
        description: '4.0% margin applied on worldwide B2B hotel inventory.',
      },
    ],
    bookingsCount: 2,
    bookings: [
      {
        id: 'bk-1001',
        pnr: 'AW-89241',
        route: 'DAC → DXB (Dubai)',
        passenger: 'Dr. Rafiqul Islam + 1',
        date: '2026-11-20',
        amount: 'BDT 142,500',
        status: 'ticketed',
      },
      {
        id: 'bk-1002',
        pnr: 'AW-89410',
        route: 'DAC → BKK (Bangkok)',
        passenger: 'Shamima Akter',
        date: '2026-11-22',
        amount: 'BDT 48,200',
        status: 'ticketed',
      },
    ],
    status: 'active',
    createdAt: '2026-10-14',
    lastActive: 'Today at 11:45 AM',
  },
  {
    id: 'sa-uttara-02',
    name: 'Uttara Desk',
    avatarInitials: 'UD',
    role: 'Sub-agent / Staff',
    email: 'uttara.desk@example.com',
    permissionsConfigured: true,
    permissions: DEFAULT_PERMISSIONS_TEMPLATE.map((p) => ({
      ...p,
      enabled: [
        'perm-search-flights',
        'perm-issue-tickets',
        'perm-manage-customers',
      ].includes(p.id),
    })),
    markupConfigured: false,
    markupRules: [],
    bookingsCount: 1,
    bookings: [
      {
        id: 'bk-1003',
        pnr: 'AW-89755',
        route: 'DAC → SIN (Singapore)',
        passenger: 'Tariq Mahbub',
        date: '2026-11-23',
        amount: 'BDT 64,800',
        status: 'confirmed',
      },
    ],
    status: 'active',
    createdAt: '2026-10-28',
    lastActive: 'Yesterday',
  },
  {
    id: 'sa-gulshan-03',
    name: 'Gulshan Desk',
    avatarInitials: 'GD',
    role: 'Sub-agent / Staff',
    email: 'gulshan.desk@example.com',
    phone: '+880 1555 070809',
    permissionsConfigured: false,
    permissions: DEFAULT_PERMISSIONS_TEMPLATE.map((p) => ({
      ...p,
      enabled: false,
    })),
    markupConfigured: true,
    markupRules: [
      {
        service: 'All Air Tickets',
        type: 'percentage',
        value: 3.0,
        description: '3% default markup on global airline tickets.',
      },
    ],
    bookingsCount: 0,
    bookings: [],
    status: 'active',
    createdAt: '2026-11-05',
    lastActive: '3 days ago',
  },
  {
    id: 'sa-dhanmondi-04',
    name: 'Dhanmondi Desk',
    avatarInitials: 'DD',
    role: 'Sub-agent / Staff',
    email: 'dhanmondi.desk@example.com',
    permissionsConfigured: false,
    permissions: DEFAULT_PERMISSIONS_TEMPLATE.map((p) => ({
      ...p,
      enabled: false,
    })),
    markupConfigured: false,
    markupRules: [],
    bookingsCount: 0,
    bookings: [],
    status: 'active',
    createdAt: '2026-11-18',
    lastActive: 'Never logged in',
  },
  {
    id: 'sa-mirpur-05',
    name: 'Mirpur Desk',
    avatarInitials: 'MD',
    role: 'Sub-agent / Staff',
    email: 'mirpur.desk@example.com',
    phone: '+880 1555 010203',
    permissionsConfigured: true,
    permissions: DEFAULT_PERMISSIONS_TEMPLATE.map((p) => ({
      ...p,
      enabled: p.id !== 'perm-void-reissue',
    })),
    markupConfigured: true,
    markupRules: [
      {
        service: 'International Air Tickets',
        type: 'percentage',
        value: 2.5,
        description:
          'Standard 2.5% markup added on top of B2B net airline fare.',
      },
    ],
    bookingsCount: 0,
    bookings: [],
    status: 'active',
    createdAt: '2026-11-20',
    lastActive: 'Today at 09:15 AM',
  },
]

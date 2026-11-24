import type {
  RoleKpiItem,
  TeamAccessHolder,
  PermissionMatrixItem,
  OwnerModuleAccessItem,
} from './roles-access-types'

export const ROLES_ACCESS_KPIS: RoleKpiItem[] = [
  {
    id: 'agent-roles',
    title: 'Agent-side Roles',
    value: '2 predefined roles',
    description: 'Agent Owner · Sub-agent / staff',
    iconType: 'roles',
  },
  {
    id: 'agent-owner',
    title: 'Agent Owner',
    value: '1',
    description: 'Nusrat Jahan',
    iconType: 'owner',
  },
  {
    id: 'sub-agent-staff',
    title: 'Sub-agent / staff',
    value: '5 sample access holders',
    description: 'Approved Sub-agents',
    iconType: 'sub-agents',
  },
  {
    id: 'need-configuration',
    title: 'Need Permission Configuration',
    value: '2',
    description: 'Gulshan Desk, Dhanmondi Desk',
    iconType: 'attention',
  },
]

export const TEAM_ACCESS_HOLDERS: TeamAccessHolder[] = [
  {
    id: 'nusrat-jahan',
    initials: 'NJ',
    name: 'Nusrat Jahan',
    role: 'Agent Owner',
    status: 'full-access',
    statusLabel: 'Full Unrestricted Access',
    preset: 'unrestricted',
    permissionsCount: 11,
    email: 'nusrat@skylinetravels.com',
  },
  {
    id: 'mirpur-desk',
    initials: 'MD',
    name: 'Mirpur Desk',
    role: 'Sub-agent / staff',
    status: 'configured',
    statusLabel: 'Configured',
    preset: 'custom',
    permissionsCount: 4,
    email: 'mirpur.desk@skylinetravels.com',
  },
  {
    id: 'banani-desk',
    initials: 'BD',
    name: 'Banani Desk',
    role: 'Sub-agent / staff',
    status: 'configured',
    statusLabel: 'Configured',
    preset: 'standard',
    permissionsCount: 3,
    email: 'banani.desk@skylinetravels.com',
  },
  {
    id: 'uttara-desk',
    initials: 'UD',
    name: 'Uttara Desk',
    role: 'Sub-agent / staff',
    status: 'configured',
    statusLabel: 'Configured',
    preset: 'standard',
    permissionsCount: 3,
    email: 'uttara.desk@skylinetravels.com',
  },
  {
    id: 'gulshan-desk',
    initials: 'GD',
    name: 'Gulshan Desk',
    role: 'Sub-agent / staff',
    status: 'needs-configuration',
    statusLabel: 'Needs configuration',
    preset: 'standard',
    permissionsCount: 0,
    email: 'gulshan.desk@skylinetravels.com',
  },
  {
    id: 'dhanmondi-desk',
    initials: 'DD',
    name: 'Dhanmondi Desk',
    role: 'Sub-agent / staff',
    status: 'needs-configuration',
    statusLabel: 'Needs configuration',
    preset: 'standard',
    permissionsCount: 0,
    email: 'dhanmondi.desk@skylinetravels.com',
  },
]

export const PERMISSION_MATRIX_DATA: PermissionMatrixItem[] = [
  {
    id: 'search-book',
    name: 'Search & Book Flights',
    category: 'Bookings & Flights',
    description:
      'Search live airline flights, check seat availability, and create bookings.',
    ownerAccess: 'allowed',
    subAgentStandard: 'allowed',
    subAgentLimited: 'allowed',
    subAgentCustom: 'allowed',
  },
  {
    id: 'view-own-bookings',
    name: 'View Own Bookings',
    category: 'Bookings & Flights',
    description:
      'Access booking records created directly by this sub-agent desk.',
    ownerAccess: 'allowed',
    subAgentStandard: 'allowed',
    subAgentLimited: 'allowed',
    subAgentCustom: 'allowed',
  },
  {
    id: 'view-all-bookings',
    name: 'View All Agency Bookings',
    category: 'Bookings & Flights',
    description:
      'Supervisory view over all bookings placed by any desk under this agency.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'view_only',
  },
  {
    id: 'customer-records',
    name: 'Customer & Passenger Profiles',
    category: 'Bookings & Flights',
    description:
      'Create, edit, and maintain passenger passport and loyalty records.',
    ownerAccess: 'allowed',
    subAgentStandard: 'allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'allowed',
  },
  {
    id: 'pricing-markup-view',
    name: 'Pricing & Base Fare View',
    category: 'Pricing & Markup',
    description:
      'View the net fare breakdown, airline taxes, and applied agency markup.',
    ownerAccess: 'allowed',
    subAgentStandard: 'view_only',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'view_only',
  },
  {
    id: 'pricing-markup-manage',
    name: 'Manage Markup Rules',
    category: 'Pricing & Markup',
    description:
      'Create, modify, activate, or disable global and per-desk markup tiers.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'not_allowed',
  },
  {
    id: 'wallet-summary',
    name: 'Wallet Summary & Balance',
    category: 'Finance & Wallet',
    description:
      'Check current deposit balance, cash credit limits, and drawdown balance.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'view_only',
  },
  {
    id: 'wallet-top-up',
    name: 'Top-up Wallet & Payment Gateway',
    category: 'Finance & Wallet',
    description:
      'Initiate online payment gateway top-ups and upload bank deposit receipts.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'not_allowed',
  },
  {
    id: 'credit-requests',
    name: 'Credit Facility Requests',
    category: 'Finance & Wallet',
    description:
      'Submit formal credit enhancement requests with bank collateral guarantees.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'not_allowed',
  },
  {
    id: 'commissions-summary',
    name: 'Commission & Earnings Breakdown',
    category: 'Finance & Wallet',
    description:
      'Review earnings by airline, commission payout slabs, and monthly ledger.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'view_only',
  },
  {
    id: 'statements-export',
    name: 'Generate Account Statements',
    category: 'Reporting & Analytics',
    description:
      'Generate audited financial statements and export in CSV and PDF formats.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'not_allowed',
  },
  {
    id: 'sub-agent-management',
    name: 'Manage Sub-agents & Desks',
    category: 'Administration & Security',
    description:
      'Add new branch desks, suspend users, assign credentials, and configure permissions.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'not_allowed',
  },
  {
    id: 'roles-access-admin',
    name: 'Roles & Access Matrix Governance',
    category: 'Administration & Security',
    description:
      'Review access logs, assign user privileges, and govern API access policy.',
    ownerAccess: 'allowed',
    subAgentStandard: 'not_allowed',
    subAgentLimited: 'not_allowed',
    subAgentCustom: 'not_allowed',
  },
]

export const OWNER_MODULE_ACCESS_ITEMS: OwnerModuleAccessItem[] = [
  {
    id: 'search-book',
    name: 'Search & Book Flights',
    category: 'Core Operations',
    description:
      'Search live flights, view real-time inventory, hold seats, and issue e-tickets instantly.',
    accessLevel: 'Full Access',
    features: [
      'Instant Ticketing',
      'Seat & Meal Selection',
      'Void & Cancellation Window',
      'Fare Rules Inspection',
    ],
  },
  {
    id: 'bookings',
    name: 'Bookings & Ticket Management',
    category: 'Core Operations',
    description:
      'Unrestricted oversight across all agency and branch bookings with reissue and refund capabilities.',
    accessLevel: 'Full Access',
    features: [
      'All Desks Bookings View',
      'Ticket Reissue & Exchange',
      'Cancellation & Refund Claims',
      'ETicket PDF Generation',
    ],
  },
  {
    id: 'customers',
    name: 'Customers & Passenger Database',
    category: 'Core Operations',
    description:
      'Full database access to all frequent travelers, passport validations, and corporate profiles.',
    accessLevel: 'Full Access',
    features: [
      'Passenger Directory',
      'Passport Expiry Tracking',
      'Corporate Billing Profiles',
      'Data Export',
    ],
  },
  {
    id: 'sub-agents',
    name: 'Sub-agent & Team Administration',
    category: 'Agency Governance',
    description:
      'Complete lifecycle management of sub-agent branch desks, activation, and permission governance.',
    accessLevel: 'Full Access',
    features: [
      'Create & Invite Desks',
      'Role Assignment',
      'Custom Permission Presets',
      'Desk Performance Auditing',
    ],
  },
  {
    id: 'pricing-markup',
    name: 'Pricing & Dynamic Markup Engine',
    category: 'Commercial Management',
    description:
      'Define markup strategies by route, airline, cabin class, or individual sub-agent account.',
    accessLevel: 'Full Access',
    features: [
      'Global Base Markup Rules',
      'Sub-agent Custom Markups',
      'Flat & Percentage Tiers',
      'Live Price Simulator',
    ],
  },
  {
    id: 'wallet',
    name: 'Deposit Wallet & Ledger',
    category: 'Financial Control',
    description:
      'Total financial authority over agency funds, ledger entries, bank deposits, and payment methods.',
    accessLevel: 'Full Access',
    features: [
      'Balance & Available Funds',
      'Instant Top-Up Gateways',
      'Bank Deposit Slip Verification',
      'Full Transaction Audit Trail',
    ],
  },
  {
    id: 'credit',
    name: 'Credit Facilities & Drawdown',
    category: 'Financial Control',
    description:
      'Negotiate and apply for revolving credit facilities, track due dates, and manage repayments.',
    accessLevel: 'Full Access',
    features: [
      'Credit Limit Dashboard',
      'Submit Limit Top-up Requests',
      'Outstanding Utilization Monitor',
      'Repayment Schedule Tracking',
    ],
  },
  {
    id: 'commissions',
    name: 'Commissions & Earnings Payouts',
    category: 'Commercial Management',
    description:
      'Track net earnings from gross airline sales, override commissions, and sub-agent share splits.',
    accessLevel: 'Full Access',
    features: [
      'Consolidated Earnings Overview',
      'Airline-wise Incentive Slabs',
      'Sub-agent Margin Deductions',
      'Monthly Payout Reconciliations',
    ],
  },
  {
    id: 'statements',
    name: 'Official Financial Statements',
    category: 'Audit & Compliance',
    description:
      'Generate legally binding monthly account statements with full breakdown in CSV and PDF.',
    accessLevel: 'Full Access',
    features: [
      'Custom Date-Range Statements',
      'One-Click CSV Export',
      'Official PDF Export with QR Code',
      'Reconciliation Reports',
    ],
  },
  {
    id: 'reports',
    name: 'Business Analytics & Reports',
    category: 'Audit & Compliance',
    description:
      'Deep analytical insight into booking volumes, popular routes, agent revenue, and flight margins.',
    accessLevel: 'Full Access',
    features: [
      'Sales Trends & KPI Charts',
      'Top Airlines Performance',
      'Sub-agent Volume Rankings',
      'Custom Data Dumps',
    ],
  },
  {
    id: 'roles-access',
    name: 'Roles & Security Governance',
    category: 'Agency Governance',
    description:
      'Manage agency authentication policies, staff privileges, and API security token verification.',
    accessLevel: 'Full Access',
    features: [
      'Role-Based Access Overview',
      'Team Access Permissions',
      'Granular Permission Matrix',
      'Audit Trail Monitoring',
    ],
  },
]

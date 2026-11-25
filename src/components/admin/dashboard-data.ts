export interface DashboardKpiItem {
  id: string
  label: string
  value: string
  subValue?: string
  icon: 'users' | 'bookings' | 'admin-users' | 'audit'
  iconBgColor: string
  iconColor: string
  accentColor: string
  tag: string
}

export interface BookingStatusItem {
  id: string
  label: string
  count: number
  percentage: number
  badgeBg: string
  badgeBorder: string
  badgeText: string
  barColor: string
}

export interface QuickAccessItem {
  id: string
  title: string
  description: string
  icon: 'customers' | 'users' | 'roles' | 'audit'
  href: string
}

export interface AdminActivityItem {
  id: string
  title: string
  user: string
  timestamp: string
  type:
    | 'permission'
    | 'account-update'
    | 'profile-view'
    | 'account-create'
    | 'profile-update'
}

export interface AdminRoleItem {
  id: string
  role: string
  count: number
  dotColor: string
}

export const DASHBOARD_KPIS: DashboardKpiItem[] = [
  {
    id: 'kpi-customers',
    label: 'B2C Customers',
    value: '1,248',
    icon: 'users',
    iconBgColor: 'bg-[#012A5E]',
    iconColor: 'text-white',
    accentColor: '#012A5E',
    tag: 'Sample data',
  },
  {
    id: 'kpi-bookings',
    label: 'Bookings',
    value: '3,560',
    icon: 'bookings',
    iconBgColor: 'bg-[#FEF3C7]',
    iconColor: 'text-[#92400E]',
    accentColor: '#F59E0B',
    tag: 'Sample data',
  },
  {
    id: 'kpi-admin-users',
    label: 'Admin Users',
    value: '12',
    icon: 'admin-users',
    iconBgColor: 'bg-[#DCFCE7]',
    iconColor: 'text-[#166534]',
    accentColor: '#10B981',
    tag: 'Sample data',
  },
  {
    id: 'kpi-audit',
    label: 'Audit Activity',
    value: '486',
    subValue: 'events',
    icon: 'audit',
    iconBgColor: 'bg-[#EEF2F7]',
    iconColor: 'text-[#0267B8]',
    accentColor: '#0267B8',
    tag: 'Sample data',
  },
]

export const TOTAL_BOOKINGS = 3560

export const BOOKING_STATUSES: BookingStatusItem[] = [
  {
    id: 'status-pending',
    label: 'Pending',
    count: 214,
    percentage: 6.0,
    badgeBg: 'bg-[#FEF3C7]',
    badgeBorder: 'border-[#FDE68A]',
    badgeText: 'text-[#92400E]',
    barColor: 'bg-[#F59E0B]',
  },
  {
    id: 'status-confirmed',
    label: 'Confirmed',
    count: 1036,
    percentage: 29.1,
    badgeBg: 'bg-[#DCFCE7]',
    badgeBorder: 'border-[#86EFAC]',
    badgeText: 'text-[#166534]',
    barColor: 'bg-[#10B981]',
  },
  {
    id: 'status-ticketed',
    label: 'Ticketed',
    count: 842,
    percentage: 23.7,
    badgeBg: 'bg-[#E0F2FE]',
    badgeBorder: 'border-[#BAE6FD]',
    badgeText: 'text-[#0369A1]',
    barColor: 'bg-[#0284C7]',
  },
  {
    id: 'status-issued',
    label: 'Issued',
    count: 958,
    percentage: 26.9,
    badgeBg: 'bg-[#EEF2FF]',
    badgeBorder: 'border-[#C7D2FE]',
    badgeText: 'text-[#3730A3]',
    barColor: 'bg-[#4F46E5]',
  },
  {
    id: 'status-cancelled',
    label: 'Cancelled',
    count: 236,
    percentage: 6.6,
    badgeBg: 'bg-[#F1F5F9]',
    badgeBorder: 'border-[#CBD5E1]',
    badgeText: 'text-[#475569]',
    barColor: 'bg-[#64748B]',
  },
  {
    id: 'status-refunded',
    label: 'Refunded',
    count: 148,
    percentage: 4.2,
    badgeBg: 'bg-[#FAF5FF]',
    badgeBorder: 'border-[#E9D5FF]',
    badgeText: 'text-[#6B21A8]',
    barColor: 'bg-[#8B5CF6]',
  },
  {
    id: 'status-failed',
    label: 'Failed',
    count: 126,
    percentage: 3.5,
    badgeBg: 'bg-[#FEE2E2]',
    badgeBorder: 'border-[#FECACA]',
    badgeText: 'text-[#991B1B]',
    barColor: 'bg-[#EF4444]',
  },
]

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'qa-b2c-customers',
    title: 'Manage B2C Customers',
    description: 'View customer accounts and profiles',
    icon: 'customers',
    href: '/admin',
  },
  {
    id: 'qa-admin-users',
    title: 'Manage Admin Users',
    description: 'Manage staff and administrator logins',
    icon: 'users',
    href: '/admin',
  },
  {
    id: 'qa-roles-permissions',
    title: 'Roles & Permissions',
    description: 'Configure access control and permissions',
    icon: 'roles',
    href: '/roles-access',
  },
  {
    id: 'qa-audit-log',
    title: 'View Audit Log',
    description: 'Inspect system events and administration history',
    icon: 'audit',
    href: '/admin',
  },
]

export const RECENT_ADMIN_ACTIVITIES: AdminActivityItem[] = [
  {
    id: 'act-1',
    title: 'Role permissions updated',
    user: 'Sample Admin',
    timestamp: 'Today, 09:42',
    type: 'permission',
  },
  {
    id: 'act-2',
    title: 'Admin account updated',
    user: 'Sample Admin',
    timestamp: 'Today, 09:15',
    type: 'account-update',
  },
  {
    id: 'act-3',
    title: 'Customer profile viewed',
    user: 'Demo Admin',
    timestamp: 'Today, 08:57',
    type: 'profile-view',
  },
  {
    id: 'act-4',
    title: 'Admin account created',
    user: 'Sample Admin',
    timestamp: 'Yesterday, 17:20',
    type: 'account-create',
  },
  {
    id: 'act-5',
    title: 'Customer profile updated',
    user: 'Demo Admin',
    timestamp: 'Yesterday, 15:04',
    type: 'profile-update',
  },
]

export const ADMIN_USERS_BY_ROLE: AdminRoleItem[] = [
  {
    id: 'role-super-admin',
    role: 'Super Admin',
    count: 2,
    dotColor: 'bg-[#012A5E]',
  },
  {
    id: 'role-operations',
    role: 'Operations',
    count: 4,
    dotColor: 'bg-[#0267B8]',
  },
  {
    id: 'role-finance',
    role: 'Finance',
    count: 2,
    dotColor: 'bg-[#10B981]',
  },
  {
    id: 'role-support',
    role: 'Support',
    count: 3,
    dotColor: 'bg-[#F59E0B]',
  },
  {
    id: 'role-content',
    role: 'Content',
    count: 1,
    dotColor: 'bg-[#8B5CF6]',
  },
]

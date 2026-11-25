import type {
  AdminRole,
  PermissionAreaItem,
  RolePermissionMatrix,
} from './admin-roles-permissions-types'

export const ADMIN_ROLES: AdminRole[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Predefined Admin role',
    userCount: 2,
    userCountLabel: '2 users',
    tag: 'Sample data',
    iconName: 'shield',
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Predefined Admin role',
    userCount: 4,
    userCountLabel: '4 users',
    tag: 'Sample data',
    iconName: 'sliders',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Predefined Admin role',
    userCount: 2,
    userCountLabel: '2 users',
    tag: 'Sample data',
    iconName: 'wallet',
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Predefined Admin role',
    userCount: 3,
    userCountLabel: '3 users',
    tag: 'Sample data',
    iconName: 'headphones',
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Predefined Admin role',
    userCount: 1,
    userCountLabel: '1 user',
    tag: 'Sample data',
    iconName: 'file-text',
  },
]

export const CORE_ADMIN_AREAS: PermissionAreaItem[] = [
  { id: 'dashboard', name: 'Dashboard', section: 'Core Admin' },
  { id: 'b2c-customers', name: 'B2C Customers', section: 'Core Admin' },
  { id: 'admin-users', name: 'Admin Users', section: 'Core Admin' },
  { id: 'roles-permissions', name: 'Roles & Permissions', section: 'Core Admin' },
  { id: 'audit-log', name: 'Audit Log', section: 'Core Admin' },
]

export const PLATFORM_MODULE_AREAS: PermissionAreaItem[] = [
  { id: 'bookings', name: 'Bookings', section: 'Platform Modules' },
  { id: 'agents', name: 'Agents', section: 'Platform Modules' },
  { id: 'suppliers', name: 'Suppliers', section: 'Platform Modules' },
  { id: 'pricing-promotions', name: 'Pricing & Promotions', section: 'Platform Modules' },
  { id: 'reviews', name: 'Reviews', section: 'Platform Modules' },
  { id: 'notifications', name: 'Notifications', section: 'Platform Modules' },
  { id: 'crm-whatsapp', name: 'CRM / WhatsApp', section: 'Platform Modules' },
  { id: 'content', name: 'Content', section: 'Platform Modules' },
  { id: 'reports', name: 'Reports', section: 'Platform Modules' },
  { id: 'platform-settings', name: 'Platform Settings', section: 'Platform Modules' },
]

export const ALL_PERMISSION_AREAS: PermissionAreaItem[] = [
  ...CORE_ADMIN_AREAS,
  ...PLATFORM_MODULE_AREAS,
]

// Default matrix: In Figma #984:976, all cells start as "Not configured"
export const INITIAL_ROLE_PERMISSION_MATRIX: RolePermissionMatrix = {
  'super-admin': ALL_PERMISSION_AREAS.reduce(
    (acc, area) => {
      acc[area.id] = 'not-configured'
      return acc
    },
    {} as Record<string, 'not-configured' | 'visible' | 'hidden'>,
  ),
  operations: ALL_PERMISSION_AREAS.reduce(
    (acc, area) => {
      acc[area.id] = 'not-configured'
      return acc
    },
    {} as Record<string, 'not-configured' | 'visible' | 'hidden'>,
  ),
  finance: ALL_PERMISSION_AREAS.reduce(
    (acc, area) => {
      acc[area.id] = 'not-configured'
      return acc
    },
    {} as Record<string, 'not-configured' | 'visible' | 'hidden'>,
  ),
  support: ALL_PERMISSION_AREAS.reduce(
    (acc, area) => {
      acc[area.id] = 'not-configured'
      return acc
    },
    {} as Record<string, 'not-configured' | 'visible' | 'hidden'>,
  ),
  content: ALL_PERMISSION_AREAS.reduce(
    (acc, area) => {
      acc[area.id] = 'not-configured'
      return acc
    },
    {} as Record<string, 'not-configured' | 'visible' | 'hidden'>,
  ),
}

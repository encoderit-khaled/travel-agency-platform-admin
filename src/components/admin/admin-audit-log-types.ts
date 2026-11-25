export type AuditAreaFilter =
  | 'all'
  | 'Roles & Permissions'
  | 'Admin Users'
  | 'B2C Customers'

export type AuditAdminFilter = 'all' | 'Sample Admin' | 'Demo Admin'

export interface AuditLogItem {
  id: string
  date: string
  time: string
  adminInitials: string
  adminName: string
  adminAvatarBg: string
  adminAvatarColor: string
  action: string
  area: 'Roles & Permissions' | 'Admin Users' | 'B2C Customers' | string
  context: string
}

export interface AdminAuditLogPageProps {
  initialSearchQuery?: string
  initialArea?: string
  initialAdmin?: string
  className?: string
}

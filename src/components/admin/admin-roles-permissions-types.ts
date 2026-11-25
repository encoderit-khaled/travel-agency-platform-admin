export type AdminRoleId =
  | 'super-admin'
  | 'operations'
  | 'finance'
  | 'support'
  | 'content'

export type PermissionStatus = 'not-configured' | 'visible' | 'hidden'

export interface AdminRole {
  id: AdminRoleId
  name: string
  description: string
  userCount: number
  userCountLabel: string
  tag: string
  iconName: 'shield' | 'sliders' | 'wallet' | 'headphones' | 'file-text'
}

export interface PermissionAreaItem {
  id: string
  name: string
  section: 'Core Admin' | 'Platform Modules'
  description?: string
}

export type RolePermissionMatrix = Record<
  AdminRoleId,
  Record<string, PermissionStatus>
>

export interface AdminRolesPermissionsPageProps {
  initialRoleId?: AdminRoleId
  initialEditOpen?: boolean
  initialNodeId?: string
}

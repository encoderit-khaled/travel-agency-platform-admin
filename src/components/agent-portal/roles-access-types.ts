export type RoleAccessTab = 'overview' | 'team-access' | 'permission-matrix'

export interface RoleKpiItem {
  id: string
  title: string
  value: string
  description: string
  iconType: 'roles' | 'owner' | 'sub-agents' | 'attention'
}

export interface TeamAccessHolder {
  id: string
  initials: string
  name: string
  role: string
  status: 'configured' | 'needs-configuration' | 'full-access'
  statusLabel: string
  preset: 'standard' | 'limited' | 'custom' | 'unrestricted'
  permissionsCount?: number
  email?: string
}

export interface PermissionMatrixItem {
  id: string
  name: string
  category: string
  description: string
  ownerAccess: 'allowed' | 'view_only' | 'not_allowed'
  subAgentStandard: 'allowed' | 'view_only' | 'not_allowed'
  subAgentLimited: 'allowed' | 'view_only' | 'not_allowed'
  subAgentCustom: 'allowed' | 'view_only' | 'not_allowed'
}

export interface OwnerModuleAccessItem {
  id: string
  name: string
  category: string
  description: string
  accessLevel: 'Full Access'
  features: string[]
}

export interface RolesAccessSearchParams {
  'node-id'?: string
  nodeId?: string
  tab?: RoleAccessTab
  modal?: 'owner-access' | 'team-access'
}

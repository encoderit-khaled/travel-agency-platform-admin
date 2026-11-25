import { createFileRoute } from '@tanstack/react-router'
import { AdminRolesPermissionsPage } from '#/components/admin'
import type { AdminRoleId } from '#/components/admin'

interface AdminRolesPermissionsSearchParams {
  'node-id'?: string
  nodeId?: string
  role?: AdminRoleId
  edit?: boolean | string
  view?: string
}

export const Route = createFileRoute('/admin-roles-permissions')({
  validateSearch: (
    search: Record<string, unknown>,
  ): AdminRolesPermissionsSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const rawRole =
      search.role === 'super-admin' || search.role === 'super_admin'
        ? 'super-admin'
        : search.role === 'operations' ||
            search.role === 'finance' ||
            search.role === 'support' ||
            search.role === 'content'
          ? (search.role as AdminRoleId)
          : undefined

    const isEdit =
      rawNodeId === '984-1859' ||
      rawNodeId === '984:1859' ||
      search.view === 'edit' ||
      search.edit === true ||
      search.edit === 'true'

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      role: rawRole,
      edit: isEdit,
      view: isEdit ? 'edit' : undefined,
    }
  },
  component: AdminRolesPermissionsRoute,
})

function AdminRolesPermissionsRoute() {
  const search = Route.useSearch()
  const rawNodeId = search['node-id'] || search.nodeId

  return (
    <AdminRolesPermissionsPage
      initialRoleId={search.role || 'super-admin'}
      initialEditOpen={Boolean(search.edit)}
      initialNodeId={rawNodeId}
    />
  )
}


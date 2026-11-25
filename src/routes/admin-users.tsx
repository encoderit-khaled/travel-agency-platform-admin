import { createFileRoute } from '@tanstack/react-router'
import { AdminUsersPage } from '#/components/admin'

interface AdminUsersSearchParams {
  'node-id'?: string
  nodeId?: string
  q?: string
  role?: string
  action?: 'add' | 'manage' | 'roles'
  userId?: string
  empty?: boolean
}

export const Route = createFileRoute('/admin-users')({
  validateSearch: (search: Record<string, unknown>): AdminUsersSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const rawAction =
      search.action === 'add' ||
      search.action === 'manage' ||
      search.action === 'roles'
        ? search.action
        : undefined

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      q: typeof search.q === 'string' ? search.q : undefined,
      role: typeof search.role === 'string' ? search.role : undefined,
      action: rawAction,
      userId: typeof search.userId === 'string' ? search.userId : undefined,
      empty: search.empty === true || search.empty === 'true',
    }
  },
  component: AdminUsersRoute,
})

function AdminUsersRoute() {
  const search = Route.useSearch()

  return (
    <AdminUsersPage
      initialSearchQuery={search.q}
      initialRoleFilter={search.role || 'all'}
      initialEmpty={search.empty}
      initialAction={search.action}
      initialUserId={search.userId}
    />
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { AdminAuditLogPage } from '#/components/admin'

interface AdminAuditLogSearchParams {
  'node-id'?: string
  nodeId?: string
  q?: string
  area?: string
  admin?: string
}

export const Route = createFileRoute('/admin-audit-log')({
  validateSearch: (
    search: Record<string, unknown>,
  ): AdminAuditLogSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      q: typeof search.q === 'string' ? search.q : undefined,
      area: typeof search.area === 'string' ? search.area : undefined,
      admin: typeof search.admin === 'string' ? search.admin : undefined,
    }
  },
  component: AdminAuditLogRoute,
})

function AdminAuditLogRoute() {
  const search = Route.useSearch()

  return (
    <AdminAuditLogPage
      initialSearchQuery={search.q}
      initialArea={search.area || 'all'}
      initialAdmin={search.admin || 'all'}
    />
  )
}

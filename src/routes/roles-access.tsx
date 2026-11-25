import { createFileRoute } from '@tanstack/react-router'
import { RolesAccessPage } from '#/components/agent-portal/roles-access-page'
import { AdminRolesPermissionsPage } from '#/components/admin'

interface RolesAccessSearchParams {
  tab?: 'overview' | 'team' | 'matrix' | 'roles'
  modal?: 'owner' | 'team'
  'node-id'?: string
  nodeId?: string
  admin?: boolean | string
  role?: string
}

export const Route = createFileRoute('/roles-access')({
  validateSearch: (
    search: Record<string, unknown>,
  ): RolesAccessSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const rawTab =
      search.tab === 'team' ||
      rawNodeId === '835-2588' ||
      rawNodeId === '835:2588' ||
      rawNodeId === '835-2590' ||
      rawNodeId === '835:2590'
        ? 'team'
        : search.tab === 'matrix' ||
            rawNodeId === '835-2591' ||
            rawNodeId === '835:2591'
          ? 'matrix'
          : search.tab === 'roles'
            ? 'roles'
            : 'overview'

    const modal =
      search.modal === 'owner' ||
      rawNodeId === '835-2589' ||
      rawNodeId === '835:2589'
        ? 'owner'
        : search.modal === 'team' ||
            rawNodeId === '835-2590' ||
            rawNodeId === '835:2590'
          ? 'team'
          : undefined

    return {
      tab: rawTab,
      modal,
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      admin: search.admin === true || search.admin === 'true',
      role: typeof search.role === 'string' ? search.role : undefined,
    }
  },
  component: RolesAccessRoute,
})

function RolesAccessRoute() {
  const search = Route.useSearch()
  const rawNodeId = search['node-id'] || search.nodeId

  // If node-id is 984:1859 or 984:976 or admin roles requested, render AdminRolesPermissionsPage
  if (
    rawNodeId === '984-1859' ||
    rawNodeId === '984:1859' ||
    rawNodeId === '984-976' ||
    rawNodeId === '984:976' ||
    search.admin ||
    search.role
  ) {
    return (
      <AdminRolesPermissionsPage
        initialEditMode={rawNodeId === '984-1859' || rawNodeId === '984:1859'}
        initialNodeId={rawNodeId}
      />
    )
  }

  return (
    <RolesAccessPage
      initialTab={search.tab as any}
      initialModal={search.modal}
      initialNodeId={rawNodeId}
    />
  )
}

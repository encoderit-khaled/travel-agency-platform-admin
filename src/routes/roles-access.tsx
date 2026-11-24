import { createFileRoute } from '@tanstack/react-router'
import { RolesAccessPage } from '#/components/agent-portal/roles-access-page'

interface RolesAccessSearchParams {
  tab?: 'overview' | 'team' | 'matrix'
  modal?: 'owner' | 'team'
  'node-id'?: string
  nodeId?: string
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
    }
  },
  component: RolesAccessRoute,
})

function RolesAccessRoute() {
  const search = Route.useSearch()
  const rawNodeId = search['node-id'] || search.nodeId

  return (
    <RolesAccessPage
      initialTab={search.tab}
      initialModal={search.modal}
      initialNodeId={rawNodeId}
    />
  )
}

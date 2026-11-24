import { createFileRoute } from '@tanstack/react-router'
import { SubAgentPerformancePage } from '#/components/sub-agents'

interface SubAgentPerformanceSearchParams {
  desk?: string
  nodeId?: string
  'node-id'?: string
  booking?: string
}

export const Route = createFileRoute('/sub-agents/performance')({
  validateSearch: (
    search: Record<string, unknown>,
  ): SubAgentPerformanceSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    return {
      desk: typeof search.desk === 'string' ? search.desk : undefined,
      nodeId: rawNodeId,
      'node-id': rawNodeId,
      booking: typeof search.booking === 'string' ? search.booking : undefined,
    }
  },
  component: SubAgentPerformanceRoute,
})

function SubAgentPerformanceRoute() {
  const search = Route.useSearch()

  return (
    <SubAgentPerformancePage
      deskName={
        search.desk
          ? search.desk.includes('Mirpur')
            ? search.desk
            : `${search.desk} Desk`
          : 'Mirpur Desk'
      }
      initialBookingRef={search.booking}
    />
  )
}

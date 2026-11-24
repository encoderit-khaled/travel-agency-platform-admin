import { createFileRoute } from '@tanstack/react-router'
import { AgentBookingHistoryPage } from '#/components/agent-portal'

interface BookingsSearchParams {
  booking?: string
  'node-id'?: string
  nodeId?: string
  status?: string
  service?: string
}

export const Route = createFileRoute('/bookings')({
  validateSearch: (search: Record<string, unknown>): BookingsSearchParams => {
    return {
      booking:
        typeof search.booking === 'string'
          ? search.booking
          : search['node-id'] === '706-17471' || search.nodeId === '706:17471'
            ? 'AW-DEMO-FL-001'
            : undefined,
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : undefined,
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : undefined,
      status: typeof search.status === 'string' ? search.status : undefined,
      service: typeof search.service === 'string' ? search.service : undefined,
    }
  },
  component: BookingsRoute,
})

function BookingsRoute() {
  const search = Route.useSearch()
  return (
    <AgentBookingHistoryPage
      initialBookingRef={search.booking}
      initialNodeId={search['node-id'] || search.nodeId}
    />
  )
}

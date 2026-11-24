import { createFileRoute } from '@tanstack/react-router'
import { AgentBookingDetailsPage } from '#/components/agent-portal'

interface SubAgentBookingDetailsSearchParams {
  booking?: string
  'node-id'?: string
  nodeId?: string
}

export const Route = createFileRoute('/sub-agents/booking-details')({
  validateSearch: (
    search: Record<string, unknown>,
  ): SubAgentBookingDetailsSearchParams => {
    const rawBooking =
      typeof search.booking === 'string' ? search.booking : 'AW-DEMO-FL-001'

    return {
      booking: rawBooking,
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : '707-18493',
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : '707:18493',
    }
  },
  component: SubAgentBookingDetailsRoute,
})

function SubAgentBookingDetailsRoute() {
  const search = Route.useSearch()
  return (
    <AgentBookingDetailsPage
      initialBookingRef={search.booking || 'AW-DEMO-FL-001'}
    />
  )
}

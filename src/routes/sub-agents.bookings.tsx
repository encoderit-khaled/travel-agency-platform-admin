import { createFileRoute } from '@tanstack/react-router'
import {
  SubAgentBookingsPage,
  AgentBookingDetailsPage,
} from '#/components/sub-agents'

interface SubAgentBookingsSearchParams {
  booking?: string
  'node-id'?: string
  nodeId?: string
}

export const Route = createFileRoute('/sub-agents/bookings')({
  validateSearch: (
    search: Record<string, unknown>,
  ): SubAgentBookingsSearchParams => {
    const rawBooking =
      typeof search.booking === 'string'
        ? search.booking
        : search['node-id'] === '694-7691' ||
            search.nodeId === '694:7691' ||
            search['node-id'] === '694-7692' ||
            search.nodeId === '694:7692' ||
            search['node-id'] === '707-18493' ||
            search.nodeId === '707:18493'
          ? 'AW-DEMO-FL-001'
          : 'AW-DEMO-FL-001' // Default to AW-DEMO-FL-001 matching Figma #694:7691

    return {
      booking: rawBooking,
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : undefined,
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : undefined,
    }
  },
  component: SubAgentBookingsRoute,
})

function SubAgentBookingsRoute() {
  const search = Route.useSearch()

  if (search['node-id'] === '707-18493' || search.nodeId === '707:18493') {
    return (
      <AgentBookingDetailsPage
        initialBookingRef={search.booking || 'AW-DEMO-FL-001'}
      />
    )
  }

  return (
    <SubAgentBookingsPage
      initialBookingRef={search.booking || 'AW-DEMO-FL-001'}
      isStandalone={true}
    />
  )
}

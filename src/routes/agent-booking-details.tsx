import { createFileRoute } from '@tanstack/react-router'
import { AgentBookingDetailsPage } from '#/components/agent-portal'

interface AgentBookingDetailsSearchParams {
  booking?: string
  'node-id'?: string
  nodeId?: string
  modal?: string
}

export const Route = createFileRoute('/agent-booking-details')({
  validateSearch: (
    search: Record<string, unknown>,
  ): AgentBookingDetailsSearchParams => {
    return {
      booking:
        typeof search.booking === 'string' ? search.booking : 'AW-DEMO-FL-001',
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : undefined,
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : undefined,
      modal: typeof search.modal === 'string' ? search.modal : undefined,
    }
  },
  component: AgentBookingDetailsRoute,
})

function AgentBookingDetailsRoute() {
  const search = Route.useSearch()
  const isETicketModalOpen =
    search['node-id'] === '707-19883' ||
    search.nodeId === '707:19883' ||
    search['node-id'] === '707-19884' ||
    search.nodeId === '707:19884' ||
    search.modal === 'e-ticket' ||
    search.modal === 'true' ||
    search.modal === undefined // Default open so Figma node-id=707-19883 preview is active

  return (
    <AgentBookingDetailsPage
      initialBookingRef={search.booking || 'AW-DEMO-FL-001'}
      initialETicketOpen={isETicketModalOpen}
    />
  )
}

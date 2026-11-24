import { createFileRoute } from '@tanstack/react-router'
import { CommissionTrackingPage, AgentReportsPage } from '#/components/agent-portal'

interface CommissionSearchParams {
  'node-id'?: string
  nodeId?: string
  modal?: 'details'
  booking?: string
  bookingId?: string
  details?: boolean | string
}

export const Route = createFileRoute('/commissions')({
  validateSearch: (search: Record<string, unknown>): CommissionSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const modal = search.modal === 'details' ? search.modal : undefined

    const isDetails =
      search.details === true ||
      search.details === 'true' ||
      rawNodeId === '745-6678' ||
      rawNodeId === '745:6678' ||
      modal === 'details'

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      modal,
      booking: typeof search.booking === 'string' ? search.booking : undefined,
      bookingId:
        typeof search.bookingId === 'string' ? search.bookingId : undefined,
      details: isDetails,
    }
  },
  component: CommissionsRoute,
})

function CommissionsRoute() {
  const search = Route.useSearch()

  if (search['node-id'] === '821-1922' || search.nodeId === '821:1922') {
    return (
      <AgentReportsPage
        initialTab="commissions"
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  const isDetailsOpen =
    search['node-id'] === '745-6678' ||
    search.nodeId === '745:6678' ||
    search.modal === 'details' ||
    Boolean(search.details) ||
    Boolean(search.booking) ||
    Boolean(search.bookingId)

  const selectedBooking =
    search.booking ||
    search.bookingId ||
    (isDetailsOpen ? 'AW-DEMO-FL-006' : undefined)

  return (
    <CommissionTrackingPage
      initialDetailsOpen={isDetailsOpen}
      initialSelectedBookingId={selectedBooking}
      initialNodeId={search['node-id'] || search.nodeId}
    />
  )
}

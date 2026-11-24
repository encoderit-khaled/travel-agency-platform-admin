import { createFileRoute } from '@tanstack/react-router'
import {
  SubAgentDetailsPage,
  SubAgentBookingsPage,
  SubAgentPerformancePage,
  SubAgentMarkupPage,
} from '#/components/sub-agents'

interface SubAgentDetailsSearchParams {
  booking?: string
  tab?: 'overview' | 'permissions' | 'markup' | 'bookings' | 'performance'
  'node-id'?: string
  nodeId?: string
}

export const Route = createFileRoute('/sub-agents/details')({
  validateSearch: (
    search: Record<string, unknown>,
  ): SubAgentDetailsSearchParams => {
    const is694 =
      search['node-id'] === '694-6650' ||
      search.nodeId === '694:6650' ||
      search['node-id'] === '694-7691' ||
      search.nodeId === '694:7691' ||
      search['node-id'] === '694-7692' ||
      search.nodeId === '694:7692'
    const is696 =
      search['node-id'] === '696-9753' || search.nodeId === '696:9753'
    const is698 =
      search['node-id'] === '698-12713' ||
      search.nodeId === '698:12713' ||
      search['node-id'] === '698-11315' ||
      search.nodeId === '698:11315' ||
      search['node-id'] === '698-11316' ||
      search.nodeId === '698:11316'

    const rawBooking =
      typeof search.booking === 'string'
        ? search.booking
        : is696 ||
            search['node-id'] === '694-7691' ||
            search.nodeId === '694:7691' ||
            search['node-id'] === '694-7692' ||
            search.nodeId === '694:7692' ||
            search['node-id'] === '698-12713' ||
            search.nodeId === '698:12713'
          ? 'AW-DEMO-FL-001'
          : undefined

    const validTabs = [
      'overview',
      'permissions',
      'markup',
      'bookings',
      'performance',
    ]
    const rawTab =
      typeof search.tab === 'string' && validTabs.includes(search.tab)
        ? (search.tab as any)
        : is694
          ? 'bookings'
          : is698
            ? 'performance'
            : 'overview'

    return {
      booking: rawBooking,
      tab: rawTab,
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : undefined,
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : undefined,
    }
  },
  component: SubAgentDetailsRoute,
})

function SubAgentDetailsRoute() {
  const search = Route.useSearch()

  if (
    search.tab === 'markup' ||
    search['node-id'] === '691-5509' ||
    search.nodeId === '691:5509' ||
    search['node-id'] === '691-4490' ||
    search.nodeId === '691:4490'
  ) {
    return (
      <SubAgentMarkupPage
        deskName="Mirpur Desk"
        initialAddRuleOpen={
          search['node-id'] === '691-5509' ||
          search.nodeId === '691:5509' ||
          search.tab === 'markup'
        }
      />
    )
  }

  if (search.tab === 'bookings') {
    return (
      <SubAgentBookingsPage
        initialBookingRef={search.booking}
        initialTab="bookings"
        isStandalone={true}
      />
    )
  }

  if (search.tab === 'performance') {
    return <SubAgentPerformancePage initialBookingRef={search.booking} />
  }

  return (
    <SubAgentDetailsPage
      initialBookingRef={search.booking}
      initialTab={search.tab}
    />
  )
}

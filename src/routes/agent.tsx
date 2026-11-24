import { createFileRoute } from '@tanstack/react-router'
import {
  AgentDashboardPage,
  AgentBookingHistoryPage,
  AddEditMarkupRulePage,
  WalletLedgerPage,
  AgentStatementsPage,
  AgentReportsPage,
  RolesAccessPage,
} from '#/components/agent-portal'

interface AgentSearchParams {
  menu?: 'dropdown' | 'notifications'
  tab?: string
  populated?: boolean
  booking?: string
  'node-id'?: string
  nodeId?: string
}

export const Route = createFileRoute('/agent')({
  validateSearch: (search: Record<string, unknown>): AgentSearchParams => {
    return {
      menu:
        search.menu === 'dropdown' || search.menu === 'notifications'
          ? search.menu
          : undefined,
      tab: typeof search.tab === 'string' ? search.tab : undefined,
      populated: search.populated === true || search.populated === 'true',
      booking: typeof search.booking === 'string' ? search.booking : undefined,
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : undefined,
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : undefined,
    }
  },
  component: AgentRoute,
})

function AgentRoute() {
  const search = Route.useSearch()

  if (
    search.tab === 'Reports' ||
    search.tab === 'reports' ||
    search['node-id'] === '821-1923' ||
    search.nodeId === '821:1923' ||
    search['node-id'] === '821-920' ||
    search.nodeId === '821:920' ||
    search['node-id'] === '821-1920' ||
    search['node-id'] === '821-1921' ||
    search['node-id'] === '821-1922' ||
    search['node-id'] === '821-1924'
  ) {
    const rawId = search['node-id'] || search.nodeId
    const tab =
      rawId === '821-1923' || rawId === '821:1923'
        ? 'wallet-credit'
        : rawId === '821-1920'
          ? 'sales'
          : rawId === '821-1921'
            ? 'bookings'
            : rawId === '821-1922'
              ? 'commissions'
              : rawId === '821-1924'
                ? 'sub-agents'
                : 'overview'
    return <AgentReportsPage initialTab={tab} initialNodeId={rawId} />
  }

  if (
    search.tab === 'Statements' ||
    search.tab === 'statements' ||
    search['node-id'] === '749-7809' ||
    search.nodeId === '749:7809' ||
    search['node-id'] === '749-10386' ||
    search['node-id'] === '749-10388'
  ) {
    return (
      <AgentStatementsPage
        initialExportOpen={
          search['node-id'] === '749-10386' || search['node-id'] === '749-10388'
        }
        initialExportFormat={search['node-id'] === '749-10388' ? 'pdf' : 'csv'}
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  if (
    search.tab === 'Wallet' ||
    search.tab === 'wallet' ||
    search.tab === 'wallet-ledger' ||
    search['node-id'] === '728-28567' ||
    search.nodeId === '728:28567' ||
    search['node-id'] === '728-28566' ||
    search.nodeId === '728:28566' ||
    search['node-id'] === '728-29735' ||
    search['node-id'] === '728-29736'
  ) {
    return (
      <WalletLedgerPage
        initialExportOpen={search['node-id'] === '728-29735'}
        initialSelectedTransactionId={
          search['node-id'] === '728-29736' ? 'tx-1' : undefined
        }
      />
    )
  }

  if (
    search.tab === 'Pricing & Markup' ||
    search.tab === 'pricing-markup' ||
    search.tab === 'markup' ||
    search['node-id'] === '713-23496' ||
    search.nodeId === '713:23496'
  ) {
    return (
      <AddEditMarkupRulePage
        initialRuleName={search.populated ? 'Flight Client Markup' : ''}
        initialService={search.populated ? 'Flight' : ''}
        initialValue={search.populated ? '3.5' : ''}
      />
    )
  }

  if (
    search.tab === 'Roles & Access' ||
    search.tab === 'roles-access' ||
    search.tab === 'roles' ||
    search.tab === 'Account / Settings' ||
    search['node-id'] === '835-2262' ||
    search.nodeId === '835:2262' ||
    search['node-id'] === '835-2589' ||
    search['node-id'] === '835-2588' ||
    search['node-id'] === '835-2590' ||
    search['node-id'] === '835-2591'
  ) {
    const activeTab =
      search['node-id'] === '835-2588' || search['node-id'] === '835-2590'
        ? 'team'
        : search['node-id'] === '835-2591'
          ? 'matrix'
          : 'overview'
    return (
      <RolesAccessPage
        initialTab={activeTab}
        initialModal={
          search['node-id'] === '835-2589' || search.nodeId === '835:2589'
            ? 'owner'
            : search['node-id'] === '835-2590' || search.nodeId === '835:2590'
              ? 'team'
              : null
        }
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  if (
    search.tab === 'Bookings' ||
    search['node-id'] === '706-17471' ||
    search.nodeId === '706:17471'
  ) {
    return (
      <AgentBookingHistoryPage
        initialBookingRef={search.booking}
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  return (
    <AgentDashboardPage
      initialMenu={search.menu}
      initialTab={search.tab}
      initialPopulated={search.populated}
    />
  )
}

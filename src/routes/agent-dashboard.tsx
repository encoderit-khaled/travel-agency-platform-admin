import { createFileRoute } from '@tanstack/react-router'
import {
  AgentDashboardPage,
  AddEditMarkupRulePage,
  WalletLedgerPage,
} from '#/components/agent-portal'

interface AgentDashboardSearchParams {
  menu?: 'dropdown' | 'notifications'
  tab?: string
  populated?: boolean
  'node-id'?: string
  nodeId?: string
}

export const Route = createFileRoute('/agent-dashboard')({
  validateSearch: (
    search: Record<string, unknown>,
  ): AgentDashboardSearchParams => {
    const rawMenu =
      search.menu === 'dropdown' || search.menu === 'notifications'
        ? search.menu
        : search.notifications === 'open' ||
            search.notifications === true ||
            search.notifications === 'true'
          ? 'notifications'
          : undefined

    return {
      menu: rawMenu,
      tab: typeof search.tab === 'string' ? search.tab : undefined,
      populated: search.populated === true || search.populated === 'true',
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : undefined,
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : undefined,
    }
  },
  component: AgentDashboardRoute,
})

function AgentDashboardRoute() {
  const search = Route.useSearch()

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

  return (
    <AgentDashboardPage
      initialMenu={search.menu}
      initialTab={search.tab}
      initialPopulated={search.populated}
    />
  )
}

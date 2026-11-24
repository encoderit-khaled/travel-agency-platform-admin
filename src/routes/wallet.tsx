import { createFileRoute } from '@tanstack/react-router'
import { AgentWalletPage, WalletLedgerPage } from '#/components/agent-portal'

interface WalletSearchParams {
  'node-id'?: string
  nodeId?: string
  view?: 'overview' | 'ledger'
  topUp?: boolean | string
  modal?: 'topup' | 'export' | 'details'
  tx?: string
  export?: boolean | string
  menu?: 'dropdown' | 'notifications'
}

export const Route = createFileRoute('/wallet')({
  validateSearch: (search: Record<string, unknown>): WalletSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const modal =
      search.modal === 'topup' ||
      search.modal === 'export' ||
      search.modal === 'details'
        ? search.modal
        : undefined

    const isTopUp =
      search.topUp === true ||
      search.topUp === 'true' ||
      rawNodeId === '725-27232' ||
      rawNodeId === '725:27232' ||
      modal === 'topup'

    const isExport =
      search.export === true ||
      search.export === 'true' ||
      rawNodeId === '728-29735' ||
      rawNodeId === '728:29735' ||
      modal === 'export'

    // Determine view: default to 'overview' (Figma #723:25715 "Agent Wallet Overview")
    // Switch to 'ledger' only if explicitly requested or node-id is ledger (Figma #728:28566)
    const isLedgerNode =
      rawNodeId === '728-28567' ||
      rawNodeId === '728:28567' ||
      rawNodeId === '728-28566' ||
      rawNodeId === '728:28566' ||
      rawNodeId === '728-29735' ||
      rawNodeId === '728:29735' ||
      rawNodeId === '728-29736' ||
      rawNodeId === '728:29736'

    const view =
      search.view === 'ledger' || isLedgerNode || isExport || Boolean(search.tx)
        ? 'ledger'
        : 'overview'

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      view,
      topUp: isTopUp,
      modal,
      tx: typeof search.tx === 'string' ? search.tx : undefined,
      export: isExport,
      menu:
        search.menu === 'dropdown' || search.menu === 'notifications'
          ? search.menu
          : undefined,
    }
  },
  component: WalletRoute,
})

function WalletRoute() {
  const search = Route.useSearch()

  if (search.view === 'ledger') {
    const isDetailsOpen =
      search['node-id'] === '728-29736' ||
      search.nodeId === '728:29736' ||
      search.modal === 'details' ||
      Boolean(search.tx)

    const selectedTxId = search.tx || (isDetailsOpen ? 'tx-01' : undefined)

    return (
      <WalletLedgerPage
        initialExportOpen={Boolean(search.export)}
        initialSelectedTransactionId={selectedTxId}
        initialDrawerOpen={isDetailsOpen}
      />
    )
  }

  return (
    <AgentWalletPage
      initialTopUpOpen={Boolean(search.topUp)}
      initialMenu={search.menu}
    />
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { WalletLedgerPage } from '#/components/agent-portal'

interface WalletLedgerSearchParams {
  'node-id'?: string
  nodeId?: string
  modal?: 'export' | 'details'
  tx?: string
  export?: boolean
}

export const Route = createFileRoute('/wallet-ledger')({
  validateSearch: (
    search: Record<string, unknown>,
  ): WalletLedgerSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const modal =
      search.modal === 'export' || search.modal === 'details'
        ? search.modal
        : undefined

    const isExport =
      search.export === true ||
      search.export === 'true' ||
      rawNodeId === '728-29735' ||
      rawNodeId === '728:29735' ||
      modal === 'export'

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      modal,
      tx: typeof search.tx === 'string' ? search.tx : undefined,
      export: isExport,
    }
  },
  component: WalletLedgerRoute,
})

function WalletLedgerRoute() {
  const search = Route.useSearch()
  const rawNodeId = search['node-id'] || search.nodeId

  return (
    <WalletLedgerPage
      initialNodeId={rawNodeId}
      initialExportOpen={search.export}
      initialSelectedTransactionId={search.tx}
      initialDrawerOpen={
        rawNodeId === '728-29736' ||
        rawNodeId === '728:29736' ||
        search.modal === 'details'
      }
    />
  )
}

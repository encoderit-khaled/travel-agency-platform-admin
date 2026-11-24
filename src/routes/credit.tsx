import { createFileRoute } from '@tanstack/react-router'
import { CreditRequestsPage } from '#/components/agent-portal/credit-requests-page'

interface CreditSearchParams {
  tab?: 'history' | 'new'
  'node-id'?: string
  nodeId?: string
  modal?: string
  sheet?: string
  reqId?: string
  requestId?: string
}

export const Route = createFileRoute('/credit')({
  validateSearch: (search: Record<string, unknown>): CreditSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const rawTab =
      search.tab === 'history' || search.tab === 'new'
        ? (search.tab)
        : undefined

    const modal = typeof search.modal === 'string' ? search.modal : undefined
    const sheet = typeof search.sheet === 'string' ? search.sheet : undefined
    const reqId =
      typeof search.reqId === 'string'
        ? search.reqId
        : typeof search.requestId === 'string'
          ? search.requestId
          : undefined

    return {
      tab: rawTab,
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      modal,
      sheet,
      reqId,
      requestId: reqId,
    }
  },
  component: CreditRoute,
})

function CreditRoute() {
  const search = Route.useSearch()

  const rawNodeId = search['node-id'] || search.nodeId

  // Node #743:4132: "New Credit Request - Submit Request"
  // Node #743:4050: "New Credit Request"
  // Node #743:3110: "Credit Request History"
  // Node #743:4134: "Credit Request Details"
  const isSubmitModal =
    rawNodeId === '743-4132' ||
    rawNodeId === '743:4132' ||
    search.modal === 'submit' ||
    search.modal === 'submitted'

  const isDetailsSheet =
    rawNodeId === '743-4134' ||
    rawNodeId === '743:4134' ||
    search.sheet === 'details' ||
    Boolean(search.reqId)

  const isNewTab =
    search.tab === 'new' ||
    rawNodeId === '743-4050' ||
    rawNodeId === '743:4050' ||
    isSubmitModal

  const tab = isNewTab ? 'new' : 'history'

  return (
    <CreditRequestsPage
      initialTab={tab}
      initialSubmitSuccessOpen={isSubmitModal}
      initialSheetOpen={isDetailsSheet}
      initialRequestId={search.reqId}
    />
  )
}

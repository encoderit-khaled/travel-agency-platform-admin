import { createFileRoute } from '@tanstack/react-router'
import { AgentReportsPage } from '#/components/agent-portal'

interface ReportsSearchParams {
  'node-id'?: string
  nodeId?: string
  tab?:
    | 'overview'
    | 'sales'
    | 'bookings'
    | 'commissions'
    | 'wallet-credit'
    | 'sub-agents'
  export?: 'csv' | boolean | string
  modal?: 'export'
}

export const Route = createFileRoute('/reports')({
  validateSearch: (search: Record<string, unknown>): ReportsSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const exportParam = search.export
    const isExport =
      exportParam === 'csv' || exportParam === true || exportParam === 'true'
        ? 'csv'
        : undefined

    const tabParam = typeof search.tab === 'string' ? search.tab : undefined
    const validTabs = [
      'overview',
      'sales',
      'bookings',
      'commissions',
      'wallet-credit',
      'sub-agents',
    ]

    let defaultTab: ReportsSearchParams['tab'] = 'bookings'
    if (rawNodeId === '821-1923' || rawNodeId === '821:1923') {
      defaultTab = 'wallet-credit'
    } else if (rawNodeId === '821-1920' || rawNodeId === '821:1920') {
      defaultTab = 'sales'
    } else if (rawNodeId === '821-1921' || rawNodeId === '821:1921') {
      defaultTab = 'bookings'
    } else if (rawNodeId === '821-1922' || rawNodeId === '821:1922') {
      defaultTab = 'commissions'
    } else if (rawNodeId === '821-1924' || rawNodeId === '821:1924') {
      defaultTab = 'sub-agents'
    } else if (rawNodeId === '821-920' || rawNodeId === '821:920') {
      defaultTab = 'overview'
    }

    const tab = validTabs.includes(tabParam || '')
      ? (tabParam as ReportsSearchParams['tab'])
      : defaultTab

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      tab,
      export: isExport,
      modal: search.modal === 'export' ? 'export' : undefined,
    }
  },
  component: ReportsRoute,
})

function ReportsRoute() {
  const search = Route.useSearch()
  const isExportOpen = Boolean(search.export) || search.modal === 'export'

  return (
    <AgentReportsPage
      initialTab={search.tab || 'bookings'}
      initialExportOpen={isExportOpen}
      initialNodeId={search['node-id'] || search.nodeId}
    />
  )
}

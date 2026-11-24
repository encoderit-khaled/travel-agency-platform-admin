import { createFileRoute } from '@tanstack/react-router'
import { AgentStatementsPage } from '#/components/agent-portal'

interface StatementsSearchParams {
  'node-id'?: string
  nodeId?: string
  export?: 'csv' | 'pdf' | boolean | string
  modal?: 'export'
}

export const Route = createFileRoute('/statements')({
  validateSearch: (search: Record<string, unknown>): StatementsSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const exportParam = search.export
    const isExport =
      exportParam === 'csv'
        ? 'csv'
        : exportParam === 'pdf'
          ? 'pdf'
          : exportParam === true ||
              exportParam === 'true' ||
              rawNodeId === '749-10386' ||
              rawNodeId === '749:10386'
            ? 'csv'
            : rawNodeId === '749-10388' || rawNodeId === '749:10388'
              ? 'pdf'
              : undefined

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      export: isExport,
      modal: search.modal === 'export' ? 'export' : undefined,
    }
  },
  component: StatementsRoute,
})

function StatementsRoute() {
  const search = Route.useSearch()
  const rawNodeId = search['node-id'] || search.nodeId

  const exportFormat: 'csv' | 'pdf' =
    search.export === 'pdf' ||
    rawNodeId === '749-10388' ||
    rawNodeId === '749:10388'
      ? 'pdf'
      : 'csv'

  const isExportOpen =
    Boolean(search.export) ||
    search.modal === 'export' ||
    rawNodeId === '749-10386' ||
    rawNodeId === '749:10386' ||
    rawNodeId === '749-10388' ||
    rawNodeId === '749:10388'

  return (
    <AgentStatementsPage
      key={`${rawNodeId || 'default'}-${search.export || 'none'}-${search.modal || 'none'}`}
      initialExportOpen={isExportOpen}
      initialExportFormat={exportFormat}
      initialNodeId={rawNodeId}
    />
  )
}

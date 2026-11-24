import { createFileRoute } from '@tanstack/react-router'
import { SubAgentMarkupPage } from '#/components/sub-agents'

interface SubAgentMarkupSearchParams {
  desk?: string
  nodeId?: string
  'node-id'?: string
  addRule?: boolean
}

export const Route = createFileRoute('/sub-agents/markup')({
  validateSearch: (
    search: Record<string, unknown>,
  ): SubAgentMarkupSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const rawAddRule =
      search.addRule === 'true' ||
      search.addRule === true ||
      rawNodeId === '691-5509' ||
      rawNodeId === '691:5509' ||
      search.addRule === undefined // Default to open matching Figma #691:5509

    return {
      desk: typeof search.desk === 'string' ? search.desk : undefined,
      nodeId: rawNodeId,
      'node-id': rawNodeId,
      addRule: rawAddRule,
    }
  },
  component: SubAgentMarkupRoute,
})

function SubAgentMarkupRoute() {
  const search = Route.useSearch()

  return (
    <SubAgentMarkupPage
      deskName={
        search.desk
          ? search.desk.includes('Mirpur')
            ? search.desk
            : `${search.desk} Desk`
          : 'Mirpur Desk'
      }
      initialAddRuleOpen={search.addRule}
    />
  )
}

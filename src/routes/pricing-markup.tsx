import { createFileRoute } from '@tanstack/react-router'
import { AgentPricingMarkupPage } from '#/components/pricing-markup'

interface PricingMarkupSearchParams {
  nodeId?: string
  'node-id'?: string
  modal?: string
  drawer?: string
  ruleId?: string
  rule?: string
  q?: string
  source?: string
  type?: string
}

export const Route = createFileRoute('/pricing-markup')({
  validateSearch: (
    search: Record<string, unknown>,
  ): PricingMarkupSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const modal =
      typeof search.modal === 'string'
        ? search.modal
        : typeof search.drawer === 'string'
          ? search.drawer
          : rawNodeId === '710-22500' || rawNodeId === '710:22500'
            ? 'remove'
            : rawNodeId === '710-22499' || rawNodeId === '710:22499'
              ? 'disable'
              : rawNodeId === '710-22498' || rawNodeId === '710:22498'
                ? 'details'
                : rawNodeId === '710-22497' || rawNodeId === '710:22497'
                  ? 'preview'
                  : undefined

    const ruleId =
      typeof search.ruleId === 'string'
        ? search.ruleId
        : typeof search.rule === 'string'
          ? search.rule
          : undefined

    return {
      nodeId: rawNodeId,
      'node-id': rawNodeId,
      modal,
      drawer: typeof search.drawer === 'string' ? search.drawer : undefined,
      ruleId,
      rule: ruleId,
      q: typeof search.q === 'string' ? search.q : undefined,
      source: typeof search.source === 'string' ? search.source : undefined,
      type: typeof search.type === 'string' ? search.type : undefined,
    }
  },
  component: PricingMarkupRoute,
})

function PricingMarkupRoute() {
  const search = Route.useSearch()

  return (
    <AgentPricingMarkupPage
      initialSearch={search.q || ''}
      initialFilterSource={search.source || 'all'}
      initialFilterType={search.type || 'all'}
      initialModal={search.modal}
      initialRuleId={search.ruleId}
    />
  )
}

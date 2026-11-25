import { createFileRoute } from '@tanstack/react-router'
import { B2CCustomersPage } from '#/components/admin'
import type { SignInMethodFilter } from '#/components/admin'

interface B2CCustomersSearchParams {
  'node-id'?: string
  nodeId?: string
  view?: 'list' | 'details'
  sidebar?: 'collapsed' | 'expanded'
  customerId?: string
  q?: string
  signin?: SignInMethodFilter
}

export const Route = createFileRoute('/b2c-customers')({
  validateSearch: (search: Record<string, unknown>): B2CCustomersSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const isCollapsedNode =
      rawNodeId === '995-4126' ||
      rawNodeId === '995:4126' ||
      search.sidebar === 'collapsed'

    const isDetailsNode =
      isCollapsedNode ||
      rawNodeId === '990-2945' ||
      rawNodeId === '990:2945' ||
      search.view === 'details'

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      view: isDetailsNode ? 'details' : 'list',
      sidebar: isCollapsedNode ? 'collapsed' : 'expanded',
      customerId:
        typeof search.customerId === 'string' ? search.customerId : undefined,
      q: typeof search.q === 'string' ? search.q : undefined,
      signin:
        search.signin === 'email' ||
        search.signin === 'google' ||
        search.signin === 'mobile'
          ? search.signin
          : 'all',
    }
  },
  component: B2CCustomersRoute,
})

function B2CCustomersRoute() {
  const search = Route.useSearch()

  return (
    <B2CCustomersPage
      initialView={search.view}
      initialSidebarCollapsed={search.sidebar === 'collapsed'}
      initialSelectedCustomerId={search.customerId || (search.view === 'details' ? 'cust-1' : null)}
      initialSearchQuery={search.q}
      initialSigninFilter={search.signin}
    />
  )
}

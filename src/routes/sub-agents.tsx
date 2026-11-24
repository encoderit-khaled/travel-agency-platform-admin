import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { SubAgentsPage } from '#/components/agent-portal'
import {
  SubAgentPermissionsPage,
  SubAgentMarkupPage,
} from '#/components/sub-agents'

interface SubAgentsSearchParams {
  dropdown?: boolean
  desk?: string
  q?: string
  view?: string
  nodeId?: string
  'node-id'?: string
}

export const Route = createFileRoute('/sub-agents')({
  validateSearch: (search: Record<string, unknown>): SubAgentsSearchParams => {
    const rawDropdown =
      search.dropdown === true ||
      search.dropdown === 'true' ||
      search.action === 'dropdown' ||
      search['node-id'] === '665-7388' ||
      search.nodeId === '665:7388'

    const nodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const view = typeof search.view === 'string' ? search.view : undefined

    return {
      dropdown: rawDropdown,
      desk: typeof search.desk === 'string' ? search.desk : undefined,
      q: typeof search.q === 'string' ? search.q : undefined,
      view,
      nodeId,
      'node-id': nodeId,
    }
  },
  component: SubAgentsRoute,
})

function SubAgentsRoute() {
  const search = Route.useSearch()
  const location = useLocation()

  if (location.pathname !== '/sub-agents') {
    return <Outlet />
  }

  if (
    search['node-id'] === '689-3100' ||
    search.nodeId === '689:3100' ||
    search.view === 'permissions'
  ) {
    return <SubAgentPermissionsPage deskName={search.desk || 'Mirpur Desk'} />
  }

  if (
    search['node-id'] === '691-4490' ||
    search.nodeId === '691:4490' ||
    search['node-id'] === '691-5509' ||
    search.nodeId === '691:5509' ||
    search.view === 'markup'
  ) {
    return (
      <SubAgentMarkupPage
        deskName={search.desk || 'Mirpur Desk'}
        initialAddRuleOpen={
          search['node-id'] === '691-5509' ||
          search.nodeId === '691:5509' ||
          search.view === 'markup'
        }
      />
    )
  }

  return (
    <SubAgentsPage
      initialDropdownOpen={search.dropdown}
      initialSearch={search.q}
      initialDeskId={search.desk}
    />
  )
}

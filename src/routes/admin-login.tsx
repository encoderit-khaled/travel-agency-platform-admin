import { createFileRoute } from '@tanstack/react-router'
import { AdminLoginPage } from '#/components/admin'

interface AdminLoginSearchParams {
  'node-id'?: string
  nodeId?: string
  view?: 'login' | 'trouble'
  email?: string
}

export const Route = createFileRoute('/admin-login')({
  validateSearch: (search: Record<string, unknown>): AdminLoginSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const isTrouble =
      search.view === 'trouble' ||
      rawNodeId === '965-1500' ||
      rawNodeId === '965:1500'

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      view: isTrouble ? 'trouble' : 'login',
      email: typeof search.email === 'string' ? search.email : undefined,
    }
  },
  component: AdminLoginRoute,
})

function AdminLoginRoute() {
  const search = Route.useSearch()
  return (
    <AdminLoginPage initialView={search.view} initialEmail={search.email} />
  )
}

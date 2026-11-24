import { createFileRoute } from '@tanstack/react-router'
import { AdminAgentApplicationsPage } from '#/components/admin'
import type { ApplicationStatus } from '#/components/admin'

interface AdminSearchParams {
  tab?: 'pending' | 'all'
  status?: ApplicationStatus
  q?: string
  view?: 'default' | 'no-data' | 'review'
  reviewId?: string
  appId?: string
  action?: 'approve' | 'reject' | 'suspend'
  empty?: boolean
}

export const Route = createFileRoute('/admin')({
  validateSearch: (search: Record<string, unknown>): AdminSearchParams => {
    const rawAppId =
      typeof search.appId === 'string'
        ? search.appId
        : typeof search.reviewId === 'string'
          ? search.reviewId
          : undefined

    const rawAction =
      search.action === 'approve' ||
      search.action === 'reject' ||
      search.action === 'suspend'
        ? search.action
        : search.approve === true || search.approve === 'true'
          ? 'approve'
          : undefined

    return {
      tab: search.tab === 'all' ? 'all' : 'pending',
      status:
        search.status === 'pending' ||
        search.status === 'approved' ||
        search.status === 'rejected' ||
        search.status === 'suspended'
          ? search.status
          : undefined,
      q: typeof search.q === 'string' ? search.q : undefined,
      view:
        search.view === 'review' || rawAppId || rawAction
          ? 'review'
          : search.view === 'no-data'
            ? 'no-data'
            : 'default',
      reviewId: rawAppId,
      appId: rawAppId,
      action: rawAction,
      empty: search.empty === true || search.empty === 'true',
    }
  },
  component: AdminAgentApplicationsRoute,
})

function AdminAgentApplicationsRoute() {
  const search = Route.useSearch()
  return (
    <AdminAgentApplicationsPage
      initialView={search.view}
      initialReviewId={search.reviewId}
      initialTab={search.tab}
      initialStatus={search.status}
      initialSearchQuery={search.q}
      initialEmpty={search.empty}
      initialAction={search.action}
    />
  )
}

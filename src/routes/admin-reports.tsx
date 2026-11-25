import { createFileRoute } from '@tanstack/react-router'
import {
  AdminReportsSalesPage,
  AdminReportsPage,
  AdminReportsCommissionsPage,
} from '#/components/admin'
import type { ReportTab } from '#/components/admin'

interface AdminReportsSearchParams {
  'node-id'?: string
  nodeId?: string
  tab?: ReportTab
  from?: string
  to?: string
  service?: string
  supplier?: string
  channel?: string
}

export const Route = createFileRoute('/admin-reports')({
  validateSearch: (
    search: Record<string, unknown>,
  ): AdminReportsSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const rawTab =
      search.tab === 'sales' ||
      search.tab === 'bookings' ||
      search.tab === 'payments' ||
      search.tab === 'commissions'
        ? search.tab
        : rawNodeId === '1005-5341' ||
            rawNodeId === '1005:5341' ||
            rawNodeId === '1005-5344' ||
            rawNodeId === '1005:5344'
          ? 'bookings'
          : rawNodeId === '1005-5345' || rawNodeId === '1005:5345'
            ? 'payments'
            : rawNodeId === '1005-5346' || rawNodeId === '1005:5346'
              ? 'commissions'
              : 'bookings'

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      tab: rawTab,
      from: typeof search.from === 'string' ? search.from : undefined,
      to: typeof search.to === 'string' ? search.to : undefined,
      service: typeof search.service === 'string' ? search.service : undefined,
      supplier:
        typeof search.supplier === 'string' ? search.supplier : undefined,
      channel: typeof search.channel === 'string' ? search.channel : undefined,
    }
  },
  component: AdminReportsRoute,
})

function AdminReportsRoute() {
  const search = Route.useSearch()

  const isBookings =
    search.tab === 'bookings' ||
    search['node-id'] === '1005-5341' ||
    search['node-id'] === '1005:5341' ||
    search.nodeId === '1005-5341' ||
    search.nodeId === '1005:5341' ||
    search['node-id'] === '1005-5344' ||
    search['node-id'] === '1005:5344' ||
    search.nodeId === '1005-5344' ||
    search.nodeId === '1005:5344' ||
    !search.tab

  const isPayments =
    search.tab === 'payments' ||
    search['node-id'] === '1005-5345' ||
    search['node-id'] === '1005:5345' ||
    search.nodeId === '1005-5345' ||
    search.nodeId === '1005:5345'

  const isCommissions =
    search.tab === 'commissions' ||
    search['node-id'] === '1005-5346' ||
    search['node-id'] === '1005:5346' ||
    search.nodeId === '1005-5346' ||
    search.nodeId === '1005:5346'

  if (isBookings) {
    return (
      <AdminReportsPage
        initialTab="bookings"
        initialNodeId={search['node-id'] || search.nodeId || '1005-5341'}
        initialFrom={search.from}
        initialTo={search.to}
        initialService={search.service}
        initialSupplier={search.supplier}
        initialChannel={search.channel}
      />
    )
  }

  if (isCommissions) {
    return (
      <AdminReportsCommissionsPage
        initialTab="commissions"
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  if (isPayments) {
    return (
      <AdminReportsPage
        initialTab="payments"
        initialNodeId={search['node-id'] || search.nodeId}
        initialFrom={search.from}
        initialTo={search.to}
        initialService={search.service}
        initialSupplier={search.supplier}
        initialChannel={search.channel}
      />
    )
  }

  return (
    <AdminReportsSalesPage
      initialTab={search.tab || 'sales'}
      initialNodeId={search['node-id'] || search.nodeId}
      initialFrom={search.from}
      initialTo={search.to}
      initialService={search.service}
      initialSupplier={search.supplier}
      initialChannel={search.channel}
    />
  )
}

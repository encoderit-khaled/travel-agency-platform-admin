import { createFileRoute } from '@tanstack/react-router'
import {
  AdminAgentApplicationsPage,
  AdminLoginPage,
  AdminRolesPermissionsPage,
  AdminUsersPage,
  AdminDashboardPage,
  B2CCustomersPage,
  AdminAuditLogPage,
  AdminReportsSalesPage,
  AdminReportsPage,
  AdminReportsCommissionsPage,
  BusinessDetailsPage,
  CurrenciesExchangeRatesPage,
  CancellationPoliciesPage,
  LanguagesPage,
  TaxDefaultsPage,
} from '#/components/admin'
import type { ApplicationStatus, AdminRoleId } from '#/components/admin'

interface AdminSearchParams {
  'node-id'?: string
  nodeId?: string
  tab?:
    | 'pending'
    | 'all'
    | 'roles-permissions'
    | 'users'
    | 'dashboard'
    | 'customers'
    | 'b2c-customers'
    | 'audit-log'
    | 'reports'
    | 'sales'
    | 'platform-settings'
    | 'business-details'
    | 'languages'
    | 'currencies'
    | 'taxes'
    | 'tax-defaults'
    | 'cancellation'
  status?: ApplicationStatus
  q?: string
  view?:
    | 'default'
    | 'no-data'
    | 'review'
    | 'login'
    | 'trouble'
    | 'roles-permissions'
    | 'users'
    | 'dashboard'
    | 'customers'
    | 'b2c-customers'
    | 'audit-log'
    | 'reports'
    | 'sales'
    | 'platform-settings'
    | 'business-details'
    | 'languages'
    | 'currencies'
    | 'taxes'
    | 'tax-defaults'
    | 'cancellation'
  reviewId?: string
  appId?: string
  action?: 'approve' | 'reject' | 'suspend'
  empty?: boolean
  role?: AdminRoleId
  edit?: boolean
  customerId?: string
  sidebar?: string
  area?: string
  admin?: string
}

export const Route = createFileRoute('/admin')({
  validateSearch: (search: Record<string, unknown>): AdminSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const isAuditLogNode =
      rawNodeId === '995-3669' ||
      rawNodeId === '995:3669' ||
      search.view === 'audit-log' ||
      search.tab === 'audit-log'

    const isLanguagesNode =
      rawNodeId === '1009-6558' ||
      rawNodeId === '1009:6558' ||
      rawNodeId === '1009-6827' ||
      rawNodeId === '1009:6827' ||
      rawNodeId === '1009-6944' ||
      rawNodeId === '1009:6944' ||
      search.view === 'languages' ||
      search.tab === 'languages'

    const isPlatformSettingsNode =
      !isLanguagesNode &&
      (rawNodeId === '1007-5992' ||
        rawNodeId === '1007:5992' ||
        search.view === 'platform-settings' ||
        search.view === 'business-details' ||
        search.tab === 'platform-settings' ||
        search.tab === 'business-details')

    const isReportsNode =
      rawNodeId === '1005-5341' ||
      rawNodeId === '1005:5341' ||
      rawNodeId === '1005-4738' ||
      rawNodeId === '1005:4738' ||
      rawNodeId === '1005-5345' ||
      rawNodeId === '1005:5345' ||
      rawNodeId === '1005-5346' ||
      rawNodeId === '1005:5346' ||
      rawNodeId === '1005-5344' ||
      rawNodeId === '1005:5344' ||
      search.view === 'reports' ||
      search.view === 'bookings' ||
      search.view === 'sales' ||
      search.tab === 'reports' ||
      search.tab === 'bookings' ||
      search.tab === 'sales'

    const isCustomersNode =
      rawNodeId === '984-2269' ||
      rawNodeId === '984:2269' ||
      rawNodeId === '990-2945' ||
      rawNodeId === '990:2945' ||
      rawNodeId === '995-4126' ||
      rawNodeId === '995:4126' ||
      search.view === 'customers' ||
      search.view === 'b2c-customers' ||
      search.tab === 'customers' ||
      search.tab === 'b2c-customers'

    const isDashboardNode =
      !isCustomersNode &&
      (rawNodeId === '972-2052' ||
        rawNodeId === '972:2052' ||
        rawNodeId === '972-2051' ||
        rawNodeId === '972:2051' ||
        search.view === 'dashboard' ||
        search.tab === 'dashboard' ||
        (!rawNodeId &&
          !search.view &&
          !search.tab &&
          !search.status &&
          typeof search.appId !== 'string' &&
          typeof search.reviewId !== 'string' &&
          !search.action &&
          !search.q &&
          !search.empty &&
          !search.role &&
          !search.edit))

    const isUsersNode =
      rawNodeId === '975-3024' ||
      rawNodeId === '975:3024' ||
      search.view === 'users' ||
      search.tab === 'users'

    const isRolesPermissionsNode =
      rawNodeId === '984-976' ||
      rawNodeId === '984:976' ||
      rawNodeId === '984-1859' ||
      rawNodeId === '984:1859' ||
      search.view === 'roles-permissions' ||
      search.tab === 'roles-permissions'

    const isLoginNode =
      rawNodeId === '965-1410' ||
      rawNodeId === '965:1410' ||
      search.view === 'login'

    const isTroubleNode =
      rawNodeId === '965-1500' ||
      rawNodeId === '965:1500' ||
      search.view === 'trouble'

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

    const rawRole: AdminRoleId | undefined =
      search.role === 'super-admin' ||
      search.role === 'operations' ||
      search.role === 'finance' ||
      search.role === 'support' ||
      search.role === 'content'
        ? search.role
        : undefined

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      tab:
        search.tab === 'roles-permissions'
          ? 'roles-permissions'
          : search.tab === 'all'
            ? 'all'
            : 'pending',
      status:
        search.status === 'pending' ||
        search.status === 'approved' ||
        search.status === 'rejected' ||
        search.status === 'suspended'
          ? search.status
          : undefined,
      q: typeof search.q === 'string' ? search.q : undefined,
      view: isLanguagesNode
        ? 'languages'
        : isPlatformSettingsNode
          ? 'platform-settings'
        : isReportsNode
          ? 'reports'
          : isAuditLogNode
            ? 'audit-log'
            : isCustomersNode
              ? 'b2c-customers'
              : isDashboardNode
                ? 'dashboard'
                : isUsersNode
                  ? 'users'
                  : isRolesPermissionsNode
                    ? 'roles-permissions'
                    : isLoginNode
                      ? 'login'
                      : isTroubleNode
                        ? 'trouble'
                        : search.view === 'review' || rawAppId || rawAction
                          ? 'review'
                          : search.view === 'no-data'
                            ? 'no-data'
                            : 'default',
      reviewId: rawAppId,
      appId: rawAppId,
      action: rawAction,
      empty: search.empty === true || search.empty === 'true',
      role: rawRole,
      edit:
        search.edit === true ||
        search.edit === 'true' ||
        rawNodeId === '984-1859' ||
        rawNodeId === '984:1859',
      customerId:
        typeof search.customerId === 'string' ? search.customerId : undefined,
      sidebar: typeof search.sidebar === 'string' ? search.sidebar : undefined,
      area: typeof search.area === 'string' ? search.area : undefined,
      admin: typeof search.admin === 'string' ? search.admin : undefined,
    }
  },
  component: AdminAgentApplicationsRoute,
})

function AdminAgentApplicationsRoute() {
  const search = Route.useSearch()
  const rawNodeId = search['node-id'] || search.nodeId

  const isCancellationNode =
    rawNodeId === '1084-3525' ||
    rawNodeId === '1084:3525' ||
    rawNodeId === '1084-3526' ||
    rawNodeId === '1084:3526' ||
    rawNodeId === '1084-3794' ||
    rawNodeId === '1084:3794' ||
    rawNodeId === '1084-3795' ||
    rawNodeId === '1084:3795' ||
    rawNodeId === '1084-3797' ||
    rawNodeId === '1084:3797' ||
    rawNodeId === '1084-3798' ||
    rawNodeId === '1084:3798' ||
    search.tab === 'cancellation' ||
    search.view === 'cancellation'

  if (isCancellationNode) {
    const isConfigure =
      Boolean(search.edit) ||
      rawNodeId === '1084-3798' ||
      rawNodeId === '1084:3798' ||
      rawNodeId === '1084-3795' ||
      rawNodeId === '1084:3795'
    const isEmpty =
      rawNodeId === '1084-3525' ||
      rawNodeId === '1084:3525' ||
      rawNodeId === '1084-3526' ||
      rawNodeId === '1084:3526'

    return (
      <CancellationPoliciesPage
        initialNodeId={
          rawNodeId ||
          (isConfigure ? '1084-3798' : isEmpty ? '1084-3525' : '1084-3797')
        }
        initialSection="cancellation"
        initialMode={isConfigure ? 'configure' : isEmpty ? 'empty' : 'view'}
      />
    )
  }

  const isTaxDefaultsNode =
    rawNodeId === '1049-277' ||
    rawNodeId === '1049:277' ||
    rawNodeId === '1049-1250' ||
    rawNodeId === '1049:1250' ||
    rawNodeId === '1049-1251' ||
    rawNodeId === '1049:1251' ||
    search.tab === 'taxes' ||
    search.view === 'taxes'

  if (isTaxDefaultsNode) {
    const isView = rawNodeId === '1049-1251' || rawNodeId === '1049:1251'
    const isAdd = rawNodeId === '1049-1250' || rawNodeId === '1049:1250'

    return (
      <TaxDefaultsPage
        initialNodeId={rawNodeId || (isAdd ? '1049-1250' : '1049-277')}
        initialSection="taxes"
        initialMode={isView ? 'view' : isAdd ? 'add' : 'empty'}
      />
    )
  }

  const isCurrenciesNode =
    rawNodeId === '1015-7243' ||
    rawNodeId === '1015:7243' ||
    rawNodeId === '1015-7533' ||
    rawNodeId === '1015:7533' ||
    rawNodeId === '1015-7534' ||
    rawNodeId === '1015:7534' ||
    rawNodeId === '1015-7535' ||
    rawNodeId === '1015:7535' ||
    rawNodeId === '1015-7536' ||
    rawNodeId === '1015:7536' ||
    rawNodeId === '1022-7537' ||
    rawNodeId === '1022:7537' ||
    search.tab === 'currencies' ||
    search.view === 'currencies'

  if (isCurrenciesNode) {
    const isAddRates =
      rawNodeId === '1015-7536' || rawNodeId === '1015:7536'
    const isEditCurrencies =
      rawNodeId === '1015-7533' || rawNodeId === '1015:7533'
    const isViewCurrencies =
      rawNodeId === '1015-7534' || rawNodeId === '1015:7534'
    const isDisplayTab =
      rawNodeId === '1015-7243' ||
      rawNodeId === '1015:7243' ||
      rawNodeId === '1015-7533' ||
      rawNodeId === '1015:7533' ||
      isViewCurrencies ||
      search.tab === 'currencies' ||
      search.view === 'currencies'

    return (
      <CurrenciesExchangeRatesPage
        initialNodeId={
          rawNodeId ||
          (isAddRates ? '1015-7536' : isDisplayTab ? '1015-7243' : '1015-7535')
        }
        initialSection="currencies"
        initialTab={isDisplayTab ? 'display-currencies' : 'exchange-rates'}
        initialEditMode={isAddRates || isEditCurrencies || Boolean(search.edit)}
        initialSuccessOpen={isViewCurrencies}
      />
    )
  }

  if (
    search.view === 'languages' ||
    search['node-id'] === '1009-6558' ||
    search.nodeId === '1009:6558' ||
    search['node-id'] === '1009-6826' ||
    search.nodeId === '1009:6826' ||
    search['node-id'] === '1009-6827' ||
    search.nodeId === '1009:6827' ||
    search['node-id'] === '1009-6944' ||
    search.nodeId === '1009:6944' ||
    search.tab === 'languages'
  ) {
    const isConfigure =
      Boolean(search.edit) ||
      search['node-id'] === '1009-6826' ||
      search.nodeId === '1009:6826' ||
      search['node-id'] === '1009-6827' ||
      search.nodeId === '1009:6827' ||
      search['node-id'] === '1009-6944' ||
      search.nodeId === '1009:6944'

    return (
      <LanguagesPage
        initialNodeId={search['node-id'] || search.nodeId || '1009-6826'}
        initialConfigureMode={isConfigure}
      />
    )
  }

  if (
    search.view === 'platform-settings' ||
    search.view === 'business-details' ||
    search['node-id'] === '1007-5992' ||
    search.nodeId === '1007:5992' ||
    search.tab === 'platform-settings' ||
    search.tab === 'business-details'
  ) {
    return (
      <BusinessDetailsPage
        initialNodeId={search['node-id'] || search.nodeId || '1007-5992'}
        initialEditOpen={Boolean(search.edit)}
      />
    )
  }

  if (
    search.view === 'reports' ||
    search.view === 'sales' ||
    search.view === 'bookings'
  ) {
    const tab =
      search['node-id'] === '1005-5341' ||
      search.nodeId === '1005:5341' ||
      search['node-id'] === '1005-5344' ||
      search.nodeId === '1005:5344' ||
      search.tab === 'bookings' ||
      search.view === 'bookings'
        ? 'bookings'
        : search['node-id'] === '1005-5345' || search.nodeId === '1005:5345'
          ? 'payments'
          : search['node-id'] === '1005-5346' || search.nodeId === '1005:5346'
            ? 'commissions'
            : 'sales'
    if (tab === 'bookings') {
      return (
        <AdminReportsPage
          initialTab="bookings"
          initialNodeId={search['node-id'] || search.nodeId || '1005-5341'}
        />
      )
    }
    if (tab === 'payments') {
      return (
        <AdminReportsPage
          initialTab="payments"
          initialNodeId={search['node-id'] || search.nodeId}
        />
      )
    }
    if (tab === 'commissions') {
      return (
        <AdminReportsCommissionsPage
          initialTab="commissions"
          initialNodeId={search['node-id'] || search.nodeId}
        />
      )
    }
    return <AdminReportsSalesPage initialTab={tab} />
  }

  if (search.view === 'audit-log') {
    return (
      <AdminAuditLogPage
        initialSearchQuery={search.q}
        initialArea={search.area || 'all'}
        initialAdmin={search.admin || 'all'}
      />
    )
  }

  if (search.view === 'b2c-customers' || search.view === 'customers') {
    const isCollapsed =
      search['node-id'] === '995-4126' ||
      search.nodeId === '995:4126' ||
      search.sidebar === 'collapsed'
    const isDetails =
      isCollapsed ||
      search['node-id'] === '990-2945' ||
      search.nodeId === '990:2945' ||
      Boolean(search.customerId)
    return (
      <B2CCustomersPage
        initialSearchQuery={search.q}
        initialView={isDetails ? 'details' : 'list'}
        initialSidebarCollapsed={isCollapsed}
        initialSelectedCustomerId={
          search.customerId || (isDetails ? 'cust-1' : null)
        }
      />
    )
  }

  if (search.view === 'dashboard') {
    return <AdminDashboardPage />
  }

  if (search.view === 'users') {
    return (
      <AdminUsersPage
        initialSearchQuery={search.q}
        initialEmpty={search.empty}
      />
    )
  }

  if (search.view === 'roles-permissions') {
    return (
      <AdminRolesPermissionsPage
        initialRoleId={search.role || 'super-admin'}
        initialEditOpen={Boolean(search.edit)}
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  if (search.view === 'login' || search.view === 'trouble') {
    return <AdminLoginPage initialView={search.view} />
  }

  return (
    <AdminAgentApplicationsPage
      initialView={search.view}
      initialReviewId={search.reviewId}
      initialTab={search.tab === 'all' ? 'all' : 'pending'}
      initialStatus={search.status}
      initialSearchQuery={search.q}
      initialEmpty={search.empty}
      initialAction={search.action}
    />
  )
}

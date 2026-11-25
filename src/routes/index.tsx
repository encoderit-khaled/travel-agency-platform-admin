import { createFileRoute } from '@tanstack/react-router'
import {
  AgentDashboardPage,
  AddEditMarkupRulePage,
  WalletLedgerPage,
} from '#/components/agent-portal'
import {
  AdminLoginPage,
  AdminRolesPermissionsPage,
  AdminUsersPage,
  B2CCustomersPage,
  BusinessDetailsPage,
  CurrenciesExchangeRatesPage,
  LanguagesPage,
  TaxDefaultsPage,
  CancellationPoliciesPage,
  AdminReportsCommissionsPage,
  AdminReportsPage,
} from '#/components/admin'

interface IndexSearchParams {
  menu?: 'dropdown' | 'notifications'
  tab?: string
  populated?: boolean
  'node-id'?: string
  nodeId?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): IndexSearchParams => {
    const rawMenu =
      search.menu === 'dropdown' || search.menu === 'notifications'
        ? search.menu
        : search.notifications === 'open' ||
            search.notifications === true ||
            search.notifications === 'true'
          ? 'notifications'
          : undefined

    return {
      menu: rawMenu,
      tab: typeof search.tab === 'string' ? search.tab : undefined,
      populated: search.populated === true || search.populated === 'true',
      'node-id':
        typeof search['node-id'] === 'string' ? search['node-id'] : undefined,
      nodeId: typeof search.nodeId === 'string' ? search.nodeId : undefined,
    }
  },
  component: IndexRoute,
})

function IndexRoute() {
  const search = Route.useSearch()

  if (
    search.tab === 'Wallet' ||
    search.tab === 'wallet' ||
    search.tab === 'wallet-ledger' ||
    search['node-id'] === '728-28567' ||
    search.nodeId === '728:28567' ||
    search['node-id'] === '728-28566' ||
    search.nodeId === '728:28566' ||
    search['node-id'] === '728-29735' ||
    search['node-id'] === '728-29736'
  ) {
    return (
      <WalletLedgerPage
        initialExportOpen={search['node-id'] === '728-29735'}
        initialSelectedTransactionId={
          search['node-id'] === '728-29736' ? 'tx-1' : undefined
        }
      />
    )
  }

  if (
    search['node-id'] === '1015-7536' ||
    search.nodeId === '1015:7536' ||
    search['node-id'] === '1015-7535' ||
    search.nodeId === '1015:7535' ||
    search['node-id'] === '1022-7537' ||
    search.nodeId === '1022:7537' ||
    search['node-id'] === '1015-7243' ||
    search.nodeId === '1015:7243' ||
    search['node-id'] === '1015-7533' ||
    search.nodeId === '1015:7533' ||
    search['node-id'] === '1015-7534' ||
    search.nodeId === '1015:7534' ||
    search.tab === 'currencies' ||
    search.tab === 'exchange-rates'
  ) {
    const nodeId = search['node-id'] || search.nodeId
    const isAddRates = nodeId === '1015-7536' || nodeId === '1015:7536'
    const isEditCurrencies = nodeId === '1015-7533' || nodeId === '1015:7533'
    const isViewCurrencies = nodeId === '1015-7534' || nodeId === '1015:7534'
    const isDisplayTab =
      nodeId === '1015-7243' ||
      nodeId === '1015:7243' ||
      nodeId === '1015-7533' ||
      nodeId === '1015:7533' ||
      isViewCurrencies

    return (
      <CurrenciesExchangeRatesPage
        initialNodeId={
          nodeId ||
          (isAddRates
            ? '1015-7536'
            : search.tab === 'currencies' || isDisplayTab
              ? '1015-7243'
              : '1015-7535')
        }
        initialSection="currencies"
        initialTab={
          search.tab === 'currencies' || isDisplayTab
            ? 'display-currencies'
            : 'exchange-rates'
        }
        initialEditMode={isAddRates || isEditCurrencies}
        initialSuccessOpen={isViewCurrencies}
      />
    )
  }

  if (
    search['node-id'] === '1084-3798' ||
    search.nodeId === '1084:3798' ||
    search['node-id'] === '1084-3795' ||
    search.nodeId === '1084:3795' ||
    search['node-id'] === '1084-3797' ||
    search.nodeId === '1084:3797' ||
    search['node-id'] === '1084-3794' ||
    search.nodeId === '1084:3794' ||
    search['node-id'] === '1084-3525' ||
    search.nodeId === '1084:3525' ||
    search.tab === 'cancellation'
  ) {
    const nodeId = search['node-id'] || search.nodeId
    const isView = nodeId === '1084-3797' || nodeId === '1084:3797' || nodeId === '1084-3794' || nodeId === '1084:3794'
    const isEmpty = nodeId === '1084-3525' || nodeId === '1084:3525'
    return (
      <CancellationPoliciesPage
        initialNodeId={nodeId || '1084-3797'}
        initialSection="cancellation"
        initialMode={isView || !nodeId ? 'view' : isEmpty ? 'empty' : 'form'}
      />
    )
  }

  if (
    search['node-id'] === '1049-277' ||
    search.nodeId === '1049:277' ||
    search['node-id'] === '1049-1250' ||
    search.nodeId === '1049:1250' ||
    search['node-id'] === '1049-1251' ||
    search.nodeId === '1049:1251' ||
    search.tab === 'taxes' ||
    search.tab === 'tax-defaults'
  ) {
    return (
      <TaxDefaultsPage
        initialNodeId={search['node-id'] || search.nodeId || '1049-277'}
        initialSection="taxes"
      />
    )
  }

  if (
    search['node-id'] === '1009-6826' ||
    search.nodeId === '1009:6826' ||
    search['node-id'] === '1009-6827' ||
    search.nodeId === '1009:6827' ||
    search['node-id'] === '1009-6558' ||
    search.nodeId === '1009:6558' ||
    search['node-id'] === '1009-6944' ||
    search.nodeId === '1009:6944' ||
    search.tab === 'languages'
  ) {
    return (
      <LanguagesPage
        initialNodeId={search['node-id'] || search.nodeId || '1009-6826'}
        initialSection="languages"
        initialConfigureMode={true}
      />
    )
  }

  if (
    search['node-id'] === '1007-5992' ||
    search.nodeId === '1007:5992' ||
    search.tab === 'platform-settings' ||
    search.tab === 'business-details'
  ) {
    return (
      <BusinessDetailsPage initialNodeId={search['node-id'] || search.nodeId} />
    )
  }

  if (
    search['node-id'] === '965-1500' ||
    search.nodeId === '965:1500' ||
    search.tab === 'trouble'
  ) {
    return <AdminLoginPage initialView="trouble" />
  }

  if (
    search['node-id'] === '965-1410' ||
    search.nodeId === '965:1410' ||
    search.tab === 'login' ||
    search.tab === 'admin-login'
  ) {
    return <AdminLoginPage initialView="login" />
  }

  if (
    search.tab === 'Pricing & Markup' ||
    search.tab === 'pricing-markup' ||
    search.tab === 'markup' ||
    search['node-id'] === '713-23496' ||
    search.nodeId === '713:23496'
  ) {
    return (
      <AddEditMarkupRulePage
        initialRuleName={search.populated ? 'Flight Client Markup' : ''}
        initialService={search.populated ? 'Flight' : ''}
        initialValue={search.populated ? '3.5' : ''}
      />
    )
  }

  if (
    search['node-id'] === '975-3024' ||
    search.nodeId === '975:3024' ||
    search.tab === 'admin-users' ||
    search.tab === 'users'
  ) {
    return <AdminUsersPage />
  }

  if (
    search['node-id'] === '984-2269' ||
    search.nodeId === '984:2269' ||
    search['node-id'] === '990-2945' ||
    search.nodeId === '990:2945' ||
    search['node-id'] === '995-4126' ||
    search.nodeId === '995:4126' ||
    search.tab === 'customers' ||
    search.tab === 'b2c-customers'
  ) {
    const isCollapsed =
      search['node-id'] === '995-4126' || search.nodeId === '995:4126'
    const isDetails =
      isCollapsed ||
      search['node-id'] === '990-2945' ||
      search.nodeId === '990:2945'
    return (
      <B2CCustomersPage
        initialView={isDetails ? 'details' : 'list'}
        initialSidebarCollapsed={isCollapsed}
        initialSelectedCustomerId={isDetails ? 'cust-1' : null}
      />
    )
  }

  if (
    search['node-id'] === '1005-5341' ||
    search.nodeId === '1005:5341' ||
    search['node-id'] === '1005-5344' ||
    search.nodeId === '1005:5344'
  ) {
    return (
      <AdminReportsPage
        initialTab="bookings"
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  if (
    search['node-id'] === '1005-5346' ||
    search.nodeId === '1005:5346' ||
    search.tab === 'commissions'
  ) {
    return (
      <AdminReportsCommissionsPage
        initialTab="commissions"
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  if (
    search['node-id'] === '984-976' ||
    search.nodeId === '984:976' ||
    search['node-id'] === '984-1859' ||
    search.nodeId === '984:1859' ||
    search.tab === 'roles-permissions' ||
    search.tab === 'roles'
  ) {
    return (
      <AdminRolesPermissionsPage
        initialEditOpen={
          search['node-id'] === '984-1859' || search.nodeId === '984:1859'
        }
        initialNodeId={search['node-id'] || search.nodeId}
      />
    )
  }

  return (
    <AgentDashboardPage
      initialMenu={search.menu}
      initialTab={search.tab}
      initialPopulated={search.populated}
    />
  )
}

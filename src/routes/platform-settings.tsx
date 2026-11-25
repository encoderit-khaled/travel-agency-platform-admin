import { createFileRoute } from '@tanstack/react-router'
import {
  BusinessDetailsPage,
  CurrenciesExchangeRatesPage,
  CancellationPoliciesPage,
  LanguagesPage,
  TaxDefaultsPage,
} from '#/components/admin'

interface PlatformSettingsSearchParams {
  'node-id'?: string
  nodeId?: string
  section?: string
  edit?: boolean
}

export const Route = createFileRoute('/platform-settings')({
  validateSearch: (
    search: Record<string, unknown>,
  ): PlatformSettingsSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    return {
      'node-id': rawNodeId,
      nodeId: rawNodeId,
      section: typeof search.section === 'string' ? search.section : undefined,
      edit: search.edit === true || search.edit === 'true',
    }
  },
  component: PlatformSettingsRoute,
})

function PlatformSettingsRoute() {
  const search = Route.useSearch()
  const rawNodeId = search['node-id'] || search.nodeId

  const isLanguages =
    search.section === 'languages' ||
    rawNodeId === '1009-6558' ||
    rawNodeId === '1009:6558' ||
    rawNodeId === '1009-6826' ||
    rawNodeId === '1009:6826' ||
    rawNodeId === '1009-6827' ||
    rawNodeId === '1009:6827' ||
    rawNodeId === '1009-6944' ||
    rawNodeId === '1009:6944'

  const isCurrencies =
    search.section === 'currencies' ||
    search.section === 'exchange-rates' ||
    rawNodeId === '1015-7243' ||
    rawNodeId === '1015:7243' ||
    rawNodeId === '1015-7529' ||
    rawNodeId === '1015:7529' ||
    rawNodeId === '1015-7533' ||
    rawNodeId === '1015:7533' ||
    rawNodeId === '1015-7534' ||
    rawNodeId === '1015:7534' ||
    rawNodeId === '1015-7535' ||
    rawNodeId === '1015:7535' ||
    rawNodeId === '1015-7536' ||
    rawNodeId === '1015:7536' ||
    rawNodeId === '1022-7537' ||
    rawNodeId === '1022:7537'

  if (isCurrencies) {
    return (
      <CurrenciesExchangeRatesPage
        initialNodeId={
          rawNodeId ||
          (search.section === 'currencies' ? '1015-7243' : '1015-7535')
        }
        initialSection="currencies"
        initialEditMode={search.edit ? true : undefined}
      />
    )
  }

  const isCancellation =
    search.section === 'cancellation' ||
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
    rawNodeId === '1084:3798'

  if (isCancellation) {
    const isView =
      rawNodeId === '1084-3797' ||
      rawNodeId === '1084:3797' ||
      rawNodeId === '1084-3794' ||
      rawNodeId === '1084:3794'
    const isEmpty =
      rawNodeId === '1084-3525' ||
      rawNodeId === '1084:3525' ||
      rawNodeId === '1084-3526' ||
      rawNodeId === '1084:3526'

    return (
      <CancellationPoliciesPage
        initialNodeId={rawNodeId || '1084-3798'}
        initialSection="cancellation"
        initialMode={isView ? 'view' : isEmpty ? 'empty' : 'form'}
      />
    )
  }

  const isTaxDefaults =
    search.section === 'taxes' ||
    search.section === 'tax-defaults' ||
    rawNodeId === '1049-277' ||
    rawNodeId === '1049:277' ||
    rawNodeId === '1049-1250' ||
    rawNodeId === '1049:1250' ||
    rawNodeId === '1049-1251' ||
    rawNodeId === '1049:1251'

  if (isTaxDefaults) {
    const isView = rawNodeId === '1049-1251' || rawNodeId === '1049:1251'
    const isEmpty = rawNodeId === '1049-277' || rawNodeId === '1049:277'

    return (
      <TaxDefaultsPage
        initialNodeId={
          rawNodeId || (isView ? '1049-1251' : isEmpty ? '1049-277' : '1049-1250')
        }
        initialSection="taxes"
        initialMode={isView ? 'view' : isEmpty ? 'empty' : 'add'}
      />
    )
  }

  if (isLanguages) {
    const isConfigureMode =
      Boolean(search.edit) ||
      rawNodeId === '1009-6826' ||
      rawNodeId === '1009:6826' ||
      rawNodeId === '1009-6827' ||
      rawNodeId === '1009:6827' ||
      rawNodeId === '1009-6944' ||
      rawNodeId === '1009:6944'

    return (
      <LanguagesPage
        initialNodeId={rawNodeId || '1009-6826'}
        initialSection="languages"
        initialConfigureMode={isConfigureMode}
      />
    )
  }

  return (
    <BusinessDetailsPage
      initialNodeId={rawNodeId || '1007-5992'}
      initialSection={search.section || 'business-details'}
      initialEditOpen={Boolean(search.edit)}
    />
  )
}

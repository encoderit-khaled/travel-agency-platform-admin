import { createFileRoute } from '@tanstack/react-router'
import { SubAgentPermissionsPage } from '#/components/sub-agents'
import type { AccessPresetType } from '#/components/sub-agents'

interface SubAgentPermissionsSearchParams {
  desk?: string
  preset?: AccessPresetType
  modal?: 'discard' | 'save'
  'node-id'?: string
  nodeId?: string
}

export const Route = createFileRoute('/sub-agents/permissions')({
  validateSearch: (
    search: Record<string, unknown>,
  ): SubAgentPermissionsSearchParams => {
    const rawNodeId =
      typeof search['node-id'] === 'string'
        ? search['node-id']
        : typeof search.nodeId === 'string'
          ? search.nodeId
          : undefined

    const isNode3508 = rawNodeId === '689-3508' || rawNodeId === '689:3508'
    const isNode3510 =
      rawNodeId === '689-3510' ||
      rawNodeId === '689:3510' ||
      rawNodeId === '689-3505' ||
      rawNodeId === '689:3505'
    const isNode3507 = rawNodeId === '689-3507' || rawNodeId === '689:3507'

    const rawPreset = search.preset
    const preset: AccessPresetType =
      rawPreset === 'limited' ||
      rawPreset === 'custom' ||
      rawPreset === 'standard'
        ? rawPreset
        : isNode3508 || isNode3510 || isNode3507
          ? 'custom'
          : 'custom' // Default to custom permissions matching Figma #689:3507

    const rawModal = search.modal
    const modal: 'discard' | 'save' | undefined =
      rawModal === 'discard' || isNode3510
        ? 'discard'
        : rawModal === 'save' || isNode3508
          ? 'save'
          : undefined

    return {
      desk: typeof search.desk === 'string' ? search.desk : undefined,
      preset,
      modal,
      'node-id': rawNodeId,
      nodeId: rawNodeId,
    }
  },
  component: SubAgentPermissionsRoute,
})

function SubAgentPermissionsRoute() {
  const search = Route.useSearch()

  return (
    <SubAgentPermissionsPage
      deskName={
        search.desk
          ? search.desk.includes('Mirpur')
            ? search.desk
            : `${search.desk} Desk`
          : 'Mirpur Desk'
      }
      initialPreset={search.preset || 'custom'}
      initialModal={search.modal}
      initialUnsavedChanges={search.preset === 'custom' || !!search.modal}
    />
  )
}

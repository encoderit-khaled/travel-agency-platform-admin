import { createFileRoute } from '@tanstack/react-router'
import { B2CCustomersPage } from '#/components/admin'

export const Route = createFileRoute('/collapsed-sidebar')({
  component: CollapsedSidebarRoute,
})

function CollapsedSidebarRoute() {
  return (
    <B2CCustomersPage
      initialView="details"
      initialSidebarCollapsed={true}
    />
  )
}

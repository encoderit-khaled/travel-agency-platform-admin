import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardPage } from '#/components/admin'

export const Route = createFileRoute('/admin-dashboard')({
  component: AdminDashboardRoute,
})

function AdminDashboardRoute() {
  return <AdminDashboardPage />
}

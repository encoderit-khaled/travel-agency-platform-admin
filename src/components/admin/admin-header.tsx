import {
  Navbar,
  type NavbarBreadcrumbItem,
} from '#/components/ui/navbar'

export type BreadcrumbItem = NavbarBreadcrumbItem

export interface AdminHeaderProps {
  onToggleMobileMenu?: () => void
  onToggleSidebar?: () => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
  breadcrumbs?: BreadcrumbItem[]
  userName?: string
  userRole?: string
  agencyName?: string
  userInitials?: string
}

export function AdminHeader({
  onToggleMobileMenu,
  onToggleSidebar,
  searchQuery = '',
  onSearchChange,
  breadcrumbs,
  userName = 'Admin user',
  userRole = 'Reviewer · can decide',
  agencyName,
  userInitials = 'AD',
}: AdminHeaderProps) {
  return (
    <Navbar
      onToggleMobileMenu={onToggleMobileMenu}
      onToggleSidebar={onToggleSidebar}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search Admin Panel"
      breadcrumbs={breadcrumbs}
      userName={userName}
      userRole={userRole}
      agencyName={agencyName}
      userInitials={userInitials}
    />
  )
}

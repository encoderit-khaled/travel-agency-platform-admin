import * as React from 'react'
import {
  Navbar,
  type NavbarBreadcrumbItem,
  type NavbarNotificationItem,
} from '#/components/ui/navbar'

export interface AgentPortalHeaderProps {
  onToggleMobileMenu?: () => void
  onToggleSidebar?: () => void
  onToggleMobileSidebar?: () => void
  userName?: string
  agencyName?: string
  breadcrumbCurrent?: string
  searchQuery?: string
  onSearchChange?: (q: string) => void
  searchPlaceholder?: string
  breadcrumbs?: NavbarBreadcrumbItem[]
  initialMenu?: 'dropdown' | 'notifications'
  onOpenNotifications?: () => void
  onOpenProfile?: () => void
  notifications?: NavbarNotificationItem[]
}

export function AgentPortalHeader({
  onToggleMobileMenu,
  onToggleSidebar,
  onToggleMobileSidebar,
  breadcrumbCurrent,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search Admin Panel',
  breadcrumbs,
  initialMenu,
  onOpenNotifications,
  onOpenProfile,
  userName = 'Admin user',
  agencyName,
  notifications,
}: AgentPortalHeaderProps) {
  const computedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return breadcrumbs
    }
    return [
      { label: 'Dashboard', href: '#' },
      { label: breadcrumbCurrent || 'Sub-agents', active: true },
    ]
  }, [breadcrumbs, breadcrumbCurrent])

  return (
    <Navbar
      onToggleMobileMenu={onToggleMobileMenu}
      onToggleSidebar={onToggleSidebar}
      onToggleMobileSidebar={onToggleMobileSidebar}
      breadcrumbs={computedBreadcrumbs}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      userName={userName}
      userRole="Reviewer · can decide"
      agencyName={agencyName}
      userInitials="AD"
      initialMenu={initialMenu}
      onOpenNotifications={onOpenNotifications}
      onOpenProfile={onOpenProfile}
      notifications={notifications}
    />
  )
}

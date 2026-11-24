import * as React from 'react'
import {
  Search,
  Bell,
  LogOut,
  Settings,
  CreditCard,
  Building2,
  Users,
  CheckCircle2,
  Plane,
  Percent,
} from 'lucide-react'
import { Input } from '#/components/ui/input'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { Separator } from '#/components/ui/separator'
import { Badge } from '#/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '#/components/ui/dropdown-menu'
import { cn } from 'cn'

export interface NavbarBreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  active?: boolean
}

export interface NavbarNotificationItem {
  id: string
  title: string
  description: string
  time: string
  category?: 'booking' | 'wallet' | 'commission' | 'system'
  read: boolean
}

export interface NavbarProps {
  onToggleSidebar?: () => void
  onToggleMobileMenu?: () => void
  onToggleMobileSidebar?: () => void
  breadcrumbs?: NavbarBreadcrumbItem[]
  breadcrumbCurrent?: string
  searchQuery?: string
  onSearchChange?: (q: string) => void
  searchPlaceholder?: string
  userName?: string
  userRole?: string
  agencyName?: string
  userInitials?: string
  initialMenu?: 'dropdown' | 'notifications'
  notifications?: NavbarNotificationItem[]
  onOpenNotifications?: () => void
  onOpenProfile?: () => void
  className?: string
}

export function Navbar({
  onToggleSidebar,
  onToggleMobileMenu,
  onToggleMobileSidebar,
  breadcrumbs,
  breadcrumbCurrent,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search Admin Panel',
  userName = 'Admin user',
  userRole = 'Reviewer · can decide',
  agencyName,
  userInitials,
  initialMenu,
  notifications: initialNotifications,
  onOpenNotifications,
  onOpenProfile,
  className,
}: NavbarProps) {
  const handleToggleSidebar = React.useCallback(() => {
    if (onToggleSidebar) {
      onToggleSidebar()
    } else if (onToggleMobileSidebar) {
      onToggleMobileSidebar()
    } else if (onToggleMobileMenu) {
      onToggleMobileMenu()
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:toggle-sidebar'))
    }
  }, [onToggleSidebar, onToggleMobileSidebar, onToggleMobileMenu])

  const [notificationsOpen, setNotificationsOpen] = React.useState(
    initialMenu === 'notifications',
  )
  const [profileOpen, setProfileOpen] = React.useState(
    initialMenu === 'dropdown',
  )

  const [notifications, setNotifications] = React.useState<
    NavbarNotificationItem[]
  >(
    initialNotifications || [
      {
        id: 'notif-1',
        title: 'New Agent Application #AP-904',
        description: 'Skyline Demo Travels Ltd submitted partner verification.',
        time: '12 min ago',
        category: 'system',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Credit Line Request #CR-204',
        description: '$10,000 credit limit review pending admin approval.',
        time: '1 hour ago',
        category: 'wallet',
        read: false,
      },
      {
        id: 'notif-3',
        title: 'Commission Rule Updated',
        description: 'International flight tier 1 markup adjustment applied.',
        time: '3 hours ago',
        category: 'commission',
        read: true,
      },
    ],
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  React.useEffect(() => {
    if (initialMenu === 'dropdown') {
      setProfileOpen(true)
    } else if (initialMenu === 'notifications') {
      setNotificationsOpen(true)
    }
  }, [initialMenu])

  // Calculate initials
  const resolvedInitials = React.useMemo(() => {
    if (userInitials) return userInitials
    const nameToUse = userName || agencyName || 'Admin User'
    const words = nameToUse.trim().split(/\s+/)
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return nameToUse.slice(0, 2).toUpperCase()
  }, [userInitials, userName, agencyName])

  // Resolve breadcrumbs list
  const computedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return breadcrumbs
    }
    if (breadcrumbCurrent) {
      return [
        { label: 'Dashboard', href: '#' },
        { label: breadcrumbCurrent, active: true },
      ]
    }
    return [
      { label: 'Dashboard', href: '#' },
      { label: 'Agents', href: '#' },
      { label: 'Agent Applications', active: true },
    ]
  }, [breadcrumbs, breadcrumbCurrent])

  return (
    <header
      data-slot="navbar"
      className={cn(
        'h-14 sm:h-17 shrink-0 bg-white border-b border-[#DCE2EB] px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 shadow-2xs',
        className,
      )}
    >
      {/* Left: Sidebar Trigger + Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <SidebarTrigger
          onClick={handleToggleSidebar}
          className="text-[#012A5E] hover:bg-[#F4F6FA] border border-[#DCE2EB] rounded-lg size-8.5 shrink-0 cursor-pointer shadow-2xs"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        />

        {/* Breadcrumb nav matching Image 2 */}
        <Breadcrumb className="overflow-hidden min-w-0">
          <BreadcrumbList className="flex-nowrap gap-1 sm:gap-1.5 text-xs sm:text-sm">
            {computedBreadcrumbs.map((item, index) => {
              const isLast = index === computedBreadcrumbs.length - 1
              const isActive = isLast || item.active

              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden md:block">
                      /
                    </BreadcrumbSeparator>
                  )}
                  <BreadcrumbItem
                    className={cn(
                      !isLast && 'hidden md:inline-flex',
                      'min-w-0',
                    )}
                  >
                    {isActive ? (
                      <BreadcrumbPage
                        className="text-[#141C2E] font-bold truncate block max-w-[40vw] sm:max-w-72"
                        title={item.label}
                      >
                        {item.label}
                      </BreadcrumbPage>
                    ) : item.onClick ? (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="text-[#4F5B70] hover:text-[#012A5E] font-medium transition-colors hover:underline cursor-pointer whitespace-nowrap"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <BreadcrumbLink
                        href={item.href || '#'}
                        className="text-[#4F5B70] hover:text-[#012A5E] font-medium transition-colors whitespace-nowrap"
                      >
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Search + Notifications + Profile (Matching Image 2) */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Global Search on Right */}
        <div className="relative w-48 md:w-64 xl:w-80 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#7B7B7B] pointer-events-none" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 pl-9 pr-3 rounded-lg bg-[#F4F6FA] border-[#DCE2EB] text-sm placeholder:text-[#7B7B7B] focus-visible:bg-white focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]/30"
          />
        </div>

        {/* Notifications Icon Button with Dropdown */}
        <DropdownMenu
          open={notificationsOpen}
          onOpenChange={(open) => {
            setNotificationsOpen(open)
            if (open && onOpenNotifications) onOpenNotifications()
          }}
        >
          <DropdownMenuTrigger
            className="relative text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] rounded-lg size-10 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 size-2 bg-[#F1C134] rounded-full ring-2 ring-white" />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            sideOffset={8}
            align="end"
            className="w-[calc(100vw-1.5rem)] max-w-96 rounded-2xl p-3 sm:p-4 shadow-2xl border-[#DCE2EB] bg-white z-50"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-[#012A5E] text-sm">
                  Notifications
                </h4>
                {unreadCount > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-[#F1C134] text-[#001A3D] text-[10.5px] font-extrabold"
                  >
                    {unreadCount} New
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 text-[10.5px] font-bold"
                  >
                    Caught up
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-[#0267B8] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="py-2 divide-y divide-[#F1F5F9] max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5A6578]">
                  No notifications
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMarkAsRead(item.id)}
                    className={cn(
                      'py-2.5 flex items-start gap-3 p-2 rounded-xl transition-colors cursor-pointer group',
                      item.read
                        ? 'hover:bg-[#F4F6FA] opacity-80'
                        : 'bg-[#F4F8FD] hover:bg-[#EBF3FC]',
                    )}
                  >
                    <div
                      className={cn(
                        'size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        item.category === 'booking' &&
                          'bg-blue-50 text-[#0267B8]',
                        item.category === 'wallet' &&
                          'bg-emerald-50 text-emerald-600',
                        item.category === 'commission' &&
                          'bg-amber-50 text-amber-700',
                        item.category === 'system' &&
                          'bg-slate-100 text-[#012A5E]',
                      )}
                    >
                      {item.category === 'booking' && (
                        <Plane className="size-4" />
                      )}
                      {item.category === 'wallet' && (
                        <CreditCard className="size-4" />
                      )}
                      {item.category === 'commission' && (
                        <Percent className="size-4" />
                      )}
                      {item.category === 'system' && (
                        <CheckCircle2 className="size-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={cn(
                            'text-xs font-bold truncate',
                            item.read ? 'text-[#4F5B70]' : 'text-[#012A5E]',
                          )}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-[#94A3B8] shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Vertical Divider */}
        <Separator
          orientation="vertical"
          className="h-6 w-px bg-[#DCE2EB] hidden md:block"
        />

        {/* User Profile matching Image 2 with Dropdown */}
        <DropdownMenu
          open={profileOpen}
          onOpenChange={(open) => {
            setProfileOpen(open)
            if (open && onOpenProfile) onOpenProfile()
          }}
        >
          <DropdownMenuTrigger className="flex items-center gap-3 pl-1 text-left cursor-pointer outline-hidden group">
            <div className="size-9 rounded-full bg-[#012A5E] text-[#F1C134] font-extrabold text-xs flex items-center justify-center ring-2 ring-[#012A5E]/15 select-none shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {resolvedInitials}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-bold text-[#141C2E] leading-tight">
                {userName}
              </span>
              <span className="text-xs text-[#4F5B70] leading-tight flex items-center gap-1.5 font-medium mt-0.5">
                <span className="size-2 rounded-full border border-[#0267B8] shrink-0 inline-block" />
                {userRole}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            sideOffset={8}
            align="end"
            className="w-[min(16rem,calc(100vw-1.5rem))] rounded-2xl p-2 shadow-2xl border-[#DCE2EB] bg-white z-50"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-xs text-[#4F5B70] font-normal">Signed in as</p>
                <p className="text-sm font-extrabold text-[#012A5E] truncate">
                  {userName}
                </p>
                {agencyName && (
                  <p className="text-xs text-[#0267B8] font-semibold truncate mt-0.5">
                    {agencyName}
                  </p>
                )}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#F1F5F9]" />

            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#141C2E] hover:bg-[#F4F6FA] cursor-pointer">
                <Building2 className="size-4 text-[#4F5B70]" />
                <span>Agency Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#141C2E] hover:bg-[#F4F6FA] cursor-pointer">
                <Users className="size-4 text-[#4F5B70]" />
                <span>Roles & Permissions</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#141C2E] hover:bg-[#F4F6FA] cursor-pointer">
                <Settings className="size-4 text-[#4F5B70]" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-[#F1F5F9]" />
            <DropdownMenuItem className="gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer">
              <LogOut className="size-4 text-rose-600" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

import * as React from 'react'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  Building2,
  LogOut,
  CreditCard,
  Settings,
  CheckCircle2,
  Clock,
  Users,
  Percent,
  LifeBuoy,
  FileText,
  Sparkles,
  Plane,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
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

interface AgentPortalHeaderProps {
  onToggleMobileMenu?: () => void
  onToggleSidebar?: () => void
  onToggleMobileSidebar?: () => void
  userName?: string
  agencyName?: string
  breadcrumbCurrent?: string
  searchQuery?: string
  onSearchChange?: (q: string) => void
  breadcrumbs?: { label: string; active?: boolean }[]
  initialMenu?: 'dropdown' | 'notifications'
  onOpenNotifications?: () => void
  onOpenProfile?: () => void
}

export function AgentPortalHeader({
  onToggleMobileMenu,
  onToggleSidebar,
  onToggleMobileSidebar,
  breadcrumbCurrent,
  searchQuery = '',
  onSearchChange,
  breadcrumbs,
  initialMenu,
  onOpenNotifications: _onOpenNotifications,
  onOpenProfile: _onOpenProfile,
  userName: _userName,
  agencyName: _agencyName,
}: AgentPortalHeaderProps) {
  const toggleMenu =
    onToggleMobileSidebar || onToggleMobileMenu || onToggleSidebar
  const computedBreadcrumbs = breadcrumbs || [
    { label: 'Agent Portal', active: false },
    { label: breadcrumbCurrent || 'Dashboard', active: true },
  ]
  const [notificationsOpen, setNotificationsOpen] = React.useState(
    initialMenu === 'notifications',
  )
  const [profileOpen, setProfileOpen] = React.useState(
    initialMenu === 'dropdown',
  )

  const [notifications, setNotifications] = React.useState([
    {
      id: 'notif-1',
      title: 'Booking Confirmed #AW-2026-904',
      description:
        'Dhaka (DAC) → Dubai (DXB) flight ticket issued for 2 passengers.',
      time: '12 min ago',
      category: 'booking',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Wallet Credit Approved',
      description:
        '$5,000.00 top-up recorded for Skyline Demo Travels Ltd account.',
      time: '1 hour ago',
      category: 'wallet',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Commission Recorded',
      description:
        'Commission of $142.50 recorded for B2B booking #AW-2026-880.',
      time: '3 hours ago',
      category: 'commission',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'Partner Registration Approved',
      description:
        'Skyline Demo Travels Ltd is now fully activated on the B2B Agent Portal.',
      time: 'Yesterday',
      category: 'system',
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  React.useEffect(() => {
    if (initialMenu === 'dropdown') {
      setProfileOpen(true)
    } else if (initialMenu === 'notifications') {
      setNotificationsOpen(true)
    }
  }, [initialMenu])

  return (
    <header className="h-17 shrink-0 bg-white border-b border-[#DCE2EB] px-4 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile menu & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {toggleMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="lg:hidden text-[#012A5E] hover:bg-[#F4F6FA] shrink-0"
            aria-label="Open Navigation"
          >
            <Menu className="size-5" />
          </Button>
        )}

        {/* Breadcrumb nav matching Figma #660:5817 */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {computedBreadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span className="text-[#94A3B8] font-normal">/</span>}
              <span
                className={cn(
                  'truncate',
                  crumb.active
                    ? 'text-[#012A5E] font-bold'
                    : 'text-[#0267B8] hover:text-[#012A5E] transition-colors',
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center: Search input matching Figma #665:7374 */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#4F5B70]" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search Agent Portal (bookings, sub-agents, flights...)"
            className="w-full pl-9 pr-4 py-2 bg-[#F4F6FA] border-[#DCE2EB] rounded-xl text-xs sm:text-sm text-[#012A5E] placeholder:text-[#4F5B70] focus-visible:bg-white focus-visible:ring-[#0267B8]/20 focus-visible:border-[#0267B8]"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile Menus (Using Reusable shadcn DropdownMenu) */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Notifications Dropdown (Figma #660:5834 & #660:5854) */}
        <DropdownMenu
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        >
          <DropdownMenuTrigger
            className={cn(
              'relative size-10 rounded-xl flex items-center justify-center transition-colors border cursor-pointer',
              notificationsOpen
                ? 'bg-[#EBF3FC] text-[#0267B8] border-[#0267B8]/30 shadow-xs'
                : 'text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] border-[#DCE2EB] bg-white',
            )}
            aria-label="Notifications"
          >
            <Bell className="size-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#F1C134] text-[10px] font-extrabold text-[#001A3D] ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            sideOffset={8}
            align="end"
            className="w-80 sm:w-96 rounded-2xl p-4 shadow-2xl border-[#DCE2EB]"
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
                        {!item.read && (
                          <span className="size-2 rounded-full bg-[#0267B8] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#4F5B70] mt-0.5 leading-snug">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-[#8EAECF]">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" /> {item.time}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDismiss(item.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#5A6578] transition-opacity"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[#F1F5F9] text-center">
              <a
                href="#c-att"
                onClick={() => setNotificationsOpen(false)}
                className="text-xs font-bold text-[#0267B8] hover:underline"
              >
                View All Notifications
              </a>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reusable shadcn DropdownMenu: Profile Menu (Figma #660:5838 & #660:5853) */}
        <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
          <DropdownMenuTrigger
            className={cn(
              'flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border transition-all text-left cursor-pointer outline-none',
              profileOpen
                ? 'bg-[#F4F6FA] border-[#0267B8]/40 shadow-xs ring-2 ring-[#0267B8]/15'
                : 'bg-white hover:bg-[#F4F6FA] border-[#DCE2EB]',
            )}
            aria-label="Agent Profile"
          >
            {/* Avatar Initials #660:5839 */}
            <div className="size-8 rounded-lg bg-linear-to-tr from-[#012A5E] to-[#0267B8] text-[#F1C134] font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0 select-none">
              SD
            </div>

            {/* Business info #660:5841 */}
            <div className="hidden sm:flex flex-col min-w-0 pr-1">
              <span className="text-xs font-extrabold text-[#012A5E] leading-tight truncate max-w-37.5">
                Skyline Demo Travels Ltd
              </span>
              <span className="text-[10px] text-[#4F5B70] font-medium leading-tight truncate">
                Nusrat Jahan · Agent Owner
              </span>
            </div>

            <ChevronDown
              className={cn(
                'size-4 text-[#4F5B70] transition-transform duration-200 shrink-0',
                profileOpen && 'rotate-180 text-[#012A5E]',
              )}
            />
          </DropdownMenuTrigger>

          {/* Figma #660:5853 - Agent Dashboard Dropdown Menu */}
          <DropdownMenuContent
            sideOffset={8}
            align="end"
            className="w-80 rounded-2xl p-2 shadow-2xl border-[#DCE2EB] bg-white text-[#141C2E]"
          >
            {/* Header User/Agency Profile Section */}
            <div className="p-3 bg-linear-to-br from-[#F4F6FA] to-white rounded-xl border border-[#DCE2EB]/70 mb-1">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-linear-to-tr from-[#012A5E] to-[#0267B8] text-[#F1C134] font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                  SD
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-[#012A5E] leading-tight truncate">
                    Skyline Demo Travels Ltd
                  </p>
                  <p className="text-[11px] text-[#4F5B70] truncate">
                    nusrat.jahan@example.com
                  </p>
                  <p className="text-[10px] text-[#8EAECF] font-semibold mt-0.5">
                    Agent ID: AG-84920 · B2B Portal
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#DCE2EB]/60 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                  <ShieldCheck className="size-3" /> Verified Partner
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F1C134]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#012A5E] border border-[#F1C134]/30">
                  <Sparkles className="size-2.5 text-[#012A5E]" /> Owner
                </span>
              </div>
            </div>

            {/* Menu Group 1: Agency Management */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] px-2 py-1">
                Agency Management
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setProfileOpen(false)
                  window.location.href = '/roles-access'
                }}
                className="cursor-pointer"
              >
                <ShieldCheck className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Roles & Access</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setProfileOpen(false)
                  window.location.href = '/roles-access'
                }}
                className="cursor-pointer"
              >
                <Building2 className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Agency Profile & Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setProfileOpen(false)
                  window.location.href = '/sub-agents'
                }}
                className="cursor-pointer"
              >
                <Users className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Team & Sub-agents</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setProfileOpen(false)
                  window.location.href = '/pricing-markup'
                }}
                className="cursor-pointer"
              >
                <Percent className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Pricing & Markup Rules</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setProfileOpen(false)
                  window.location.href = '/wallet-ledger'
                }}
                className="cursor-pointer"
              >
                <CreditCard className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Wallet Ledger & Credit Facility</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Menu Group 2: Preferences & Support */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] px-2 py-1">
                Preferences & Help
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setProfileOpen(false)}
                className="cursor-pointer"
              >
                <Settings className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setProfileOpen(false)}
                className="cursor-pointer"
              >
                <FileText className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Account Statements</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setProfileOpen(false)}
                className="cursor-pointer"
              >
                <LifeBuoy className="size-4 text-[#4F5B70]" />
                <span className="flex-1">Help & Agent Support Desk</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Sign Out Action */}
            <DropdownMenuItem
              onClick={() => setProfileOpen(false)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            >
              <LogOut className="size-4 text-red-500" />
              <span className="font-bold">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

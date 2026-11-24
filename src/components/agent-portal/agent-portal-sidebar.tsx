import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  Users,
  Network,
  Percent,
  Wallet,
  CreditCard,
  Coins,
  FileText,
  BarChart3,
  Bell,
  Settings,
  X,
} from 'lucide-react'
import { cn } from 'cn'
import { SidebarContext } from '#/components/ui/sidebar'

export interface AgentPortalSidebarProps {
  currentTab?: string
  currentActive?: string
  className?: string
  mobileOpen?: boolean
  onCloseMobile?: () => void
  onMobileClose?: () => void
  onSelectNav?: (label: string) => void
  activePath?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function AgentPortalSidebar({
  currentTab,
  currentActive,
  className,
  mobileOpen,
  onCloseMobile,
  onMobileClose,
  onSelectNav,
  activePath,
  collapsed,
  onToggleCollapse,
}: AgentPortalSidebarProps) {
  const sidebarContext = React.useContext(SidebarContext)

  const [internalCollapsed, setInternalCollapsed] = React.useState<boolean>(
    () => {
      if (typeof window !== 'undefined') {
        try {
          const match = document.cookie.match(/sidebar_collapsed=([^;]+)/)
          if (match) return match[1] === 'true'
          return localStorage.getItem('sidebar_collapsed') === 'true'
        } catch {
          return false
        }
      }
      return false
    },
  )

  const [internalMobileOpen, setInternalMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const handleToggleEvent = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setInternalMobileOpen((prev) => !prev)
      } else {
        setInternalCollapsed((prev) => {
          const next = !prev
          try {
            localStorage.setItem('sidebar_collapsed', String(next))
            document.cookie = `sidebar_collapsed=${next}; path=/; max-age=604800`
          } catch {}
          return next
        })
      }
    }

    window.addEventListener('app:toggle-sidebar', handleToggleEvent)
    return () =>
      window.removeEventListener('app:toggle-sidebar', handleToggleEvent)
  }, [])

  const isCollapsed =
    collapsed !== undefined
      ? collapsed
      : sidebarContext
        ? !sidebarContext.open
        : internalCollapsed

  const isMobileOpen =
    mobileOpen !== undefined
      ? mobileOpen
      : sidebarContext
        ? sidebarContext.openMobile
        : internalMobileOpen

  const closeMobile = React.useCallback(() => {
    if (onCloseMobile) onCloseMobile()
    if (onMobileClose) onMobileClose()
    if (sidebarContext) sidebarContext.setOpenMobile(false)
    setInternalMobileOpen(false)
  }, [onCloseMobile, onMobileClose, sidebarContext])

  // Close the mobile drawer automatically when resizing up to desktop,
  // lock body scroll while it is open and allow closing with Escape.
  React.useEffect(() => {
    if (!isMobileOpen || typeof window === 'undefined') return

    // The drawer only exists below the lg breakpoint.
    if (window.innerWidth >= 1024) {
      closeMobile()
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobile()
    }
    const handleResize = () => {
      if (window.innerWidth >= 1024) closeMobile()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileOpen, closeMobile])

  const activeLabel = activePath
    ? activePath.includes('roles') || activePath.includes('account')
      ? 'Account / Settings'
      : activePath.includes('reports')
        ? 'Reports'
        : activePath.includes('commissions')
          ? 'Commissions'
          : activePath.includes('statement')
            ? 'Statements'
            : activePath.includes('credit')
              ? 'Credit'
              : activePath.includes('wallet')
                ? 'Wallet'
                : activePath.includes('pricing-markup')
                  ? 'Pricing & Markup'
                  : activePath.includes('bookings')
                    ? 'Bookings'
                    : activePath.includes('sub-agent')
                      ? 'Sub-agents'
                      : 'Dashboard'
    : currentActive || currentTab || 'Dashboard'

  const primaryNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Search & Book', icon: Search },
    { label: 'Bookings', icon: CalendarDays },
    { label: 'Customers', icon: Users },
    { label: 'Sub-agents', icon: Network },
    { label: 'Pricing & Markup', icon: Percent },
  ]

  const financialNavItems = [
    { label: 'Wallet', icon: Wallet },
    { label: 'Credit', icon: CreditCard },
    { label: 'Commissions', icon: Coins },
    { label: 'Statements', icon: FileText },
    { label: 'Reports', icon: BarChart3 },
  ]

  const secondaryNavItems = [
    { label: 'Notifications', icon: Bell },
    { label: 'Account / Settings', icon: Settings },
  ]

  const navigate = useNavigate()

  const handleNavClick = (label: string) => {
    onSelectNav?.(label)
    closeMobile()
    const pathMap: Record<string, string> = {
      'Sub-agents': '/sub-agents',
      'Pricing & Markup': '/pricing-markup',
      Bookings: '/bookings',
      Wallet: '/wallet',
      Statements: '/statements',
      Credit: '/credit',
      Commissions: '/commissions',
      Reports: '/reports',
      'Account / Settings': '/roles-access',
      Dashboard: '/',
    }
    const target = pathMap[label]
    if (target) {
      try {
        navigate({ to: target as any })
      } catch {
        window.location.href = target
      }
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#001A3D]/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'shrink-0 flex flex-col justify-between text-white select-none transition-all duration-200 ease-in-out',
          'bg-[#001A3D] bg-linear-to-b from-[#001A3D] via-[#012A5E] to-[#0F3F7D] [&_[data-slot=sidebar-inner]]:bg-transparent',
          className,
          isCollapsed && !isMobileOpen ? 'w-17' : 'w-64',
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 flex h-dvh w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:max-w-none lg:shadow-none lg:animate-none'
            : 'hidden lg:flex sticky top-0 h-screen',
        )}
        aria-label="Agent portal navigation"
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          {isCollapsed && !isMobileOpen ? (
            <div className="h-17 border-b border-white/10 flex items-center justify-center shrink-0">
              <a
                href="/"
                className="size-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title="AeroWing - Travel Partner Program"
                onClick={onToggleCollapse}
              >
                <img
                  src="/images/aerowing-icon.png"
                  alt="AeroWing"
                  className="size-7 object-contain"
                />
              </a>
            </div>
          ) : (
            <div className="p-4 border-b border-white/10 flex flex-col gap-2 shrink-0">
              <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-xs">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate({ to: '/' })
                  }}
                  className="flex items-center justify-center flex-1 transition-opacity hover:opacity-95"
                >
                  <img
                    src="/images/aerowing-logo.png"
                    alt="AeroWing — Explore, Book, Travel"
                    className="h-9 w-auto max-w-full object-contain"
                  />
                </a>

                {isMobileOpen && (
                  <button
                    type="button"
                    onClick={closeMobile}
                    className="p-1 -mr-1 rounded-md text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] transition-colors cursor-pointer shrink-0"
                    aria-label="Close navigation"
                  >
                    <X className="size-4.5" />
                  </button>
                )}
              </div>

              <div className="px-1 pt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-white/90 tracking-wide uppercase">
                  Agent Portal
                </span>
                <span className="text-[10px] font-semibold text-[#F1C134] bg-[#F1C134]/15 px-2 py-0.5 rounded-full border border-[#F1C134]/25">
                  Partner B2B
                </span>
              </div>
            </div>
          )}

          {/* Navigation Groups */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden">
            {/* Main sections */}
            <div className="space-y-0.5">
              {primaryNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeLabel === item.label
                return (
                  <button
                    key={item.label}
                    type="button"
                    title={item.label}
                    onClick={() => handleNavClick(item.label)}
                    className={cn(
                      'w-full flex items-center rounded-xl text-sm font-semibold transition-all cursor-pointer',
                      isCollapsed && !isMobileOpen
                        ? 'justify-center p-2.5'
                        : 'gap-3 px-3 py-2.5 text-left',
                      isActive
                        ? 'bg-white/12 text-white shadow-xs backdrop-blur-xs font-bold ring-1 ring-white/20'
                        : 'text-[#C9D7EA] hover:text-white hover:bg-white/6',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4.5 shrink-0',
                        isActive ? 'text-[#F1C134]' : 'text-[#C9D7EA]',
                      )}
                    />
                    {(!isCollapsed || isMobileOpen) && (
                      <span>{item.label}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Separator */}
            <div className="py-2">
              <div
                className={cn(
                  'h-px bg-white/10',
                  isCollapsed && !isMobileOpen ? 'w-8 mx-auto' : 'w-full',
                )}
              />
            </div>

            {/* Financial & Management */}
            <div className="space-y-0.5">
              {financialNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeLabel === item.label
                return (
                  <button
                    key={item.label}
                    type="button"
                    title={item.label}
                    onClick={() => handleNavClick(item.label)}
                    className={cn(
                      'w-full flex items-center rounded-xl text-sm font-semibold transition-all cursor-pointer',
                      isCollapsed && !isMobileOpen
                        ? 'justify-center p-2.5'
                        : 'gap-3 px-3 py-2.5 text-left',
                      isActive
                        ? 'bg-white/12 text-white shadow-xs backdrop-blur-xs font-bold ring-1 ring-white/20'
                        : 'text-[#C9D7EA] hover:text-white hover:bg-white/6',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4.5 shrink-0',
                        isActive ? 'text-[#F1C134]' : 'text-[#C9D7EA]',
                      )}
                    />
                    {(!isCollapsed || isMobileOpen) && (
                      <span>{item.label}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Separator */}
            <div className="py-2">
              <div
                className={cn(
                  'h-px bg-white/10',
                  isCollapsed && !isMobileOpen ? 'w-8 mx-auto' : 'w-full',
                )}
              />
            </div>

            {/* Utilities */}
            <div className="space-y-0.5">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeLabel === item.label
                return (
                  <button
                    key={item.label}
                    type="button"
                    title={item.label}
                    onClick={() => handleNavClick(item.label)}
                    className={cn(
                      'w-full flex items-center rounded-xl text-sm font-semibold transition-all cursor-pointer',
                      isCollapsed && !isMobileOpen
                        ? 'justify-center p-2.5'
                        : 'gap-3 px-3 py-2.5 text-left',
                      isActive
                        ? 'bg-white/12 text-white shadow-xs backdrop-blur-xs font-bold ring-1 ring-white/20'
                        : 'text-[#C9D7EA] hover:text-white hover:bg-white/6',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4.5 shrink-0',
                        isActive ? 'text-[#F1C134]' : 'text-[#C9D7EA]',
                      )}
                    />
                    {(!isCollapsed || isMobileOpen) && (
                      <span>{item.label}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        {isCollapsed && !isMobileOpen ? (
          <div className="p-3 border-t border-white/10 bg-[#001430]/40 flex items-center justify-center shrink-0">
            <span
              className="text-[10px] font-bold text-[#8EAECF]"
              title="M2 · B2B Agent Portal"
            >
              M2
            </span>
          </div>
        ) : (
          <div className="p-4 border-t border-white/10 bg-[#001430]/40 flex flex-col gap-0.5 shrink-0">
            <span className="text-xs font-bold text-white tracking-wide">
              M2 · B2B Agent Portal
            </span>
            <span className="text-[11px] font-medium text-[#8EAECF] truncate">
              {activeLabel === 'Account / Settings' ||
              activeLabel === 'Roles & Access'
                ? 'M2.13 Roles & Access'
                : activeLabel === 'Credit'
                  ? 'M2.8 Credit Requests'
                  : activeLabel === 'Wallet'
                    ? 'M2.6 Wallet Ledger'
                    : activeLabel === 'Pricing & Markup'
                      ? 'M2.3 + M2.4 Pricing & Markup'
                      : activeLabel === 'Bookings'
                        ? 'M2.11 Booking History'
                        : currentTab === 'Sub-agents'
                          ? 'M2.2 Sub-agents'
                          : 'Agent Dashboard'}
            </span>
          </div>
        )}
      </aside>
    </>
  )
}

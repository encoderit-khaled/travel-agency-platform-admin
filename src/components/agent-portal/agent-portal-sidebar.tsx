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
  Plane,
  X,
} from 'lucide-react'
import { cn } from 'cn'

interface AgentPortalSidebarProps {
  currentTab?: string
  currentActive?: string
  className?: string
  mobileOpen?: boolean
  onCloseMobile?: () => void
  onMobileClose?: () => void
  onSelectNav?: (label: string) => void
  activePath?: string
}

export function AgentPortalSidebar({
  currentTab,
  currentActive,
  className,
  mobileOpen = false,
  onCloseMobile,
  onMobileClose,
  onSelectNav,
  activePath,
}: AgentPortalSidebarProps) {
  const closeMobile = onCloseMobile || onMobileClose
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

  const handleNavClick = (label: string) => {
    onSelectNav?.(label)
    closeMobile?.()
    if (label === 'Sub-agents') {
      window.location.href = '/sub-agents'
    } else if (label === 'Pricing & Markup') {
      window.location.href = '/pricing-markup'
    } else if (label === 'Bookings') {
      window.location.href = '/bookings'
    } else if (label === 'Wallet') {
      window.location.href = '/wallet'
    } else if (label === 'Statements') {
      window.location.href = '/statements'
    } else if (label === 'Credit') {
      window.location.href = '/credit'
    } else if (label === 'Commissions') {
      window.location.href = '/commissions'
    } else if (label === 'Reports') {
      window.location.href = '/reports'
    } else if (label === 'Account / Settings') {
      window.location.href = '/roles-access'
    } else if (label === 'Dashboard') {
      window.location.href = '/agent'
    }
  }

  return (
    <aside
      className={cn(
        'w-64 shrink-0 min-h-screen flex flex-col justify-between text-white select-none',
        'bg-gradient-to-b from-[#001A3D] via-[#012A5E] to-[#0F3F7D]',
        mobileOpen
          ? 'fixed inset-y-0 left-0 z-50 shadow-2xl flex'
          : 'hidden lg:flex',
        className,
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex flex-col gap-2 shrink-0">
          <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#012A5E] flex items-center justify-center text-[#F1C134] shadow-xs">
                <Plane className="size-4.5 rotate-[-45deg]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[#012A5E] text-base leading-none tracking-tight">
                  Aero<span className="text-[#0267B8]">Wing</span>
                </span>
                <span className="text-[10px] text-[#4F5B70] font-medium leading-tight">
                  Travel Partner Program
                </span>
              </div>
            </div>

            {closeMobile && (
              <button
                type="button"
                onClick={closeMobile}
                className="lg:hidden p-1 rounded-md text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] transition-colors"
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

        {/* Navigation Groups */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Main sections */}
          <div className="space-y-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeLabel === item.label
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer',
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
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Separator */}
          <div className="py-2">
            <div className="h-px bg-white/10 w-full" />
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
                  onClick={() => handleNavClick(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer',
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
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Separator */}
          <div className="py-2">
            <div className="h-px bg-white/10 w-full" />
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
                  onClick={() => handleNavClick(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer',
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
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Sidebar Footer matching Figma #703:16660 */}
      <div className="p-4 border-t border-white/10 bg-[#001430]/40 flex flex-col gap-0.5 shrink-0">
        <span className="text-xs font-bold text-white tracking-wide">
          M2 · B2B Agent Portal
        </span>
        <span className="text-[11px] font-medium text-[#8EAECF]">
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
    </aside>
  )
}

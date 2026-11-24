import type * as React from 'react'
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  Users,
  UserCheck,
  Tag,
  Wallet,
  CreditCard,
  Percent,
  FileText,
  BarChart3,
  Bell,
  Settings,
  X,
} from 'lucide-react'

interface AgentSidebarProps {
  activeNav?: string
  onNavClick?: (nav: string) => void
  unreadNotificationsCount?: number
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export function AgentSidebar({
  activeNav = 'dashboard',
  onNavClick,
  unreadNotificationsCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}: AgentSidebarProps) {
  const primaryNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search-book', label: 'Search & Book', icon: Search },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sub-agents', label: 'Sub-agents', icon: UserCheck },
    { id: 'pricing-markup', label: 'Pricing & Markup', icon: Tag },
  ]

  const financialNav = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'credit', label: 'Credit', icon: CreditCard },
    { id: 'commissions', label: 'Commissions', icon: Percent },
    { id: 'statements', label: 'Statements', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ]

  const accountNav = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge:
        unreadNotificationsCount > 0
          ? String(unreadNotificationsCount)
          : undefined,
    },
    { id: 'settings', label: 'Account / Settings', icon: Settings },
  ]

  const renderNavItem = (item: {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }) => {
    const Icon = item.icon
    const isActive = activeNav === item.id

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          onNavClick?.(item.id)
          onCloseMobile?.()
        }}
        className={`w-full flex items-center justify-between rounded-[10px] px-3 py-2.5 text-xs font-bold transition-all text-left group ${
          isActive
            ? 'bg-[#0267B8] text-white shadow-xs'
            : 'text-[#CAD5E2] hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon
            className={`size-[19px] shrink-0 transition-transform group-hover:scale-105 ${
              isActive ? 'text-white' : 'text-[#CAD5E2]'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </div>

        {item.badge && (
          <span className="rounded-full bg-[#F1C134] px-2 py-0.5 text-[10px] font-extrabold text-[#001A3D]">
            {item.badge}
          </span>
        )}
      </button>
    )
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#001A3D] text-white">
      {/* Top: Brand Header */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <img
              src="/images/aerowing-logo.png"
              alt="AeroWing Agent Portal"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <div className="mt-1 flex items-center gap-2">
              <span className="font-heading text-[10.5px] font-extrabold uppercase tracking-wider text-[#F1C134]">
                Agent Portal
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close Sidebar"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="px-2.5 py-3 space-y-1 flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Primary Operations */}
          <div className="space-y-0.5">{primaryNav.map(renderNavItem)}</div>

          {/* Separator div.sb-sep */}
          <div className="py-2 px-1.5">
            <div className="h-px w-full bg-white/10" />
          </div>

          {/* Financials & Reports */}
          <div className="space-y-0.5">{financialNav.map(renderNavItem)}</div>

          {/* Separator div.sb-sep */}
          <div className="py-2 px-1.5">
            <div className="h-px w-full bg-white/10" />
          </div>

          {/* Account & Notifications */}
          <div className="space-y-0.5">{accountNav.map(renderNavItem)}</div>
        </div>
      </div>

      {/* Footer Badge p.sb-f */}
      <div className="p-4 border-t border-white/10 bg-[#001430]/60 shrink-0">
        <div className="text-[11px] font-extrabold text-white">
          M2 · B2B Agent Portal
        </div>
        <div className="text-[11px] font-medium text-[#94A3B8]">
          Agent Dashboard
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar (width 256px) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40 border-r border-[#001430]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#001A3D]/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

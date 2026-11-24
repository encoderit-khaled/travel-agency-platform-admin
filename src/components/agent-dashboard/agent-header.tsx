import * as React from 'react'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  User,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { NotificationsDropdown } from './notifications-dropdown'
import type { AgentNotification, AgentProfile } from './types'

interface AgentHeaderProps {
  onToggleSidebar?: () => void
  profile: AgentProfile
  notifications: AgentNotification[]
  isNotificationsOpen: boolean
  onToggleNotifications: () => void
  onCloseNotifications: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearNotification: (id: string) => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
}

export function AgentHeader({
  onToggleSidebar,
  profile,
  notifications,
  isNotificationsOpen,
  onToggleNotifications,
  onCloseNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  searchQuery = '',
  onSearchChange,
}: AgentHeaderProps) {
  const [profileOpen, setProfileOpen] = React.useState(false)
  const profileMenuRef = React.useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close profile on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileOpen])

  return (
    <header className="h-17 shrink-0 bg-white border-b border-[#DCE2EB] px-4 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSidebar}
          className="size-11 rounded-[10px] border-[#DCE2EB] text-[#001A3D] hover:bg-[#F4F6FA] shrink-0"
          aria-label="Collapse navigation"
        >
          <Menu className="size-5" />
        </Button>

        {/* Breadcrumb nav matching Figma: Agent Portal / Dashboard */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <span className="font-bold text-[#0267B8] hover:underline cursor-pointer">
            Agent Portal
          </span>
          <span className="text-[#94A3B8]">/</span>
          <span className="font-bold text-[#141C2E]">Dashboard</span>
        </nav>
      </div>

      {/* Right: Search + Notifications Bell + Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Search input form#tb-s width 280px */}
        <div className="relative hidden md:block w-70">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#7A8699]" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search Admin Panel"
            className="h-10 pl-9 pr-3.5 rounded-xl border-[#DCE2EB] bg-white text-xs font-medium placeholder:text-[#7A8699] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
          />
        </div>

        {/* Notifications Popover Trigger button */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleNotifications}
            className={`relative size-11 rounded-[10px] border-[#DCE2EB] transition-colors ${
              isNotificationsOpen
                ? 'bg-[#EBF3FC] text-[#0267B8] border-[#0267B8]'
                : 'text-[#141C2E] hover:bg-[#F4F6FA]'
            }`}
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#F1C134] text-[10px] font-extrabold text-[#001A3D] ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Figma #660:5854: Agent Dashboard - Notifications Dropdown */}
          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={onCloseNotifications}
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onClearNotification={onClearNotification}
          />
        </div>

        {/* Profile Menu button menu#pf-btn */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl border border-transparent p-1.5 hover:bg-[#F4F6FA] hover:border-[#DCE2EB] transition-all text-left"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            {/* Avatar span#pf-av: 38x38 Midnight Blue with Saffron Initials */}
            <div className="flex size-9.5 items-center justify-center rounded-xl bg-[#001A3D] text-sm font-extrabold text-[#F1C134] shadow-xs shrink-0">
              {profile.initials}
            </div>

            {/* Profile labels */}
            <div className="hidden sm:flex flex-col min-w-0 pr-1">
              <span className="font-heading text-xs font-bold text-[#141C2E] truncate max-w-42.5">
                {profile.businessName}
              </span>
              <span className="text-[11px] font-bold text-[#5A6578] truncate">
                {profile.ownerName} · {profile.role}
              </span>
            </div>

            <ChevronDown
              className={`size-4 text-[#5A6578] transition-transform duration-200 ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-[#DCE2EB] bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
              <div className="border-b border-[#EEF2F6] px-3 py-2.5 mb-1">
                <div className="font-heading text-xs font-bold text-[#141C2E]">
                  {profile.businessName}
                </div>
                <div className="text-[11px] text-[#5A6578]">
                  {profile.email}
                </div>
                {profile.isDemo && (
                  <span className="mt-1.5 inline-block rounded-md bg-[#FEF7E6] border border-[#F1C134]/30 px-2 py-0.5 text-[10px] font-extrabold text-[#94670D]">
                    QA DEMO ACCOUNT
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#141C2E] hover:bg-[#F4F6FA] transition-colors"
                >
                  <User className="size-4 text-[#5A6578]" />
                  <span>Agent Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#141C2E] hover:bg-[#F4F6FA] transition-colors"
                >
                  <Settings className="size-4 text-[#5A6578]" />
                  <span>Account Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#141C2E] hover:bg-[#F4F6FA] transition-colors"
                >
                  <Shield className="size-4 text-[#5A6578]" />
                  <span>Security & Roles</span>
                </button>
              </div>

              <div className="border-t border-[#EEF2F6] mt-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#C5221F] hover:bg-[#FDEDEC] transition-colors"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

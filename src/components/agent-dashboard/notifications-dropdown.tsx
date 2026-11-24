import * as React from 'react'
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plane,
  Wallet,
  Percent,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import type { AgentNotification, NotificationCategory } from './types'

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
  notifications: AgentNotification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearNotification: (id: string) => void
}

export function NotificationsDropdown({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
}: NotificationsDropdownProps) {
  const [filter, setFilter] = React.useState<NotificationCategory>('all')
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredList = notifications.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'system') return item.category === 'system'
    return item.category === filter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const getCategoryIcon = (category: AgentNotification['category']) => {
    switch (category) {
      case 'booking':
        return <Plane className="size-4 text-[#0267B8]" />
      case 'wallet':
        return <Wallet className="size-4 text-[#00875A]" />
      case 'commission':
        return <Percent className="size-4 text-[#F1C134]" />
      case 'system':
      default:
        return <ShieldCheck className="size-4 text-[#012A5E]" />
    }
  }

  const getCategoryBg = (category: AgentNotification['category']) => {
    switch (category) {
      case 'booking':
        return 'bg-[#EBF3FC]'
      case 'wallet':
        return 'bg-[#EDF7EE]'
      case 'commission':
        return 'bg-[#FEF7E6]'
      case 'system':
      default:
        return 'bg-[#EAF0F8]'
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-[calc(100%+8px)] z-50 w-[380px] sm:w-[420px] rounded-2xl border border-[#DCE2EB] bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden"
      role="dialog"
      aria-label="Notifications Dropdown"
    >
      {/* Arrow Indicator */}
      <div className="absolute right-6 -top-2 size-4 rotate-45 border-l border-t border-[#DCE2EB] bg-white" />

      {/* Header */}
      <div className="relative border-b border-[#EEF2F6] px-5 py-4 bg-[#F8FAFD]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#001A3D] text-[#F1C134]">
              <Bell className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm font-bold text-[#141C2E]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#F1C134] px-2 py-0.5 text-[10px] font-extrabold text-[#001A3D]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#5A6578]">
                Real-time updates for your agent account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-[#0267B8] hover:bg-[#EBF3FC] transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-[#5A6578] hover:bg-[#EEF2F6] hover:text-[#141C2E] transition-colors"
              aria-label="Close notifications"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'booking', label: 'Bookings' },
              { id: 'wallet', label: 'Wallet' },
              { id: 'commission', label: 'Commissions' },
              { id: 'system', label: 'System' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                filter === t.id
                  ? 'bg-[#001A3D] text-white shadow-xs'
                  : 'bg-white text-[#5A6578] border border-[#DCE2EB] hover:bg-[#F4F6FA] hover:text-[#141C2E]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F1F5F9] overscroll-contain">
        {filteredList.length === 0 ? (
          <div className="py-12 text-center px-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#F4F6FA] text-[#94A3B8] mb-2.5">
              <CheckCircle2 className="size-6 text-[#00875A]" />
            </div>
            <p className="text-xs font-bold text-[#141C2E]">All caught up!</p>
            <p className="text-[11px] text-[#5A6578] mt-0.5">
              No notifications matching this filter.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className={`group relative flex items-start gap-3 px-5 py-3.5 transition-colors ${
                item.read
                  ? 'bg-white hover:bg-[#F8FAFD]'
                  : 'bg-[#F4F8FD] hover:bg-[#EBF3FC]/70'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${getCategoryBg(
                  item.category,
                )}`}
              >
                {getCategoryIcon(item.category)}
              </div>

              {/* Text content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs font-bold truncate ${
                      item.read ? 'text-[#141C2E]' : 'text-[#001A3D]'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="shrink-0 text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <Clock className="size-3" />
                    {item.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#5A6578] leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom Actions */}
                <div className="mt-2 flex items-center gap-3">
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => onMarkAsRead(item.id)}
                      className="text-[11px] font-bold text-[#0267B8] hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onClearNotification(item.id)}
                    className="text-[11px] text-[#94A3B8] hover:text-[#5A6578]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Unread dot */}
              {!item.read && (
                <span
                  className="size-2 shrink-0 rounded-full bg-[#0267B8] mt-1.5 ring-2 ring-white"
                  title="Unread notification"
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#EEF2F6] bg-[#F8FAFD] px-5 py-3 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#5A6578] flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-[#F1C134]" />
          <span>AeroWing Agent Alerts</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-bold text-[#0267B8] hover:underline flex items-center gap-1"
        >
          <span>View all in Notifications</span>
          <ExternalLink className="size-3" />
        </button>
      </div>
    </div>
  )
}

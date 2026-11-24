import * as React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { AgentHeader } from './agent-header'
import { AgentSidebar } from './agent-sidebar'
import { QuickSearchSection } from './quick-search-section'
import { DashboardKpiCards } from './dashboard-kpi-cards'
import { DashboardGridCards } from './dashboard-grid-cards'
import { AgentFooter } from './agent-footer'
import {
  CURRENT_AGENT_PROFILE,
  DASHBOARD_METRICS,
  INITIAL_NOTIFICATIONS,
} from './data'
import type { AgentNotification, TravelServiceId } from './types'

interface AgentDashboardPageProps {
  initialNotificationsOpen?: boolean
  initialService?: TravelServiceId
}

export function AgentDashboardPage({
  initialNotificationsOpen = false,
  initialService = 'flights',
}: AgentDashboardPageProps) {
  const [activeNav, setActiveNav] = React.useState('dashboard')
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(
    initialNotificationsOpen,
  )
  const [selectedService, setSelectedService] =
    React.useState<TravelServiceId>(initialService)
  const [notifications, setNotifications] = React.useState<AgentNotification[]>(
    INITIAL_NOTIFICATIONS,
  )
  const [searchQuery, setSearchQuery] = React.useState('')

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Action handlers
  const handleStartBooking = (serviceId?: TravelServiceId) => {
    const service = serviceId || selectedService
    alert(`Opening new booking workflow for service: ${service.toUpperCase()}`)
  }

  const handleTopUpWallet = () => {
    alert('Opening Wallet Top-up dialog')
  }

  const handleRequestCredit = () => {
    alert('Opening Credit Request facility dialog')
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex">
      {/* Sidebar - Desktop persistent, Mobile drawer */}
      <AgentSidebar
        activeNav={activeNav}
        onNavClick={setActiveNav}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Search, Notifications Popover, Profile Dropdown */}
        <AgentHeader
          profile={CURRENT_AGENT_PROFILE}
          notifications={notifications}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
          onCloseNotifications={() => setIsNotificationsOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearNotification={handleClearNotification}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Page Shell */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome / Hero Section (Figma section #660:5273) */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0267B8]">
                Agent Portal · Dashboard
              </p>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#001A3D]">
                Welcome back
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="font-heading text-sm sm:text-base font-extrabold text-[#141C2E]">
                  {CURRENT_AGENT_PROFILE.businessName}
                </span>
                <span className="rounded-md border border-[#F1C134]/40 bg-[#FEF7E6] px-2 py-0.5 text-[10px] font-extrabold text-[#94670D] tracking-wide">
                  QA DEMO DATA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5A6578] max-w-xl">
                Manage bookings, sub-agents, wallet balance, and commissions in
                one place.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1">
              <Button
                type="button"
                onClick={() => handleStartBooking(selectedService)}
                className="h-12 px-6 rounded-[10px] bg-[#F1C134] hover:bg-[#F3C94D] text-[#001A3D] font-extrabold text-xs shadow-md transition-all active:scale-95 gap-2"
              >
                <Plus className="size-4 stroke-[3]" />
                <span>New Booking</span>
              </Button>
              <span className="text-[11px] font-medium text-[#5A6578]">
                Book on behalf of a customer
              </span>
            </div>
          </section>

          {/* Quick Search Service Picker (Figma section #660:5298) */}
          <QuickSearchSection
            selectedService={selectedService}
            onSelectService={setSelectedService}
            onStartBooking={handleStartBooking}
          />

          {/* Business Summary KPI Cards (Figma Business summary #660:5365) */}
          <DashboardKpiCards
            metrics={DASHBOARD_METRICS}
            onViewWallet={() => setActiveNav('wallet')}
            onViewCredit={() => setActiveNav('credit')}
            onViewCommissions={() => setActiveNav('commissions')}
            onViewBookings={() => setActiveNav('bookings')}
          />

          {/* 3-Column Grid Cards (Recent Bookings, Needs Attention, Wallet, Credit, Commission, Markup, Sub-agents, Statements, Reports) */}
          <DashboardGridCards
            onStartBooking={() => handleStartBooking(selectedService)}
            onViewNotifications={() => setIsNotificationsOpen(true)}
            onTopUpWallet={handleTopUpWallet}
            onViewLedger={() => setActiveNav('wallet')}
            onRequestCredit={handleRequestCredit}
            onViewCommissions={() => setActiveNav('commissions')}
            onManageMarkup={() => setActiveNav('pricing-markup')}
            onManageSubAgents={() => setActiveNav('sub-agents')}
            onViewStatements={() => setActiveNav('statements')}
            onOpenReport={(reportId) => alert(`Opening ${reportId} report`)}
          />
        </main>

        {/* Footer */}
        <AgentFooter />
      </div>
    </div>
  )
}

import * as React from 'react'
import {
  UserPlus,
  ArrowRight,
  Wallet,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { SubAgentsKPICards } from './sub-agents-kpi-cards'
import { SubAgentsTable } from './sub-agents-table'
import { AddSubAgentDialog } from './add-sub-agent-dialog'
import { ViewPermissionsDialog } from './view-permissions-dialog'
import { ViewMarkupDialog } from './view-markup-dialog'
import { ViewBookingsDialog } from './view-bookings-dialog'
import { SubAgentDetailsDialog } from './sub-agent-details-dialog'
import { DeactivateSubAgentDialog } from './deactivate-sub-agent-dialog'
import { INITIAL_SUB_AGENTS } from './data'
import type {
  SubAgent,
  SubAgentFilterStatus,
  SubAgentFilterBooking,
  SubAgentPermission,
  SubAgentMarkupRule,
} from './types'

interface SubAgentsPageProps {
  initialDropdownOpen?: boolean
  initialSearch?: string
  initialDeskId?: string
}

export function SubAgentsPage({
  initialDropdownOpen = false,
  initialSearch = '',
  initialDeskId,
}: SubAgentsPageProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [subAgents, setSubAgents] =
    React.useState<SubAgent[]>(INITIAL_SUB_AGENTS)

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileMenuOpen((prev) => !prev)
    } else {
      setSidebarCollapsed((prev) => !prev)
    }
  }

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [statusFilter, setStatusFilter] =
    React.useState<SubAgentFilterStatus>('all')
  const [bookingFilter, setBookingFilter] =
    React.useState<SubAgentFilterBooking>('all')

  // Dialog states
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [selectedSubAgent, setSelectedSubAgent] =
    React.useState<SubAgent | null>(null)
  const [isPermissionsOpen, setIsPermissionsOpen] = React.useState(false)
  const [isMarkupOpen, setIsMarkupOpen] = React.useState(false)
  const [isBookingsOpen, setIsBookingsOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isDeactivateOpen, setIsDeactivateOpen] = React.useState(false)

  // Success toast message
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Add SubAgent
  const handleAddSubAgent = (newSubAgent: SubAgent) => {
    setSubAgents((prev) => [newSubAgent, ...prev])
    showToast(`Sub-agent "${newSubAgent.name}" created successfully.`)
  }

  // Update Permissions
  const handleSavePermissions = (
    subAgentId: string,
    updatedPermissions: SubAgentPermission[],
  ) => {
    setSubAgents((prev) =>
      prev.map((sa) => {
        if (sa.id !== subAgentId) return sa
        const configured = updatedPermissions.some((p) => p.enabled)
        return {
          ...sa,
          permissions: updatedPermissions,
          permissionsConfigured: configured,
        }
      }),
    )
    showToast('Permissions updated successfully.')
  }

  // Update Markup
  const handleSaveMarkup = (
    subAgentId: string,
    updatedRules: SubAgentMarkupRule[],
  ) => {
    setSubAgents((prev) =>
      prev.map((sa) => {
        if (sa.id !== subAgentId) return sa
        return {
          ...sa,
          markupRules: updatedRules,
          markupConfigured: updatedRules.length > 0,
        }
      }),
    )
    showToast('Markup rules updated successfully.')
  }

  // Toggle Active / Suspended
  const handleToggleStatus = (subAgentId: string) => {
    setSubAgents((prev) =>
      prev.map((sa) => {
        if (sa.id !== subAgentId) return sa
        const newStatus = sa.status === 'active' ? 'suspended' : 'active'
        return { ...sa, status: newStatus }
      }),
    )
    const target = subAgents.find((sa) => sa.id === subAgentId)
    if (target) {
      const willBeActive = target.status !== 'active'
      showToast(
        willBeActive
          ? `Sub-agent "${target.name}" reactivated.`
          : `Sub-agent "${target.name}" suspended.`,
      )
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setBookingFilter('all')
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] text-[#141C2E] antialiased">
      {/* Sidebar: Desktop */}
      <AgentPortalSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        currentTab="Sub-agents"
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        className="hidden lg:flex"
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AgentPortalHeader
          onToggleSidebar={handleToggleSidebar}
          onToggleMobileMenu={handleToggleSidebar}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Sub-agents', active: true },
          ]}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Section: Page Header & Title */}
          <section className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-1">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#0267B8] uppercase tracking-wider">
                Agent Portal · M2.2 Sub-agents
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                Sub-agents
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#4F5B70] max-w-xl">
                Create and manage Sub-agents under your Aero Wing Agent account.
              </p>
            </div>

            {/* Action Button: Add Sub-agent */}
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
              <Button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#F1C134] text-[#012A5E] hover:bg-[#E5B52A] font-extrabold shadow-sm flex items-center justify-center gap-2 text-sm tracking-tight"
              >
                <UserPlus className="size-4.5" />
                <span>Add Sub-agent</span>
              </Button>
              <span className="text-[11.5px] font-bold text-[#8C9BAE]">
                Each Sub-agent gets their own login and permissions
              </span>
            </div>
          </section>

          {/* Aside Information Banner matching Figma #665:6844 */}
          <aside className="p-4 sm:p-5 rounded-2xl bg-[#EAF4FD] border border-[#CFE6FA] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-[#CFE6FA] text-[#0267B8] flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="size-5" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-sm font-extrabold text-[#012A5E]">
                  Sub-agents operate under your Agent account.
                </h2>
                <p className="text-xs text-[#4F5B70] leading-relaxed max-w-3xl">
                  They issue bookings against your agency’s wallet balance and
                  available credit lines, while applying sub-agent markup on top
                  of your agent rates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => showToast('Opening Agency Wallet...')}
                className="group flex items-center gap-1.5 text-xs font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-white/60"
              >
                <Wallet className="size-3.5" />
                <span>View Wallet</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => showToast('Opening Available Credit Line...')}
                className="group flex items-center gap-1.5 text-xs font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-white/60"
              >
                <CreditCard className="size-3.5" />
                <span>View Credit</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </aside>

          {/* KPI Summary Cards */}
          <SubAgentsKPICards
            subAgents={subAgents}
            onFilterStatusChange={(status) => setStatusFilter(status)}
            onFilterBookingChange={(bk) => setBookingFilter(bk)}
            onViewAllBookings={() => {
              setSelectedSubAgent(null)
              setIsBookingsOpen(true)
            }}
          />

          {/* Sub-agents Table */}
          <SubAgentsTable
            subAgents={subAgents}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            bookingFilter={bookingFilter}
            onBookingFilterChange={setBookingFilter}
            onClearFilters={handleClearFilters}
            initialDropdownOpen={initialDropdownOpen}
            dropdownSubAgentId={initialDeskId}
            onViewDetails={(sa) => {
              setSelectedSubAgent(sa)
              setIsDetailsOpen(true)
            }}
            onViewPermissions={(sa) => {
              setSelectedSubAgent(sa)
              setIsPermissionsOpen(true)
            }}
            onViewMarkup={(sa) => {
              setSelectedSubAgent(sa)
              setIsMarkupOpen(true)
            }}
            onViewBookings={(sa) => {
              setSelectedSubAgent(sa)
              setIsBookingsOpen(true)
            }}
            onToggleStatus={(sa) => {
              setSelectedSubAgent(sa)
              setIsDeactivateOpen(true)
            }}
          />
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AddSubAgentDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAddSubAgent={handleAddSubAgent}
      />

      <ViewPermissionsDialog
        open={isPermissionsOpen}
        onOpenChange={setIsPermissionsOpen}
        subAgent={selectedSubAgent}
        onSavePermissions={handleSavePermissions}
      />

      <ViewMarkupDialog
        open={isMarkupOpen}
        onOpenChange={setIsMarkupOpen}
        subAgent={selectedSubAgent}
        onSaveMarkup={handleSaveMarkup}
      />

      <ViewBookingsDialog
        open={isBookingsOpen}
        onOpenChange={setIsBookingsOpen}
        subAgent={selectedSubAgent}
        allSubAgents={subAgents}
      />

      <SubAgentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        subAgent={selectedSubAgent}
        onOpenPermissions={(sa) => {
          setSelectedSubAgent(sa)
          setIsPermissionsOpen(true)
        }}
        onOpenMarkup={(sa) => {
          setSelectedSubAgent(sa)
          setIsMarkupOpen(true)
        }}
        onOpenBookings={(sa) => {
          setSelectedSubAgent(sa)
          setIsBookingsOpen(true)
        }}
        onToggleStatus={(sa) => {
          setSelectedSubAgent(sa)
          setIsDeactivateOpen(true)
        }}
      />

      <DeactivateSubAgentDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        subAgent={selectedSubAgent}
        onConfirm={handleToggleStatus}
      />
    </div>
  )
}

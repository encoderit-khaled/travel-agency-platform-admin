import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Users,
  CalendarDays,
  Percent,
  ShieldCheck,
  Check,
  AlertCircle,
  Minus,
  ArrowRight,
  Plus,
  Search,
  X,
  Mail,
  Phone,
  Eye,
  Shield,
  Ticket,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { SubAgentActionDropdown } from './sub-agent-action-dropdown'
import { SubAgentDetailsDialog } from './sub-agent-details-dialog'
import { ViewPermissionsDialog } from './view-permissions-dialog'
import { ViewMarkupDialog } from './view-markup-dialog'
import { ViewBookingsDialog } from './view-bookings-dialog'
import { AddSubAgentDialog } from './add-sub-agent-dialog'
import { DeactivateSubAgentDialog } from './deactivate-sub-agent-dialog'
import { INITIAL_SUB_AGENTS } from './data'
import type {
  SubAgent,
  SubAgentFilterStatus,
  SubAgentFilterBooking,
  SubAgentPermission,
} from './types'
import { cn } from 'cn'

interface AgentManagementOverviewPageProps {
  initialSearch?: string
  initialFilterStatus?: SubAgentFilterStatus
  initialFilterBooking?: SubAgentFilterBooking
  initialDropdownOpen?: boolean
}

export function AgentManagementOverviewPage({
  initialSearch = '',
  initialFilterStatus = 'all',
  initialFilterBooking = 'all',
  initialDropdownOpen = false,
}: AgentManagementOverviewPageProps) {
  const isContentLoading = useContentLoading()
  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Sub-agents state
  const [subAgents, setSubAgents] =
    React.useState<SubAgent[]>(INITIAL_SUB_AGENTS)

  // Filtering & search
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [filterPermissions, setFilterPermissions] =
    React.useState<string>(initialFilterStatus)
  const [filterMarkup, setFilterMarkup] = React.useState<string>('all')
  const [filterBooking, setFilterBooking] =
    React.useState<string>(initialFilterBooking)

  // Figma #665:7388 preview toggle: force open the dropdown on the first row
  const [previewDropdownOpen, setPreviewDropdownOpen] =
    React.useState(initialDropdownOpen)

  // Active dialog states
  const [selectedSubAgent, setSelectedSubAgent] =
    React.useState<SubAgent | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false)
  const [permissionsModalOpen, setPermissionsModalOpen] = React.useState(false)
  const [markupModalOpen, setMarkupModalOpen] = React.useState(false)
  const [bookingsModalOpen, setBookingsModalOpen] = React.useState(false)
  const [deactivateModalOpen, setDeactivateModalOpen] = React.useState(false)
  const [addModalOpen, setAddModalOpen] = React.useState(false)

  // Notification toast / banner
  const [actionSuccessMsg, setActionSuccessMsg] = React.useState<string | null>(
    null,
  )

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg)
    setTimeout(() => setActionSuccessMsg(null), 4000)
  }

  // Filter logic
  const filteredSubAgents = React.useMemo(() => {
    return subAgents.filter((agent) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = agent.name.toLowerCase().includes(q)
        const matchesEmail = agent.email.toLowerCase().includes(q)
        const matchesPhone = agent.phone ? agent.phone.includes(q) : false
        if (!matchesName && !matchesEmail && !matchesPhone) return false
      }

      // Permissions filter
      if (filterPermissions === 'configured' && !agent.permissionsConfigured)
        return false
      if (filterPermissions === 'not_configured' && agent.permissionsConfigured)
        return false

      // Markup filter
      if (filterMarkup === 'configured' && !agent.markupConfigured) return false
      if (filterMarkup === 'not_configured' && agent.markupConfigured)
        return false

      // Booking activity filter
      if (filterBooking === 'has_bookings' && agent.bookingsCount === 0)
        return false
      if (filterBooking === 'no_bookings' && agent.bookingsCount > 0)
        return false

      return true
    })
  }, [subAgents, searchQuery, filterPermissions, filterMarkup, filterBooking])

  // KPIs
  const totalSubAgents = subAgents.length
  const totalBookings = subAgents.reduce((sum, sa) => sum + sa.bookingsCount, 0)
  const markupConfiguredCount = subAgents.filter(
    (sa) => sa.markupConfigured,
  ).length
  const markupNotConfiguredCount = totalSubAgents - markupConfiguredCount
  const permissionsConfiguredCount = subAgents.filter(
    (sa) => sa.permissionsConfigured,
  ).length
  const permissionsNotConfiguredCount =
    totalSubAgents - permissionsConfiguredCount

  // Dialog openers
  const handleOpenDetails = (agent: SubAgent) => {
    setSelectedSubAgent(agent)
    setDetailsModalOpen(true)
  }

  const handleOpenPermissions = (agent: SubAgent) => {
    setSelectedSubAgent(agent)
    setPermissionsModalOpen(true)
  }

  const handleOpenMarkup = (agent: SubAgent) => {
    setSelectedSubAgent(agent)
    setMarkupModalOpen(true)
  }

  const handleOpenBookings = (agent: SubAgent) => {
    setSelectedSubAgent(agent)
    setBookingsModalOpen(true)
  }

  const handleOpenDeactivate = (agent: SubAgent) => {
    setSelectedSubAgent(agent)
    setDeactivateModalOpen(true)
  }

  const handleSavePermissions = (
    subAgentId: string,
    updatedPermissions: SubAgentPermission[],
  ) => {
    setSubAgents((prev) =>
      prev.map((sa) => {
        if (sa.id === subAgentId) {
          const hasEnabled = updatedPermissions.some((p) => p.enabled)
          return {
            ...sa,
            permissions: updatedPermissions,
            permissionsConfigured: hasEnabled,
          }
        }
        return sa
      }),
    )
    showSuccess('Permissions updated successfully.')
  }

  const handleSaveMarkup = (subAgentId: string, updatedRules: any[]) => {
    setSubAgents((prev) =>
      prev.map((sa) => {
        if (sa.id === subAgentId) {
          return {
            ...sa,
            markupRules: updatedRules,
            markupConfigured: updatedRules.length > 0,
          }
        }
        return sa
      }),
    )
    showSuccess('Markup rules saved successfully.')
  }

  const handleConfirmDeactivate = (agentId: string) => {
    setSubAgents((prev) =>
      prev.map((sa) => {
        if (sa.id === agentId) {
          const newStatus = sa.status === 'suspended' ? 'active' : 'suspended'
          return { ...sa, status: newStatus }
        }
        return sa
      }),
    )
    showSuccess('Sub-agent status modified.')
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterPermissions('all')
    setFilterMarkup('all')
    setFilterBooking('all')
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterPermissions !== 'all' ||
    filterMarkup !== 'all' ||
    filterBooking !== 'all'

  const columns = React.useMemo<ColumnDef<SubAgent>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Sub-agent',
        cell: ({ row }) => {
          const agent = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#D7E3F4] text-[#012A5E] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {agent.avatarInitials}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-[#012A5E] group-hover:text-[#0267B8] transition-colors">
                  {agent.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#4F5B70] bg-[#F4F6FA] px-2 py-0.5 rounded-md border border-[#E6EAF0]">
                    {agent.role}
                  </span>
                  {agent.status === 'suspended' && (
                    <span className="text-[10px] font-extrabold text-[#D9383A] bg-[#FDF2F2] px-1.5 py-0.5 rounded-md">
                      Suspended
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-5 sm:px-6',
          cellClassName: 'py-4.5 px-5 sm:px-6 align-top',
        },
      },
      {
        id: 'login',
        header: 'Login / Contact',
        cell: ({ row }) => {
          const agent = row.original
          return (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9AA6B9]">
                Login
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#012A5E]">
                <Mail className="size-3.5 text-[#0267B8] shrink-0" />
                <span className="truncate max-w-47.5">{agent.email}</span>
              </div>
              {agent.phone && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#4F5B70]">
                  <Phone className="size-3 text-[#9AA6B9] shrink-0" />
                  <span>{agent.phone}</span>
                </div>
              )}
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-4 sm:px-6',
          cellClassName: 'py-4.5 px-4 sm:px-6 align-top',
        },
      },
      {
        id: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
          const agent = row.original
          return (
            <div className="flex flex-col items-start gap-1.5">
              {agent.permissionsConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#ECFDF5] text-[#137A48]">
                  <Check className="size-3 stroke-3" />
                  <span>Configured</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F5F9] text-[#4F5B70]">
                  <Minus className="size-3" />
                  <span>Not configured</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => handleOpenPermissions(agent)}
                className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Permissions</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-4 sm:px-6',
          cellClassName: 'py-4.5 px-4 sm:px-6 align-top',
        },
      },
      {
        id: 'markup',
        header: 'Markup',
        cell: ({ row }) => {
          const agent = row.original
          return (
            <div className="flex flex-col items-start gap-1.5">
              {agent.markupConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#ECFDF5] text-[#137A48]">
                  <Check className="size-3 stroke-3" />
                  <span>Configured</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F5F9] text-[#4F5B70]">
                  <Minus className="size-3" />
                  <span>Not configured</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => handleOpenMarkup(agent)}
                className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Markup</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-4 sm:px-6',
          cellClassName: 'py-4.5 px-4 sm:px-6 align-top',
        },
      },
      {
        id: 'bookings',
        header: 'Bookings',
        cell: ({ row }) => {
          const agent = row.original
          return (
            <div className="flex flex-col items-start gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold',
                  agent.bookingsCount > 0
                    ? 'bg-[#EBFBF3] text-[#137A48]'
                    : 'bg-[#F1F5F9] text-[#4F5B70]',
                )}
              >
                <Ticket className="size-3" />
                <span>
                  {agent.bookingsCount > 0
                    ? `${agent.bookingsCount} booking${agent.bookingsCount > 1 ? 's' : ''}`
                    : 'No bookings'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleOpenBookings(agent)}
                className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Bookings</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-4 sm:px-6',
          cellClassName: 'py-4.5 px-4 sm:px-6 align-top',
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const agent = row.original
          const isFirstRow = row.index === 0
          return (
            <div className="inline-flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleOpenDetails(agent)}
                aria-label={`View Sub-agent ${agent.name}`}
                className="size-9 rounded-xl border-[#DCE2EB] text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] hover:border-[#0267B8]/40"
              >
                <Eye className="size-4" />
              </Button>
              <SubAgentActionDropdown
                subAgent={agent}
                onViewDetails={handleOpenDetails}
                onConfigurePermissions={handleOpenPermissions}
                onConfigureMarkup={handleOpenMarkup}
                onViewBookings={handleOpenBookings}
                onEditDetails={handleOpenDetails}
                onDeactivate={handleOpenDeactivate}
                forceOpen={isFirstRow && previewDropdownOpen}
              />
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-5 sm:px-6 text-right',
          cellClassName: 'py-4.5 px-5 sm:px-6 align-top text-right',
        },
      },
    ],
    [
      handleOpenBookings,
      handleOpenDeactivate,
      handleOpenDetails,
      handleOpenMarkup,
      handleOpenPermissions,
      previewDropdownOpen,
    ],
  )

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col antialiased font-sans text-[#141C2E]">
      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#012A5E] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="size-5 text-[#F1C134]" />
          <span className="text-xs font-bold">{actionSuccessMsg}</span>
          <button
            type="button"
            onClick={() => setActionSuccessMsg(null)}
            className="text-white/70 hover:text-white p-0.5"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Shell Layout: Sidebar + Main (Figma div#shell #665:6745) */}
      <div className="flex flex-1 w-full min-h-screen">
        {/* Desktop Sidebar (Figma #665:6746) */}
        <AgentPortalSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          currentTab="Sub-agents"
          className="hidden lg:flex"
        />

        {/* Main Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header (Figma header #665:7289) */}
          <AgentPortalHeader
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            breadcrumbs={[
              { label: 'Dashboard', active: false },
              { label: 'Sub-agents', active: true },
            ]}
          />

          {/* Figma node preview banner */}
          <div className="bg-[#012A5E] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="bg-[#F1C134] text-[#012A5E] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                FIGMA #665:6744 & #665:7388
              </span>
              <span className="font-semibold text-white/90">
                Sub-agent Management Overview & Table Action Button Dropdown
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewDropdownOpen((prev) => !prev)}
                className={cn(
                  'px-3 py-1 rounded-lg text-[11px] font-bold transition-all border',
                  previewDropdownOpen
                    ? 'bg-[#F1C134] text-[#012A5E] border-[#F1C134] shadow-xs'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20',
                )}
              >
                {previewDropdownOpen
                  ? '✓ Action Dropdown Open (#665:7388)'
                  : 'Toggle Action Dropdown (#665:7388)'}
              </button>
            </div>
          </div>

          {/* Main Content (Figma main#top #665:6826) */}
          <main className="flex-1 px-4 sm:px-8 xl:px-14 py-8 sm:py-10 flex flex-col gap-8 max-w-[1600px] w-full mx-auto">
            {/* Page Header (Figma section #665:6828) */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0267B8]">
                  Agent Portal · M2.2 Sub-agents
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                  Sub-agents
                </h1>
                <p className="text-sm font-medium text-[#4F5B70] leading-relaxed">
                  Create and manage Sub-agents under your Aero Wing Agent
                  account.
                </p>
              </div>

              {/* Primary CTA (Figma button.btn #665:6837) */}
              <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="h-12 px-6 rounded-xl bg-[#F1C134] text-[#012A5E] font-extrabold text-sm shadow-[0_4px_16px_rgba(241,193,52,0.35)] hover:bg-[#E5B52C] hover:shadow-lg transition-all active:scale-[0.98] border border-black/5 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4.5 stroke-[2.5]" />
                  <span>Add Sub-agent</span>
                </Button>
                <small className="text-[11.5px] font-semibold text-[#4F5B70]">
                  Each Sub-agent gets their own login and permissions
                </small>
              </div>
            </div>

            {/* Financial Architecture Aside Banner (Figma aside #665:6844) */}
            <aside className="bg-white rounded-2xl border border-[#DCE2EB] p-5 sm:p-6 shadow-[0_2px_8px_rgba(1,42,94,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-xl bg-[#D7E3F4] text-[#012A5E] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="size-5.5 text-[#012A5E]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm sm:text-base font-extrabold text-[#012A5E]">
                    Sub-agents operate under your Agent account.
                  </h2>
                  <p className="text-xs sm:text-[13px] font-medium text-[#4F5B70] leading-relaxed max-w-3xl">
                    Their bookings use the Parent Agent's wallet and available
                    credit, and their access is controlled by assigned
                    permissions.
                  </p>
                </div>
              </div>

              {/* Quick links */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showSuccess('Navigating to Wallet balance...')}
                  className="rounded-lg border-[#DCE2EB] text-[#0267B8] hover:bg-[#F4F6FA] hover:text-[#012A5E] font-bold text-xs h-9 px-3.5 flex items-center gap-1.5"
                >
                  <span>View Wallet</span>
                  <ArrowRight className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    showSuccess('Navigating to Credit facility...')
                  }
                  className="rounded-lg border-[#DCE2EB] text-[#0267B8] hover:bg-[#F4F6FA] hover:text-[#012A5E] font-bold text-xs h-9 px-3.5 flex items-center gap-1.5"
                >
                  <span>View Credit</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </aside>

            {/* KPI Cards Grid (Figma Sub-agent summary #665:6862) */}
            {isContentLoading ? (
              <CardGridSkeleton
                count={4}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
                cardClassName="h-36 rounded-2xl"
              />
            ) : null}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 ${isContentLoading ? "hidden" : ""}`}>
              {/* Card 1: Total Sub-agents (Figma article.kpi #665:6863) */}
              <article className="bg-white rounded-2xl border border-[#DCE2EB] p-5 sm:p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(1,42,94,0.03)] hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#D7E3F4] text-[#012A5E] flex items-center justify-center shrink-0">
                      <Users className="size-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#4F5B70]">
                      Total Sub-agents
                    </h3>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#012A5E] tracking-tight">
                      {totalSubAgents}
                    </span>
                    <p className="text-xs font-semibold text-[#4F5B70] mt-1">
                      Under your Agent account
                    </p>
                  </div>
                </div>
              </article>

              {/* Card 2: Bookings Made by Sub-agents (Figma article.kpi #665:6874) */}
              <article className="bg-white rounded-2xl border border-[#DCE2EB] p-5 sm:p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(1,42,94,0.03)] hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#ECFDF5] text-[#137A48] flex items-center justify-center shrink-0">
                      <CalendarDays className="size-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#4F5B70]">
                      Sub-agent Bookings
                    </h3>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#012A5E] tracking-tight">
                      {totalBookings}
                    </span>
                    <p className="text-xs font-semibold text-[#4F5B70] mt-1">
                      Bookings made by your Sub-agents
                    </p>
                    <p className="text-[11px] font-medium text-[#8C9BAE] mt-1 leading-snug">
                      Uses your Agent account’s wallet and available credit.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F1F3F6] mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterBooking('has_bookings')
                      showSuccess('Filtered by Sub-agents with bookings.')
                    }}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer group"
                  >
                    <span>View Sub-agent Bookings</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>

              {/* Card 3: Markup Configuration (Figma article.kpi #665:6893) */}
              <article className="bg-white rounded-2xl border border-[#DCE2EB] p-5 sm:p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(1,42,94,0.03)] hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
                      <Percent className="size-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#4F5B70]">
                      Markup Configuration
                    </h3>
                  </div>

                  {/* Split Pills: Configured vs Not Configured */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#ECFDF5] text-[#137A48]">
                      <Check className="size-3.5 stroke-3" />
                      <span>{markupConfiguredCount} Configured</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F1F5F9] text-[#4F5B70]">
                      <Minus className="size-3.5" />
                      <span>{markupNotConfiguredCount} Not configured</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#4F5B70]">
                    Sub-agent markup on top of your rates
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1F3F6] mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterMarkup('not_configured')
                      showSuccess('Filtered by markup not configured.')
                    }}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer group"
                  >
                    <span>Show not configured</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>

              {/* Card 4: Access / Permissions (Figma article.kpi #665:6921) */}
              <article className="bg-white rounded-2xl border border-[#DCE2EB] p-5 sm:p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(1,42,94,0.03)] hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#F4F6FA] text-[#012A5E] flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#4F5B70]">
                      Access / Permissions
                    </h3>
                  </div>

                  {/* Split Pills: Assigned vs Need Config */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#ECFDF5] text-[#137A48]">
                      <Check className="size-3.5 stroke-3" />
                      <span>
                        {permissionsConfiguredCount} Permissions assigned
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309]">
                      <AlertCircle className="size-3.5" />
                      <span>
                        {permissionsNotConfiguredCount} Need configuration
                      </span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#4F5B70]">
                    Each Sub-agent has its own permissions
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1F3F6] mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterPermissions('not_configured')
                      showSuccess('Filtered by permissions need configuration.')
                    }}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer group"
                  >
                    <span>Show needs configuration</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>
            </div>

            {/* Sub-agents Table Card (Figma section #665:6949) */}
            <section className="bg-white rounded-2xl border border-[#DCE2EB] shadow-[0_4px_16px_rgba(1,42,94,0.04)] overflow-hidden flex flex-col">
              {/* Card Header (Figma div.cd-h #665:6950) */}
              <div className="p-5 sm:p-6 border-b border-[#E6EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl bg-[#D7E3F4] text-[#012A5E] flex items-center justify-center shrink-0">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#012A5E] tracking-tight">
                      All Sub-agents
                    </h2>
                    <p className="text-xs sm:text-[13px] font-semibold text-[#4F5B70]">
                      Two-level hierarchy: your Agent account → Sub-agents
                    </p>
                  </div>
                </div>

                {/* Role / Hierarchy Tag */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F4F6FA] text-[#012A5E] border border-[#DCE2EB]">
                    <Building2 className="size-3.5 text-[#0267B8]" />
                    <span>Agent Owner · Sub-agent / staff</span>
                  </span>
                </div>
              </div>

              {/* Search & Filter Toolbar (Figma Search and filter Sub-agents #665:6964) */}
              <div className="p-4 sm:p-5 border-b border-[#E6EAF0] bg-[#F8FAFC]/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-4xl">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-55">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9AA6B9]" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Sub-agents by name, email..."
                      className="h-10 pl-9.5 pr-8 text-xs sm:text-sm bg-white border-[#DCE2EB] rounded-xl focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#9AA6B9] hover:text-[#012A5E]"
                        aria-label="Clear search query"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter: Permissions */}
                  <div className="w-full sm:w-44">
                    <Select
                      value={filterPermissions}
                      onValueChange={(val) =>
                        setFilterPermissions(val || 'all')
                      }
                    >
                      <SelectTrigger className="h-10 w-full text-xs font-semibold bg-white border-[#DCE2EB] rounded-xl text-[#012A5E]">
                        <SelectValue placeholder="Permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Permissions</SelectItem>
                        <SelectItem value="configured">Configured</SelectItem>
                        <SelectItem value="not_configured">
                          Need configuration
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter: Markup */}
                  <div className="w-full sm:w-40">
                    <Select
                      value={filterMarkup}
                      onValueChange={(val) => setFilterMarkup(val || 'all')}
                    >
                      <SelectTrigger className="h-10 w-full text-xs font-semibold bg-white border-[#DCE2EB] rounded-xl text-[#012A5E]">
                        <SelectValue placeholder="Markup" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Markup</SelectItem>
                        <SelectItem value="configured">Configured</SelectItem>
                        <SelectItem value="not_configured">
                          Not configured
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter: Booking activity */}
                  <div className="w-full sm:w-44">
                    <Select
                      value={filterBooking}
                      onValueChange={(val) => setFilterBooking(val || 'all')}
                    >
                      <SelectTrigger className="h-10 w-full text-xs font-semibold bg-white border-[#DCE2EB] rounded-xl text-[#012A5E]">
                        <SelectValue placeholder="Booking activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Bookings</SelectItem>
                        <SelectItem value="has_bookings">
                          Has Bookings
                        </SelectItem>
                        <SelectItem value="no_bookings">No Bookings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reset Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-xs font-bold text-[#D9383A] hover:bg-[#FDF2F2] h-10 px-3 shrink-0"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>

                {/* Summary Count (Figma p#sum #665:7005) */}
                <div className="text-xs font-medium text-[#4F5B70] shrink-0">
                  Showing{' '}
                  <strong className="font-bold text-[#012A5E]">
                    {filteredSubAgents.length}
                  </strong>{' '}
                  of{' '}
                  <strong className="font-bold text-[#012A5E]">
                    {totalSubAgents}
                  </strong>{' '}
                  Sub-agents
                </div>
              </div>

              {/* Table Body (Figma table.sat #665:7009) */}
              <div className="overflow-x-auto">
                <DataTable
                  data={filteredSubAgents}
                  columns={columns}
                  getRowId={(row) => row.id}
                  tableClassName="w-full text-left border-collapse"
                  headerRowClassName="border-b border-[#E6EAF0] bg-[#F8FAFC] text-[12px] font-extrabold uppercase tracking-wider text-[#4F5B70] hover:bg-[#F8FAFC]"
                  headClassName="h-auto"
                  bodyClassName="divide-y divide-[#E6EAF0]"
                  rowClassName="hover:bg-[#F8FAFC] transition-colors group"
                  emptyCellClassName="py-12 px-6 text-center"
                  empty={
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="size-12 rounded-full bg-[#F4F6FA] flex items-center justify-center text-[#9AA6B9]">
                        <Search className="size-6" />
                      </div>
                      <h4 className="text-sm font-bold text-[#012A5E]">
                        No Sub-agents found
                      </h4>
                      <p className="text-xs text-[#4F5B70]">
                        No sub-agents match the active search and filter
                        criteria. Try resetting your filters.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="mt-2 text-xs font-bold text-[#0267B8]"
                      >
                        Reset filters
                      </Button>
                    </div>
                  }
                />
              </div>
            </section>
          </main>

          {/* Footer (Figma footer #665:7284) */}
          <footer className="mt-auto border-t border-[#DCE2EB] bg-white px-4 sm:px-8 xl:px-14 py-4 text-xs font-semibold text-[#4F5B70] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span>
              AeroWing Agent Portal · M2.2 Sub-agent Functionality and Hierarchy
              · Sub-agent Management Overview
            </span>
            <span>
              Website only · design prototype — no accounts, logins or
              transactions are created.
            </span>
          </footer>
        </div>
      </div>

      {/* Dialog: Add Sub-agent */}
      <AddSubAgentDialog
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubAgentCreated={(newAgent: SubAgent) => {
          setSubAgents((prev) => [newAgent, ...prev])
          showSuccess(`Sub-agent ${newAgent.name} created successfully!`)
        }}
      />

      {/* Dialog: Sub-agent Full Details */}
      <SubAgentDetailsDialog
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        subAgent={selectedSubAgent}
        onOpenPermissions={handleOpenPermissions}
        onOpenMarkup={handleOpenMarkup}
        onOpenBookings={handleOpenBookings}
        onToggleStatus={handleOpenDeactivate}
      />

      {/* Dialog: View/Configure Permissions */}
      <ViewPermissionsDialog
        open={permissionsModalOpen}
        onOpenChange={setPermissionsModalOpen}
        subAgent={selectedSubAgent}
        onSavePermissions={handleSavePermissions}
      />

      {/* Dialog: View/Configure Markup */}
      <ViewMarkupDialog
        open={markupModalOpen}
        onOpenChange={setMarkupModalOpen}
        subAgent={selectedSubAgent}
        onSaveMarkup={handleSaveMarkup}
      />

      {/* Dialog: View Bookings */}
      <ViewBookingsDialog
        open={bookingsModalOpen}
        onOpenChange={setBookingsModalOpen}
        subAgent={selectedSubAgent}
      />

      {/* Dialog: Deactivate / Suspend */}
      <DeactivateSubAgentDialog
        open={deactivateModalOpen}
        onOpenChange={setDeactivateModalOpen}
        subAgent={selectedSubAgent}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  )
}

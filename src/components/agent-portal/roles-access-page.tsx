import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Network,
  Eye,
  Info,
  ChevronLeft,
  Table as TableIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Database,
  ArrowUpRight,
  UserCheck,
  Search,
  X,
  Plus,
  FileText,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { OwnerAccessSummaryDialog } from './owner-access-summary-dialog'
import { TeamAccessSummaryDialog } from './team-access-summary-dialog'
import { ViewPermissionsDialog } from './view-permissions-dialog'
import {
  ROLES_ACCESS_KPIS,
  TEAM_ACCESS_HOLDERS,
  PERMISSION_MATRIX_DATA,
} from './roles-access-data'
import type {
  PermissionMatrixItem,
  TeamAccessHolder,
} from './roles-access-types'
import type { SubAgent, SubAgentPermission } from './types'
import { INITIAL_SUB_AGENTS } from './data'
import { cn } from '#/lib/utils'

interface RolesAccessPageProps {
  initialTab?: 'overview' | 'team' | 'matrix'
  initialModal?: 'owner' | 'team' | null
  initialNodeId?: string
}

export function RolesAccessPage({
  initialTab = 'overview',
  initialModal = null,
  initialNodeId,
}: RolesAccessPageProps) {
  const isContentLoading = useContentLoading()
  // Determine effective starting tab based on initialTab or initialNodeId
  const effectiveInitialTab: 'overview' | 'team' | 'matrix' =
    React.useMemo(() => {
      if (
        initialNodeId === '835-2588' ||
        initialNodeId === '835:2588' ||
        initialNodeId === '835-2590' ||
        initialNodeId === '835:2590'
      ) {
        return 'team'
      }
      if (initialNodeId === '835-2591' || initialNodeId === '835:2591') {
        return 'matrix'
      }
      return initialTab
    }, [initialTab, initialNodeId])

  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'team' | 'matrix'
  >(effectiveInitialTab)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Dialog states
  const [ownerModalOpen, setOwnerModalOpen] = React.useState(
    initialModal === 'owner' ||
      initialNodeId === '835-2589' ||
      initialNodeId === '835:2589',
  )
  const [teamSummaryModalOpen, setTeamSummaryModalOpen] = React.useState(
    initialModal === 'team' ||
      initialNodeId === '835-2590' ||
      initialNodeId === '835:2590',
  )
  const [selectedDesk, setSelectedDesk] =
    React.useState<TeamAccessHolder | null>(null)
  const [deskDetailsOpen, setDeskDetailsOpen] = React.useState(false)

  // Quick permissions configuration dialog state
  const [quickConfigSubAgent, setQuickConfigSubAgent] =
    React.useState<SubAgent | null>(null)
  const [quickConfigOpen, setQuickConfigOpen] = React.useState(false)

  // Filters for Team Access tab
  const [teamSearchQuery, setTeamSearchQuery] = React.useState('')
  const [teamStatusFilter, setTeamStatusFilter] = React.useState<
    'all' | 'configured' | 'needs-configuration'
  >('all')
  const [teamRoleFilter, setTeamRoleFilter] = React.useState<
    'all' | 'owner' | 'staff'
  >('all')

  // Filters for Matrix tab
  const [matrixCategoryFilter, setMatrixCategoryFilter] =
    React.useState<string>('All')
  const [matrixSearchQuery, setMatrixSearchQuery] = React.useState('')

  // Handle URL change effects when initialNodeId updates
  React.useEffect(() => {
    if (
      initialNodeId === '835-2588' ||
      initialNodeId === '835:2588' ||
      initialNodeId === '835-2590' ||
      initialNodeId === '835:2590'
    ) {
      setActiveTab('team')
      if (initialNodeId === '835-2590' || initialNodeId === '835:2590') {
        setTeamSummaryModalOpen(true)
      }
    } else if (initialNodeId === '835-2591' || initialNodeId === '835:2591') {
      setActiveTab('matrix')
    } else if (initialNodeId === '835-2589' || initialNodeId === '835:2589') {
      setOwnerModalOpen(true)
    }
  }, [initialNodeId])

  const handleOpenOwnerModal = () => {
    setOwnerModalOpen(true)
  }

  const handleOpenTeamSummary = () => {
    setTeamSummaryModalOpen(true)
  }

  const handleOpenDeskDetails = (desk: TeamAccessHolder) => {
    setSelectedDesk(desk)
    setDeskDetailsOpen(true)
  }

  const handleOpenQuickConfig = (deskId: string) => {
    const match = INITIAL_SUB_AGENTS.find(
      (sa) =>
        sa.id === deskId ||
        sa.name.toLowerCase().includes(deskId.replace('-desk', '')),
    )
    if (match) {
      setQuickConfigSubAgent(match)
      setQuickConfigOpen(true)
    } else {
      window.location.href = `/sub-agents/permissions?agentId=${deskId}`
    }
  }

  const handleSaveQuickPermissions = (
    _subAgentId: string,
    updatedPermissions: SubAgentPermission[],
  ) => {
    if (quickConfigSubAgent) {
      quickConfigSubAgent.permissions = updatedPermissions
    }
    setQuickConfigOpen(false)
  }

  // Filtered team members
  const filteredTeamMembers = React.useMemo(() => {
    return TEAM_ACCESS_HOLDERS.filter((member) => {
      const q = teamSearchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.initials.toLowerCase().includes(q) ||
        (member.email && member.email.toLowerCase().includes(q))

      const matchesStatus =
        teamStatusFilter === 'all' ||
        (teamStatusFilter === 'configured' &&
          (member.status === 'configured' ||
            member.status === 'full-access')) ||
        (teamStatusFilter === 'needs-configuration' &&
          member.status === 'needs-configuration')

      const matchesRole =
        teamRoleFilter === 'all' ||
        (teamRoleFilter === 'owner' && member.role === 'Agent Owner') ||
        (teamRoleFilter === 'staff' && member.role === 'Sub-agent / staff')

      return matchesSearch && matchesStatus && matchesRole
    })
  }, [teamSearchQuery, teamStatusFilter, teamRoleFilter])

  // Filtered Matrix rows
  const matrixCategories = React.useMemo(() => {
    const set = new Set<string>()
    PERMISSION_MATRIX_DATA.forEach((item) => set.add(item.category))
    return ['All', ...Array.from(set)]
  }, [])

  const filteredMatrix = React.useMemo(() => {
    return PERMISSION_MATRIX_DATA.filter((item) => {
      const q = matrixSearchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)

      const matchesCategory =
        matrixCategoryFilter === 'All' || item.category === matrixCategoryFilter
      return matchesSearch && matchesCategory
    })
  }, [matrixSearchQuery, matrixCategoryFilter])

  const renderMatrixStatusBadge = (
    status: 'allowed' | 'view_only' | 'not_allowed',
  ) => {
    if (status === 'allowed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          Full Access
        </span>
      )
    }
    if (status === 'view_only') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
          <Eye className="size-3.5 text-blue-600" />
          View Only
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        <XCircle className="size-3.5 text-gray-400" />
        Restricted
      </span>
    )
  }

  const teamColumns = React.useMemo<ColumnDef<TeamAccessHolder>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Member / Desk',
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'size-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border',
                  member.role === 'Agent Owner'
                    ? 'bg-[#012A5E] text-[#F1C134] border-[#012A5E]'
                    : 'bg-[#F1F5F9] text-[#012A5E] border-[#E2E8F0]',
                )}
              >
                {member.initials}
              </span>
              <div>
                <p className="text-xs font-bold text-[#141C2E] flex items-center gap-1.5">
                  <span>{member.name}</span>
                  {member.role === 'Agent Owner' && (
                    <Badge className="bg-[#FEF3C7] text-[#92400E] border-none text-[10px] font-bold px-1.5 py-0 h-4">
                      Primary
                    </Badge>
                  )}
                </p>
                <p className="text-[11px] text-[#5A6882]">{member.email}</p>
              </div>
            </div>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882]',
          cellClassName: 'font-medium',
        },
      },
      {
        accessorKey: 'role',
        header: 'Assigned Role',
        cell: ({ row }) => {
          const member = row.original
          return (
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-semibold',
                member.role === 'Agent Owner'
                  ? 'bg-[#EBF3FC] text-[#012A5E] border-[#C5D7ED]'
                  : 'bg-gray-50 text-gray-700 border-gray-200',
              )}
            >
              {member.role}
            </Badge>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882]',
        },
      },
      {
        accessorKey: 'preset',
        header: 'Access Preset',
        cell: ({ row }) => (
          <span className="text-xs font-medium capitalize text-[#5A6882]">
            {row.original.preset}
          </span>
        ),
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882]',
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const member = row.original
          return (
            <>
              {member.status === 'full-access' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  Full Unrestricted
                </span>
              ) : member.status === 'configured' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertCircle className="size-3 text-amber-600" />
                  Needs Configuration
                </span>
              )}
            </>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882]',
        },
      },
      {
        id: 'privileges',
        header: 'Effective Privileges',
        cell: ({ row }) => {
          const member = row.original
          return member.role === 'Agent Owner'
            ? 'All 12 Modules Granted (Full Admin)'
            : member.status === 'configured'
              ? `${member.permissionsCount ?? 0} operational privileges active`
              : 'Pending initial permissions setup (0 active)'
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882]',
          cellClassName: 'text-xs text-[#5A6882]',
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              {member.role === 'Agent Owner' ? (
                <Button
                  variant="plain"
                  size="sm"
                  type="button"
                  onClick={handleOpenOwnerModal}
                  className="text-xs text-[#0267B8] hover:text-[#012A5E] font-semibold cursor-pointer"
                >
                  View Summary
                </Button>
              ) : (
                <>
                  <Button
                    variant="plain"
                    size="sm"
                    type="button"
                    onClick={() => handleOpenDeskDetails(member)}
                    className="text-xs text-[#0267B8] hover:text-[#012A5E] font-semibold cursor-pointer"
                  >
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleOpenQuickConfig(member.id)}
                    className="text-xs rounded-lg border-[#DCE2EB] text-[#012A5E] hover:bg-[#F1F5F9] font-semibold cursor-pointer h-7 px-2.5"
                  >
                    Configure
                  </Button>
                </>
              )}
            </div>
          )
        },
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882] text-right',
          cellClassName: 'text-right',
        },
      },
    ],
    [handleOpenDeskDetails, handleOpenOwnerModal, handleOpenQuickConfig],
  )

  const matrixColumns = React.useMemo<ColumnDef<PermissionMatrixItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Module & Capability',
        cell: ({ row }) => (
          <div>
            <span className="text-[10px] uppercase font-bold text-[#0267B8] block">
              {row.original.category}
            </span>
            <span>{row.original.name}</span>
          </div>
        ),
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882] w-1/4',
          cellClassName: 'font-semibold text-xs text-[#141C2E]',
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => row.original.description,
        meta: {
          headerClassName: 'text-xs font-bold text-[#5A6882] w-1/3',
          cellClassName: 'text-xs text-[#5A6882] leading-relaxed',
        },
      },
      {
        accessorKey: 'ownerAccess',
        header: 'Agent Owner',
        cell: ({ row }) => renderMatrixStatusBadge(row.original.ownerAccess),
        meta: {
          headerClassName:
            'text-xs font-bold text-[#012A5E] text-center w-1/6',
          cellClassName: 'text-center',
        },
      },
      {
        accessorKey: 'subAgentStandard',
        header: 'Sub-agent (Standard)',
        cell: ({ row }) =>
          renderMatrixStatusBadge(row.original.subAgentStandard),
        meta: {
          headerClassName:
            'text-xs font-bold text-[#012A5E] text-center w-1/6',
          cellClassName: 'text-center',
        },
      },
      {
        accessorKey: 'subAgentLimited',
        header: 'Sub-agent (Limited)',
        cell: ({ row }) =>
          renderMatrixStatusBadge(row.original.subAgentLimited),
        meta: {
          headerClassName:
            'text-xs font-bold text-[#012A5E] text-center w-1/6',
          cellClassName: 'text-center',
        },
      },
    ],
    [renderMatrixStatusBadge],
  )

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#141C2E]">
      {/* Sidebar with Account / Settings active */}
      <AgentPortalSidebar
        currentActive="Account / Settings"
        currentTab="Account / Settings"
        activePath="/roles-access"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Agent Portal Header */}
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileMenuOpen(true)}
          breadcrumbCurrent="Roles & Access"
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Account', active: false },
            { label: 'Roles & Access', active: true },
          ]}
        />

        {/* Main Content Body */}
        <main className="flex-1 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-38 py-6 pb-20">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Navigation: Back Link */}
            <div>
              <Button variant="plain"
                type="button"
                onClick={() => {
                  window.location.href = '/agent'
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" />
                <span>Back to Account / Settings</span>
              </Button>
            </div>

            {/* Page Header (Figma #835:2353 - #835:2367) */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold tracking-wide text-[#0267B8] uppercase">
                Account / Settings · M2.13 Role-Based Access
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                Roles & Access
              </h1>
              <p className="text-sm text-[#4F5B70]">
                Review Agent-side roles, assigned access and permission-based
                portal visibility.
              </p>

              {/* Agency Brand Tag & Sample Data Chip */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-[#141C2E]">
                  Skyline Demo Travels Ltd
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] border border-[#DCE2EB] text-[#4F5B70]">
                  <Database className="size-3 text-[#4F5B70]" />
                  Sample data
                </span>
              </div>
            </div>

            {/* TAB NAVIGATION: Roles and access sections (Figma #835:2368) */}
            <div className="bg-white rounded-2xl border border-[#DCE2EB] px-2 py-0 flex items-center gap-1 shadow-2xs overflow-x-auto">
              {/* Tab 1: Overview */}
              <Button variant="plain"
                type="button"
                onClick={() => setActiveTab('overview')}
                className={cn(
                  'flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-semibold transition-all cursor-pointer relative whitespace-nowrap',
                  activeTab === 'overview'
                    ? 'text-[#012A5E] font-bold'
                    : 'text-[#5A6882] hover:text-[#012A5E]',
                )}
              >
                <ShieldCheck
                  className={cn(
                    'size-4.5',
                    activeTab === 'overview'
                      ? 'text-[#0267B8]'
                      : 'text-[#5A6882]',
                  )}
                />
                <span>Overview</span>
                {activeTab === 'overview' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.75 bg-[#012A5E] rounded-t-sm" />
                )}
              </Button>

              {/* Tab 2: Team Access (Node #835:2588) */}
              <Button variant="plain"
                type="button"
                onClick={() => setActiveTab('team')}
                className={cn(
                  'flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-semibold transition-all cursor-pointer relative whitespace-nowrap',
                  activeTab === 'team'
                    ? 'text-[#012A5E] font-bold'
                    : 'text-[#5A6882] hover:text-[#012A5E]',
                )}
              >
                <Users
                  className={cn(
                    'size-4.5',
                    activeTab === 'team' ? 'text-[#0267B8]' : 'text-[#5A6882]',
                  )}
                />
                <span>Team Access</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#012A5E]">
                  {TEAM_ACCESS_HOLDERS.length}
                </span>
                {activeTab === 'team' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.75 bg-[#012A5E] rounded-t-sm" />
                )}
              </Button>

              {/* Tab 3: Permission Matrix (Node #835:2591) */}
              <Button variant="plain"
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={cn(
                  'flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-semibold transition-all cursor-pointer relative whitespace-nowrap',
                  activeTab === 'matrix'
                    ? 'text-[#012A5E] font-bold'
                    : 'text-[#5A6882] hover:text-[#012A5E]',
                )}
              >
                <TableIcon
                  className={cn(
                    'size-4.5',
                    activeTab === 'matrix'
                      ? 'text-[#0267B8]'
                      : 'text-[#5A6882]',
                  )}
                />
                <span>Permission Matrix</span>
                {activeTab === 'matrix' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.75 bg-[#012A5E] rounded-t-sm" />
                )}
              </Button>
            </div>

            {/* TAB 1 CONTENT: OVERVIEW (Figma Node #835:2262) */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 KPI Summary Cards (Figma #835:2383) */}
                {isContentLoading ? (
                  <CardGridSkeleton
                    count={4}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    cardClassName="h-28 rounded-2xl"
                  />
                ) : null}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isContentLoading ? "hidden" : ""}`}>
                  {ROLES_ACCESS_KPIS.map((kpi) => (
                    <div
                      key={kpi.id}
                      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all hover:border-[#CBD5E1]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'size-10 rounded-xl flex items-center justify-center shrink-0',
                            kpi.iconType === 'attention'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : kpi.iconType === 'sub-agents'
                                ? 'bg-[#EBF3FC] text-[#0267B8]'
                                : 'bg-[#F1F5F9] text-[#0267B8]',
                          )}
                        >
                          {kpi.iconType === 'roles' && (
                            <Users className="size-5" />
                          )}
                          {kpi.iconType === 'owner' && (
                            <UserCheck className="size-5" />
                          )}
                          {kpi.iconType === 'sub-agents' && (
                            <Network className="size-5" />
                          )}
                          {kpi.iconType === 'attention' && (
                            <AlertCircle className="size-5" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#5A6882]">
                          {kpi.title}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p
                          className={cn(
                            'text-xl font-extrabold',
                            kpi.iconType === 'attention'
                              ? 'text-[#B45309]'
                              : 'text-[#141C2E]',
                          )}
                        >
                          {kpi.value}
                        </p>
                        <p className="text-xs text-[#5A6882] mt-0.5 truncate">
                          {kpi.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2 Agent-side Role Cards (Figma #835:2428) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Role Card 1: Agent Owner (Figma #835:2429) */}
                  <div className="rounded-2xl border border-[#DCE8F6] bg-linear-to-br from-[#F7FBFF] via-white to-white p-6 shadow-2xs flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-xl bg-white border border-[#DCE8F6] text-[#0267B8] flex items-center justify-center shadow-2xs">
                            <ShieldCheck className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-extrabold text-[#012A5E]">
                              Agent Owner
                            </h3>
                            <p className="text-xs text-[#5A6882]">
                              Account-level Agent role.
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF3FC] text-[#012A5E] border border-[#C5D7ED]">
                          Predefined
                        </span>
                      </div>

                      {/* Access holder chip */}
                      <div className="pt-1">
                        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] inline-flex items-center gap-2.5">
                          <span className="size-7 rounded-lg bg-[#012A5E] text-[#F1C134] text-xs font-bold flex items-center justify-center shrink-0">
                            NJ
                          </span>
                          <span className="text-xs font-bold text-[#141C2E]">
                            Nusrat Jahan
                          </span>
                          <span className="text-xs text-[#5A6882]">
                            · Skyline Demo Travels Ltd
                          </span>
                        </div>
                      </div>

                      {/* Prototype note */}
                      <div className="flex items-start gap-2 pt-1 text-xs text-[#5A6882] leading-relaxed">
                        <Info className="size-4 text-[#5A6882] shrink-0 mt-0.5" />
                        <span>
                          Read-only in this prototype — the Agent Owner role
                          can’t be edited, deleted or reassigned here.
                        </span>
                      </div>
                    </div>

                    {/* View Access Button */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleOpenOwnerModal}
                        className="rounded-xl border-[#DCE2EB] text-[#012A5E] hover:bg-[#F1F5F9] font-semibold text-xs h-9 px-4 cursor-pointer gap-2"
                      >
                        <Eye className="size-3.5" />
                        View Access
                      </Button>
                    </div>
                  </div>

                  {/* Role Card 2: Sub-agent / staff (Figma #835:2461) */}
                  <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shadow-2xs">
                            <Users className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-extrabold text-[#012A5E]">
                              Sub-agent / staff
                            </h3>
                            <p className="text-xs text-[#5A6882]">
                              Access is controlled by assigned permissions.
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          Predefined
                        </span>
                      </div>

                      {/* 5 Sub-agent access holders chips (Figma #835:2474) */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {TEAM_ACCESS_HOLDERS.filter(
                          (m) => m.role === 'Sub-agent / staff',
                        ).map((sa) => (
                          <div
                            key={sa.id}
                            onClick={() => handleOpenDeskDetails(sa)}
                            className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 cursor-pointer hover:border-[#0267B8]/40 hover:bg-[#EBF3FC]/40 transition-colors"
                          >
                            <span className="size-6 rounded-md bg-[#F1F5F9] text-[#012A5E] text-[11px] font-extrabold flex items-center justify-center shrink-0 border border-[#DCE2EB]">
                              {sa.initials}
                            </span>
                            <span className="text-xs font-bold text-[#141C2E]">
                              {sa.name}
                            </span>
                            <span
                              className={cn(
                                'text-[11px] font-medium',
                                sa.status === 'configured'
                                  ? 'text-[#059669]'
                                  : 'text-[#D97706] font-semibold',
                              )}
                            >
                              · {sa.statusLabel}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Info Note */}
                      <div className="flex items-start gap-2 pt-1 text-xs text-[#5A6882] leading-relaxed">
                        <Info className="size-4 text-[#5A6882] shrink-0 mt-0.5" />
                        <span>
                          Permissions are configured per Sub-agent on the
                          Sub-agent Permissions screen (M2.2).
                        </span>
                      </div>
                    </div>

                    {/* View Team Access Button */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setActiveTab('team')}
                        className="rounded-xl border-[#DCE2EB] text-[#012A5E] hover:bg-[#F1F5F9] font-semibold text-xs h-9 px-4 cursor-pointer gap-2"
                      >
                        <Eye className="size-3.5" />
                        View Team Access
                      </Button>
                    </div>
                  </div>
                </div>

                {/* API Enforcement Banner (Figma #835:2516) */}
                <div className="rounded-2xl bg-[#FFFDF0] border border-[#FCE7A6] p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
                  <div className="size-8 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <b className="text-sm font-bold text-[#78350F] block">
                      Access is enforced beyond the menu
                    </b>
                    <p className="text-xs text-[#92400E] leading-relaxed">
                      Portal permissions must also be enforced by the API.
                      Hidden navigation alone is not authorization.
                    </p>
                  </div>
                </div>

                {/* Admin Roles Footnote (Figma #835:2525) */}
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 flex items-center gap-2.5 text-xs text-[#5A6882]">
                  <Info className="size-4 text-[#5A6882] shrink-0" />
                  <span>
                    Admin roles are managed separately in the Aero Wing Admin
                    Panel.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2 CONTENT: TEAM ACCESS (Figma Node #835:2588) */}
            {activeTab === 'team' && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-5">
                  {/* Team Access Header & Controls */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#012A5E]">
                        Team Access Directory
                      </h3>
                      <p className="text-xs text-[#5A6882]">
                        Review assigned staff desks, access credentials, and
                        operational permission limits.
                      </p>
                    </div>

                    {/* Actions and Search Bar */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Search desk name, role, email..."
                          value={teamSearchQuery}
                          onChange={(e) => setTeamSearchQuery(e.target.value)}
                          className="pl-8.5 pr-8 h-9 text-xs bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-[#141C2E]"
                        />
                        {teamSearchQuery && (
                          <Button variant="plain"
                            type="button"
                            onClick={() => setTeamSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="size-3.5" />
                          </Button>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleOpenTeamSummary}
                        className="h-9 rounded-xl border-[#DCE2EB] text-[#012A5E] hover:bg-[#F1F5F9] text-xs font-semibold px-3.5 cursor-pointer gap-1.5"
                      >
                        <FileText className="size-3.5 text-[#0267B8]" />
                        <span>Access Summary</span>
                      </Button>

                      <Button
                        type="button"
                        onClick={() => {
                          window.location.href = '/sub-agents/create'
                        }}
                        className="h-9 rounded-xl bg-[#012A5E] hover:bg-[#0267B8] text-white text-xs font-semibold px-4 cursor-pointer gap-1.5 shadow-2xs"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Sub-agent</span>
                      </Button>
                    </div>
                  </div>

                  {/* Filter Pills / Status Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-t border-[#F1F5F9] text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[#5A6882] font-medium mr-1">
                        Status:
                      </span>
                      <Button
                        type="button"
                        variant={
                          teamStatusFilter === 'all' ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setTeamStatusFilter('all')}
                        className={cn(
                          'h-7 text-xs rounded-lg cursor-pointer px-2.5',
                          teamStatusFilter === 'all'
                            ? 'bg-[#012A5E] text-white hover:bg-[#0267B8]'
                            : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50',
                        )}
                      >
                        All ({TEAM_ACCESS_HOLDERS.length})
                      </Button>
                      <Button
                        type="button"
                        variant={
                          teamStatusFilter === 'configured'
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => setTeamStatusFilter('configured')}
                        className={cn(
                          'h-7 text-xs rounded-lg cursor-pointer px-2.5',
                          teamStatusFilter === 'configured'
                            ? 'bg-[#012A5E] text-white hover:bg-[#0267B8]'
                            : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50',
                        )}
                      >
                        Configured (
                        {
                          TEAM_ACCESS_HOLDERS.filter(
                            (m) =>
                              m.status === 'configured' ||
                              m.status === 'full-access',
                          ).length
                        }
                        )
                      </Button>
                      <Button
                        type="button"
                        variant={
                          teamStatusFilter === 'needs-configuration'
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() =>
                          setTeamStatusFilter('needs-configuration')
                        }
                        className={cn(
                          'h-7 text-xs rounded-lg cursor-pointer px-2.5',
                          teamStatusFilter === 'needs-configuration'
                            ? 'bg-[#012A5E] text-white hover:bg-[#0267B8]'
                            : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50',
                        )}
                      >
                        Needs Setup (
                        {
                          TEAM_ACCESS_HOLDERS.filter(
                            (m) => m.status === 'needs-configuration',
                          ).length
                        }
                        )
                      </Button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[#5A6882] font-medium mr-1">
                        Role:
                      </span>
                      <Select
                        value={teamRoleFilter}
                        items={{
                          all: 'All Roles',
                          owner: 'Agent Owner',
                          staff: 'Sub-agent / staff',
                        }}
                        onValueChange={(val) => {
                          if (
                            val === 'all' ||
                            val === 'owner' ||
                            val === 'staff'
                          ) {
                            setTeamRoleFilter(val)
                          }
                        }}
                      >
                        <SelectTrigger className="h-7! w-39.5 rounded-lg bg-[#F8FAFC] border-[#E2E8F0] px-2 text-xs text-[#141C2E]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="owner">Agent Owner</SelectItem>
                          <SelectItem value="staff">
                            Sub-agent / staff
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Team Access Table */}
                  <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
                    <DataTable
                      data={filteredTeamMembers}
                      columns={teamColumns}
                      getRowId={(row) => row.id}
                      headerClassName="bg-[#F8FAFC]"
                      headerRowClassName="hover:bg-transparent"
                      rowClassName="hover:bg-[#F8FAFC]/75 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3 CONTENT: PERMISSION MATRIX (Figma Node #835:2591) */}
            {activeTab === 'matrix' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#012A5E]">
                        Role Permission Matrix
                      </h3>
                      <p className="text-xs text-[#5A6882]">
                        Detailed comparison of capabilities across predefined
                        roles and desk configurations.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6882]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />{' '}
                        Full Access
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="size-3.5 text-blue-600" /> View Only
                      </span>
                      <span className="flex items-center gap-1.5">
                        <XCircle className="size-3.5 text-gray-400" />{' '}
                        Restricted
                      </span>
                    </div>
                  </div>

                  {/* Matrix Filters */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-1 border-t border-[#F1F5F9]">
                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                      <span className="text-xs text-slate-500 font-medium mr-1">
                        Category:
                      </span>
                      {matrixCategories.map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          variant={
                            matrixCategoryFilter === cat ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setMatrixCategoryFilter(cat)}
                          className={cn(
                            'h-7 text-xs rounded-lg cursor-pointer px-2.5',
                            matrixCategoryFilter === cat
                              ? 'bg-[#012A5E] text-white hover:bg-[#0267B8]'
                              : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50',
                          )}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Filter capability..."
                        value={matrixSearchQuery}
                        onChange={(e) => setMatrixSearchQuery(e.target.value)}
                        className="pl-8.5 pr-8 h-8 text-xs bg-[#F8FAFC] border-[#E2E8F0] rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Matrix Table */}
                  <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
                    <DataTable
                      data={filteredMatrix}
                      columns={matrixColumns}
                      getRowId={(row) => row.id}
                      headerClassName="bg-[#F8FAFC]"
                      headerRowClassName="hover:bg-transparent"
                      rowClassName="hover:bg-[#F8FAFC]/50"
                    />
                  </div>

                  {/* Summary note */}
                  <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex items-start gap-3">
                    <Info className="size-4.5 text-[#0267B8] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs text-[#5A6882]">
                      <b className="text-[#012A5E]">
                        Need custom permissions for a specific branch desk?
                      </b>
                      <p>
                        You can selectively enable or disable ticketing,
                        customer visibility, and wallet access per sub-agent on
                        the Sub-agents management screen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer (Figma #835:2530) */}
        <footer className="border-t border-[#E2E8F0] bg-white px-6 sm:px-10 lg:px-16 xl:px-38 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#5A6882]">
          <span>
            AeroWing Agent Portal · M2.13 Role-Based Access · Roles & Access
            (Website)
          </span>
          <span>
            Design prototype — no authentication, authorization or API
            enforcement is implemented here.
          </span>
        </footer>
      </div>

      {/* DIALOG 1: Owner Access Summary (Figma #835:2589) */}
      <OwnerAccessSummaryDialog
        open={ownerModalOpen}
        onOpenChange={setOwnerModalOpen}
        onViewTeamAccess={() => {
          setOwnerModalOpen(false)
          setActiveTab('team')
        }}
      />

      {/* DIALOG 2: Team Access Summary (Figma #835:2590) */}
      <TeamAccessSummaryDialog
        open={teamSummaryModalOpen}
        onOpenChange={setTeamSummaryModalOpen}
        onConfigureDesk={(deskId) => {
          setTeamSummaryModalOpen(false)
          handleOpenQuickConfig(deskId)
        }}
      />

      {/* DIALOG 3: Desk Details Inspection Modal */}
      <Dialog open={deskDetailsOpen} onOpenChange={setDeskDetailsOpen}>
        <DialogContent className="sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          {selectedDesk && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="size-10 rounded-lg bg-[#F8FAFC] text-[#012A5E] text-xs font-extrabold flex items-center justify-center border border-[#E2E8F0]">
                    {selectedDesk.initials}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-bold',
                      selectedDesk.status === 'configured' ||
                        selectedDesk.status === 'full-access'
                        ? 'bg-[#EAFBF1] text-[#0B6A45] border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200',
                    )}
                  >
                    {selectedDesk.statusLabel}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
                  {selectedDesk.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#5A6882]">
                  Role: {selectedDesk.role} · Preset: {selectedDesk.preset} ·
                  Login: {selectedDesk.email}
                </DialogDescription>
              </DialogHeader>

              <div className="py-2 space-y-4">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="text-[#5A6882] font-medium">
                    Configured Privileges
                  </span>
                  <span className="font-bold text-[#012A5E]">
                    {selectedDesk.permissionsCount ?? 0} Modules Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 flex items-start gap-2 text-xs text-[#0267B8]">
                  <Info className="size-4 shrink-0 mt-0.5" />
                  <span>
                    To adjust specific permissions (such as ticket reissuing or
                    markup view), open the Sub-agent Permissions configuration
                    screen.
                  </span>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeskDetailsOpen(false)}
                  className="rounded-xl border-[#DCE2EB] text-[#5A6882] text-xs font-semibold"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    window.location.href = `/sub-agents/permissions?agentId=${selectedDesk.id}`
                  }}
                  className="rounded-xl bg-[#012A5E] hover:bg-[#0267B8] text-white text-xs font-semibold gap-1.5"
                >
                  <span>Configure Permissions</span>
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: Reusable Quick Permissions Dialog (From Sub-agents) */}
      <ViewPermissionsDialog
        open={quickConfigOpen}
        onOpenChange={setQuickConfigOpen}
        subAgent={quickConfigSubAgent}
        onSavePermissions={handleSaveQuickPermissions}
      />
    </div>
  )
}

import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Lock,
  Tag,
  Layers,
  Building2,
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  Settings,
  MinusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  Plane,
  Luggage,
  Compass,
  Car,
  Smartphone,
  Train,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import { Input } from '#/components/ui/input'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { AgentPortalSidebar } from '#/components/agent-portal/agent-portal-sidebar'
import { AgentPortalHeader } from '#/components/agent-portal/agent-portal-header'
import {
  INITIAL_ADMIN_PRICING_RULES,
  INITIAL_AGENT_MARKUP_RULES,
  SERVICE_COVERAGE_MODULES,
} from './data'
import type {
  AdminPricingRule,
  AgentMarkupRule,
  AnyPricingRule,
  ServiceCoverageModule,
} from './types'
import { PricingPreviewDialog } from './pricing-preview-dialog'
import { MarkupRuleDetailsSheet } from './markup-rule-details-sheet'
import { DisableMarkupRuleDialog } from './disable-markup-rule-dialog'
import { RemoveMarkupRuleDialog } from './remove-markup-rule-dialog'
import { AddEditMarkupRuleDialog } from './add-edit-markup-rule-dialog'

interface PricingMarkupPageProps {
  initialPreviewOpen?: boolean
  initialNodeId?: string
  initialModal?: 'preview' | 'disable' | 'remove' | 'details' | 'add' | 'edit'
  initialRuleId?: string
}

export function PricingMarkupPage({
  initialPreviewOpen = false,
  initialNodeId,
  initialModal,
  initialRuleId,
}: PricingMarkupPageProps) {
  const isContentLoading = useContentLoading()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  // Rules state
  const [adminRules] = React.useState<AdminPricingRule[]>(
    INITIAL_ADMIN_PRICING_RULES,
  )
  const [agentRules, setAgentRules] = React.useState<AgentMarkupRule[]>(
    INITIAL_AGENT_MARKUP_RULES,
  )
  const [serviceModules, setServiceModules] = React.useState<
    ServiceCoverageModule[]
  >(SERVICE_COVERAGE_MODULES)

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sourceFilter, setSourceFilter] = React.useState('all')
  const [serviceFilter, setServiceFilter] = React.useState('all')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  // Modals / Sheets state
  const isPreviewDefault =
    initialPreviewOpen ||
    initialModal === 'preview' ||
    initialNodeId === '710-22497' ||
    initialNodeId === '710:22497' ||
    initialNodeId === '710-22496' ||
    initialNodeId === '710:22496'
  const [pricingPreviewOpen, setPricingPreviewOpen] =
    React.useState(isPreviewDefault)
  const [previewService, setPreviewService] = React.useState('Flight')

  const isDetailsDefault =
    initialModal === 'details' ||
    initialNodeId === '710-22498' ||
    initialNodeId === '710:22498' ||
    initialNodeId === '710-22495' ||
    initialNodeId === '710:22495'
  const targetDetailsRule =
    (initialRuleId
      ? agentRules.find((r) => r.id === initialRuleId) ||
        adminRules.find((r) => r.id === initialRuleId)
      : null) || (isDetailsDefault ? adminRules[1] : null)
  const [detailsSheetOpen, setDetailsSheetOpen] =
    React.useState(isDetailsDefault)
  const [selectedRuleForDetails, setSelectedRuleForDetails] =
    React.useState<AnyPricingRule | null>(targetDetailsRule)

  // Figma #710:22494 / #710:22499 "Disable markup rule"
  const isDisableDefault =
    initialModal === 'disable' ||
    initialNodeId === '710-22494' ||
    initialNodeId === '710:22494' ||
    initialNodeId === '710-22499' ||
    initialNodeId === '710:22499'
  const targetDisableRule =
    (initialRuleId ? agentRules.find((r) => r.id === initialRuleId) : null) ||
    (isDisableDefault ? agentRules[0] : null)
  const [disableDialogOpen, setDisableDialogOpen] =
    React.useState(isDisableDefault)
  const [ruleToDisable, setRuleToDisable] =
    React.useState<AgentMarkupRule | null>(targetDisableRule)

  // Figma #710:22493 / #710:22500 "Remove markup rule"
  const isRemoveDefault =
    initialModal === 'remove' ||
    initialNodeId === '710-22493' ||
    initialNodeId === '710:22493' ||
    initialNodeId === '710-22500' ||
    initialNodeId === '710:22500'
  const targetRemoveRule =
    (initialRuleId ? agentRules.find((r) => r.id === initialRuleId) : null) ||
    (isRemoveDefault ? agentRules[0] : null)
  const [removeDialogOpen, setRemoveDialogOpen] =
    React.useState(isRemoveDefault)
  const [ruleToRemove, setRuleToRemove] =
    React.useState<AgentMarkupRule | null>(targetRemoveRule)

  const isAddEditDefault =
    initialModal === 'add' ||
    initialModal === 'edit' ||
    initialNodeId === '713-23496' ||
    initialNodeId === '713:23496'
  const targetEditRule =
    initialModal === 'edit' && initialRuleId
      ? agentRules.find((r) => r.id === initialRuleId) || null
      : null
  const [addEditModalOpen, setAddEditModalOpen] =
    React.useState(isAddEditDefault)
  const [ruleToEdit, setRuleToEdit] = React.useState<AgentMarkupRule | null>(
    targetEditRule,
  )

  // Synchronize service coverage when agentRules change
  React.useEffect(() => {
    setServiceModules((prev) =>
      prev.map((mod) => {
        const matchingRules = agentRules.filter(
          (r) =>
            r.service.toLowerCase() === mod.name.toLowerCase() ||
            (r.scope === 'All Services' && r.service === 'All Services'),
        )
        const activeRules = matchingRules.filter((r) => r.status === 'active')
        const hasAgent = matchingRules.length > 0
        const isActive = activeRules.length > 0

        return {
          ...mod,
          hasAgentRule: hasAgent,
          activeRulesCount: activeRules.length,
          status: hasAgent ? (isActive ? 'active' : 'inactive') : 'admin_only',
          badgeLabel: hasAgent ? 'Agent rule configured' : 'Admin pricing only',
          subtext: hasAgent
            ? isActive
              ? `${activeRules.length} active rule`
              : 'Rule inactive'
            : 'No Agent rule',
        }
      }),
    )
  }, [agentRules])

  // Handlers for rules
  const handleOpenPreviewForService = (service: string) => {
    setPreviewService(service)
    setPricingPreviewOpen(true)
  }

  const handleViewDetails = (rule: AnyPricingRule) => {
    setSelectedRuleForDetails(rule)
    setDetailsSheetOpen(true)
  }

  const handlePromptDisable = (rule: AgentMarkupRule) => {
    setRuleToDisable(rule)
    setDisableDialogOpen(true)
  }

  const handleConfirmDisable = (ruleId: string) => {
    setAgentRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, status: 'inactive' } : r)),
    )
  }

  const handleToggleEnable = (rule: AgentMarkupRule) => {
    setAgentRules((prev) =>
      prev.map((r) => (r.id === rule.id ? { ...r, status: 'active' } : r)),
    )
  }

  const handlePromptRemove = (rule: AgentMarkupRule) => {
    setRuleToRemove(rule)
    setRemoveDialogOpen(true)
  }

  const handleConfirmRemove = (ruleId: string) => {
    setAgentRules((prev) => prev.filter((r) => r.id !== ruleId))
  }

  const handleOpenAddRule = () => {
    setRuleToEdit(null)
    setAddEditModalOpen(true)
  }

  const handleOpenEditRule = (rule: AgentMarkupRule) => {
    setRuleToEdit(rule)
    setAddEditModalOpen(true)
  }

  const handleSaveRule = (ruleData: Partial<AgentMarkupRule>) => {
    if (ruleData.id) {
      // Edit existing
      setAgentRules((prev) =>
        prev.map((r) => (r.id === ruleData.id ? { ...r, ...ruleData } : r)),
      )
    } else {
      // Create new
      const newRule: AgentMarkupRule = {
        id: `agt-rule-${Date.now()}`,
        name: ruleData.name || 'New Client Markup',
        source: 'agent',
        scope: ruleData.scope || 'Specific Service',
        service: ruleData.service || 'Flight',
        supplier: ruleData.supplier || 'All suppliers',
        type: ruleData.type || 'Percentage',
        value: ruleData.value || 'Sample 3%',
        numericValue: ruleData.numericValue || 3,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      }
      setAgentRules((prev) => [...prev, newRule])
    }
  }

  // Filter logic
  const filteredAdminRules = adminRules.filter((r) => {
    if (sourceFilter === 'agent') return false
    if (serviceFilter !== 'all' && r.service !== serviceFilter) return false
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        r.name.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q) ||
        r.scope.toLowerCase().includes(q) ||
        r.value.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  const filteredAgentRules = agentRules.filter((r) => {
    if (sourceFilter === 'admin') return false
    if (serviceFilter !== 'all' && r.service !== serviceFilter) return false
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        r.name.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q) ||
        r.scope.toLowerCase().includes(q) ||
        r.value.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  const totalFiltered = filteredAdminRules.length + filteredAgentRules.length
  const activeAgentCount = agentRules.filter(
    (r) => r.status === 'active',
  ).length
  const inactiveAgentCount = agentRules.filter(
    (r) => r.status === 'inactive',
  ).length
  const serviceCoverageCount = serviceModules.filter(
    (m) => m.hasAgentRule,
  ).length

  const getServiceIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'flight':
        return Plane
      case 'hotel':
        return Building2
      case 'travel package':
        return Luggage
      case 'activity':
        return Compass
      case 'car rental':
        return Car
      case 'esim':
        return Smartphone
      case 'bus / train':
        return Train
      case 'travel insurance':
        return Shield
      default:
        return Layers
    }
  }

  const adminColumns = React.useMemo<ColumnDef<AdminPricingRule>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'RULE',
        cell: ({ row }) => {
          const rule = row.original
          return (
            <>
              <Button variant="plain"
                type="button"
                onClick={() => handleViewDetails(rule)}
                className="font-bold text-[#0267B8] hover:underline text-left block"
              >
                {rule.name}
              </Button>
              <span className="text-[10px] font-semibold text-[#0267B8] bg-[#EBF3FC] border border-[#BFDBFE] rounded px-1.5 py-0.2 mt-0.5 inline-flex items-center gap-1">
                <Lock className="size-2.5" />
                Admin
              </span>
            </>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        accessorKey: 'scope',
        header: 'SCOPE',
        cell: ({ row }) => row.original.scope,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 font-medium text-[#001A3D]',
        },
      },
      {
        accessorKey: 'service',
        header: 'SERVICE',
        cell: ({ row }) => {
          const rule = row.original
          const ServiceIcon = getServiceIcon(rule.service)
          return (
            <span className="inline-flex items-center gap-1.5">
              <ServiceIcon className="size-3.5 text-[#0267B8]" />
              {rule.service}
            </span>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 font-medium text-[#001A3D]',
        },
      },
      {
        accessorKey: 'supplier',
        header: 'SUPPLIER',
        cell: ({ row }) => row.original.supplier,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 text-[#64748B]',
        },
      },
      {
        accessorKey: 'type',
        header: 'TYPE',
        cell: ({ row }) => row.original.type,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 text-[#64748B]',
        },
      },
      {
        accessorKey: 'value',
        header: 'VALUE',
        cell: ({ row }) => row.original.value,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 font-bold text-[#001A3D]',
        },
      },
      {
        accessorKey: 'appliedTo',
        header: 'APPLIED TO',
        cell: ({ row }) => row.original.appliedTo,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 text-[#001A3D] font-medium',
        },
      },
      {
        id: 'status',
        header: 'STATUS',
        cell: () => (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Active
          </span>
        ),
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => {
          const rule = row.original
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(rule)}
              className="border-[#DCE2EB] text-xs font-semibold text-[#0267B8] h-8 rounded-lg hover:bg-[#EBF3FC]"
            >
              <Eye className="size-3.5 mr-1" />
              View Details
            </Button>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 text-right',
          cellClassName: 'py-3.5 px-4 text-right',
        },
      },
    ],
    [handleViewDetails, getServiceIcon],
  )

  const agentColumns = React.useMemo<ColumnDef<AgentMarkupRule>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'RULE',
        cell: ({ row }) => {
          const rule = row.original
          return (
            <>
              <Button variant="plain"
                type="button"
                onClick={() => handleViewDetails(rule)}
                className="font-bold text-[#0267B8] hover:underline text-left block"
              >
                {rule.name}
              </Button>
              <span className="text-[10px] font-semibold text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] rounded px-1.5 py-0.2 mt-0.5 inline-flex items-center gap-1">
                <Tag className="size-2.5" />
                Agent
              </span>
            </>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        accessorKey: 'scope',
        header: 'SCOPE',
        cell: ({ row }) => row.original.scope,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 font-medium text-[#001A3D]',
        },
      },
      {
        accessorKey: 'service',
        header: 'SERVICE',
        cell: ({ row }) => {
          const rule = row.original
          const ServiceIcon = getServiceIcon(rule.service)
          return (
            <span className="inline-flex items-center gap-1.5">
              <ServiceIcon className="size-3.5 text-[#0267B8]" />
              {rule.service}
            </span>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 font-medium text-[#001A3D]',
        },
      },
      {
        accessorKey: 'supplier',
        header: 'SUPPLIER',
        cell: ({ row }) => row.original.supplier,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 text-[#64748B]',
        },
      },
      {
        accessorKey: 'type',
        header: 'TYPE',
        cell: ({ row }) => row.original.type,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 text-[#64748B]',
        },
      },
      {
        accessorKey: 'value',
        header: 'MARKUP',
        cell: ({ row }) => row.original.value,
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4 font-bold text-[#001A3D]',
        },
      },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) =>
          row.original.status === 'active' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="size-3 text-emerald-600" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
              <XCircle className="size-3 text-slate-500" />
              Inactive
            </span>
          ),
        meta: {
          headerClassName: 'py-3 px-4',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => {
          const rule = row.original
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                type="button"
                variant="plain"
                size="sm"
                onClick={() => handleOpenEditRule(rule)}
                className="h-8 px-2 text-xs font-semibold text-[#001A3D] hover:bg-[#F1F3F7]"
              >
                <Settings className="size-3.5 mr-1" />
                Edit
              </Button>

              {rule.status === 'active' ? (
                <Button
                  type="button"
                  variant="plain"
                  size="sm"
                  onClick={() => handlePromptDisable(rule)}
                  className="h-8 px-2 text-xs font-semibold text-[#B45309] hover:bg-amber-50"
                >
                  <MinusCircle className="size-3.5 mr-1" />
                  Disable
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="plain"
                  size="sm"
                  onClick={() => handleToggleEnable(rule)}
                  className="h-8 px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  <CheckCircle2 className="size-3.5 mr-1" />
                  Enable
                </Button>
              )}

              <Button
                type="button"
                variant="plain"
                size="sm"
                onClick={() => handlePromptRemove(rule)}
                className="h-8 px-2 text-xs font-semibold text-[#D92D20] hover:bg-red-50"
              >
                <Trash2 className="size-3.5 mr-1" />
                Remove
              </Button>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3 px-4 text-right',
          cellClassName: 'py-3.5 px-4 text-right',
        },
      },
    ],
    [
      handleViewDetails,
      getServiceIcon,
      handleOpenEditRule,
      handlePromptDisable,
      handleToggleEnable,
      handlePromptRemove,
    ],
  )

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex">
      {/* Sidebar with active Pricing & Markup */}
      <AgentPortalSidebar
        currentTab="Pricing & Markup"
        currentActive="Pricing & Markup"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          breadcrumbCurrent="Pricing & Markup"
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Pricing & Markup', active: true },
          ]}
        />

        {/* Scrollable Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Page Top Header Section matching Figma #710:21898 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#0267B8] tracking-wider uppercase">
                Agent Portal · M2.3 + M2.4 Pricing & Markup
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#001A3D] tracking-tight">
                Pricing & Markup
              </h1>
              <p className="text-xs lg:text-sm text-[#4F5B70] leading-relaxed">
                Review pricing applied to your Agent account and manage your own
                client markup rules.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs font-bold text-[#001A3D]">
                  Skyline Demo Travels Ltd
                </span>
                <span className="text-[11px] font-medium text-[#4F5B70] bg-[#F1F3F7] border border-[#DCE2EB] rounded-full px-2.5 py-0.5 inline-flex items-center gap-1">
                  <Info className="size-3 text-[#4F5B70]" />
                  Sample data
                </span>
              </div>
            </div>

            {/* Action Buttons matching Figma #710:21913 */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPricingPreviewOpen(true)}
                className="bg-white border-[#DCE2EB] hover:bg-[#F8FAFC] text-xs font-bold text-[#001A3D] rounded-xl h-10 px-4 shadow-2xs cursor-pointer"
              >
                <SlidersHorizontal className="size-4 mr-2 text-[#0267B8]" />
                Pricing Preview
              </Button>
              <Button
                type="button"
                onClick={handleOpenAddRule}
                className="bg-[#001A3D] hover:bg-[#012A5E] text-white text-xs font-bold rounded-xl h-10 px-4 shadow-sm cursor-pointer"
              >
                <Plus className="size-4 mr-1.5" />
                Add Markup Rule
              </Button>
            </div>
          </div>

          {/* 4 Summary KPI Cards matching Figma #710:21925 */}
          {isContentLoading ? (
            <CardGridSkeleton
              count={4}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              cardClassName="h-32 rounded-2xl"
            />
          ) : null}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isContentLoading ? "hidden" : ""}`}>
            {/* Card 1: Admin Pricing */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                  <Lock className="size-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                  Admin Pricing
                </h3>
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#001A3D]">
                  Configured
                </p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                  Pricing rules are applied to this Agent account.
                </p>
              </div>
            </div>

            {/* Card 2: Your Markup Rules */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#FEF7E6] text-[#D97706] flex items-center justify-center shrink-0">
                  <Tag className="size-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                  Your Markup Rules
                </h3>
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#001A3D]">
                  {agentRules.length}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                  {activeAgentCount} active · {inactiveAgentCount} inactive
                </p>
              </div>
            </div>

            {/* Card 3: Service Coverage */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                  <Layers className="size-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                  Service Coverage
                </h3>
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#001A3D]">
                  {serviceCoverageCount} of 8
                </p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                  Service modules with your markup rules
                </p>
              </div>
            </div>

            {/* Card 4: Supplier-specific Rules */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#F1F3F7] text-[#64748B] flex items-center justify-center shrink-0">
                  <Building2 className="size-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                  Supplier-specific Rules
                </h3>
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#64748B]">
                  None configured
                </p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                  Service-level rules only
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar matching Figma #710:21971 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search input */}
              <div className="relative lg:col-span-1">
                <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules"
                  className="pl-9 bg-white border-[#DCE2EB] text-xs font-medium rounded-xl h-10 shadow-2xs text-[#001A3D]"
                />
              </div>

              {/* Rule Source */}
              <div>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs font-semibold rounded-xl h-10 shadow-2xs text-[#001A3D]">
                    <SelectValue placeholder="Rule Source" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-lg">
                    <SelectItem value="all">Rule Source: All</SelectItem>
                    <SelectItem value="admin">Admin Pricing</SelectItem>
                    <SelectItem value="agent">Your Markup Rules</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service */}
              <div>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs font-semibold rounded-xl h-10 shadow-2xs text-[#001A3D]">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-lg">
                    <SelectItem value="all">Service: All Services</SelectItem>
                    <SelectItem value="Flight">Flight</SelectItem>
                    <SelectItem value="Hotel">Hotel</SelectItem>
                    <SelectItem value="Travel Package">
                      Travel Package
                    </SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                    <SelectItem value="Car Rental">Car Rental</SelectItem>
                    <SelectItem value="eSIM">eSIM</SelectItem>
                    <SelectItem value="Bus / Train">Bus / Train</SelectItem>
                    <SelectItem value="Travel Insurance">
                      Travel Insurance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs font-semibold rounded-xl h-10 shadow-2xs text-[#001A3D]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-lg">
                    <SelectItem value="all">Type: All Types</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Fixed amount">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full bg-white border-[#DCE2EB] text-xs font-semibold rounded-xl h-10 shadow-2xs text-[#001A3D]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-lg">
                    <SelectItem value="all">Status: All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-[#64748B]">
              <p>
                Showing{' '}
                <strong className="text-[#001A3D] font-bold">
                  {totalFiltered}
                </strong>{' '}
                rules
              </p>
              {(searchQuery ||
                sourceFilter !== 'all' ||
                serviceFilter !== 'all' ||
                typeFilter !== 'all' ||
                statusFilter !== 'all') && (
                <Button variant="plain"
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSourceFilter('all')
                    setServiceFilter('all')
                    setTypeFilter('all')
                    setStatusFilter('all')
                  }}
                  className="text-xs font-semibold text-[#0267B8] hover:underline cursor-pointer"
                >
                  Reset filters
                </Button>
              )}
            </div>
          </div>

          {/* Section 1: Your Applicable Pricing (Admin) matching Figma #710:22022 */}
          {(sourceFilter === 'all' || sourceFilter === 'admin') && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                    <Lock className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#001A3D]">
                      Your Applicable Pricing
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      These pricing settings are configured by Aero Wing Admin
                      and cannot be edited here.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#0267B8] bg-[#EBF3FC] border border-[#BFDBFE] rounded-md px-2.5 py-0.5 inline-flex items-center gap-1">
                    <Lock className="size-3" />
                    Read-only
                  </span>
                  <span className="text-[11px] font-medium text-[#4F5B70] bg-[#F1F3F7] border border-[#DCE2EB] rounded-full px-2.5 py-0.5 inline-flex items-center gap-1">
                    <Info className="size-3 text-[#4F5B70]" />
                    Sample data
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <DataTable
                  data={filteredAdminRules}
                  columns={adminColumns}
                  getRowId={(row) => row.id}
                  tableClassName="w-full text-left text-xs border-collapse"
                  headerRowClassName="bg-[#F8FAFC] text-[#475467] font-bold border-b border-[#E2E8F0] hover:bg-[#F8FAFC]"
                  headClassName="h-auto"
                  bodyClassName="divide-y divide-[#E2E8F0]"
                  rowClassName="hover:bg-[#F8FAFC] transition-colors"
                  empty="No admin pricing rules match your filters."
                  emptyCellClassName="py-8 text-center text-xs text-[#64748B]"
                />
              </div>

              {/* Table Footer note */}
              <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-1.5">
                <Info className="size-3.5 text-[#0267B8] shrink-0" />
                Admin pricing is shown for reference only. Values are fictional
                sample data, not contractual pricing.
              </div>
            </div>
          )}

          {/* Section 2: Your Markup Rules (Agent) matching Figma #710:22135 */}
          {(sourceFilter === 'all' || sourceFilter === 'agent') && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#FEF7E6] text-[#D97706] flex items-center justify-center shrink-0">
                    <Tag className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#001A3D]">
                      Your Markup Rules
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Add your own markup when quoting customers, within limits
                      configured by Admin.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-[#4F5B70] bg-[#F1F3F7] border border-[#DCE2EB] rounded-full px-2.5 py-0.5 inline-flex items-center gap-1">
                    <Info className="size-3 text-[#4F5B70]" />
                    Sample data
                  </span>
                  <Button
                    type="button"
                    onClick={handleOpenAddRule}
                    size="sm"
                    className="bg-[#001A3D] hover:bg-[#012A5E] text-white text-xs font-bold rounded-xl h-8 px-3 shadow-xs"
                  >
                    <Plus className="size-3.5 mr-1" />
                    Add Markup Rule
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <DataTable
                  data={filteredAgentRules}
                  columns={agentColumns}
                  getRowId={(row) => row.id}
                  tableClassName="w-full text-left text-xs border-collapse"
                  headerRowClassName="bg-[#F8FAFC] text-[#475467] font-bold border-b border-[#E2E8F0] hover:bg-[#F8FAFC]"
                  headClassName="h-auto"
                  bodyClassName="divide-y divide-[#E2E8F0]"
                  rowClassName="hover:bg-[#F8FAFC] transition-colors"
                  empty="No markup rules match your filters."
                  emptyCellClassName="py-8 text-center text-xs text-[#64748B]"
                />
              </div>

              {/* Table Footer note */}
              <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-1.5">
                <Info className="size-3.5 text-[#0267B8] shrink-0" />
                Changes apply according to the platform’s pricing rules when
                future pricing is calculated.
              </div>
            </div>
          )}

          {/* Section 3: Service Coverage Grid matching Figma #710:22309 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                  <Layers className="size-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#001A3D]">
                    Service Coverage
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    All 8 service modules and whether you’ve added your own
                    markup
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#4F5B70] bg-[#F1F3F7] border border-[#DCE2EB] rounded-full px-2.5 py-0.5 inline-flex items-center gap-1">
                <Info className="size-3 text-[#4F5B70]" />
                Sample data
              </span>
            </div>

            {/* 8 Cards in 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {serviceModules.map((module) => {
                const IconComponent = getServiceIcon(module.name)
                const isConfiguredActive = module.status === 'active'
                const isConfiguredInactive = module.status === 'inactive'

                return (
                  <Button variant="plain"
                    key={module.id}
                    type="button"
                    onClick={() => handleOpenPreviewForService(module.name)}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#0267B8] hover:shadow-xs transition-all text-left flex flex-col justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#001A3D] group-hover:text-[#0267B8] transition-colors">
                        <IconComponent className="size-4 text-[#0267B8]" />
                        <span>{module.name}</span>
                      </div>
                      <SlidersHorizontal className="size-3.5 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div>
                      {isConfiguredActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-2.5 text-emerald-600" />
                          Agent rule configured
                        </span>
                      )}
                      {isConfiguredInactive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <XCircle className="size-2.5 text-amber-600" />
                          Agent rule configured
                        </span>
                      )}
                      {!module.hasAgentRule && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                          Admin pricing only
                        </span>
                      )}
                      <p className="text-[11px] text-[#64748B] mt-1">
                        {module.subtext}
                      </p>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Section 4: Architecture & Limits matching Figma #710:22419 & #710:22431 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Pricing Architecture */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                  <Sparkles className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-[#001A3D]">
                  Pricing Architecture
                </h3>
              </div>
              <div className="space-y-2 text-xs text-[#4F5B70] leading-relaxed">
                <p>
                  Admin and Agent pricing layers combine to determine customer
                  pricing.
                </p>
                <p>
                  Quotes include pricing configured by Aero Wing Admin together
                  with markup configured by your Agent account.
                </p>
                <p>
                  When several pricing or markup rules apply, the platform
                  resolves them using the configured pricing rule precedence.
                </p>
                <p className="pt-1 text-[#0267B8] font-semibold flex items-center gap-1.5">
                  <Info className="size-3.5" />
                  Sub-agent markup is managed separately under Sub-agents.
                </p>
              </div>
            </div>

            {/* Card 2: Markup Limits */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[#FEF7E6] text-[#D97706] flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-[#001A3D]">
                  Markup Limits
                </h3>
              </div>
              <div className="space-y-2.5 text-xs text-[#4F5B70] leading-relaxed">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-2.5">
                  <Shield className="size-4 text-[#0267B8] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#001A3D] font-bold block">
                      Limits are configured by Aero Wing Admin
                    </strong>
                    <span className="text-[#64748B]">
                      Your markup must remain within the limits applicable to
                      your Agent account.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#64748B]">Exact limits:</span>
                  <strong className="text-[#001A3D] font-bold">
                    Not included in this design-preview dataset
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Page Footer matching Figma #710:22454 */}
          <footer className="pt-4 pb-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
            <p>
              AeroWing Agent Portal · M2.3 + M2.4 Agent Pricing & Markup
              Overview · Website
            </p>
            <p>
              Design prototype — no pricing engine, supplier system or quoting
              service is called.
            </p>
          </footer>
        </main>
      </div>

      {/* Sheets & Dialogs */}
      <PricingPreviewDialog
        open={pricingPreviewOpen}
        onOpenChange={setPricingPreviewOpen}
        adminRules={adminRules}
        agentRules={agentRules}
      />

      <MarkupRuleDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        rule={selectedRuleForDetails}
      />

      <DisableMarkupRuleDialog
        open={disableDialogOpen}
        onOpenChange={setDisableDialogOpen}
        rule={ruleToDisable}
        onConfirmDisable={handleConfirmDisable}
      />

      <RemoveMarkupRuleDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        rule={ruleToRemove}
        onConfirmRemove={handleConfirmRemove}
      />

      <AddEditMarkupRuleDialog
        open={addEditModalOpen}
        onOpenChange={setAddEditModalOpen}
        ruleToEdit={ruleToEdit}
        onSaveRule={handleSaveRule}
      />
    </div>
  )
}

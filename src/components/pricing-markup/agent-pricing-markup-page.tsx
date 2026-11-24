import * as React from 'react'
import {
  Search,
  Plus,
  Calculator,
  CheckCircle2,
  Percent,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Filter,
} from 'lucide-react'
import { AgentPortalSidebar } from '#/components/agent-portal/agent-portal-sidebar'
import { AgentPortalHeader } from '#/components/agent-portal/agent-portal-header'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Badge } from '#/components/ui/badge'

import { PricingKpiCards } from './pricing-kpi-cards'
import { ApplicablePricingTable } from './applicable-pricing-table'
import { AgentMarkupTable } from './agent-markup-table'
import { ServiceCoverageGrid } from './service-coverage-grid'
import { HowPricingWorksCard } from './how-pricing-works-card'
import { PricingPreviewDialog } from './pricing-preview-dialog'
import { MarkupRuleDetailsDialog } from './markup-rule-details-dialog'
import { AddEditMarkupDialog } from './add-edit-markup-dialog'
import { DeleteMarkupDialog } from './delete-markup-dialog'
import { ToggleStatusDialog } from './toggle-status-dialog'

import {
  INITIAL_ADMIN_PRICING_RULES,
  INITIAL_AGENT_MARKUP_RULES,
  SERVICE_COVERAGE_MODULES,
} from './data'
import type {
  AdminPricingRule,
  AgentMarkupRule,
  ServiceCoverageModule,
} from './types'

interface AgentPricingMarkupPageProps {
  initialSearch?: string
  initialFilterSource?: string
  initialFilterType?: string
  initialModal?: 'preview' | 'add' | 'edit' | 'details' | 'remove' | 'disable'
  initialRuleId?: string
}

export function AgentPricingMarkupPage({
  initialSearch = '',
  initialFilterSource = 'all',
  initialFilterType = 'all',
  initialModal,
  initialRuleId,
}: AgentPricingMarkupPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Rules state
  const [adminRules] = React.useState<AdminPricingRule[]>(
    INITIAL_ADMIN_PRICING_RULES,
  )
  const [agentRules, setAgentRules] = React.useState<AgentMarkupRule[]>(
    INITIAL_AGENT_MARKUP_RULES,
  )

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [sourceFilter, setSourceFilter] = React.useState(initialFilterSource)
  const [typeFilter, setTypeFilter] = React.useState(initialFilterType)

  // Modal dialog states
  const isPreviewParam =
    initialModal === 'preview' ||
    initialModal === '710-22497' ||
    initialModal === '710:22497'

  const isDetailsParam =
    initialModal === 'details' ||
    initialModal === '710-22498' ||
    initialModal === '710:22498'

  const isDisableParam =
    initialModal === 'disable' ||
    initialModal === '710-22499' ||
    initialModal === '710:22499'

  const isRemoveParam =
    initialModal === 'remove' ||
    initialModal === '710-22500' ||
    initialModal === '710:22500'

  const [previewOpen, setPreviewOpen] = React.useState(isPreviewParam)
  const [addEditOpen, setAddEditOpen] = React.useState(
    initialModal === 'add' || initialModal === 'edit',
  )
  const [editingRule, setEditingRule] = React.useState<AgentMarkupRule | null>(
    initialModal === 'edit' && initialRuleId
      ? agentRules.find((r) => r.id === initialRuleId) || null
      : null,
  )

  const [detailsOpen, setDetailsOpen] = React.useState(isDetailsParam)
  const [selectedRuleForDetails, setSelectedRuleForDetails] = React.useState<
    AdminPricingRule | AgentMarkupRule | null
  >(
    initialRuleId
      ? agentRules.find((r) => r.id === initialRuleId) ||
          adminRules.find((r) => r.id === initialRuleId) ||
          adminRules[0]
      : adminRules[0],
  )

  const [deleteOpen, setDeleteOpen] = React.useState(isRemoveParam)
  const [selectedRuleForDelete, setSelectedRuleForDelete] =
    React.useState<AgentMarkupRule | null>(
      initialRuleId
        ? agentRules.find((r) => r.id === initialRuleId) || agentRules[0]
        : agentRules[0],
    )

  const [statusOpen, setStatusOpen] = React.useState(isDisableParam)
  const [selectedRuleForStatus, setSelectedRuleForStatus] =
    React.useState<AgentMarkupRule | null>(
      initialRuleId
        ? agentRules.find((r) => r.id === initialRuleId) || agentRules[0]
        : agentRules[0],
    )

  // Service coverage dynamically linked to agent rules
  const dynamicServiceModules: ServiceCoverageModule[] = React.useMemo(() => {
    return SERVICE_COVERAGE_MODULES.map((base) => {
      const matchingAgentRules = agentRules.filter(
        (r) => r.service.toLowerCase() === base.name.toLowerCase(),
      )
      const hasRule = matchingAgentRules.length > 0
      const activeCount = matchingAgentRules.filter(
        (r) => r.status === 'active',
      ).length

      if (hasRule) {
        if (activeCount > 0) {
          return {
            ...base,
            hasAgentRule: true,
            activeRulesCount: activeCount,
            status: 'active',
            badgeLabel: 'Agent rule configured',
            subtext: `${activeCount} active rule`,
          }
        } else {
          return {
            ...base,
            hasAgentRule: true,
            activeRulesCount: 0,
            status: 'inactive',
            badgeLabel: 'Agent rule configured',
            subtext: 'Rule inactive',
          }
        }
      }

      return base
    })
  }, [agentRules])

  // Filtered lists
  const filteredAdminRules = React.useMemo(() => {
    if (sourceFilter === 'agent') return []
    return adminRules.filter((r) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.value.toLowerCase().includes(searchQuery.toLowerCase())

      const matchType =
        typeFilter === 'all' ||
        (typeFilter === 'percentage' && r.type === 'Percentage') ||
        (typeFilter === 'fixed' && r.type === 'Fixed amount')

      return matchSearch && matchType
    })
  }, [adminRules, searchQuery, sourceFilter, typeFilter])

  const filteredAgentRules = React.useMemo(() => {
    if (sourceFilter === 'admin') return []
    return agentRules.filter((r) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.value.toLowerCase().includes(searchQuery.toLowerCase())

      const matchType =
        typeFilter === 'all' ||
        (typeFilter === 'percentage' && r.type === 'Percentage') ||
        (typeFilter === 'fixed' && r.type === 'Fixed amount')

      return matchSearch && matchType
    })
  }, [agentRules, searchQuery, sourceFilter, typeFilter])

  const totalVisibleRules =
    filteredAdminRules.length + filteredAgentRules.length

  // Handlers
  const handleOpenAdd = () => {
    setEditingRule(null)
    setAddEditOpen(true)
  }

  const handleEdit = (rule: AgentMarkupRule) => {
    setEditingRule(rule)
    setAddEditOpen(true)
  }

  const handleSaveRule = (saved: AgentMarkupRule) => {
    setAgentRules((prev) => {
      const exists = prev.some((r) => r.id === saved.id)
      if (exists) {
        return prev.map((r) => (r.id === saved.id ? saved : r))
      }
      return [saved, ...prev]
    })
  }

  const handleToggleStatusConfirm = (ruleId: string) => {
    setAgentRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' }
          : r,
      ),
    )
  }

  const handleDeleteConfirm = (ruleId: string) => {
    setAgentRules((prev) => prev.filter((r) => r.id !== ruleId))
  }

  const handleViewDetails = (rule: AdminPricingRule | AgentMarkupRule) => {
    setSelectedRuleForDetails(rule)
    setDetailsOpen(true)
  }

  const handlePromptDelete = (rule: AgentMarkupRule) => {
    setSelectedRuleForDelete(rule)
    setDeleteOpen(true)
  }

  const handlePromptStatus = (rule: AgentMarkupRule) => {
    setSelectedRuleForStatus(rule)
    setStatusOpen(true)
  }

  const activeMarkupCount = agentRules.filter(
    (r) => r.status === 'active',
  ).length
  const inactiveMarkupCount = agentRules.length - activeMarkupCount
  const coverageCount = dynamicServiceModules.filter(
    (m) => m.hasAgentRule,
  ).length

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-row">
      {/* Sidebar */}
      <AgentPortalSidebar
        currentActive="Pricing & Markup"
        currentTab="Pricing & Markup"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activePath="/pricing-markup"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <AgentPortalHeader
          breadcrumbCurrent="Pricing & Markup"
          breadcrumbs={[
            { label: 'AeroWing Agent Portal', active: false },
            { label: 'Pricing & Markup', active: true },
          ]}
          onToggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Page Body Shell */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Page Header */}
          <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0267B8] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                  M2.3 + M2.4 · AGENT PORTAL
                </span>
                <span className="text-xs text-[#64748B]">Figma #710:21270</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001A3D] tracking-tight">
                Pricing & Markup
              </h1>

              <p className="text-sm text-[#475467] max-w-2xl leading-relaxed">
                Review pricing applied to your Agent account and manage your own
                client markup rules.
              </p>

              {/* Account Tag matching Figma #710:21906 */}
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-[#64748B]">
                  Account:
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#CBD5E1] text-[#001A3D] shadow-2xs">
                  <CheckCircle2 className="size-3.5 text-[#12B76A]" />
                  Skyline Demo Travels Ltd
                  <span className="text-[10px] text-[#0267B8] font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Sample data
                  </span>
                </span>
              </div>
            </div>

            {/* Action Buttons matching Figma #710:21913 */}
            <div className="flex items-center gap-3 self-start lg:self-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewOpen(true)}
                className="h-10 px-4 rounded-xl border-[#CBD5E1] bg-white text-[#001A3D] font-bold text-xs shadow-xs hover:bg-[#F8FAFC] hover:text-[#0267B8] flex items-center gap-2"
              >
                <Calculator className="size-4 text-[#0267B8]" />
                Pricing Preview
              </Button>

              <Button
                type="button"
                onClick={handleOpenAdd}
                className="h-10 px-4.5 rounded-xl bg-[#001A3D] hover:bg-[#012A5E] text-white font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <Plus className="size-4 text-[#F1C134]" />
                Add Markup Rule
              </Button>
            </div>
          </section>

          {/* 4 KPI Summary Cards matching Figma #710:21925 */}
          <PricingKpiCards
            adminConfigured={true}
            totalMarkupRules={agentRules.length}
            activeMarkupRules={activeMarkupCount}
            inactiveMarkupRules={inactiveMarkupCount}
            coverageCount={coverageCount}
            totalServices={8}
            supplierRulesCount={0}
          />

          {/* Search & Filter Toolbar matching Figma #710:21970 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  type="text"
                  placeholder="Search rules, service types, suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#F8FAFC] border-[#E2E8F0] text-sm font-semibold rounded-xl"
                />
              </div>

              {/* Filter 1: Rule Source */}
              <div className="w-full sm:w-44">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-bold rounded-xl text-[#001A3D]">
                    <SelectValue placeholder="Rule Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="admin">Admin Pricing</SelectItem>
                    <SelectItem value="agent">Your Markup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 2: Type */}
              <div className="w-full sm:w-44">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-bold rounded-xl text-[#001A3D]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count matching Figma #710:22021 */}
            <div className="text-xs text-[#64748B] font-medium self-end md:self-center">
              Showing{' '}
              <strong className="text-[#001A3D] font-extrabold">
                {totalVisibleRules}
              </strong>{' '}
              rules
            </div>
          </section>

          {/* Section 1: Applicable Pricing Table (Admin) matching Figma #710:22022 */}
          {(sourceFilter === 'all' || sourceFilter === 'admin') && (
            <ApplicablePricingTable
              rules={filteredAdminRules}
              onViewDetails={handleViewDetails}
            />
          )}

          {/* Section 2: Your Markup Rules Table matching Figma #710:22135 */}
          {(sourceFilter === 'all' || sourceFilter === 'agent') && (
            <AgentMarkupTable
              rules={filteredAgentRules}
              onAddRule={handleOpenAdd}
              onEditRule={handleEdit}
              onToggleStatus={handlePromptStatus}
              onDeleteRule={handlePromptDelete}
              onViewDetails={handleViewDetails}
            />
          )}

          {/* Section 3: Service Coverage Grid matching Figma #710:22309 */}
          <ServiceCoverageGrid modules={dynamicServiceModules} />

          {/* Section 4 & 5: How Pricing Works & Markup Limits matching Figma #710:22416 */}
          <HowPricingWorksCard />
        </main>

        {/* Footer matching Figma #710:22454 */}
        <footer className="mt-auto border-t border-[#E2E8F0] bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <span className="font-medium">
            AeroWing Agent Portal · M2.3 + M2.4 Agent Pricing & Markup Overview
            · Website
          </span>
          <span className="text-[11px] text-[#94A3B8]">
            Design prototype — no pricing engine, supplier system or quoting
            service is called.
          </span>
        </footer>
      </div>

      {/* Dialogs */}
      <PricingPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        adminRules={adminRules}
        agentRules={agentRules}
      />

      <MarkupRuleDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        rule={selectedRuleForDetails}
      />

      <AddEditMarkupDialog
        open={addEditOpen}
        onOpenChange={setAddEditOpen}
        existingRule={editingRule}
        onSaveRule={handleSaveRule}
      />

      <DeleteMarkupDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        rule={selectedRuleForDelete}
        onConfirmDelete={handleDeleteConfirm}
      />

      <ToggleStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        rule={selectedRuleForStatus}
        onConfirmToggle={handleToggleStatusConfirm}
      />
    </div>
  )
}

import * as React from 'react'
import {
  ArrowLeft,
  Search,
  CalendarDays,
  Users,
  Percent,
  Wallet,
  Coins,
  Check,
  CheckCircle2,
  Eye,
  Ban,
  Building2,
  SlidersHorizontal,
  Mail,
  Tag,
  Info,
  AlertTriangle,
  Clock,
  Lock,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { AgentPortalSidebar } from '#/components/agent-portal/agent-portal-sidebar'
import { AgentPortalHeader } from '#/components/agent-portal/agent-portal-header'
import { cn } from 'cn'

export type AccessPresetType = 'standard' | 'limited' | 'custom'

export type PermissionLevel = 'allowed' | 'view_only' | 'not_allowed'

export interface PermissionDefinition {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  standardDefault: PermissionLevel
  limitedDefault: PermissionLevel
  allowedOptions: PermissionLevel[]
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  {
    id: 'search-book',
    name: 'Search & Book',
    description: 'Search travel services and start bookings.',
    icon: Search,
    standardDefault: 'allowed',
    limitedDefault: 'allowed',
    allowedOptions: ['allowed', 'not_allowed'],
  },
  {
    id: 'view-own',
    name: 'View Own Bookings',
    description: 'View bookings created by this Sub-agent.',
    icon: CalendarDays,
    standardDefault: 'allowed',
    limitedDefault: 'allowed',
    allowedOptions: ['allowed', 'not_allowed'],
  },
  {
    id: 'customer-bookings',
    name: 'Customer Bookings',
    description: 'Work with bookings made on behalf of customers.',
    icon: Users,
    standardDefault: 'allowed',
    limitedDefault: 'not_allowed',
    allowedOptions: ['allowed', 'not_allowed'],
  },
  {
    id: 'pricing-markup',
    name: 'Pricing / Markup View',
    description: 'View applicable Agent pricing and markup information.',
    icon: Percent,
    standardDefault: 'view_only',
    limitedDefault: 'not_allowed',
    allowedOptions: ['view_only', 'not_allowed'],
  },
  {
    id: 'wallet-summary',
    name: 'Wallet Summary',
    description: 'View wallet-related summary information where permitted.',
    icon: Wallet,
    standardDefault: 'not_allowed',
    limitedDefault: 'not_allowed',
    allowedOptions: ['view_only', 'not_allowed'],
  },
  {
    id: 'commission-summary',
    name: 'Commission Summary',
    description: 'View commission summary information where permitted.',
    icon: Coins,
    standardDefault: 'not_allowed',
    limitedDefault: 'not_allowed',
    allowedOptions: ['view_only', 'not_allowed'],
  },
]

export function getPresetPermissions(
  preset: AccessPresetType,
): Record<string, PermissionLevel> {
  const result: Record<string, PermissionLevel> = {}
  for (const def of PERMISSION_DEFINITIONS) {
    if (preset === 'limited') {
      result[def.id] = def.limitedDefault
    } else {
      result[def.id] = def.standardDefault
    }
  }
  return result
}

export const PRESET_DISPLAY_NAMES: Record<AccessPresetType, string> = {
  standard: 'Standard Sub-agent Access',
  limited: 'Limited Access',
  custom: 'Custom Permissions',
}

export function formatPermissionLevel(level: PermissionLevel): string {
  switch (level) {
    case 'allowed':
      return 'Allowed'
    case 'view_only':
      return 'View only'
    case 'not_allowed':
      return 'Not allowed'
  }
}

export interface SubAgentPermissionsPageProps {
  deskId?: string
  deskName?: string
  agentBusiness?: string
  initialPreset?: AccessPresetType
  initialModal?: 'save' | 'discard'
  initialUnsavedChanges?: boolean
  onBack?: () => void
}

export function SubAgentPermissionsPage({
  deskId: _deskId = 'sa-mirpur-05',
  deskName = 'Mirpur Desk',
  agentBusiness = 'Skyline Demo Travels Ltd.',
  initialPreset = 'custom',
  initialModal,
  initialUnsavedChanges = true,
  onBack,
}: SubAgentPermissionsPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileMenuOpen((prev) => !prev)
    } else {
      setSidebarCollapsed((prev) => !prev)
    }
  }
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'permissions' | 'markup' | 'bookings' | 'performance'
  >('permissions')

  // Saved baseline state (Standard Sub-agent Access as per Figma #689:3507)
  const [savedPreset, setSavedPreset] =
    React.useState<AccessPresetType>('standard')
  const [savedPermissions, setSavedPermissions] = React.useState<
    Record<string, PermissionLevel>
  >(() => getPresetPermissions('standard'))

  // Working / Active state
  // Default to matching Figma 689:3507 where Custom Permissions has Customer Bookings and Pricing / Markup set to not_allowed
  const [preset, setPreset] = React.useState<AccessPresetType>(() => {
    return initialPreset
  })

  const [permissions, setPermissions] = React.useState<
    Record<string, PermissionLevel>
  >(() => {
    if (initialPreset === 'custom' || initialUnsavedChanges) {
      return {
        'search-book': 'allowed',
        'view-own': 'allowed',
        'customer-bookings': 'not_allowed', // Changed in design #689:3507
        'pricing-markup': 'not_allowed', // Changed in design #689:3507
        'wallet-summary': 'not_allowed',
        'commission-summary': 'not_allowed',
      }
    }
    return getPresetPermissions(initialPreset)
  })

  // Modal dialog states
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(
    initialModal === 'save',
  )
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(
    initialModal === 'discard',
  )

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const { isLoading: isSaving, run } = useActionLoading(saveDialogOpen)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Calculate detailed diffs between working configuration and saved baseline
  const diffItems = React.useMemo(() => {
    const list: Array<{
      id: string
      title: string
      from: string
      to: string
      isStrikethrough: boolean
    }> = []

    if (preset !== savedPreset) {
      list.push({
        id: 'preset',
        title: 'Access preset',
        from: PRESET_DISPLAY_NAMES[savedPreset],
        to: PRESET_DISPLAY_NAMES[preset],
        isStrikethrough: true,
      })
    }

    for (const def of PERMISSION_DEFINITIONS) {
      const savedVal = savedPermissions[def.id]
      const currentVal = permissions[def.id]
      if (savedVal !== currentVal) {
        list.push({
          id: def.id,
          title: def.name,
          from: formatPermissionLevel(savedVal),
          to: formatPermissionLevel(currentVal),
          isStrikethrough: savedVal === 'view_only',
        })
      }
    }

    return list
  }, [preset, savedPreset, permissions, savedPermissions])

  const isDirty = diffItems.length > 0

  // Selecting a preset from the radio cards
  const handleSelectPreset = (newPreset: AccessPresetType) => {
    setPreset(newPreset)
    if (newPreset !== 'custom') {
      setPermissions(getPresetPermissions(newPreset))
    }
  }

  // Customize permissions action button
  const handleCustomizeClick = () => {
    setPreset('custom')
  }

  // Update a single permission value in custom mode
  const handlePermissionChange = (permId: string, level: PermissionLevel) => {
    setPreset('custom')
    setPermissions((prev) => ({
      ...prev,
      [permId]: level,
    }))
  }

  // Confirm save
  const handleConfirmSave = () => {
    run(() => {
      setSavedPreset(preset)
      setSavedPermissions({ ...permissions })
      setSaveDialogOpen(false)
      showToast(`Permissions successfully updated for ${deskName}.`)
    })
  }

  // Confirm discard
  const handleConfirmDiscard = () => {
    setPreset(savedPreset)
    setPermissions({ ...savedPermissions })
    setDiscardDialogOpen(false)
    showToast('Changes discarded. Restored saved configuration.')
  }

  // Back navigation
  const handleGoBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.location.href = '/sub-agents/details?tab=overview'
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] text-[#141C2E] antialiased">
      {/* Sidebar: Desktop */}
      <AgentPortalSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        currentActive="Sub-agents"
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
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Sub-agents', active: false },
            { label: deskName, active: false },
            { label: 'Permissions', active: true },
          ]}
        />

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 xl:px-14 py-6 max-w-380 w-full mx-auto space-y-5">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-[#0E6A3D] text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-white/80 hover:text-white ml-4 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Back link */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors py-1 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Back to {deskName}</span>
            </button>
          </div>

          {/* Desk Header / Identity Section */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pb-1">
            {/* Avatar MD */}
            <div className="relative size-16 shrink-0 rounded-[18px] bg-[#E8EDF5] border border-[#D5DDE8] flex items-center justify-center shadow-xs">
              <span className="text-[22px] font-extrabold text-[#012A5E] tracking-tight">
                MD
              </span>
            </div>

            {/* Titles & Meta */}
            <div className="flex-1 space-y-1">
              <p className="text-xs font-extrabold text-[#0267B8] uppercase tracking-wider">
                {deskName} · M2.2 Sub-agent Permissions
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                Permissions
              </h1>
              <p className="text-sm font-semibold text-[#4F5B70]">
                Control what {deskName} can access and use under {agentBusiness}
              </p>

              {/* Tags Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <span className="text-xs font-extrabold text-[#012A5E]">
                  {deskName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EEF1F5] text-xs font-extrabold text-[#012A5E]">
                  <Building2 className="size-3 text-[#0267B8]" />
                  Sub-agent / Staff
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F5B70]">
                  <Mail className="size-3.5 text-[#9AA6B9]" />
                  mirpur.desk@example.com
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F2F5F9] border border-[#E6EAF0] text-[11px] font-bold text-[#5C677A]">
                  <Tag className="size-3 text-[#9AA6B9]" />
                  Sample data
                </span>
              </div>
            </div>
          </div>

          {/* Sub-agent Sections Tab Bar */}
          <div className="border-b border-[#DCE2EB] overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {[
                {
                  id: 'overview',
                  label: 'Overview',
                  icon: Eye,
                  href: '/sub-agents/details?tab=overview',
                },
                {
                  id: 'permissions',
                  label: 'Permissions',
                  icon: Lock,
                  href: '/sub-agents/permissions',
                },
                {
                  id: 'markup',
                  label: 'Markup',
                  icon: Percent,
                  href: '/sub-agents/details?tab=markup',
                },
                {
                  id: 'bookings',
                  label: 'Bookings',
                  icon: CalendarDays,
                  href: '/sub-agents/details?tab=bookings',
                },
                {
                  id: 'performance',
                  label: 'Performance',
                  icon: SlidersHorizontal,
                  href: '/sub-agents/details?tab=performance',
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                const IconComponent = tab.icon
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-3 text-sm font-extrabold border-b-[3px] transition-all cursor-pointer',
                      isActive
                        ? 'border-[#F1C134] text-[#012A5E] bg-white/40'
                        : 'border-transparent text-[#4F5B70] hover:text-[#012A5E] hover:border-[#DCE2EB]',
                    )}
                  >
                    <IconComponent
                      className={cn(
                        'size-4',
                        isActive ? 'text-[#012A5E]' : 'text-[#9AA6B9]',
                      )}
                    />
                    <span>{tab.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Info Banner: Permission Control */}
          <aside className="p-4 rounded-2xl bg-[#F2F8FE] border border-[#CFE3F6] flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center shrink-0">
              <Lock className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-[15px] font-extrabold text-[#012A5E]">
                Permission control
              </h2>
              <p className="text-[13.5px] font-semibold text-[#4F5B70]">
                Permissions determine which Agent Portal features this Sub-agent
                can access.
              </p>
              <p className="text-[12.5px] font-semibold text-[#5C677A]">
                Production access must also be enforced by the platform’s
                authorization layer.
              </p>
            </div>
          </aside>

          {/* Main Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (8 cols / ~68%) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Card 1: Access Preset */}
              <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                <div className="p-5 pb-3 border-b border-[#F4F6FA] flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#E8EDF5] text-[#0267B8] flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#012A5E]">
                      Access Preset
                    </h2>
                    <p className="text-xs font-semibold text-[#4F5B70]">
                      Start from a preset, or set each permission individually.
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <fieldset className="space-y-3">
                    <legend className="text-[13.5px] font-extrabold text-[#141B28] mb-2">
                      Access preset
                    </legend>

                    {/* Radio Cards Container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* 1. Standard Sub-agent Access */}
                      <div
                        onClick={() => handleSelectPreset('standard')}
                        className={cn(
                          'relative p-4 rounded-[14px] border transition-all cursor-pointer flex flex-col justify-between gap-3',
                          preset === 'standard'
                            ? 'bg-[#F7FAFE] border-[#012A5E] ring-2 ring-[#012A5E]'
                            : 'bg-white border-[#D5DDE8] hover:border-[#0267B8]/40 hover:bg-[#F4F6FA]/50',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Radio circle */}
                          <div
                            className={cn(
                              'size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                              preset === 'standard'
                                ? 'border-[#012A5E]'
                                : 'border-[#9AA6B9]',
                            )}
                          >
                            {preset === 'standard' && (
                              <div className="size-2.5 rounded-full bg-[#012A5E]" />
                            )}
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <p className="text-[14px] font-extrabold text-[#141B28] leading-tight">
                              Standard Sub-agent Access
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-[#FFF6DC] text-[#7A4A06] text-[10.5px] font-extrabold">
                                Recommended
                              </span>
                              {savedPreset === 'standard' && (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-[#E6F4EC] text-[#0E6A3D] text-[10.5px] font-extrabold">
                                  Saved
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-[12px] font-semibold text-[#4F5B70] leading-snug pl-8">
                          Search, book and manage their own customer bookings.
                        </p>
                      </div>

                      {/* 2. Limited Access */}
                      <div
                        onClick={() => handleSelectPreset('limited')}
                        className={cn(
                          'relative p-4 rounded-[14px] border transition-all cursor-pointer flex flex-col justify-between gap-3',
                          preset === 'limited'
                            ? 'bg-[#F7FAFE] border-[#012A5E] ring-2 ring-[#012A5E]'
                            : 'bg-white border-[#D5DDE8] hover:border-[#0267B8]/40 hover:bg-[#F4F6FA]/50',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                              preset === 'limited'
                                ? 'border-[#012A5E]'
                                : 'border-[#9AA6B9]',
                            )}
                          >
                            {preset === 'limited' && (
                              <div className="size-2.5 rounded-full bg-[#012A5E]" />
                            )}
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <p className="text-[14px] font-extrabold text-[#141B28] leading-tight">
                              Limited Access
                            </p>
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded-full bg-[#EEF1F5] text-[#5C677A] text-[10.5px] font-extrabold">
                                Demo preset
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[12px] font-semibold text-[#4F5B70] leading-snug pl-8">
                          Search, book and see their own bookings only.
                        </p>
                      </div>

                      {/* 3. Custom Permissions */}
                      <div
                        onClick={() => handleSelectPreset('custom')}
                        className={cn(
                          'relative p-4 rounded-[14px] border transition-all cursor-pointer flex flex-col justify-between gap-3',
                          preset === 'custom'
                            ? 'bg-[#F7FAFE] border-[#012A5E] ring-2 ring-[#012A5E]'
                            : 'bg-white border-[#D5DDE8] hover:border-[#0267B8]/40 hover:bg-[#F4F6FA]/50',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                              preset === 'custom'
                                ? 'border-[#012A5E]'
                                : 'border-[#9AA6B9]',
                            )}
                          >
                            {preset === 'custom' && (
                              <div className="size-2.5 rounded-full bg-[#012A5E]" />
                            )}
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <p className="text-[14px] font-extrabold text-[#141B28] leading-tight">
                              Custom Permissions
                            </p>
                          </div>
                        </div>

                        <p className="text-[12px] font-semibold text-[#4F5B70] leading-snug pl-8">
                          Set each permission individually.
                        </p>
                      </div>
                    </div>
                  </fieldset>

                  {/* Informational footnote */}
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-[#4F5B70]">
                    <Info className="size-4 text-[#9AA6B9] shrink-0" />
                    <span>
                      Preset definitions shown here are design-stage defaults
                      and can be finalized during implementation.
                    </span>
                  </div>
                </div>
              </section>

              {/* Card 2: Portal Permissions */}
              <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                <div className="p-5 pb-3 border-b border-[#F4F6FA] flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#E8EDF5] text-[#0267B8] flex items-center justify-center shrink-0">
                    <Lock className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#012A5E]">
                      Portal Permissions
                    </h2>
                    <p className="text-xs font-semibold text-[#4F5B70]">
                      Six permissions from the approved Sub-agent screens.
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Sub-header with preset status & customize button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <p className="text-xs font-bold text-[#4F5B70]">
                      {preset === 'custom'
                        ? 'Custom Permissions: choose the access for each permission.'
                        : `${PRESET_DISPLAY_NAMES[preset]} · read-only preset values`}
                    </p>

                    {preset !== 'custom' && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCustomizeClick}
                        className="h-9 px-3.5 rounded-[10px] text-xs font-extrabold border-[#C2CCDA] text-[#012A5E] bg-white hover:bg-[#F4F6FA] cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <SlidersHorizontal className="size-3.5" />
                        <span>Customize permissions</span>
                      </Button>
                    )}
                  </div>

                  {/* Permissions Container Table */}
                  <div className="rounded-[16px] border border-[#E6EAF0] overflow-hidden divide-y divide-[#EEF1F5] bg-white">
                    {PERMISSION_DEFINITIONS.map((perm) => {
                      const IconComp = perm.icon
                      const currentLevel = permissions[perm.id]
                      const isChanged =
                        currentLevel !== savedPermissions[perm.id]

                      return (
                        <div
                          key={perm.id}
                          className={cn(
                            'p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 transition-colors',
                            isChanged
                              ? 'bg-[#FFFDF5] border-l-[3.5px] border-l-[#F1C134]'
                              : 'hover:bg-[#F9FAFC]',
                          )}
                        >
                          {/* Left: Icon + Titles */}
                          <div className="flex items-center gap-3.5">
                            <div className="size-10 rounded-[12px] bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center shrink-0">
                              <IconComp className="size-5" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <p className="text-[14.5px] font-extrabold text-[#141B28] leading-tight">
                                  {perm.name}
                                </p>
                                {isChanged && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[10.5px] font-extrabold">
                                    Changed
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-[#4F5B70] leading-snug">
                                {perm.description}
                              </p>
                            </div>
                          </div>

                          {/* Right: Segmented Control / Toggle or Read-only Status */}
                          <div className="self-end sm:self-center shrink-0">
                            {preset === 'custom' ? (
                              <div className="inline-flex rounded-lg border border-[#D5DDE8] bg-[#F4F6FA] p-0.5 gap-0.5 text-xs font-bold shadow-2xs">
                                {perm.allowedOptions.includes('allowed') && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePermissionChange(perm.id, 'allowed')
                                    }
                                    className={cn(
                                      'px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 text-xs',
                                      currentLevel === 'allowed'
                                        ? 'bg-white text-[#012A5E] shadow-xs font-extrabold border border-[#E2E8F0]'
                                        : 'text-[#4F5B70] hover:text-[#012A5E]',
                                    )}
                                  >
                                    <Check className="size-3.5 text-[#0E6A3D] stroke-[2.5]" />
                                    <span>Allowed</span>
                                  </button>
                                )}

                                {perm.allowedOptions.includes('view_only') && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePermissionChange(
                                        perm.id,
                                        'view_only',
                                      )
                                    }
                                    className={cn(
                                      'px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 text-xs',
                                      currentLevel === 'view_only'
                                        ? 'bg-white text-[#012A5E] shadow-xs font-extrabold border border-[#E2E8F0]'
                                        : 'text-[#4F5B70] hover:text-[#012A5E]',
                                    )}
                                  >
                                    <Eye className="size-3.5 text-[#01559A]" />
                                    <span>View only</span>
                                  </button>
                                )}

                                {perm.allowedOptions.includes(
                                  'not_allowed',
                                ) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePermissionChange(
                                        perm.id,
                                        'not_allowed',
                                      )
                                    }
                                    className={cn(
                                      'px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 text-xs',
                                      currentLevel === 'not_allowed'
                                        ? 'bg-white text-[#012A5E] shadow-xs font-extrabold border border-[#E2E8F0]'
                                        : 'text-[#4F5B70] hover:text-[#012A5E]',
                                    )}
                                  >
                                    <Ban className="size-3.5 text-[#5C677A]" />
                                    <span>Not allowed</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div>
                                {currentLevel === 'allowed' && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E6F4EC] text-[#0E6A3D] text-[12.5px] font-extrabold">
                                    <Check className="size-3.5 stroke-[2.5]" />
                                    Allowed
                                  </span>
                                )}
                                {currentLevel === 'view_only' && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF4FD] text-[#01559A] text-[12.5px] font-extrabold">
                                    <Eye className="size-3.5" />
                                    View only
                                  </span>
                                )}
                                {currentLevel === 'not_allowed' && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EEF1F5] text-[#4F5B70] text-[12.5px] font-extrabold">
                                    <Ban className="size-3.5" />
                                    Not allowed
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Dashed Border Note Box */}
                  <div className="p-3.5 rounded-[14px] bg-[#F6F8FB] border border-[#D5DDE8] border-dashed space-y-1 text-[12.5px] leading-relaxed">
                    <p className="font-extrabold text-[#141B28]">
                      Not part of Sub-agent permissions:
                    </p>
                    <p className="font-semibold text-[#4F5B70]">
                      creating or managing Sub-agents, wallet top-up, credit
                      requests, credit limits, statements, detailed reports,
                      commission rules, Parent Agent settings and
                      administration. Pricing / Markup View is view-only and
                      never lets a Sub-agent set markup rules. Wallet Summary is
                      visibility only.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column (4 cols / ~32%) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Card 1: Changes */}
              <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                <div className="p-5 pb-3 border-b border-[#F4F6FA] flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#FFF6DC] text-[#7A4A06] flex items-center justify-center shrink-0">
                    <Clock className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#012A5E]">
                      Changes
                    </h2>
                    <p className="text-xs font-semibold text-[#4F5B70]">
                      Nothing is saved until you choose Save Changes.
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-3.5">
                  {/* Status Indicator */}
                  <div>
                    {isDirty ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-extrabold">
                        <AlertTriangle className="size-3.5 fill-[#92400E] text-[#FEF3C7]" />
                        Unsaved changes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4EC] text-[#0E6A3D] text-xs font-extrabold">
                        <Check className="size-3.5 stroke-[2.5]" />
                        No unsaved changes
                      </span>
                    )}
                  </div>

                  {/* Changes to Review Section (matching Figma #689:3507) */}
                  {isDirty ? (
                    <div className="space-y-2.5 pt-1">
                      <p className="text-[13px] font-extrabold text-[#012A5E]">
                        Changes to Review
                      </p>
                      <div className="space-y-2">
                        {diffItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#FFFDF5] border border-[#FDE68A] rounded-[12px] p-3 space-y-1 text-xs"
                          >
                            <p className="font-extrabold text-[#141B28]">
                              {item.title}
                            </p>
                            <div className="font-semibold text-[#4F5B70] flex items-center gap-1.5 flex-wrap">
                              {item.isStrikethrough ? (
                                <del className="text-[#64748B] decoration-[#94A3B8]">
                                  {item.from}
                                </del>
                              ) : (
                                <span>{item.from}</span>
                              )}
                              <span className="text-[#94A3B8]">→</span>
                              <span className="font-extrabold text-[#012A5E]">
                                {item.to}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed text-[#4F5B70]">
                      Saved configuration:{' '}
                      <strong className="text-[#141B28] font-extrabold">
                        {PRESET_DISPLAY_NAMES[savedPreset]}
                      </strong>
                    </p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-3 border-t border-[#EEF1F5] flex flex-col gap-2.5 bg-[#FAFBFD]/40">
                  {/* Save Changes button */}
                  <Button
                    type="button"
                    onClick={() => setSaveDialogOpen(true)}
                    disabled={!isDirty}
                    className={cn(
                      'w-full h-11 rounded-[10px] text-[14.5px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2',
                      isDirty
                        ? 'bg-[#F1C134] text-[#012A5E] hover:bg-[#e6b527] shadow-[0_4px_14px_rgba(241,193,52,0.6)] opacity-100'
                        : 'bg-[#F1C134] text-[#012A5E] opacity-55 cursor-not-allowed hover:bg-[#F1C134]',
                    )}
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Save Changes</span>
                  </Button>

                  {/* Discard Changes button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDiscardDialogOpen(true)}
                    disabled={!isDirty}
                    className={cn(
                      'w-full h-11 rounded-[10px] text-[14.5px] font-extrabold transition-all border-[#C2CCDA] text-[#012A5E] bg-white flex items-center justify-center gap-2',
                      isDirty
                        ? 'hover:bg-[#F4F6FA] opacity-100 cursor-pointer'
                        : 'opacity-55 cursor-not-allowed hover:bg-white',
                    )}
                  >
                    <span>Discard Changes</span>
                  </Button>
                </div>
              </section>

              {/* Card 2: Parent Agent / Relationship Card */}
              <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                <div className="p-5 pb-3 border-b border-[#F4F6FA] flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-[14.5px] font-extrabold text-[#012A5E] leading-snug">
                      {deskName} remains under {agentBusiness}
                    </h2>
                  </div>
                </div>

                <div className="p-5 pt-3">
                  <p className="text-xs font-semibold text-[#4F5B70] leading-relaxed">
                    Sub-agent access does not create a separate Agent account,
                    wallet or credit limit.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Global Page Footer */}
        <footer className="mt-8 border-t border-[#E3E8EF] bg-white px-6 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#4F5B70] font-semibold">
          <span>
            AeroWing Agent Portal · M2.2 / M2.13 Sub-agent Access & Configurable
            Permissions · Sub-agent Permissions
          </span>
          <span className="text-center md:text-right">
            Website only · configuration prototype — real access is enforced by
            the platform's authorization layer, not by this page.
          </span>
        </footer>
      </div>

      {/* Save Changes Modal Dialog (#689:3508) */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border-[#DCE2EB] p-6 shadow-2xl">
          <DialogHeader className="gap-2">
            <div className="size-10 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
              <Lock className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
                Save permission changes?
              </DialogTitle>
              <DialogDescription className="text-xs text-[#4F5B70] mt-1">
                These changes will update the access configured for {deskName}.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs font-bold text-[#0267B8]">
              {diffItems.filter((d) => d.id !== 'preset').length} permissions
              changed · access preset changed
            </p>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {diffItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFFDF5] border border-[#FDE68A] rounded-[12px] p-3 space-y-1 text-xs"
                >
                  <p className="font-extrabold text-[#141B28]">{item.title}</p>
                  <div className="font-semibold text-[#4F5B70] flex items-center gap-1.5 flex-wrap">
                    {item.isStrikethrough ? (
                      <del className="text-[#64748B] decoration-[#94A3B8]">
                        {item.from}
                      </del>
                    ) : (
                      <span>{item.from}</span>
                    )}
                    <span className="text-[#94A3B8]">→</span>
                    <span className="font-extrabold text-[#012A5E]">
                      {item.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              className="border-[#C2CCDA] text-[#012A5E] hover:bg-[#F4F6FA] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSave}
              loading={isSaving}
              loadingText="Saving..."
              className="bg-[#F1C134] text-[#012A5E] hover:bg-[#e6b527] font-extrabold cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(241,193,52,0.4)]"
            >
              <CheckCircle2 className="size-4" />
              <span>Save Changes</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discard Changes Modal Dialog (#689:3510) */}
      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border-[#DCE2EB] p-6 shadow-2xl">
          <DialogHeader className="gap-2">
            <div className="size-10 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
                Discard unsaved changes?
              </DialogTitle>
              <DialogDescription className="text-xs text-[#4F5B70] mt-1">
                Your {diffItems.length} unsaved changes will be removed and the
                last saved configuration restored.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDiscardDialogOpen(false)}
              className="border-[#C2CCDA] text-[#012A5E] hover:bg-[#F4F6FA] cursor-pointer"
            >
              Keep Editing
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDiscard}
              className="bg-[#F1C134] text-[#012A5E] hover:bg-[#e6b527] font-extrabold cursor-pointer"
            >
              <span>Discard Changes</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

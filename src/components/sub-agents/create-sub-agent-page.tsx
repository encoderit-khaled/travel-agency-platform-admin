import * as React from 'react'
import {
  ArrowLeft,
  Info,
  Building2,
  Lock,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  X,
  Eye,
  Percent,
  Wallet,
  Sparkles,
  Plane,
  Calendar,
  Users,
  Tag,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  AgentPortalSidebar,
  AgentPortalHeader,
} from '#/components/agent-portal'
import { SubAgentPermissionsModal } from './sub-agent-permissions-modal'
import { SubAgentCreatedDialog } from './sub-agent-created-dialog'
import { INITIAL_SUB_AGENT_DATA } from './data'
import type {
  CreateSubAgentFormData,
  MarkupType,
  PermissionPreset,
  PermissionStatus,
} from './types'

export function CreateSubAgentPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [permissionsModalOpen, setPermissionsModalOpen] = React.useState(false)
  const [createdSuccessOpen, setCreatedSuccessOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState<CreateSubAgentFormData>(
    INITIAL_SUB_AGENT_DATA,
  )

  // References for smooth scrolling from Review edit buttons
  const sectionRefs = {
    displayName: React.useRef<HTMLInputElement>(null),
    loginEmail: React.useRef<HTMLInputElement>(null),
    contactPerson: React.useRef<HTMLInputElement>(null),
    mobile: React.useRef<HTMLInputElement>(null),
    permissions: React.useRef<HTMLDivElement>(null),
    markup: React.useRef<HTMLDivElement>(null),
  }

  const scrollToField = (field: keyof typeof sectionRefs) => {
    const el = sectionRefs[field].current
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.focus()
    }
  }

  const handlePresetChange = (preset: PermissionPreset) => {
    if (preset === 'standard') {
      setFormData((prev) => ({
        ...prev,
        permissionPreset: 'standard',
        customPermissions: {
          search_book: 'allowed',
          view_own_bookings: 'allowed',
          customer_bookings: 'allowed',
          pricing_markup: 'view_only',
          wallet_summary: 'not_allowed',
          commission_summary: 'not_allowed',
        },
      }))
    } else if (preset === 'limited') {
      setFormData((prev) => ({
        ...prev,
        permissionPreset: 'limited',
        customPermissions: {
          search_book: 'allowed',
          view_own_bookings: 'allowed',
          customer_bookings: 'not_allowed',
          pricing_markup: 'not_allowed',
          wallet_summary: 'not_allowed',
          commission_summary: 'not_allowed',
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        permissionPreset: 'custom',
      }))
      setPermissionsModalOpen(true)
    }
  }

  const handleCustomPermissionsSave = (
    updated: Record<string, PermissionStatus>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissionPreset: 'custom',
      customPermissions: updated,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCreatedSuccessOpen(true)
  }

  // Get active permission item status helper
  const getPermStatus = (id: string): PermissionStatus => {
    return formData.customPermissions[id] ?? 'not_allowed'
  }

  const renderBadgeForStatus = (status: PermissionStatus) => {
    if (status === 'allowed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EC] text-[#0E7A3E]">
          <Check className="size-3 stroke-[2.5]" />
          Allowed
        </span>
      )
    }
    if (status === 'view_only') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4FD] text-[#0267B8]">
          <Eye className="size-3" />
          View only
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF1F5] text-[#4F5B70]">
        <X className="size-3" />
        Not allowed
      </span>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#F4F6FA] text-[#141B28]">
      {/* Sidebar */}
      <AgentPortalSidebar
        currentActive="Sub-agents"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <AgentPortalHeader
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          breadcrumbCurrent="Create Sub-agent"
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 max-w-7xl w-full mx-auto">
          {/* Back button */}
          <div className="mb-4">
            <Link
              to="/sub-agents"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#012A5E] hover:text-[#0267B8] transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-white/80"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Sub-agents</span>
            </Link>
          </div>

          {/* Page Heading Section */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4F5B70]">
              Agent Portal · M2.2 Sub-agents
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
              Add Sub-agent
            </h1>
            <p className="text-xs sm:text-sm text-[#4F5B70]">
              Create a Sub-agent account and define the access they will have
              under your Agent account.
            </p>

            {/* Context bar badges */}
            <div className="flex flex-wrap items-center gap-2.5 mt-1 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E6EAF0] text-xs shadow-2xs">
                <span className="size-5 rounded-full bg-[#F1C134] text-[#012A5E] font-extrabold text-[10px] flex items-center justify-center">
                  SD
                </span>
                <span className="text-[#4F5B70]">Parent Agent:</span>
                <strong className="text-[#012A5E] font-bold">
                  Skyline Demo Travels Ltd
                </strong>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBEFF5] border border-[#E6EAF0] text-[11px] text-[#4F5B70]">
                <Sparkles className="size-3.5 text-[#0267B8]" />
                <span>Sample data for design preview</span>
              </div>
            </div>
          </div>

          {/* Form and Review Grid */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Form Details (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
              {/* Callout Notice */}
              <aside className="p-4 rounded-2xl bg-[#EAF4FD] border border-[#D0E4FA] flex items-start gap-3.5 shadow-2xs">
                <div className="size-8 rounded-xl bg-white text-[#0267B8] flex items-center justify-center shrink-0 shadow-2xs border border-[#D0E4FA]">
                  <Info className="size-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-xs font-extrabold text-[#012A5E]">
                    About Sub-agents
                  </h2>
                  <p className="text-xs text-[#4F5B70] leading-relaxed">
                    Each Sub-agent has their own login and permissions. Their
                    bookings are settled against your Agent account's wallet and
                    available credit.
                  </p>
                </div>
              </aside>

              {/* SECTION 1: Sub-agent Details */}
              <section
                id="s-det"
                className="bg-white rounded-2xl border border-[#E6EAF0] p-5 sm:p-6 shadow-xs flex flex-col gap-5"
              >
                {/* Section Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <span className="size-7 rounded-xl bg-[#FFF6DC] text-[#7A4A06] font-extrabold text-sm flex items-center justify-center border border-[#F1C134]/30 shadow-2xs">
                      1
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-[#012A5E]">
                        Sub-agent Details
                      </h2>
                      <p className="text-xs text-[#4F5B70]">
                        Only what's needed to identify this Sub-agent.
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[11px] px-2 py-0.5 bg-[#F4F6FA] text-[#4F5B70] border-[#E6EAF0]"
                  >
                    Sample data
                  </Badge>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Field: Display Name */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="f-name"
                        className="text-xs font-bold text-[#141B28]"
                      >
                        Display Name
                      </label>
                      <Badge className="text-[10px] px-1.5 py-0 bg-[#EAF4FD] text-[#0267B8] border-transparent font-semibold">
                        Required
                      </Badge>
                    </div>
                    <Input
                      id="f-name"
                      ref={sectionRefs.displayName}
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                      placeholder="e.g. Apex Holidays — Banani Branch"
                      className="h-10 text-xs bg-white border-[#DCE2EB] rounded-xl focus-visible:border-[#0267B8]"
                      required
                    />
                    <span className="text-[11px] text-[#4F5B70]">
                      Shown in your Sub-agent list, for example a branch or desk
                      name.
                    </span>
                  </div>

                  {/* Field: Contact Person */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="f-cp"
                        className="text-xs font-bold text-[#141B28]"
                      >
                        Contact Person
                      </label>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 bg-[#EEF1F5] text-[#4F5B70] border-transparent font-semibold"
                      >
                        Optional
                      </Badge>
                    </div>
                    <Input
                      id="f-cp"
                      ref={sectionRefs.contactPerson}
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactPerson: e.target.value,
                        }))
                      }
                      placeholder="Primary user and account holder name"
                      className="h-10 text-xs bg-white border-[#DCE2EB] rounded-xl focus-visible:border-[#0267B8]"
                    />
                    <span className="text-[11px] text-[#4F5B70]">
                      Full legal name of the person responsible for this desk.
                    </span>
                  </div>

                  {/* Field: Mobile Number */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="f-mob"
                        className="text-xs font-bold text-[#141B28]"
                      >
                        Mobile Number
                      </label>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 bg-[#EEF1F5] text-[#4F5B70] border-transparent font-semibold"
                      >
                        Optional
                      </Badge>
                    </div>
                    <Input
                      id="f-mob"
                      ref={sectionRefs.mobile}
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mobileNumber: e.target.value,
                        }))
                      }
                      placeholder="+880 1555 080910"
                      className="h-10 text-xs bg-white border-[#DCE2EB] rounded-xl focus-visible:border-[#0267B8]"
                    />
                    <span className="text-[11px] text-[#4F5B70]">
                      Primary mobile number for notifications and verification.
                    </span>
                  </div>

                  {/* Field: Internal Note */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="f-note"
                        className="text-xs font-bold text-[#141B28]"
                      >
                        Internal Note
                      </label>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 bg-[#EEF1F5] text-[#4F5B70] border-transparent font-semibold"
                      >
                        Optional
                      </Badge>
                    </div>
                    <Textarea
                      id="f-note"
                      value={formData.internalNote}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          internalNote: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder="Visible only within your Agent account..."
                      className="text-xs bg-white border-[#DCE2EB] rounded-xl resize-none focus-visible:border-[#0267B8]"
                    />
                    <span className="text-[11px] text-[#4F5B70] flex items-center gap-1">
                      <Lock className="size-3 text-[#9AA6B9]" />
                      Visible only within your Agent account. Not shown to the
                      Sub-agent.
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Login & Access */}
              <section
                id="s-log"
                className="bg-white rounded-2xl border border-[#E6EAF0] p-5 sm:p-6 shadow-xs flex flex-col gap-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <span className="size-7 rounded-xl bg-[#FFF6DC] text-[#7A4A06] font-extrabold text-sm flex items-center justify-center border border-[#F1C134]/30 shadow-2xs">
                      2
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-[#012A5E]">
                        Login & Access
                      </h2>
                      <p className="text-xs text-[#4F5B70]">
                        Each Sub-agent signs in with their own login email.
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[11px] px-2 py-0.5 bg-[#F4F6FA] text-[#4F5B70] border-[#E6EAF0]"
                  >
                    Sample data
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Login Email */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="f-em"
                        className="text-xs font-bold text-[#141B28]"
                      >
                        Login Email
                      </label>
                      <Badge className="text-[10px] px-1.5 py-0 bg-[#EAF4FD] text-[#0267B8] border-transparent font-semibold">
                        Required
                      </Badge>
                    </div>
                    <Input
                      id="f-em"
                      ref={sectionRefs.loginEmail}
                      type="email"
                      value={formData.loginEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          loginEmail: e.target.value,
                        }))
                      }
                      placeholder="mirpur.desk@example.com"
                      className="h-10 text-xs bg-white border-[#DCE2EB] rounded-xl focus-visible:border-[#0267B8]"
                      required
                    />
                    <span className="text-[11px] text-[#4F5B70]">
                      The Sub-agent will use this address as their login
                      username.
                    </span>
                  </div>

                  {/* Login Status */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#141B28]">
                      Login Status
                    </label>
                    <div className="h-10 px-3 rounded-xl bg-[#F4F6FA] border border-[#E6EAF0] flex items-center justify-between">
                      <span className="text-xs text-[#4F5B70]">
                        Initial account state
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEF1F5] text-[#4F5B70]">
                        <span className="size-2 rounded-full bg-[#9AA6B9]" />
                        Not created
                      </span>
                    </div>
                    <span className="text-[11px] text-[#4F5B70]">
                      Activation password link is generated after creation.
                    </span>
                  </div>
                </div>

                {/* Info Note Banner */}
                <div className="p-3.5 rounded-xl bg-[#F4F6FA] border border-[#E6EAF0] flex items-start gap-2.5 text-xs text-[#4F5B70]">
                  <Info className="size-4 shrink-0 text-[#0267B8] mt-0.5" />
                  <span>
                    Login credentials will be handled according to the
                    configured account invitation and activation flow.
                  </span>
                </div>
              </section>

              {/* SECTION 3: Permissions */}
              <section
                id="s-perm"
                ref={sectionRefs.permissions}
                className="bg-white rounded-2xl border border-[#E6EAF0] p-5 sm:p-6 shadow-xs flex flex-col gap-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <span className="size-7 rounded-xl bg-[#FFF6DC] text-[#7A4A06] font-extrabold text-sm flex items-center justify-center border border-[#F1C134]/30 shadow-2xs">
                      3
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-[#012A5E]">
                        Permissions
                      </h2>
                      <p className="text-xs text-[#4F5B70]">
                        Choose what this Sub-agent can access and manage.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Access Options Grid */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141B28]">
                      Access option
                    </span>
                    <Badge className="text-[10px] px-1.5 py-0 bg-[#EAF4FD] text-[#0267B8] border-transparent font-semibold">
                      Required
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Option 1: Standard Access (Suggested) */}
                    <div
                      onClick={() => handlePresetChange('standard')}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 relative ${
                        formData.permissionPreset === 'standard'
                          ? 'border-[#012A5E] bg-[#F7FAFE] ring-1 ring-[#012A5E]/20 shadow-xs'
                          : 'border-[#E6EAF0] bg-white hover:border-[#D0E4FA] hover:bg-[#FAFBFD]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="perm-preset"
                            checked={formData.permissionPreset === 'standard'}
                            onChange={() => handlePresetChange('standard')}
                            className="size-4 text-[#012A5E] accent-[#012A5E]"
                          />
                          <span className="text-xs font-bold text-[#141B28]">
                            Standard Sub-agent Access
                          </span>
                        </div>
                      </div>
                      <div className="pl-6">
                        <Badge className="text-[10px] px-1.5 py-0 bg-[#FFF6DC] text-[#7A4A06] border-[#F1C134]/40 font-bold mb-1">
                          Suggested
                        </Badge>
                        <p className="text-[11px] text-[#4F5B70] leading-snug">
                          Search, book and manage their own customers and
                          bookings.
                        </p>
                      </div>
                    </div>

                    {/* Option 2: Limited Access */}
                    <div
                      onClick={() => handlePresetChange('limited')}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                        formData.permissionPreset === 'limited'
                          ? 'border-[#012A5E] bg-[#F7FAFE] ring-1 ring-[#012A5E]/20 shadow-xs'
                          : 'border-[#E6EAF0] bg-white hover:border-[#D0E4FA] hover:bg-[#FAFBFD]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="perm-preset"
                          checked={formData.permissionPreset === 'limited'}
                          onChange={() => handlePresetChange('limited')}
                          className="size-4 text-[#012A5E] accent-[#012A5E]"
                        />
                        <span className="text-xs font-bold text-[#141B28]">
                          Limited Access
                        </span>
                      </div>
                      <div className="pl-6">
                        <p className="text-[11px] text-[#4F5B70] leading-snug">
                          Search, book and see their own bookings only.
                        </p>
                      </div>
                    </div>

                    {/* Option 3: Custom Permissions */}
                    <div
                      onClick={() => handlePresetChange('custom')}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                        formData.permissionPreset === 'custom'
                          ? 'border-[#012A5E] bg-[#F7FAFE] ring-1 ring-[#012A5E]/20 shadow-xs'
                          : 'border-[#E6EAF0] bg-white hover:border-[#D0E4FA] hover:bg-[#FAFBFD]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="perm-preset"
                          checked={formData.permissionPreset === 'custom'}
                          onChange={() => handlePresetChange('custom')}
                          className="size-4 text-[#012A5E] accent-[#012A5E]"
                        />
                        <span className="text-xs font-bold text-[#141B28]">
                          Custom Permissions
                        </span>
                      </div>
                      <div className="pl-6">
                        <p className="text-[11px] text-[#4F5B70] leading-snug">
                          Choose each area for this Sub-agent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permission Preview Box */}
                <div className="rounded-2xl bg-[#FAFBFD] border border-[#E6EAF0] p-4 flex flex-col gap-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#E6EAF0]">
                    <div>
                      <h3 className="text-xs font-extrabold text-[#012A5E]">
                        Permission preview ·{' '}
                        {formData.permissionPreset === 'standard'
                          ? 'Standard Sub-agent Access'
                          : formData.permissionPreset === 'limited'
                            ? 'Limited Access'
                            : 'Custom Permissions'}
                      </h3>
                      <p className="text-[11px] text-[#4F5B70]">
                        Demo UI states for design review, not the final
                        permission engine.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPermissionsModalOpen(true)}
                      className="rounded-xl border-[#012A5E]/30 bg-white text-[#012A5E] hover:bg-[#EAF4FD] font-bold text-xs h-8.5 px-3 self-start sm:self-center"
                    >
                      <SlidersHorizontal className="size-3.5 mr-1.5" />
                      Configure Permissions
                    </Button>
                  </div>

                  {/* 2-column list of permissions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {/* Item 1: Search & Book */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E6EAF0]">
                      <span className="flex items-center gap-2 font-semibold text-[#141B28]">
                        <Plane className="size-3.5 text-[#0267B8]" />
                        Search & Book
                      </span>
                      {renderBadgeForStatus(getPermStatus('search_book'))}
                    </div>

                    {/* Item 2: View Own Bookings */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E6EAF0]">
                      <span className="flex items-center gap-2 font-semibold text-[#141B28]">
                        <Calendar className="size-3.5 text-[#0267B8]" />
                        View Own Bookings
                      </span>
                      {renderBadgeForStatus(getPermStatus('view_own_bookings'))}
                    </div>

                    {/* Item 3: Customer Bookings */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E6EAF0]">
                      <span className="flex items-center gap-2 font-semibold text-[#141B28]">
                        <Users className="size-3.5 text-[#0267B8]" />
                        Customer Bookings
                      </span>
                      {renderBadgeForStatus(getPermStatus('customer_bookings'))}
                    </div>

                    {/* Item 4: Pricing / Markup View */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E6EAF0]">
                      <span className="flex items-center gap-2 font-semibold text-[#141B28]">
                        <Tag className="size-3.5 text-[#0267B8]" />
                        Pricing / Markup View
                      </span>
                      {renderBadgeForStatus(getPermStatus('pricing_markup'))}
                    </div>

                    {/* Item 5: Wallet Summary */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E6EAF0]">
                      <span className="flex items-center gap-2 font-semibold text-[#141B28]">
                        <Wallet className="size-3.5 text-[#0267B8]" />
                        Wallet Summary
                      </span>
                      {renderBadgeForStatus(getPermStatus('wallet_summary'))}
                    </div>

                    {/* Item 6: Commission Summary */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E6EAF0]">
                      <span className="flex items-center gap-2 font-semibold text-[#141B28]">
                        <Percent className="size-3.5 text-[#0267B8]" />
                        Commission Summary
                      </span>
                      {renderBadgeForStatus(
                        getPermStatus('commission_summary'),
                      )}
                    </div>
                  </div>

                  {/* Note below */}
                  <p className="text-[11px] text-[#4F5B70] pt-1">
                    <strong className="text-[#141B28]">
                      Not included at creation:
                    </strong>{' '}
                    wallet top-up, credit requests, commissions payout and
                    parent agent profile management.
                  </p>
                </div>
              </section>

              {/* SECTION 4: Sub-agent Markup */}
              <section
                id="s-mk"
                ref={sectionRefs.markup}
                className="bg-white rounded-2xl border border-[#E6EAF0] p-5 sm:p-6 shadow-xs flex flex-col gap-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <span className="size-7 rounded-xl bg-[#FFF6DC] text-[#7A4A06] font-extrabold text-sm flex items-center justify-center border border-[#F1C134]/30 shadow-2xs">
                      4
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-[#012A5E]">
                        Sub-agent Markup
                      </h2>
                      <p className="text-xs text-[#4F5B70]">
                        Markup you add for this Sub-agent on top of your own
                        rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141B28]">
                      Markup setup
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 bg-[#EEF1F5] text-[#4F5B70] border-transparent font-semibold"
                    >
                      Optional
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: Configure later */}
                    <div
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          markupOption: 'later',
                        }))
                      }
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                        formData.markupOption === 'later'
                          ? 'border-[#012A5E] bg-[#F7FAFE] ring-1 ring-[#012A5E]/20 shadow-xs'
                          : 'border-[#E6EAF0] bg-white hover:border-[#D0E4FA] hover:bg-[#FAFBFD]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="markup-option"
                            checked={formData.markupOption === 'later'}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                markupOption: 'later',
                              }))
                            }
                            className="size-4 text-[#012A5E] accent-[#012A5E]"
                          />
                          <span className="text-xs font-bold text-[#141B28]">
                            Configure later
                          </span>
                        </div>
                        <Badge className="text-[10px] px-1.5 py-0 bg-[#FFF6DC] text-[#7A4A06] border-[#F1C134]/40 font-bold">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#4F5B70] pl-6 leading-snug">
                        Set up Sub-agent markup after the account is created.
                      </p>
                    </div>

                    {/* Option 2: Configure now */}
                    <div
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          markupOption: 'now',
                        }))
                      }
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                        formData.markupOption === 'now'
                          ? 'border-[#012A5E] bg-[#F7FAFE] ring-1 ring-[#012A5E]/20 shadow-xs'
                          : 'border-[#E6EAF0] bg-white hover:border-[#D0E4FA] hover:bg-[#FAFBFD]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="markup-option"
                          checked={formData.markupOption === 'now'}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              markupOption: 'now',
                            }))
                          }
                          className="size-4 text-[#012A5E] accent-[#012A5E]"
                        />
                        <span className="text-xs font-bold text-[#141B28]">
                          Configure now
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4F5B70] pl-6 leading-snug">
                        Go to markup setup right after creating the account.
                      </p>
                    </div>
                  </div>

                  {/* Expandable configuration if configure now is selected */}
                  {formData.markupOption === 'now' && (
                    <div className="p-3.5 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0] flex flex-col gap-3 mt-1 animate-in fade-in duration-200">
                      <span className="text-xs font-bold text-[#012A5E]">
                        Immediate Markup Configuration
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-[#4F5B70]">
                            Markup Type
                          </label>
                          <Select
                            value={formData.markupType}
                            items={{
                              percentage: 'Percentage on base fare (%)',
                              fixed: 'Fixed fee per ticket (BDT)',
                            }}
                            onValueChange={(val) => {
                              if (val === 'percentage' || val === 'fixed') {
                                setFormData((prev) => ({
                                  ...prev,
                                  markupType: val satisfies MarkupType,
                                }))
                              }
                            }}
                          >
                            <SelectTrigger className="h-9 w-full rounded-xl border-[#DCE2EB] bg-white text-xs font-medium">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage on base fare (%)
                              </SelectItem>
                              <SelectItem value="fixed">
                                Fixed fee per ticket (BDT)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-[#4F5B70]">
                            Value (
                            {formData.markupType === 'percentage' ? '%' : 'BDT'}
                            )
                          </label>
                          <Input
                            type="number"
                            step="0.5"
                            value={formData.markupValue}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                markupValue: e.target.value,
                              }))
                            }
                            placeholder="3.5"
                            className="h-9 text-xs bg-white border-[#DCE2EB] rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* READ-ONLY: Booking Settlement */}
              <section
                id="s-set"
                className="bg-white rounded-2xl border border-[#E6EAF0] p-5 sm:p-6 shadow-xs flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-[#F4F6FA] text-[#012A5E] flex items-center justify-center border border-[#E6EAF0]">
                      <Building2 className="size-4 text-[#0267B8]" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-[#012A5E]">
                        Booking Settlement
                      </h2>
                      <p className="text-xs text-[#4F5B70]">Read-only</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0] flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#4F5B70]">
                      Settled against
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[#141B28]">
                      Skyline Demo Travels Ltd
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0] flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#4F5B70]">Uses</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#141B28]">
                      Wallet and available credit
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  Sub-agent bookings use the Parent Agent's wallet and available
                  credit line. The Sub-agent does not hold an independent wallet
                  with AeroWing.
                </p>
              </section>
            </div>

            {/* Right Column: SECTION 5 Review & Actions (Sticky, 4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-20 flex flex-col gap-4">
              <article
                id="rv-side"
                className="bg-white rounded-2xl border border-[#E6EAF0] p-5 sm:p-6 shadow-sm flex flex-col gap-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2.5">
                    <span className="size-6.5 rounded-lg bg-[#FFF6DC] text-[#7A4A06] font-extrabold text-xs flex items-center justify-center border border-[#F1C134]/30 shadow-2xs">
                      5
                    </span>
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-[#012A5E]">
                        Review Sub-agent Setup
                      </h2>
                      <p className="text-[11px] text-[#4F5B70]">
                        Check before creating.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key-Value Review list */}
                <dl className="flex flex-col gap-3 text-xs">
                  {/* Display Name */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <dt className="text-[#4F5B70] font-medium">Display Name</dt>
                    <div className="flex items-center gap-2">
                      <dd className="font-bold text-[#141B28] text-right truncate max-w-[140px]">
                        {formData.displayName || '—'}
                      </dd>
                      <button
                        type="button"
                        onClick={() => scrollToField('displayName')}
                        className="text-[11px] font-bold text-[#0267B8] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Login Email */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <dt className="text-[#4F5B70] font-medium">Login Email</dt>
                    <div className="flex items-center gap-2">
                      <dd className="font-semibold text-[#141B28] text-right truncate max-w-[140px]">
                        {formData.loginEmail || '—'}
                      </dd>
                      <button
                        type="button"
                        onClick={() => scrollToField('loginEmail')}
                        className="text-[11px] font-bold text-[#0267B8] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <dt className="text-[#4F5B70] font-medium">
                      Contact Person
                    </dt>
                    <div className="flex items-center gap-2">
                      <dd className="font-medium text-[#141B28] text-right truncate max-w-[140px]">
                        {formData.contactPerson || '—'}
                      </dd>
                      <button
                        type="button"
                        onClick={() => scrollToField('contactPerson')}
                        className="text-[11px] font-bold text-[#0267B8] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <dt className="text-[#4F5B70] font-medium">Mobile</dt>
                    <div className="flex items-center gap-2">
                      <dd className="font-medium text-[#141B28] text-right truncate max-w-[140px]">
                        {formData.mobileNumber || '—'}
                      </dd>
                      <button
                        type="button"
                        onClick={() => scrollToField('mobile')}
                        className="text-[11px] font-bold text-[#0267B8] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <dt className="text-[#4F5B70] font-medium">Permissions</dt>
                    <div className="flex items-center gap-2">
                      <dd className="font-bold text-[#141B28] text-right">
                        {formData.permissionPreset === 'standard'
                          ? 'Standard Sub-agent Access'
                          : formData.permissionPreset === 'limited'
                            ? 'Limited Access'
                            : 'Custom Permissions'}
                      </dd>
                      <button
                        type="button"
                        onClick={() => scrollToField('permissions')}
                        className="text-[11px] font-bold text-[#0267B8] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Markup */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <dt className="text-[#4F5B70] font-medium">Markup</dt>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col text-right">
                        <dd className="font-semibold text-[#141B28]">
                          {formData.markupOption === 'later'
                            ? 'Configure later'
                            : `${formData.markupValue}${formData.markupType === 'percentage' ? '%' : ' BDT'}`}
                        </dd>
                        {formData.markupOption === 'later' && (
                          <span className="text-[10px] text-[#4F5B70]">
                            Not configured yet
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToField('markup')}
                        className="text-[11px] font-bold text-[#0267B8] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Parent Agent */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <dt className="text-[#4F5B70] font-medium">Parent Agent</dt>
                    <dd className="font-bold text-[#141B28] text-right">
                      Skyline Demo Travels Ltd
                    </dd>
                  </div>

                  {/* Settlement */}
                  <div className="flex items-start justify-between py-1.5">
                    <dt className="text-[#4F5B70] font-medium">Settlement</dt>
                    <dd className="font-medium text-[#4F5B70] text-right max-w-37.5 leading-snug">
                      Parent Agent wallet and available credit
                    </dd>
                  </div>
                </dl>

                {/* Primary & Secondary Actions */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#F1C134] text-[#012A5E] hover:bg-[#F3C84D] font-extrabold text-sm shadow-sm transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="size-4 stroke-[2.5]" />
                    <span>Create Sub-agent</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 rounded-xl bg-white border-[#B7C0CF] text-[#4F5B70] hover:bg-[#F4F6FA] font-bold text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </article>

              {/* Design Prototype Footer Note */}
              <div className="px-2 text-[11px] text-[#4F5B70] flex flex-col gap-1 leading-snug">
                <div>
                  AeroWing Agent Portal · M2.2 Sub-agent Functionality and
                  Hierarchy
                </div>
                <div className="text-[#9AA6B9]">
                  Website only · design prototype — no account, login or email
                  is created.
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* Permissions Modal */}
      <SubAgentPermissionsModal
        open={permissionsModalOpen}
        onOpenChange={setPermissionsModalOpen}
        permissions={formData.customPermissions}
        onSave={handleCustomPermissionsSave}
      />

      {/* Created Confirmation Dialog */}
      <SubAgentCreatedDialog
        open={createdSuccessOpen}
        onOpenChange={setCreatedSuccessOpen}
        formData={formData}
        onReset={() => setFormData(INITIAL_SUB_AGENT_DATA)}
      />
    </div>
  )
}

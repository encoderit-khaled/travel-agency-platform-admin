import * as React from 'react'
import {
  Globe,
  Plus,
  Info,
  Check,
  Smartphone,
  Users,
  Trash2,
  Pencil,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { Input } from '#/components/ui/input'
import { SidebarProvider } from '#/components/ui/sidebar'
import { AdminSidebar } from '../admin-sidebar'
import { AdminHeader } from '../admin-header'
import { SETTINGS_NAVIGATION_SECTIONS } from './data'
import { SUGGESTED_LANGUAGES, INITIAL_CONFIGURED_LANGUAGES } from './languages-data'
import type { LanguageItem, LanguagesPageProps } from './types'
import { cn } from '#/lib/utils'

interface DraftLanguageRow {
  id: string
  name: string
  code?: string
  isDefault?: boolean
}

export function LanguagesPage({
  initialNodeId = '1009-6826',
  initialSection = 'languages',
  initialMode,
  initialConfigureMode,
  initialConfigureOpen,
  languages,
  initialLanguages,
  onUpdateLanguages,
  onSaveLanguages,
}: LanguagesPageProps) {
  const [, setActiveSection] = React.useState(initialSection)

  // Configured saved languages - defaults to English and Spanish matching Figma node 1009:6825
  const resolvedInitialLanguages =
    languages || initialLanguages || INITIAL_CONFIGURED_LANGUAGES
  const [configuredLanguages, setConfiguredLanguages] =
    React.useState<LanguageItem[]>(resolvedInitialLanguages)

  // Draft new language rows being added/configured
  const [draftRows, setDraftRows] = React.useState<DraftLanguageRow[]>([
    {
      id: 'draft-1',
      name: '',
    },
  ])

  // Whether user is in configure/add mode (Figma node 1009:6826)
  const isConfiguringInitial =
    initialConfigureMode ??
    initialConfigureOpen ??
    (initialMode === 'add' ||
      initialMode === 'configure' ||
      initialNodeId.includes('6826') ||
      initialNodeId.includes('6827') ||
      initialNodeId.includes('6944') ||
      initialMode === undefined)

  const [isAddingMode, setIsAddingMode] = React.useState<boolean>(
    Boolean(isConfiguringInitial),
  )

  // Centered dark success toast matching Figma 1009:6825 screenshot
  const [showSuccessToast, setShowSuccessToast] = React.useState<boolean>(false)
  const { isLoading: isSaving, run } = useActionLoading()

  // Update a draft row name
  const updateRowName = (id: string, name: string) => {
    setDraftRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        const match = SUGGESTED_LANGUAGES.find(
          (s) => s.name.toLowerCase() === name.trim().toLowerCase(),
        )
        return {
          ...row,
          name,
          code: match ? match.code : row.code,
        }
      }),
    )
  }

  // Add another new draft row
  const handleAddNewRow = () => {
    const newId = `draft-${Date.now()}`
    setDraftRows((prev) => [
      ...prev,
      {
        id: newId,
        name: '',
      },
    ])
  }

  // Discard a specific row
  const handleDiscardRow = (id: string) => {
    if (draftRows.length <= 1) {
      setDraftRows([{ id: `draft-${Date.now()}`, name: '' }])
    } else {
      setDraftRows((prev) => prev.filter((r) => r.id !== id))
    }
  }

  // Cancel configuration
  const handleCancel = () => {
    setDraftRows([{ id: `draft-${Date.now()}`, name: '' }])
    if (configuredLanguages.length > 0) {
      setIsAddingMode(false)
    }
  }

  // Save changes
  const handleSave = () => {
    const validRows = draftRows.filter((r) => r.name.trim().length > 0)

    let updated: LanguageItem[]
    if (validRows.length > 0) {
      const newItems: LanguageItem[] = validRows.map((r, index) => {
        const match = SUGGESTED_LANGUAGES.find(
          (s) => s.name.toLowerCase() === r.name.trim().toLowerCase(),
        )
        return {
          id: `lang-${Date.now()}-${index}`,
          name: r.name.trim(),
          code: match ? match.code : r.name.slice(0, 2).toUpperCase(),
          isDefault: configuredLanguages.length === 0 && index === 0,
          status: 'active',
          appliesTo: 'Website and Mobile App',
          direction: match?.direction || 'ltr',
        }
      })
      updated = [...configuredLanguages, ...newItems]
    } else {
      // If user clicks save with empty draft, retain current configured languages
      updated = configuredLanguages.length > 0 ? configuredLanguages : INITIAL_CONFIGURED_LANGUAGES
    }

    run(() => {
      setConfiguredLanguages(updated)
      if (onUpdateLanguages) {
        onUpdateLanguages(updated)
      }
      if (onSaveLanguages) {
        onSaveLanguages(updated)
      }

      setDraftRows([{ id: `draft-${Date.now()}`, name: '' }])
      setIsAddingMode(false)
      setShowSuccessToast(true)
      setTimeout(() => {
        setShowSuccessToast(false)
      }, 3500)
    })
  }

  // Remove a configured language
  const handleDeleteConfigured = (id: string) => {
    const updated = configuredLanguages.filter((l) => l.id !== id)
    setConfiguredLanguages(updated)
    if (onUpdateLanguages) {
      onUpdateLanguages(updated)
    }
  }

  return (
    <SidebarProvider defaultOpen>
      <div
        className="flex min-h-screen w-full bg-[#F4F6F9]"
        data-node-id={initialNodeId}
      >
        {/* Main Admin Navigation Sidebar */}
        <AdminSidebar currentTab="Platform Settings" />

        {/* Main Column */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Admin Header with Breadcrumbs matching Figma: Admin Panel / Platform Settings / Languages */}
          <AdminHeader
            breadcrumbs={[
              { label: 'Admin Panel', href: '/admin' },
              {
                label: 'Platform Settings',
                href: '/platform-settings?section=business-details',
              },
              { label: 'Languages', active: true },
            ]}
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-360 w-full mx-auto space-y-6">
            {/* Page Header (PLATFORM SETTINGS / Platform Settings / Manage core platform configuration.) */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0052CC] tracking-wider uppercase">
                PLATFORM SETTINGS
              </span>
              <h1 className="text-2xl sm:text-[26px] font-bold text-[#001A3D] tracking-tight leading-tight">
                Platform Settings
              </h1>
              <p className="text-sm text-[#64748B] font-normal">
                Manage core platform configuration.
              </p>
            </div>

            {/* Two-Column Layout */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Left Column: Platform Settings sections Navigation Card */}
              <aside
                aria-label="Platform Settings sections"
                className="w-full lg:w-65 shrink-0 bg-white border border-[#DCE2EB] rounded-2xl p-3 shadow-xs"
              >
                {/* Section title (SETTINGS) */}
                <div className="px-3 py-2 mb-1">
                  <h2 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    SETTINGS
                  </h2>
                </div>

                {/* Navigation List */}
                <nav className="flex flex-col gap-1">
                  {SETTINGS_NAVIGATION_SECTIONS.map((sec) => {
                    const Icon = sec.icon
                    const isLang = sec.id === 'languages'
                    const isActive = isLang
                    return (
                      <a
                        key={sec.id}
                        href={sec.href}
                        onClick={(e) => {
                          if (sec.id === 'languages') {
                            e.preventDefault()
                            setActiveSection('languages')
                          }
                        }}
                        className={cn(
                          'relative flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer group',
                          isActive
                            ? 'bg-[#EEF4FB] text-[#001A3D] font-bold shadow-2xs'
                            : 'text-[#141C2E] hover:bg-slate-50 font-medium hover:text-[#001A3D]',
                        )}
                      >
                        {/* Active Indicator Bar (Saffron yellow bar #F1C134) */}
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-6.5 bg-[#F1C134] rounded-r-[3px]"
                          />
                        )}

                        <Icon
                          className={cn(
                            'size-4.5 shrink-0 transition-colors',
                            isActive
                              ? 'text-[#0052CC]'
                              : 'text-[#64748B] group-hover:text-[#001A3D]',
                          )}
                        />

                        <span className="leading-snug">
                          {sec.displayTitle || sec.title}
                        </span>
                      </a>
                    )
                  })}
                </nav>
              </aside>

              {/* Right Column: Main Content Area */}
              <div className="flex-1 w-full space-y-6 min-w-0">
                {/* Languages Card (Figma Node 1009:6826 & 1009:6825) */}
                <section
                  aria-labelledby="lg-heading"
                  className="bg-white border border-[#DCE2EB] rounded-2xl p-6 shadow-xs space-y-6"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* Icon container (light blue #EBF3FC) */}
                      <div className="size-10 rounded-xl bg-[#EBF3FC] flex items-center justify-center shrink-0">
                        <Globe className="size-5 text-[#0052CC]" />
                      </div>
                      <div className="space-y-0.5">
                        <h2
                          id="lg-heading"
                          className="text-lg font-bold text-[#001A3D] tracking-tight"
                        >
                          Languages
                        </h2>
                        <p className="text-sm text-[#64748B] font-normal">
                          Manage the languages available across the Aero Wing Website and Mobile App.
                        </p>
                      </div>
                    </div>

                    {/* Configure Languages Button (visible when not in configuring mode, matching Figma 1009:6825) */}
                    {!isAddingMode && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingMode(true)}
                        className="h-9 px-4 rounded-xl border-[#CBD5E1] bg-white text-sm font-semibold text-[#001A3D] hover:bg-slate-50 gap-2 shrink-0 cursor-pointer shadow-2xs"
                      >
                        <Pencil className="size-3.5 text-[#001A3D]" />
                        <span>Configure Languages</span>
                      </Button>
                    )}
                  </div>

                  {/* 1. Configure Mode (Figma Node 1009:6826) */}
                  {isAddingMode && (
                    <div className="space-y-5">
                      {/* Draft Rows list */}
                      <div className="space-y-4">
                        {draftRows.map((row, idx) => (
                          <div
                            key={row.id}
                            className="border border-dashed border-[#DCE2EB] rounded-2xl p-5 sm:p-6 bg-white space-y-2.5 transition-all"
                          >
                            <label
                              htmlFor={`lang-input-${row.id}`}
                              className="text-sm font-semibold text-[#001A3D] block"
                            >
                              Language Name
                            </label>

                            <div className="flex items-center justify-between gap-4">
                              {/* Input with globe icon on the left inside input */}
                              <div className="relative flex-1 max-w-125">
                                <Globe className="size-4.5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                  id={`lang-input-${row.id}`}
                                  type="text"
                                  value={row.name}
                                  onChange={(e) => updateRowName(row.id, e.target.value)}
                                  placeholder=""
                                  autoFocus={idx === 0}
                                  className="h-11 pl-10 pr-4 rounded-xl border-[#CBD5E1] bg-white text-sm text-[#001A3D] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#0052CC] focus-visible:border-[#0052CC] w-full"
                                />
                              </div>

                              {/* Discard new row link */}
                              <Button variant="plain"
                                type="button"
                                onClick={() => handleDiscardRow(row.id)}
                                className="text-sm font-semibold text-[#0052CC] hover:underline cursor-pointer shrink-0"
                              >
                                Discard new row
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* + Add Language button */}
                      <div>
                        <Button variant="plain"
                          type="button"
                          onClick={handleAddNewRow}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-[#CBD5E1] hover:border-[#94A3B8] bg-white hover:bg-slate-50 text-sm font-semibold text-[#001A3D] cursor-pointer transition-all shadow-2xs"
                        >
                          <Plus className="size-4 text-[#0052CC]" />
                          <span>Add Language</span>
                        </Button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#F1F5F9] pt-2" />

                      {/* Bottom Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Left: Unsaved changes pill badge */}
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9C3] border border-[#FEF08A] text-xs font-semibold text-[#854D0E] select-none">
                            <span className="size-2 rounded-full bg-[#EAB308]" />
                            <span>Unsaved changes</span>
                          </div>
                        </div>

                        {/* Right: Cancel & Save Changes buttons */}
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="h-10 px-5 rounded-xl border-[#CBD5E1] bg-white text-sm font-semibold text-[#001A3D] hover:bg-slate-50 cursor-pointer shadow-2xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSave}
                            loading={isSaving}
                            loadingText="Saving..."
                            className="h-10 px-6 rounded-xl bg-[#001A3D] hover:bg-[#002654] text-sm font-semibold text-white cursor-pointer shadow-xs"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Saved List Mode (Figma Node 1009:6825) */}
                  {!isAddingMode && configuredLanguages.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[#001A3D]">
                        {configuredLanguages.length} languages
                      </p>

                      <div className="rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] bg-white overflow-hidden shadow-2xs">
                        {configuredLanguages.map((lang) => (
                          <div
                            key={lang.id}
                            className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="size-8 rounded-full bg-[#EBF3FC] text-[#0052CC] flex items-center justify-center shrink-0">
                                <Globe className="size-4" />
                              </div>
                              <span className="text-sm font-semibold text-[#001A3D]">
                                {lang.name}
                              </span>
                            </div>

                            <Button variant="plain"
                              type="button"
                              onClick={() => handleDeleteConfigured(lang.id)}
                              title={`Remove ${lang.name}`}
                              className="size-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state if user cleared all and not configuring */}
                  {!isAddingMode && configuredLanguages.length === 0 && (
                    <div className="p-8 sm:p-12 text-center bg-[#FAFCFE] rounded-2xl border border-dashed border-[#CBD5E1] space-y-4">
                      <div className="size-12 rounded-full bg-[#EBF3FC] flex items-center justify-center mx-auto text-[#0052CC]">
                        <Globe className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#001A3D]">
                          No confirmed language list loaded
                        </h3>
                        <p className="text-sm text-[#64748B] max-w-md mx-auto">
                          Configured languages will appear here once the agreed language list is supplied.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setIsAddingMode(true)}
                        className="h-10 px-5 rounded-xl bg-[#001A3D] hover:bg-[#002654] text-sm font-bold text-white shadow-xs cursor-pointer gap-2"
                      >
                        <Plus className="size-4" />
                        <span>Configure Languages</span>
                      </Button>
                    </div>
                  )}
                </section>

                {/* Two Information Cards below (Language configuration & Language details) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Card 1: Language configuration */}
                  <aside
                    aria-labelledby="lang-cfg-heading"
                    className="rounded-2xl border border-[#DCE2EB] p-5 bg-[#F4F8FD] flex items-start gap-3.5 shadow-2xs"
                  >
                    <div className="size-8 rounded-full bg-[#DCEBFC] flex items-center justify-center shrink-0 text-[#0052CC]">
                      <Info className="size-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h3
                        id="lang-cfg-heading"
                        className="text-sm font-bold text-[#001A3D]"
                      >
                        Language configuration
                      </h3>
                      <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                        The final language list must use the languages agreed with the Client. Content translations are supplied by the Client.
                      </p>
                    </div>
                  </aside>

                  {/* Card 2: Language details */}
                  <section
                    aria-labelledby="lang-details-heading"
                    className="rounded-2xl border border-[#DCE2EB] p-5 bg-white space-y-4 shadow-2xs"
                  >
                    <h3
                      id="lang-details-heading"
                      className="text-sm font-bold text-[#001A3D]"
                    >
                      Language details
                    </h3>

                    <dl className="space-y-3.5">
                      {/* Applies to item */}
                      <div className="flex items-start gap-3.5">
                        <div className="size-8 rounded-lg bg-[#EBF3FC] flex items-center justify-center shrink-0 text-[#0052CC]">
                          <Smartphone className="size-4" />
                        </div>
                        <div className="space-y-0.5">
                          <dt className="text-xs font-semibold text-[#64748B]">
                            Applies to
                          </dt>
                          <dd className="text-sm font-bold text-[#001A3D]">
                            Website and Mobile App
                          </dd>
                        </div>
                      </div>

                      {/* Translations item */}
                      <div className="flex items-start gap-3.5">
                        <div className="size-8 rounded-lg bg-[#EBF3FC] flex items-center justify-center shrink-0 text-[#0052CC]">
                          <Users className="size-4" />
                        </div>
                        <div className="space-y-0.5">
                          <dt className="text-xs font-semibold text-[#64748B]">
                            Translations
                          </dt>
                          <dd className="text-sm font-medium text-[#001A3D]">
                            Content translations are supplied by the Client.
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </section>
                </div>
              </div>
            </div>
          </main>

          {/* Centered Success Toast Popup matching Figma Node 1009:6825 */}
          {showSuccessToast && (
            <div
              role="status"
              aria-live="polite"
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#071933] text-white px-9 py-6 rounded-[24px] shadow-2xl flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
            >
              <div className="size-16 rounded-full bg-white flex items-center justify-center text-[#071933] shadow-md">
                <Check className="size-8 stroke-[3.5]" />
              </div>
              <span className="text-sm font-bold tracking-wide">
                Language settings updated
              </span>
            </div>
          )}

          {/* Footer matching Figma */}
          <footer className="w-full bg-white border-t border-[#DCE2EB] px-6 lg:px-8 py-4 text-xs text-[#64748B] mt-auto">
            © 2026 AeroWing. All rights reserved.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  )
}

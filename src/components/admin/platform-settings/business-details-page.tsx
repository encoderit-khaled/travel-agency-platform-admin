import * as React from 'react'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Building2,
  Globe,
  Coins,
  Receipt,
  FileText,
  Pencil,
  Info,
  ChevronRight,
  Check,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { SidebarProvider } from '#/components/ui/sidebar'
import { AdminSidebar } from '../admin-sidebar'
import { AdminHeader } from '../admin-header'
import {
  INITIAL_BUSINESS_DETAILS,
  SETTINGS_NAVIGATION_SECTIONS,
  OTHER_SETTINGS_CARDS,
} from './data'
import { EditBusinessDetailsDialog } from './edit-business-details-dialog'
import type { BusinessDetailsPageProps, BusinessDetailsConfig } from './types'
import { cn } from '#/lib/utils'

export function BusinessDetailsPage({
  initialNodeId = '1007-5992',
  initialSection = 'business-details',
  initialEditOpen = false,
  businessData,
  onUpdateBusinessDetails,
}: BusinessDetailsPageProps) {
  const isContentLoading = useContentLoading()
  const isLanguageNode =
    initialNodeId.includes('1009-6826') ||
    initialNodeId.includes('1009:6826') ||
    initialNodeId.includes('1009-6827') ||
    initialNodeId.includes('1009:6827') ||
    initialNodeId.includes('1009-6558') ||
    initialNodeId.includes('1009:6558') ||
    initialNodeId.includes('1009-6944') ||
    initialNodeId.includes('1009:6944')

  const [data, setData] = React.useState<BusinessDetailsConfig>(() => ({
    ...INITIAL_BUSINESS_DETAILS,
    ...businessData,
  }))

  const [activeSection, setActiveSection] = React.useState(
    isLanguageNode ? 'languages' : initialSection,
  )
  const [isEditDialogOpen, setIsEditDialogOpen] =
    React.useState(initialEditOpen)
  const [saveSuccessMessage, setSaveSuccessMessage] = React.useState<
    string | null
  >(null)

  const handleSave = (updated: BusinessDetailsConfig) => {
    setData(updated)
    if (onUpdateBusinessDetails) {
      onUpdateBusinessDetails(updated)
    }
    setSaveSuccessMessage('Business details updated successfully.')
    setTimeout(() => {
      setSaveSuccessMessage(null)
    }, 4000)
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
          {/* Admin Header with Breadcrumbs */}
          <AdminHeader
            breadcrumbs={
              activeSection === 'languages'
                ? [
                    { label: 'Admin Panel', href: '/admin' },
                    {
                      label: 'Platform Settings',
                      href: '/platform-settings?section=business-details',
                    },
                    { label: 'Languages', isCurrent: true },
                  ]
                : [
                    { label: 'Admin Panel', href: '/admin' },
                    { label: 'Platform Settings', isCurrent: true },
                  ]
            }
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5">
            {/* Success Toast Notification */}
            {saveSuccessMessage && (
              <div className="flex items-center justify-between p-3.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <Check className="size-4.5 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveSuccessMessage(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Page Header (div.ph2) */}
            <div className="space-y-1">
              <span className="text-[12px] font-extrabold text-[#0052CC] tracking-wide uppercase">
                Platform Settings
              </span>
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#001A3D] tracking-tight leading-tight">
                Platform Settings
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Manage core platform configuration.
              </p>
            </div>

            {/* Two-Column Layout (div) */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Left Column: Platform Settings sections Navigation Card */}
              <aside
                aria-label="Platform Settings sections"
                className="w-full lg:w-65 shrink-0 bg-white border border-[#DCE2EB] rounded-[18px] p-3 shadow-xs"
              >
                {/* Section title (p.sn-t) */}
                <div className="px-2.5 py-1.5 mb-1">
                  <h2 className="text-[11.5px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Settings
                  </h2>
                </div>

                {/* Navigation List */}
                <nav className="flex flex-col gap-1">
                  {SETTINGS_NAVIGATION_SECTIONS.map((sec) => {
                    const Icon = sec.icon
                    const isActive = activeSection === sec.id
                    return (
                      <a
                        key={sec.id}
                        href={sec.href}
                        onClick={(event) => {
                          if (sec.id === 'business-details') {
                            event.preventDefault()
                            setActiveSection('business-details')
                          }
                        }}
                        className={cn(
                          'relative flex items-center gap-3 w-full px-3 py-2.5 rounded-[12px] text-xs sm:text-sm transition-all text-left cursor-pointer group',
                          isActive
                            ? 'bg-[#EEF4FB] text-[#001A3D] font-bold shadow-2xs'
                            : 'text-[#141C2E] hover:bg-slate-50 font-medium hover:text-[#001A3D]',
                        )}
                      >
                        {/* Active Indicator Bar (::before Saffron rectangle) */}
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

                        <span className="leading-snug whitespace-pre-line">
                          {sec.displayTitle || sec.title}
                        </span>
                      </a>
                    )
                  })}
                </nav>
              </aside>

              {/* Right Column: Main Content Area (div.sm2) */}
              <div className="flex-1 w-full space-y-5">
                {/* Business Details Card (section.pc3) */}
                <section
                  aria-labelledby="bd-h"
                  className="bg-white border border-[#DCE2EB] rounded-[18px] p-5 sm:p-6 space-y-6 shadow-xs"
                >
                  {/* Card Header (div.pc3-h) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3">
                      {/* Icon container (span.kpi-ic in Hawkes Blue) */}
                      <div className="size-9 sm:size-10 rounded-[10px] bg-[#EBF3FC] flex items-center justify-center shrink-0">
                        <Building2 className="size-5 text-[#0052CC]" />
                      </div>
                      <div className="space-y-0.5">
                        <h2
                          id="bd-h"
                          className="text-base sm:text-lg font-bold text-[#001A3D] tracking-tight"
                        >
                          Business Details
                        </h2>
                        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                          Manage basic business information used by the
                          platform.
                        </p>
                      </div>
                    </div>

                    {/* Edit Business Details Button (button#ed-b) */}
                    <Button
                      id="ed-b"
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(true)}
                      className="h-9 px-3.5 rounded-[11px] border-[#CBD5E1] bg-white text-xs sm:text-sm font-bold text-[#001A3D] hover:bg-slate-50 gap-2 shrink-0 cursor-pointer shadow-2xs"
                    >
                      <Pencil className="size-3.5 text-[#001A3D]" />
                      <span>Edit Business Details</span>
                    </Button>
                  </div>

                  {/* Business Name Field */}
                  <div className="space-y-1">
                    <dt className="text-xs font-semibold text-[#64748B]">
                      Business Name
                    </dt>
                    <dd className="flex items-center flex-wrap gap-2 pt-0.5">
                      <span className="text-xl sm:text-2xl font-extrabold text-[#141C2E] tracking-tight">
                        {data.businessName}
                      </span>
                      {data.isSampleData && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F0F4F8] text-[#64748B] border border-[#E2E8F0] tracking-wide select-none">
                          Sample data
                        </span>
                      )}
                    </dd>
                    <p className="text-xs text-[#64748B] pt-0.5">
                      Primary business name used in the platform configuration.
                    </p>
                  </div>
                </section>

                {/* Info Callout Card (aside.inf) */}
                <aside
                  aria-labelledby="inf-h"
                  className="rounded-[16px] border border-[#DCE2EB] p-4 sm:p-4.5 bg-linear-to-b from-[#F3F8FE] to-white flex items-start gap-3 shadow-xs"
                >
                  <div className="size-9 rounded-xl bg-[#EBF3FC] flex items-center justify-center shrink-0">
                    <Info className="size-4.5 text-[#0052CC]" />
                  </div>
                  <div className="space-y-0.5">
                    <h3
                      id="inf-h"
                      className="text-xs sm:text-sm font-bold text-[#001A3D]"
                    >
                      Platform configuration
                    </h3>
                    <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                      These settings control shared platform configuration.
                    </p>
                  </div>
                </aside>

                {/* Other Settings Section (section) */}
                <section aria-labelledby="oa-h" className="space-y-3 pt-1">
                  <h2
                    id="oa-h"
                    className="text-sm sm:text-base font-bold text-[#001A3D]"
                  >
                    Other settings
                  </h2>

                  {/* 2x2 Cards Grid (ul) */}
                  {isContentLoading ? (
                    <CardGridSkeleton
                      count={4}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3.5"
                      cardClassName="h-20 rounded-[16px]"
                    />
                  ) : null}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 ${isContentLoading ? "hidden" : ""}`}>
                    {OTHER_SETTINGS_CARDS.map((card) => {
                      const Icon = card.icon
                      return (
                        <a
                          key={card.id}
                          href={card.href}
                          className="group relative flex items-center justify-between p-4 bg-white border border-[#DCE2EB] rounded-[16px] gap-3.5 hover:border-[#0052CC]/40 hover:shadow-xs transition-all cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Icon (span.kpi-ic in Hawkes Blue) */}
                            <div className="size-10 rounded-[12px] bg-[#EBF3FC] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Icon className="size-5 text-[#0052CC]" />
                            </div>

                            {/* Title & Description */}
                            <div className="min-w-0">
                              <h3 className="text-xs sm:text-sm font-bold text-[#141C2E] group-hover:text-[#0052CC] transition-colors truncate">
                                {card.title}
                              </h3>
                              <p className="text-[11px] sm:text-xs text-[#64748B] font-medium truncate">
                                {card.description}
                              </p>
                            </div>
                          </div>

                          {/* Chevron Arrow */}
                          <ChevronRight className="size-4.5 text-[#8C9BAE] group-hover:text-[#0052CC] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </a>
                      )
                    })}
                  </div>
                </section>
              </div>
            </div>
          </main>

          {/* Footer (footer.ft2) */}
          <footer className="w-full bg-white border-t border-[#DCE2EB] px-4 lg:px-8 py-3.5 flex items-center justify-between text-xs text-[#64748B] mt-auto">
            <span>© 2026 AeroWing. All rights reserved.</span>
            <span className="hidden sm:inline text-[#8C9BAE]">
              Platform Settings · Core Administration
            </span>
          </footer>
        </div>

        {/* Edit Business Details Dialog Modal */}
        <EditBusinessDetailsDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          initialData={data}
          onSave={handleSave}
        />
      </div>
    </SidebarProvider>
  )
}

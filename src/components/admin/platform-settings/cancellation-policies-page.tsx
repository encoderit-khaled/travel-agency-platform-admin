import * as React from 'react'
import { FileText, Info, Pencil, Settings, SquareStack } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Separator } from '#/components/ui/separator'
import { Textarea } from '#/components/ui/textarea'
import { SidebarProvider } from '#/components/ui/sidebar'
import { AdminSidebar } from '../admin-sidebar'
import { AdminHeader } from '../admin-header'
import { SAMPLE_CANCELLATION_POLICY, SETTINGS_NAVIGATION_SECTIONS } from './data'
import type {
  CancellationPoliciesMode,
  CancellationPoliciesPageProps,
  CancellationPolicy,
} from './types'
import { cn } from '#/lib/utils'

const EMPTY_POLICY: CancellationPolicy = {
  id: 'policy-default',
  name: '',
  text: '',
}

function normalizeNodeId(nodeId?: string) {
  return nodeId?.replace(':', '-')
}

function resolveMode(
  nodeId: string | undefined,
  initialMode: CancellationPoliciesMode | undefined,
): CancellationPoliciesMode {
  if (initialMode === 'view') return 'view'
  if (initialMode === 'empty') return 'empty'
  if (initialMode === 'form' || initialMode === 'configure') return 'form'

  const id = normalizeNodeId(nodeId)
  if (id === '1084-3797' || id === '1084-3794') return 'view'
  if (
    id === '1084-3526' ||
    id === '1084-3525' ||
    id === '1084-3798' ||
    id === '1084-3795'
  ) {
    return id === '1084-3798' || id === '1084-3795' ? 'form' : 'empty'
  }
  return 'empty'
}

export function CancellationPoliciesPage({
  initialNodeId = '1084-3798',
  initialSection = 'cancellation',
  initialMode,
  initialPolicy,
  onSavePolicy,
}: CancellationPoliciesPageProps) {
  const startingMode = resolveMode(initialNodeId, initialMode)
  const [saved, setSaved] = React.useState<CancellationPolicy | null>(() => {
    if (initialPolicy) return initialPolicy
    if (startingMode === 'view') return SAMPLE_CANCELLATION_POLICY
    return null
  })
  const [mode, setMode] = React.useState<CancellationPoliciesMode>(startingMode)
  const [draft, setDraft] = React.useState<CancellationPolicy>(
    () => saved ?? EMPTY_POLICY,
  )
  const [errors, setErrors] = React.useState<{ name?: string; text?: string }>(
    {},
  )
  const { isLoading: isSaving, run } = useActionLoading()

  const baseline = saved ?? EMPTY_POLICY
  const hasChanges = draft.name !== baseline.name || draft.text !== baseline.text
  const nodeId =
    mode === 'view' ? '1084-3797' : mode === 'empty' ? '1084-3525' : '1084-3798'

  const openForm = (policy: CancellationPolicy | null) => {
    setDraft(policy ?? EMPTY_POLICY)
    setErrors({})
    setMode('form')
  }

  const handleCancel = () => {
    setDraft(saved ?? EMPTY_POLICY)
    setErrors({})
    setMode(saved ? 'view' : 'empty')
  }

  const handleSave = () => {
    const name = draft.name.trim()
    const text = draft.text.trim()
    const nextErrors: { name?: string; text?: string } = {}

    if (!name) nextErrors.name = 'Enter a policy name.'
    if (!text) nextErrors.text = 'Enter the policy text.'

    setErrors(nextErrors)
    if (nextErrors.name || nextErrors.text) return

    const nextPolicy: CancellationPolicy = {
      id: saved?.id ?? 'policy-default',
      name,
      text,
    }
    run(() => {
      setSaved(nextPolicy)
      setDraft(nextPolicy)
      setMode('view')
      onSavePolicy?.(nextPolicy)
    })
  }

  return (
    <SidebarProvider defaultOpen>
      <div
        className="flex min-h-screen w-full bg-[#F4F6F9]"
        data-node-id={nodeId}
      >
        <AdminSidebar currentTab="Platform Settings" />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            breadcrumbs={[
              { label: 'Admin Panel', href: '/admin' },
              {
                label: 'Platform Settings',
                href: '/platform-settings?section=business-details',
              },
              { label: 'Default Cancellation Policies', active: true },
            ]}
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
          />

          <main className="mx-auto w-full max-w-360 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-[#0052CC] uppercase">
                Platform Settings
              </span>
              <h1 className="text-2xl leading-tight font-bold tracking-tight text-[#001A3D] sm:text-[26px]">
                Platform Settings
              </h1>
              <p className="text-sm text-[#64748B]">
                Manage core platform configuration.
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <aside
                aria-label="Platform Settings sections"
                className="w-full shrink-0 rounded-2xl border border-[#DCE2EB] bg-white p-3 shadow-xs lg:w-65"
              >
                <div className="mb-1 px-3 py-2">
                  <h2 className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                    Settings
                  </h2>
                </div>

                <nav className="flex flex-col gap-1">
                  {SETTINGS_NAVIGATION_SECTIONS.map((section) => {
                    const Icon = section.icon
                    const isActive = section.id === initialSection
                    return (
                      <a
                        key={section.id}
                        href={section.href}
                        className={cn(
                          'group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all',
                          isActive
                            ? 'bg-[#EEF4FB] font-bold text-[#001A3D] shadow-2xs'
                            : 'font-medium text-[#141C2E] hover:bg-slate-50 hover:text-[#001A3D]',
                        )}
                      >
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="absolute top-1/2 left-0 h-6.5 w-0.75 -translate-y-1/2 rounded-r-[3px] bg-[#F1C134]"
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
                          {section.displayTitle || section.title}
                        </span>
                      </a>
                    )
                  })}
                </nav>
              </aside>

              <div className="w-full min-w-0 flex-1 space-y-5">
                <section
                  aria-labelledby="cancellation-heading"
                  className="space-y-5 rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-xs sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF3FC]">
                        <FileText className="size-5 text-[#0052CC]" />
                      </div>
                      <div className="space-y-0.5">
                        <h2
                          id="cancellation-heading"
                          className="text-base font-bold tracking-tight text-[#001A3D] sm:text-lg"
                        >
                          Default Cancellation Policies
                        </h2>
                        <p className="text-sm text-[#64748B]">
                          Manage the platform’s default cancellation-policy
                          information.
                        </p>
                      </div>
                    </div>

                    {mode === 'empty' && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openForm(null)}
                        className="h-9 shrink-0 cursor-pointer gap-2 rounded-xl border-[#CBD5E1] bg-white px-3.5 text-sm font-semibold text-[#001A3D] shadow-2xs hover:bg-slate-50"
                      >
                        <Pencil className="size-3.5" />
                        Configure Default Policy
                      </Button>
                    )}

                    {mode === 'view' && saved && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openForm(saved)}
                        className="h-9 shrink-0 cursor-pointer gap-2 rounded-xl border-[#CBD5E1] bg-white px-3.5 text-sm font-semibold text-[#001A3D] shadow-2xs hover:bg-slate-50"
                      >
                        <Pencil className="size-3.5" />
                        Edit Default Policy
                      </Button>
                    )}
                  </div>

                  {mode === 'form' && (
                    <form
                      className="space-y-5"
                      onSubmit={(event) => {
                        event.preventDefault()
                        handleSave()
                      }}
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="policy-name"
                          className="text-sm font-semibold text-[#001A3D]"
                        >
                          Policy Name
                        </Label>
                        <Input
                          id="policy-name"
                          value={draft.name}
                          aria-invalid={Boolean(errors.name)}
                          onChange={(event) => {
                            setDraft((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                            if (errors.name) {
                              setErrors((current) => ({
                                ...current,
                                name: undefined,
                              }))
                            }
                          }}
                          className="h-11 rounded-xl border-[#CBD5E1] bg-white px-3.5 text-sm text-[#001A3D] focus-visible:border-[#0052CC] focus-visible:ring-[#0052CC]/30"
                        />
                        {errors.name && (
                          <p className="text-xs font-medium text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="policy-text"
                          className="text-sm font-semibold text-[#001A3D]"
                        >
                          Policy Text
                        </Label>
                        <Textarea
                          id="policy-text"
                          value={draft.text}
                          aria-invalid={Boolean(errors.text)}
                          onChange={(event) => {
                            setDraft((current) => ({
                              ...current,
                              text: event.target.value,
                            }))
                            if (errors.text) {
                              setErrors((current) => ({
                                ...current,
                                text: undefined,
                              }))
                            }
                          }}
                          className="min-h-37 resize-y rounded-xl border-[#CBD5E1] bg-white px-3.5 py-3 text-sm text-[#001A3D] focus-visible:border-[#0052CC] focus-visible:ring-[#0052CC]/30"
                        />
                        <p className="text-xs text-[#64748B]">
                          Actual booking policy application is handled by the
                          cancellation/refund workflow.
                        </p>
                        {errors.text && (
                          <p className="text-xs font-medium text-red-600">
                            {errors.text}
                          </p>
                        )}
                      </div>

                      <Separator className="bg-[#E8EEF5]" />

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-[#64748B]" aria-live="polite">
                          {hasChanges ? 'Unsaved changes' : 'No changes yet'}
                        </p>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="h-10 cursor-pointer rounded-xl border-[#CBD5E1] bg-white px-5 text-sm font-semibold text-[#001A3D] shadow-2xs hover:bg-slate-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            loading={isSaving}
                            loadingText="Saving..."
                            className="h-10 cursor-pointer rounded-xl bg-[#001A3D] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#002654]"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}

                  {mode === 'view' && saved && (
                    <div className="space-y-5">
                      <p className="text-sm text-[#64748B]">
                        Default cancellation policy
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-[#64748B]">
                          Policy Name
                        </p>
                        <p className="text-lg font-bold text-[#001A3D]">
                          {saved.name}
                        </p>
                      </div>
                      <Separator className="bg-[#E8EEF5]" />
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-[#64748B]">
                          Policy Text
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#141C2E]">
                          {saved.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {mode === 'empty' && (
                    <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#FAFCFE] px-6 py-10 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EBF3FC] text-[#0052CC]">
                        <FileText className="size-6" />
                      </div>
                      <h3 className="mt-4 text-base font-bold text-[#001A3D]">
                        No confirmed default cancellation policy configured
                      </h3>
                      <p className="mx-auto mt-1 max-w-md text-sm text-[#64748B]">
                        Default cancellation-policy information will appear here
                        once the required policy terms are supplied.
                      </p>
                    </div>
                  )}
                </section>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                  <aside
                    aria-labelledby="policy-config-heading"
                    className="flex items-start gap-3 rounded-2xl border border-[#DCE2EB] bg-[#F4F8FD] p-5"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#DCEBFC] text-[#0052CC]">
                      <Info className="size-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h3
                        id="policy-config-heading"
                        className="text-sm font-bold text-[#001A3D]"
                      >
                        Default policy configuration
                      </h3>
                      <p className="text-sm leading-relaxed text-[#64748B]">
                        These settings provide default cancellation-policy
                        information. The applicable policy for an actual booking
                        may depend on booking and supplier data handled by the
                        cancellation/refund workflow.
                      </p>
                    </div>
                  </aside>

                  <section
                    aria-labelledby="policy-details-heading"
                    className="space-y-4 rounded-[18px] border border-[#DCE2EB] bg-white px-5 py-4"
                  >
                    <h3
                      id="policy-details-heading"
                      className="text-sm font-bold text-[#001A3D]"
                    >
                      Policy details
                    </h3>
                    <dl className="space-y-3.5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF3FC] text-[#0052CC]">
                          <SquareStack className="size-4" />
                        </div>
                        <div className="space-y-0.5">
                          <dt className="text-xs font-medium text-[#64748B]">
                            Scope
                          </dt>
                          <dd className="text-sm font-semibold text-[#001A3D]">
                            This screen manages platform default
                            cancellation-policy information.
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF3FC] text-[#0052CC]">
                          <Settings className="size-4" />
                        </div>
                        <div className="space-y-0.5">
                          <dt className="text-xs font-medium text-[#64748B]">
                            Booking application
                          </dt>
                          <dd className="text-sm font-semibold text-[#001A3D]">
                            Actual booking policy application is handled by the
                            cancellation/refund workflow.
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </section>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-auto w-full border-t border-[#DCE2EB] bg-white px-6 py-4 text-xs text-[#64748B] lg:px-8">
            © 2026 AeroWing. All rights reserved.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  )
}

import * as React from 'react'
import {
  Info,
  Layers,
  Pencil,
  Receipt,
  SlidersHorizontal,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Separator } from '#/components/ui/separator'
import { SidebarProvider } from '#/components/ui/sidebar'
import { AdminSidebar } from '../admin-sidebar'
import { AdminHeader } from '../admin-header'
import {
  DEMO_TAX_DEFAULT_VALUES,
  EMPTY_TAX_DEFAULT_VALUES,
  SETTINGS_NAVIGATION_SECTIONS,
} from './data'
import type {
  TaxDefaultValues,
  TaxDefaultsMode,
  TaxDefaultsPageProps,
} from './types'
import { cn } from '#/lib/utils'

function modeFromNode(nodeId?: string): TaxDefaultsMode {
  const id = (nodeId || '').replace(':', '-')
  if (id === '1049-1251') return 'view'
  if (id === '1049-277') return 'empty'
  return 'add'
}

function parseRate(value: string) {
  const trimmed = value.trim().replace(/%$/, '')
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null
  const rate = Number(trimmed)
  if (rate < 0 || rate > 100) return null
  return rate
}

function formatRate(value: string) {
  const rate = parseRate(value)
  if (rate === null) return value
  return `${rate}%`
}

export function TaxDefaultsPage({
  initialNodeId = '1049-1250',
  initialMode,
  initialValues,
  onSave,
}: TaxDefaultsPageProps) {
  const resolvedMode = initialMode ?? modeFromNode(initialNodeId)
  const startingValues =
    initialValues !== undefined
      ? initialValues
      : resolvedMode === 'view'
        ? DEMO_TAX_DEFAULT_VALUES
        : null

  const [saved, setSaved] = React.useState<TaxDefaultValues | null>(
    startingValues,
  )
  const [mode, setMode] = React.useState<TaxDefaultsMode>(resolvedMode)
  const [draft, setDraft] = React.useState<TaxDefaultValues>(
    startingValues ?? EMPTY_TAX_DEFAULT_VALUES,
  )
  const [errors, setErrors] = React.useState<{
    taxLabel?: string
    defaultRate?: string
  }>({})
  const { isLoading: isSaving, run } = useActionLoading()

  const baseline = saved ?? EMPTY_TAX_DEFAULT_VALUES
  const hasChanges =
    draft.taxLabel !== baseline.taxLabel ||
    draft.defaultRate !== baseline.defaultRate

  const startEditing = (values: TaxDefaultValues) => {
    setDraft(values)
    setErrors({})
    setMode('add')
  }

  const handleCancel = () => {
    setErrors({})
    if (saved) {
      setDraft(saved)
      setMode('view')
      return
    }
    setDraft(EMPTY_TAX_DEFAULT_VALUES)
    if (resolvedMode !== 'add') setMode('empty')
  }

  const handleSave = () => {
    const taxLabel = draft.taxLabel.trim()
    const nextErrors: { taxLabel?: string; defaultRate?: string } = {}

    if (!taxLabel) nextErrors.taxLabel = 'Enter a tax label.'

    const rate = parseRate(draft.defaultRate)
    if (rate === null) {
      nextErrors.defaultRate = 'Enter a percentage from 0 to 100.'
    }

    setErrors(nextErrors)
    if (nextErrors.taxLabel || nextErrors.defaultRate || rate === null) return

    const nextValues = { taxLabel, defaultRate: String(rate) }
    run(() => {
      setSaved(nextValues)
      setDraft(nextValues)
      setMode('view')
      onSave?.(nextValues)
    })
  }

  return (
    <SidebarProvider defaultOpen>
      <div
        className="flex min-h-screen w-full bg-[#F4F6F9]"
        data-node-id={mode === 'add' ? '1049-1250' : initialNodeId}
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
              { label: 'Tax Defaults', active: true },
            ]}
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
          />

          <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 p-4 sm:p-6 lg:p-7">
            <div className="space-y-1">
              <span className="text-[12px] font-extrabold tracking-wide text-[#0052CC] uppercase">
                Platform Settings
              </span>
              <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-[#001A3D] sm:text-[26px]">
                Platform Settings
              </h1>
              <p className="text-xs font-medium text-[#64748B] sm:text-sm">
                Manage core platform configuration.
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <aside
                aria-label="Platform Settings sections"
                className="w-full shrink-0 rounded-[18px] border border-[#DCE2EB] bg-white p-3 shadow-xs lg:w-65"
              >
                <div className="mb-1 px-2.5 py-1.5">
                  <h2 className="text-[11.5px] font-extrabold tracking-wider text-[#64748B] uppercase">
                    Settings
                  </h2>
                </div>
                <nav className="flex flex-col gap-1">
                  {SETTINGS_NAVIGATION_SECTIONS.map((section) => {
                    const Icon = section.icon
                    const isActive = section.id === 'taxes'
                    return (
                      <a
                        key={section.id}
                        href={section.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'group relative flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-xs transition-all sm:text-sm',
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
                  aria-labelledby="tx-h"
                  className="space-y-5 rounded-[18px] border border-[#DCE2EB] bg-white px-5.5 py-5 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF3FC]">
                        <Receipt className="size-4.5 text-[#0052CC]" />
                      </div>
                      <div className="space-y-0.5">
                        <h2
                          id="tx-h"
                          className="text-base font-bold tracking-tight text-[#001A3D]"
                        >
                          Tax Defaults
                        </h2>
                        <p className="text-xs font-medium text-[#64748B] sm:text-[13px]">
                          Manage the platform’s default tax configuration.
                        </p>
                      </div>
                    </div>

                    {mode === 'view' && saved && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startEditing(saved)}
                        className="h-auto shrink-0 cursor-pointer gap-2 rounded-[11px] border-[#CBD5E1] bg-white px-3.5 py-2 text-sm font-bold text-[#001A3D] shadow-2xs hover:bg-slate-50"
                      >
                        <Pencil className="size-4 text-[#001A3D]" />
                        Edit Tax Defaults
                      </Button>
                    )}

                    {mode === 'empty' && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startEditing(EMPTY_TAX_DEFAULT_VALUES)}
                        className="h-auto shrink-0 cursor-pointer gap-2.5 rounded-[11px] border-[#CBD5E1] bg-white px-3.5 pt-2 pb-2.5 text-sm font-bold text-[#001A3D] shadow-2xs hover:bg-slate-50"
                      >
                        <Pencil className="size-4 text-[#001A3D]" />
                        Configure Tax Defaults
                      </Button>
                    )}
                  </div>

                  {mode === 'add' ? (
                    <form
                      className="space-y-5"
                      onSubmit={(event) => {
                        event.preventDefault()
                        handleSave()
                      }}
                    >
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="tax-label"
                            className="text-sm font-semibold text-[#001A3D]"
                          >
                            Tax Label
                          </Label>
                          <Input
                            id="tax-label"
                            value={draft.taxLabel}
                            aria-invalid={Boolean(errors.taxLabel)}
                            onChange={(event) => {
                              setDraft((current) => ({
                                ...current,
                                taxLabel: event.target.value,
                              }))
                              if (errors.taxLabel) {
                                setErrors((current) => ({
                                  ...current,
                                  taxLabel: undefined,
                                }))
                              }
                            }}
                            className="h-11 rounded-xl border-[#CBD5E1] bg-white px-3.5 text-sm text-[#001A3D] focus-visible:border-[#0052CC] focus-visible:ring-[#0052CC]/30"
                          />
                          <p className="text-xs text-[#64748B]">
                            Detailed application rules are managed by the
                            pricing engine.
                          </p>
                          {errors.taxLabel && (
                            <p className="text-xs font-medium text-red-600">
                              {errors.taxLabel}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="tax-default-rate"
                            className="text-sm font-semibold text-[#001A3D]"
                          >
                            Default Rate (%)
                          </Label>
                          <div className="relative">
                            <Input
                              id="tax-default-rate"
                              inputMode="decimal"
                              value={draft.defaultRate}
                              aria-invalid={Boolean(errors.defaultRate)}
                              onChange={(event) => {
                                setDraft((current) => ({
                                  ...current,
                                  defaultRate: event.target.value.replace(
                                    /[^0-9.]/g,
                                    '',
                                  ),
                                }))
                                if (errors.defaultRate) {
                                  setErrors((current) => ({
                                    ...current,
                                    defaultRate: undefined,
                                  }))
                                }
                              }}
                              className="h-11 rounded-xl border-[#CBD5E1] bg-white pr-10 pl-3.5 text-sm text-[#001A3D] focus-visible:border-[#0052CC] focus-visible:ring-[#0052CC]/30"
                            />
                            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm font-medium text-[#64748B]">
                              %
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B]">
                            Percentage from 0 to 100.
                          </p>
                          {errors.defaultRate && (
                            <p className="text-xs font-medium text-red-600">
                              {errors.defaultRate}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-[#E8EEF5]" />

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-[#64748B]">
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
                  ) : mode === 'view' && saved ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-[#64748B]">
                        Default tax configuration
                      </p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-[#E2E8F0] px-4 py-3.5">
                          <p className="text-xs font-medium text-[#64748B]">
                            Tax Label
                          </p>
                          <p className="mt-1 text-lg font-bold text-[#001A3D]">
                            {saved.taxLabel}
                          </p>
                        </div>
                        <div className="rounded-xl border border-[#E2E8F0] px-4 py-3.5">
                          <p className="text-xs font-medium text-[#64748B]">
                            Default Rate
                          </p>
                          <p className="mt-1 text-lg font-bold text-[#001A3D]">
                            {formatRate(saved.defaultRate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-[#CBD5E3] bg-[#FAFCFE] px-4 py-7.5 text-center">
                      <div className="mb-1.5 flex size-13 items-center justify-center rounded-[15px] bg-[#F4F6F9]">
                        <Receipt className="size-6 text-[#64748B]" />
                      </div>
                      <h3 className="text-[15px] font-extrabold text-[#001A3D]">
                        No confirmed Tax Defaults configured
                      </h3>
                      <p className="max-w-xl text-[13px] leading-relaxed font-medium text-[#64748B]">
                        Default tax configuration will appear here once the
                        required tax rules are supplied.
                      </p>
                    </div>
                  )}
                </section>

                <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                  <aside
                    aria-labelledby="inf-h"
                    className="flex items-start gap-3 rounded-2xl border border-[#DCE2EB] bg-linear-to-b from-[#F3F8FE] to-white px-4.5 py-4 shadow-xs"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[#EBF3FC]">
                      <Info className="size-4.5 text-[#0052CC]" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h2 id="inf-h" className="text-sm font-bold text-[#001A3D]">
                        Default tax configuration
                      </h2>
                      <p className="text-xs leading-relaxed font-medium text-[#64748B] sm:text-[13px]">
                        Tax Defaults provide the platform’s baseline tax
                        configuration. Detailed tax and fee rules are managed
                        separately in the pricing engine.
                      </p>
                    </div>
                  </aside>

                  <section
                    aria-labelledby="td-h"
                    className="space-y-3 rounded-[18px] border border-[#DCE2EB] bg-white px-5 pt-4.25 pb-4.5 shadow-xs"
                  >
                    <h2 id="td-h" className="text-sm font-bold text-[#001A3D]">
                      Tax details
                    </h2>
                    <dl className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF3FC]">
                          <Layers className="size-4 text-[#0052CC]" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <dt className="text-xs font-medium text-[#64748B]">
                            Scope
                          </dt>
                          <dd className="text-sm font-semibold text-[#141C2E]">
                            Platform-level default
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF3FC]">
                          <SlidersHorizontal className="size-4 text-[#0052CC]" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <dt className="text-xs font-medium text-[#64748B]">
                            Detailed rules
                          </dt>
                          <dd className="text-sm font-semibold text-[#141C2E]">
                            Detailed application rules are managed by the
                            pricing engine.
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </section>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-auto w-full border-t border-[#DCE2EB] bg-white px-4 py-4 text-xs text-[#64748B] lg:px-7">
            <span>© 2026 AeroWing. All rights reserved.</span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  )
}

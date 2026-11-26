import * as React from 'react'
import { Lock, User, Info, CheckCircle2, XCircle } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import type { AnyPricingRule } from './types'

interface MarkupRuleDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: AnyPricingRule | null
}

export function MarkupRuleDetailsSheet({
  open,
  onOpenChange,
  rule,
}: MarkupRuleDetailsSheetProps) {
  if (!rule) return null

  const isAdmin = rule.source === 'admin'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-135 p-0 flex flex-col bg-white border-l border-[#DCE2EB] shadow-2xl overflow-y-auto"
      >
        {/* Header matching Figma #710:22498 */}
        <div className="p-6 border-b border-[#E2E8F0] relative">
          <SheetTitle className="text-xl font-extrabold text-[#001A3D] tracking-tight">
            Markup Rule Details
          </SheetTitle>
          <SheetDescription className="text-xs text-[#64748B] mt-1 font-normal">
            {rule.name}
          </SheetDescription>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Card 1: Rule Details */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="text-sm font-bold text-[#001A3D]">Rule</span>
              <span className="text-[11px] font-medium text-[#4F5B70] bg-[#F1F3F7] border border-[#DCE2EB] rounded-full px-2.5 py-0.5 inline-flex items-center gap-1">
                <Info className="size-3 text-[#4F5B70]" />
                Sample data
              </span>
            </div>

            {/* Grid 2 columns */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-[#64748B] block mb-1">Rule Source</span>
                <span className="font-semibold text-[#001A3D] inline-flex items-center gap-1">
                  {isAdmin ? (
                    <>
                      <Lock className="size-3.5 text-[#0267B8]" />
                      Admin configured
                    </>
                  ) : (
                    <>
                      <User className="size-3.5 text-[#D97706]" />
                      Agent configured
                    </>
                  )}
                </span>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">Scope</span>
                <span className="font-bold text-[#001A3D]">{rule.scope}</span>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">Service</span>
                <span className="font-bold text-[#001A3D]">{rule.service}</span>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">Supplier</span>
                <span className="font-bold text-[#001A3D]">
                  {rule.supplier}
                </span>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">Type</span>
                <span className="font-bold text-[#001A3D]">{rule.type}</span>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">Value</span>
                <span className="font-bold text-[#001A3D]">{rule.value}</span>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    rule.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {rule.status === 'active' ? (
                    <>
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3 text-slate-500" />
                      Inactive
                    </>
                  )}
                </span>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">Applied To</span>
                <span className="font-bold text-[#001A3D]">
                  {rule.appliedTo || 'Skyline Demo Travels Ltd'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Context note */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3.5 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#001A3D]">
              {isAdmin ? 'Admin limit context' : 'Agent markup context'}
            </h4>

            <div className="space-y-2.5 text-xs text-[#4F5B70] leading-relaxed">
              <p className="flex items-start gap-2">
                <Lock className="size-3.5 text-[#0267B8] shrink-0 mt-0.5" />
                <span>
                  {isAdmin
                    ? 'This pricing is configured by Aero Wing Admin for your Agent account. It is read-only in the Agent Portal.'
                    : 'This markup is managed by Skyline Demo Travels Ltd and applies to client quotes within platform limits.'}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Info className="size-3.5 text-[#0267B8] shrink-0 mt-0.5" />
                <span>
                  When several pricing or markup rules apply, they are resolved
                  according to configured pricing precedence.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-5 text-xs font-semibold text-[#1D2939] border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC]"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

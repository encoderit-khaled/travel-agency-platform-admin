import * as React from 'react'
import {
  Lock,
  Layers,
  Building2,
  Plane,
  Tag,
  CheckCircle2,
  XCircle,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { AdminPricingRule, AgentMarkupRule } from './types'

interface MarkupRuleDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: (AdminPricingRule | AgentMarkupRule) | null
}

export function MarkupRuleDetailsDialog({
  open,
  onOpenChange,
  rule,
}: MarkupRuleDetailsDialogProps) {
  if (!rule) return null

  const isAdmin = rule.source === 'admin'
  const isActive = rule.status === 'active'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-120 p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Header matching Figma #710:22498 */}
          <SheetHeader className="space-y-1 pr-6">
            <SheetTitle className="text-xl font-extrabold text-[#001A3D] tracking-tight">
              Markup Rule Details
            </SheetTitle>
            <SheetDescription className="text-xs text-[#64748B] font-medium">
              {rule.name}
            </SheetDescription>
          </SheetHeader>

          {/* Rule Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="text-sm font-bold text-[#001A3D]">Rule</span>
              <Badge
                variant="outline"
                className="bg-[#EFF6FF] text-[#0267B8] border-blue-200 text-[11px] font-semibold px-2 py-0.5 flex items-center gap-1"
              >
                <Sparkles className="size-3 text-[#0267B8]" />
                Sample data
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
              {/* Rule Source */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Rule Source
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isAdmin
                      ? 'bg-blue-50 text-[#0267B8] border border-blue-200'
                      : 'bg-emerald-50 text-[#059669] border border-emerald-200'
                  }`}
                >
                  {isAdmin ? (
                    <>
                      <Lock className="size-3" />
                      Admin configured
                    </>
                  ) : (
                    <>
                      <Tag className="size-3" />
                      Agent configured
                    </>
                  )}
                </span>
              </div>

              {/* Scope */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Scope
                </span>
                <span className="font-bold text-[#001A3D] text-xs">
                  {rule.scope}
                </span>
              </div>

              {/* Service */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Service
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-[#001A3D] text-xs">
                  {rule.service === 'Flight' ? (
                    <Plane className="size-3.5 text-[#0267B8]" />
                  ) : rule.service === 'Hotel' ? (
                    <Building2 className="size-3.5 text-[#0267B8]" />
                  ) : (
                    <Layers className="size-3.5 text-[#0267B8]" />
                  )}
                  {rule.service}
                </span>
              </div>

              {/* Supplier */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Supplier
                </span>
                <span className="font-bold text-[#001A3D] text-xs">
                  {rule.supplier}
                </span>
              </div>

              {/* Type */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Type
                </span>
                <span className="font-bold text-[#001A3D] text-xs">
                  {rule.type}
                </span>
              </div>

              {/* Value */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Value
                </span>
                <span className="font-extrabold text-[#001A3D] text-sm">
                  {rule.value}
                </span>
              </div>

              {/* Status */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Status
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-[#ECFDF3] text-[#12B76A]'
                      : 'bg-[#F2F4F7] text-[#667085]'
                  }`}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3" />
                      Inactive
                    </>
                  )}
                </span>
              </div>

              {/* Applied To */}
              <div>
                <span className="text-[#64748B] font-medium block mb-1">
                  Applied To
                </span>
                <span className="font-bold text-[#001A3D] text-xs">
                  {rule.appliedTo || 'Skyline Demo Travels Ltd'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Limit Context */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4.5 space-y-3">
            <h3 className="text-xs font-bold text-[#001A3D] tracking-wide uppercase">
              Admin limit context
            </h3>
            <div className="space-y-2.5 text-xs text-[#475467] leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Lock className="size-3.5 text-[#0267B8] shrink-0 mt-0.5" />
                <p>
                  This pricing is configured by Aero Wing Admin for your Agent
                  account. It is read-only in the Agent Portal.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Info className="size-3.5 text-[#64748B] shrink-0 mt-0.5" />
                <p>
                  When several pricing or markup rules apply, they are resolved
                  according to configured pricing rule precedence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="pt-6 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-xl border-[#CBD5E1] text-[#001A3D] font-bold text-xs px-6 h-10 hover:bg-[#F8FAFC]"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

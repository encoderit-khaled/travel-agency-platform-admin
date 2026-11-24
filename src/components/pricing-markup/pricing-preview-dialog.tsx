import * as React from 'react'
import { Lock, Tag, Receipt, Layers, Sparkles, Info } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { AdminPricingRule, AgentMarkupRule } from './types'

interface PricingPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  adminRules: AdminPricingRule[]
  agentRules: AgentMarkupRule[]
}

export function PricingPreviewDialog({
  open,
  onOpenChange,
  adminRules,
  agentRules,
}: PricingPreviewDialogProps) {
  const [selectedService, setSelectedService] = React.useState('Flight')
  const [selectedSupplier, setSelectedSupplier] = React.useState('all')

  // Find applicable admin pricing for selected service
  const applicableAdminRule =
    adminRules.find(
      (r) => r.service.toLowerCase() === selectedService.toLowerCase(),
    ) ||
    adminRules.find((r) => r.service === 'All Services') ||
    adminRules[0]

  // Find applicable agent markup for selected service
  const applicableAgentRule =
    agentRules.find(
      (r) =>
        r.service.toLowerCase() === selectedService.toLowerCase() &&
        r.status === 'active',
    ) ||
    agentRules.find(
      (r) => r.service === 'All Services' && r.status === 'active',
    )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-[480px] p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div className="space-y-5">
          {/* Header matching Figma #710:22497 */}
          <SheetHeader className="space-y-1 pr-6">
            <SheetTitle className="text-xl font-extrabold text-[#001A3D] tracking-tight">
              Pricing Preview
            </SheetTitle>
            <SheetDescription className="text-xs text-[#64748B] font-medium leading-relaxed">
              Read-only view of the pricing layers that may apply to a service.
            </SheetDescription>
          </SheetHeader>

          {/* Agency context badge */}
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-[#001A3D]">
              Applicable pricing for Skyline Demo Travels Ltd
            </span>
            <Badge
              variant="outline"
              className="bg-[#EFF6FF] text-[#0267B8] border-blue-200 text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1"
            >
              <Sparkles className="size-3 text-[#0267B8]" />
              Sample data
            </Badge>
          </div>

          {/* Service & Supplier Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Service
              </label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-bold rounded-xl text-[#001A3D]">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flight">Flight</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Travel Package">Travel Package</SelectItem>
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

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Supplier
              </label>
              <Select
                value={selectedSupplier}
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-bold rounded-xl text-[#001A3D]">
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All suppliers</SelectItem>
                  <SelectItem value="biman">
                    Biman Bangladesh Airlines
                  </SelectItem>
                  <SelectItem value="emirates">Emirates</SelectItem>
                  <SelectItem value="amadeus">Amadeus GDS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
            <Info className="size-3.5 text-[#64748B] shrink-0" />
            <span>
              No supplier-specific rules are configured, so supplier selection
              isn't needed.
            </span>
          </div>

          {/* Precedence Banner */}
          <div className="bg-[#EFF6FF] border border-blue-200 rounded-xl p-3 flex items-start gap-3">
            <Layers className="size-4 text-[#0267B8] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-[#001A3D]">
                Multiple markup rules may apply
              </p>
              <p className="text-[#475467] text-[11px] leading-relaxed">
                The platform will resolve applicable rules using the configured
                pricing precedence.
              </p>
            </div>
          </div>

          {/* Layers Stack matching Figma #710:22497 */}
          <div className="space-y-3">
            {/* Layer 1: Admin Pricing */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="size-3.5 text-[#0267B8]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    Admin Pricing
                  </span>
                </div>
                <span className="text-xs font-bold text-[#001A3D]">
                  Configured
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9] text-xs">
                <span className="text-[#475467] font-medium truncate pr-2">
                  {applicableAdminRule.name}
                </span>
                <span className="font-extrabold text-[#001A3D] shrink-0">
                  {applicableAdminRule.value}
                </span>
              </div>
            </div>

            {/* Layer 2: Agent Markup */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="size-3.5 text-[#D97706]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    Agent Markup
                  </span>
                </div>
                <span className="text-xs font-bold text-[#001A3D]">
                  {applicableAgentRule ? 'Configured' : 'None configured'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9] text-xs">
                <span className="text-[#475467] font-medium truncate pr-2">
                  {applicableAgentRule?.name ||
                    `No Agent markup for ${selectedService}`}
                </span>
                <span className="font-extrabold text-[#001A3D] shrink-0">
                  {applicableAgentRule ? applicableAgentRule.value : '0%'}
                </span>
              </div>
            </div>

            {/* Layer 3: Final Customer Pricing */}
            <div className="bg-[#FFFDF5] border border-[#FDE68A] rounded-xl p-3.5 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <Receipt className="size-3.5 text-[#D97706]" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#92400E]">
                  Final Customer Pricing
                </span>
              </div>
              <p className="text-sm font-black text-[#001A3D]">
                Calculated during quoting
              </p>
              <p className="text-[11px] text-[#78350F] leading-relaxed">
                Resolved according to configured pricing precedence. No final
                amount is calculated in this preview.
              </p>
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

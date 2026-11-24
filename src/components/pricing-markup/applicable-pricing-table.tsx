import * as React from 'react'
import {
  ShieldCheck,
  Lock,
  Tag,
  Eye,
  CheckCircle2,
  Info,
  Plane,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import type { AdminPricingRule } from './types'

interface ApplicablePricingTableProps {
  rules: AdminPricingRule[]
  onViewDetails: (rule: AdminPricingRule) => void
}

export function ApplicablePricingTable({
  rules,
  onViewDetails,
}: ApplicablePricingTableProps) {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="size-9 rounded-xl bg-blue-50 text-[#0267B8] flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="size-4.5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#001A3D] tracking-tight">
              Your Applicable Pricing
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              These pricing settings are configured by Aero Wing Admin and
              cannot be edited here.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-[#F8FAFC] text-[#475467] border-[#E2E8F0] text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5"
          >
            <Lock className="size-3 text-[#64748B]" />
            Read-only
          </Badge>
          <Badge
            variant="outline"
            className="bg-[#EFF6FF] text-[#0267B8] border-blue-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5"
          >
            <Sparkles className="size-3 text-[#0267B8]" />
            Sample data
          </Badge>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="py-3.5 px-4 font-bold">Rule</th>
              <th className="py-3.5 px-4 font-bold">Scope</th>
              <th className="py-3.5 px-4 font-bold">Service</th>
              <th className="py-3.5 px-4 font-bold">Supplier</th>
              <th className="py-3.5 px-4 font-bold">Type</th>
              <th className="py-3.5 px-4 font-bold">Value</th>
              <th className="py-3.5 px-4 font-bold">Applied To</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {rules.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-xs text-[#64748B]"
                >
                  No applicable admin pricing rules found matching filters.
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="hover:bg-[#F8FAFC]/80 transition-colors group"
                >
                  {/* Rule Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span
                        className="font-bold text-[#0267B8] group-hover:underline cursor-pointer"
                        onClick={() => onViewDetails(rule)}
                      >
                        {rule.name}
                      </span>
                      <small className="mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#0267B8] border border-blue-200">
                          <ShieldCheck className="size-3" />
                          Admin
                        </span>
                      </small>
                    </div>
                  </td>

                  {/* Scope */}
                  <td className="py-3.5 px-4 text-xs font-medium text-[#475467]">
                    {rule.scope}
                  </td>

                  {/* Service */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D2939]">
                      {rule.service === 'Hotel' ? (
                        <Building2 className="size-3.5 text-[#0267B8]" />
                      ) : rule.service === 'Flight' ? (
                        <Plane className="size-3.5 text-[#0267B8]" />
                      ) : (
                        <Layers className="size-3.5 text-[#0267B8]" />
                      )}
                      {rule.service}
                    </span>
                  </td>

                  {/* Supplier */}
                  <td className="py-3.5 px-4 text-xs text-[#64748B]">
                    {rule.supplier}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 text-xs font-medium text-[#1D2939]">
                    {rule.type}
                  </td>

                  {/* Value */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-[#001A3D] text-sm">
                      {rule.value}
                    </span>
                  </td>

                  {/* Applied To */}
                  <td className="py-3.5 px-4 text-xs text-[#475467] font-medium">
                    {rule.appliedTo}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ECFDF3] text-[#12B76A] border border-[#A6F4C5]">
                      <CheckCircle2 className="size-3" />
                      Active
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(rule)}
                      className="h-8 px-2.5 text-xs font-bold text-[#001A3D] border-[#CBD5E1] hover:bg-[#EFF6FF] hover:text-[#0267B8]"
                    >
                      <Eye className="size-3.5 mr-1" />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B]">
        <Info className="size-4 shrink-0 text-[#64748B]" />
        <span>
          Admin pricing is shown for reference only. Values are fictional sample
          data, not contractual pricing.
        </span>
      </div>
    </section>
  )
}

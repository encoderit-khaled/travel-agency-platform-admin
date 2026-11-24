import * as React from 'react'
import { ShieldCheck, Percent, Layers, Store, CheckCircle2 } from 'lucide-react'

interface PricingKpiCardsProps {
  adminConfigured?: boolean
  totalMarkupRules?: number
  activeMarkupRules?: number
  inactiveMarkupRules?: number
  coverageCount?: number
  totalServices?: number
  supplierRulesCount?: number
}

export function PricingKpiCards({
  adminConfigured = true,
  totalMarkupRules = 3,
  activeMarkupRules = 2,
  inactiveMarkupRules = 1,
  coverageCount = 3,
  totalServices = 8,
  supplierRulesCount = 0,
}: PricingKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Admin Pricing */}
      <article className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#CBD5E1]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="size-9 rounded-xl bg-[#EFF6FF] text-[#0267B8] flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </span>
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Admin Pricing
            </h3>
          </div>
          <p className="text-2xl font-black text-[#1D2939] tracking-tight">
            {adminConfigured ? 'Configured' : 'Not Configured'}
          </p>
        </div>
        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Pricing rules are applied to this Agent account.
        </p>
      </article>

      {/* Card 2: Your Markup Rules */}
      <article className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#CBD5E1]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="size-9 rounded-xl bg-[#FEFCE8] text-[#CA8A04] flex items-center justify-center shrink-0">
              <Percent className="size-5" />
            </span>
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Your Markup Rules
            </h3>
          </div>
          <p className="text-2xl font-black text-[#1D2939] tracking-tight">
            {totalMarkupRules} {totalMarkupRules === 1 ? 'Rule' : 'Rules'}
          </p>
        </div>
        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          {activeMarkupRules} active · {inactiveMarkupRules} inactive
        </p>
      </article>

      {/* Card 3: Service Coverage */}
      <article className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#CBD5E1]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="size-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <Layers className="size-5" />
            </span>
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Service Coverage
            </h3>
          </div>
          <p className="text-2xl font-black text-[#1D2939] tracking-tight">
            {coverageCount} of {totalServices}
          </p>
        </div>
        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Service modules with your markup rules
        </p>
      </article>

      {/* Card 4: Supplier-specific Rules */}
      <article className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#CBD5E1]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="size-9 rounded-xl bg-[#F8FAFC] text-[#64748B] flex items-center justify-center shrink-0">
              <Store className="size-5" />
            </span>
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Supplier-specific Rules
            </h3>
          </div>
          <p className="text-2xl font-black text-[#94A3B8] tracking-tight">
            {supplierRulesCount > 0
              ? `${supplierRulesCount} active`
              : 'None configured'}
          </p>
        </div>
        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Service-level rules only
        </p>
      </article>
    </div>
  )
}

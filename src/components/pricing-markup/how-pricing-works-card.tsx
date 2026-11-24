import * as React from 'react'
import {
  HelpCircle,
  Shield,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export function HowPricingWorksCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Card: How pricing works (Figma #710:22417 Hawkes Blue) */}
      <section className="bg-[#EBF3FC] border border-[#D2E4F9] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#0267B8]/15 text-[#0267B8] flex items-center justify-center shrink-0">
              <HelpCircle className="size-4.5" />
            </div>
            <h2 className="text-base font-extrabold text-[#001A3D] tracking-tight">
              How pricing works
            </h2>
          </div>

          <div className="space-y-2 text-xs text-[#475467] leading-relaxed">
            <p>
              Your client price may include pricing configured by Aero Wing
              Admin together with markup configured by your Agent account.
            </p>
            <p>
              When several pricing or markup rules apply, the platform resolves
              them using the configured pricing rule precedence.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#D2E4F9] flex items-center gap-2 text-xs text-[#475467]">
          <Info className="size-3.5 text-[#0267B8] shrink-0" />
          <span>
            Sub-agent markup is managed separately under{' '}
            <a
              href="/sub-agents"
              className="font-bold text-[#0267B8] hover:underline"
            >
              Sub-agents
            </a>
            .
          </span>
        </div>
      </section>

      {/* Right Card: Markup Limits (Figma #710:22431) */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#FEFCE8] text-[#CA8A04] flex items-center justify-center shrink-0">
              <Shield className="size-4.5" />
            </div>
            <h2 className="text-base font-extrabold text-[#001A3D] tracking-tight">
              Markup Limits
            </h2>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex items-start gap-2.5">
            <Lock className="size-4 text-[#64748B] shrink-0 mt-0.5" />
            <div>
              <b className="text-xs font-bold text-[#1D2939] block">
                Limits are configured by Aero Wing Admin
              </b>
              <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                Your markup must remain within the limits applicable to your
                Agent account.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Exact limits</span>
          <span className="font-bold text-[#1D2939] bg-[#F1F5F9] px-2.5 py-1 rounded-full border border-[#E2E8F0]">
            Not included in this design-preview dataset
          </span>
        </div>
      </section>
    </div>
  )
}

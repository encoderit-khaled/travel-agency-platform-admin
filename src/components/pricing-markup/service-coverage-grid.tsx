import * as React from 'react'
import {
  Layers,
  Plane,
  Building2,
  Luggage,
  Compass,
  Car,
  Smartphone,
  Train,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Info,
  Sparkles,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import type { ServiceCoverageModule } from './types'

interface ServiceCoverageGridProps {
  modules: ServiceCoverageModule[]
}

export function ServiceCoverageGrid({ modules }: ServiceCoverageGridProps) {
  const isContentLoading = useContentLoading()

  const getIcon = (type: ServiceCoverageModule['iconType']) => {
    switch (type) {
      case 'plane':
        return Plane
      case 'hotel':
        return Building2
      case 'package':
        return Luggage
      case 'activity':
        return Compass
      case 'car':
        return Car
      case 'esim':
        return Smartphone
      case 'train':
        return Train
      case 'insurance':
        return ShieldCheck
      default:
        return Layers
    }
  }

  return (
    <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="size-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="size-4.5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#001A3D] tracking-tight">
              Service Coverage
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              All 8 service modules and whether you’ve added your own markup
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="bg-[#EFF6FF] text-[#0267B8] border-blue-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="size-3 text-[#0267B8]" />
          Sample data
        </Badge>
      </div>

      {/* Grid of 8 services */}
      <div className="p-5">
        {isContentLoading ? (
          <CardGridSkeleton
            count={8}
            className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
            cardClassName="h-24 rounded-xl"
          />
        ) : null}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 ${isContentLoading ? 'hidden' : ''}`}
        >
          {modules.map((m) => {
            const Icon = getIcon(m.iconType)
            const isAgentActive = m.hasAgentRule && m.status === 'active'
            const isAgentInactive = m.hasAgentRule && m.status === 'inactive'

            return (
              <div
                key={m.id}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-[#CBD5E1] hover:bg-white"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="size-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0267B8] shadow-2xs shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <span className="font-bold text-sm text-[#1D2939] truncate">
                    {m.name}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  {m.hasAgentRule ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF3] text-[#12B76A] border border-[#A6F4C5] w-fit">
                      <CheckCircle2 className="size-3" />
                      {m.badgeLabel}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A] w-fit">
                      <Clock className="size-3" />
                      {m.badgeLabel}
                    </span>
                  )}

                  <span
                    className={`text-[11px] font-medium mt-0.5 ${
                      isAgentActive
                        ? 'text-[#12B76A]'
                        : isAgentInactive
                          ? 'text-[#64748B]'
                          : 'text-[#64748B]'
                    }`}
                  >
                    {m.subtext}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B]">
        <Info className="size-4 shrink-0 text-[#64748B]" />
        <span>
          “No Agent rule” only means you haven’t added your own markup for that
          service. Underlying pricing may still apply.
        </span>
      </div>
    </section>
  )
}

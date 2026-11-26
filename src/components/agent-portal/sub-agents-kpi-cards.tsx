import { CardGridSkeleton } from '#/components/ui/skeleton'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Users,
  CalendarDays,
  Percent,
  ShieldCheck,
  Check,
  AlertCircle,
  Minus,
  ArrowRight,
} from 'lucide-react'
import type {
  SubAgent,
  SubAgentFilterStatus,
  SubAgentFilterBooking,
} from './types'

interface SubAgentsKPICardsProps {
  subAgents: SubAgent[]
  onFilterStatusChange: (status: SubAgentFilterStatus) => void
  onFilterBookingChange: (booking: SubAgentFilterBooking) => void
  onViewAllBookings: () => void
}

export function SubAgentsKPICards({
  subAgents,
  onFilterStatusChange,
  onFilterBookingChange: _onFilterBookingChange,
  onViewAllBookings,
}: SubAgentsKPICardsProps) {
  const isContentLoading = useContentLoading()
  const totalSubAgents = subAgents.length
  const totalBookings = subAgents.reduce((sum, sa) => sum + sa.bookingsCount, 0)

  const markupConfiguredCount = subAgents.filter(
    (sa) => sa.markupConfigured,
  ).length
  const markupNotConfiguredCount = totalSubAgents - markupConfiguredCount

  const permissionsConfiguredCount = subAgents.filter(
    (sa) => sa.permissionsConfigured,
  ).length
  const permissionsNotConfiguredCount =
    totalSubAgents - permissionsConfiguredCount

  return (
    <>
      {isContentLoading ? (
        <CardGridSkeleton
          count={4}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4"
          cardClassName="h-40 rounded-[18px]"
        />
      ) : null}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 ${isContentLoading ? 'hidden' : ''}`}
      >
      {/* KPI Card 1: Total Sub-agents */}
      <article className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-[11px] bg-[#EAF4FD] flex items-center justify-center text-[#0267B8]">
              <Users className="size-4.5" />
            </div>
            <h3 className="text-sm font-extrabold text-[#4F5B70] tracking-tight">
              Total Sub-agents
            </h3>
          </div>
          <div className="pt-1">
            <span className="text-3xl font-extrabold text-[#141C2E] tracking-tight">
              {totalSubAgents}
            </span>
            <p className="text-[13px] font-semibold text-[#4F5B70] mt-1 leading-snug">
              Under your Agent account
            </p>
          </div>
        </div>
      </article>

      {/* KPI Card 2: Sub-agent Bookings */}
      <article className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-[11px] bg-[#EAF4FD] flex items-center justify-center text-[#0267B8]">
              <CalendarDays className="size-4.5" />
            </div>
            <h3 className="text-sm font-extrabold text-[#4F5B70] tracking-tight">
              Sub-agent Bookings
            </h3>
          </div>
          <div className="pt-1">
            <span className="text-3xl font-extrabold text-[#141C2E] tracking-tight">
              {totalBookings}
            </span>
            <p className="text-[13px] font-semibold text-[#4F5B70] mt-1 leading-snug">
              Bookings made by your Sub-agents
            </p>
            <p className="text-[11.5px] font-bold text-[#8C9BAE] mt-1.5 leading-tight">
              Uses your Agent account’s wallet and available credit.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1F3F6] mt-3">
          <button
            type="button"
            onClick={onViewAllBookings}
            className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer"
          >
            <span>View Sub-agent Bookings</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>

      {/* KPI Card 3: Markup Configuration */}
      <article className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-[11px] bg-[#FFF9E6] flex items-center justify-center text-[#B45309]">
              <Percent className="size-4.5" />
            </div>
            <h3 className="text-sm font-extrabold text-[#4F5B70] tracking-tight">
              Markup Configuration
            </h3>
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <div className="flex items-center flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAFBF1] text-[#0B6A45] text-xs font-extrabold">
                <Check className="size-3.5" />
                <span>{markupConfiguredCount}</span>
                <span className="font-bold">Configured</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F3F6] text-[#4F5B70] text-xs font-extrabold">
                <Minus className="size-3" />
                <span>{markupNotConfiguredCount}</span>
                <span className="font-bold">Not configured</span>
              </span>
            </div>

            <p className="text-[13px] font-semibold text-[#4F5B70] leading-snug">
              Sub-agent markup on top of your rates
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1F3F6] mt-3">
          <button
            type="button"
            onClick={() => onFilterStatusChange('markup_needed')}
            className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer"
          >
            <span>Show not configured</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>

      {/* KPI Card 4: Access / Permissions */}
      <article className="bg-white rounded-[18px] border border-[#DCE2EB] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-[11px] bg-[#EAF4FD] flex items-center justify-center text-[#0267B8]">
              <ShieldCheck className="size-4.5" />
            </div>
            <h3 className="text-sm font-extrabold text-[#4F5B70] tracking-tight">
              Access / Permissions
            </h3>
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <div className="flex items-center flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAFBF1] text-[#0B6A45] text-xs font-extrabold">
                <Check className="size-3.5" />
                <span>{permissionsConfiguredCount}</span>
                <span className="font-bold">Assigned</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#9A3412] text-xs font-extrabold">
                <AlertCircle className="size-3.5" />
                <span>{permissionsNotConfiguredCount}</span>
                <span className="font-bold">Need config</span>
              </span>
            </div>

            <p className="text-[13px] font-semibold text-[#4F5B70] leading-snug">
              Each Sub-agent has its own permissions
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1F3F6] mt-3">
          <button
            type="button"
            onClick={() => onFilterStatusChange('permissions_needed')}
            className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-extrabold text-[#0267B8] hover:text-[#012A5E] transition-colors cursor-pointer"
          >
            <span>Show needs configuration</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>
      </div>
    </>
  )
}

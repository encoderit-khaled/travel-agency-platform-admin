import {
  Wallet,
  CreditCard,
  Percent,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import type { DashboardMetricSummary } from './types'

interface DashboardKpiCardsProps {
  metrics: DashboardMetricSummary
  onViewWallet?: () => void
  onViewCredit?: () => void
  onViewCommissions?: () => void
  onViewBookings?: () => void
}

export function DashboardKpiCards({
  metrics,
  onViewWallet,
  onViewCredit,
  onViewCommissions,
  onViewBookings,
}: DashboardKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Wallet Balance */}
      <article className="flex flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-[0px_4px_16px_rgba(20,28,46,0.04)] transition-all hover:shadow-[0px_8px_24px_rgba(20,28,46,0.08)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#E6F0FA] text-[#0267B8]">
              <Wallet className="size-[19px]" />
            </div>
            <h3 className="font-heading text-sm font-bold text-[#5A6578]">
              Wallet Balance
            </h3>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#94A3B8]">
              {metrics.walletBalance}
            </div>
            <div className="mt-1 text-xs text-[#5A6578]">
              {metrics.walletAvailable ? 'Available balance' : 'Not available'}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#EEF2F6]">
          <button
            type="button"
            onClick={onViewWallet}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Wallet</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>

      {/* 2. Available Credit */}
      <article className="flex flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-[0px_4px_16px_rgba(20,28,46,0.04)] transition-all hover:shadow-[0px_8px_24px_rgba(20,28,46,0.08)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#EAF0F8] text-[#012A5E]">
              <CreditCard className="size-[19px]" />
            </div>
            <h3 className="font-heading text-sm font-bold text-[#5A6578]">
              Available Credit
            </h3>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#94A3B8]">
              {metrics.availableCredit}
            </div>
            <div className="mt-1 text-xs text-[#5A6578]">
              {metrics.creditAvailable ? 'Active credit line' : 'Not available'}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#EEF2F6]">
          <button
            type="button"
            onClick={onViewCredit}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Credit</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>

      {/* 3. Commissions */}
      <article className="flex flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-[0px_4px_16px_rgba(20,28,46,0.04)] transition-all hover:shadow-[0px_8px_24px_rgba(20,28,46,0.08)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#FEF7E6] text-[#B87A00]">
              <Percent className="size-[19px]" />
            </div>
            <h3 className="font-heading text-sm font-bold text-[#5A6578]">
              Commissions
            </h3>
          </div>

          {/* 3 Metrics in rounded boxes */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-[#F4F6FA] p-2 text-center">
              <span className="block text-[11px] text-[#5A6578]">
                This Month
              </span>
              <span className="block text-sm font-extrabold text-[#94A3B8] mt-0.5">
                {metrics.commissions.thisMonth}
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F6FA] p-2 text-center">
              <span className="block text-[11px] text-[#5A6578]">Pending</span>
              <span className="block text-sm font-extrabold text-[#94A3B8] mt-0.5">
                {metrics.commissions.pending}
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F6FA] p-2 text-center">
              <span className="block text-[11px] text-[#5A6578]">
                Total Earned
              </span>
              <span className="block text-sm font-extrabold text-[#94A3B8] mt-0.5">
                {metrics.commissions.totalEarned}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#EEF2F6]">
          <button
            type="button"
            onClick={onViewCommissions}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Commissions</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>

      {/* 4. Bookings */}
      <article className="flex flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-[0px_4px_16px_rgba(20,28,46,0.04)] transition-all hover:shadow-[0px_8px_24px_rgba(20,28,46,0.08)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#EBF2FA] text-[#0267B8]">
              <CalendarDays className="size-[19px]" />
            </div>
            <h3 className="font-heading text-sm font-bold text-[#5A6578]">
              Bookings
            </h3>
          </div>

          {/* 3 Metrics in rounded boxes */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-[#F4F6FA] p-2 text-center">
              <span className="block text-[11px] text-[#5A6578]">Upcoming</span>
              <span className="block text-sm font-extrabold text-[#94A3B8] mt-0.5">
                {metrics.bookings.upcoming}
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F6FA] p-2 text-center">
              <span className="block text-[11px] text-[#5A6578]">
                Confirmed
              </span>
              <span className="block text-sm font-extrabold text-[#94A3B8] mt-0.5">
                {metrics.bookings.confirmed}
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F6FA] p-2 text-center">
              <span className="block text-[11px] text-[#5A6578]">Pending</span>
              <span className="block text-sm font-extrabold text-[#94A3B8] mt-0.5">
                {metrics.bookings.pending}
              </span>
            </div>
          </div>

          <div className="mt-2 text-center text-[11px] text-[#7A8699]">
            No bookings yet
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#EEF2F6]">
          <button
            type="button"
            onClick={onViewBookings}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View All Bookings</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>
    </div>
  )
}

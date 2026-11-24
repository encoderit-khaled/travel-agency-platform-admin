import {
  CalendarDays,
  Bell,
  Wallet,
  CreditCard,
  Percent,
  Tag,
  UserCheck,
  FileText,
  BarChart3,
  ArrowRight,
  Plus,
  CheckCircle2,
  Check,
  Plane,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DASHBOARD_REPORTS, STATEMENT_ITEMS } from './data'

interface DashboardGridCardsProps {
  onStartBooking?: () => void
  onViewNotifications?: () => void
  onTopUpWallet?: () => void
  onViewLedger?: () => void
  onRequestCredit?: () => void
  onViewCommissions?: () => void
  onManageMarkup?: () => void
  onManageSubAgents?: () => void
  onViewStatements?: () => void
  onOpenReport?: (id: string) => void
}

export function DashboardGridCards({
  onStartBooking,
  onViewNotifications,
  onTopUpWallet,
  onViewLedger,
  onRequestCredit,
  onViewCommissions,
  onManageMarkup,
  onManageSubAgents,
  onViewStatements,
  onOpenReport,
}: DashboardGridCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Recent Bookings (Spans 3 Columns) section#c-bk */}
      <section className="col-span-1 md:col-span-2 lg:col-span-3 rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EEF2F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#EBF2FA] text-[#0267B8]">
              <CalendarDays className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Recent Bookings
              </h2>
              <p className="text-xs text-[#5A6578]">
                Agent and Sub-agent booking history
              </p>
            </div>
          </div>
        </div>

        {/* Body Empty State */}
        <div className="p-8 lg:p-12 text-center flex flex-col items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#EBF2FA] text-[#0267B8] mb-3">
            <Plane className="size-7" />
          </div>
          <h3 className="font-heading text-sm font-bold text-[#141C2E]">
            No bookings found
          </h3>
          <p className="text-xs text-[#5A6578] max-w-sm mt-1">
            Bookings you or your sub-agents create will appear here. Start
            searching travel services to create your first booking.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              onClick={onStartBooking}
              className="h-10 px-4 rounded-[10px] bg-[#0267B8] hover:bg-[#025699] text-white font-bold text-xs gap-2"
            >
              <Plus className="size-4" />
              <span>Start New Booking</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onStartBooking}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View All Bookings</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 2. Needs Attention section#c-att */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#FEF7E6] text-[#B87A00]">
              <Bell className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Needs Attention
              </h2>
              <p className="text-xs text-[#5A6578]">
                Actionable items for your business
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#EDF7EE] text-[#00875A] mb-2.5">
            <CheckCircle2 className="size-6" />
          </div>
          <p className="text-xs font-bold text-[#141C2E]">
            Nothing needs your attention right now.
          </p>
          <p className="text-[11px] text-[#5A6578] mt-1 max-w-xs">
            Booking actions, credit, wallet top-ups, etc. will appear here when
            required.
          </p>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onViewNotifications}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Notifications</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 3. Wallet Overview section#c-wal */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#E6F0FA] text-[#0267B8]">
              <Wallet className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Wallet
              </h2>
              <p className="text-xs text-[#5A6578]">Agent wallet and ledger</p>
            </div>
          </div>
        </div>

        <div className="p-5 flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F4F6FA] p-3">
              <span className="block text-[11px] text-[#5A6578]">
                Current Balance
              </span>
              <span className="block text-xl font-extrabold text-[#94A3B8] mt-0.5">
                —
              </span>
              <span className="block text-[10px] text-[#7A8699]">
                Not available
              </span>
            </div>

            <div className="rounded-xl bg-[#F4F6FA] p-3">
              <span className="block text-[11px] text-[#5A6578]">
                Latest transaction
              </span>
              <span className="block text-xl font-extrabold text-[#94A3B8] mt-0.5">
                —
              </span>
              <span className="block text-[10px] text-[#7A8699]">
                Not available
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#5A6578] leading-relaxed">
            Top up by card payment or by a manual deposit recorded by Aero Wing.
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onTopUpWallet}
              className="rounded-lg border-[#DCE2EB] text-[#001A3D] text-xs font-bold hover:bg-[#F4F6FA]"
            >
              Top Up Wallet
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onViewLedger}
              className="text-[#5A6578] text-xs font-bold hover:text-[#001A3D]"
            >
              Quick View Ledger
            </Button>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onViewLedger}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Wallet</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 4. Credit Overview section#c-cr */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#EAF0F8] text-[#012A5E]">
              <CreditCard className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Credit
              </h2>
              <p className="text-xs text-[#5A6578]">Credit limit and usage</p>
            </div>
          </div>
          <span className="rounded-md bg-[#001A3D]/5 px-2 py-0.5 text-[10.5px] font-extrabold text-[#001A3D]">
            Website only
          </span>
        </div>

        <div className="p-5 flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[#F4F6FA] p-2.5">
              <span className="block text-[10px] text-[#5A6578]">
                Credit Limit
              </span>
              <span className="block text-base font-extrabold text-[#94A3B8]">
                —
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F6FA] p-2.5">
              <span className="block text-[10px] text-[#5A6578]">
                Used Credit
              </span>
              <span className="block text-base font-extrabold text-[#94A3B8]">
                —
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F6FA] p-2.5">
              <span className="block text-[10px] text-[#5A6578]">
                Available Credit
              </span>
              <span className="block text-base font-extrabold text-[#94A3B8]">
                —
              </span>
            </div>
            <div className="rounded-xl bg-[#F4F6FA] p-2.5">
              <span className="block text-[10px] text-[#5A6578]">
                Outstanding Balance
              </span>
              <span className="block text-base font-extrabold text-[#94A3B8]">
                —
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#5A6578]">
            Credit details are not available.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRequestCredit}
            className="rounded-lg border-[#DCE2EB] text-[#001A3D] text-xs font-bold hover:bg-[#F4F6FA]"
          >
            Request Credit
          </Button>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onRequestCredit}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Credit</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 5. Commission section#c-cm */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#FEF7E6] text-[#B87A00]">
              <Percent className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Commission
              </h2>
              <p className="text-xs text-[#5A6578]">
                Commission on Agent bookings
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 flex-1 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-[#F4F6FA] px-3 py-2">
              <div>
                <div className="text-xs font-bold text-[#5A6578]">Pending</div>
                <div className="text-[10px] text-[#7A8699]">
                  Recorded, not yet confirmed
                </div>
              </div>
              <div className="text-base font-extrabold text-[#94A3B8]">—</div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#F4F6FA] px-3 py-2">
              <div>
                <div className="text-xs font-bold text-[#5A6578]">Earned</div>
                <div className="text-[10px] text-[#7A8699]">
                  Confirmed, awaiting settlement
                </div>
              </div>
              <div className="text-base font-extrabold text-[#94A3B8]">—</div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#F4F6FA] px-3 py-2">
              <div>
                <div className="text-xs font-bold text-[#5A6578]">Settled</div>
                <div className="text-[10px] text-[#7A8699]">
                  Settlement completed
                </div>
              </div>
              <div className="text-base font-extrabold text-[#94A3B8]">—</div>
            </div>
          </div>

          <p className="text-[11px] text-[#5A6578] leading-relaxed">
            No commission activity yet. Commission appears here once your
            bookings earn it.
          </p>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onViewCommissions}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Commission Details</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 6. Pricing & Markup section#c-mk */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#EBF2FA] text-[#0267B8]">
              <Tag className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                My Pricing & Markup
              </h2>
              <p className="text-xs text-[#5A6578]">
                Agent, module and supplier markup
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F4F6FA] text-[#94A3B8] mb-2.5">
            <Tag className="size-6 text-[#5A6578]" />
          </div>
          <p className="text-xs font-bold text-[#141C2E]">
            No markup data available
          </p>
          <p className="text-[11px] text-[#5A6578] mt-1 max-w-xs">
            Markup rules configured for your account will appear here.
          </p>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onManageMarkup}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Pricing & Markup</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 7. Sub-agents section#c-sub */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#EAF0F8] text-[#012A5E]">
              <UserCheck className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Sub-agents
              </h2>
              <p className="text-xs text-[#5A6578]">
                Agent → Sub-agent hierarchy
              </p>
            </div>
          </div>
          <span className="rounded-md bg-[#001A3D]/5 px-2 py-0.5 text-[10.5px] font-extrabold text-[#001A3D]">
            Website only
          </span>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F4F6FA] text-[#94A3B8] mb-2.5">
            <UserCheck className="size-6 text-[#5A6578]" />
          </div>
          <p className="text-xs font-bold text-[#141C2E]">No Sub-agents yet</p>
          <p className="text-[11px] text-[#5A6578] mt-1 max-w-xs">
            Add Sub-agents so your team can book under your Agent account.
          </p>
          <div className="mt-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onManageSubAgents}
              className="rounded-lg border-[#DCE2EB] text-[#001A3D] text-xs font-bold hover:bg-[#F4F6FA]"
            >
              Manage Sub-agents
            </Button>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onManageSubAgents}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Sub-agents</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 8. Statements section#c-stm */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#EBF2FA] text-[#0267B8]">
              <FileText className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Statements
              </h2>
              <p className="text-xs text-[#5A6578]">
                Periodic Agent account statements
              </p>
            </div>
          </div>
          <span className="rounded-md bg-[#001A3D]/5 px-2 py-0.5 text-[10.5px] font-extrabold text-[#001A3D]">
            Website only
          </span>
        </div>

        <div className="p-5 flex-1 space-y-3">
          <p className="text-xs text-[#5A6578]">
            Your Agent statement brings together:
          </p>
          <ul className="space-y-1.5 text-xs font-medium text-[#141C2E]">
            {STATEMENT_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-3.5 text-[#00875A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onViewStatements}
              className="rounded-lg border-[#DCE2EB] text-[#001A3D] text-xs font-bold hover:bg-[#F4F6FA]"
            >
              View Statements
            </Button>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={onViewStatements}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>Download Statement</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 9. Reports section#c-rep */}
      <section className="rounded-[18px] border border-[#DCE2EB] bg-white shadow-[0px_4px_16px_rgba(20,28,46,0.04)] flex flex-col justify-between overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF2F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-[11px] bg-[#FEF7E6] text-[#B87A00]">
              <BarChart3 className="size-[19px]" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#001A3D]">
                Reports
              </h2>
              <p className="text-xs text-[#5A6578]">
                Detailed reports open in the Reports area
              </p>
            </div>
          </div>
          <span className="rounded-md bg-[#001A3D]/5 px-2 py-0.5 text-[10.5px] font-extrabold text-[#001A3D]">
            Website only
          </span>
        </div>

        <div className="p-5 flex-1">
          <div className="grid grid-cols-2 gap-2">
            {DASHBOARD_REPORTS.map((rep) => (
              <button
                key={rep.id}
                type="button"
                onClick={() => onOpenReport?.(rep.id)}
                className="group flex items-center justify-between rounded-xl border border-[#DCE2EB] bg-white p-2.5 text-left transition-all hover:border-[#0267B8] hover:bg-[#F8FAFD]"
              >
                <div>
                  <div className="text-xs font-bold text-[#001A3D] group-hover:text-[#0267B8]">
                    {rep.name}
                  </div>
                  <div className="text-[10px] text-[#5A6578]">{rep.type}</div>
                </div>
                <ArrowRight className="size-3 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0267B8]" />
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#EEF2F6] bg-[#F8FAFD]">
          <button
            type="button"
            onClick={() => onOpenReport?.('sales')}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0267B8] hover:underline"
          >
            <span>View Reports</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </div>
  )
}

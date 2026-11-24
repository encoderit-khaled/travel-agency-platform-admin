import {
  Lock,
  Clock,
  TrendingUp,
  CheckCircle2,
  RotateCcw,
  Ticket,
  Users,
  Info,
  Plane,
  Building,
  Package,
  Compass,
  Car,
  AlertCircle,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { CommissionRecord } from './commission-tracking-data'

interface CommissionDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: CommissionRecord | null
}

export function CommissionDetailsSheet({
  open,
  onOpenChange,
  record,
}: CommissionDetailsSheetProps) {
  if (!record) return null

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Flight':
        return Plane
      case 'Hotel':
        return Building
      case 'Travel Package':
        return Package
      case 'Activity':
        return Compass
      case 'Car Rental':
        return Car
      default:
        return Plane
    }
  }

  const ServiceIcon = getServiceIcon(record.service)

  const handleViewBooking = () => {
    window.location.href = `/bookings?booking=${encodeURIComponent(record.bookingId)}`
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-[540px] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white border-l border-[#DCE2EB]"
      >
        <div className="space-y-6">
          {/* Header */}
          <SheetHeader className="space-y-1 pr-8">
            <SheetTitle className="text-xl font-extrabold text-[#001A3D] tracking-tight">
              Commission Details
            </SheetTitle>
            <SheetDescription className="text-xs text-[#5A6E85]">
              {record.bookingId} · {record.service}
            </SheetDescription>
          </SheetHeader>

          {/* Banner 1: Read-only record notice */}
          <div className="rounded-xl border border-[#E6EAF0] bg-[#F8FAFC] p-4 flex items-start gap-3">
            <div className="size-8 rounded-lg bg-white border border-[#E6EAF0] flex items-center justify-center text-[#001A3D] shrink-0 mt-0.5">
              <Lock className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#001A3D]">
                Read-only record
              </p>
              <p className="text-xs text-[#5A6E85]">
                Commission rules, amounts and settlements are managed by Aero
                Wing Admin.
              </p>
            </div>
          </div>

          {/* Banner 2: Status Banner */}
          {record.commissionStatus === 'Pending' && (
            <div className="rounded-xl border border-[#BFDBFE] bg-[#F0F7FF] p-4 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-white/90 border border-[#BFDBFE] flex items-center justify-center text-[#0284C7] shrink-0 mt-0.5">
                <Clock className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#0369A1]">Pending</p>
                <p className="text-xs text-[#0369A1]/90 leading-relaxed">
                  Commission has been calculated for the confirmed booking and
                  is currently pending.
                </p>
              </div>
            </div>
          )}

          {record.commissionStatus === 'Earned' && (
            <div className="rounded-xl border border-[#FDE3B5] bg-[#FEF6E9] p-4 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-white/90 border border-[#FDE3B5] flex items-center justify-center text-[#D97706] shrink-0 mt-0.5">
                <TrendingUp className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#92400E]">Earned</p>
                <p className="text-xs text-[#B45309] leading-relaxed">
                  Commission has been earned for the confirmed booking and is
                  awaiting settlement.
                </p>
              </div>
            </div>
          )}

          {record.commissionStatus === 'Settled' && (
            <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-white/90 border border-[#A7F3D0] flex items-center justify-center text-[#059669] shrink-0 mt-0.5">
                <CheckCircle2 className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#065F46]">Settled</p>
                <p className="text-xs text-[#047857] leading-relaxed">
                  Commission settlement has been recorded by Aero Wing Admin.
                </p>
              </div>
            </div>
          )}

          {record.commissionStatus === 'Commission reversed' && (
            <div className="rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] p-4 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-white/90 border border-[#CBD5E1] flex items-center justify-center text-[#475569] shrink-0 mt-0.5">
                <RotateCcw className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#1E293B]">
                  Commission reversed
                </p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Commission was reversed due to booking{' '}
                  {record.bookingStatus.toLowerCase()} and is excluded from
                  active commission totals.
                </p>
              </div>
            </div>
          )}

          {/* Commission Data Card */}
          <div className="rounded-2xl border border-[#E6EAF0] p-5 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
              <span className="text-sm font-bold text-[#001A3D]">
                Commission
              </span>
              <Badge
                variant="outline"
                className="bg-[#F4F6FA] text-[#5A6E85] border-[#DCE2EB] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1"
              >
                <Info className="size-3 text-[#5A6E85]" />
                Sample data
              </Badge>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Booking</p>
                <p className="font-extrabold text-[#001A3D] text-sm">
                  {record.bookingId}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Customer</p>
                <p className="font-extrabold text-[#001A3D] text-sm">
                  {record.customer}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Service</p>
                <div className="flex items-center gap-1.5 font-bold text-[#001A3D] text-sm">
                  <ServiceIcon className="size-4 text-[#0066CC] shrink-0" />
                  <span>{record.service}</span>
                </div>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Created By</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-[#001A3D] text-sm">
                    {record.createdByName}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-[#EBF3FC] text-[#0066CC] border-transparent text-[10px] font-semibold py-0.5 px-1.5 rounded-full flex items-center gap-0.5"
                  >
                    <Users className="size-2.5" />
                    {record.createdBySource}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">
                  Booking Status
                </p>
                <div>
                  {record.bookingStatus === 'Confirmed' && (
                    <Badge
                      variant="outline"
                      className="bg-[#ECFDF5] text-[#107C41] border-[#A7F3D0] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                    >
                      <CheckCircle2 className="size-3" />
                      Confirmed
                    </Badge>
                  )}
                  {record.bookingStatus === 'Refunded' && (
                    <Badge
                      variant="outline"
                      className="bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                    >
                      <RotateCcw className="size-3" />
                      Refunded
                    </Badge>
                  )}
                  {record.bookingStatus === 'Cancelled' && (
                    <Badge
                      variant="outline"
                      className="bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                    >
                      <AlertCircle className="size-3" />
                      Cancelled
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">
                  Commission Status
                </p>
                <div>
                  {record.commissionStatus === 'Pending' && (
                    <Badge
                      variant="outline"
                      className="bg-[#EFF6FF] text-[#0284C7] border-[#BFDBFE] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                    >
                      <Clock className="size-3" />
                      Pending
                    </Badge>
                  )}
                  {record.commissionStatus === 'Earned' && (
                    <Badge
                      variant="outline"
                      className="bg-[#FEF6E9] text-[#D97706] border-[#FDE3B5] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                    >
                      <TrendingUp className="size-3" />
                      Earned
                    </Badge>
                  )}
                  {record.commissionStatus === 'Settled' && (
                    <Badge
                      variant="outline"
                      className="bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                    >
                      <CheckCircle2 className="size-3" />
                      Settled
                    </Badge>
                  )}
                  {record.commissionStatus === 'Commission reversed' && (
                    <Badge
                      variant="outline"
                      className="bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1 w-fit"
                    >
                      <RotateCcw className="size-3" />
                      Commission reversed
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">
                  Commission Amount
                </p>
                <p className="font-extrabold text-[#001A3D] text-sm">
                  {record.amount}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">
                  Commission Rule
                </p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {record.rule}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Supplier</p>
                <p className="font-medium text-[#001A3D] text-xs leading-relaxed">
                  Supplier information unavailable in this design-preview
                  dataset
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">
                  Booking / Commission Date
                </p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {record.date}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-agent note */}
          <div className="flex items-start gap-2 pt-1 text-[11px] text-[#5A6E85] leading-relaxed">
            <Users className="size-3.5 text-[#0066CC] shrink-0 mt-0.5" />
            <span>
              Created By shows booking origin only. No separate Sub-agent
              commission, payout or split is defined.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-[#E6EAF0] flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleViewBooking}
            className="rounded-xl border-[#DCE2EB] bg-white hover:bg-slate-50 text-[#001A3D] font-bold text-xs px-4 py-2.5 h-auto shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Ticket className="size-3.5 mr-1" />
            View Booking
          </Button>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#001A3D] font-extrabold text-xs px-7 py-2.5 h-auto shadow-sm cursor-pointer"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

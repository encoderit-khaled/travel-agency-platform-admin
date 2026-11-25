import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  Plane,
  Hotel,
  Package,
  Compass,
  Car,
  Smartphone,
  Train,
  Shield,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  Hash,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import type { BookingRecordItem } from './admin-reports-bookings-types'
import { cn } from '#/lib/utils'

interface BookingDetailsDialogProps {
  booking: BookingRecordItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getServiceIcon(service: string) {
  switch (service) {
    case 'Flights':
      return <Plane className="size-4 text-[#0267B8]" />
    case 'Hotels':
      return <Hotel className="size-4 text-[#3B82F6]" />
    case 'Travel Packages':
      return <Package className="size-4 text-[#6366F1]" />
    case 'Activities':
      return <Compass className="size-4 text-[#F59E0B]" />
    case 'Car Rental':
      return <Car className="size-4 text-[#EC4899]" />
    case 'eSIM':
      return <Smartphone className="size-4 text-[#10B981]" />
    case 'Bus / Train':
      return <Train className="size-4 text-[#8B5CF6]" />
    case 'Travel Insurance':
      return <Shield className="size-4 text-[#14B8A6]" />
    default:
      return <Package className="size-4 text-[#0267B8]" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Confirmed':
      return (
        <Badge className="bg-[#E6F4EA] text-[#137333] border-[#CEEAD6] font-bold text-xs gap-1.5 px-3 py-1 rounded-full">
          <CheckCircle2 className="size-3.5" />
          Confirmed
        </Badge>
      )
    case 'Completed':
      return (
        <Badge className="bg-[#EBF2FA] text-[#012A5E] border-[#D3E3F5] font-bold text-xs gap-1.5 px-3 py-1 rounded-full">
          <CheckCircle2 className="size-3.5 text-[#0267B8]" />
          Completed
        </Badge>
      )
    case 'Pending':
      return (
        <Badge className="bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3] font-bold text-xs gap-1.5 px-3 py-1 rounded-full">
          <Clock className="size-3.5 text-[#B06000]" />
          Pending
        </Badge>
      )
    case 'Cancelled':
      return (
        <Badge className="bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF] font-bold text-xs gap-1.5 px-3 py-1 rounded-full">
          <XCircle className="size-3.5 text-[#C5221F]" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-[#DCE2EB] rounded-2xl shadow-xl">
        {/* Header Bar */}
        <div className="bg-[#012A5E] text-white p-6 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F1C134]">
                Booking Reference
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs text-white/80">{booking.channel}</span>
            </div>
            <DialogTitle className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {booking.bookingRef}
            </DialogTitle>
            <DialogDescription className="text-white/70 text-xs">
              Created on {booking.dateTimeFormatted}
            </DialogDescription>
          </div>
          <div>{getStatusBadge(booking.status)}</div>
        </div>

        <div className="p-6 space-y-6">
          {/* Service & Trip Overview */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-white shadow-2xs border border-[#E2E8F0] flex items-center justify-center">
                  {getServiceIcon(booking.service)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#012A5E]">
                    {booking.service}
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Supplier: {booking.supplier}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#64748B] block">PNR / Ref</span>
                <span className="text-xs font-bold text-[#012A5E] font-mono bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                  {booking.pnr}
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] font-medium leading-relaxed">
              {booking.serviceDetails}
            </div>
          </div>

          {/* Customer & Booker Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-[#DCE2EB] rounded-xl p-4 space-y-3 bg-white">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
                <User className="size-3.5 text-[#0267B8]" />
                Customer / Booker
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#64748B] block">Full Name</span>
                  <span className="font-bold text-[#012A5E] text-sm">
                    {booking.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Email Address</span>
                  <span className="font-semibold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                    <Mail className="size-3 text-[#64748B]" />
                    {booking.customerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Phone</span>
                  <span className="font-semibold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                    <Phone className="size-3 text-[#64748B]" />
                    {booking.customerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial & Payment Details */}
            <div className="border border-[#DCE2EB] rounded-xl p-4 space-y-3 bg-white">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
                <CreditCard className="size-3.5 text-[#0267B8]" />
                Payment & Pricing
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Payment Method</span>
                  <span className="font-bold text-[#012A5E]">
                    {booking.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Payment Status</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    {booking.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Sales Channel</span>
                  <span className="font-semibold text-[#012A5E]">
                    {booking.channel}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EEF1F5] flex items-center justify-between">
                  <span className="font-extrabold text-[#012A5E]">
                    Total Amount
                  </span>
                  <span className="text-base font-extrabold text-[#012A5E]">
                    ${booking.amountFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes or Integration Log */}
          {booking.notes && (
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
              <span className="font-bold text-[#012A5E] block">
                Booking Operations Note:
              </span>
              <p className="text-[#4F5B70] leading-relaxed">{booking.notes}</p>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EEF1F5]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs rounded-xl border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F4F6FA]"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                window.print()
              }}
              className="text-xs bg-[#012A5E] hover:bg-[#001D42] text-white rounded-xl gap-2 cursor-pointer font-bold"
            >
              <Printer className="size-3.5" />
              Print Voucher / Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

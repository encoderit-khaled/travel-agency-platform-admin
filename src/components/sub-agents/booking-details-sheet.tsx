import * as React from 'react'
import {
  Plane,
  Building,
  Package,
  Compass,
  Car,
  Ticket,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  Info,
  Printer,
  Wallet,
  ExternalLink,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import type { SubAgentBookingRecord, BookingServiceType } from './types'

interface BookingDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: SubAgentBookingRecord | null
  subAgentName?: string
  parentAgentName?: string
}

function getServiceIcon(service: BookingServiceType) {
  switch (service) {
    case 'Flight':
      return <Plane className="size-4 text-[#0267B8]" />
    case 'Hotel':
      return <Building className="size-4 text-[#0267B8]" />
    case 'Travel Package':
      return <Package className="size-4 text-[#0267B8]" />
    case 'Activity':
      return <Compass className="size-4 text-[#0267B8]" />
    case 'Car Rental':
      return <Car className="size-4 text-[#0267B8]" />
    default:
      return <Ticket className="size-4 text-[#0267B8]" />
  }
}

export function BookingDetailsSheet({
  open,
  onOpenChange,
  booking,
  subAgentName = 'Mirpur Desk',
  parentAgentName = 'Skyline Demo Travels Ltd',
}: BookingDetailsSheetProps) {
  const [ticketPreviewOpen, setTicketPreviewOpen] = React.useState(false)

  if (!booking) return null

  const isFlight = booking.service === 'Flight'
  const isTicketed = booking.status === 'Ticketed'
  const isConfirmed = booking.status === 'Confirmed'
  const isPending = booking.status === 'Pending'
  const isCancelled = booking.status === 'Cancelled'

  const hasDocument =
    booking.documentStatus === 'E-ticket available' ||
    booking.documentStatus === 'Voucher available'

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="sm:max-w-125 md:max-w-130 p-0 flex flex-col justify-between bg-[#F8FAFC]"
        >
          {/* Header */}
          <div className="p-6 pb-4 bg-white border-b border-[#E6EAF0]">
            <SheetHeader className="pr-8">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-black text-[#012A5E]">
                  Booking Details
                </SheetTitle>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs font-bold text-[#0267B8] border-[#DCE2EB] bg-white hover:bg-[#F4F6FA] rounded-lg"
                >
                  <Link
                    to="/sub-agents/booking-details"
                    search={{
                      booking: booking.ref,
                      'node-id': '707-18493',
                    }}
                  >
                    <ExternalLink className="size-3 mr-1" />
                    Full Screen
                  </Link>
                </Button>
              </div>
              <SheetDescription className="text-xs text-[#4F5B70] leading-relaxed mt-1">
                Booking summary from the Agent Booking History. View full screen
                (Figma #707:18493) or manage details below.
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Card 1: Booking */}
            <div className="rounded-2xl border border-[#DCE2EB] bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F6]">
                <h3 className="text-base font-extrabold text-[#012A5E]">
                  Booking
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0]">
                  <Info className="size-3 text-[#64748B]" />
                  Sample data
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
                {/* Booking Reference */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Booking Reference
                  </span>
                  <div className="text-sm font-bold text-[#012A5E] font-mono tracking-tight">
                    {booking.ref}
                  </div>
                </div>

                {/* Customer */}
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Customer
                  </span>
                  <div className="text-sm font-bold text-[#012A5E]">
                    {booking.customer}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    · booked on behalf of customer
                  </div>
                </div>

                {/* Service */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Service
                  </span>
                  <div className="text-sm font-bold text-[#012A5E] flex items-center gap-2">
                    {getServiceIcon(booking.service)}
                    <span>{booking.service}</span>
                  </div>
                </div>

                {/* Travel Date */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Travel Date
                  </span>
                  <div className="text-sm font-bold text-[#012A5E]">
                    {booking.travelDate}
                  </div>
                </div>

                {/* Booking Status */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Booking Status
                  </span>
                  <div>
                    {isTicketed && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
                        <Ticket className="size-3.5" />
                        Ticketed
                      </span>
                    )}
                    {isConfirmed && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAFBF1] text-[#0B6A45] border border-emerald-200">
                        <CheckCircle2 className="size-3.5" />
                        Confirmed
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF6E7] text-[#9A6400] border border-amber-200">
                        <Clock className="size-3.5" />
                        Pending
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F3F6] text-[#64748B] border border-slate-200">
                        <XCircle className="size-3.5" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Created By */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Created By
                  </span>
                  <div className="text-sm font-bold text-[#012A5E]">
                    {subAgentName}
                  </div>
                </div>

                {/* Parent Agent */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Parent Agent
                  </span>
                  <div className="text-sm font-bold text-[#012A5E]">
                    {parentAgentName}
                  </div>
                </div>

                {/* Document */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Document
                  </span>
                  <div>
                    {hasDocument ? (
                      <div className="text-xs font-bold text-[#0B6A45] flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>{booking.documentStatus}</span>
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-slate-300 inline-block" />
                        <span>{booking.documentStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: E-ticket / Voucher Document Card */}
            {hasDocument && (
              <div className="rounded-2xl border border-[#DCE2EB] bg-white p-5 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#012A5E]">
                    {isFlight ? 'E-ticket' : 'Voucher'}
                  </h3>
                  <p className="text-xs text-[#4F5B70] mt-0.5">
                    {isFlight
                      ? 'The e-ticket was generated by the flight booking workflow.'
                      : 'The booking confirmation voucher was generated by the reservation workflow.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    onClick={() => setTicketPreviewOpen(true)}
                    className="bg-[#F1C134] text-[#012A5E] hover:bg-[#E5B52B] font-extrabold text-xs px-4 py-2.5 h-auto rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="size-4" />
                    <span>View {isFlight ? 'E-ticket' : 'Voucher'}</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      alert(
                        `Downloading PDF for ${booking.ref} (${booking.customer})`,
                      )
                    }}
                    className="border-[#DCE2EB] text-[#012A5E] hover:bg-[#F4F6FA] font-bold text-xs px-4 py-2.5 h-auto rounded-xl transition-colors flex items-center gap-2 cursor-pointer bg-white"
                  >
                    <Download className="size-4" />
                    <span>Download PDF</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Card 3: Settlement Notice matching Figma #694:7691 */}
            <div className="rounded-2xl border border-[#DCE2EB] bg-white p-4 shadow-2xs flex items-start gap-3">
              <div className="size-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] shrink-0 text-[#0267B8] flex items-center justify-center">
                <Wallet className="size-4 text-[#475569]" />
              </div>
              <p className="text-xs text-[#4F5B70] leading-relaxed pt-0.5">
                Settled against {parentAgentName}&apos;s wallet and available
                credit. Cancellation and refunds are handled in the
                booking-detail workflow.
              </p>
            </div>
          </div>

          {/* Footer Bar matching Figma #694:7691 */}
          <div className="p-4 px-6 bg-white border-t border-[#E6EAF0] flex items-center justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#DCE2EB] text-[#012A5E] font-bold text-xs px-6 py-2 h-auto rounded-xl hover:bg-[#F4F6FA] bg-white shrink-0 cursor-pointer shadow-2xs"
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Interactive E-ticket Preview Modal */}
      <Dialog open={ticketPreviewOpen} onOpenChange={setTicketPreviewOpen}>
        <DialogContent className="sm:max-w-155 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F6]">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#0267B8] text-white flex items-center justify-center font-extrabold text-lg">
                  AW
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-[#012A5E]">
                    Electronic Ticket Receipt
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#4F5B70]">
                    AeroWing Global Travel Network · Passenger E-ticket
                  </DialogDescription>
                </div>
              </div>
              <Badge className="bg-[#EAFBF1] text-[#0B6A45] border-emerald-200 text-xs font-bold">
                CONFIRMED & ISSUED
              </Badge>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Ticket Header Details */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C9BAE]">
                  PNR
                </span>
                <p className="font-mono font-bold text-sm text-[#012A5E] mt-0.5">
                  {booking.pnr || 'PK782D'}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C9BAE]">
                  Booking Ref
                </span>
                <p className="font-mono font-bold text-sm text-[#012A5E] mt-0.5">
                  {booking.ref}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C9BAE]">
                  Issue Date
                </span>
                <p className="font-semibold text-[#012A5E] mt-0.5">
                  12 Dec 2026
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C9BAE]">
                  Issuing Desk
                </span>
                <p className="font-semibold text-[#012A5E] mt-0.5">
                  {subAgentName}
                </p>
              </div>
            </div>

            {/* Flight / Item Details */}
            <div className="p-4 rounded-xl border border-[#DCE2EB] bg-white space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
                <div className="flex items-center gap-2">
                  <Plane className="size-4 text-[#0267B8]" />
                  <span className="font-bold text-sm text-[#012A5E]">
                    {booking.routeOrItem || 'DAC ➔ DXB (Emirates EK-585)'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#0267B8] bg-[#EAF4FD] px-2 py-0.5 rounded">
                  Economy Standard
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[#8C9BAE]">Passenger:</span>
                  <p className="font-bold text-[#012A5E] mt-0.5">
                    {booking.customer}
                  </p>
                  <p className="text-[11px] text-[#4F5B70]">Adult (12+ yrs)</p>
                </div>
                <div>
                  <span className="text-[#8C9BAE]">Travel Date:</span>
                  <p className="font-bold text-[#012A5E] mt-0.5">
                    {booking.travelDate}
                  </p>
                  <p className="text-[11px] text-[#4F5B70]">Departs 08:30 AM</p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#4F5B70]">Total Paid (BDT)</span>
                <div className="text-lg font-black text-[#012A5E]">
                  {booking.amount || 'BDT 42,500'}
                </div>
              </div>
              <div className="text-right text-xs text-[#4F5B70]">
                <span>Settled via Parent Credit Line</span>
                <p className="font-semibold text-[#012A5E]">
                  {parentAgentName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E6EAF0]">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs font-bold"
              >
                <Printer className="size-3.5" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Download link generated')}
                className="gap-1.5 text-xs font-bold"
              >
                <Download className="size-3.5" />
                Download
              </Button>
            </div>
            <Button
              onClick={() => setTicketPreviewOpen(false)}
              className="bg-[#012A5E] hover:bg-[#012248] text-white text-xs font-bold"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

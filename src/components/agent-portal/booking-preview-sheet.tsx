import * as React from 'react'
import {
  X,
  Plane,
  Building,
  Package,
  Compass,
  Car,
  Smartphone,
  Train,
  ShieldCheck,
  Ticket,
  Calendar,
  User,
  Mail,
  Phone,
  FileCheck2,
  Printer,
  Download,
  Building2,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  ExternalLink,
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
import { Separator } from '#/components/ui/separator'
import type {
  AgentBookingItem,
  AgentBookingServiceType,
} from './agent-bookings-data'

interface BookingPreviewSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: AgentBookingItem | null
  onViewDocument?: (booking: AgentBookingItem) => void
}

function getServiceIcon(service: AgentBookingServiceType) {
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
    case 'eSIM':
      return <Smartphone className="size-4 text-[#0267B8]" />
    case 'Bus / Train':
      return <Train className="size-4 text-[#0267B8]" />
    case 'Travel Insurance':
      return <ShieldCheck className="size-4 text-[#0267B8]" />
    default:
      return <Ticket className="size-4 text-[#0267B8]" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Ticketed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F7F0] text-[#0A7B45] border border-[#A6E5C5]">
          <CheckCircle2 className="size-3.5" /> Ticketed
        </span>
      )
    case 'Issued':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F7F0] text-[#0A7B45] border border-[#A6E5C5]">
          <CheckCircle2 className="size-3.5" /> Issued
        </span>
      )
    case 'Confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF3FC] text-[#0267B8] border border-[#BBD8F5]">
          <CheckCircle2 className="size-3.5" /> Confirmed
        </span>
      )
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF7E6] text-[#B87A00] border border-[#FDE3A7]">
          <Clock className="size-3.5" /> Pending
        </span>
      )
    case 'Refunded':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4F6FA] text-[#4F5B70] border border-[#DCE2EB]">
          <RotateCcw className="size-3.5" /> Refunded
        </span>
      )
    case 'Failed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEECEC] text-[#C62828] border border-[#FBCACA]">
          <XCircle className="size-3.5" /> Failed
        </span>
      )
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEECEC] text-[#C62828] border border-[#FBCACA]">
          <XCircle className="size-3.5" /> Cancelled
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4F6FA] text-[#4F5B70]">
          {status}
        </span>
      )
  }
}

export function BookingPreviewSheet({
  open,
  onOpenChange,
  booking,
  onViewDocument,
}: BookingPreviewSheetProps) {
  if (!booking) return null

  const hasDocument = Boolean(booking.documentAction)
  const isParent = booking.createdByType === 'Parent Agent'

  const handlePrint = () => {
    window.print()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 overflow-y-auto bg-[#F8FAFC] flex flex-col z-50 text-[#111827]"
      >
        {/* Top Header matching Figma #706:17471 / #707:18493 */}
        <div className="bg-linear-to-r from-[#012A5E] to-[#0267B8] text-white p-6 shrink-0 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wide uppercase text-white/80">
              Agent Portal · M2.11 Booking Preview
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="size-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              aria-label="Close Preview"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {booking.ref}
            </h2>
            {getStatusBadge(booking.status)}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
              {booking.createdByType}
            </span>
          </div>

          <p className="text-xs text-white/80 mt-1">
            {booking.service} booking for{' '}
            <strong className="text-white">{booking.customer}</strong> · Travel
            date: {booking.travelDate}
          </p>

          {/* Quick Document Actions in Header */}
          {hasDocument && (
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2.5 flex-wrap">
              <Button
                size="sm"
                onClick={() => onViewDocument?.(booking)}
                className="bg-[#F1C134] text-[#012A5E] hover:bg-[#E5B52B] font-bold text-xs h-8 px-3 rounded-lg shadow-xs cursor-pointer"
              >
                <FileCheck2 className="size-3.5 mr-1.5" />
                {booking.documentAction}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="bg-white/10 border-white/25 text-white hover:bg-white/20 text-xs h-8 px-3 rounded-lg cursor-pointer"
              >
                <Printer className="size-3.5 mr-1.5" />
                Print Record
              </Button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1">
          {/* Card 1: Booking Summary */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6EAF0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F5B70]">
                Booking Overview
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0267B8] bg-[#EBF3FC] px-2 py-0.5 rounded-md">
                Booked on behalf of customer
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Booking Reference
                </span>
                <span className="font-extrabold text-[#012A5E] text-sm">
                  {booking.ref}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Service Type
                </span>
                <div className="flex items-center gap-1.5 font-bold text-[#012A5E] mt-0.5">
                  <div className="p-1 rounded-md bg-[#EBF3FC]">
                    {getServiceIcon(booking.service)}
                  </div>
                  <span>{booking.service}</span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Travel Date
                </span>
                <span className="font-bold text-[#111827]">
                  {booking.travelDate}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Booking Status
                </span>
                <span className="font-bold">
                  {getStatusBadge(booking.status)}
                </span>
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Created By
                </span>
                <span className="font-bold text-[#012A5E]">
                  {booking.createdBy}
                </span>
                <span className="block text-[10px] text-[#64748B]">
                  {isParent
                    ? 'Parent Agency Account'
                    : 'Authorized Sub-agent Desk'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Booking Date
                </span>
                <span className="font-medium text-[#111827]">
                  {booking.bookingDate}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Information */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6EAF0] shadow-2xs space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F5B70] block border-b border-[#F1F5F9] pb-2">
              Customer Information
            </span>

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#EBF3FC] text-[#0267B8] font-bold flex items-center justify-center text-sm shrink-0">
                {booking.customer
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-[#012A5E] text-sm">
                  {booking.customer}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  End-customer passenger profile
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="flex items-center gap-2 text-[#4F5B70]">
                <Mail className="size-3.5 text-[#0267B8] shrink-0" />
                <span className="truncate">{booking.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4F5B70]">
                <Phone className="size-3.5 text-[#0267B8] shrink-0" />
                <span>{booking.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Itinerary & Service Details */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6EAF0] shadow-2xs space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F5B70] block border-b border-[#F1F5F9] pb-2">
              Service & Itinerary
            </span>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0267B8]">
                    {getServiceIcon(booking.service)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#012A5E]">
                      {booking.routeOrItem}
                    </p>
                    {booking.supplier && (
                      <p className="text-[11px] text-[#64748B]">
                        Supplier: {booking.supplier}
                      </p>
                    )}
                  </div>
                </div>
                {booking.pnr && (
                  <span className="text-xs font-mono font-bold bg-[#EBF3FC] text-[#0267B8] px-2 py-0.5 rounded border border-[#BBD8F5]">
                    PNR: {booking.pnr}
                  </span>
                )}
              </div>

              {booking.cabinOrRoom && (
                <div className="pt-2 border-t border-[#E2E8F0]/80 flex items-center justify-between text-xs text-[#4F5B70]">
                  <span>Class / Accommodation:</span>
                  <span className="font-semibold text-[#012A5E]">
                    {booking.cabinOrRoom}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Financial & Settlement */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6EAF0] shadow-2xs space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F5B70] block border-b border-[#F1F5F9] pb-2">
              Agency Financial Settlement
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Net B2B Fare / Base:</span>
                <span className="font-semibold text-[#111827]">
                  {booking.fareAmount}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Agency Markup Applied:</span>
                <span className="font-semibold text-emerald-700">
                  +{booking.markupAmount}
                </span>
              </div>
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-sm">
                <span className="font-bold text-[#012A5E]">
                  Gross Booking Value:
                </span>
                <span className="font-extrabold text-[#0267B8] text-base">
                  {booking.totalAmount}
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-[#EBF3FC]/60 border border-[#C6DDF7] flex items-start gap-2.5">
              <Wallet className="size-4 text-[#0267B8] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#012A5E] leading-relaxed">
                This booking is settled against{' '}
                <strong>Skyline Demo Travels Ltd</strong>’s parent wallet and
                available credit line. Cancellation and refund actions follow
                standard agency policy.
              </p>
            </div>
          </div>

          {/* Card 5: Documents Available */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6EAF0] shadow-2xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F5B70] block border-b border-[#F1F5F9] pb-2">
              Booking Documents
            </span>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="size-4.5 text-[#0267B8]" />
                <div>
                  <p className="text-xs font-bold text-[#012A5E]">
                    {booking.documentStatus}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    {hasDocument
                      ? 'Ready for download, customer print, or sharing'
                      : 'Documents are generated once supplier issues voucher'}
                  </p>
                </div>
              </div>

              {hasDocument && (
                <Button
                  size="sm"
                  onClick={() => onViewDocument?.(booking)}
                  className="bg-[#0267B8] text-white hover:bg-[#025699] font-bold text-xs h-8 px-3 rounded-lg cursor-pointer"
                >
                  <ExternalLink className="size-3 mr-1.5" />
                  {booking.documentAction}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions matching Figma */}
        <div className="p-4 bg-white border-t border-[#E6EAF0] shrink-0 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-bold text-[#4F5B70] hover:bg-[#F4F6FA] border-[#DCE2EB] cursor-pointer"
          >
            Close Preview
          </Button>

          <div className="flex items-center gap-2">
            {hasDocument && (
              <Button
                size="sm"
                onClick={() => onViewDocument?.(booking)}
                className="bg-[#0267B8] hover:bg-[#025699] text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs cursor-pointer"
              >
                <FileCheck2 className="size-3.5 mr-1.5" />
                {booking.documentAction}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

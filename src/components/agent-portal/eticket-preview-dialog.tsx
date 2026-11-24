import * as React from 'react'
import {
  X,
  Plane,
  Building,
  Package,
  Compass,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Barcode,
  Calendar,
  Clock,
  Luggage,
  User,
  Ticket,
} from 'lucide-react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { AgentBookingItem } from './agent-bookings-data'

interface ETicketPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: AgentBookingItem | null
}

export function ETicketPreviewDialog({
  open,
  onOpenChange,
  booking,
}: ETicketPreviewDialogProps) {
  if (!booking) return null

  const isFlight = booking.service === 'Flight'
  const isHotel = booking.service === 'Hotel'
  const isPackage = booking.service === 'Travel Package'

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Generate simple text download / trigger print dialog as PDF
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-2xl w-full p-0 overflow-hidden bg-white rounded-3xl shadow-2xl border border-[#DCE2EB]">
        {/* Modal Top Bar */}
        <div className="bg-[#012A5E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#F1C134] text-[#012A5E] flex items-center justify-center font-extrabold shadow-xs">
              <Plane className="size-4 rotate-[-45deg]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-tight leading-none">
                AeroWing Travel Partner Portal
              </h3>
              <p className="text-[11px] text-[#C9D7EA] font-medium mt-0.5">
                Official E-ticket & Service Voucher · M2.11
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="size-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              aria-label="Close Dialog"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Printable Ticket Card */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] space-y-6">
          {/* Main Boarding Pass / Voucher Card */}
          <div className="border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-xs bg-white">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-[#001A3D] via-[#012A5E] to-[#0267B8] p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F1C134] block mb-1">
                  {isFlight
                    ? 'Electronic Flight Ticket'
                    : isHotel
                      ? 'Hotel Reservation Voucher'
                      : `${booking.service} Confirmation Voucher`}
                </span>
                <h4 className="text-xl font-black tracking-tight text-white">
                  {booking.routeOrItem}
                </h4>
                <p className="text-xs text-[#C9D7EA] mt-0.5">
                  Operated by{' '}
                  {booking.supplier || 'AeroWing Travel Partner Network'}
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-[#8EAECF] block">
                  Booking Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F7F0] text-[#0A7B45] border border-[#A6E5C5] mt-1 shadow-2xs">
                  <CheckCircle2 className="size-3.5" /> CONFIRMED / ISSUED
                </span>
              </div>
            </div>

            {/* Ticket Key Data Grid */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs">
              <div>
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  Passenger / Guest
                </span>
                <span className="font-extrabold text-[#012A5E] text-sm block mt-0.5">
                  {booking.customer}
                </span>
                <span className="text-[10px] text-[#0267B8] font-bold">
                  Adult (ADT)
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  Booking Reference
                </span>
                <span className="font-extrabold text-[#012A5E] text-sm block mt-0.5 font-mono">
                  {booking.ref}
                </span>
                <span className="text-[10px] text-[#64748B]">Agency PNR</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  Airline / Supplier PNR
                </span>
                <span className="font-extrabold text-[#0267B8] text-sm block mt-0.5 font-mono">
                  {booking.pnr || 'AW-PNR-782'}
                </span>
                <span className="text-[10px] text-[#64748B]">
                  GDS / Amadeus
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  Travel / Check-in Date
                </span>
                <span className="font-extrabold text-[#012A5E] text-sm block mt-0.5">
                  {booking.travelDate}
                </span>
                <span className="text-[10px] text-[#64748B]">
                  Confirmed Schedule
                </span>
              </div>
            </div>

            {/* Flight / Itinerary Detail Section */}
            {isFlight ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-[#F1F5F9] pb-3">
                  <span className="font-bold text-[#012A5E]">
                    Flight Sector 1 · Non-stop
                  </span>
                  <span className="font-mono text-[#0267B8] font-bold">
                    Class: Economy (T) · Baggage: 30 KG Included
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="text-left">
                    <span className="text-2xl font-black text-[#012A5E] font-mono">
                      DAC
                    </span>
                    <p className="text-xs font-bold text-[#4F5B70]">
                      Dhaka, BD
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      Hazrat Shahjalal Intl (T2)
                    </p>
                    <p className="text-xs font-bold text-[#012A5E] mt-1">
                      {booking.travelDate} · 07:30
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-4">
                    <span className="text-[10px] text-[#64748B] font-semibold mb-1">
                      5h 45m · Boeing 777-300ER
                    </span>
                    <div className="w-full flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-[#0267B8]" />
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-[#0267B8] to-[#F1C134]" />
                      <Plane className="size-4 text-[#0267B8] rotate-90 shrink-0" />
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-[#F1C134] to-[#0267B8]" />
                      <div className="size-2 rounded-full bg-[#0267B8]" />
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold mt-1">
                      Emirates EK-585
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-[#012A5E] font-mono">
                      DXB
                    </span>
                    <p className="text-xs font-bold text-[#4F5B70]">
                      Dubai, UAE
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      Dubai International (T3)
                    </p>
                    <p className="text-xs font-bold text-[#012A5E] mt-1">
                      {booking.travelDate} · 11:15
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F1F5F9] text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] block">
                      Seat
                    </span>
                    <span className="font-extrabold text-[#012A5E]">
                      24A (Window)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] block">
                      E-Ticket Number
                    </span>
                    <span className="font-mono font-bold text-[#012A5E]">
                      176-9048102941
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] block">
                      Boarding Gate
                    </span>
                    <span className="font-bold text-[#012A5E]">
                      Closes 20m before dep
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#012A5E]">
                      Service Description
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Confirmed Voucher
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#012A5E]">
                    {booking.routeOrItem}
                  </p>
                  <p className="text-[#64748B]">
                    Supplier Ref: {booking.pnr || 'CONF-89104'} · Guest:{' '}
                    {booking.customer}
                  </p>
                </div>
              </div>
            )}

            {/* Barcode & Agency Footer */}
            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-left">
                <p className="font-bold text-[#012A5E]">
                  Issued by: {booking.createdBy} ({booking.createdByType})
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Under Skyline Demo Travels Ltd Partner Account · AeroWing B2B
                </p>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center">
                <div className="font-mono text-xs tracking-widest text-[#012A5E] font-bold">
                  ||||||||||||||||||||||||||||||||||||||||||||
                </div>
                <span className="text-[10px] font-mono text-[#64748B]">
                  AW-{booking.ref}-VALID
                </span>
              </div>
            </div>
          </div>

          {/* Agency Notice */}
          <div className="p-3.5 rounded-xl bg-[#EBF3FC] border border-[#C6DDF7] text-xs text-[#012A5E] flex items-start gap-2.5">
            <ShieldCheck className="size-4 text-[#0267B8] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This document is an authorized B2B travel document issued under{' '}
              <strong>Skyline Demo Travels Ltd</strong> partner agreement.
              Please present this e-ticket / voucher along with a valid passport
              or government ID upon check-in.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-bold text-[#4F5B70] border-[#DCE2EB] cursor-pointer"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-[#DCE2EB] text-[#012A5E] font-bold text-xs h-9 px-3.5 cursor-pointer"
            >
              <Printer className="size-3.5 mr-1.5" />
              Print
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-[#0267B8] hover:bg-[#025699] text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              <Download className="size-3.5 mr-1.5" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

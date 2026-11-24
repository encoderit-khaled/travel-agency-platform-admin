import * as React from 'react'
import { FileText, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'

export interface ETicketPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingRef?: string
  customerName?: string
  serviceType?: string
  travelDate?: string
  bookingStatus?: string
  onDownloadPdf?: () => void
}

export function ETicketPreviewDialog({
  open,
  onOpenChange,
  bookingRef = 'AW-DEMO-FL-001',
  customerName = 'Amina Rahman',
  serviceType = 'Flight',
  travelDate = '18 Dec 2026',
  bookingStatus = 'Ticketed',
  onDownloadPdf,
}: ETicketPreviewDialogProps) {
  const handleDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf()
    } else {
      window.print()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] p-7 md:p-8 rounded-3xl bg-white border border-[#E6EAF0] shadow-2xl">
        {/* Top Header */}
        <DialogHeader className="gap-2">
          <div className="size-11 rounded-xl bg-[#EAF4FD] flex items-center justify-center text-[#0267B8] mb-1">
            <FileText className="size-6" />
          </div>
          <DialogTitle className="text-xl md:text-2xl font-extrabold text-[#012A5E] tracking-tight">
            Demo E-ticket Preview
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-[#4F5B70] leading-relaxed">
            A design-preview placeholder. It isn't a real e-ticket or travel
            document.
          </DialogDescription>
        </DialogHeader>

        {/* E-Ticket Preview Container */}
        <div className="mt-4 relative rounded-2xl border border-[#DCE2EB] bg-linear-to-br from-[#FAFBFD] via-[#FFFFFF] to-[#F5F8FC] p-6 sm:p-7 overflow-hidden shadow-xs">
          {/* Subtle Diagonal Watermark Pattern */}
          <div
            className="absolute inset-0 select-none pointer-events-none flex flex-col justify-around items-center opacity-[0.045] rotate-[-22deg] scale-125 z-0"
            aria-hidden="true"
          >
            <div className="text-2xl md:text-3xl font-black uppercase tracking-widest text-[#012A5E] whitespace-nowrap">
              DESIGN PREVIEW A TRAVEL DOCUMENT
            </div>
            <div className="text-2xl md:text-3xl font-black uppercase tracking-widest text-[#012A5E] whitespace-nowrap">
              DESIGN PREVIEW A TRAVEL DOCUMENT
            </div>
            <div className="text-2xl md:text-3xl font-black uppercase tracking-widest text-[#012A5E] whitespace-nowrap">
              DESIGN PREVIEW A TRAVEL DOCUMENT
            </div>
          </div>

          {/* Ticket Content */}
          <div className="relative z-10 space-y-6">
            {/* Top Row: Logo & Document Label */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E6EAF0]/80">
              <div className="flex items-center gap-2">
                <img
                  src="/images/aerowing-logo.png"
                  alt="AeroWing"
                  className="h-7 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.currentTarget
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling
                    if (fallback) fallback.classList.remove('hidden')
                  }}
                />
                <span className="hidden font-extrabold text-[#012A5E] text-lg tracking-tight">
                  Aero<span className="text-[#0267B8]">Wing</span>
                </span>
              </div>
              <span className="text-sm font-extrabold text-[#012A5E] tracking-tight">
                E-ticket · Demo
              </span>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-left">
              <div>
                <span className="text-xs font-bold text-[#4F5B70] block mb-1">
                  Booking Reference
                </span>
                <span className="text-sm font-extrabold font-mono text-[#141B28]">
                  {bookingRef}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#4F5B70] block mb-1">
                  Customer
                </span>
                <span className="text-sm font-extrabold text-[#141B28]">
                  {customerName}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#4F5B70] block mb-1">
                  Service
                </span>
                <span className="text-sm font-extrabold text-[#141B28]">
                  {serviceType}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#4F5B70] block mb-1">
                  Travel / Service Date
                </span>
                <span className="text-sm font-extrabold text-[#141B28]">
                  {travelDate}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-xs font-bold text-[#4F5B70] block mb-1">
                  Booking Status
                </span>
                <span className="text-sm font-extrabold text-[#141B28]">
                  {bookingStatus}
                </span>
              </div>
            </div>

            {/* Bottom Caution Banner */}
            <div className="pt-3 border-t border-[#E6EAF0]/80">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A4B00]">
                DESIGN PREVIEW — NOT A TRAVEL DOCUMENT
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            className="border-[#C9D2DF] hover:bg-[#F4F6FA] text-[#012A5E] font-bold text-sm h-11 px-5 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="size-4 mr-2" />
            Download PDF
          </Button>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-[#F1C134] hover:bg-[#e0b129] text-[#012A5E] font-extrabold text-sm h-11 px-6 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

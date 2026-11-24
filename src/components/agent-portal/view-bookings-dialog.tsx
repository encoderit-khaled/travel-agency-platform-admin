import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { CalendarDays, Plane, Ticket, CheckCircle2 } from 'lucide-react'
import type { SubAgent, SubAgentBooking } from './types'

interface ViewBookingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subAgent: SubAgent | null
  allSubAgents?: SubAgent[]
}

export function ViewBookingsDialog({
  open,
  onOpenChange,
  subAgent,
  allSubAgents = [],
}: ViewBookingsDialogProps) {
  // If subAgent is null, show all bookings from allSubAgents
  const bookings: (SubAgentBooking & { subAgentName: string })[] = subAgent
    ? subAgent.bookings.map((b) => ({ ...b, subAgentName: subAgent.name }))
    : allSubAgents.flatMap((sa) =>
        sa.bookings.map((b) => ({ ...b, subAgentName: sa.name })),
      )

  const title = subAgent
    ? `Bookings for ${subAgent.name}`
    : 'All Sub-agent Bookings'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-1">
              <CalendarDays className="size-5" />
            </div>
            <Badge
              variant="outline"
              className="bg-[#EAFBF1] text-[#0B6A45] border-emerald-200 text-xs font-bold"
            >
              {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#4F5B70]">
            Air tickets and hotel bookings issued through agency credit lines by
            sub-agent desks.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {bookings.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-[#DCE2EB] bg-[#F8FAFC] text-center">
              <Ticket className="size-8 text-[#8C9BAE] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-bold text-[#4F5B70]">
                No bookings recorded yet for this desk.
              </p>
              <p className="text-[11px] text-[#8C9BAE] mt-1">
                Any flight or hotel reservation made by this sub-agent will show
                up here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-4 rounded-xl border border-[#DCE2EB] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#0267B8]/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-lg bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center shrink-0 mt-0.5">
                      <Plane className="size-4.5 rotate-[-45deg]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#012A5E]">
                          {bk.route}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#4F5B70] bg-[#F1F3F6] px-1.5 py-0.5 rounded">
                          PNR: {bk.pnr}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#4F5B70] mt-1 flex items-center gap-2">
                        <span>Pax: {bk.passenger}</span>
                        <span>•</span>
                        <span className="text-[#8C9BAE]">
                          {bk.subAgentName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F1F3F6]">
                    <span className="text-sm font-extrabold text-[#141C2E]">
                      {bk.amount}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold mt-0.5"
                    >
                      <CheckCircle2 className="size-2.5 mr-1" />
                      {bk.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-[#F1F3F6]">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-[#012A5E] hover:bg-[#0F3F7D] text-white font-extrabold"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

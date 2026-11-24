import * as React from 'react'
import { CircleX as XCircle } from 'lucide-react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import type { AgentApplication } from './application-review-modal'

export interface RejectApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: (note?: string) => void
  onConfirmReject?: (id: string, note?: string) => void
  application: AgentApplication | null
}

export function RejectApplicationModal({
  isOpen,
  onClose,
  onConfirm,
  onConfirmReject,
  application,
}: RejectApplicationModalProps) {
  const [note, setNote] = React.useState('')

  // Reset note when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setNote('')
    }
  }, [isOpen])

  if (!application) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(note)
    }
    if (onConfirmReject) {
      onConfirmReject(application.id, note)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPopup className="max-w-[540px] p-7 rounded-2xl bg-white border border-[#DCE2EB] shadow-2xl gap-0">
        <DialogHeader className="gap-0 text-left">
          {/* Circular Red Icon Badge matching Figma #648:1249 */}
          <div className="size-11 rounded-full bg-[#FCE8E6] flex items-center justify-center text-[#C62828] mb-4">
            <XCircle className="size-6 stroke-[2.2]" />
          </div>

          <DialogTitle className="text-xl sm:text-[22px] font-extrabold text-[#012A5E] tracking-tight leading-tight">
            Reject this Agent application?
          </DialogTitle>

          <DialogDescription className="text-sm text-[#4F5B70] leading-relaxed mt-2 text-left">
            The application will be marked as rejected. The submitted
            information is kept and the applicant is notified of the decision by
            email.
          </DialogDescription>
        </DialogHeader>

        {/* Business & Primary Contact Summary Box */}
        <div className="mt-5 rounded-xl bg-[#F8FAFC] border border-[#E6EAF0] p-4 flex flex-col gap-2.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#4F5B70] font-medium text-xs sm:text-sm">
              Business
            </span>
            <span className="font-bold text-[#141C2E] text-right truncate">
              {application.businessName}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-[#EDF2F7] pt-2.5">
            <span className="text-[#4F5B70] font-medium text-xs sm:text-sm">
              Primary contact
            </span>
            <span className="font-bold text-[#141C2E] text-right truncate">
              {application.primaryContact}
            </span>
          </div>
        </div>

        {/* Optional Internal Note */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="internal-reject-note"
              className="text-xs font-bold text-[#012A5E]"
            >
              Internal decision note
            </label>
            <span className="text-[10px] font-semibold text-[#718096] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <Textarea
            id="internal-reject-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the admin team (optional)"
            className="text-xs sm:text-sm rounded-xl border-[#DCE2EB] bg-white resize-none"
          />
          <span className="text-[11px] text-[#718096]">
            Visible to admins in this application's history.
          </span>
        </div>

        {/* Action Buttons Footer */}
        <DialogFooter className="mt-6 border-0 pt-0 flex-row justify-end gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-5 rounded-xl border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F4F6FA] hover:text-[#012A5E] font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="h-10 px-5 rounded-xl bg-[#C62828] hover:bg-[#A91B1B] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

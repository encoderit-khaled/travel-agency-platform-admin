import { CheckCircle2, Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import type { AgentApplication } from './application-review-modal'

export interface ApproveApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  onConfirmApprove?: (id: string, note?: string) => void
  application: AgentApplication | null
}

export function ApproveApplicationModal({
  isOpen,
  onClose,
  onConfirm,
  onConfirmApprove,
  application,
}: ApproveApplicationModalProps) {
  if (!application) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    if (onConfirmApprove) {
      onConfirmApprove(application.id)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-135 p-7 rounded-2xl bg-white border border-[#DCE2EB] shadow-2xl gap-0">
        <DialogHeader className="gap-0 text-left">
          {/* Circular Green Icon Badge matching Figma #648:1247 */}
          <div className="size-11 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-4">
            <CheckCircle2 className="size-6 stroke-[2.2]" />
          </div>

          <DialogTitle className="text-xl sm:text-[22px] font-extrabold text-[#012A5E] tracking-tight leading-tight">
            Approve this Agent application?
          </DialogTitle>

          <DialogDescription className="text-sm text-[#4F5B70] leading-relaxed mt-2 text-left">
            Approving this application will mark the Agent application as
            approved and begin the Agent onboarding process.
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

        {/* Notice Info Box */}
        <div className="mt-4 rounded-xl bg-[#F0F6FE] border border-[#D0E2FB] p-3.5 flex items-start gap-2.5 text-xs text-[#0267B8] leading-relaxed">
          <Mail className="size-4 shrink-0 mt-0.5" />
          <span>
            The applicant is notified of the decision by email. In this
            prototype the notification stays pending — nothing is sent.
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
            className="h-10 px-5 rounded-xl bg-[#0B6B43] hover:bg-[#085233] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import * as React from 'react'
import { CircleX as XCircle, Building2, User } from 'lucide-react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/components/ui/select'
import type { AgentApplication } from './application-review-modal'

export interface RejectionData {
  reason: string
  rejectionNotes: string
}

interface RejectApplicationDialogProps {
  application: AgentApplication | null
  isOpen: boolean
  onClose: () => void
  onConfirmReject: (id: string, data: RejectionData) => void
}

export function RejectApplicationDialog({
  application,
  isOpen,
  onClose,
  onConfirmReject,
}: RejectApplicationDialogProps) {
  if (!application) return null

  const [reason, setReason] = React.useState('incomplete_docs')
  const [rejectionNotes, setRejectionNotes] = React.useState(
    'Required business verification documents could not be verified or are missing. Please re-apply with updated trade license credentials.',
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onConfirmReject(application.id, {
        reason,
        rejectionNotes,
      })
      setIsSubmitting(false)
      onClose()
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPopup className="max-w-xl p-6 sm:p-7">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#FEE2E2] text-[#DC2626] shadow-2xs">
              <XCircle className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#012A5E] tracking-tight">
                Reject Application
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-[#4F5B70] mt-0.5">
                Record a formal rejection decision for this partner applicant.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Target Partner Overview Pill */}
        <div className="rounded-xl border border-[#FCA5A5]/60 bg-[#FEF2F2]/50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-white border border-[#FCA5A5] flex items-center justify-center text-[#DC2626] shrink-0 shadow-2xs">
              <Building2 className="size-4" />
            </div>
            <div>
              <span className="font-extrabold text-[#141C2E] block text-sm">
                {application.businessName}
              </span>
              <span className="text-[#64748B] flex items-center gap-1.5 mt-0.5">
                <User className="size-3 text-[#94A3B8]" />
                {application.primaryContact} · {application.country}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#DC2626] bg-white px-2.5 py-1 rounded-md border border-[#FCA5A5] self-start sm:self-center">
            {application.businessType}
          </span>
        </div>

        {/* Configuration Form */}
        <div className="flex flex-col gap-4 py-1 text-sm">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="reject-reason"
              className="text-xs font-bold uppercase tracking-wider text-[#012A5E]"
            >
              Primary Rejection Reason
            </Label>
            <Select
              value={reason}
              onValueChange={(val) => val && setReason(val)}
            >
              <SelectTrigger
                id="reject-reason"
                className="h-10 w-full bg-white border-[#DCE2EB] text-sm font-medium"
              >
                <SelectValue placeholder="Select rejection reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incomplete_docs">
                  Incomplete or unreadable documentation
                </SelectItem>
                <SelectItem value="expired_license">
                  Trade license / Tax certificate expired
                </SelectItem>
                <SelectItem value="unreachable_contact">
                  Unable to verify primary business contact
                </SelectItem>
                <SelectItem value="duplicate">
                  Duplicate application on record
                </SelectItem>
                <SelectItem value="policy_ineligible">
                  Ineligible under current agency risk policies
                </SelectItem>
                <SelectItem value="other">Other reason</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="reject-notes"
              className="text-xs font-bold uppercase tracking-wider text-[#012A5E]"
            >
              Applicant Notification Message
            </Label>
            <Textarea
              id="reject-notes"
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              rows={3}
              className="text-xs bg-white border-[#DCE2EB] text-[#141C2E] resize-none leading-relaxed"
              placeholder="Explain the rejection decision..."
            />
            <p className="text-[11px] text-[#64748B]">
              This message will be dispatched via email to {application.email}.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="gap-2 sm:gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F4F6FA] font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-[#C62828] text-white hover:bg-[#B71C1C] font-extrabold px-5 h-10 shadow-sm gap-1.5 cursor-pointer"
          >
            <XCircle className="size-4" />
            <span>{isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

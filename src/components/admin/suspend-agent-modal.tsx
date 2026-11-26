import * as React from 'react'
import { PauseCircle, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import { useActionLoading } from '#/hooks/use-action-loading'
import type { AgentApplication } from './application-review-modal'

export interface SuspendAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: (note?: string) => void
  onConfirmSuspend?: (id: string, note?: string) => void
  application: AgentApplication | null
}

export function SuspendAgentModal({
  isOpen,
  onClose,
  onConfirm,
  onConfirmSuspend,
  application,
}: SuspendAgentModalProps) {
  const [note, setNote] = React.useState('')
  const { isLoading, run } = useActionLoading(isOpen)

  React.useEffect(() => {
    if (isOpen) {
      setNote('')
    }
  }, [isOpen])

  if (!application) return null

  const handleConfirm = () => {
    run(() => {
      onConfirm?.(note)
      onConfirmSuspend?.(application.id, note)
      onClose()
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isLoading) return
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-135 p-7 rounded-2xl bg-white border border-[#DCE2EB] shadow-2xl gap-0">
        <DialogHeader className="gap-0 text-left">
          {/* Circular Amber Icon Badge matching Figma #648:1251 */}
          <div className="size-11 rounded-full bg-[#FFF8E1] flex items-center justify-center text-[#B45309] mb-4">
            <PauseCircle className="size-6 stroke-[2.2]" />
          </div>

          <DialogTitle className="text-xl sm:text-[22px] font-extrabold text-[#012A5E] tracking-tight leading-tight">
            Suspend this Agent?
          </DialogTitle>

          <DialogDescription className="text-sm text-[#4F5B70] leading-relaxed mt-2 text-left">
            This will change the Agent's access status according to the
            configured account rules.
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

        {/* Informational Blue Notice */}
        <div className="mt-4 rounded-xl bg-[#F0F6FE] border border-[#D0E2FB] p-3.5 flex items-start gap-2.5 text-xs text-[#0267B8] leading-relaxed">
          <Info className="size-4 shrink-0 mt-0.5" />
          <span>
            The original application approval stays in the history. The exact
            effects of suspension are defined by the configured account rules.
          </span>
        </div>

        {/* Optional Internal Note */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="internal-suspend-note"
              className="text-xs font-bold text-[#012A5E]"
            >
              Internal note
            </label>
            <span className="text-[10px] font-semibold text-[#718096] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <Textarea
            id="internal-suspend-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the admin team (optional)"
            className="text-xs sm:text-sm rounded-xl border-[#DCE2EB] bg-white resize-none"
          />
        </div>

        {/* Action Buttons Footer */}
        <DialogFooter className="mt-6 border-0 pt-0 flex-row justify-end gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-5 rounded-xl border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F4F6FA] hover:text-[#012A5E] font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            loading={isLoading}
            loadingText="Processing..."
            className="h-10 px-5 rounded-xl bg-[#C62828] hover:bg-[#A91B1B] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            Confirm Suspension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

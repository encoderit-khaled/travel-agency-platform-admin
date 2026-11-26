import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { AlertOctagon, CheckCircle2 } from 'lucide-react'
import type { SubAgent } from './types'

interface DeactivateSubAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subAgent: SubAgent | null
  onConfirm: (subAgentId: string) => void
}

export function DeactivateSubAgentDialog({
  open,
  onOpenChange,
  subAgent,
  onConfirm,
}: DeactivateSubAgentDialogProps) {
  const { isLoading, run } = useActionLoading(open)

  if (!subAgent) return null

  const isSuspending = subAgent.status === 'active'

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isLoading) return
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-115 p-6">
        <DialogHeader>
          <div
            className={`size-11 rounded-xl flex items-center justify-center mb-1 ${
              isSuspending
                ? 'bg-red-50 text-red-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isSuspending ? (
              <AlertOctagon className="size-5" />
            ) : (
              <CheckCircle2 className="size-5" />
            )}
          </div>
          <DialogTitle className="text-lg font-extrabold text-[#012A5E]">
            {isSuspending
              ? `Suspend ${subAgent.name}?`
              : `Reactivate ${subAgent.name}?`}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#4F5B70] leading-relaxed pt-1">
            {isSuspending
              ? `Suspending this sub-agent will immediately revoke login access and prevent new ticket issuance against your agency credit line. Existing bookings remain valid.`
              : `Reactivating will restore portal access and allow desk staff to search and issue bookings under assigned permissions.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 border-t border-[#F1F3F6] gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-[#DCE2EB] text-[#4F5B70]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              run(() => {
                onConfirm(subAgent.id)
                onOpenChange(false)
              })
            }}
            loading={isLoading}
            loadingText="Processing..."
            className={
              isSuspending
                ? 'bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-sm'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm'
            }
          >
            {isSuspending ? 'Yes, Suspend Desk' : 'Yes, Reactivate Desk'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

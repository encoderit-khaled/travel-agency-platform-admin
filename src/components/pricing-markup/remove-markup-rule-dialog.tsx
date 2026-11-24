import * as React from 'react'
import { AlertTriangle, Tag, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import type { AgentMarkupRule } from './types'

interface RemoveMarkupRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: AgentMarkupRule | null
  onConfirmRemove: (ruleId: string) => void
}

export function RemoveMarkupRuleDialog({
  open,
  onOpenChange,
  rule,
  onConfirmRemove,
}: RemoveMarkupRuleDialogProps) {
  if (!rule) return null

  const handleConfirm = () => {
    onConfirmRemove(rule.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Red Warning Triangle matching Figma #710:22500 */}
          <div className="size-12 rounded-full bg-[#FEF3F2] text-[#D92D20] flex items-center justify-center mb-4">
            <AlertTriangle className="size-6 text-[#D92D20]" />
          </div>

          <DialogHeader className="space-y-1.5 text-center">
            <DialogTitle className="text-xl font-bold text-[#001A3D]">
              Remove markup rule?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              This removes the rule from your Agent markup configuration.
            </DialogDescription>
          </DialogHeader>

          {/* Rule Item Summary Box */}
          <div className="w-full mt-5 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-3 text-left">
            <div className="size-8 rounded-lg bg-white border border-[#E2E8F0] text-[#0267B8] flex items-center justify-center shrink-0">
              <Tag className="size-4 text-[#0267B8]" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-[#001A3D]">{rule.name}</p>
              <p className="text-xs text-[#64748B]">
                {rule.service} · {rule.type} · {rule.value}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row items-center justify-center gap-3 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-[#CBD5E1] text-xs font-semibold text-[#1D2939] h-10 rounded-xl hover:bg-[#F8FAFC]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-[#D92D20] hover:bg-[#B42318] text-xs font-bold text-white h-10 rounded-xl shadow-xs"
          >
            <X className="size-3.5 mr-1" />
            Remove Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

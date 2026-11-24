import * as React from 'react'
import { MinusCircle, Tag } from 'lucide-react'
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

interface DisableMarkupRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: AgentMarkupRule | null
  onConfirmDisable: (ruleId: string) => void
}

export function DisableMarkupRuleDialog({
  open,
  onOpenChange,
  rule,
  onConfirmDisable,
}: DisableMarkupRuleDialogProps) {
  if (!rule) return null

  const handleConfirm = () => {
    onConfirmDisable(rule.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Blue Minus Icon matching Figma #710:22499 */}
          <div className="size-12 rounded-full bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center mb-4">
            <MinusCircle className="size-6 text-[#0267B8]" />
          </div>

          <DialogHeader className="space-y-1.5 text-center">
            <DialogTitle className="text-xl font-bold text-[#001A3D]">
              Disable markup rule?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              This rule will stop being applied to future quotes while inactive.
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
            Keep Active
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-[#F1C134] hover:bg-[#E5B52C] text-xs font-bold text-[#001A3D] h-10 rounded-xl shadow-xs"
          >
            Disable Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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

interface DeleteMarkupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: AgentMarkupRule | null
  onConfirmDelete: (ruleId: string) => void
}

export function DeleteMarkupDialog({
  open,
  onOpenChange,
  rule,
  onConfirmDelete,
}: DeleteMarkupDialogProps) {
  if (!rule) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] bg-white border-[#E2E8F0] shadow-2xl p-6 rounded-2xl focus:outline-none">
        <div className="flex flex-col items-start gap-4">
          {/* Warning Icon Badge */}
          <div className="size-11 rounded-full bg-[#FEE4E2] flex items-center justify-center text-[#D92D20] shrink-0">
            <AlertTriangle className="size-5" />
          </div>

          {/* Dialog Text */}
          <div className="space-y-1.5 text-left w-full">
            <DialogTitle className="text-lg font-extrabold text-[#001A3D]">
              Remove markup rule?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B] leading-relaxed">
              This removes the rule from your Agent markup configuration.
            </DialogDescription>
          </div>

          {/* Rule Preview Card matching Figma #710:22500 */}
          <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-blue-50 text-[#0267B8] flex items-center justify-center shrink-0">
              <Tag className="size-4" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-bold text-[#001A3D] text-xs sm:text-sm truncate">
                {rule.name}
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                {rule.service} · {rule.type} · {rule.value}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="mt-5 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[#CBD5E1] text-[#001A3D] hover:bg-[#F8FAFC] font-bold text-xs px-4 h-9.5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirmDelete(rule.id)
              onOpenChange(false)
            }}
            className="rounded-xl bg-[#D92D20] hover:bg-[#B42318] text-white font-bold text-xs px-4 h-9.5 flex items-center gap-1.5 shadow-xs"
          >
            <X className="size-3.5" />
            Remove Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

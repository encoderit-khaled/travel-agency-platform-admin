import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import {
  CheckCircle2,
  Mail,
  Building2,
  User,
  Phone,
  Shield,
} from 'lucide-react'
import type { CreateSubAgentFormData } from './types'

interface SubAgentCreatedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: CreateSubAgentFormData
  onReset?: () => void
}

export function SubAgentCreatedDialog({
  open,
  onOpenChange,
  formData,
  onReset,
}: SubAgentCreatedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-7 bg-white border-[#E6EAF0] shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center gap-2 pt-2">
          <div className="size-16 rounded-full bg-[#E6F4EC] text-[#0E7A3E] flex items-center justify-center shadow-inner mb-1">
            <CheckCircle2 className="size-9 stroke-[2.5]" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
            Sub-agent Created!
          </DialogTitle>
          <DialogDescription className="text-xs text-[#4F5B70] max-w-sm">
            Sub-agent account for{' '}
            <strong className="text-[#141B28]">
              {formData.displayName || 'Sub-agent'}
            </strong>{' '}
            has been successfully created under your agent account.
          </DialogDescription>
        </DialogHeader>

        {/* Account Details Card */}
        <div className="my-2 p-4 rounded-2xl bg-[#F4F6FA] border border-[#E6EAF0] flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
            <span className="text-[#4F5B70] flex items-center gap-1.5 font-medium">
              <Building2 className="size-3.5 text-[#0267B8]" />
              Display Name
            </span>
            <span className="font-bold text-[#141B28]">
              {formData.displayName}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
            <span className="text-[#4F5B70] flex items-center gap-1.5 font-medium">
              <Mail className="size-3.5 text-[#0267B8]" />
              Login Email
            </span>
            <span className="font-semibold text-[#141B28]">
              {formData.loginEmail}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
            <span className="text-[#4F5B70] flex items-center gap-1.5 font-medium">
              <User className="size-3.5 text-[#0267B8]" />
              Contact Person
            </span>
            <span className="font-medium text-[#141B28]">
              {formData.contactPerson || '—'}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
            <span className="text-[#4F5B70] flex items-center gap-1.5 font-medium">
              <Phone className="size-3.5 text-[#0267B8]" />
              Mobile
            </span>
            <span className="font-medium text-[#141B28]">
              {formData.mobileNumber || '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#4F5B70] flex items-center gap-1.5 font-medium">
              <Shield className="size-3.5 text-[#0267B8]" />
              Permissions
            </span>
            <span className="font-bold text-[#0E7A3E] bg-[#E6F4EC] px-2 py-0.5 rounded-full text-[11px]">
              {formData.permissionPreset === 'standard'
                ? 'Standard Access'
                : formData.permissionPreset === 'limited'
                  ? 'Limited Access'
                  : 'Custom Access'}
            </span>
          </div>
        </div>

        {/* Info callout */}
        <div className="p-3 rounded-xl bg-[#FFF6DC] border border-[#F1C134]/30 flex items-start gap-2.5 text-[11.5px] text-[#7A4A06]">
          <Mail className="size-4 shrink-0 text-[#7A4A06] mt-0.5" />
          <span>
            An invitation email with a secure setup link has been queued for{' '}
            <strong>{formData.loginEmail}</strong>. The user must set their
            password before logging in.
          </span>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onReset?.()
              onOpenChange(false)
            }}
            className="w-full sm:w-auto rounded-xl border-[#B7C0CF] text-[#4F5B70]"
          >
            Create Another
          </Button>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-xl bg-[#012A5E] text-white hover:bg-[#023E8A] font-bold"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import * as React from 'react'
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  CreditCard,
  Mail,
  Users2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Checkbox } from '#/components/ui/checkbox'
import { Textarea } from '#/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/components/ui/select'
import type { AgentApplication } from './application-review-modal'

export interface ApprovalData {
  agentReference: string
  creditLimit: string
  commissionTier: string
  allowSubAgents: boolean
  sendNotificationEmail: boolean
  decisionNotes?: string
}

interface ApproveApplicationDialogProps {
  application: AgentApplication | null
  isOpen: boolean
  onClose: () => void
  onConfirmApprove: (id: string, data: ApprovalData) => void
}

export function ApproveApplicationDialog({
  application,
  isOpen,
  onClose,
  onConfirmApprove,
}: ApproveApplicationDialogProps) {
  if (!application) return null

  // Generated default reference code if not set
  const defaultRef =
    application.reference && application.reference !== 'No reference assigned'
      ? application.reference
      : `AGT-BD-2026-904`

  const [agentReference, setAgentReference] = React.useState(defaultRef)
  const [creditLimit, setCreditLimit] = React.useState('BDT 500,000')
  const [commissionTier, setCommissionTier] = React.useState('standard')
  const [allowSubAgents, setAllowSubAgents] = React.useState(true)
  const [sendNotificationEmail, setSendNotificationEmail] = React.useState(true)
  const [decisionNotes, setDecisionNotes] = React.useState(
    'Application verified and compliant with B2B partner registration requirements. Account approved for flight and hotel booking access.',
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Sync ref when app changes
  React.useEffect(() => {
    setAgentReference(
      application.reference && application.reference !== 'No reference assigned'
        ? application.reference
        : `AGT-BD-2026-904`,
    )
  }, [application])

  const handleConfirm = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onConfirmApprove(application.id, {
        agentReference: agentReference.trim() || defaultRef,
        creditLimit,
        commissionTier,
        allowSubAgents,
        sendNotificationEmail,
        decisionNotes,
      })
      setIsSubmitting(false)
      onClose()
    }, 700)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isSubmitting) return
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-xl p-6 sm:p-7">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32] shadow-2xs">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#012A5E] tracking-tight">
                Approve Application
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-[#4F5B70] mt-0.5">
                Confirm partner approval and configure B2B agent portal
                parameters.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Target Partner Overview Pill */}
        <div className="rounded-xl border border-[#DCE2EB] bg-[#F8FAFC] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#012A5E] shrink-0 shadow-2xs">
              <Building2 className="size-4 text-[#0267B8]" />
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
          <span className="font-mono text-[11px] font-bold text-[#012A5E] bg-[#EBF3FC] px-2.5 py-1 rounded-md border border-[#C5DCFA] self-start sm:self-center">
            {application.businessType}
          </span>
        </div>

        {/* Configuration Form */}
        <div className="flex flex-col gap-4 py-1 text-sm">
          {/* Agent ID / Reference */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="agent-ref"
              className="text-xs font-bold uppercase tracking-wider text-[#012A5E]"
            >
              Assigned Agent ID / Reference
            </Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
              <Input
                id="agent-ref"
                value={agentReference}
                onChange={(e) => setAgentReference(e.target.value)}
                placeholder="e.g. AGT-BD-2026-904"
                className="pl-9 h-10 font-mono font-bold text-sm bg-white border-[#DCE2EB] text-[#012A5E] focus-visible:border-[#0267B8]"
              />
            </div>
            <p className="text-[11px] text-[#64748B]">
              Unique identifier used in bookings, billing statements, and
              reports.
            </p>
          </div>

          {/* Credit Limit & Commission Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="credit-limit"
                className="text-xs font-bold uppercase tracking-wider text-[#012A5E]"
              >
                Initial Credit Limit
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <Input
                  id="credit-limit"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="e.g. BDT 500,000"
                  className="pl-9 h-10 text-sm font-semibold bg-white border-[#DCE2EB] text-[#141C2E]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="commission-tier"
                className="text-xs font-bold uppercase tracking-wider text-[#012A5E]"
              >
                Commission Plan
              </Label>
              <Select
                value={commissionTier}
                onValueChange={(val) => val && setCommissionTier(val)}
              >
                <SelectTrigger
                  id="commission-tier"
                  className="h-10 w-full bg-white border-[#DCE2EB] text-sm font-medium"
                >
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">
                    Standard Partner (7.0%)
                  </SelectItem>
                  <SelectItem value="silver">Silver Tier (8.5%)</SelectItem>
                  <SelectItem value="gold">Gold Tier (10.0%)</SelectItem>
                  <SelectItem value="enterprise">
                    Custom Enterprise (Negotiated)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="rounded-xl border border-[#E6EAF0] bg-[#F8FAFC] p-3 flex flex-col gap-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox
                checked={allowSubAgents}
                onCheckedChange={(checked) =>
                  setAllowSubAgents(Boolean(checked))
                }
                className="mt-0.5"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#141C2E] flex items-center gap-1.5">
                  <Users2 className="size-3.5 text-[#0267B8]" />
                  Allow Sub-agent Management
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Agent can create employee logins and branch sub-agent
                  accounts.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox
                checked={sendNotificationEmail}
                onCheckedChange={(checked) =>
                  setSendNotificationEmail(Boolean(checked))
                }
                className="mt-0.5"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#141C2E] flex items-center gap-1.5">
                  <Mail className="size-3.5 text-[#0267B8]" />
                  Send Activation Email
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Notify {application.email} with sign-in credentials and
                  contract details.
                </span>
              </div>
            </label>
          </div>

          {/* Decision Notes */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="decision-notes"
              className="text-xs font-bold uppercase tracking-wider text-[#012A5E]"
            >
              Approval Notes / Audit Record (Optional)
            </Label>
            <Textarea
              id="decision-notes"
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              rows={2}
              className="text-xs bg-white border-[#DCE2EB] text-[#141C2E] resize-none"
              placeholder="Add internal notes on this approval decision..."
            />
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
            onClick={handleConfirm}
            loading={isSubmitting}
            loadingText="Approving..."
            className="bg-[#00875A] text-white hover:bg-[#00704A] font-extrabold px-5 h-10 shadow-sm gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="size-4" />
            <span>Confirm Approval</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

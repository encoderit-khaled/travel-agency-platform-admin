import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Check, Clock, Bell, Eye } from 'lucide-react'
import type { CreditRequest } from './credit-requests-types'

export interface CreditRequestSubmittedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request?: CreditRequest | null
  requestType?: string
  requestedAmount?: string | number
  status?: string
  onSubmitAnother?: () => void
  onBackToCredit?: () => void
  onViewRequest?: () => void
}

export function CreditRequestSubmittedDialog({
  open,
  onOpenChange,
  request,
  requestType: propRequestType,
  requestedAmount: propRequestedAmount,
  status: propStatus,
  onSubmitAnother,
  onBackToCredit,
  onViewRequest,
}: CreditRequestSubmittedDialogProps) {
  const displayRequestType =
    request?.requestType || propRequestType || 'Credit-limit increase'
  const displayAmount =
    request?.requestedAmountNumeric !== undefined
      ? request.requestedAmountNumeric
      : propRequestedAmount !== undefined
        ? propRequestedAmount
        : '1000'
  const displayStatus = request?.status || propStatus || 'Pending'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140 p-8 gap-0 rounded-3xl border border-[#DCE2EB] bg-white shadow-2xl">
        {/* Success Icon */}
        <div className="size-12 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center mb-4 shadow-xs">
          <div className="size-6 rounded-full border-2 border-[#10B981] flex items-center justify-center">
            <Check className="size-3.5 stroke-3 text-[#10B981]" />
          </div>
        </div>

        {/* Dialog Header */}
        <DialogHeader className="gap-1 text-left">
          <DialogTitle className="text-2xl font-bold text-[#001A3D] tracking-tight">
            Credit request submitted
          </DialogTitle>
          <DialogDescription className="text-sm text-[#4F5B70]">
            Your request has been submitted for Aero Wing Admin review.
          </DialogDescription>
        </DialogHeader>

        {/* 3-Column Info Card */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 mt-6 grid grid-cols-3 gap-3">
          <div>
            <span className="text-xs text-[#64748B] font-medium block">
              Request Type
            </span>
            <span className="font-bold text-[#001A3D] text-sm mt-1 block leading-snug">
              {displayRequestType === 'Credit-limit increase' ? (
                <>
                  Credit-limit
                  <br />
                  increase
                </>
              ) : (
                displayRequestType
              )}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#64748B] font-medium block">
              Requested Amount
            </span>
            <span className="font-bold text-[#001A3D] text-base mt-1 block">
              {displayAmount}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#64748B] font-medium block">
              Status
            </span>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0369A1]">
                <Clock className="size-3 text-[#0369A1]" />
                {displayStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Notice Callout */}
        <div className="bg-[#F0F6FE] border border-[#D6E6FA] rounded-xl p-3.5 mt-4 flex items-start gap-2.5 text-left">
          <Bell className="size-4 text-[#0267B8] shrink-0 mt-0.5" />
          <p className="text-xs text-[#334155] leading-relaxed">
            You will be notified when Aero Wing Admin approves, adjusts or
            rejects the request. No credit has changed yet.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onSubmitAnother}
              className="rounded-xl border-[#DCE2EB] text-[#001A3D] font-semibold text-sm px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Submit Another Request
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBackToCredit}
              className="rounded-xl border-[#DCE2EB] text-[#001A3D] font-semibold text-sm px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Back to Credit
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onViewRequest}
              className="rounded-xl bg-[#F5B544] hover:bg-[#E5A433] text-[#001A3D] font-semibold text-sm px-5 py-2 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="size-4 text-[#001A3D]" />
              View Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

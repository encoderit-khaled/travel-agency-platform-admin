import * as React from 'react'
import { Check, Clock, Bell, Eye, ArrowLeft, RefreshCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'

interface CreditRequestSubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestType: string
  requestedAmount: string | number
  onViewRequest: () => void
  onSubmitAnother: () => void
  onBackToCredit: () => void
}

export function CreditRequestSubmitDialog({
  open,
  onOpenChange,
  requestType,
  requestedAmount,
  onViewRequest,
  onSubmitAnother,
  onBackToCredit,
}: CreditRequestSubmitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-6 sm:p-8 bg-white rounded-2xl shadow-2xl border border-[#DCE2EB]">
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Green checkmark icon */}
          <div className="size-14 rounded-full bg-[#EBFDF2] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shadow-xs">
            <Check className="size-7 stroke-[2.5]" />
          </div>

          <DialogHeader className="space-y-1.5 text-center">
            <DialogTitle className="text-2xl font-extrabold text-[#001A3D] tracking-tight">
              Credit request submitted
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-[#5A6578]">
              Your request has been submitted for Aero Wing Admin review.
            </DialogDescription>
          </DialogHeader>

          {/* 3 Summary Cards */}
          <div className="grid grid-cols-3 gap-3 w-full text-left">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[11px] font-medium text-[#5A6578] mb-1">
                Request Type
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#001A3D] line-clamp-1">
                {requestType}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[11px] font-medium text-[#5A6578] mb-1">
                Requested Amount
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#001A3D]">
                {requestedAmount}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-[11px] font-medium text-[#5A6578] mb-1">
                Status
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7]">
                <Clock className="size-3" />
                Pending
              </span>
            </div>
          </div>

          {/* Info notification alert */}
          <div className="w-full bg-[#F0F7FF] border border-[#BAE6FD] rounded-xl p-3.5 flex items-start gap-3 text-left">
            <Bell className="size-4 text-[#0052CC] shrink-0 mt-0.5" />
            <p className="text-xs text-[#0052CC] leading-relaxed">
              You will be notified when Aero Wing Admin approves, adjusts or
              rejects the request. No credit has changed yet.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onSubmitAnother}
                className="text-xs font-semibold text-[#001A3D] border-[#DCE2EB] hover:bg-[#F4F6FA] flex-1 sm:flex-initial"
              >
                <RefreshCw className="size-3.5 mr-1" />
                Submit Another Request
              </Button>

              <Button
                variant="outline"
                onClick={onBackToCredit}
                className="text-xs font-semibold text-[#001A3D] border-[#DCE2EB] hover:bg-[#F4F6FA] flex-1 sm:flex-initial"
              >
                Back to Credit
              </Button>
            </div>

            <Button
              onClick={onViewRequest}
              className="w-full sm:w-auto bg-[#EAA914] hover:bg-[#D9960B] text-[#001A3D] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="size-4" />
              View Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

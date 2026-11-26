import * as React from 'react'
import {
  CreditCard,
  Plus,
  Info,
  Lock,
  List,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { Badge } from '#/components/ui/badge'
import { cn } from 'cn'
import type { CreditRequestType } from './credit-requests-types'

export interface NewCreditRequestFormProps {
  agencyName?: string
  onSubmitRequest: (data: {
    requestType: CreditRequestType
    requestedAmount: string
    reason: string
  }) => void
  onCancel?: () => void
}

export function NewCreditRequestForm({
  agencyName = 'Skyline Demo Travels Ltd',
  onSubmitRequest,
  onCancel,
}: NewCreditRequestFormProps) {
  const [requestType, setRequestType] = React.useState<CreditRequestType>(
    'Credit-limit increase',
  )
  const [requestedAmount, setRequestedAmount] = React.useState('1000')
  const [reason, setReason] = React.useState(
    'Explain why you need this credit change',
  )

  const { isLoading, run } = useActionLoading()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    run(() =>
      onSubmitRequest({
        requestType,
        requestedAmount,
        reason,
      }),
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Top Card: Current Credit (Read-only context) */}
      <div className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center shadow-xs shrink-0">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#001A3D]">
                Current Credit
              </h2>
              <p className="text-xs text-[#5A6578]">
                Read-only context from Credit Overview (M2.7)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#5A6578] bg-[#F1F5F9] px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#E2E8F0]">
              <Info className="size-3 text-[#5A6578]" />
              Sample data
            </span>
            <span className="text-[11px] font-medium text-[#5A6578] bg-[#F1F5F9] px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#E2E8F0]">
              <Lock className="size-3 text-[#5A6578]" />
              Read-only
            </span>
          </div>
        </div>

        {/* 4 Metric Sub-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-xs text-[#64748B] font-medium block">
              Current Credit Limit
            </span>
            <span className="font-bold text-[#001A3D] text-sm mt-1 block">
              Limit configured
            </span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-xs text-[#64748B] font-medium block">
              Used Credit
            </span>
            <span className="font-bold text-[#001A3D] text-sm mt-1 block">
              Usage available
            </span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-xs text-[#64748B] font-medium block">
              Available Credit
            </span>
            <span className="font-bold text-[#001A3D] text-sm mt-1 block">
              Available credit tracked
            </span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-xs text-[#64748B] font-medium block">
              Outstanding Balance
            </span>
            <span className="font-bold text-[#001A3D] text-sm mt-1 block">
              Outstanding balance tracked
            </span>
          </div>
        </div>

        {/* Notice Footer */}
        <div className="flex items-center gap-1.5 text-xs text-[#5A6578] pt-1">
          <Info className="size-3.5 text-[#5A6578] shrink-0" />
          <span>
            Exact amounts are not included in this design-preview dataset.
          </span>
        </div>
      </div>

      {/* 2. Main Form & Request Summary (2-Column Grid) */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Left Column: Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-xs space-y-6">
          {/* Card Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-[#F1F5F9]">
            <div className="size-10 rounded-xl bg-[#FEF6E6] text-[#D97706] flex items-center justify-center shadow-xs shrink-0">
              <Plus className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#001A3D]">
                New Credit Request
              </h2>
              <p className="text-xs text-[#5A6578]">
                Submitted to Aero Wing Admin for review.
              </p>
            </div>
          </div>

          {/* Field 1: Request Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-[#001A3D]">
                Request Type
              </label>
              <Badge className="bg-[#EBF4FE] text-[#0267B8] hover:bg-[#EBF4FE] border-none font-medium text-[11px] px-2 py-0.5 rounded">
                Required
              </Badge>
            </div>

            {/* Selectable Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Credit-limit increase */}
              <Button variant="plain"
                type="button"
                onClick={() => setRequestType('Credit-limit increase')}
                className={cn(
                  'p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3',
                  requestType === 'Credit-limit increase'
                    ? 'border-2 border-[#0267B8] bg-[#F4F8FD] shadow-xs'
                    : 'border-[#DCE2EB] bg-white hover:border-[#0267B8]/40 hover:bg-slate-50/50',
                ))}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={cn(
                      'size-4 rounded-full border flex items-center justify-center',
                      requestType === 'Credit-limit increase'
                        ? 'border-[#0267B8] bg-[#0267B8]'
                        : 'border-[#94A3B8] bg-white',
                    )}
                  >
                    {requestType === 'Credit-limit increase' && (
                      <div className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#001A3D]">
                    Credit-limit increase
                  </div>
                  <p className="text-xs text-[#5A6578] mt-1 leading-relaxed">
                    Request a higher credit limit for the Agent account.
                  </p>
                </div>
              </Button>

              {/* Option 2: Credit top-up */}
              <Button variant="plain"
                type="button"
                onClick={() => setRequestType('Credit top-up')}
                className={cn(
                  'p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3',
                  requestType === 'Credit top-up'
                    ? 'border-2 border-[#0267B8] bg-[#F4F8FD] shadow-xs'
                    : 'border-[#DCE2EB] bg-white hover:border-[#0267B8]/40 hover:bg-slate-50/50',
                ))}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={cn(
                      'size-4 rounded-full border flex items-center justify-center',
                      requestType === 'Credit top-up'
                        ? 'border-[#0267B8] bg-[#0267B8]'
                        : 'border-[#94A3B8] bg-white',
                    )}
                  >
                    {requestType === 'Credit top-up' && (
                      <div className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#001A3D]">
                    Credit top-up
                  </div>
                  <p className="text-xs text-[#5A6578] mt-1 leading-relaxed">
                    Request additional Agent credit.
                  </p>
                </div>
              </Button>
            </div>

            {/* Sub-banner callout */}
            <div className="bg-[#F0F6FE] border border-[#D6E6FA] text-[#0267B8] text-xs p-3 rounded-xl flex items-center gap-2">
              <Info className="size-4 shrink-0 text-[#0267B8]" />
              <span>
                {requestType === 'Credit-limit increase'
                  ? `Request a higher credit limit for ${agencyName}.`
                  : `Request additional Agent credit for ${agencyName}.`}
              </span>
            </div>
          </div>

          {/* Field 2: Requested Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-[#001A3D]">
                Requested Amount
              </label>
              <Badge className="bg-[#EBF4FE] text-[#0267B8] hover:bg-[#EBF4FE] border-none font-medium text-[11px] px-2 py-0.5 rounded">
                Required
              </Badge>
            </div>
            <Input
              type="text"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              className="h-11 rounded-xl border-[#DCE2EB] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8] text-sm font-medium"
              placeholder="1000"
              required
            />
            <div className="flex items-center gap-1.5 text-xs text-[#5A6578]">
              <Info className="size-3.5 text-[#5A6578] shrink-0" />
              <span>Enter the amount you want to request.</span>
            </div>
          </div>

          {/* Field 3: Reason */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-[#001A3D]">
                  Reason
                </label>
                <Badge className="bg-[#EBF4FE] text-[#0267B8] hover:bg-[#EBF4FE] border-none font-medium text-[11px] px-2 py-0.5 rounded">
                  Required
                </Badge>
              </div>
              <span className="text-xs text-[#64748B]">
                {reason.length} characters
              </span>
            </div>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="rounded-xl border-[#DCE2EB] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8] text-sm font-medium resize-y"
              placeholder="Explain why you need this credit change"
              required
            />
            <div className="flex items-start gap-1.5 text-xs text-[#5A6578] leading-relaxed">
              <Info className="size-3.5 text-[#5A6578] shrink-0 mt-0.5" />
              <span>
                After submission the request is Pending until Aero Wing Admin
                approves, adjusts or rejects it. Submitted requests can&apos;t
                be edited here.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Request Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
              <div className="size-10 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center shadow-xs shrink-0">
                <List className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#001A3D]">
                  Request Summary
                </h3>
                <p className="text-xs text-[#5A6578]">Updates as you type</p>
              </div>
            </div>

            {/* Summary Row 1: Request Type */}
            <div className="space-y-1">
              <span className="text-xs text-[#64748B] block font-medium">
                Request Type
              </span>
              <span className="font-bold text-[#001A3D] text-sm block">
                {requestType}
              </span>
            </div>

            {/* Summary Row 2: Requested Amount */}
            <div className="space-y-1">
              <span className="text-xs text-[#64748B] block font-medium">
                Requested Amount
              </span>
              <span className="font-bold text-[#001A3D] text-lg block">
                {requestedAmount || '0'}
              </span>
              <span className="text-[11px] text-[#5A6578] block">
                Currency context follows the Agent credit setup
              </span>
            </div>

            {/* Summary Row 3: Reason */}
            <div className="space-y-1">
              <span className="text-xs text-[#64748B] block font-medium">
                Reason
              </span>
              <p className="font-semibold text-[#001A3D] text-sm leading-relaxed wrap-break-word">
                {reason || '—'}
              </p>
            </div>

            {/* Summary Row 4: Status after submission */}
            <div className="space-y-1 pt-1">
              <span className="text-xs text-[#64748B] block font-medium">
                Status after submission
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0369A1]">
                  <Clock className="size-3 text-[#0369A1]" />
                  Pending
                </span>
              </div>
              <span className="text-xs text-[#5A6578] block mt-1">
                Awaiting an Aero Wing Admin decision
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2.5 border-t border-[#F1F5F9]">
            <Button
              type="submit"
              loading={isLoading}
              loadingText="Processing..."
              className="w-full h-11 rounded-xl bg-[#F5B544] hover:bg-[#E5A433] text-[#001A3D] font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <CheckCircle2 className="size-4 text-[#001A3D]" />
              Submit Request
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full h-10 rounded-xl border-[#DCE2EB] text-[#001A3D] font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

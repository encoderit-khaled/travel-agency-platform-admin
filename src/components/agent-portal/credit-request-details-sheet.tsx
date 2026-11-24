import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import { Badge } from '#/components/ui/badge'
import {
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Info,
  Calendar,
  FileText,
  Bell,
  TrendingUp,
} from 'lucide-react'
import type { CreditRequest } from './credit-requests-types'
import { cn } from 'cn'

export interface CreditRequestDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CreditRequest | null
  onViewInHistory?: () => void
}

export function CreditRequestDetailsSheet({
  open,
  onOpenChange,
  request,
  onViewInHistory: _onViewInHistory,
}: CreditRequestDetailsSheetProps) {
  if (!request) return null

  const getStatusBadge = () => {
    switch (request.status) {
      case 'Pending':
        return (
          <Badge className="bg-[#E0F2FE] hover:bg-[#E0F2FE] text-[#0369A1] border-none font-semibold gap-1 px-2.5 py-0.5 rounded-full">
            <Clock className="size-3" />
            Pending
          </Badge>
        )
      case 'Approved':
        return (
          <Badge className="bg-[#E8F8F0] hover:bg-[#E8F8F0] text-[#10B981] border-none font-semibold gap-1 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="size-3" />
            Approved
          </Badge>
        )
      case 'Adjusted':
        return (
          <Badge className="bg-[#FEF3C7] hover:bg-[#FEF3C7] text-[#D97706] border-none font-semibold gap-1 px-2.5 py-0.5 rounded-full">
            <SlidersHorizontal className="size-3" />
            Adjusted
          </Badge>
        )
      case 'Rejected':
        return (
          <Badge className="bg-[#FEE2E2] hover:bg-[#FEE2E2] text-[#DC2626] border-none font-semibold gap-1 px-2.5 py-0.5 rounded-full">
            <XCircle className="size-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg p-0 bg-[#F8FAFC] border-l border-[#DCE2EB] overflow-y-auto"
      >
        <div className="p-6 space-y-5">
          {/* Top Label */}
          <div>
            <div className="text-xs font-semibold text-[#5A6578] tracking-wide mb-1">
              {request.requestType} · {request.status}
            </div>
            <SheetHeader className="p-0 text-left">
              <SheetTitle className="text-xl font-bold text-[#001A3D]">
                Credit Request Details
              </SheetTitle>
              <SheetDescription className="text-xs text-[#5A6578]">
                Request ID: {request.id}
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Read-only Banner */}
          <div className="bg-white border border-[#DCE2EB] rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-[#001A3D] font-medium shadow-xs">
            <Lock className="size-4 text-[#5A6578] shrink-0" />
            <span>
              <strong className="text-[#001A3D]">Read-only request:</strong>{' '}
              Submitted requests cannot be edited.
            </span>
          </div>

          {/* Status Alert */}
          <div
            className={cn(
              'rounded-xl p-4 border flex items-start gap-3 shadow-xs',
              request.status === 'Pending' &&
                'bg-[#F0F7FF] border-[#BAE0FD] text-[#0369A1]',
              request.status === 'Approved' &&
                'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]',
              request.status === 'Adjusted' &&
                'bg-[#FEFCE8] border-[#FEF08A] text-[#A16207]',
              request.status === 'Rejected' &&
                'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]',
            )}
          >
            {request.status === 'Pending' && (
              <Clock className="size-5 shrink-0 mt-0.5" />
            )}
            {request.status === 'Approved' && (
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
            )}
            {request.status === 'Adjusted' && (
              <SlidersHorizontal className="size-5 shrink-0 mt-0.5" />
            )}
            {request.status === 'Rejected' && (
              <XCircle className="size-5 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                <span>{request.status}</span>
                {getStatusBadge()}
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {request.decisionNote ||
                  (request.status === 'Pending'
                    ? 'Awaiting an Aero Wing Admin decision.'
                    : `Decision finalized by Aero Wing Admin on ${request.decisionDate || 'record'}.`)}
              </p>
            </div>
          </div>

          {/* Section: Request Details */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#0267B8]" />
                <h3 className="font-bold text-sm text-[#001A3D]">Request</h3>
              </div>
              <span className="text-[11px] font-medium text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Info className="size-3" />
                Sample data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-[#64748B] block">
                  Request Type
                </span>
                <span className="font-bold text-[#001A3D] text-sm mt-0.5 block">
                  {request.requestType}
                </span>
                <span className="text-[11px] text-[#64748B] block">
                  {request.typeDescription}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#64748B] block">
                  Requested Amount
                </span>
                <span className="font-bold text-[#001A3D] text-sm mt-0.5 block">
                  {request.requestedAmountNumeric
                    ? `$${request.requestedAmountNumeric.toLocaleString()}`
                    : request.requestedAmount}
                </span>
                {request.adjustedAmount && (
                  <span className="text-[11px] text-[#D97706] font-medium block">
                    {request.adjustedAmount}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs text-[#64748B] block">Submitted</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#001A3D] font-medium">
                <Calendar className="size-3.5 text-[#64748B]" />
                <span>{request.submittedTimestamp}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-[#64748B] block">Reason</span>
              <p className="text-xs text-[#001A3D] font-medium mt-1 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg leading-relaxed">
                {request.reason}
              </p>
            </div>
          </div>

          {/* Section: Credit Record & Notification */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <TrendingUp className="size-4 text-[#0267B8]" />
              <h3 className="font-bold text-sm text-[#001A3D]">
                Credit record & notification
              </h3>
            </div>

            <div>
              <span className="text-xs text-[#64748B] block">
                Credit record / ledger
              </span>
              <p className="text-xs font-semibold text-[#001A3D] mt-0.5">
                {request.creditRecord}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748B] block">Notification</span>
              <p className="text-xs text-[#475569] mt-0.5 flex items-start gap-1.5">
                <Bell className="size-3.5 text-[#0267B8] shrink-0 mt-0.5" />
                <span>{request.agentNotification}</span>
              </p>
            </div>
          </div>

          {/* Section: Decision History */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#001A3D]">
              Decision History
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
              {/* Event 1: Submission */}
              <div className="relative">
                <div className="absolute -left-6 top-1 size-4 rounded-full bg-[#0267B8] border-2 border-white shadow-xs" />
                <div className="text-xs font-bold text-[#001A3D]">
                  Request submitted
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  {request.submittedTimestamp}
                </div>
              </div>

              {/* Event 2: Decision (if any) */}
              {request.status !== 'Pending' && (
                <div className="relative">
                  <div
                    className={cn(
                      'absolute -left-6 top-1 size-4 rounded-full border-2 border-white shadow-xs',
                      request.status === 'Approved' && 'bg-[#10B981]',
                      request.status === 'Adjusted' && 'bg-[#D97706]',
                      request.status === 'Rejected' && 'bg-[#DC2626]',
                    )}
                  />
                  <div className="text-xs font-bold text-[#001A3D]">
                    {request.decision}
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    {request.decisionDate}
                  </div>
                  {request.decisionNote && (
                    <p className="text-[11px] text-[#475569] mt-1 bg-slate-50 p-2 rounded border border-slate-200">
                      {request.decisionNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

import * as React from 'react'
import {
  Lock,
  Scale,
  Info,
  MinusCircle,
  PlusCircle,
  X,
  ExternalLink,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { WalletTransaction } from './wallet-ledger-types'

interface TransactionDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: WalletTransaction | null
  onNavigateToBooking?: (ref: string) => void
}

export function TransactionDetailsSheet({
  open,
  onOpenChange,
  transaction,
  onNavigateToBooking,
}: TransactionDetailsSheetProps) {
  if (!transaction) return null

  const isDebit = transaction.direction === 'Debit'
  const isAdjustment =
    transaction.isAdjustment || transaction.type === 'Manual Adjustment'
  const hasBookingRef =
    transaction.reference &&
    transaction.reference !== '—' &&
    transaction.reference.startsWith('AW-')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-[560px] md:max-w-[580px] w-full p-0 flex flex-col justify-between bg-white border-l border-[#DCE2EB] shadow-2xl"
      >
        {/* Top Header */}
        <div className="p-6 pb-5 bg-white border-b border-[#E6EAF0] relative">
          <SheetHeader className="pr-10 gap-1 text-left">
            <SheetTitle className="text-2xl font-extrabold text-[#001A3D] tracking-tight">
              Transaction Details
            </SheetTitle>
            <p className="text-sm font-medium text-[#5A6578]">
              {transaction.type} · {transaction.dateTime}
            </p>
          </SheetHeader>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Banner 1: Read-only record */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3.5 shadow-2xs">
            <div className="size-8 rounded-lg bg-white border border-[#E2E8F0] text-[#001A3D] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Lock className="size-4 text-[#001A3D]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-bold text-[#001A3D]">
                Read-only record
              </h4>
              <p className="text-xs text-[#5A6578] leading-relaxed">
                This wallet ledger entry cannot be edited.
              </p>
            </div>
          </div>

          {/* Banner 2: Adjustment Entry */}
          {isAdjustment && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex items-start gap-3.5 shadow-2xs">
              <div className="size-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                <Scale className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-bold text-[#92400E]">
                  Adjustment Entry
                </h4>
                <p className="text-xs text-[#92400E]/90 leading-relaxed">
                  This entry records a wallet correction. Original ledger
                  records remain unchanged. Recorded by Admin.
                </p>
              </div>
            </div>
          )}

          {/* Main Details Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-[#001A3D]">
                Transaction
              </h3>
              <Badge
                variant="outline"
                className="bg-[#F8FAFC] text-[#5A6578] border-[#E2E8F0] text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
              >
                <Info className="size-3 text-[#5A6578]" />
                Sample data
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              {/* Row 1: Type & Date/Time */}
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Type</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.type}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Date & Time</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.dateTime} · {transaction.time}
                </p>
              </div>

              <div className="col-span-2 border-t border-[#F1F5F9]" />

              {/* Row 2: Description & Reference */}
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Description</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.description}
                </p>
                {transaction.subtitle && (
                  <p className="text-xs text-[#718096] mt-0.5">
                    {transaction.subtitle}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Reference</p>
                {hasBookingRef ? (
                  <button
                    type="button"
                    onClick={() => onNavigateToBooking?.(transaction.reference)}
                    className="font-bold text-sm text-[#0267B8] hover:underline inline-flex items-center gap-1 text-left"
                  >
                    <span>{transaction.reference}</span>
                    <ExternalLink className="size-3" />
                  </button>
                ) : (
                  <p className="font-medium text-[#5A6578] text-sm">
                    {transaction.reference}
                  </p>
                )}
              </div>

              <div className="col-span-2 border-t border-[#F1F5F9]" />

              {/* Row 3: Direction & Amount */}
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Direction</p>
                {isDebit ? (
                  <span className="inline-flex items-center gap-1.5 text-[#DC2626] font-bold text-xs bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    <MinusCircle className="size-3.5 text-[#DC2626]" />
                    Debit
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[#059669] font-bold text-xs bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    <PlusCircle className="size-3.5 text-[#059669]" />
                    Credit
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Amount</p>
                <p
                  className={
                    isDebit
                      ? 'text-[#DC2626] font-bold text-sm'
                      : 'text-[#059669] font-bold text-sm'
                  }
                >
                  {transaction.amount}
                </p>
              </div>

              <div className="col-span-2 border-t border-[#F1F5F9]" />

              {/* Row 4: Running Balance & Source */}
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Running Balance</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.runningBalance}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#5A6578] mb-1">Source</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.source}
                </p>
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="flex items-center gap-2 px-1 pt-1 text-xs text-[#5A6578]">
            <Info className="size-3.5 text-[#5A6578] shrink-0" />
            <span>
              No payment, card, processor or bank identifiers are shown.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E6EAF0] bg-white flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-[#F5B800] hover:bg-[#E5AC00] text-[#001A3D] font-bold px-8 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

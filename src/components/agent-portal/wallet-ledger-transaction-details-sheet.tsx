import * as React from 'react'
import {
  Lock,
  SlidersHorizontal,
  Info,
  MinusCircle,
  PlusCircle,
  X,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { WalletTransaction } from './wallet-ledger-types'
import { cn } from 'cn'

interface WalletLedgerTransactionDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: WalletTransaction | null
}

export function WalletLedgerTransactionDetailsSheet({
  open,
  onOpenChange,
  transaction,
}: WalletLedgerTransactionDetailsSheetProps) {
  if (!transaction) return null

  const isDebit = transaction.direction === 'Debit'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-135 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white border-l border-[#DCE2EB]"
      >
        <div className="space-y-6">
          {/* Header */}
          <SheetHeader className="space-y-1 pr-8">
            <SheetTitle className="text-xl font-extrabold text-[#001A3D] tracking-tight">
              Transaction Details
            </SheetTitle>
            <SheetDescription className="text-xs text-[#5A6E85]">
              {transaction.type} · {transaction.date || transaction.dateTime}
            </SheetDescription>
          </SheetHeader>

          {/* Banner 1: Read-only notice */}
          <div className="rounded-xl border border-[#E6EAF0] bg-[#F8FAFC] p-4 flex items-start gap-3">
            <div className="size-8 rounded-lg bg-white border border-[#E6EAF0] flex items-center justify-center text-[#001A3D] shrink-0 mt-0.5">
              <Lock className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#001A3D]">
                Read-only record
              </p>
              <p className="text-xs text-[#5A6E85]">
                This wallet ledger entry cannot be edited.
              </p>
            </div>
          </div>

          {/* Banner 2: Adjustment Entry notice (shown for manual adjustments) */}
          {(transaction.isAdjustment ||
            transaction.type === 'Manual Adjustment') && (
            <div className="rounded-xl border border-[#FDE3B5] bg-[#FEF6E9] p-4 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-white/80 border border-[#FDE3B5] flex items-center justify-center text-[#D97706] shrink-0 mt-0.5">
                <SlidersHorizontal className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#92400E]">
                  Adjustment Entry
                </p>
                <p className="text-xs text-[#B45309] leading-relaxed">
                  This entry records a wallet correction. Original ledger
                  records remain unchanged. Recorded by Admin.
                </p>
              </div>
            </div>
          )}

          {/* Transaction Data Card */}
          <div className="rounded-2xl border border-[#E6EAF0] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
              <span className="text-sm font-bold text-[#001A3D]">
                Transaction
              </span>
              <Badge
                variant="outline"
                className="bg-[#F4F6FA] text-[#5A6E85] border-[#DCE2EB] text-[11px] font-semibold py-0.5 px-2 rounded-full flex items-center gap-1"
              >
                <Info className="size-3" />
                Sample data
              </Badge>
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Type</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.type}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Date & Time</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.date || transaction.dateTime} ·{' '}
                  {transaction.time}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Description</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.description}
                </p>
                {(transaction.subDescription || transaction.subtitle) && (
                  <p className="text-[11px] text-[#5A6E85] mt-0.5">
                    {transaction.subDescription || transaction.subtitle}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Reference</p>
                {transaction.reference !== '—' ? (
                  <span className="font-bold text-[#0267B8] font-mono underline text-xs cursor-pointer">
                    {transaction.reference}
                  </span>
                ) : (
                  <span className="font-bold text-[#94A3B8]">—</span>
                )}
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Direction</p>
                <div className="flex items-center gap-1.5 font-bold">
                  {isDebit ? (
                    <span className="inline-flex items-center gap-1 text-[#D9381E]">
                      <MinusCircle className="size-3.5" />
                      Debit
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#107C41]">
                      <PlusCircle className="size-3.5" />
                      Credit
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Amount</p>
                <p
                  className={cn(
                    'font-extrabold text-sm',
                    isDebit ? 'text-[#D9381E]' : 'text-[#107C41]',
                  )}
                >
                  {transaction.amount}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">
                  Running Balance
                </p>
                <p className="font-extrabold text-[#001A3D] text-sm">
                  {transaction.runningBalance}
                </p>
              </div>

              <div>
                <p className="text-[#5A6E85] mb-1 font-medium">Source</p>
                <p className="font-bold text-[#001A3D] text-sm">
                  {transaction.source}
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-[#5A6E85] flex items-center gap-1.5 pt-1">
            <Info className="size-3.5 shrink-0 text-[#94A3B8]" />
            No payment, card, processor or bank identifiers are shown.
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-6 mt-6 border-t border-[#E6EAF0] flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#001A3D] font-extrabold text-xs px-7 py-2.5 h-auto shadow-sm cursor-pointer"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

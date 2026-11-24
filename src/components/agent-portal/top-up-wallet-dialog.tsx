import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Wallet, Lock, Info, ArrowRight, CheckCircle2 } from 'lucide-react'

export interface TopUpWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agencyName?: string
  onSuccess?: (amount: string) => void
}

export function TopUpWalletDialog({
  open,
  onOpenChange,
  agencyName = 'Skyline Demo Travels Ltd',
  onSuccess,
}: TopUpWalletDialogProps) {
  const [amount, setAmount] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false)

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setAmount('')
      setError('')
      setIsSubmitting(false)
      setSubmittedSuccess(false)
    }, 200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount.trim()) {
      setError('Please enter a top-up amount')
      return
    }

    const parsed = Number.parseFloat(amount.replace(/[^0-9.]/g, ''))
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive number')
      return
    }

    setError('')
    setIsSubmitting(true)

    // Simulate Stripe redirect / top-up trigger
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmittedSuccess(true)
      onSuccess?.(amount)
      setTimeout(() => {
        handleClose()
      }, 1500)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 gap-0 rounded-2xl border border-[#DCE2EB] bg-white shadow-2xl">
        {submittedSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="size-7" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#001A3D]">
              Redirecting to Stripe...
            </DialogTitle>
            <DialogDescription className="text-sm text-[#4F5B70] max-w-xs">
              Opening secure checkout session for {agencyName}.
            </DialogDescription>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Top Icon and Header */}
            <div>
              <div className="size-11 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center mb-3.5 shadow-xs">
                <Wallet className="size-5.5" />
              </div>
              <DialogHeader className="gap-1 text-left">
                <DialogTitle className="text-2xl font-bold text-[#001A3D] tracking-tight">
                  Top Up Wallet
                </DialogTitle>
                <DialogDescription className="text-sm text-[#5A6578]">
                  Add funds to {agencyName}&apos;s Agent wallet.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Amount Input Section */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="topup-amount"
                  className="text-sm font-semibold text-[#001A3D]"
                >
                  Amount
                </Label>
                <Badge
                  variant="secondary"
                  className="bg-[#E8F1FC] text-[#0267B8] border-none font-semibold text-[11px] px-2 py-0.5 rounded-full"
                >
                  Required
                </Badge>
              </div>

              <div className="relative">
                <Input
                  id="topup-amount"
                  type="text"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    if (error) setError('')
                  }}
                  className="h-12 px-3.5 text-base rounded-xl border-[#DCE2EB] bg-white text-[#001A3D] placeholder:text-[#9AA5B8] focus:border-[#0267B8] focus:ring-2 focus:ring-[#0267B8]/15"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-rose-600 mt-1">
                  {error}
                </p>
              )}

              <p className="text-xs text-[#5A6578] flex items-center gap-1.5 pt-0.5">
                <Info className="size-3.5 shrink-0 text-[#8D99AE]" />
                <span>
                  Currency context is determined by the configured
                  wallet/payment setup.
                </span>
              </p>
            </div>

            {/* Security notice box */}
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 flex items-start gap-2.5 text-xs text-[#475569] leading-relaxed">
              <Lock className="size-4 shrink-0 text-[#0267B8] mt-0.5" />
              <span>
                Payment will be processed through Stripe. AeroWing doesn&apos;t
                collect card details.
              </span>
            </div>

            {/* Action buttons */}
            <DialogFooter className="pt-2 sm:justify-end gap-2.5 border-t-0 mt-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-11 px-5 rounded-xl border-[#DCE2EB] text-[#001A3D] font-semibold hover:bg-[#F4F6FA] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-5 rounded-xl bg-[#F1C134] hover:bg-[#E5B422] text-[#001A3D] font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>
                  {isSubmitting ? 'Processing...' : 'Continue to Stripe'}
                </span>
                <ArrowRight className="size-4" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { B2CCustomer } from './types'

interface EditCustomerDialogProps {
  customer: B2CCustomer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updated: B2CCustomer) => void
}

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
  onSave,
}: EditCustomerDialogProps) {
  const [fullName, setFullName] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (customer) {
      setFullName(customer.name)
      setError('')
    }
  }, [customer, open])

  const { isLoading, run } = useActionLoading(open)

  if (!customer) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed) {
      setError('Full name cannot be empty')
      return
    }

    // derive initials
    const parts = trimmed.split(/\s+/).filter(Boolean)
    const initials =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : trimmed.slice(0, 2).toUpperCase()

    run(() => {
      onSave({
        ...customer,
        name: trimmed,
        initials,
      })
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-[#DCE2EB] rounded-2xl shadow-xl p-6">
        <form onSubmit={handleSave}>
          <DialogHeader className="gap-1.5 pb-3 border-b border-[#EEF1F5]">
            <DialogTitle className="text-xl font-bold text-[#012A5E]">
              Edit Customer Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4F5B70]">
              Update the customer’s basic profile information.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5 space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-fullName"
                className="text-xs font-bold text-[#141B28] uppercase tracking-wider"
              >
                Full Name
              </Label>
              <Input
                id="edit-fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Enter customer name"
                className="h-10 text-sm rounded-xl border-[#C5CFDC] focus:border-[#012A5E] focus:ring-1 focus:ring-[#012A5E]"
              />
              {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
              )}
            </div>

            <div className="p-3 bg-[#EEF2F7] rounded-xl border border-[#DCE2EB] text-xs text-[#4F5B70] space-y-1">
              <p className="font-semibold text-[#141B28]">
                Sign-in details note
              </p>
              <p>
                Email and mobile numbers are tied to verified credentials and
                cannot be altered directly here.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3 border-t border-[#EEF1F5] sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-[#C5CFDC] text-[#4F5B70] hover:bg-[#EEF2F7]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loadingText="Saving..."
              className="rounded-xl bg-[#012A5E] hover:bg-[#0F3F7D] text-white font-semibold shadow-xs"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

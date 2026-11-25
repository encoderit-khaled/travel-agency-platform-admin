import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { User, Check } from 'lucide-react'

export interface EditCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerName: string
  onSave: (newName: string) => void
}

export function EditCustomerDialog({
  open,
  onOpenChange,
  customerName,
  onSave,
}: EditCustomerDialogProps) {
  const [name, setName] = React.useState(customerName)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setName(customerName)
      setError(null)
    }
  }, [open, customerName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Full name cannot be empty')
      return
    }
    onSave(name.trim())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-[#DCE2EB] rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FD] flex items-center justify-center text-[#012A5E] mb-1">
            <User className="size-5" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-[#4F5B70]">
            Update the customer’s profile information. Sign-in and account details remain read-only.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="customer-name" className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
              Full Name
            </Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError(null)
              }}
              placeholder="Enter customer full name"
              className="h-10 text-sm font-semibold text-[#141B28] border-[#DCE2EB] focus-visible:border-[#012A5E] focus-visible:ring-[#012A5E]/20"
              autoFocus
            />
            {error && (
              <p className="text-xs font-semibold text-rose-600 mt-1">
                {error}
              </p>
            )}
          </div>

          <div className="bg-[#F4F6FA] border border-[#DCE2EB] rounded-xl p-3 text-xs text-[#4F5B70] space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold text-[#4F5B70]">Account Type:</span>
              <span className="font-bold text-[#141B28]">B2C Customer</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#4F5B70]">Email:</span>
              <span className="font-bold text-[#141B28]">demo.customer@example.com</span>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" type="button" className="border-[#DCE2EB] text-[#4F5B70] hover:bg-[#F4F6FA] font-bold">Cancel</Button>} />
            <Button
              type="submit"
              className="bg-[#012A5E] hover:bg-[#0F3F7D] text-white font-extrabold inline-flex items-center gap-1.5 px-4 shadow-xs"
            >
              <Check className="size-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

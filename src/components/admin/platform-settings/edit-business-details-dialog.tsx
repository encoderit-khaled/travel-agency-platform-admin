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
import { Building2, Check, AlertCircle } from 'lucide-react'
import type {
  EditBusinessDetailsDialogProps,
  BusinessDetailsConfig,
} from './types'

export function EditBusinessDetailsDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditBusinessDetailsDialogProps) {
  const [formData, setFormData] =
    React.useState<BusinessDetailsConfig>(initialData)
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setFormData(initialData)
      setError(null)
      setIsSubmitting(false)
    }
  }, [open, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.businessName.trim()) {
      setError('Business Name is required.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSave(formData)
      setIsSubmitting(false)
      onOpenChange(false)
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135 p-0 overflow-hidden rounded-[20px] border border-[#DCE2EB] bg-white shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-[#DCE2EB] bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#EBF3FC] flex items-center justify-center text-[#0052CC] shrink-0">
                <Building2 className="size-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <DialogTitle className="text-lg font-bold text-[#001A3D]">
                  Edit Business Details
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B]">
                  Update platform core business identity and basic information.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form Body */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <AlertCircle className="size-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="businessName"
                className="text-xs font-bold text-[#001A3D] flex items-center gap-1"
              >
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    businessName: e.target.value,
                  }))
                  if (error) setError(null)
                }}
                placeholder="Enter primary business name"
                className="h-10 rounded-xl border-[#DCE2EB] bg-white text-sm text-[#141C2E] focus-visible:ring-1 focus-visible:ring-[#0052CC]"
              />
              <p className="text-[11px] text-[#64748B]">
                Primary business name used in customer-facing and platform
                configuration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="legalName"
                  className="text-xs font-bold text-[#001A3D]"
                >
                  Legal / Registered Entity
                </Label>
                <Input
                  id="legalName"
                  type="text"
                  value={formData.legalName || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      legalName: e.target.value,
                    }))
                  }
                  placeholder="e.g. Aero Wing Travel Solutions Ltd."
                  className="h-10 rounded-xl border-[#DCE2EB] bg-white text-sm text-[#141C2E]"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="registrationNumber"
                  className="text-xs font-bold text-[#001A3D]"
                >
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  type="text"
                  value={formData.registrationNumber || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      registrationNumber: e.target.value,
                    }))
                  }
                  placeholder="e.g. AW-CORP-2026-88"
                  className="h-10 rounded-xl border-[#DCE2EB] bg-white text-sm text-[#141C2E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="supportEmail"
                  className="text-xs font-bold text-[#001A3D]"
                >
                  Support Email
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={formData.supportEmail || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supportEmail: e.target.value,
                    }))
                  }
                  placeholder="admin@aerowing.com"
                  className="h-10 rounded-xl border-[#DCE2EB] bg-white text-sm text-[#141C2E]"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="supportPhone"
                  className="text-xs font-bold text-[#001A3D]"
                >
                  Support Phone
                </Label>
                <Input
                  id="supportPhone"
                  type="text"
                  value={formData.supportPhone || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supportPhone: e.target.value,
                    }))
                  }
                  placeholder="+1 (800) 555-0199"
                  className="h-10 rounded-xl border-[#DCE2EB] bg-white text-sm text-[#141C2E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="headquartersAddress"
                className="text-xs font-bold text-[#001A3D]"
              >
                Headquarters Address
              </Label>
              <Input
                id="headquartersAddress"
                type="text"
                value={formData.headquartersAddress || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    headquartersAddress: e.target.value,
                  }))
                }
                placeholder="Address line, City, Country"
                className="h-10 rounded-xl border-[#DCE2EB] bg-white text-sm text-[#141C2E]"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 px-6 border-t border-[#DCE2EB] bg-[#F8FAFC] flex items-center justify-end gap-2.5">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              loading={isSubmitting}
              loadingText="Saving..."
              className="bg-[#001A3D] hover:bg-[#012A5E] text-white font-bold px-5 h-9.5 rounded-xl text-xs gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="size-4" />
              <span>Save Changes</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

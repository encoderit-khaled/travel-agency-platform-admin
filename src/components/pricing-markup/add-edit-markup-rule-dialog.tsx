import * as React from 'react'
import { Plus, Tag, Info } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type {
  AgentMarkupRule,
  RuleScope,
  PricingCalculationType,
} from './types'

interface AddEditMarkupRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ruleToEdit?: AgentMarkupRule | null
  onSaveRule: (ruleData: Partial<AgentMarkupRule>) => void
}

export function AddEditMarkupRuleDialog({
  open,
  onOpenChange,
  ruleToEdit,
  onSaveRule,
}: AddEditMarkupRuleDialogProps) {
  const isEditing = Boolean(ruleToEdit)

  const [name, setName] = React.useState('')
  const [scope, setScope] = React.useState<RuleScope>('Specific Service')
  const [service, setService] = React.useState('Flight')
  const [type, setType] = React.useState<PricingCalculationType>('Percentage')
  const [value, setValue] = React.useState('')
  const [supplier, setSupplier] = React.useState('All suppliers')

  React.useEffect(() => {
    if (ruleToEdit) {
      setName(ruleToEdit.name)
      setScope(ruleToEdit.scope)
      setService(ruleToEdit.service)
      setType(ruleToEdit.type)
      setValue(ruleToEdit.value.replace('Sample ', '').replace('%', ''))
      setSupplier(ruleToEdit.supplier)
    } else {
      setName('')
      setScope('Specific Service')
      setService('Flight')
      setType('Percentage')
      setValue('3')
      setSupplier('All suppliers')
    }
  }, [ruleToEdit, open])

  const { isLoading, run } = useActionLoading(open)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const formattedValue =
      type === 'Percentage'
        ? `Sample ${value || '3'}%`
        : `Sample ${value || '500'} BDT`

    run(() => {
      onSaveRule({
        id: ruleToEdit?.id,
        name: name.trim(),
        scope,
        service,
        type,
        value: formattedValue,
        numericValue: parseFloat(value) || 0,
        supplier,
        status: ruleToEdit ? ruleToEdit.status : 'active',
      })
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#FEF7E6] text-[#D97706] flex items-center justify-center">
              <Tag className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#001A3D]">
                {isEditing ? 'Edit Markup Rule' : 'Add Markup Rule'}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#64748B]">
                {isEditing
                  ? 'Update your retail client pricing markup configuration.'
                  : 'Create an additional markup rule for client quoting.'}
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-4">
            {/* Rule Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-name"
                className="text-xs font-bold text-[#141C2E]"
              >
                Rule Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rule-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Flight Client Markup"
                className="bg-white border-[#DCE2EB] rounded-xl h-10 font-medium text-sm text-[#001A3D]"
                required
              />
            </div>

            {/* Scope Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#141C2E]">
                Rule Scope
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setScope('All Services')
                    setService('All Services')
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    scope === 'All Services'
                      ? 'border-[#001A3D] bg-[#F0F4FA] ring-1 ring-[#001A3D]'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#001A3D] block">
                    All Services
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    Apply across all modules
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setScope('Specific Service')
                    if (service === 'All Services') setService('Flight')
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    scope === 'Specific Service'
                      ? 'border-[#001A3D] bg-[#F0F4FA] ring-1 ring-[#001A3D]'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#001A3D] block">
                    Specific Service
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    Select one service module
                  </span>
                </button>
              </div>
            </div>

            {/* Service & Supplier */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="rule-service"
                  className="text-xs font-bold text-[#141C2E]"
                >
                  Service Module
                </Label>
                <Select
                  value={service}
                  onValueChange={setService}
                  disabled={scope === 'All Services'}
                >
                  <SelectTrigger
                    id="rule-service"
                    className="rounded-xl h-10 text-xs font-semibold"
                  >
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg border-[#E2E8F0]">
                    <SelectItem value="Flight">Flight</SelectItem>
                    <SelectItem value="Hotel">Hotel</SelectItem>
                    <SelectItem value="Travel Package">
                      Travel Package
                    </SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                    <SelectItem value="Car Rental">Car Rental</SelectItem>
                    <SelectItem value="eSIM">eSIM</SelectItem>
                    <SelectItem value="Bus / Train">Bus / Train</SelectItem>
                    <SelectItem value="Travel Insurance">
                      Travel Insurance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="rule-supplier"
                  className="text-xs font-bold text-[#141C2E]"
                >
                  Supplier
                </Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger
                    id="rule-supplier"
                    className="rounded-xl h-10 text-xs font-semibold"
                  >
                    <SelectValue placeholder="All suppliers" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg border-[#E2E8F0]">
                    <SelectItem value="All suppliers">All suppliers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Type & Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="rule-type"
                  className="text-xs font-bold text-[#141C2E]"
                >
                  Calculation Type
                </Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as PricingCalculationType)}
                >
                  <SelectTrigger
                    id="rule-type"
                    className="rounded-xl h-10 text-xs font-semibold"
                  >
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg border-[#E2E8F0]">
                    <SelectItem value="Percentage">Percentage (%)</SelectItem>
                    <SelectItem value="Fixed amount">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="rule-value"
                  className="text-xs font-bold text-[#141C2E]"
                >
                  Markup Value
                </Label>
                <Input
                  id="rule-value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={type === 'Percentage' ? '3' : '500'}
                  className="bg-white border-[#DCE2EB] rounded-xl h-10 font-bold text-sm text-[#001A3D]"
                  required
                />
              </div>
            </div>

            <p className="text-[11px] text-[#64748B] flex items-center gap-1.5 pt-1">
              <Info className="size-3.5 text-[#0267B8] shrink-0" />
              Markup limits configured by Aero Wing Admin apply automatically.
            </p>
          </div>

          <DialogFooter className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#CBD5E1] text-xs font-semibold text-[#1D2939] h-10 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loadingText={isEditing ? 'Saving...' : 'Processing...'}
              className="bg-[#001A3D] hover:bg-[#012A5E] text-xs font-bold text-white h-10 rounded-xl px-5 shadow-xs"
            >
              {isEditing ? 'Save Changes' : 'Create Markup Rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

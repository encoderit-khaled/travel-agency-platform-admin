import * as React from 'react'
import {
  Plus,
  Percent,
  Sliders,
  Info,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from 'lucide-react'
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
import { Badge } from '#/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import type {
  AgentMarkupRule,
  PricingCalculationType,
  RuleScope,
} from './types'

interface AddEditMarkupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingRule?: AgentMarkupRule | null
  onSaveRule: (rule: AgentMarkupRule) => void
}

export function AddEditMarkupDialog({
  open,
  onOpenChange,
  existingRule,
  onSaveRule,
}: AddEditMarkupDialogProps) {
  const isEditing = Boolean(existingRule)

  const [name, setName] = React.useState('')
  const [scope, setScope] = React.useState<RuleScope>('Specific Service')
  const [service, setService] = React.useState('Flight')
  const [supplier, setSupplier] = React.useState('All suppliers')
  const [type, setType] = React.useState<PricingCalculationType>('Percentage')
  const [value, setValue] = React.useState('3.0')
  const [status, setStatus] = React.useState<'active' | 'inactive'>('active')
  const [description, setDescription] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (existingRule) {
      setName(existingRule.name)
      setScope(existingRule.scope)
      setService(existingRule.service)
      setSupplier(existingRule.supplier)
      setType(existingRule.type)
      setValue(existingRule.numericValue.toString())
      setStatus(existingRule.status)
      setDescription(existingRule.description || '')
    } else {
      setName('')
      setScope('Specific Service')
      setService('Flight')
      setSupplier('All suppliers')
      setType('Percentage')
      setValue('3.0')
      setStatus('active')
      setDescription('')
    }
    setError('')
  }, [existingRule, open])

  const { isLoading, run } = useActionLoading(open)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a descriptive rule name.')
      return
    }

    const numVal = parseFloat(value)
    if (isNaN(numVal) || numVal <= 0) {
      setError('Please provide a valid markup value greater than zero.')
      return
    }

    const displayVal =
      type === 'Percentage' ? `Sample ${numVal}%` : `Sample fixed amount`

    const newOrUpdated: AgentMarkupRule = {
      id: existingRule ? existingRule.id : `agt-rule-${Date.now()}`,
      name: name.trim(),
      source: 'agent',
      scope,
      service: scope === 'All Services' ? 'All Services' : service,
      supplier,
      type,
      value: displayVal,
      numericValue: numVal,
      status,
      description: description.trim(),
      updatedAt: new Date().toISOString().split('T')[0],
      createdAt:
        existingRule?.createdAt || new Date().toISOString().split('T')[0],
    }

    run(() => {
      onSaveRule(newOrUpdated)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-[#E2E8F0] shadow-xl p-0 overflow-hidden rounded-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-[#001A3D] text-white p-6 border-b border-white/10">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F1C134]">
                <Plus className="size-4.5" />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white">
                {isEditing ? 'Edit Markup Rule' : 'Add Markup Rule'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-[#8EAECF]">
              {isEditing
                ? 'Update your agency client markup parameters. Changes apply to future quotes and bookings.'
                : 'Create an additional markup rule to apply when quoting direct clients, within limits configured by Admin.'}
            </DialogDescription>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Section A: Rule Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <span className="size-5 rounded-full bg-[#F1C134] text-[#001A3D] text-xs font-black flex items-center justify-center">
                  A
                </span>
                <h3 className="font-bold text-[#001A3D] text-sm">
                  Rule Details
                </h3>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rule-name"
                  className="text-xs font-bold text-[#1D2939]"
                >
                  Rule Name *
                </Label>
                <Input
                  id="rule-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Flight Client Markup, Summer Hotel Margin"
                  className="bg-[#F8FAFC] border-[#E2E8F0] text-sm font-semibold"
                />
                <p className="text-[11px] text-[#64748B]">
                  Use a name that makes the purpose of this markup easy to
                  recognize across reports.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#1D2939] block">
                    Rule Source
                  </span>
                  <span className="text-[#64748B]">
                    Managed by your Agent account
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Agent configured
                </Badge>
              </div>
            </div>

            {/* Section B: Scope & Where It Applies */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <span className="size-5 rounded-full bg-[#F1C134] text-[#001A3D] text-xs font-black flex items-center justify-center">
                  B
                </span>
                <h3 className="font-bold text-[#001A3D] text-sm">
                  Where This Rule Applies
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="rule-scope"
                    className="text-xs font-bold text-[#1D2939]"
                  >
                    Rule Scope
                  </Label>
                  <Select
                    value={scope}
                    onValueChange={(val: any) => setScope(val)}
                  >
                    <SelectTrigger
                      id="rule-scope"
                      className="bg-[#F8FAFC] border-[#E2E8F0] text-sm font-semibold"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Specific Service">
                        Specific Service
                      </SelectItem>
                      <SelectItem value="All Services">All Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {scope === 'Specific Service' && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="rule-service"
                      className="text-xs font-bold text-[#1D2939]"
                    >
                      Service Module
                    </Label>
                    <Select value={service} onValueChange={setService}>
                      <SelectTrigger
                        id="rule-service"
                        className="bg-[#F8FAFC] border-[#E2E8F0] text-sm font-semibold"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rule-supplier"
                  className="text-xs font-bold text-[#1D2939]"
                >
                  Supplier Coverage
                </Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger
                    id="rule-supplier"
                    className="bg-[#F8FAFC] border-[#E2E8F0] text-sm font-semibold"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All suppliers">All suppliers</SelectItem>
                    <SelectItem value="Biman Bangladesh">
                      Biman Bangladesh
                    </SelectItem>
                    <SelectItem value="Emirates">Emirates</SelectItem>
                    <SelectItem value="Amadeus GDS">Amadeus GDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section C: Markup Calculation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <span className="size-5 rounded-full bg-[#F1C134] text-[#001A3D] text-xs font-black flex items-center justify-center">
                  C
                </span>
                <h3 className="font-bold text-[#001A3D] text-sm">
                  Markup Value & Status
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="rule-type"
                    className="text-xs font-bold text-[#1D2939]"
                  >
                    Calculation Type
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(val: any) => setType(val)}
                  >
                    <SelectTrigger
                      id="rule-type"
                      className="bg-[#F8FAFC] border-[#E2E8F0] text-sm font-semibold"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage (%)</SelectItem>
                      <SelectItem value="Fixed amount">
                        Fixed amount (BDT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="rule-val"
                    className="text-xs font-bold text-[#1D2939]"
                  >
                    Markup Rate / Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="rule-val"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="e.g. 3.0"
                      className="bg-[#F8FAFC] border-[#E2E8F0] font-bold text-sm pl-4 pr-12"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">
                      {type === 'Percentage' ? '%' : 'BDT'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rule-status"
                  className="text-xs font-bold text-[#1D2939]"
                >
                  Initial Rule State
                </Label>
                <RadioGroup
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as 'active' | 'inactive')
                  }
                  className="flex w-auto flex-row items-center gap-4"
                >
                  <label className="flex items-center gap-2 text-sm text-[#1D2939] cursor-pointer">
                    <RadioGroupItem value="active" />
                    Active (applied to live quotes)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#1D2939] cursor-pointer">
                    <RadioGroupItem value="inactive" />
                    Inactive (saved for future use)
                  </label>
                </RadioGroup>
              </div>
            </div>

            <div className="bg-[#EBF3FC] border border-[#D2E4F9] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#001A3D]">
              <Info className="size-4 shrink-0 text-[#0267B8] mt-0.5" />
              <p>
                <strong>Admin Markup Limits:</strong> All agent markups must
                adhere to maximum ceiling thresholds set by Aero Wing platform
                administrator.
              </p>
            </div>
          </div>

          <DialogFooter className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#CBD5E1] text-[#1D2939] hover:bg-[#F1F5F9]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loadingText={isEditing ? 'Saving...' : 'Processing...'}
              className="bg-[#001A3D] text-white hover:bg-[#012A5E] font-bold px-5"
            >
              {isEditing ? 'Save Changes' : 'Create Markup Rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

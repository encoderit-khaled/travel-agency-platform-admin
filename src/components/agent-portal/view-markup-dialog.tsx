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
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Badge } from '#/components/ui/badge'
import { Percent, Plus, Trash2 } from 'lucide-react'
import type { SubAgent, SubAgentMarkupRule } from './types'

interface ViewMarkupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subAgent: SubAgent | null
  onSaveMarkup: (subAgentId: string, updatedRules: SubAgentMarkupRule[]) => void
}

export function ViewMarkupDialog({
  open,
  onOpenChange,
  subAgent,
  onSaveMarkup,
}: ViewMarkupDialogProps) {
  const [rules, setRules] = React.useState<SubAgentMarkupRule[]>([])
  const [newService, setNewService] = React.useState('')
  const [newVal, setNewVal] = React.useState('2.5')
  const [showAddForm, setShowAddForm] = React.useState(false)

  React.useEffect(() => {
    if (subAgent) {
      setRules([...subAgent.markupRules])
      setShowAddForm(false)
    }
  }, [subAgent])

  if (!subAgent) return null

  const handleRemove = (index: number) => {
    setRules((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newService.trim()) return

    const newRule: SubAgentMarkupRule = {
      service: newService.trim(),
      type: 'percentage',
      value: parseFloat(newVal) || 2.0,
      description: `${parseFloat(newVal) || 2.0}% markup applied automatically.`,
    }

    setRules((prev) => [...prev, newRule])
    setNewService('')
    setNewVal('2.5')
    setShowAddForm(false)
  }

  const handleSave = () => {
    onSaveMarkup(subAgent.id, rules)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-xl bg-[#FFF9E6] text-[#B45309] flex items-center justify-center mb-1">
              <Percent className="size-5" />
            </div>
            <Badge
              variant="outline"
              className={
                subAgent.markupConfigured
                  ? 'bg-[#EAFBF1] text-[#0B6A45] border-emerald-200 text-xs font-bold'
                  : 'bg-[#F1F3F6] text-[#4F5B70] border-gray-200 text-xs font-bold'
              }
            >
              {subAgent.markupConfigured ? 'Configured' : 'Not Configured'}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
            Markup Rules for {subAgent.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#4F5B70]">
            Define customer markup rates applied on top of net B2B inventory
            fares for bookings created by this desk.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {rules.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-[#DCE2EB] bg-[#F8FAFC] text-center">
              <p className="text-xs font-bold text-[#4F5B70]">
                No specific markup rules configured.
              </p>
              <p className="text-[11px] text-[#8C9BAE] mt-1">
                Bookings will inherit your standard agency master markup.
              </p>
              <Button
                type="button"
                onClick={() => setShowAddForm(true)}
                variant="outline"
                size="sm"
                className="mt-3 text-xs font-bold text-[#0267B8] border-[#0267B8]/30"
              >
                <Plus className="size-3.5 mr-1" /> Add Custom Rule
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {rules.map((rule, idx) => (
                <div
                  key={`${rule.service}-${idx}`}
                  className="p-3.5 rounded-xl border border-[#DCE2EB] bg-white flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#012A5E]">
                        {rule.service}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF9E6] text-[#B45309] text-[11px] font-extrabold">
                        {rule.type === 'percentage'
                          ? `+${rule.value}%`
                          : `+${rule.currency || 'BDT'} ${rule.value}`}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#4F5B70] mt-0.5">
                      {rule.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded-lg text-[#8C9BAE] hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Delete rule"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddForm && (
            <form
              onSubmit={handleAddRule}
              className="p-3.5 rounded-xl border border-[#0267B8]/30 bg-[#F4F8FD] space-y-3"
            >
              <h4 className="text-xs font-extrabold text-[#012A5E]">
                Add New Markup Rule
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-[#4F5B70]">
                    Service Category
                  </Label>
                  <Input
                    placeholder="e.g. Visa Services, Holiday Packages"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="h-9 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-[#4F5B70]">
                    Markup (%)
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                    className="h-9 text-xs bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#0267B8] hover:bg-[#01559A] text-white text-xs font-bold"
                >
                  Save Rule
                </Button>
              </div>
            </form>
          )}

          {!showAddForm && rules.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="text-xs font-bold text-[#0267B8] border-[#DCE2EB] hover:bg-[#F4F6FA]"
            >
              <Plus className="size-3.5 mr-1" /> Add Another Rule
            </Button>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-[#F1F3F6] gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#DCE2EB] text-[#4F5B70]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#0267B8] hover:bg-[#01559A] text-white font-extrabold"
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

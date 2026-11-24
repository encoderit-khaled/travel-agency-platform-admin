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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/components/ui/select'
import { Checkbox } from '#/components/ui/checkbox'
import { UserPlus, Shield, Percent, AlertCircle } from 'lucide-react'
import type { SubAgent } from './types'
import { DEFAULT_PERMISSIONS_TEMPLATE } from './data'

interface AddSubAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSubAgent?: (newSubAgent: SubAgent) => void
  onSubAgentCreated?: (newSubAgent: SubAgent) => void
}

export function AddSubAgentDialog({
  open,
  onOpenChange,
  onAddSubAgent,
  onSubAgentCreated,
}: AddSubAgentDialogProps) {
  const [deskName, setDeskName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [permissionPreset, setPermissionPreset] = React.useState<
    'standard' | 'full' | 'view_only'
  >('standard')
  const [markupRate, setMarkupRate] = React.useState('2.5')
  const [configureMarkupNow, setConfigureMarkupNow] = React.useState(true)
  const [error, setError] = React.useState('')

  const resetForm = () => {
    setDeskName('')
    setEmail('')
    setPhone('')
    setPermissionPreset('standard')
    setMarkupRate('2.5')
    setConfigureMarkupNow(true)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deskName.trim()) {
      setError('Please provide a desk or sub-agent name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid login email address.')
      return
    }

    // derive 2 uppercase initials
    const words = deskName.trim().split(/\s+/)
    let initials = 'SA'
    if (words.length >= 2) {
      initials = (words[0][0] + words[1][0]).toUpperCase()
    } else if (words.length === 1 && words[0].length >= 2) {
      initials = words[0].slice(0, 2).toUpperCase()
    }

    const assignedPermissions = DEFAULT_PERMISSIONS_TEMPLATE.map((p) => {
      if (permissionPreset === 'full') return { ...p, enabled: true }
      if (permissionPreset === 'view_only') {
        return {
          ...p,
          enabled:
            p.id === 'perm-search-flights' || p.id === 'perm-manage-customers',
        }
      }
      // standard
      return {
        ...p,
        enabled: p.id !== 'perm-void-reissue' && p.id !== 'perm-view-wallet',
      }
    })

    const newSubAgent: SubAgent = {
      id: `sa-${Date.now()}`,
      name: deskName.trim(),
      avatarInitials: initials,
      role: 'Sub-agent / Staff',
      email: email.trim(),
      phone: phone.trim() ? phone.trim() : undefined,
      permissionsConfigured: true,
      permissions: assignedPermissions,
      markupConfigured: configureMarkupNow,
      markupRules: configureMarkupNow
        ? [
            {
              service: 'Air Tickets & Flights',
              type: 'percentage',
              value: parseFloat(markupRate) || 2.5,
              description: `${parseFloat(markupRate) || 2.5}% standard markup applied to B2B airfares.`,
            },
          ]
        : [],
      bookingsCount: 0,
      bookings: [],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'Just created',
    }

    if (onAddSubAgent) {
      onAddSubAgent(newSubAgent)
    } else if (onSubAgentCreated) {
      onSubAgentCreated(newSubAgent)
    }
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="size-11 rounded-xl bg-[#F1C134]/15 text-[#012A5E] flex items-center justify-center mb-1">
            <UserPlus className="size-5 text-[#012A5E]" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
            Add New Sub-agent
          </DialogTitle>
          <DialogDescription className="text-xs text-[#4F5B70] leading-relaxed">
            Create an autonomous sub-agent desk under your agency account.
            Sub-agents receive their own dedicated portal login with custom
            permissions and markup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Desk Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="subagent-name"
              className="text-xs font-bold text-[#141C2E]"
            >
              Sub-agent / Desk Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subagent-name"
              placeholder="e.g. Mirpur Branch, Sylhet Sales Desk"
              value={deskName}
              onChange={(e) => {
                setDeskName(e.target.value)
                if (error) setError('')
              }}
              className="h-10 text-sm bg-[#F4F6FA] border-[#DCE2EB] focus-visible:bg-white"
            />
          </div>

          {/* Login Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="subagent-email"
              className="text-xs font-bold text-[#141C2E]"
            >
              Login Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subagent-email"
              type="email"
              placeholder="e.g. mirpur.desk@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              className="h-10 text-sm bg-[#F4F6FA] border-[#DCE2EB] focus-visible:bg-white"
            />
            <p className="text-[11px] text-[#4F5B70]">
              Activation invitation with credentials will be sent to this email
              address.
            </p>
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-1.5">
            <Label
              htmlFor="subagent-phone"
              className="text-xs font-bold text-[#141C2E]"
            >
              Contact Phone (Optional)
            </Label>
            <Input
              id="subagent-phone"
              type="tel"
              placeholder="e.g. +880 1711 000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 text-sm bg-[#F4F6FA] border-[#DCE2EB] focus-visible:bg-white"
            />
          </div>

          {/* Permissions Preset */}
          <div className="space-y-1.5 pt-1">
            <Label
              htmlFor="perm-preset"
              className="text-xs font-bold text-[#141C2E] flex items-center gap-1.5"
            >
              <Shield className="size-3.5 text-[#0267B8]" />
              Initial Permissions Preset
            </Label>
            <Select
              value={permissionPreset}
              onValueChange={(val) => {
                if (val) setPermissionPreset(val)
              }}
            >
              <SelectTrigger
                id="perm-preset"
                className="h-10 text-sm bg-[#F4F6FA] border-[#DCE2EB]"
              >
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  Standard Desk (Search, Book, Issue Tickets, Manage Clients)
                </SelectItem>
                <SelectItem value="full">
                  Full Access (Includes Refunds, Voids, Ledger View)
                </SelectItem>
                <SelectItem value="view_only">
                  Search & Hold Only (Cannot auto-issue tickets)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Markup Configuration Checkbox */}
          <div className="pt-2 border-t border-[#F1F3F6] space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="cfg-markup"
                checked={configureMarkupNow}
                onCheckedChange={(checked) =>
                  setConfigureMarkupNow(Boolean(checked))
                }
              />
              <Label
                htmlFor="cfg-markup"
                className="text-xs font-bold text-[#141C2E] cursor-pointer flex items-center gap-1"
              >
                <Percent className="size-3.5 text-[#B45309]" />
                Configure initial flight markup now
              </Label>
            </div>

            {configureMarkupNow && (
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3">
                <div className="flex-1">
                  <Label
                    htmlFor="markup-val"
                    className="text-[11px] font-bold text-[#4F5B70]"
                  >
                    Airline Ticket Markup (%)
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="markup-val"
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={markupRate}
                      onChange={(e) => setMarkupRate(e.target.value)}
                      className="h-9 pr-8 text-sm font-bold bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#4F5B70]">
                      %
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[#4F5B70] flex-1 pt-4 leading-tight">
                  Automatically added to consumer price quote; difference
                  credited to your agency earnings.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-[#F1F3F6] gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              className="border-[#DCE2EB] text-[#4F5B70]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F1C134] text-[#012A5E] hover:bg-[#E5B52A] font-extrabold shadow-sm"
            >
              Create Sub-agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { Badge } from '#/components/ui/badge'
import { SlidersHorizontal, Check, Eye, Ban } from 'lucide-react'
import type { PermissionStatus } from './types'

interface PermissionConfigItem {
  id: string
  label: string
  category: string
  description: string
}

const ALL_PERMISSION_ITEMS: PermissionConfigItem[] = [
  {
    id: 'search_book',
    label: 'Search & Book Flights',
    category: 'Bookings & Flights',
    description:
      'Search live flights, view schedules, and issue instant tickets.',
  },
  {
    id: 'view_own_bookings',
    label: 'View Own Bookings',
    category: 'Bookings & Flights',
    description: 'Access booking records created under this sub-agent account.',
  },
  {
    id: 'customer_bookings',
    label: 'Customer Passenger Records',
    category: 'Bookings & Flights',
    description: 'Create and manage passenger profiles and loyalty numbers.',
  },
  {
    id: 'pricing_markup',
    label: 'Pricing & Markup View',
    category: 'Pricing',
    description: 'View the final price break-up and applied markups on quotes.',
  },
  {
    id: 'wallet_summary',
    label: 'Wallet Summary & Balance',
    category: 'Finance & Wallet',
    description: 'View available credit line and account deposit balances.',
  },
  {
    id: 'commission_summary',
    label: 'Commission & Earnings Summary',
    category: 'Finance & Wallet',
    description:
      'View commission percentages and aggregated payout statements.',
  },
]

interface SubAgentPermissionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permissions?: Record<string, PermissionStatus>
  subAgentName?: string
  parentAgentName?: string
  initialPreset?: string
  onSave?: (updated: Record<string, PermissionStatus>) => void
}

export function SubAgentPermissionsModal({
  open,
  onOpenChange,
  permissions = {},
  subAgentName: _subAgentName,
  parentAgentName: _parentAgentName,
  initialPreset: _initialPreset,
  onSave,
}: SubAgentPermissionsModalProps) {
  const { isLoading, run } = useActionLoading(open)
  const [localPermissions, setLocalPermissions] =
    React.useState<Record<string, PermissionStatus>>(permissions)

  React.useEffect(() => {
    setLocalPermissions(permissions)
  }, [permissions])

  const handleSetStatus = (id: string, status: PermissionStatus) => {
    setLocalPermissions((prev) => ({
      ...prev,
      [id]: status,
    }))
  }

  const handleApply = () => {
    run(() => {
      onSave?.(localPermissions)
      onOpenChange(false)
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isLoading) return
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl p-6 bg-white border-[#E6EAF0]">
        <DialogHeader className="gap-1.5 pb-3 border-b border-[#E6EAF0]">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
              <SlidersHorizontal className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold text-[#012A5E]">
                Configure Sub-agent Permissions
              </DialogTitle>
              <DialogDescription className="text-xs text-[#4F5B70]">
                Define granular access rights for this sub-agent portal account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-3">
          {ALL_PERMISSION_ITEMS.map((item) => {
            const currentStatus = localPermissions[item.id] ?? 'not_allowed'

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-[#E6EAF0] bg-[#FAFBFD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D0E0F0] transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#141B28]">
                      {item.label}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 bg-white border-[#DCE2EB] text-[#4F5B70]"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#4F5B70] leading-snug">
                    {item.description}
                  </span>
                </div>

                {/* Status selector pills */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DCE2EB] shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleSetStatus(item.id, 'allowed')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'allowed'
                        ? 'bg-[#E6F4EC] text-[#0E7A3E] shadow-2xs'
                        : 'text-[#4F5B70] hover:text-[#141B28] hover:bg-[#F4F6FA]'
                    }`}
                  >
                    <Check className="size-3" />
                    <span>Allowed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetStatus(item.id, 'view_only')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'view_only'
                        ? 'bg-[#EAF4FD] text-[#0267B8] shadow-2xs'
                        : 'text-[#4F5B70] hover:text-[#141B28] hover:bg-[#F4F6FA]'
                    }`}
                  >
                    <Eye className="size-3" />
                    <span>View only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetStatus(item.id, 'not_allowed')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'not_allowed'
                        ? 'bg-[#EEF1F5] text-[#4F5B70] shadow-2xs'
                        : 'text-[#4F5B70] hover:text-[#141B28] hover:bg-[#F4F6FA]'
                    }`}
                  >
                    <Ban className="size-3" />
                    <span>Not allowed</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter className="gap-2 pt-3 border-t border-[#E6EAF0]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-xl border-[#B7C0CF] text-[#4F5B70]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            loading={isLoading}
            loadingText="Saving..."
            className="rounded-xl bg-[#012A5E] text-white hover:bg-[#023E8A] font-bold"
          >
            Apply Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

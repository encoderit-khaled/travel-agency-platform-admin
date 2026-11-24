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
import { Checkbox } from '#/components/ui/checkbox'
import { Badge } from '#/components/ui/badge'
import { ShieldCheck } from 'lucide-react'
import type { SubAgent, SubAgentPermission } from './types'

interface ViewPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subAgent: SubAgent | null
  onSavePermissions: (
    subAgentId: string,
    updatedPermissions: SubAgentPermission[],
  ) => void
}

export function ViewPermissionsDialog({
  open,
  onOpenChange,
  subAgent,
  onSavePermissions,
}: ViewPermissionsDialogProps) {
  const [permissions, setPermissions] = React.useState<SubAgentPermission[]>([])

  React.useEffect(() => {
    if (subAgent) {
      setPermissions([...subAgent.permissions])
    }
  }, [subAgent])

  if (!subAgent) return null

  const handleToggle = (id: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    )
  }

  const handleSave = () => {
    onSavePermissions(subAgent.id, permissions)
    onOpenChange(false)
  }

  const enabledCount = permissions.filter((p) => p.enabled).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center mb-1">
              <ShieldCheck className="size-5" />
            </div>
            <Badge
              variant="outline"
              className={
                subAgent.permissionsConfigured
                  ? 'bg-[#EAFBF1] text-[#0B6A45] border-emerald-200 text-xs font-bold'
                  : 'bg-[#FEF3C7] text-[#9A3412] border-amber-200 text-xs font-bold'
              }
            >
              {subAgent.permissionsConfigured
                ? 'Configured'
                : 'Needs Configuration'}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
            Permissions for {subAgent.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#4F5B70]">
            Configure operational capabilities, booking authority, and
            visibility for this sub-agent desk.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] flex items-center justify-between text-xs font-semibold text-[#141C2E]">
            <span>Active Privileges</span>
            <span className="font-extrabold text-[#0267B8]">
              {enabledCount} of {permissions.length} enabled
            </span>
          </div>

          <div className="space-y-3">
            {permissions.map((perm) => (
              <div
                key={perm.id}
                onClick={() => handleToggle(perm.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  perm.enabled
                    ? 'bg-white border-[#0267B8]/30 shadow-2xs'
                    : 'bg-[#FAFBFD] border-[#E6EAF0] opacity-80'
                }`}
              >
                <Checkbox
                  checked={perm.enabled}
                  onCheckedChange={() => handleToggle(perm.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#012A5E]">
                      {perm.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-wider">
                      {perm.category}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#4F5B70] mt-0.5 leading-relaxed">
                    {perm.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-[#F1F3F6] flex-row items-center justify-between gap-2">
          <a
            href={`/sub-agents/permissions?desk=${encodeURIComponent(subAgent.name)}`}
            className="text-xs font-extrabold text-[#0267B8] hover:underline"
          >
            Open Full Permissions Page →
          </a>
          <div className="flex items-center gap-2">
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
              Save Permissions
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

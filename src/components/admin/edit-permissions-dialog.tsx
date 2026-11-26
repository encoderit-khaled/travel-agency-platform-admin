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
import {
  Shield,
  Sliders,
  Wallet,
  Headphones,
  FileText,
  Check,
  Eye,
  EyeOff,
  HelpCircle,
  RotateCcw,
} from 'lucide-react'
import {
  ADMIN_ROLES,
  CORE_ADMIN_AREAS,
  PLATFORM_MODULE_AREAS,
} from './admin-roles-permissions-data'
import type {
  AdminRoleId,
  PermissionStatus,
  RolePermissionMatrix,
} from './admin-roles-permissions-types'
import { cn } from '#/lib/utils'

interface EditPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRole: AdminRoleId
  matrix: RolePermissionMatrix
  onSave: (updatedMatrix: RolePermissionMatrix) => void
}

export function EditPermissionsDialog({
  open,
  onOpenChange,
  currentRole,
  matrix,
  onSave,
}: EditPermissionsDialogProps) {
  const [selectedRole, setSelectedRole] = React.useState<AdminRoleId>(currentRole)
  const [draftMatrix, setDraftMatrix] = React.useState<RolePermissionMatrix>(matrix)

  // Sync when dialog opens or currentRole changes
  React.useEffect(() => {
    if (open) {
      setSelectedRole(currentRole)
      setDraftMatrix(JSON.parse(JSON.stringify(matrix)))
    }
  }, [open, currentRole, matrix])

  const setStatus = (areaId: string, status: PermissionStatus) => {
    setDraftMatrix((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [areaId]: status,
      },
    }))
  }

  const setAllForRole = (status: PermissionStatus) => {
    setDraftMatrix((prev) => {
      const updatedRolePermissions = { ...prev[selectedRole] }
      for (const key of Object.keys(updatedRolePermissions)) {
        updatedRolePermissions[key] = status
      }
      return {
        ...prev,
        [selectedRole]: updatedRolePermissions,
      }
    })
  }

  const { isLoading, run } = useActionLoading(open)

  const handleSave = () => {
    run(() => {
      onSave(draftMatrix)
      onOpenChange(false)
    })
  }

  const roleRoleObj = ADMIN_ROLES.find((r) => r.id === selectedRole) || ADMIN_ROLES[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-2xl border border-[#DCE2EB] shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-[#EEF1F5] bg-[#F8FAFC]">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0267B8] bg-[#E8F1FB] px-2 py-0.5 rounded-full">
                  Admin Configuration
                </span>
                <span className="text-xs text-[#8C97A8]">M15 Core Admin</span>
              </div>
              <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
                Edit Role Permissions
              </DialogTitle>
              <DialogDescription className="text-xs text-[#4F5B70]">
                Configure navigation visibility and high-level area access for predefined Admin roles.
              </DialogDescription>
            </div>
          </div>

          {/* Role selector tabs */}
          <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1 scrollbar-none">
            {ADMIN_ROLES.map((role) => {
              const isSelected = role.id === selectedRole
              const Icon =
                role.iconName === 'shield'
                  ? Shield
                  : role.iconName === 'sliders'
                    ? Sliders
                    : role.iconName === 'wallet'
                      ? Wallet
                      : role.iconName === 'headphones'
                        ? Headphones
                        : FileText

              return (
                <Button variant="plain"
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0',
                    isSelected
                      ? 'bg-[#012A5E] text-white border-[#012A5E] shadow-sm'
                      : 'bg-white text-[#4F5B70] border-[#DCE2EB] hover:bg-[#EEF2F7] hover:text-[#012A5E]',
                  ))}
                >
                  <Icon className={cn('size-3.5', isSelected ? 'text-white' : 'text-[#8C97A8]')} />
                  <span>{role.name}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] px-1.5 py-0 border-0',
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#EEF1F5] text-[#4F5B70]',
                    )}
                  >
                    {role.userCountLabel}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </DialogHeader>

        {/* Action toolbar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#F1F4F8] border-b border-[#EEF1F5] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#4F5B70] font-medium">Quick batch actions for</span>
            <span className="font-bold text-[#012A5E]">{roleRoleObj.name}:</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAllForRole('visible')}
              className="h-7 text-xs text-[#1F9D61] hover:text-[#1F9D61] hover:bg-[#E8F8F0] border-[#DCE2EB]"
            >
              <Eye className="size-3 mr-1" />
              All Visible
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAllForRole('hidden')}
              className="h-7 text-xs text-[#4F5B70] hover:bg-[#EEF1F5] border-[#DCE2EB]"
            >
              <EyeOff className="size-3 mr-1" />
              All Hidden
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAllForRole('not-configured')}
              className="h-7 text-xs text-[#8C97A8] hover:bg-[#EEF1F5] border-[#DCE2EB]"
            >
              <RotateCcw className="size-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Scrollable areas list */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section: Core Admin */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EEF1F5]">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#4F5B70]">
                Core Admin (5 areas)
              </h4>
              <span className="text-[11px] text-[#8C97A8]">Primary administration controls</span>
            </div>
            <div className="divide-y divide-[#EEF1F5] border border-[#EEF1F5] rounded-xl overflow-hidden bg-white">
              {CORE_ADMIN_AREAS.map((area) => {
                const currentStatus = draftMatrix[selectedRole][area.id] ?? 'not-configured'
                return (
                  <div
                    key={area.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#141B28]">{area.name}</p>
                      <p className="text-[11px] text-[#8C97A8]">Permission area identifier: {area.id}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#EEF2F7] p-1 rounded-xl">
                      <Button variant="plain"
                        type="button"
                        onClick={() => setStatus(area.id, 'visible')}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                          currentStatus === 'visible'
                            ? 'bg-[#1F9D61] text-white shadow-xs'
                            : 'text-[#4F5B70] hover:text-[#141B28]',
                        ))}
                      >
                        <Check className="size-3" />
                        Visible
                      </Button>
                      <Button variant="plain"
                        type="button"
                        onClick={() => setStatus(area.id, 'hidden')}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                          currentStatus === 'hidden'
                            ? 'bg-[#8C97A8] text-white shadow-xs'
                            : 'text-[#4F5B70] hover:text-[#141B28]',
                        ))}
                      >
                        <EyeOff className="size-3" />
                        Hidden
                      </Button>
                      <Button variant="plain"
                        type="button"
                        onClick={() => setStatus(area.id, 'not-configured')}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                          currentStatus === 'not-configured'
                            ? 'bg-white text-[#012A5E] font-bold shadow-xs border border-[#DCE2EB]'
                            : 'text-[#4F5B70] hover:text-[#141B28]',
                        ))}
                      >
                        <HelpCircle className="size-3" />
                        Not Configured
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section: Platform Modules */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EEF1F5]">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#4F5B70]">
                Platform Modules (10 areas)
              </h4>
              <span className="text-[11px] text-[#8C97A8]">Travel platform operating features</span>
            </div>
            <div className="divide-y divide-[#EEF1F5] border border-[#EEF1F5] rounded-xl overflow-hidden bg-white">
              {PLATFORM_MODULE_AREAS.map((area) => {
                const currentStatus = draftMatrix[selectedRole][area.id] ?? 'not-configured'
                return (
                  <div
                    key={area.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#141B28]">{area.name}</p>
                      <p className="text-[11px] text-[#8C97A8]">Permission area identifier: {area.id}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#EEF2F7] p-1 rounded-xl">
                      <Button variant="plain"
                        type="button"
                        onClick={() => setStatus(area.id, 'visible')}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                          currentStatus === 'visible'
                            ? 'bg-[#1F9D61] text-white shadow-xs'
                            : 'text-[#4F5B70] hover:text-[#141B28]',
                        ))}
                      >
                        <Check className="size-3" />
                        Visible
                      </Button>
                      <Button variant="plain"
                        type="button"
                        onClick={() => setStatus(area.id, 'hidden')}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                          currentStatus === 'hidden'
                            ? 'bg-[#8C97A8] text-white shadow-xs'
                            : 'text-[#4F5B70] hover:text-[#141B28]',
                        ))}
                      >
                        <EyeOff className="size-3" />
                        Hidden
                      </Button>
                      <Button variant="plain"
                        type="button"
                        onClick={() => setStatus(area.id, 'not-configured')}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                          currentStatus === 'not-configured'
                            ? 'bg-white text-[#012A5E] font-bold shadow-xs border border-[#DCE2EB]'
                            : 'text-[#4F5B70] hover:text-[#141B28]',
                        ))}
                      >
                        <HelpCircle className="size-3" />
                        Not Configured
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 px-6 border-t border-[#EEF1F5] bg-[#F8FAFC] flex sm:items-center justify-between gap-3">
          <p className="text-xs text-[#5C3B00] bg-[#FFF8E6] px-3 py-1.5 rounded-lg border border-[#F1D98A]">
            Backend authorization rules must also enforce these permission boundaries.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#DCE2EB] text-[#4F5B70] hover:bg-[#EEF2F7]"
            >
              Discard Changes
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              loading={isLoading}
              loadingText="Saving..."
              className="bg-[#012A5E] hover:bg-[#0F3F7D] text-white font-bold px-5"
            >
              Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

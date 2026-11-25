import { Shield, Check, ArrowRight, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,

  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { PREDEFINED_ROLES } from './admin-users-data'

interface RolesOverviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigateToRoles?: () => void
}

export function RolesOverviewDialog({
  open,
  onOpenChange,
  onNavigateToRoles,
}: RolesOverviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white border border-[#DCE2EB] rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#001A3D] bg-linear-to-r from-[#001A3D] via-[#012A5E] to-[#0F3F7D] p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F1C134] border border-white/20">
                <Shield className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Roles & Permissions Overview
                </DialogTitle>
                <DialogDescription className="text-sm text-[#C9D7EA] mt-0.5">
                  5 predefined roles configure administrative scope and actions.
                </DialogDescription>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#F1C134]">
              <Lock className="size-3.5" />
              <span>RBAC Security</span>
            </div>
          </div>
        </div>

        {/* Roles list */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-[#EEF1F5]">
          {PREDEFINED_ROLES.map((role) => (
            <div key={role.name} className="pt-3.5 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-[#012A5E]">
                    {role.name}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${role.badgeColor}`}
                  >
                    {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#4F5B70] leading-relaxed">
                {role.description}
              </p>
              <div className="bg-[#F8FAFC] border border-[#EEF1F5] rounded-xl p-3">
                <span className="text-[11px] font-extrabold text-[#012A5E] uppercase tracking-wider block mb-1.5">
                  Key Capabilities
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-[#4F5B70]">
                  {role.permissions.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="size-3 text-[#0267B8] shrink-0" />
                      <span className="truncate">{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-[#EEF1F5] bg-[#F8FAFC] flex sm:justify-between items-center gap-2 shrink-0">
          <p className="text-xs text-[#8792A4]">
            Role assignments take effect on next user login.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-xl border-[#C5CFDC] text-[#4F5B70] font-bold text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
                if (onNavigateToRoles) {
                  onNavigateToRoles()
                } else {
                  window.location.href = '/roles-access'
                }
              }}
              className="h-10 px-4 rounded-xl bg-[#012A5E] hover:bg-[#02387B] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <span>Manage Role Matrix</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

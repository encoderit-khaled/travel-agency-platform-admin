import * as React from 'react'
import {
  UserCog,
  Mail,
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Check,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { AdminRole, AdminUser } from './admin-users-data'
import { PREDEFINED_ROLES } from './admin-users-data'

interface ManageUserDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateUser: (updated: AdminUser) => void
  onDeleteUser: (userId: string) => void
}

export function ManageUserDialog({
  user,
  open,
  onOpenChange,
  onUpdateUser,
  onDeleteUser,
}: ManageUserDialogProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState<AdminRole>('Operations')
  const [status, setStatus] = React.useState<'active' | 'suspended'>('active')
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
      setStatus(user.status)
      setIsConfirmingDelete(false)
    }
  }, [user])

  if (!user) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateUser({
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      role,
      status,
    })
    onOpenChange(false)
  }

  const handleDelete = () => {
    onDeleteUser(user.id)
    onOpenChange(false)
  }

  const selectedRoleDef = PREDEFINED_ROLES.find((r) => r.name === role)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border border-[#DCE2EB] rounded-2xl shadow-xl">
        {/* Header */}
        <div className="bg-[#001A3D] bg-linear-to-r from-[#001A3D] via-[#012A5E] to-[#0F3F7D] p-6 text-white">
          <div className="flex items-center gap-3.5">
            <div
              className={`size-12 rounded-full flex items-center justify-center text-sm font-bold shadow-md shrink-0 border-2 border-white/30 ${
                user.avatarBg === 'saffron'
                  ? 'bg-[#F1C134] text-[#001A3D]'
                  : 'bg-[#01559A] text-white'
              }`}
            >
              {user.initials}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <span>Manage {user.name}</span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {status}
                </span>
              </DialogTitle>
              <DialogDescription className="text-sm text-[#C9D7EA] mt-0.5">
                Update account details, change role, or deactivate user.
              </DialogDescription>
            </div>
          </div>
        </div>

        {isConfirmingDelete ? (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-red-700">
                <AlertTriangle className="size-5 text-red-600" />
                <span>Confirm Removal of Admin Account</span>
              </div>
              <p className="text-xs text-red-800">
                Are you sure you want to remove <strong>{user.name}</strong> (
                {user.email})? This user will immediately lose access to the
                AeroWing Admin Panel.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConfirmingDelete(false)}
                className="h-10 px-4 rounded-xl border-[#C5CFDC] text-[#4F5B70] font-bold text-xs"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
              >
                Yes, Delete User
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-name"
                className="text-xs font-bold text-[#141B28]"
              >
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 border-[#C5CFDC] rounded-xl focus-visible:border-[#0267B8] text-sm text-[#141B28]"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-email"
                className="text-xs font-bold text-[#141B28]"
              >
                Admin Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8792A4]" />
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 border-[#C5CFDC] rounded-xl focus-visible:border-[#0267B8] text-sm text-[#141B28]"
                  required
                />
              </div>
            </div>

            {/* Role & Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-role"
                  className="text-xs font-bold text-[#141B28]"
                >
                  Assigned Role
                </Label>
                <Select
                  value={role}
                  onValueChange={(val: AdminRole) => setRole(val)}
                >
                  <SelectTrigger
                    id="edit-role"
                    className="h-11 border-[#C5CFDC] rounded-xl text-sm font-medium text-[#141B28]"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="size-4 text-[#0267B8]" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#DCE2EB]">
                    {PREDEFINED_ROLES.map((r) => (
                      <SelectItem
                        key={r.name}
                        value={r.name}
                        className="py-2 cursor-pointer font-medium"
                      >
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-status"
                  className="text-xs font-bold text-[#141B28]"
                >
                  Account Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(val: 'active' | 'suspended') =>
                    setStatus(val)
                  }
                >
                  <SelectTrigger
                    id="edit-status"
                    className="h-11 border-[#C5CFDC] rounded-xl text-sm font-medium text-[#141B28]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#DCE2EB]">
                    <SelectItem
                      value="active"
                      className="py-2 cursor-pointer font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="suspended"
                      className="py-2 cursor-pointer font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>Suspended</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Role Permissions Preview Box */}
            {selectedRoleDef && (
              <div className="p-3 bg-[#EEF2F7] rounded-xl border border-[#DCE2EB] text-xs space-y-1.5">
                <span className="font-bold text-[#012A5E] block">
                  Permissions ({selectedRoleDef.name}):
                </span>
                <ul className="grid grid-cols-1 gap-1 text-[#4F5B70]">
                  {selectedRoleDef.permissions.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="size-3 text-[#0267B8] shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-[#EEF1F5] flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsConfirmingDelete(true)}
                className="h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Trash2 className="size-4" />
                <span>Delete User</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-10 px-4 rounded-xl border-[#C5CFDC] text-[#4F5B70] font-bold text-xs hover:bg-[#EEF2F7]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#012A5E] hover:bg-[#02387B] text-white font-bold text-xs shadow-xs"
                >
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

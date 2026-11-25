import * as React from 'react'
import { UserPlus, Mail, Shield, Check, AlertCircle } from 'lucide-react'
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
import { Checkbox } from '#/components/ui/checkbox'
import type { AdminRole, AdminUser, AvatarColor } from './admin-users-data'
import { PREDEFINED_ROLES } from './admin-users-data'

interface AddAdminUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (user: AdminUser) => void
}

export function AddAdminUserDialog({
  open,
  onOpenChange,
  onAddUser,
}: AddAdminUserDialogProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState<AdminRole>('Operations')
  const [sendInvite, setSendInvite] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const handleReset = () => {
    setName('')
    setEmail('')
    setRole('Operations')
    setSendInvite(true)
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a full name for the admin user.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid business email address.')
      return
    }

    // Generate initials (first letter of first and last word)
    const parts = name.trim().split(/\s+/)
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase()

    // Alternate avatar color
    const avatarBg: AvatarColor = Math.random() > 0.5 ? 'saffron' : 'endeavour'

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      initials,
      email: email.trim().toLowerCase(),
      role,
      avatarBg,
      status: 'active',
      joinedDate: 'Today',
      lastActive: 'Just now',
    }

    onAddUser(newUser)
    handleReset()
    onOpenChange(false)
  }

  const selectedRoleDef = PREDEFINED_ROLES.find((r) => r.name === role)

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleReset()
        onOpenChange(val)
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border border-[#DCE2EB] rounded-2xl shadow-xl">
        {/* Header with decorative badge */}
        <div className="bg-[#001A3D] bg-linear-to-r from-[#001A3D] via-[#012A5E] to-[#0F3F7D] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F1C134] border border-white/20">
              <UserPlus className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Add Admin User
              </DialogTitle>
              <DialogDescription className="text-sm text-[#C9D7EA] mt-0.5">
                Grant dashboard access and assign an administrative role.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-xl bg-red-50 text-red-700 border border-red-200">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="admin-name"
              className="text-xs font-bold text-[#141B28]"
            >
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="admin-name"
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError(null)
              }}
              className="h-11 border-[#C5CFDC] rounded-xl focus-visible:border-[#0267B8] text-sm text-[#141B28]"
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="admin-email"
              className="text-xs font-bold text-[#141B28]"
            >
              Admin Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8792A4]" />
              <Input
                id="admin-email"
                type="email"
                placeholder="name@aerowing.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                className="h-11 pl-10 border-[#C5CFDC] rounded-xl focus-visible:border-[#0267B8] text-sm text-[#141B28]"
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <Label
              htmlFor="admin-role"
              className="text-xs font-bold text-[#141B28]"
            >
              Assigned Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={role}
              onValueChange={(val: AdminRole) => setRole(val)}
            >
              <SelectTrigger
                id="admin-role"
                className="h-11 border-[#C5CFDC] rounded-xl text-sm font-medium text-[#141B28]"
              >
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-[#0267B8]" />
                  <SelectValue placeholder="Select a role" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#DCE2EB]">
                {PREDEFINED_ROLES.map((r) => (
                  <SelectItem
                    key={r.name}
                    value={r.name}
                    className="py-2.5 cursor-pointer rounded-lg font-medium"
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-[#012A5E]">{r.name}</span>
                      <span className="text-xs text-[#4F5B70]">
                        {r.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Role Permissions Preview Box */}
            {selectedRoleDef && (
              <div className="p-3 bg-[#EEF2F7] rounded-xl border border-[#DCE2EB] text-xs space-y-1.5 mt-2">
                <span className="font-bold text-[#012A5E] block">
                  Permissions included in {selectedRoleDef.name}:
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
          </div>

          {/* Send Invite Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id="send-invite"
              checked={sendInvite}
              onCheckedChange={(checked) => setSendInvite(Boolean(checked))}
              className="mt-0.5 rounded border-[#8792A4] data-[state=checked]:bg-[#012A5E] data-[state=checked]:border-[#012A5E]"
            />
            <Label
              htmlFor="send-invite"
              className="text-xs text-[#4F5B70] leading-snug cursor-pointer font-medium"
            >
              Send an email invitation with login instructions and password
              setup link.
            </Label>
          </div>

          <DialogFooter className="pt-4 border-t border-[#EEF1F5] flex sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset()
                onOpenChange(false)
              }}
              className="h-10 px-4 rounded-xl border-[#C5CFDC] text-[#4F5B70] font-bold text-xs hover:bg-[#EEF2F7]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#012A5E] hover:bg-[#02387B] text-white font-bold text-xs shadow-xs"
            >
              Add Admin User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

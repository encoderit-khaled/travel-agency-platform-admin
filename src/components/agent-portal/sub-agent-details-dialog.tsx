import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#/components/ui/tabs'
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Percent,
  Ticket,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { SubAgent } from './types'

interface SubAgentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subAgent: SubAgent | null
  onOpenPermissions: (sa: SubAgent) => void
  onOpenMarkup: (sa: SubAgent) => void
  onOpenBookings: (sa: SubAgent) => void
  onToggleStatus: (sa: SubAgent) => void
}

export function SubAgentDetailsDialog({
  open,
  onOpenChange,
  subAgent,
  onOpenPermissions,
  onOpenMarkup,
  onOpenBookings,
  onToggleStatus,
}: SubAgentDetailsDialogProps) {
  if (!subAgent) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-160 p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-[#012A5E] text-[#F1C134] font-extrabold text-base flex items-center justify-center ring-4 ring-[#EAF4FD]">
                {subAgent.avatarInitials}
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
                  {subAgent.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-[#4F5B70]">
                    {subAgent.role}
                  </span>
                  <span>•</span>
                  <Badge
                    variant="outline"
                    className={
                      subAgent.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold'
                        : 'bg-red-50 text-red-700 border-red-200 text-[10px] font-bold'
                    }
                  >
                    {subAgent.status === 'active' ? 'ACTIVE' : 'SUSPENDED'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Sub-agent desk overview and settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4 bg-[#F4F6FA] p-1 rounded-xl">
            <TabsTrigger value="overview" className="text-xs font-bold">
              Overview
            </TabsTrigger>
            <TabsTrigger value="permissions" className="text-xs font-bold">
              Permissions
            </TabsTrigger>
            <TabsTrigger value="markup" className="text-xs font-bold">
              Markup
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs font-bold">
              Bookings ({subAgent.bookingsCount})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8C9BAE]">
                Contact & Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#4F5B70]">
                  <Mail className="size-4 text-[#0267B8]" />
                  <div>
                    <p className="text-[10px] text-[#8C9BAE] font-bold">
                      Login Email
                    </p>
                    <p className="font-semibold text-[#141C2E]">
                      {subAgent.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#4F5B70]">
                  <Phone className="size-4 text-[#0267B8]" />
                  <div>
                    <p className="text-[10px] text-[#8C9BAE] font-bold">
                      Phone
                    </p>
                    <p className="font-semibold text-[#141C2E]">
                      {subAgent.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#4F5B70]">
                  <Calendar className="size-4 text-[#0267B8]" />
                  <div>
                    <p className="text-[10px] text-[#8C9BAE] font-bold">
                      Created On
                    </p>
                    <p className="font-semibold text-[#141C2E]">
                      {subAgent.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#4F5B70]">
                  <Clock className="size-4 text-[#0267B8]" />
                  <div>
                    <p className="text-[10px] text-[#8C9BAE] font-bold">
                      Last Activity
                    </p>
                    <p className="font-semibold text-[#141C2E]">
                      {subAgent.lastActive || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-[#DCE2EB] bg-white text-center">
                <Shield className="size-4 text-[#0267B8] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#8C9BAE]">
                  Permissions
                </span>
                <p className="text-xs font-extrabold text-[#141C2E] mt-0.5">
                  {subAgent.permissionsConfigured
                    ? 'Configured'
                    : 'Needs Config'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#DCE2EB] bg-white text-center">
                <Percent className="size-4 text-[#B45309] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#8C9BAE]">
                  Markup
                </span>
                <p className="text-xs font-extrabold text-[#141C2E] mt-0.5">
                  {subAgent.markupConfigured ? 'Configured' : 'Needs Config'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#DCE2EB] bg-white text-center">
                <Ticket className="size-4 text-[#0B6A45] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#8C9BAE]">
                  Bookings
                </span>
                <p className="text-xs font-extrabold text-[#141C2E] mt-0.5">
                  {subAgent.bookingsCount} Total
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4F5B70]">
                Granted Privileges
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onOpenPermissions(subAgent)
                }}
                className="text-xs font-extrabold text-[#0267B8] border-[#0267B8]/30"
              >
                Edit Permissions
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subAgent.permissions.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg border border-[#E6EAF0] bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-[#012A5E]">{p.name}</p>
                    <p className="text-[11px] text-[#4F5B70]">
                      {p.description}
                    </p>
                  </div>
                  {p.enabled ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-[10px] text-[#8C9BAE]"
                    >
                      Disabled
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Markup Tab */}
          <TabsContent value="markup" className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4F5B70]">
                Markup Configurations
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onOpenMarkup(subAgent)
                }}
                className="text-xs font-extrabold text-[#0267B8] border-[#0267B8]/30"
              >
                Configure Markup
              </Button>
            </div>

            {subAgent.markupRules.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[#DCE2EB] bg-[#F8FAFC] text-center text-xs text-[#4F5B70]">
                No custom markup rules. Inherits agency standard markup.
              </div>
            ) : (
              <div className="space-y-2">
                {subAgent.markupRules.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-[#E6EAF0] bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#012A5E]">{r.service}</p>
                      <p className="text-[11px] text-[#4F5B70]">
                        {r.description}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#FFF9E6] text-[#B45309] font-extrabold">
                      {r.type === 'percentage'
                        ? `+${r.value}%`
                        : `+${r.currency || 'BDT'} ${r.value}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4F5B70]">
                Bookings created by this desk
              </span>
              {subAgent.bookings.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false)
                    onOpenBookings(subAgent)
                  }}
                  className="text-xs font-extrabold text-[#0267B8]"
                >
                  View in Full Screen
                </Button>
              )}
            </div>

            {subAgent.bookings.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-[#DCE2EB] bg-[#F8FAFC] text-center text-xs text-[#4F5B70]">
                No bookings placed yet.
              </div>
            ) : (
              <div className="space-y-2">
                {subAgent.bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-lg border border-[#E6EAF0] bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#012A5E]">
                          {b.route}
                        </span>
                        <span className="font-mono text-[10px] text-[#4F5B70] bg-[#F1F3F6] px-1 rounded">
                          {b.pnr}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4F5B70] mt-0.5">
                        {b.passenger} • {b.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-[#141C2E]">
                        {b.amount}
                      </p>
                      <Badge className="bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                        {b.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t border-[#F1F3F6] flex flex-col sm:flex-row justify-between items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onToggleStatus(subAgent)}
            className={
              subAgent.status === 'active'
                ? 'text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold'
                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold'
            }
          >
            <AlertOctagon className="size-3.5 mr-1" />
            {subAgent.status === 'active'
              ? 'Suspend Sub-agent'
              : 'Reactivate Sub-agent'}
          </Button>

          <Link
            to="/sub-agents/details"
            search={{ booking: 'AW-DEMO-FL-001' }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#0267B8] hover:bg-[#EAF4FD] transition-colors"
          >
            <span>Full Page Details</span>
            <ExternalLink className="size-3.5" />
          </Link>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-[#012A5E] text-white hover:bg-[#0F3F7D] font-extrabold text-xs"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

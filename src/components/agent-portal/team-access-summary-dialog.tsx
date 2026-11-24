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
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Search,
  ExternalLink,
  ShieldCheck,
  Plane,
  Percent,
  Wallet,
  Settings,
  ArrowRight,
} from 'lucide-react'
import { TEAM_ACCESS_HOLDERS } from './roles-access-data'
import type { TeamAccessHolder } from './roles-access-types'
import { cn } from '#/lib/utils'

interface TeamAccessSummaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfigureDesk?: (deskId: string) => void
}

interface DeskDetailedPrivilege {
  id: string
  name: string
  initials: string
  role: string
  branch: string
  status: 'configured' | 'needs-configuration'
  statusLabel: string
  preset: string
  email: string
  capabilities: {
    searchAndHold: 'allowed' | 'restricted'
    ticketIssuance: 'allowed' | 'restricted'
    passengerProfiles: 'allowed' | 'view_only' | 'restricted'
    markupView: 'allowed' | 'view_only' | 'restricted'
    walletLedger: 'restricted'
    creditRequests: 'restricted'
  }
}

const DESK_DETAILS: DeskDetailedPrivilege[] = [
  {
    id: 'mirpur-desk',
    name: 'Mirpur Desk',
    initials: 'MD',
    role: 'Sub-agent / staff',
    branch: 'Mirpur Branch',
    status: 'configured',
    statusLabel: 'Configured',
    preset: 'Standard Operations',
    email: 'mirpur.desk@skylinetravels.com',
    capabilities: {
      searchAndHold: 'allowed',
      ticketIssuance: 'allowed',
      passengerProfiles: 'allowed',
      markupView: 'view_only',
      walletLedger: 'restricted',
      creditRequests: 'restricted',
    },
  },
  {
    id: 'banani-desk',
    name: 'Banani Desk',
    initials: 'BD',
    role: 'Sub-agent / staff',
    branch: 'Banani Corporate',
    status: 'configured',
    statusLabel: 'Configured',
    preset: 'Full Commercial Staff',
    email: 'banani.desk@skylinetravels.com',
    capabilities: {
      searchAndHold: 'allowed',
      ticketIssuance: 'allowed',
      passengerProfiles: 'allowed',
      markupView: 'allowed',
      walletLedger: 'restricted',
      creditRequests: 'restricted',
    },
  },
  {
    id: 'uttara-desk',
    name: 'Uttara Desk',
    initials: 'UD',
    role: 'Sub-agent / staff',
    branch: 'Uttara Sector 3',
    status: 'configured',
    statusLabel: 'Configured',
    preset: 'Ticketing Staff',
    email: 'uttara.desk@skylinetravels.com',
    capabilities: {
      searchAndHold: 'allowed',
      ticketIssuance: 'allowed',
      passengerProfiles: 'view_only',
      markupView: 'view_only',
      walletLedger: 'restricted',
      creditRequests: 'restricted',
    },
  },
  {
    id: 'gulshan-desk',
    name: 'Gulshan Desk',
    initials: 'GD',
    role: 'Sub-agent / staff',
    branch: 'Gulshan 1 Branch',
    status: 'needs-configuration',
    statusLabel: 'Needs configuration',
    preset: 'Pending Initial Configuration',
    email: 'gulshan.desk@skylinetravels.com',
    capabilities: {
      searchAndHold: 'allowed',
      ticketIssuance: 'restricted',
      passengerProfiles: 'restricted',
      markupView: 'restricted',
      walletLedger: 'restricted',
      creditRequests: 'restricted',
    },
  },
  {
    id: 'dhanmondi-desk',
    name: 'Dhanmondi Desk',
    initials: 'DD',
    role: 'Sub-agent / staff',
    branch: 'Dhanmondi Road 27',
    status: 'needs-configuration',
    statusLabel: 'Needs configuration',
    preset: 'Pending Initial Configuration',
    email: 'dhanmondi.desk@skylinetravels.com',
    capabilities: {
      searchAndHold: 'allowed',
      ticketIssuance: 'restricted',
      passengerProfiles: 'restricted',
      markupView: 'restricted',
      walletLedger: 'restricted',
      creditRequests: 'restricted',
    },
  },
]

export function TeamAccessSummaryDialog({
  open,
  onOpenChange,
  onConfigureDesk,
}: TeamAccessSummaryDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'configured' | 'needs-configuration'
  >('all')

  const filteredDesks = React.useMemo(() => {
    return DESK_DETAILS.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.preset.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const configuredCount = DESK_DETAILS.filter(
    (d) => d.status === 'configured',
  ).length
  const pendingCount = DESK_DETAILS.filter(
    (d) => d.status === 'needs-configuration',
  ).length

  const renderBadge = (level: 'allowed' | 'view_only' | 'restricted') => {
    if (level === 'allowed') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <CheckCircle2 className="size-3 text-emerald-600" />
          Allowed
        </span>
      )
    }
    if (level === 'view_only') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
          View Only
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
        Restricted
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0 border border-slate-200 shadow-2xl rounded-2xl bg-white">
        {/* Header with AeroWing gradient */}
        <div className="bg-gradient-to-r from-[#001A3D] via-[#012A5E] to-[#0A3D78] text-white p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-6 h-6 text-[#F1C134]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Team Access & Privileges Summary
                  </h2>
                  <Badge className="bg-[#F1C134] text-[#001430] hover:bg-[#F1C134]/90 font-bold border-none text-[11px] px-2.5 py-0.5">
                    M2.13 · Team Access
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Overview of delegated sub-agent capabilities, issuance limits,
                  and security boundaries across branch desks of Skyline Demo
                  Travels Ltd.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 block">
                Total Staff Desks
              </span>
              <span className="text-xl font-bold text-white">5 Desks</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 block">
                Fully Configured
              </span>
              <span className="text-xl font-bold text-emerald-400">
                {configuredCount} Desks
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 block">
                Needs Setup
              </span>
              <span className="text-xl font-bold text-amber-300">
                {pendingCount} Desks
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 block">
                Issuance Authority
              </span>
              <span className="text-xl font-bold text-white">3 Desks</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search desks or branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-white border-slate-200"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium mr-1">
              Status:
            </span>
            <Button
              type="button"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={cn(
                'h-8 text-xs rounded-lg cursor-pointer',
                statusFilter === 'all'
                  ? 'bg-[#012A5E] text-white hover:bg-[#0267B8]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
              )}
            >
              All ({DESK_DETAILS.length})
            </Button>
            <Button
              type="button"
              variant={statusFilter === 'configured' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('configured')}
              className={cn(
                'h-8 text-xs rounded-lg cursor-pointer',
                statusFilter === 'configured'
                  ? 'bg-[#012A5E] text-white hover:bg-[#0267B8]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
              )}
            >
              Configured ({configuredCount})
            </Button>
            <Button
              type="button"
              variant={
                statusFilter === 'needs-configuration' ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setStatusFilter('needs-configuration')}
              className={cn(
                'h-8 text-xs rounded-lg cursor-pointer',
                statusFilter === 'needs-configuration'
                  ? 'bg-[#012A5E] text-white hover:bg-[#0267B8]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
              )}
            >
              Needs Setup ({pendingCount})
            </Button>
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-3">
            {filteredDesks.map((desk) => (
              <div
                key={desk.id}
                className="rounded-xl border border-slate-200 bg-white p-4.5 hover:border-[#0267B8]/40 hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-lg bg-[#F4F6FA] text-[#012A5E] text-xs font-extrabold flex items-center justify-center shrink-0 border border-[#DCE2EB]">
                      {desk.initials}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#012A5E]">
                          {desk.name}
                        </h4>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-600">
                          {desk.branch}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {desk.email} · Preset: {desk.preset}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {desk.status === 'configured' ? (
                      <Badge
                        variant="outline"
                        className="bg-[#EAFBF1] text-[#0B6A45] border-emerald-200 text-xs font-semibold"
                      >
                        <CheckCircle2 className="size-3 mr-1 text-emerald-600" />
                        Configured
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-semibold"
                      >
                        <AlertCircle className="size-3 mr-1 text-amber-600" />
                        Needs Configuration
                      </Badge>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (onConfigureDesk) {
                          onConfigureDesk(desk.id)
                        } else {
                          window.location.href = `/sub-agents/permissions?agentId=${desk.id}`
                        }
                      }}
                      className="h-8 text-xs rounded-lg border-[#DCE2EB] text-[#012A5E] hover:bg-[#F4F6FA] font-semibold cursor-pointer"
                    >
                      <span>Configure</span>
                      <ExternalLink className="size-3 ml-1 text-[#0267B8]" />
                    </Button>
                  </div>
                </div>

                {/* Capabilities Grid */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Search & Hold
                    </span>
                    <div className="mt-1">
                      {renderBadge(desk.capabilities.searchAndHold)}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Ticket Issuance
                    </span>
                    <div className="mt-1">
                      {renderBadge(desk.capabilities.ticketIssuance)}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Passengers
                    </span>
                    <div className="mt-1">
                      {renderBadge(desk.capabilities.passengerProfiles)}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Markup View
                    </span>
                    <div className="mt-1">
                      {renderBadge(desk.capabilities.markupView)}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Wallet Top-up
                    </span>
                    <div className="mt-1">
                      {renderBadge(desk.capabilities.walletLedger)}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">
                      Credit Limit
                    </span>
                    <div className="mt-1">
                      {renderBadge(desk.capabilities.creditRequests)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Policy & Enforcement Banner */}
          <div className="rounded-xl bg-[#FFF9EB] border border-[#F3D99D] p-4 text-xs text-[#8B4513] flex items-start gap-3">
            <ShieldAlert className="size-5 text-[#8B4513] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <b className="font-bold block">
                Strict Security Boundaries Enforced
              </b>
              <p className="leading-relaxed">
                Sub-agent desks cannot perform wallet top-ups, submit collateral
                credit line requests, or inspect confidential airline wholesale
                net fares. Any attempt to access restricted endpoints is blocked
                at the API gateway layer regardless of frontend navigation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:justify-between w-full">
          <span className="text-xs text-slate-500">
            Total of {DESK_DETAILS.length} branch desks registered
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-[#DCE2EB] text-[#4F5B70] text-xs font-semibold"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                window.location.href = '/sub-agents'
              }}
              className="rounded-xl bg-[#012A5E] hover:bg-[#0267B8] text-white text-xs font-semibold gap-1.5"
            >
              <span>Sub-agent Management</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

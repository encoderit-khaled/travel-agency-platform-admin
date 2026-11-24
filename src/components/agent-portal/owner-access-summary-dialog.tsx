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
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  Building2,
  Users,
  CreditCard,
  Percent,
  Wallet,
  Coins,
  FileText,
  BarChart3,
  CalendarDays,
  Plane,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react'
import { OWNER_MODULE_ACCESS_ITEMS } from './roles-access-data'
import { cn } from 'cn'

interface OwnerAccessSummaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewTeamAccess?: () => void
}

const MODULE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  'search-book': Plane,
  bookings: CalendarDays,
  customers: Users,
  'sub-agents': Users,
  'pricing-markup': Percent,
  wallet: Wallet,
  credit: CreditCard,
  commissions: Coins,
  statements: FileText,
  reports: BarChart3,
  'roles-access': ShieldCheck,
}

export function OwnerAccessSummaryDialog({
  open,
  onOpenChange,
  onViewTeamAccess,
}: OwnerAccessSummaryDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All')

  const categories = [
    'All',
    'Core Operations',
    'Commercial Management',
    'Financial Control',
    'Agency Governance',
    'Audit & Compliance',
  ]

  const filteredModules = React.useMemo(() => {
    return OWNER_MODULE_ACCESS_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.features.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0 border border-slate-200 shadow-2xl rounded-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001A3D] via-[#012A5E] to-[#0A3D78] text-white p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Agent Owner — Access Summary
                  </h2>
                  <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    Predefined Role
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Unrestricted Master Admin
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mt-1 flex items-center gap-2">
                  <span className="font-semibold text-white">Nusrat Jahan</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-200">
                    Skyline Demo Travels Ltd
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-300">
                    Figma #835:2589
                  </span>
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 absolute right-4 top-4 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
              <span className="text-xs text-slate-300 block">
                Assigned Modules
              </span>
              <span className="text-lg font-bold text-white">
                11 of 11 Enabled
              </span>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
              <span className="text-xs text-slate-300 block">Access Scope</span>
              <span className="text-lg font-bold text-amber-300">
                All Agency Desks
              </span>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
              <span className="text-xs text-slate-300 block">Editability</span>
              <span className="text-lg font-bold text-slate-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Locked / Contractual
              </span>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
              <span className="text-xs text-slate-300 block">
                API Enforcement
              </span>
              <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Verified
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-[#F9FAFC]">
          {/* Immutability Notice Box */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-xs">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="font-semibold block text-sm text-amber-950 mb-0.5">
                Contractual Role Immutability
              </strong>
              The Agent Owner role is automatically granted to the principal
              legal holder of the agency registration. It cannot be altered,
              scoped down, or revoked within the portal. Any ownership changes
              require formal verification via the Aero Wing Admin Panel.
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search modules or permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-white border-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'text-xs px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors',
                    selectedCategory === cat
                      ? 'bg-[#001A3D] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Module List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredModules.map((item) => {
              const Icon = MODULE_ICONS[item.id] ?? ShieldCheck
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001A3D] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#101828] leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 rounded font-semibold shrink-0">
                        {item.accessLevel}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Capabilities Tags */}
                  <div className="pt-2.5 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Granted Capabilities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.features.map((feat, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                No modules match your search filter.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Full audit trails active for Nusrat Jahan (Agent Owner)</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onViewTeamAccess && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onViewTeamAccess()
                }}
                className="text-xs text-[#001A3D] border-slate-300 hover:bg-slate-50"
              >
                View Team Access
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-[#001A3D] text-white hover:bg-[#00285C] text-xs px-5 shadow-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import * as React from 'react'
import {
  Eye,
  ShieldCheck,
  Percent,
  CalendarDays,
  Edit3,
  AlertOctagon,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '#/components/ui/dropdown-menu'
import { cn } from 'cn'
import type { SubAgent } from './types'

interface SubAgentActionDropdownProps {
  subAgent: SubAgent
  onViewDetails: (subAgent: SubAgent) => void
  onConfigurePermissions: (subAgent: SubAgent) => void
  onConfigureMarkup: (subAgent: SubAgent) => void
  onViewBookings: (subAgent: SubAgent) => void
  onEditDetails?: (subAgent: SubAgent) => void
  onDeactivate: (subAgent: SubAgent) => void
  forceOpen?: boolean
  className?: string
}

export function SubAgentActionDropdown({
  subAgent,
  onViewDetails,
  onConfigurePermissions,
  onConfigureMarkup,
  onViewBookings,
  onEditDetails,
  onDeactivate,
  forceOpen = false,
  className,
}: SubAgentActionDropdownProps) {
  const [open, setOpen] = React.useState(forceOpen)

  React.useEffect(() => {
    if (forceOpen) {
      setOpen(true)
    }
  }, [forceOpen])

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          aria-label={`More actions for ${subAgent.name}`}
          className={cn(
            'size-9 rounded-xl border border-[#DCE2EB] bg-white text-[#4F5B70] transition-all duration-150',
            'hover:bg-[#F4F6FA] hover:text-[#012A5E] hover:border-[#0267B8]/40 hover:shadow-xs',
            'focus-visible:ring-2 focus-visible:ring-[#0267B8] focus-visible:outline-none',
            'flex items-center justify-center cursor-pointer',
            open && 'bg-[#F4F6FA] text-[#012A5E] border-[#0267B8]/60 shadow-xs',
          )}
        >
          <MoreHorizontal className="size-4.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 p-1.5 rounded-2xl border border-[#DCE2EB] bg-white shadow-[0_12px_32px_-4px_rgba(1,42,94,0.18)] z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Label */}
          <div className="px-2.5 py-1.5 mb-1 border-b border-[#F1F5F9]">
            <p className="text-[11px] font-extrabold text-[#012A5E] tracking-tight truncate">
              {subAgent.name}
            </p>
            <p className="text-[10px] text-[#4F5B70] font-medium">
              Actions & configuration
            </p>
          </div>

          <DropdownMenuGroup>
            {/* View Full Details */}
            <DropdownMenuItem
              onClick={() => {
                onViewDetails(subAgent)
                setOpen(false)
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-[#012A5E] hover:bg-[#F4F6FA] hover:text-[#0267B8] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center group-hover:bg-[#0267B8] group-hover:text-white transition-colors">
                  <Eye className="size-3.5" />
                </div>
                <span>View Details</span>
              </div>
              <ChevronRight className="size-3.5 text-[#9AA6B9] group-hover:text-[#0267B8] transition-colors" />
            </DropdownMenuItem>

            {/* Configure Permissions */}
            <DropdownMenuItem
              onClick={() => {
                onConfigurePermissions(subAgent)
                setOpen(false)
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-[#012A5E] hover:bg-[#F4F6FA] hover:text-[#0267B8] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center group-hover:bg-[#0267B8] group-hover:text-white transition-colors">
                  <ShieldCheck className="size-3.5" />
                </div>
                <span>Configure Permissions</span>
              </div>
              <span className="text-[10px] font-semibold text-[#8C9BAE]">
                {subAgent.permissionsConfigured ? 'Active' : 'Setup'}
              </span>
            </DropdownMenuItem>

            {/* Configure Markup */}
            <DropdownMenuItem
              onClick={() => {
                onConfigureMarkup(subAgent)
                setOpen(false)
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-[#012A5E] hover:bg-[#F4F6FA] hover:text-[#0267B8] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#FEF6E6] text-[#B45309] flex items-center justify-center group-hover:bg-[#F1C134] group-hover:text-[#012A5E] transition-colors">
                  <Percent className="size-3.5" />
                </div>
                <span>Configure Markup</span>
              </div>
              <span className="text-[10px] font-semibold text-[#8C9BAE]">
                {subAgent.markupConfigured ? 'Set' : 'None'}
              </span>
            </DropdownMenuItem>

            {/* View Bookings */}
            <DropdownMenuItem
              onClick={() => {
                onViewBookings(subAgent)
                setOpen(false)
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-[#012A5E] hover:bg-[#F4F6FA] hover:text-[#0267B8] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#EBFBF3] text-[#137A48] flex items-center justify-center group-hover:bg-[#137A48] group-hover:text-white transition-colors">
                  <CalendarDays className="size-3.5" />
                </div>
                <span>View Bookings</span>
              </div>
              <span className="text-[10px] font-bold text-[#4F5B70] bg-[#F1F5F9] px-1.5 py-0.5 rounded-full">
                {subAgent.bookingsCount}
              </span>
            </DropdownMenuItem>

            {/* Edit Desk Info */}
            <DropdownMenuItem
              onClick={() => {
                onEditDetails?.(subAgent)
                setOpen(false)
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-[#012A5E] hover:bg-[#F4F6FA] hover:text-[#0267B8] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#F4F6FA] text-[#4F5B70] flex items-center justify-center group-hover:bg-[#012A5E] group-hover:text-white transition-colors">
                  <Edit3 className="size-3.5" />
                </div>
                <span>Edit Details</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5 bg-[#E6EAF0]" />

          {/* Destructive Action */}
          <DropdownMenuItem
            onClick={() => {
              onDeactivate(subAgent)
              setOpen(false)
            }}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-[#D9383A] hover:bg-[#FDF2F2] hover:text-[#B91C1C] transition-colors cursor-pointer group"
          >
            <div className="size-7 rounded-lg bg-[#FDF2F2] text-[#D9383A] flex items-center justify-center group-hover:bg-[#D9383A] group-hover:text-white transition-colors">
              <AlertOctagon className="size-3.5" />
            </div>
            <span>
              {subAgent.status === 'suspended'
                ? 'Reactivate Desk'
                : 'Deactivate / Suspend'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

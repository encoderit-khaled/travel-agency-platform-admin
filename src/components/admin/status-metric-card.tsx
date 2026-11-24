import {
  Clock,
  CheckCircle2,
  CircleX as XCircle,
  AlertOctagon,
} from 'lucide-react'
import { Card } from '#/components/ui/card'
import { cn } from 'cn'

export type ApplicationStatus =
  'pending' | 'approved' | 'rejected' | 'suspended'

interface StatusMetricCardProps {
  status: ApplicationStatus
  title: string
  count: number
  isSelected?: boolean
  onClick?: () => void
}

export function StatusMetricCard({
  status,
  title,
  count,
  isSelected,
  onClick,
}: StatusMetricCardProps) {
  const configs: Record<
    ApplicationStatus,
    {
      icon: typeof Clock
      iconBg: string
      iconColor: string
      activeBorder: string
    }
  > = {
    pending: {
      icon: Clock,
      iconBg: 'bg-[#DDE9F8]',
      iconColor: 'text-[#0267B8]',
      activeBorder:
        'border-t-3 border-t-[#0267B8] border-[#0267B8] ring-1 ring-[#0267B8]/20',
    },
    approved: {
      icon: CheckCircle2,
      iconBg: 'bg-[#E8F5E9]',
      iconColor: 'text-[#2E7D32]',
      activeBorder:
        'border-t-3 border-t-[#2E7D32] border-[#2E7D32] ring-1 ring-[#2E7D32]/20',
    },
    rejected: {
      icon: XCircle,
      iconBg: 'bg-[#FCE8E6]',
      iconColor: 'text-[#C62828]',
      activeBorder:
        'border-t-3 border-t-[#C62828] border-[#C62828] ring-1 ring-[#C62828]/20',
    },
    suspended: {
      icon: AlertOctagon,
      iconBg: 'bg-[#FFF8E1]',
      iconColor: 'text-[#F57F17]',
      activeBorder:
        'border-t-3 border-t-[#F57F17] border-[#F57F17] ring-1 ring-[#F57F17]/20',
    },
  }

  const cfg = configs[status]
  const Icon = cfg.icon

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group cursor-pointer p-4 rounded-2xl bg-white border border-[#DCE2EB] transition-all hover:shadow-md select-none relative overflow-hidden',
        isSelected
          ? cn(cfg.activeBorder, 'shadow-xs')
          : 'hover:border-[#C9D7EA]',
      )}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            'size-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
            cfg.iconBg,
            cfg.iconColor,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#4F5B70] tracking-wide truncate">
            {title}
          </span>
          <span className="text-2xl font-extrabold text-[#141C2E] leading-tight">
            {count}
          </span>
        </div>
      </div>
    </Card>
  )
}

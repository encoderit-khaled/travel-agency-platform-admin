import type * as React from 'react'
import { SearchX, X } from 'lucide-react'
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'

export interface ActiveFilter {
  id: string
  label: string
  value: string
  onRemove?: () => void
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  description?: string
  activeFilters?: ActiveFilter[]
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?:
      'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
    className?: string
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?:
      'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
    className?: string
  }
  onClearAll?: () => void
}

export function EmptyState({
  icon,
  title = 'No Data Match',
  description = 'No applications or records match your current filter and search criteria. Try adjusting your query or resetting your filters.',
  activeFilters,
  action,
  secondaryAction,
  onClearAll,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 md:py-20 w-full animate-in fade-in-50 duration-200',
        className,
      )}
      {...props}
    >
      {/* 1. Icon Container */}
      <div className="size-16 sm:size-18 rounded-2xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center ring-8 ring-[#F4F8FD] mb-4 sm:mb-5 shadow-2xs">
        {icon ?? <SearchX className="size-8 sm:size-9" />}
      </div>

      {/* 2. Title & Description */}
      <div className="max-w-lg mx-auto space-y-1.5 px-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#012A5E] tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm sm:text-[15px] text-[#4F5B70] leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      {/* 3. Active Filters Chips */}
      {activeFilters && activeFilters.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-xl">
          <span className="text-xs font-bold text-[#8C9BAE] uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="outline"
              className="bg-[#FAFBFC] border-[#CFD7E3] text-[#012A5E] font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-none"
            >
              <span className="text-[#4F5B70] font-normal">
                {filter.label}:
              </span>
              <span className="font-bold">{filter.value}</span>
              {filter.onRemove && (
                <Button variant="plain"
                  type="button"
                  onClick={filter.onRemove}
                  className="ml-0.5 text-[#8C9BAE] hover:text-[#B71C1C] p-0.5 rounded-full transition-colors cursor-pointer"
                  aria-label={`Remove filter for ${filter.label}`}
                >
                  <X className="size-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* 4. Action Buttons */}
      {(action || secondaryAction || onClearAll) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action ? (
            <Button
              type="button"
              onClick={action.onClick}
              variant={action.variant ?? 'default'}
              className={cn(
                'h-11 px-5 rounded-xl font-bold text-sm shadow-2xs cursor-pointer gap-2',
                action.className,
              )}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ) : onClearAll ? (
            <Button
              type="button"
              onClick={onClearAll}
              className="h-11 px-5 rounded-xl bg-[#F1C134] text-[#012A5E] hover:bg-[#DEAC23] font-bold text-sm shadow-2xs cursor-pointer gap-2"
            >
              <span>Clear All Filters</span>
            </Button>
          ) : null}

          {secondaryAction && (
            <Button
              type="button"
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant ?? 'outline'}
              className={cn(
                'h-11 px-5 rounded-xl border-[#DCE2EB] text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] font-bold text-sm cursor-pointer gap-2',
                secondaryAction.className,
              )}
            >
              {secondaryAction.icon}
              <span>{secondaryAction.label}</span>
            </Button>
          )}
        </div>
      )}

      {/* 5. Custom Children Extension */}
      {children && <div className="mt-6 w-full">{children}</div>}
    </div>
  )
}

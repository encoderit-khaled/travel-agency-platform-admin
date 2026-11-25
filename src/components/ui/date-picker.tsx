import * as React from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Calendar } from './calendar'
import { cn } from 'cn'

export interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
  id?: string
  name?: string
}

function formatDateToYMD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateValue(value?: string): Date | undefined {
  if (!value) return undefined

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (iso) {
    const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
    return Number.isNaN(date.getTime()) ? undefined : date
  }

  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (dmy) {
    const date = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]))
    return Number.isNaN(date.getTime()) ? undefined : date
  }

  return undefined
}

function formatDisplayDate(value?: string): string {
  const date = parseDateValue(value)
  if (!date) return value ?? ''

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  disabled = false,
  clearable = false,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (date: Date) => {
    const ymd = formatDateToYMD(date)
    onChange?.(ymd)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
  }

  const displayText = value ? formatDisplayDate(value) : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          'w-full h-9 sm:h-10 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-[#DCE2EB] bg-white text-[#141B28] flex items-center justify-between shadow-2xs hover:border-[#0267B8] focus:outline-none focus:ring-2 focus:ring-[#0267B8]/20 transition-all text-left cursor-pointer',
          !value && 'text-[#8792A6]',
          disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
          className,
        )}
      >
        <span className="truncate">{displayText}</span>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {clearable && value && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange?.('')
                }
              }}
              className="p-0.5 rounded-full hover:bg-slate-100 text-[#8792A6] hover:text-[#141B28] transition-colors cursor-pointer"
              aria-label="Clear date"
            >
              <X className="size-3.5" />
            </span>
          )}
          <CalendarIcon className="size-4 text-[#8792A6]" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parseDateValue(value)}
          defaultMonth={parseDateValue(value)}
          onSelect={(date) => {
            if (date) handleSelect(date)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

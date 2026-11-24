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

function formatDisplayDate(ymdString?: string): string {
  if (!ymdString) return ''
  const parts = ymdString.split('-')
  if (parts.length !== 3) return ymdString
  const y = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10) - 1
  const d = parseInt(parts[2], 10)
  const date = new Date(y, m, d)
  if (isNaN(date.getTime())) return ymdString

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
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-slate-100 text-[#8792A6] hover:text-[#141B28] transition-colors"
              aria-label="Clear date"
            >
              <X className="size-3.5" />
            </button>
          )}
          <CalendarIcon className="size-4 text-[#8792A6]" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 border-none shadow-2xl bg-transparent"
        align="start"
      >
        <Calendar selected={value} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from 'cn'

export interface CalendarProps {
  className?: string
  selected?: Date | string | null
  onSelect?: (date: Date) => void
  month?: Date
  onMonthChange?: (month: Date) => void
  disabled?: (date: Date) => boolean
  minDate?: Date
  maxDate?: Date
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function parseDate(input?: Date | string | null): Date | null {
  if (!input) return null
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  const parts = input.split('-')
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    const date = new Date(y, m, d)
    return isNaN(date.getTime()) ? null : date
  }
  const date = new Date(input)
  return isNaN(date.getTime()) ? null : date
}

function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function Calendar({
  className,
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  disabled,
  minDate,
  maxDate,
}: CalendarProps) {
  const selectedDate = React.useMemo(() => parseDate(selected), [selected])

  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    if (controlledMonth) return controlledMonth
    if (selectedDate)
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    return new Date()
  })

  React.useEffect(() => {
    if (controlledMonth) {
      setCurrentMonth(controlledMonth)
    } else if (selectedDate) {
      setCurrentMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
      )
    }
  }, [controlledMonth, selectedDate])

  const setMonth = (newMonth: Date) => {
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const prevMonth = () => {
    setMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    )
  }

  const nextMonth = () => {
    setMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    )
  }

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate()

  const firstDayOfWeek = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay()

  const prevMonthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0,
  ).getDate()

  // Generate calendar days
  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = []

  // Preceding days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        prevMonthDays - i,
      ),
      isCurrentMonth: false,
    })
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
      isCurrentMonth: true,
    })
  }

  // Trailing days to fill 6 full rows (42 cells) or minimum 35 cells
  const remainingCells =
    35 - calendarCells.length > 0
      ? 35 - calendarCells.length
      : 42 - calendarCells.length
  for (let day = 1; day <= remainingCells; day++) {
    calendarCells.push({
      date: new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        day,
      ),
      isCurrentMonth: false,
    })
  }

  const today = new Date()

  return (
    <div
      data-slot="calendar"
      className={cn(
        'w-[280px] select-none p-3 bg-white rounded-xl border border-[#DCE2EB] shadow-xs',
        className,
      )}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-[#F1F3F6]">
        <button
          type="button"
          onClick={prevMonth}
          className="size-7 rounded-lg text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="text-xs font-extrabold text-[#012A5E] tracking-tight">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          className="size-7 rounded-lg text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 pt-2 pb-1 text-center">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="text-[11px] font-bold text-[#8792A6] uppercase tracking-wider"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 pt-1 text-center">
        {calendarCells.map(({ date, isCurrentMonth }, idx) => {
          const isSelected = isSameDay(date, selectedDate)
          const isToday = isSameDay(date, today)
          let isDisabled = false

          if (
            minDate &&
            date <
              new Date(
                minDate.getFullYear(),
                minDate.getMonth(),
                minDate.getDate(),
              )
          ) {
            isDisabled = true
          }
          if (
            maxDate &&
            date >
              new Date(
                maxDate.getFullYear(),
                maxDate.getMonth(),
                maxDate.getDate(),
              )
          ) {
            isDisabled = true
          }
          if (disabled?.(date)) {
            isDisabled = true
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onSelect?.(date)
                  if (!isCurrentMonth) {
                    setMonth(new Date(date.getFullYear(), date.getMonth(), 1))
                  }
                }
              }}
              className={cn(
                'size-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all cursor-pointer relative',
                !isCurrentMonth && 'text-[#9AA6B9] opacity-45',
                isCurrentMonth &&
                  !isSelected &&
                  'text-[#141B28] hover:bg-[#EEF1F5]',
                isSelected &&
                  'bg-[#012A5E] text-white font-extrabold shadow-xs hover:bg-[#012248]',
                isToday &&
                  !isSelected &&
                  'text-[#0267B8] font-black underline underline-offset-2',
                isDisabled &&
                  'opacity-25 cursor-not-allowed hover:bg-transparent text-[#9AA6B9]',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

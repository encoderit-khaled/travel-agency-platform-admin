import type * as React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Pencil } from 'lucide-react'
import { cn } from '#/lib/utils'

export interface ReviewField {
  label: string
  value: React.ReactNode
  colSpan?: 1 | 2
}

export interface ReviewCardProps {
  id?: string
  title: string
  icon?: React.ReactNode
  editLabel?: string
  onEdit?: () => void
  fields?: ReviewField[]
  children?: React.ReactNode
  className?: string
}

export function ReviewCard({
  id,
  title,
  icon,
  editLabel,
  onEdit,
  fields,
  children,
  className,
}: ReviewCardProps) {
  return (
    <Card
      id={id}
      className={cn(
        'rounded-[18px] border border-[#DCE2EB] bg-white shadow-xs overflow-hidden gap-0',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-[#E6EAF0]">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#EBF3FC] text-[#0267B8]">
              {icon}
            </div>
          )}
          <CardTitle className="font-heading text-[17px] font-extrabold text-[#012A5E]">
            {title}
          </CardTitle>
        </div>

        {editLabel && onEdit && (
          <CardAction>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-[#0267B8] hover:text-[#012A5E] hover:bg-[#EBF3FC] font-bold text-xs sm:text-sm h-8 px-2.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>{editLabel}</span>
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {fields && fields.length > 0 && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex flex-col gap-1',
                  field.colSpan === 2 && 'sm:col-span-2',
                )}
              >
                <dt className="text-xs font-semibold text-[#4F5B70]">
                  {field.label}
                </dt>
                <dd className="font-bold text-[#141C2E] break-words whitespace-pre-line text-sm leading-relaxed">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

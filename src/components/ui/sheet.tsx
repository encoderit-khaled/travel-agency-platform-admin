import type * as React from 'react'
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { cn } from 'cn'

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

function SheetBackdrop({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-backdrop"
      className={cn(
        'fixed inset-0 z-50 bg-[#012A5E]/40 backdrop-blur-xs transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className,
      )}
      {...props}
    />
  )
}

interface SheetContentProps extends SheetPrimitive.Popup.Props {
  side?: 'top' | 'bottom' | 'left' | 'right'
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: SheetContentProps) {
  const sideClasses = {
    top: 'inset-x-0 top-0 border-b border-[#DCE2EB] data-[ending-style]:-translate-y-full data-[starting-style]:-translate-y-full',
    bottom:
      'inset-x-0 bottom-0 border-t border-[#DCE2EB] data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
    left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm sm:max-w-md border-r border-[#DCE2EB] data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full',
    right:
      'inset-y-0 right-0 h-full w-full sm:max-w-lg md:max-w-[540px] border-l border-[#DCE2EB] data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full',
  }

  return (
    <SheetPortal>
      <SheetBackdrop />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out focus:outline-none overflow-y-auto',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 rounded-lg p-1.5 text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] transition-colors focus:outline-none">
          <XIcon className="size-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 text-left', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-[#E6EAF0] pt-4 mt-auto',
        className,
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'text-xl font-extrabold text-[#012A5E] tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-xs text-[#4F5B70]', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

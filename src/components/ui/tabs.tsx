import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from 'cn'

const Tabs = TabsPrimitive.Root

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex items-center gap-1 border-b border-[#E6EAF0]',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-sm font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 data-selected:border-b-3 data-selected:border-[#F1C134] data-selected:text-[#012A5E] text-[#4F5B70] hover:text-[#012A5E]',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('focus-visible:outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

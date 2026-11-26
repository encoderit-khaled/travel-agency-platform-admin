import { cn } from 'cn'
import { FlightOrbitLoader } from '#/components/ui/flight-orbit-loader'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

function CardGridSkeleton({
  className,
}: {
  count?: number
  className?: string
  cardClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center py-8',
        className?.includes('grid') ? undefined : className,
      )}
    >
      <FlightOrbitLoader />
    </div>
  )
}

function SectionSkeleton({ className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('flex w-full items-center justify-center py-8', className)}>
      <FlightOrbitLoader />
    </div>
  )
}

export { Skeleton, CardGridSkeleton, SectionSkeleton }

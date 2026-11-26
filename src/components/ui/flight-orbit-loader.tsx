import { Plane } from 'lucide-react'
import { cn } from 'cn'

export function FlightOrbitLoader({
  className,
  label = 'Loading',
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'relative inline-flex size-32 items-center justify-center',
        className,
      )}
    >
      <svg viewBox="0 0 120 120" className="size-full" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#6AA6E8"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeDasharray="0.15 7.4"
        />
        <circle
          cx="60"
          cy="60"
          r="34"
          fill="none"
          stroke="#F1C134"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeDasharray="0.15 6.2"
        />
        <circle
          cx="60"
          cy="60"
          r="13"
          fill="none"
          stroke="#F1C134"
          strokeWidth="2.2"
        />
        <circle cx="60" cy="60" r="7.5" fill="#012A5E" />
      </svg>

      <div
        className="absolute inset-0 motion-safe:animate-spin"
        style={{ animationDuration: '3.2s' }}
      >
        {/*
          Sits on the outer ring (r = 50 in a 120 viewBox) and travels
          clockwise, left to right across the top. Lucide's plane points
          up-right; 45deg turns the nose right, the heading at the top.
          The icon rotates with this arm, so the nose stays on the path.
        */}
        <Plane
          className="absolute left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 fill-[#F6C431] text-[#12345C]"
          style={{ top: '8.333%' }}
          strokeWidth={2.2}
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

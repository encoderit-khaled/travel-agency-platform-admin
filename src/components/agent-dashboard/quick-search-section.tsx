import * as React from 'react'
import {
  Compass,
  Plane,
  Building2,
  Palmtree,
  FileCheck,
  Moon,
  ShieldPlus,
  Plus,
  Info,
  Sparkles,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { TRAVEL_SERVICES } from './data'
import type { TravelServiceId } from './types'

interface QuickSearchSectionProps {
  selectedService?: TravelServiceId
  onSelectService?: (id: TravelServiceId) => void
  onStartBooking?: (serviceId: TravelServiceId) => void
}

export function QuickSearchSection({
  selectedService = 'flights',
  onSelectService,
  onStartBooking,
}: QuickSearchSectionProps) {
  const [activeId, setActiveId] =
    React.useState<TravelServiceId>(selectedService)

  const handleSelect = (id: TravelServiceId) => {
    setActiveId(id)
    onSelectService?.(id)
  }

  const getServiceIcon = (id: TravelServiceId) => {
    switch (id) {
      case 'flights':
        return <Plane className="size-5 text-[#F1C134]" />
      case 'hotels':
        return <Building2 className="size-5 text-[#F1C134]" />
      case 'holidays':
        return <Palmtree className="size-5 text-[#F1C134]" />
      case 'visa':
        return <FileCheck className="size-5 text-[#F1C134]" />
      case 'umrah':
        return <Moon className="size-5 text-[#F1C134]" />
      case 'activities':
        return <Compass className="size-5 text-[#F1C134]" />
      case 'insurance':
      default:
        return <ShieldPlus className="size-5 text-[#F1C134]" />
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[20px] p-6 lg:p-7 text-white shadow-[0px_18px_40px_-26px_rgba(0,26,61,0.9)] bg-gradient-to-br from-[#001A3D] via-[#012A5E] to-[#0F3F7D]">
      {/* Radial Blue Glow Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 100% 0%, rgba(10, 118, 204, 0.25) 0%, rgba(10, 118, 204, 0) 55%)',
        }}
      />

      {/* Decorative Golden Outline Ring (Figma ::after #660:5299) */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-[336px] rounded-full border-[38px] border-[#F1C134]/[0.08]" />

      <div className="relative z-10 space-y-5">
        {/* Header Block div.qs-h */}
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-[#CAD5E2] uppercase">
            <Sparkles className="size-3.5 text-[#F1C134]" />
            <span>Book on behalf of a customer</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            Start your first booking
          </h2>

          <p className="text-xs sm:text-sm text-[#CAD5E2] leading-relaxed">
            Search Aero Wing travel services and create a booking for your
            customer.
          </p>
        </div>

        {/* 7 Travel Service Buttons */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {TRAVEL_SERVICES.map((service) => {
              const isSelected = activeId === service.id
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleSelect(service.id)}
                  className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3 sm:py-3.5 transition-all text-center ${
                    isSelected
                      ? 'bg-white/15 border-2 border-[#F1C134] shadow-md scale-[1.02]'
                      : 'bg-white/6 border border-white/15 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-[#F1C134] text-[#001A3D]'
                        : 'bg-[#F1C134]/15'
                    }`}
                  >
                    {isSelected
                      ? React.cloneElement(getServiceIcon(service.id), {
                          className: 'size-5 text-[#001A3D]',
                        })
                      : getServiceIcon(service.id)}
                  </div>

                  <span
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? 'text-[#F1C134]' : 'text-white'
                    }`}
                  >
                    {service.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Bar div.qs-f */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/12">
          <div className="flex items-center gap-2 text-xs text-[#CAD5E2]">
            <Info className="size-4 shrink-0 text-[#CAD5E2]" />
            <span>
              Choose a service, or start a new booking and choose it on the next
              screen.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={() => onStartBooking?.(activeId)}
              className="h-11 px-5 rounded-[10px] bg-[#F1C134] hover:bg-[#F3C94D] text-[#001A3D] font-extrabold text-xs shadow-md active:scale-95 transition-all gap-2"
            >
              <Plus className="size-4 stroke-[3]" />
              <span>Start New Booking</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

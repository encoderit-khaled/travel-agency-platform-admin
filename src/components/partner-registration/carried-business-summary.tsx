import { Building2, Check, Pencil } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import type { BusinessInformationData } from './types'

export interface CarriedBusinessSummaryProps {
  data?: Partial<BusinessInformationData>
  onEdit?: () => void
}

export function CarriedBusinessSummary({
  data,
  onEdit,
}: CarriedBusinessSummaryProps) {
  const legalName = data?.legalBusinessName || 'Skyline Demo Travels Ltd'
  const businessType =
    data?.businessType === 'travel_agency'
      ? 'Travel agency'
      : data?.businessType === 'private_limited'
        ? 'Private Limited Company'
        : data?.businessType === 'partnership'
          ? 'Partnership'
          : data?.businessType === 'sole_proprietorship'
            ? 'Sole Proprietorship'
            : data?.businessType || 'Travel agency'
  const country =
    data?.country === 'BD' ? 'Bangladesh' : data?.country || 'Bangladesh'
  const city = data?.city || 'Dhaka'

  return (
    <div className="w-full rounded-[16px] border border-[#DCE2EB] bg-linear-to-b from-[#F8FAFD] to-white shadow-xs overflow-hidden">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6EAF0] px-4.5 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <Building2 className="size-4 text-[#0267B8]" />
          <h3 className="text-sm font-bold text-[#012A5E]">
            Business information
          </h3>
          <Badge
            variant="outline"
            className="flex items-center gap-1 rounded-full border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#059669]"
          >
            <Check className="size-3 stroke-3" />
            <span>Completed</span>
          </Badge>
        </div>

        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 gap-1.5 px-2.5 text-xs font-bold text-[#0267B8] hover:bg-[#EBF3FC] hover:text-[#012A5E]"
          >
            <Pencil className="size-3.5" />
            <span>Edit Business Information</span>
          </Button>
        )}
      </div>

      {/* Grid of Carried Details */}
      <dl className="grid grid-cols-2 gap-y-3 gap-x-4 px-4.5 py-3.5 sm:grid-cols-4 sm:px-5">
        <div className="flex flex-col gap-0.5">
          <dt className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
            Legal Business Name
          </dt>
          <dd className="text-xs sm:text-sm font-bold text-[#141C2E] line-clamp-1">
            {legalName}
          </dd>
        </div>

        <div className="flex flex-col gap-0.5">
          <dt className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
            Business Type
          </dt>
          <dd className="text-xs sm:text-sm font-bold text-[#141C2E]">
            {businessType}
          </dd>
        </div>

        <div className="flex flex-col gap-0.5">
          <dt className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
            Country
          </dt>
          <dd className="text-xs sm:text-sm font-bold text-[#141C2E]">
            {country}
          </dd>
        </div>

        <div className="flex flex-col gap-0.5">
          <dt className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
            City
          </dt>
          <dd className="text-xs sm:text-sm font-bold text-[#141C2E]">
            {city}
          </dd>
        </div>
      </dl>
    </div>
  )
}

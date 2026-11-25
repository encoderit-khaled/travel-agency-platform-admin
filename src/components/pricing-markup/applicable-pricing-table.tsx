import * as React from 'react'
import {
  ShieldCheck,
  Lock,
  Tag,
  Eye,
  CheckCircle2,
  Info,
  Plane,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { DataTable } from '#/components/ui/data-table'
import { Button } from '#/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminPricingRule } from './types'

interface ApplicablePricingTableProps {
  rules: AdminPricingRule[]
  onViewDetails: (rule: AdminPricingRule) => void
}

export function ApplicablePricingTable({
  rules,
  onViewDetails,
}: ApplicablePricingTableProps) {
  const columns = React.useMemo<ColumnDef<AdminPricingRule>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Rule',
        cell: ({ row }) => {
          const rule = row.original
          return (
            <div className="flex flex-col">
              <span
                className="font-bold text-[#0267B8] group-hover:underline cursor-pointer"
                onClick={() => onViewDetails(rule)}
              >
                {rule.name}
              </span>
              <small className="mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#0267B8] border border-blue-200">
                  <ShieldCheck className="size-3" />
                  Admin
                </span>
              </small>
            </div>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        accessorKey: 'scope',
        header: 'Scope',
        cell: ({ row }) => row.original.scope,
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4 text-xs font-medium text-[#475467]',
        },
      },
      {
        accessorKey: 'service',
        header: 'Service',
        cell: ({ row }) => {
          const rule = row.original
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D2939]">
              {rule.service === 'Hotel' ? (
                <Building2 className="size-3.5 text-[#0267B8]" />
              ) : rule.service === 'Flight' ? (
                <Plane className="size-3.5 text-[#0267B8]" />
              ) : (
                <Layers className="size-3.5 text-[#0267B8]" />
              )}
              {rule.service}
            </span>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier',
        cell: ({ row }) => row.original.supplier,
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4 text-xs text-[#64748B]',
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => row.original.type,
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4 text-xs font-medium text-[#1D2939]',
        },
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: ({ row }) => (
          <span className="font-extrabold text-[#001A3D] text-sm">
            {row.original.value}
          </span>
        ),
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        accessorKey: 'appliedTo',
        header: 'Applied To',
        cell: ({ row }) => row.original.appliedTo,
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4 text-xs text-[#475467] font-medium',
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: () => (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ECFDF3] text-[#12B76A] border border-[#A6F4C5]">
            <CheckCircle2 className="size-3" />
            Active
          </span>
        ),
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold',
          cellClassName: 'py-3.5 px-4',
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const rule = row.original
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(rule)}
              className="h-8 px-2.5 text-xs font-bold text-[#001A3D] border-[#CBD5E1] hover:bg-[#EFF6FF] hover:text-[#0267B8]"
            >
              <Eye className="size-3.5 mr-1" />
              View Details
            </Button>
          )
        },
        meta: {
          headerClassName: 'py-3.5 px-4 font-bold text-right',
          cellClassName: 'py-3.5 px-4 text-right',
        },
      },
    ],
    [onViewDetails],
  )

  return (
    <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="size-9 rounded-xl bg-blue-50 text-[#0267B8] flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="size-4.5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#001A3D] tracking-tight">
              Your Applicable Pricing
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              These pricing settings are configured by Aero Wing Admin and
              cannot be edited here.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-[#F8FAFC] text-[#475467] border-[#E2E8F0] text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5"
          >
            <Lock className="size-3 text-[#64748B]" />
            Read-only
          </Badge>
          <Badge
            variant="outline"
            className="bg-[#EFF6FF] text-[#0267B8] border-blue-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5"
          >
            <Sparkles className="size-3 text-[#0267B8]" />
            Sample data
          </Badge>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <DataTable
          data={rules}
          columns={columns}
          getRowId={(row) => row.id}
          tableClassName="w-full text-left text-sm border-collapse"
          headerRowClassName="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider hover:bg-[#F8FAFC]"
          headClassName="h-auto"
          bodyClassName="divide-y divide-[#E2E8F0]"
          rowClassName="hover:bg-[#F8FAFC]/80 transition-colors group"
          empty="No applicable admin pricing rules found matching filters."
          emptyCellClassName="py-8 text-center text-xs text-[#64748B]"
        />
      </div>

      {/* Footer Note */}
      <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B]">
        <Info className="size-4 shrink-0 text-[#64748B]" />
        <span>
          Admin pricing is shown for reference only. Values are fictional sample
          data, not contractual pricing.
        </span>
      </div>
    </section>
  )
}

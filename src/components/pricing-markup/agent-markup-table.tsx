import * as React from 'react'
import {
  Percent,
  Plus,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  CheckCircle2,
  XCircle,
  Info,
  Plane,
  Building2,
  Luggage,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import type { AgentMarkupRule } from './types'

interface AgentMarkupTableProps {
  rules: AgentMarkupRule[]
  onAddRule: () => void
  onEditRule: (rule: AgentMarkupRule) => void
  onToggleStatus: (rule: AgentMarkupRule) => void
  onDeleteRule: (rule: AgentMarkupRule) => void
  onViewDetails: (rule: AgentMarkupRule) => void
}

export function AgentMarkupTable({
  rules,
  onAddRule,
  onEditRule,
  onToggleStatus,
  onDeleteRule,
  onViewDetails,
}: AgentMarkupTableProps) {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="size-9 rounded-xl bg-amber-50 text-[#CA8A04] flex items-center justify-center shrink-0 mt-0.5">
            <Percent className="size-4.5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#001A3D] tracking-tight">
              Your Markup Rules
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Add your own markup when quoting customers, within limits
              configured by Admin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-[#EFF6FF] text-[#0267B8] border-blue-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5"
          >
            <Sparkles className="size-3 text-[#0267B8]" />
            Sample data
          </Badge>
          <Button
            type="button"
            onClick={onAddRule}
            className="h-9 px-3.5 bg-[#001A3D] hover:bg-[#012A5E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="size-4" />
            Add Markup Rule
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="py-3.5 px-4 font-bold">Rule</th>
              <th className="py-3.5 px-4 font-bold">Scope</th>
              <th className="py-3.5 px-4 font-bold">Service</th>
              <th className="py-3.5 px-4 font-bold">Supplier</th>
              <th className="py-3.5 px-4 font-bold">Type</th>
              <th className="py-3.5 px-4 font-bold">Markup</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {rules.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-xs text-[#64748B]"
                >
                  No agent markup rules found matching filters. Click "Add
                  Markup Rule" to create one.
                </td>
              </tr>
            ) : (
              rules.map((rule) => {
                const isActive = rule.status === 'active'
                return (
                  <tr
                    key={rule.id}
                    className="hover:bg-[#F8FAFC]/80 transition-colors group"
                  >
                    {/* Rule Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span
                          className="font-bold text-[#0267B8] group-hover:underline cursor-pointer"
                          onClick={() => onViewDetails(rule)}
                        >
                          {rule.name}
                        </span>
                        <small className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-emerald-200">
                            <Percent className="size-2.5" />
                            Agent
                          </span>
                        </small>
                      </div>
                    </td>

                    {/* Scope */}
                    <td className="py-3.5 px-4 text-xs font-medium text-[#475467]">
                      {rule.scope}
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D2939]">
                        {rule.service === 'Flight' ? (
                          <Plane className="size-3.5 text-[#0267B8]" />
                        ) : rule.service === 'Hotel' ? (
                          <Building2 className="size-3.5 text-[#0267B8]" />
                        ) : rule.service === 'Travel Package' ? (
                          <Luggage className="size-3.5 text-[#0267B8]" />
                        ) : (
                          <Layers className="size-3.5 text-[#0267B8]" />
                        )}
                        {rule.service}
                      </span>
                    </td>

                    {/* Supplier */}
                    <td className="py-3.5 px-4 text-xs text-[#64748B]">
                      {rule.supplier}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 text-xs font-medium text-[#1D2939]">
                      {rule.type}
                    </td>

                    {/* Markup Value */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-[#001A3D] text-sm">
                        {rule.value}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ECFDF3] text-[#12B76A] border border-[#A6F4C5]">
                          <CheckCircle2 className="size-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F2F4F7] text-[#667085] border border-[#D0D5DD]">
                          <XCircle className="size-3" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRule(rule)}
                          className="h-8 px-2 text-xs font-semibold text-[#001A3D] hover:bg-[#F1F5F9]"
                          title="Edit markup parameters"
                        >
                          <Edit2 className="size-3.5 mr-1 text-[#0267B8]" />
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(rule)}
                          className={`h-8 px-2 text-xs font-semibold ${
                            isActive
                              ? 'text-[#B45309] hover:bg-amber-50'
                              : 'text-[#059669] hover:bg-emerald-50'
                          }`}
                          title={isActive ? 'Disable rule' : 'Enable rule'}
                        >
                          {isActive ? (
                            <>
                              <PowerOff className="size-3.5 mr-1 text-[#D97706]" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Power className="size-3.5 mr-1 text-[#10B981]" />
                              Enable
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteRule(rule)}
                          className="h-8 px-2 text-xs font-semibold text-[#D92D20] hover:bg-red-50"
                          title="Remove markup rule"
                        >
                          <Trash2 className="size-3.5 mr-1 text-[#D92D20]" />
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B]">
        <Info className="size-4 shrink-0 text-[#64748B]" />
        <span>
          Changes apply according to the platform’s pricing rules when future
          pricing is calculated.
        </span>
      </div>
    </section>
  )
}

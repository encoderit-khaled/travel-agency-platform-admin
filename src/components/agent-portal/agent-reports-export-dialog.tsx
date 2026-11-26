import * as React from 'react'
import {
  ArrowDownToLine,
  Download,
  Loader2,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Check,
} from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Checkbox } from '#/components/ui/checkbox'
import type {
  SalesTransactionRow,
  ServiceSalesBreakdown,
} from './agent-reports-types'

interface AgentReportsExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTab: string
  transactions: SalesTransactionRow[]
  services: ServiceSalesBreakdown[]
  period: string
}

interface ExportFormValues {
  format: 'csv' | 'pdf'
  includeSummary: boolean
  includeBreakdown: boolean
  includeTransactions: boolean
}

export function AgentReportsExportDialog({
  open,
  onOpenChange,
  currentTab,
  transactions,
  services,
  period,
}: AgentReportsExportDialogProps) {
  const [downloading, setDownloading] = React.useState(false)
  const [downloadSuccess, setDownloadSuccess] = React.useState(false)

  // TanStack Form instance
  const form = useForm<ExportFormValues>({
    defaultValues: {
      format: 'csv',
      includeSummary: true,
      includeBreakdown: true,
      includeTransactions: true,
    },
    onSubmit: async ({ value }) => {
      setDownloading(true)

      // Build CSV content
      const lines: string[] = []
      lines.push('AEROWING B2B AGENT PORTAL - AGENT REPORTS EXPORT')
      lines.push('Agency: Skyline Demo Travels Ltd')
      lines.push(`Period: ${period}`)
      lines.push(`Report Module: ${currentTab.toUpperCase()}`)
      lines.push(`Generated: ${new Date().toISOString()}`)
      lines.push('')

      if (value.includeSummary) {
        lines.push('--- FINANCIAL & SALES SUMMARY ---')
        lines.push(
          'Gross Sales (BDT),Net Payable (BDT),Agent Margin / Commission (BDT),Bookings Count,Avg Order Value (BDT)',
        )
        lines.push('1485600,1382200,103400,12,123800')
        lines.push('')
      }

      if (value.includeBreakdown) {
        lines.push('--- SERVICE BREAKDOWN ---')
        lines.push(
          'Service,Bookings,Gross Sales (BDT),Net Payable (BDT),Commission (BDT),Share (%)',
        )
        services.forEach((s) => {
          lines.push(
            `"${s.service}",${s.bookings},${s.grossSales},${s.netPayable},${s.agentCommission},${s.sharePercent}%`,
          )
        })
        lines.push('')
      }

      if (value.includeTransactions) {
        lines.push('--- DETAILED TRANSACTIONS ---')
        lines.push(
          'Invoice #,Booking Ref,Date & Time,Service,Customer Name,Pax,Agent / Branch,Payment Method,Gross Amount (BDT),Markup / Comm (BDT),Net Payable (BDT),Status',
        )
        transactions.forEach((tx) => {
          lines.push(
            `"${tx.invoiceNumber}","${tx.bookingReference}","${tx.dateTime}","${tx.service}","${tx.customerName}",${tx.paxCount},"${tx.createdBy}","${tx.paymentMethod}",${tx.grossAmount},${tx.agentMarkup},${tx.netPayable},"${tx.status}"`,
          )
        })
      }

      const csvContent = lines.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const cleanDate = new Date().toISOString().split('T')[0]
      link.href = url
      link.download = `Skyline-Demo-Travels-Agent-Reports-${currentTab}-${cleanDate}.${value.format === 'csv' ? 'csv' : 'pdf'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setTimeout(() => {
        setDownloading(false)
        setDownloadSuccess(true)
        setTimeout(() => {
          setDownloadSuccess(false)
          onOpenChange(false)
        }, 1500)
      }, 600)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-[#E4E7EC] shadow-2xl rounded-2xl p-6">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#DEE8F5] flex items-center justify-center text-[#0267B8]">
              <ArrowDownToLine className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#001A3D]">
                Export Agent Report
              </DialogTitle>
              <DialogDescription className="text-xs text-[#667085]">
                Export data for Skyline Demo Travels Ltd ({period})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4 py-2"
        >
          {/* Format selection using form.Field */}
          <form.Field
            name="format"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#344054]">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="plain"
                    type="button"
                    onClick={() => field.handleChange('csv')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      field.state.value === 'csv'
                        ? 'border-[#0267B8] bg-[#F5F8FC] text-[#0267B8] shadow-xs'
                        : 'border-[#E4E7EC] hover:bg-slate-50 text-[#344054]'
                    }`}
                  >
                    <FileSpreadsheet className="size-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-none">
                        CSV / Excel
                      </div>
                      <div className="text-[11px] text-[#667085] mt-1">
                        Raw table data
                      </div>
                    </div>
                    {field.state.value === 'csv' && (
                      <Check className="size-4 text-[#0267B8]" />
                    )}
                  </Button>

                  <Button variant="plain"
                    type="button"
                    onClick={() => field.handleChange('pdf')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      field.state.value === 'pdf'
                        ? 'border-[#0267B8] bg-[#F5F8FC] text-[#0267B8] shadow-xs'
                        : 'border-[#E4E7EC] hover:bg-slate-50 text-[#344054]'
                    }`}
                  >
                    <FileText className="size-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-none">
                        PDF Document
                      </div>
                      <div className="text-[11px] text-[#667085] mt-1">
                        Formatted layout
                      </div>
                    </div>
                    {field.state.value === 'pdf' && (
                      <Check className="size-4 text-[#0267B8]" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          />

          {/* Sections to include using form.Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#344054]">
              Include Sections
            </label>
            <div className="bg-[#F8F9FB] rounded-xl p-3 border border-[#E4E7EC] space-y-2.5">
              <form.Field
                name="includeSummary"
                children={(field) => (
                  <label className="flex items-center gap-2.5 text-xs text-[#344054] cursor-pointer">
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(c) => field.handleChange(Boolean(c))}
                    />
                    <span>Overview & KPI Highlights</span>
                  </label>
                )}
              />
              <form.Field
                name="includeBreakdown"
                children={(field) => (
                  <label className="flex items-center gap-2.5 text-xs text-[#344054] cursor-pointer">
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(c) => field.handleChange(Boolean(c))}
                    />
                    <span>Service & Sub-agent Breakdown</span>
                  </label>
                )}
              />
              <form.Field
                name="includeTransactions"
                children={(field) => (
                  <label className="flex items-center gap-2.5 text-xs text-[#344054] cursor-pointer">
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(c) => field.handleChange(Boolean(c))}
                    />
                    <span>Full Itemized Transaction Rows (12 rows)</span>
                  </label>
                )}
              />
            </div>
          </div>

          <div className="rounded-lg bg-[#EBF7EF] border border-[#C5E9D5] p-2.5 text-[11px] text-[#0E6A3D] flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-white/80 border-[#C5E9D5] text-[#0E6A3D] text-[10px] px-1.5 py-0"
            >
              Sample Data
            </Badge>
            <span>Contains verified data from 01 Oct 2026 to 16 Nov 2026.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-[#D0D5DD] text-[#344054] hover:bg-slate-50 text-xs px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={downloading}
              className="rounded-xl bg-[#F79009] hover:bg-[#DC6803] text-[#001A3D] font-bold text-xs px-5 shadow-sm transition-all"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="size-4 mr-1.5 text-[#001A3D]" />
                  Downloaded!
                </>
              ) : downloading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Preparing Export...
                </>
              ) : (
                <>
                  <Download className="size-4 mr-1.5" />
                  Export {form.getFieldValue('format').toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

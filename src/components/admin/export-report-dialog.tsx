import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Download,
  Loader2,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react'
import type { BookingRecordItem } from './admin-reports-bookings-types'

interface ExportReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: BookingRecordItem[]
  reportName?: string
  dateFrom?: string
  dateTo?: string
}

export function ExportReportDialog({
  open,
  onOpenChange,
  records,
  reportName = 'Admin Reports - Bookings',
  dateFrom = '01/09/2026',
  dateTo = '30/09/2026',
}: ExportReportDialogProps) {
  const [format, setFormat] = React.useState<'csv' | 'json'>('csv')
  const [isExporting, setIsExporting] = React.useState(false)
  const [isExported, setIsExported] = React.useState(false)

  const handleDownload = () => {
    setIsExporting(true)
    setTimeout(() => {
      if (format === 'csv') {
        const headers = [
          'Booking Reference',
          'Date',
          'Customer Name',
          'Customer Email',
          'Customer Phone',
          'Service',
          'Supplier',
          'Channel',
          'Amount USD',
          'Status',
          'PNR',
          'Payment Method',
        ]

        const rows = records.map((r) => [
          `"${r.bookingRef}"`,
          `"${r.dateTimeFormatted}"`,
          `"${r.customerName}"`,
          `"${r.customerEmail}"`,
          `"${r.customerPhone}"`,
          `"${r.service}"`,
          `"${r.supplier}"`,
          `"${r.channel}"`,
          r.amount.toFixed(2),
          `"${r.status}"`,
          `"${r.pnr}"`,
          `"${r.paymentMethod}"`,
        ])

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join(
          '\n',
        )

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute(
          'download',
          `aerowing-bookings-report-${new Date().toISOString().slice(0, 10)}.csv`,
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const blob = new Blob([JSON.stringify(records, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute(
          'download',
          `aerowing-bookings-report-${new Date().toISOString().slice(0, 10)}.json`,
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setIsExporting(false)
      setIsExported(true)
      setTimeout(() => {
        setIsExported(false)
        onOpenChange(false)
      }, 1500)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white border border-[#DCE2EB] rounded-2xl shadow-xl space-y-5">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="size-11 rounded-xl bg-[#EBF2FA] text-[#012A5E] flex items-center justify-center mb-2">
            <FileSpreadsheet className="size-5.5 text-[#0267B8]" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-[#012A5E]">
            Export {reportName}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#4F5B70]">
            Download filtered report rows for reconciliation and external
            accounting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Summary Box */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Dataset rows</span>
              <span className="font-bold text-[#012A5E]">
                {records.length} records
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Period</span>
              <span className="font-bold text-[#012A5E]">
                {dateFrom} – {dateTo}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Calculated gross value</span>
              <span className="font-bold text-[#012A5E]">
                $
                {records
                  .reduce((sum, r) => sum + r.amount, 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Format selection */}
          <div className="space-y-2">
            <label className="font-bold text-[#012A5E] block">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="plain"
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  format === 'csv'
                    ? 'border-[#0267B8] bg-[#EBF2FA] text-[#012A5E] font-bold'
                    : 'border-[#DCE2EB] hover:bg-[#F4F6FA] text-[#4F5B70]'
                }`)}
              >
                <div className="font-bold">CSV (.csv)</div>
                <div className="text-[11px] text-[#64748B]">
                  Standard spreadsheet
                </div>
              </Button>

              <Button variant="plain"
                type="button"
                onClick={() => setFormat('json')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  format === 'json'
                    ? 'border-[#0267B8] bg-[#EBF2FA] text-[#012A5E] font-bold'
                    : 'border-[#DCE2EB] hover:bg-[#F4F6FA] text-[#4F5B70]'
                }`)}
              >
                <div className="font-bold">JSON (.json)</div>
                <div className="text-[11px] text-[#64748B]">
                  Developer & API export
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEF1F5]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-xl border-[#DCE2EB] text-[#4F5B70]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="text-xs bg-[#012A5E] hover:bg-[#001D42] text-white rounded-xl gap-2 font-bold cursor-pointer"
          >
            {isExported ? (
              <>
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                Downloaded!
              </>
            ) : isExporting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                Download {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

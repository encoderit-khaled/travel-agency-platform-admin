import * as React from 'react'
import {
  ArrowDownToLine,
  Download,
  Loader2,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Printer,
  Eye,
  Calendar,
  Check,
} from 'lucide-react'
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
import { Label } from '#/components/ui/label'
import type {
  StatementSummaryData,
  StatementBooking,
  StatementWalletTransaction,
  StatementCommission,
} from './agent-statements-types'
import {
  generateStatementCSV,
  generateStatementHTMLDocument,
} from './agent-statements-data'

interface AgentStatementsExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: StatementSummaryData
  bookings?: StatementBooking[]
  walletTx?: StatementWalletTransaction[]
  commissions?: StatementCommission[]
  initialFormat?: 'csv' | 'pdf'
}

const BADGES = [
  'Statement Period',
  'Bookings',
  'Wallet',
  'Credit',
  'Commissions',
  'Closing Balance',
]

export function AgentStatementsExportDialog({
  open,
  onOpenChange,
  summary,
  bookings = [],
  walletTx = [],
  commissions = [],
  initialFormat = 'pdf',
}: AgentStatementsExportDialogProps) {
  const [format, setFormat] = React.useState<'csv' | 'pdf'>(initialFormat)
  const [downloading, setDownloading] = React.useState(false)
  const [downloadSuccess, setDownloadSuccess] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)

  // Section inclusion options for PDF & CSV
  const [includeBookings, setIncludeBookings] = React.useState(true)
  const [includeWallet, setIncludeWallet] = React.useState(true)
  const [includeCredit, setIncludeCredit] = React.useState(true)
  const [includeCommissions, setIncludeCommissions] = React.useState(true)
  const [includeClosing, setIncludeClosing] = React.useState(true)

  React.useEffect(() => {
    setFormat(initialFormat)
  }, [initialFormat])

  const csvContent = React.useMemo(() => {
    return generateStatementCSV(
      summary,
      includeBookings ? bookings : [],
      includeWallet ? walletTx : [],
      includeCommissions ? commissions : [],
    )
  }, [
    summary,
    bookings,
    walletTx,
    commissions,
    includeBookings,
    includeWallet,
    includeCommissions,
  ])

  const htmlContent = React.useMemo(() => {
    return generateStatementHTMLDocument(
      summary,
      bookings,
      walletTx,
      commissions,
      {
        includeBookings,
        includeWallet,
        includeCredit,
        includeCommissions,
        includeClosing,
      },
    )
  }, [
    summary,
    bookings,
    walletTx,
    commissions,
    includeBookings,
    includeWallet,
    includeCredit,
    includeCommissions,
    includeClosing,
  ])

  const fileName =
    format === 'pdf'
      ? 'Skyline-Demo-Travels-Agent-Statement-2026-10-01-to-2026-11-16-Sample.html'
      : 'Skyline-Demo-Travels-Agent-Statement-2026-10-01-to-2026-11-16-Sample.csv'

  const handleDownload = () => {
    setDownloading(true)

    if (format === 'csv') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
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
        }, 1200)
      }, 450)
    } else {
      // PDF mode: Download self-contained printable HTML document & prompt print
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
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
        }, 1200)
      }, 450)
    }
  }

  const handleDirectPrint = () => {
    // Open printable document in a new window for immediate printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 300)
    } else {
      window.print()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-170 w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-[#DCE2EB] overflow-hidden">
        {downloadSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="size-7" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-[#001A3D]">
              Download Complete
            </DialogTitle>
            <DialogDescription className="text-sm text-[#5A6578]">
              {fileName} has been prepared and downloaded successfully.
            </DialogDescription>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Format toggle pills & Header icon */}
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center shadow-xs">
                {format === 'pdf' ? (
                  <FileText className="size-6 text-[#0267B8]" />
                ) : (
                  <ArrowDownToLine className="size-6 text-[#0267B8]" />
                )}
              </div>

              {/* Format selection switch */}
              <div className="flex items-center p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                <Button variant="plain"
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    format === 'pdf'
                      ? 'bg-white text-[#012A5E] shadow-xs'
                      : 'text-[#64748B] hover:text-[#012A5E]'
                  }`)}
                >
                  <FileText className="size-3.5" />
                  <span>Download PDF</span>
                </Button>
                <Button variant="plain"
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    format === 'csv'
                      ? 'bg-white text-[#012A5E] shadow-xs'
                      : 'text-[#64748B] hover:text-[#012A5E]'
                  }`)}
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Download CSV</span>
                </Button>
              </div>
            </div>

            {/* Header info */}
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl font-bold text-[#0F172A] tracking-tight">
                  {format === 'pdf' ? 'Download PDF' : 'Download CSV'}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className="bg-[#EBF3FC] text-[#0267B8] border-[#C6DDF7] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md"
                >
                  {format === 'pdf' ? 'Figma #749:10388' : 'Figma #749:10386'}
                </Badge>
              </div>
              <DialogDescription className="text-sm text-[#475569] leading-relaxed">
                Agent statement for {summary.formattedPeriod} · 12 bookings, 10
                wallet transactions, credit usage, 5 commission records and the
                closing balance.
              </DialogDescription>
            </DialogHeader>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {BADGES.map((badge) => (
                <Badge
                  key={badge}
                  variant="outline"
                  className="bg-[#F1F5F9] text-[#1E293B] border-[#E2E8F0] text-[11px] font-semibold py-0.5 px-2.5 rounded-md shadow-2xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Inclusions selector */}
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#012A5E]">
                <span>Include in Statement:</span>
                <span className="text-[11px] font-medium text-[#64748B]">
                  {summary.agentName}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includeBookings}
                    onCheckedChange={(c) => setIncludeBookings(Boolean(c))}
                  />
                  <Label className="text-xs text-[#1E293B] cursor-pointer">
                    Bookings (12)
                  </Label>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includeWallet}
                    onCheckedChange={(c) => setIncludeWallet(Boolean(c))}
                  />
                  <Label className="text-xs text-[#1E293B] cursor-pointer">
                    Wallet Ledger (10)
                  </Label>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includeCredit}
                    onCheckedChange={(c) => setIncludeCredit(Boolean(c))}
                  />
                  <Label className="text-xs text-[#1E293B] cursor-pointer">
                    Credit Usage
                  </Label>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includeCommissions}
                    onCheckedChange={(c) => setIncludeCommissions(Boolean(c))}
                  />
                  <Label className="text-xs text-[#1E293B] cursor-pointer">
                    Commissions (5)
                  </Label>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includeClosing}
                    onCheckedChange={(c) => setIncludeClosing(Boolean(c))}
                  />
                  <Label className="text-xs text-[#1E293B] cursor-pointer">
                    Closing Balance
                  </Label>
                </label>
              </div>
            </div>

            {format === 'pdf' ? (
              /* PDF Specific Content */
              <div className="space-y-3">
                {/* Paper Preview Toggle */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#64748B]">
                    Document Format: Official Letterhead (A4 Printable)
                  </span>
                  <Button variant="plain"
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-1 text-[#0267B8] font-bold hover:underline"
                  >
                    <Eye className="size-3.5" />
                    <span>
                      {showPreview ? 'Hide Preview' : 'Preview Paper Document'}
                    </span>
                  </Button>
                </div>

                {showPreview ? (
                  <div className="rounded-xl border border-[#CBD5E1] p-4 bg-white max-h-56 overflow-y-auto shadow-inner text-xs space-y-3">
                    <div className="p-3 bg-[#012A5E] text-white rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-extrabold text-sm">
                          AeroWing Agent Statement
                        </div>
                        <div className="text-[10px] text-[#C9D7EA]">
                          {summary.agentName} · {summary.formattedPeriod}
                        </div>
                      </div>
                      <div className="text-right text-[10px]">
                        <span className="bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                          M2.10
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px]">
                      <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                        <div className="text-[#64748B]">Bookings</div>
                        <div className="font-bold text-[#012A5E]">
                          12 in period
                        </div>
                      </div>
                      <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                        <div className="text-[#64748B]">Wallet</div>
                        <div className="font-bold text-[#012A5E]">
                          10 in period
                        </div>
                      </div>
                      <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                        <div className="text-[#64748B]">Commissions</div>
                        <div className="font-bold text-[#012A5E]">
                          5 in period
                        </div>
                      </div>
                      <div className="p-2 bg-[#FEF9E7] rounded border border-[#F1C134]">
                        <div className="text-[#8F6B00]">Closing</div>
                        <div className="font-bold text-[#141B28]">
                          Available
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#64748B] italic">
                      Includes official headers, itemized tabular records, and
                      watermark verification for offline archival or auditing.
                    </p>
                  </div>
                ) : (
                  /* PDF Layout summary box */
                  <div className="rounded-xl bg-[#F8FAFC] p-4 border border-[#E2E8F0] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[#012A5E] font-bold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-4 text-[#0267B8]" />
                        <span>Statement Period: {summary.formattedPeriod}</span>
                      </div>
                      <Badge className="bg-[#E6F4EC] text-[#0E6A3D] border-[#C5E9D5] text-[10px]">
                        Print-Ready
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Generates high-resolution vector printable statement with
                      formal agency headers, itemized booking ledger, wallet
                      adjustments, commission records, and closing balance.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* CSV Preview Box matching Figma dark terminal style */
              <div className="rounded-xl bg-[#0B1528] p-4 text-[11px] font-mono text-[#7DD3FC] overflow-x-auto max-h-52 border border-[#1E293B] select-all leading-relaxed shadow-inner">
                <pre className="whitespace-pre font-mono">{csvContent}</pre>
              </div>
            )}

            {/* File info note */}
            <p className="text-xs text-[#64748B] pt-0.5">
              File:{' '}
              <span className="font-semibold text-[#0F172A]">{fileName}</span> ·
              generated in the browser from the selected period (prototype). No
              card, payment or internal data is included.
            </p>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#E6EAF0] flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-slate-50 font-bold text-xs px-5 py-2.5 h-10 cursor-pointer shadow-2xs"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                {format === 'pdf' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDirectPrint}
                    className="rounded-xl border-[#012A5E] text-[#012A5E] hover:bg-[#EAF4FD] font-bold text-xs px-4 py-2.5 h-10 flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Printer className="size-4 text-[#012A5E]" />
                    <span>Print</span>
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="rounded-xl bg-[#F5B800] hover:bg-[#E5AC00] text-[#001A3D] font-bold text-xs px-6 py-2.5 h-10 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  {downloading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  <span>
                    {downloading
                      ? 'Preparing...'
                      : format === 'pdf'
                        ? 'Download PDF'
                        : 'Download CSV'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

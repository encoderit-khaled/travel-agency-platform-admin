import * as React from 'react'
import { ArrowDownToLine, Download, CheckCircle2, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { WalletTransaction } from './wallet-ledger-types'
import { generateLedgerCSV } from './wallet-ledger-data'

interface WalletLedgerExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: WalletTransaction[]
  agencyName?: string
}

const EXPORT_COLUMNS = [
  'Date / Time',
  'Type',
  'Description',
  'Reference',
  'Direction',
  'Amount',
  'Running Balance',
]

export function WalletLedgerExportDialog({
  open,
  onOpenChange,
  transactions,
  agencyName = 'Skyline-Demo-Travels',
}: WalletLedgerExportDialogProps) {
  const [downloading, setDownloading] = React.useState(false)
  const [downloadSuccess, setDownloadSuccess] = React.useState(false)

  const csvContent = React.useMemo(() => {
    return generateLedgerCSV(transactions)
  }, [transactions])

  const fileName = `${agencyName.replace(/\s+/g, '-')}-Wallet-Ledger-Sample.csv`

  const handleDownload = () => {
    setDownloading(true)
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
      }, 1000)
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-155 w-full p-6 sm:p-7 rounded-2xl bg-white shadow-2xl border border-[#DCE2EB] overflow-hidden">
        {downloadSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="size-7" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-[#001A3D]">
              Export Completed
            </DialogTitle>
            <DialogDescription className="text-sm text-[#5A6578]">
              {fileName} has been downloaded successfully.
            </DialogDescription>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Download Icon */}
            <div className="size-12 rounded-xl bg-[#E8F1FC] text-[#0267B8] flex items-center justify-center shadow-xs">
              <ArrowDownToLine className="size-6" />
            </div>

            {/* Header info */}
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-2xl font-black text-[#001A3D] tracking-tight">
                Export current view
              </DialogTitle>
              <DialogDescription className="text-sm text-[#5A6578]">
                {transactions.length} transactions from the current ledger ·
                sample data.
              </DialogDescription>
            </DialogHeader>

            {/* Exported Column Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {EXPORT_COLUMNS.map((col) => (
                <Badge
                  key={col}
                  variant="outline"
                  className="bg-[#F1F5F9] text-[#001A3D] border-[#E2E8F0] text-[11px] font-semibold py-0.5 px-2.5 rounded-md"
                >
                  {col}
                </Badge>
              ))}
            </div>

            {/* Non-exported warning text */}
            <p className="text-xs text-[#5A6578]">
              Not exported: payment, card, processor or bank identifiers and
              internal data.
            </p>

            {/* Monospace CSV Preview Box matching Figma dark terminal style */}
            <div className="rounded-xl bg-[#001A3D] p-4 text-[11px] font-mono text-[#DCE2EB] overflow-x-auto max-h-48 border border-[#012A5E] select-all leading-relaxed shadow-inner">
              <pre className="whitespace-pre">{csvContent}</pre>
            </div>

            {/* File format & prototype disclaimer */}
            <div className="space-y-0.5 text-xs text-[#5A6578] pt-0.5">
              <p>
                Prototype format: CSV · File:{' '}
                <span className="font-bold text-[#001A3D]">{fileName}</span>.
              </p>
              <p>M2.6 requires export but does not prescribe a format.</p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-2 border-t border-[#E6EAF0] flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border-[#DCE2EB] bg-white text-[#001A3D] hover:bg-[#F8FAFC] font-bold text-xs px-5 py-2.5 h-10 cursor-pointer shadow-2xs"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="rounded-xl bg-[#F5B800] hover:bg-[#E5AC00] text-[#001A3D] font-bold text-xs px-5 py-2.5 h-10 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                {downloading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                <span>{downloading ? 'Downloading...' : 'Download CSV'}</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

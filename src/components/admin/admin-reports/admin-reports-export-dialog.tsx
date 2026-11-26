import * as React from 'react'
import {
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Badge } from '#/components/ui/badge'

export interface AdminReportsExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportTitle?: string
  totalRows?: number
  currentFilters?: {
    period: string
    service: string
    supplier: string
    channel: string
  }
}

export function AdminReportsExportDialog({
  open,
  onOpenChange,
  reportTitle = 'Commissions Report',
  totalRows = 15,
  currentFilters,
}: AdminReportsExportDialogProps) {
  const [format, setFormat] = React.useState<'csv' | 'pdf' | 'xlsx'>('csv')
  const [isExporting, setIsExporting] = React.useState(false)
  const [exportSuccess, setExportSuccess] = React.useState(false)

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExportSuccess(true)
      setTimeout(() => {
        setExportSuccess(false)
        onOpenChange(false)
      }, 1000)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-[#001A3D]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-[#EBF3FF] flex items-center justify-center text-[#0265FF]">
              <Download className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#001A3D]">
                Export Report
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5D6B82]">
                Download currently filtered report data
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Report Meta Info */}
          <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#5D6B82]">Target:</span>
              <span className="font-semibold text-[#001A3D]">
                {reportTitle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5D6B82]">Matched Records:</span>
              <Badge
                variant="outline"
                className="bg-white border-[#CBD5E1] text-[#001A3D] font-bold"
              >
                {totalRows} rows
              </Badge>
            </div>
            {currentFilters && (
              <div className="pt-2 border-t border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#5D6B82]">Period:</span>
                  <span className="font-medium text-[#001A3D]">
                    {currentFilters.period}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5D6B82]">Filters:</span>
                  <span className="text-right text-[#001A3D] truncate max-w-50">
                    {currentFilters.service} · {currentFilters.channel}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[#001A3D]">
              File Format
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="plain"
                type="button"
                onClick={() => setFormat('csv')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                  format === 'csv'
                    ? 'border-[#0265FF] bg-[#EBF3FF] text-[#0265FF] shadow-xs'
                    : 'border-[#E2E8F0] hover:bg-slate-50 text-[#5D6B82]'
                }`)}
              >
                <FileSpreadsheet className="size-5" />
                <span>CSV File</span>
              </Button>
              <Button variant="plain"
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                  format === 'xlsx'
                    ? 'border-[#0265FF] bg-[#EBF3FF] text-[#0265FF] shadow-xs'
                    : 'border-[#E2E8F0] hover:bg-slate-50 text-[#5D6B82]'
                }`)}
              >
                <FileSpreadsheet className="size-5" />
                <span>Excel (.xlsx)</span>
              </Button>
              <Button variant="plain"
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                  format === 'pdf'
                    ? 'border-[#0265FF] bg-[#EBF3FF] text-[#0265FF] shadow-xs'
                    : 'border-[#E2E8F0] hover:bg-slate-50 text-[#5D6B82]'
                }`)}
              >
                <FileText className="size-5" />
                <span>PDF Document</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#CBD5E1] text-[#5D6B82] hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting || exportSuccess}
            className="bg-[#001A3D] hover:bg-[#012A5E] text-white font-semibold flex items-center gap-2"
          >
            {exportSuccess ? (
              <>
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>Downloaded!</span>
              </>
            ) : isExporting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="size-4" />
                <span>Download {format.toUpperCase()}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

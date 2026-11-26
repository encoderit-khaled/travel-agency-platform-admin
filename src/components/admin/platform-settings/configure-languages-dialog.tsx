import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import { Input } from '#/components/ui/input'
import { Globe, Plus, Trash2 } from 'lucide-react'
import type { LanguageItem } from './types'

export interface ConfigureLanguagesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialLanguages: LanguageItem[]
  onSave: (languages: LanguageItem[]) => void
}

export function ConfigureLanguagesDialog({
  open,
  onOpenChange,
  initialLanguages,
  onSave,
}: ConfigureLanguagesDialogProps) {
  const [rows, setRows] = React.useState<LanguageItem[]>(initialLanguages)

  React.useEffect(() => {
    if (open) {
      if (initialLanguages.length > 0) {
        setRows(initialLanguages.map((l) => ({ ...l })))
      } else {
        setRows([{ id: `lang-${Date.now()}`, name: '', isNew: true }])
      }
    }
  }, [open, initialLanguages])

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { id: `lang-${Date.now()}-${prev.length}`, name: '', isNew: true },
    ])
  }

  const handleRemoveRow = (id: string) => {
    setRows((prev) => {
      const filtered = prev.filter((r) => r.id !== id)
      if (filtered.length === 0) {
        return [{ id: `lang-${Date.now()}`, name: '', isNew: true }]
      }
      return filtered
    })
  }

  const handleUpdateName = (id: string, name: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name } : r)),
    )
  }

  const { isLoading, run } = useActionLoading(open)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const valid = rows
      .map((r) => ({ ...r, name: r.name.trim() }))
      .filter((r) => r.name.length > 0)
    run(() => {
      onSave(valid)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140 p-0 overflow-hidden rounded-[20px] border border-[#DCE2EB] bg-white shadow-xl">
        <form onSubmit={handleSave} className="flex flex-col">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-[#DCE2EB] bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#EBF3FC] flex items-center justify-center text-[#0052CC] shrink-0">
                <Globe className="size-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <DialogTitle className="text-lg font-bold text-[#001A3D]">
                  Configure Languages
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B]">
                  Manage the supported languages across the Aero Wing platform.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Globe className="size-4 text-[#0052CC]" />
                  </div>
                  <Input
                    value={row.name}
                    onChange={(e) => handleUpdateName(row.id, e.target.value)}
                    placeholder="Language Name (e.g. English, French)"
                    className="h-9 rounded-lg bg-white border-[#CBD5E1] text-sm"
                    autoFocus={idx === rows.length - 1}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRow(row.id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 rounded-lg shrink-0"
                    title="Remove row"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRow}
              className="rounded-xl border-dashed border-slate-300 text-xs font-bold text-[#001A3D] hover:bg-slate-50 w-full py-2.5"
            >
              <Plus className="size-3.5 mr-1 text-[#0052CC]" />
              Add Another Language
            </Button>
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 px-6 border-t border-[#DCE2EB] bg-[#F8FAFC] flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-[#CBD5E1] text-xs sm:text-sm font-bold text-[#001A3D]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loadingText="Saving..."
              className="rounded-xl bg-[#001A3D] hover:bg-[#001430] text-white text-xs sm:text-sm font-bold"
            >
              Save Languages
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

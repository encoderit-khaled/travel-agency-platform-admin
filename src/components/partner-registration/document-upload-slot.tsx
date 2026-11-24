import * as React from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { UploadCloud, FileText, Check, Trash2, RefreshCw } from 'lucide-react'
import type { UploadedFileItem } from './types'

export interface DocumentUploadSlotProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  isOptional?: boolean
  acceptedFormats?: string
  maxSizeBytes?: number
  file: UploadedFileItem | null
  onFileSelect: (file: UploadedFileItem | null) => void
  allowCustomTitle?: boolean
  customTitle?: string
  onCustomTitleChange?: (title: string) => void
}

export function DocumentUploadSlot({
  id,
  title,
  description,
  icon,
  isOptional = true,
  acceptedFormats = 'PDF, PNG, JPG up to 10MB',
  maxSizeBytes = 10 * 1024 * 1024,
  file,
  onFileSelect,
  allowCustomTitle = false,
  customTitle = '',
  onCustomTitleChange,
}: DocumentUploadSlotProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const selectedFile = files[0]

    // Validate file size
    if (selectedFile.size > maxSizeBytes) {
      setErrorMessage(
        `File exceeds the 10MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB).`,
      )
      return
    }

    setErrorMessage(null)
    const newFileItem: UploadedFileItem = {
      id: `${id}-${Date.now()}`,
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      uploadedAt: new Date(),
      customTitle: customTitle,
    }
    onFileSelect(newFileItem)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number | string): string => {
    const num = typeof bytes === 'string' ? parseFloat(bytes) || 0 : bytes
    if (num < 1024) return `${num} B`
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(0)} KB`
    return `${(num / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full rounded-[16px] border border-[#DCE2EB] bg-white p-4 sm:p-5 shadow-xs flex flex-col gap-3">
      {/* Slot Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EBF3FC] text-[#0267B8]">
            {icon}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4 id={`sl-${id}`} className="text-sm font-bold text-[#141C2E]">
                {title}
              </h4>
              {isOptional && (
                <Badge
                  variant="outline"
                  className="rounded-full border-[#DCE2EB] bg-[#F1F5F9] px-2 py-0 text-[10.5px] font-semibold text-[#64748B]"
                >
                  Optional
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[#64748B] leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Optional custom document title input (e.g. for "Other Supporting Document") */}
      {allowCustomTitle && onCustomTitleChange && (
        <div className="mt-1">
          <Input
            placeholder="e.g. Bank statement, IATA certificate, Tax clearance"
            value={customTitle}
            onChange={(e) => onCustomTitleChange(e.target.value)}
            className="h-9 text-xs rounded-[10px] border-[#DCE2EB]"
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id={`file-${id}`}
        aria-labelledby={`sl-${id}`}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* Dropzone or Uploaded File Card */}
      {!file ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Upload ${title}`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col sm:flex-row items-center justify-between gap-3.5 rounded-[14px] border border-dashed p-4 sm:p-4.5 transition-all cursor-pointer ${
            isDragging
              ? 'border-[#0267B8] bg-[#EBF3FC]'
              : 'border-[#93C5FD] bg-[#F8FAFD] hover:bg-[#F0F7FF]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-white border border-[#DCE2EB] shadow-xs text-[#0267B8]">
              <UploadCloud className="size-6" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-bold text-[#012A5E]">
                Drag and drop your documents here
              </span>
              <span className="text-xs text-[#64748B]">
                Or browse files from your device.
              </span>
              <span className="text-[11px] text-[#94A3B8] mt-0.5">
                {acceptedFormats}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 shrink-0 rounded-[10px] border-[#012A5E] text-[#012A5E] hover:bg-[#012A5E] hover:text-white font-bold text-xs px-4"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            Browse files
          </Button>
        </div>
      ) : (
        /* Uploaded State */
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-[14px] border border-[#A7F3D0] bg-[#ECFDF5]/60 p-3.5 sm:p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#10B981]/15 text-[#059669]">
              <FileText className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#141C2E] truncate max-w-[260px] sm:max-w-[340px]">
                  {file.name}
                </span>
                <Badge
                  variant="outline"
                  className="rounded-full border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0 text-[10.5px] font-bold text-[#059669]"
                >
                  <Check className="size-3 stroke-3" />
                  Uploaded
                </Badge>
              </div>
              <span className="text-[11.5px] text-[#64748B]">
                {typeof file.size === 'number'
                  ? formatFileSize(file.size)
                  : file.size}{' '}
                • Ready to submit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1 rounded-[8px] border-[#DCE2EB] bg-white text-[#4F5B70] hover:text-[#012A5E] text-xs font-semibold"
            >
              <RefreshCw className="size-3" />
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="xs"
              onClick={() => onFileSelect(null)}
              className="h-8 gap-1 rounded-[8px] text-xs font-semibold"
            >
              <Trash2 className="size-3" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Error message if validation failed */}
      {errorMessage && (
        <p className="text-xs text-[#DC2626] font-medium mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

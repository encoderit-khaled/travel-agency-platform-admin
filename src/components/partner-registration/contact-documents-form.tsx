import * as React from 'react'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import { useActionLoading } from '#/hooks/use-action-loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CloudCheck,
  Info,
  FolderOpen,
  Briefcase,
  FileCheck2,
  Award,
  FileSpreadsheet,
} from 'lucide-react'
import { CarriedBusinessSummary } from './carried-business-summary'
import { DocumentUploadSlot } from './document-upload-slot'
import type {
  BusinessInformationData,
  ContactDocumentsData,
  UploadedFileItem,
} from './types'

export interface ContactDocumentsFormProps {
  carriedBusinessData?: Partial<BusinessInformationData>
  initialValues?: Partial<ContactDocumentsData>
  onSubmit?: (data: ContactDocumentsData) => void
  onBack?: () => void
  isLoading?: boolean
}

const COUNTRY_DIAL_CODES = [
  { code: '+880', country: 'BD', name: 'Bangladesh' },
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+971', country: 'AE', name: 'United Arab Emirates' },
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+65', country: 'SG', name: 'Singapore' },
  { code: '+60', country: 'MY', name: 'Malaysia' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+1', country: 'CA', name: 'Canada' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+33', country: 'FR', name: 'France' },
]

export function ContactDocumentsForm({
  carriedBusinessData,
  initialValues,
  onSubmit,
  onBack,
  isLoading = false,
}: ContactDocumentsFormProps) {
  const [formData, setFormData] = React.useState<ContactDocumentsData>({
    fullName: initialValues?.fullName || '',
    jobTitle: initialValues?.jobTitle || '',
    businessEmail: initialValues?.businessEmail || '',
    phoneCountryCode: initialValues?.phoneCountryCode || '+880',
    phoneNumber: initialValues?.phoneNumber || '',
    agencyDocument: initialValues?.agencyDocument || null,
    registrationDocument: initialValues?.registrationDocument || null,
    businessLicence: initialValues?.businessLicence || null,
    otherDocument: initialValues?.otherDocument || null,
    otherDocumentTitle: initialValues?.otherDocumentTitle || '',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const validate = React.useCallback(
    (data: ContactDocumentsData): Record<string, string> => {
      const errs: Record<string, string> = {}
      if (!data.fullName.trim()) {
        errs.fullName = 'Full name is required.'
      }
      if (!data.businessEmail.trim()) {
        errs.businessEmail = 'Business email is required.'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.businessEmail)
      ) {
        errs.businessEmail = 'Please enter a valid email address.'
      }
      if (!data.phoneNumber.trim()) {
        errs.phoneNumber = 'Mobile number is required.'
      } else if (!/^[0-9+\s-]{6,15}$/.test(data.phoneNumber.trim())) {
        errs.phoneNumber = 'Please enter a valid phone number.'
      }
      return errs
    },
    [],
  )

  const handleBlur = (field: keyof ContactDocumentsData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const currentErrors = validate(formData)
    if (currentErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }))
    } else {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleChange = (field: keyof ContactDocumentsData, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (touched[field]) {
      const fieldErrors = validate(updated)
      if (!fieldErrors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    }
  }

  const { isLoading: isSubmitting, run } = useActionLoading()
  const busy = isLoading || isSubmitting

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      fullName: true,
      businessEmail: true,
      phoneNumber: true,
    })
    const validationErrors = validate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      run(() => onSubmit?.(formData))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Step 2 Main Card */}
      <div className="w-full rounded-[20px] border border-[#DCE2EB] bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        {/* Card Header */}
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EBF3FC] text-[#0267B8]">
            <FolderOpen className="size-6" />
          </div>
          <div className="flex flex-col">
            <h2
              id="s2-t"
              className="text-xl sm:text-2xl font-extrabold text-[#012A5E]"
            >
              Contact Information & Supporting Documents
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#4F5B70] leading-relaxed">
              Provide your primary business contact details and upload the
              supporting documents required for your agent application.
            </p>
          </div>
        </div>

        {/* Carried from Step 01 Banner */}
        <CarriedBusinessSummary data={carriedBusinessData} onEdit={onBack} />

        {/* Section 1: Primary Business Contact */}
        <div className="flex flex-col gap-4.5 pt-2">
          <div className="flex flex-col gap-1">
            <h3
              id="pc-t"
              className="text-base sm:text-[17px] font-extrabold text-[#012A5E]"
            >
              Primary Business Contact
            </h3>
            <p className="text-xs text-[#4F5B70]">
              Provide the details of the person responsible for this agent
              account.
            </p>
          </div>

          <p className="text-xs text-[#64748B]">
            Fields marked <span className="text-[#DC2626] font-bold">*</span>{' '}
            are required.
          </p>

          {/* Form Fields: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="f-name"
                className="text-xs font-bold text-[#141C2E]"
              >
                Full name <span className="text-[#DC2626] font-bold">*</span>
              </Label>
              <Input
                id="f-name"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                aria-invalid={touched.fullName && !!errors.fullName}
                className="h-12.5 rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm text-[#141C2E] placeholder:text-[#94A3B8] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
              />
              {touched.fullName && errors.fullName && (
                <p className="text-xs text-[#DC2626] font-medium">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="f-job"
                  className="text-xs font-bold text-[#141C2E]"
                >
                  Job title
                </Label>
                <span className="text-[11px] font-semibold text-[#8C9BAE]">
                  (Optional)
                </span>
              </div>
              <Input
                id="f-job"
                type="text"
                placeholder="e.g. Managing Director, Travel Consultant"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                className="h-12.5 rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm text-[#141C2E] placeholder:text-[#94A3B8] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
              />
            </div>

            {/* Business Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="f-email"
                className="text-xs font-bold text-[#141C2E]"
              >
                Business email{' '}
                <span className="text-[#DC2626] font-bold">*</span>
              </Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 size-4 text-[#64748B] pointer-events-none" />
                <Input
                  id="f-email"
                  type="email"
                  placeholder="Enter business email address"
                  value={formData.businessEmail}
                  onChange={(e) =>
                    handleChange('businessEmail', e.target.value)
                  }
                  onBlur={() => handleBlur('businessEmail')}
                  aria-invalid={touched.businessEmail && !!errors.businessEmail}
                  aria-describedby="f-email-h"
                  className="h-12.5 rounded-[12px] border-[#CBD5E1] bg-white pl-10 pr-3.5 text-sm text-[#141C2E] placeholder:text-[#94A3B8] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
                />
              </div>
              <p id="f-email-h" className="text-[11.5px] text-[#64748B]">
                We’ll send updates about your application here.
              </p>
              {touched.businessEmail && errors.businessEmail && (
                <p className="text-xs text-[#DC2626] font-medium">
                  {errors.businessEmail}
                </p>
              )}
            </div>

            {/* Mobile Number with Country Dial Code */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="f-phone"
                className="text-xs font-bold text-[#141C2E]"
              >
                Mobile number{' '}
                <span className="text-[#DC2626] font-bold">*</span>
              </Label>
              <div className="flex items-center gap-2">
                {/* Dial Code Selector */}
                <div className="w-32.5 shrink-0">
                  <Select
                    value={formData.phoneCountryCode}
                    onValueChange={(val) =>
                      val && handleChange('phoneCountryCode', val)
                    }
                  >
                    <SelectTrigger className="h-12.5 rounded-[12px] border-[#CBD5E1] bg-white px-2.5 text-xs sm:text-sm font-semibold text-[#141C2E] focus-visible:border-[#0267B8]">
                      <SelectValue placeholder="+880" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_DIAL_CODES.map((item) => (
                        <SelectItem key={item.country} value={item.code}>
                          <span className="font-bold text-[#0267B8] mr-1">
                            [{item.country}]
                          </span>{' '}
                          {item.code} ({item.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Number Input */}
                <Input
                  id="f-phone"
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  onBlur={() => handleBlur('phoneNumber')}
                  aria-invalid={touched.phoneNumber && !!errors.phoneNumber}
                  aria-describedby="f-phone-h"
                  className="h-12.5 flex-1 rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm text-[#141C2E] placeholder:text-[#94A3B8] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
                />
              </div>
              <p id="f-phone-h" className="text-[11.5px] text-[#64748B]">
                Choose any country code — it doesn’t need to match your business
                country.
              </p>
              {touched.phoneNumber && errors.phoneNumber && (
                <p className="text-xs text-[#DC2626] font-medium">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Supporting Documents */}
        <div className="flex flex-col gap-4 border-t border-[#E6EAF0] pt-6">
          <div className="flex flex-col gap-1">
            <h3
              id="sd-t"
              className="text-base sm:text-[17px] font-extrabold text-[#012A5E]"
            >
              Supporting Documents
            </h3>
            <p className="text-xs text-[#4F5B70]">
              Upload the supporting documents required for your agent
              application.
            </p>
          </div>

          {/* Blue Info Banner */}
          <div
            id="dinfo"
            className="flex items-start gap-3 rounded-[14px] border border-[#BAE6FD] bg-[#F0F7FF] p-4 text-[#0267B8]"
          >
            <Info className="size-5 shrink-0 mt-0.5 text-[#0267B8]" />
            <div className="flex flex-col text-xs leading-relaxed">
              <p className="text-[#0267B8]">
                Upload any documents that support your agent application. Any
                required documents will be clearly identified.
              </p>
              <p className="mt-1 font-bold text-[#012A5E]">
                No documents are currently required for this application. You
                may still upload supporting documents.
              </p>
            </div>
          </div>

          {/* 4 Document Upload Slots */}
          <div id="slots" className="flex flex-col gap-4">
            {/* Slot 1: Agency Supporting Document */}
            <DocumentUploadSlot
              id="agency"
              title="Agency Supporting Document"
              description="A document that supports your agency’s business details."
              icon={<Briefcase className="size-5" />}
              isOptional
              file={formData.agencyDocument || null}
              onFileSelect={(file: UploadedFileItem | null) =>
                handleChange('agencyDocument', file)
              }
            />

            {/* Slot 2: Business Registration Document */}
            <DocumentUploadSlot
              id="reg"
              title="Business Registration Document"
              description="Add it if your business has one."
              icon={<FileCheck2 className="size-5" />}
              isOptional
              file={formData.registrationDocument || null}
              onFileSelect={(file: UploadedFileItem | null) =>
                handleChange('registrationDocument', file)
              }
            />

            {/* Slot 3: Business Licence */}
            <DocumentUploadSlot
              id="lic"
              title="Business Licence"
              description="Add it if your business holds one."
              icon={<Award className="size-5" />}
              isOptional
              file={formData.businessLicence || null}
              onFileSelect={(file: UploadedFileItem | null) =>
                handleChange('businessLicence', file)
              }
            />

            {/* Slot 4: Other Supporting Document */}
            <DocumentUploadSlot
              id="other"
              title="Other Supporting Document"
              description="Any other document that supports your application. You can name each one."
              icon={<FileSpreadsheet className="size-5" />}
              isOptional
              allowCustomTitle
              customTitle={formData.otherDocumentTitle}
              onCustomTitleChange={(title: string) =>
                handleChange('otherDocumentTitle', title)
              }
              file={formData.otherDocument || null}
              onFileSelect={(file: UploadedFileItem | null) =>
                handleChange('otherDocument', file)
              }
            />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="rounded-[18px] border border-[#DCE2EB] bg-white p-3.5 sm:p-4.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Back Button */}
        <Button
          id="b-back"
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11.5 rounded-[10px] border-[#012A5E] text-[#012A5E] hover:bg-[#F8FAFD] font-bold text-xs sm:text-sm px-4 sm:px-5 gap-2"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Business Info</span>
        </Button>

        {/* Auto-save Status Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-[#64748B]">
          <CloudCheck className="size-4 text-[#059669]" />
          <span>Your progress is saved automatically</span>
        </div>

        {/* Next / Continue to Review Button */}
        <Button
          id="b-next"
          type="submit"
          loading={busy}
          loadingText="Processing..."
          className="h-12 sm:h-13 rounded-[10px] bg-[#F5A623] hover:bg-[#EAA11F] text-[#012A5E] font-extrabold text-xs sm:text-sm px-6 sm:px-7 gap-2 shadow-xs cursor-pointer transition-all"
        >
          <span id="b-next-t">Continue to Review</span>
          <ArrowRight className="size-4 stroke-[2.5]" />
        </Button>
      </div>
    </form>
  )
}

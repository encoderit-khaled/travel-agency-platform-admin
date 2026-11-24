import * as React from 'react'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Building2, ArrowRight } from 'lucide-react'
import type { BusinessInformationData } from './types'

export interface BusinessInformationFormProps {
  initialValues?: Partial<BusinessInformationData>
  onSubmit?: (data: BusinessInformationData) => void
  isLoading?: boolean
}

const BUSINESS_TYPES = [
  { value: 'travel_agency', label: 'Travel Agency / Tour Operator' },
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'private_limited', label: 'Private Limited Company (Ltd / LLC)' },
  { value: 'public_limited', label: 'Public Limited Company' },
  { value: 'corporate_travel', label: 'Corporate Travel Management' },
  { value: 'other', label: 'Other' },
]

const COUNTRIES = [
  { value: 'BD', label: 'Bangladesh' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'SG', label: 'Singapore' },
  { value: 'IN', label: 'India' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
]

export function BusinessInformationForm({
  initialValues,
  onSubmit,
  isLoading = false,
}: BusinessInformationFormProps) {
  const [formData, setFormData] = React.useState<BusinessInformationData>({
    legalBusinessName:
      initialValues?.legalBusinessName || 'Skyline Demo Travels Ltd',
    tradingName: initialValues?.tradingName || 'Skyline Travels',
    businessType: initialValues?.businessType || 'travel_agency',
    registrationNumber: initialValues?.registrationNumber || 'TR-982145',
    country: initialValues?.country || 'BD',
    city: initialValues?.city || 'Dhaka',
    address:
      initialValues?.address ||
      'Level 4, Gulshan Centre Point, Road 90, Gulshan-2',
    website: initialValues?.website || 'https://skylinedemo.com',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const validate = React.useCallback(
    (data: BusinessInformationData): Record<string, string> => {
      const errs: Record<string, string> = {}
      if (!data.legalBusinessName.trim()) {
        errs.legalBusinessName = 'Legal business name is required.'
      }
      if (!data.businessType) {
        errs.businessType = 'Please select business type.'
      }
      if (!data.country) {
        errs.country = 'Please select country.'
      }
      if (!data.city.trim()) {
        errs.city = 'City is required.'
      }
      if (!data.address.trim()) {
        errs.address = 'Business address is required.'
      }
      return errs
    },
    [],
  )

  const handleBlur = (field: keyof BusinessInformationData) => {
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

  const handleChange = (
    field: keyof BusinessInformationData,
    value: string,
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      legalBusinessName: true,
      businessType: true,
      country: true,
      city: true,
      address: true,
    })
    const validationErrors = validate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      onSubmit?.(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="w-full rounded-[20px] border border-[#DCE2EB] bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EBF3FC] text-[#0267B8]">
            <Building2 className="size-6" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#012A5E]">
              Business Information
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#4F5B70] leading-relaxed">
              Enter your registered agency and business legal details to
              initiate your partnership with AeroWing.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#64748B]">
          Fields marked <span className="text-[#DC2626] font-bold">*</span> are
          required.
        </p>

        {/* 2-col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4.5">
          {/* Legal Business Name */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="b-legal-name"
              className="text-xs font-bold text-[#141C2E]"
            >
              Legal business name{' '}
              <span className="text-[#DC2626] font-bold">*</span>
            </Label>
            <Input
              id="b-legal-name"
              type="text"
              placeholder="e.g. Skyline Demo Travels Ltd"
              value={formData.legalBusinessName}
              onChange={(e) =>
                handleChange('legalBusinessName', e.target.value)
              }
              onBlur={() => handleBlur('legalBusinessName')}
              aria-invalid={
                touched.legalBusinessName && !!errors.legalBusinessName
              }
              className="h-[50px] rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm"
            />
            {touched.legalBusinessName && errors.legalBusinessName && (
              <p className="text-xs text-[#DC2626] font-medium">
                {errors.legalBusinessName}
              </p>
            )}
          </div>

          {/* Trading Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="b-trading-name"
                className="text-xs font-bold text-[#141C2E]"
              >
                Trading name / Brand
              </Label>
              <span className="text-[11px] font-semibold text-[#8C9BAE]">
                (Optional)
              </span>
            </div>
            <Input
              id="b-trading-name"
              type="text"
              placeholder="e.g. Skyline Travels"
              value={formData.tradingName}
              onChange={(e) => handleChange('tradingName', e.target.value)}
              className="h-[50px] rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm"
            />
          </div>

          {/* Business Type */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="b-type"
              className="text-xs font-bold text-[#141C2E]"
            >
              Business type <span className="text-[#DC2626] font-bold">*</span>
            </Label>
            <Select
              value={formData.businessType}
              onValueChange={(val) => val && handleChange('businessType', val)}
            >
              <SelectTrigger
                id="b-type"
                className="h-[50px] rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm font-semibold"
              >
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((bt) => (
                  <SelectItem key={bt.value} value={bt.value}>
                    {bt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.businessType && errors.businessType && (
              <p className="text-xs text-[#DC2626] font-medium">
                {errors.businessType}
              </p>
            )}
          </div>

          {/* Registration Number */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="b-reg-no"
                className="text-xs font-bold text-[#141C2E]"
              >
                Registration number / CRN
              </Label>
              <span className="text-[11px] font-semibold text-[#8C9BAE]">
                (Optional)
              </span>
            </div>
            <Input
              id="b-reg-no"
              type="text"
              placeholder="e.g. TR-982145"
              value={formData.registrationNumber}
              onChange={(e) =>
                handleChange('registrationNumber', e.target.value)
              }
              className="h-[50px] rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="b-country"
              className="text-xs font-bold text-[#141C2E]"
            >
              Country of incorporation{' '}
              <span className="text-[#DC2626] font-bold">*</span>
            </Label>
            <Select
              value={formData.country}
              onValueChange={(val) => val && handleChange('country', val)}
            >
              <SelectTrigger
                id="b-country"
                className="h-[50px] rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm font-semibold"
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.country && errors.country && (
              <p className="text-xs text-[#DC2626] font-medium">
                {errors.country}
              </p>
            )}
          </div>

          {/* City */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="b-city"
              className="text-xs font-bold text-[#141C2E]"
            >
              City <span className="text-[#DC2626] font-bold">*</span>
            </Label>
            <Input
              id="b-city"
              type="text"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              aria-invalid={touched.city && !!errors.city}
              className="h-[50px] rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm"
            />
            {touched.city && errors.city && (
              <p className="text-xs text-[#DC2626] font-medium">
                {errors.city}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <Label
              htmlFor="b-address"
              className="text-xs font-bold text-[#141C2E]"
            >
              Registered business address{' '}
              <span className="text-[#DC2626] font-bold">*</span>
            </Label>
            <Textarea
              id="b-address"
              placeholder="Enter complete office street address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              aria-invalid={touched.address && !!errors.address}
              className="min-h-[80px] rounded-[12px] border-[#CBD5E1] bg-white p-3 text-sm"
            />
            {touched.address && errors.address && (
              <p className="text-xs text-[#DC2626] font-medium">
                {errors.address}
              </p>
            )}
          </div>

          {/* Website */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="b-website"
                className="text-xs font-bold text-[#141C2E]"
              >
                Website URL
              </Label>
              <span className="text-[11px] font-semibold text-[#8C9BAE]">
                (Optional)
              </span>
            </div>
            <Input
              id="b-website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="h-[50px] rounded-[12px] border-[#CBD5E1] bg-white px-3.5 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="rounded-[18px] border border-[#DCE2EB] bg-white p-3.5 sm:p-4.5 shadow-xs flex items-center justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 sm:h-13 rounded-[10px] bg-[#F5A623] hover:bg-[#EAA11F] text-[#012A5E] font-extrabold text-xs sm:text-sm px-7 gap-2 shadow-xs cursor-pointer"
        >
          <span>Continue to Step 2 (Contact & Documents)</span>
          <ArrowRight className="size-4 stroke-[2.5]" />
        </Button>
      </div>
    </form>
  )
}

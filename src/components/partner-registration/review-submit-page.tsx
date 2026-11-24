import * as React from 'react'
import {
  ClipboardCheck,
  CheckCircle2,
  Building2,
  User,
  FileText,
  FileCheck2,
  FolderOpen,
  ArrowLeft,
  ArrowRight,
  Shield,
  ExternalLink,
  Check,
  Sparkles,
  Printer,
  Home,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Checkbox } from '#/components/ui/checkbox'
import { Label } from '#/components/ui/label'
import { PartnerHeader } from './partner-header'
import { PartnerHero } from './partner-hero'
import { RegistrationProgress } from './registration-progress'
import { RegistrationSidebar } from './registration-sidebar'
import { PartnerFooter } from './partner-footer'
import { ReviewCard } from './review-card'
import { DEFAULT_SAMPLE_REGISTRATION_DATA } from './types'
import type { PartnerRegistrationData } from './types'
import { cn } from '#/lib/utils'

export interface ReviewSubmitPageProps {
  data?: PartnerRegistrationData
  onBack?: () => void
  onEditSection?: (section: 'business' | 'contact' | 'documents') => void
  onSubmitSuccess?: (referenceId: string) => void
  onStepClick?: (stepId: number) => void
}

export function ReviewSubmitPage({
  data = DEFAULT_SAMPLE_REGISTRATION_DATA,
  onBack,
  onEditSection,
  onSubmitSuccess,
  onStepClick,
}: ReviewSubmitPageProps) {
  const [declarationChecked, setDeclarationChecked] = React.useState(
    data.declarationConfirmed,
  )
  const [showError, setShowError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(
    data.status === 'submitted',
  )
  const [referenceId, setReferenceId] = React.useState(
    data.referenceId || 'AW-B2B-2026-8841',
  )

  const handleCheckboxChange = (checked: boolean) => {
    setDeclarationChecked(checked)
    if (checked) {
      setShowError(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!declarationChecked) {
      setShowError(true)
      const element = document.getElementById('declaration-section')
      element?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const generatedRef =
        data.referenceId ||
        `AW-B2B-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      setReferenceId(generatedRef)
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSubmitSuccess?.(generatedRef)
    }, 600)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] text-[#141C2E] antialiased">
      {/* 1. Header (White full width, 72px) */}
      <PartnerHeader />

      {/* 2. Hero Band (Dark navy gradient full width with golden wave) */}
      <PartnerHero />

      {/* 3. Main Overlapping Content Area (-mt-20, max-w-300) */}
      <main className="flex-1 w-full max-w-300 mx-auto px-6 -mt-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-7 items-start">
          {/* Left Column: Progress Steps + Form Content (width ~760px) */}
          <div className="w-full lg:w-190 flex-1 flex flex-col gap-5">
            <RegistrationProgress currentStep={3} onStepClick={onStepClick} />

            {/* Submission Successful View */}
            {isSubmitted ? (
              <div className="rounded-[20px] border border-[#BDE8CD] bg-white p-8 sm:p-10 shadow-sm flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#ECF8F1] text-[#047857] mb-5 ring-8 ring-[#ECF8F1]/60">
                  <Check className="size-8 stroke-3" />
                </div>

                <Badge
                  variant="outline"
                  className="bg-[#ECF8F1] border-[#A8E2BF] text-[#065F46] font-extrabold text-xs px-3 py-1 rounded-full mb-3"
                >
                  Application Submitted
                </Badge>

                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#012A5E]">
                  Thank you for applying!
                </h2>

                <p className="mt-2 text-sm text-[#4F5B70] max-w-lg leading-relaxed">
                  Your application to join the AeroWing Travel Partner Program
                  has been submitted successfully. Our partner onboarding team
                  is now reviewing your details.
                </p>

                {/* Reference ID card */}
                <div className="mt-6 w-full max-w-md rounded-xl border border-[#DCE2EB] bg-[#F8FAFC] p-4 flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold text-[#4F5B70] uppercase tracking-wider">
                    Application Reference Number
                  </span>
                  <span className="mt-1 font-mono text-xl sm:text-2xl font-black text-[#012A5E] tracking-wide">
                    {referenceId}
                  </span>
                  <span className="mt-1 text-[11px] text-[#64748B]">
                    Please save this reference for future correspondence.
                  </span>
                </div>

                {/* What happens next box */}
                <div className="mt-6 w-full max-w-md text-left rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
                  <h4 className="font-heading text-sm font-extrabold text-[#012A5E] flex items-center gap-2">
                    <Sparkles className="size-4 text-[#0267B8]" />
                    What happens next
                  </h4>
                  <ul className="mt-3 space-y-2.5 text-xs text-[#4F5B70]">
                    <li className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-[#0267B8] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#141C2E]">
                          Admin Review:
                        </strong>{' '}
                        Our compliance team will review your business
                        credentials within 2–3 business days.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-[#0267B8] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#141C2E]">
                          Email Notification:
                        </strong>{' '}
                        Decision and next steps will be sent to{' '}
                        <strong className="text-[#012A5E]">
                          {data.contact.businessEmail}
                        </strong>
                        .
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-[#0267B8] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#141C2E]">
                          Portal Access:
                        </strong>{' '}
                        Once approved, you will receive login credentials for
                        the B2B Agent Portal.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full">
                  <Button
                    variant="outline"
                    className="h-11 px-5 border-[#DCE2EB] text-[#012A5E] font-bold text-sm rounded-[10px]"
                    onClick={() => window.print()}
                  >
                    <Printer className="size-4 mr-2" />
                    Print Confirmation
                  </Button>
                  <Button
                    className="h-11 px-6 bg-[#012A5E] hover:bg-[#023B82] text-white font-bold text-sm rounded-[10px]"
                    onClick={() => {
                      window.location.href = '/'
                    }}
                  >
                    <Home className="size-4 mr-2" />
                    Return to Portal Home
                  </Button>
                </div>
              </div>
            ) : (
              /* Review & Submit Main Card (Figma #639:5323) */
              <div className="rounded-[20px] border border-[#DCE2EB] bg-white p-7 sm:p-9 shadow-sm flex flex-col gap-7">
                {/* 1. Header (div.rg-ch #639:5324) */}
                <div className="flex items-start gap-4 pb-6 border-b border-[#E6EAF0]">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#D7E3F4] text-[#0267B8]">
                    <ClipboardCheck className="size-6" />
                  </div>
                  <div>
                    <h2
                      id="s3-t"
                      className="font-heading text-xl sm:text-[22px] font-extrabold text-[#012A5E]"
                    >
                      Review Your Application
                    </h2>
                    <p className="text-sm text-[#4F5B70] mt-1 leading-snug">
                      Please review your business information, contact details
                      and supporting documents before submitting your Aero Wing
                      travel partner application.
                    </p>
                  </div>
                </div>

                {/* 2. Readiness banner (readiness #639:5333) */}
                <div className="rounded-[16px] border border-[#BDE8CD] bg-[#EDF8F2] overflow-hidden">
                  {/* Top Highlight Band (div#rdy-h #639:5334) */}
                  <div className="p-4 sm:p-5 flex items-start gap-3.5 border-b border-[#BDE8CD]/70 bg-[#E6F6ED]">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#059669] text-white mt-0.5">
                      <CheckCircle2 className="size-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3
                        id="rdy-t"
                        className="font-heading text-[16.5px] font-extrabold text-[#034A2F] leading-snug"
                      >
                        Your application is ready to submit
                      </h3>
                      <p className="text-xs sm:text-[13.5px] text-[#1E4D3A] mt-0.5 leading-relaxed">
                        All required information is complete. Confirm the
                        declaration below to submit.
                      </p>
                    </div>
                  </div>

                  {/* Section Readiness Checklist (#639:5342) */}
                  <ul className="divide-y divide-[#D7EFE1] p-2 sm:p-3 text-sm">
                    {/* Item 1: Business Information */}
                    <li className="flex items-center justify-between p-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#DCF3E4] text-[#047857]">
                          <Check className="size-3.5 stroke-3" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[#141C2E] text-sm">
                            Business Information
                          </span>
                          <span className="text-xs text-[#4F5B70] truncate">
                            {data.business.registrationNumber
                              ? 'All details provided'
                              : 'Optional information not provided: Business Registration Number'}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-[#E3F6EC] border-[#B3E8CB] text-[#047857] font-bold text-xs px-2.5 py-0.5 rounded-full shrink-0"
                      >
                        Completed
                      </Badge>
                    </li>

                    {/* Item 2: Contact Information */}
                    <li className="flex items-center justify-between p-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#DCF3E4] text-[#047857]">
                          <Check className="size-3.5 stroke-3" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[#141C2E] text-sm">
                            Contact Information
                          </span>
                          <span className="text-xs text-[#4F5B70] truncate">
                            All details provided
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-[#E3F6EC] border-[#B3E8CB] text-[#047857] font-bold text-xs px-2.5 py-0.5 rounded-full shrink-0"
                      >
                        Completed
                      </Badge>
                    </li>

                    {/* Item 3: Supporting Documents */}
                    <li className="flex items-center justify-between p-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EAEFF5] text-[#475569]">
                          <span className="size-1.5 rounded-full bg-[#64748B]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[#141C2E] text-sm">
                            Supporting Documents
                          </span>
                          <span className="text-xs text-[#4F5B70] truncate">
                            {data.documents.length > 0
                              ? `${data.documents.length} document(s) uploaded`
                              : 'No supporting documents uploaded'}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-[#EAEFF5] border-[#CBD5E1] text-[#475569] font-medium text-xs px-2.5 py-0.5 rounded-full shrink-0"
                      >
                        {data.documents.length > 0
                          ? 'Uploaded'
                          : 'Optional information not provided'}
                      </Badge>
                    </li>
                  </ul>
                </div>

                {/* 3. Section 1: Business Information Review Card (#639:5382) */}
                <ReviewCard
                  id="rvb"
                  title="Business Information"
                  icon={<Building2 className="size-4" />}
                  editLabel="Edit Business Information"
                  onEdit={() => onEditSection?.('business')}
                  fields={[
                    {
                      label: 'Legal Business Name',
                      value: data.business.legalBusinessName,
                    },
                    {
                      label: 'Trading Name',
                      value: data.business.tradingName || '—',
                    },
                    {
                      label: 'Business Type',
                      value: data.business.businessType,
                    },
                    {
                      label: 'Country',
                      value: data.business.country,
                    },
                    {
                      label: 'City',
                      value: data.business.city,
                    },
                    {
                      label: 'Business Address',
                      value: data.business.address,
                      colSpan: 1,
                    },
                    {
                      label: 'Business Website',
                      value: data.business.website ? (
                        <a
                          href={data.business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#0267B8] hover:underline"
                        >
                          <span>{data.business.website}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        '—'
                      ),
                    },
                  ]}
                />

                {/* 4. Section 2: Primary Business Contact Review Card (#639:5428) */}
                <ReviewCard
                  id="rvc"
                  title="Primary Business Contact"
                  icon={<User className="size-4" />}
                  editLabel="Edit Contact Information"
                  onEdit={() => onEditSection?.('contact')}
                  fields={[
                    {
                      label: 'Full Name',
                      value: data.contact.fullName,
                    },
                    {
                      label: 'Job Title',
                      value: data.contact.jobTitle,
                    },
                    {
                      label: 'Business Email',
                      value: (
                        <a
                          href={`mailto:${data.contact.businessEmail}`}
                          className="text-[#0267B8] hover:underline"
                        >
                          {data.contact.businessEmail}
                        </a>
                      ),
                    },
                    {
                      label: 'Mobile Number',
                      value: (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#CBD5E1] bg-[#F1F5F9] text-[11px] font-extrabold text-[#012A5E]">
                            {data.contact.phoneCountryCode}
                          </span>
                          <span>{data.contact.phoneNumber}</span>
                        </div>
                      ),
                    },
                  ]}
                />

                {/* 5. Section 3: Supporting Documents Review Card (#639:5462) */}
                <ReviewCard
                  id="rvd"
                  title="Supporting Documents"
                  icon={<FileText className="size-4" />}
                  editLabel="Edit Documents"
                  onEdit={() => onEditSection?.('documents')}
                >
                  {data.documents.length > 0 ? (
                    <div className="space-y-3">
                      {data.documents.map(
                        (doc: {
                          id: string
                          name: string
                          size: string
                          type: string
                        }) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-[#DCE2EB] bg-[#F8FAFC]"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="size-5 text-[#0267B8]" />
                              <div>
                                <p className="text-sm font-bold text-[#141C2E]">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                  {doc.size} · {doc.type}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">{doc.type}</Badge>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    /* Empty State (#639:5472) */
                    <div className="rounded-xl border border-dashed border-[#B3C9E2] bg-[#F3F7FC] p-4 sm:p-5 flex items-start gap-3.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E1EEFA] text-[#0267B8] mt-0.5">
                        <FolderOpen className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-[15px] font-extrabold text-[#012A5E]">
                          No supporting documents uploaded
                        </h4>
                        <p className="text-xs sm:text-[13px] text-[#4F5B70] mt-1 leading-relaxed">
                          You haven’t uploaded any supporting documents. You can
                          continue with your application.
                        </p>
                      </div>
                    </div>
                  )}
                </ReviewCard>

                {/* 6. Section 4: Declaration (declaration #639:5481) */}
                <div
                  id="declaration-section"
                  className={cn(
                    'rounded-[18px] border bg-white p-6 shadow-xs flex flex-col gap-4 transition-colors',
                    showError
                      ? 'border-rose-400 ring-2 ring-rose-200'
                      : 'border-[#DCE2EB]',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#EBF3FC] text-[#0267B8]">
                      <FileCheck2 className="size-4" />
                    </div>
                    <h3
                      id="dc-t"
                      className="font-heading text-[17px] font-extrabold text-[#012A5E]"
                    >
                      Declaration
                    </h3>
                  </div>

                  <p className="text-xs sm:text-[14px] text-[#293548] leading-relaxed">
                    I confirm that the information provided in this application
                    is accurate and complete to the best of my knowledge.
                  </p>

                  {/* Declaration Checkbox Container (label.chk #639:5488) */}
                  <div
                    onClick={() => handleCheckboxChange(!declarationChecked)}
                    className={cn(
                      'rounded-[12px] p-4 flex items-start gap-3.5 cursor-pointer select-none transition-colors border',
                      declarationChecked
                        ? 'bg-[#EBF3FC]/60 border-[#0267B8]/40'
                        : showError
                          ? 'bg-rose-50 border-rose-300'
                          : 'bg-[#F4F6FA] border-[#E2E8F0] hover:bg-[#EEF2F7]',
                    )}
                  >
                    <Checkbox
                      id="declaration-checkbox"
                      checked={declarationChecked}
                      onCheckedChange={(val) =>
                        handleCheckboxChange(val === true)
                      }
                      className="mt-0.5 size-5 border-[#94A3B8] data-checked:bg-[#012A5E] data-checked:border-[#012A5E]"
                    />
                    <div className="flex flex-col">
                      <Label
                        htmlFor="declaration-checkbox"
                        className="text-xs sm:text-sm font-bold text-[#012A5E] cursor-pointer leading-snug"
                      >
                        I confirm that the information provided above is
                        accurate.{' '}
                        <span className="text-rose-500 font-black">*</span>
                      </Label>
                      <span className="text-[11.5px] text-[#64748B] mt-1 font-medium">
                        Tick the declaration to submit your application.
                      </span>
                    </div>
                  </div>

                  {showError && (
                    <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5 animate-shake">
                      Please confirm the declaration by checking the box above
                      to proceed.
                    </p>
                  )}
                </div>

                {/* 7. Action Bar (action bar #639:5495) */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E6EAF0]">
                  {/* Back button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="h-13 min-w-32.5 w-full sm:w-auto rounded-[10px] border-[#DCE2EB] bg-white text-[#012A5E] hover:bg-[#F4F6FA] font-bold text-sm px-6 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back</span>
                  </Button>

                  {/* Save note */}
                  <div className="flex items-center gap-2 text-xs text-[#4F5B70] text-center sm:text-left">
                    <Shield className="size-4 text-[#0267B8] shrink-0" />
                    <span>
                      Your details are kept while you move between steps.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={cn(
                      'h-13 min-w-55 w-full sm:w-auto rounded-[10px] font-extrabold text-[15px] px-8 shadow-xs border transition-all flex items-center justify-center gap-2 cursor-pointer',
                      declarationChecked
                        ? 'bg-[#F1C134] hover:bg-[#E5B52C] text-[#012A5E] border-black/5 active:scale-[0.99]'
                        : 'bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#64748B] border-transparent',
                    )}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="size-4 border-2 border-[#012A5E] border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="size-4 stroke-[2.5]" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (width ~380px) */}
          <div className="w-full lg:w-95 shrink-0">
            <RegistrationSidebar
              businessName={data.business.legalBusinessName}
              primaryContact={data.contact.fullName}
              completedStepsCount={isSubmitted ? 3 : 2}
              totalStepsCount={3}
              documentStatus={
                data.documents.length > 0
                  ? `${data.documents.length} uploaded`
                  : 'None uploaded (optional)'
              }
              submissionStatus={isSubmitted ? 'Submitted' : 'Not Submitted'}
            />
          </div>
        </div>
      </main>

      {/* 4. Footer (White full width) */}
      <PartnerFooter />
    </div>
  )
}

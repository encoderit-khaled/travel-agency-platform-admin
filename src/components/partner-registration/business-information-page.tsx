import * as React from 'react'
import { PartnerHeader } from './partner-header'
import { PartnerHero } from './partner-hero'
import { RegistrationProgress } from './registration-progress'
import { BusinessInformationForm } from './business-information-form'
import { RegistrationSidebar } from './registration-sidebar'
import { PartnerFooter } from './partner-footer'
import type { BusinessInformationData } from './types'

export interface BusinessInformationPageProps {
  initialValues?: Partial<BusinessInformationData>
  onContinue?: (data: BusinessInformationData) => void
  onStepClick?: (step: number) => void
}

export function BusinessInformationPage({
  initialValues,
  onContinue,
  onStepClick,
}: BusinessInformationPageProps) {
  const [submittedData, setSubmittedData] =
    React.useState<BusinessInformationData | null>(null)

  const handleSubmit = (data: BusinessInformationData) => {
    setSubmittedData(data)
    onContinue?.(data)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] text-[#141C2E] antialiased">
      {/* 1. Header (White full width, 72px) */}
      <PartnerHeader />

      {/* 2. Hero Band (Dark navy gradient full width with golden wave) */}
      <PartnerHero />

      {/* 3. Overlapping Content Container (-mt-20, max-w-300) */}
      <main className="flex-1 w-full max-w-300 mx-auto px-6 -mt-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-7 items-start">
          {/* Left Column: Progress Steps + Form Card (width ~760px) */}
          <div className="w-full lg:w-190 flex-1 flex flex-col gap-5">
            <RegistrationProgress currentStep={1} onStepClick={onStepClick} />

            <BusinessInformationForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />

            {submittedData && (
              <div className="rounded-[14px] border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-[#065F46] text-xs sm:text-sm font-semibold shadow-xs">
                ✓ Step 1 saved: {submittedData.legalBusinessName} (
                {submittedData.city}, {submittedData.country})
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (width ~380px) */}
          <div className="w-full lg:w-95 shrink-0">
            <RegistrationSidebar />
          </div>
        </div>
      </main>

      {/* 4. Footer (White full width) */}
      <PartnerFooter />
    </div>
  )
}

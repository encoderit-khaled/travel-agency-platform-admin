import * as React from 'react'
import { BusinessInformationPage } from './business-information-page'
import { ContactDocumentsPage } from './contact-documents-page'
import { ReviewSubmitPage } from './review-submit-page'
import type {
  BusinessInformationData,
  ContactDocumentsData,
  PartnerRegistrationData,
} from './types'

export interface PartnerRegistrationFlowProps {
  initialStep?: 1 | 2 | 3
}

export function PartnerRegistrationFlow({
  initialStep = 3,
}: PartnerRegistrationFlowProps) {
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(initialStep)

  const [businessData, setBusinessData] =
    React.useState<BusinessInformationData>({
      legalBusinessName: 'Skyline Demo Travels Ltd',
      tradingName: 'Skyline Demo Holidays',
      businessType: 'Travel agency',
      registrationNumber: '',
      country: 'Bangladesh',
      city: 'Dhaka',
      address: 'House 12, Road 5, Demo Avenue\nDhaka 1200',
      website: 'https://example.com',
    })

  const [contactDocsData, setContactDocsData] =
    React.useState<ContactDocumentsData>({
      fullName: 'Nusrat Jahan',
      jobTitle: 'Managing Director',
      businessEmail: 'nusrat.jahan@example.com',
      phoneCountryCode: 'BD',
      phoneNumber: '+880 1555 030405',
      agencyDocument: null,
      registrationDocument: null,
      businessLicence: null,
      otherDocument: null,
      otherDocumentTitle: '',
    })

  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleStep1Submit = (data: BusinessInformationData) => {
    setBusinessData(data)
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStep2Submit = (data: ContactDocumentsData) => {
    setContactDocsData(data)
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentStep === 1) {
    return (
      <BusinessInformationPage
        initialValues={businessData}
        onContinue={handleStep1Submit}
        onStepClick={(step: number) => setCurrentStep(step as 1 | 2 | 3)}
      />
    )
  }

  if (currentStep === 2) {
    return (
      <ContactDocumentsPage
        carriedBusinessData={businessData}
        initialValues={contactDocsData}
        onSubmit={handleStep2Submit}
        onBack={() => {
          setCurrentStep(1)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onStepClick={(step: number) => setCurrentStep(step as 1 | 2 | 3)}
      />
    )
  }

  // Step 3: Review & Submit (Figma Node #639:5270)
  const fullRegistrationData: PartnerRegistrationData = {
    business: businessData,
    contact: {
      fullName: contactDocsData.fullName || 'Nusrat Jahan',
      jobTitle: contactDocsData.jobTitle || 'Managing Director',
      businessEmail:
        contactDocsData.businessEmail || 'nusrat.jahan@example.com',
      phoneCountryCode: contactDocsData.phoneCountryCode || 'BD',
      phoneNumber: contactDocsData.phoneNumber || '+880 1555 030405',
    },
    documents: [],
    declarationConfirmed: false,
    status: isSubmitted ? 'submitted' : 'ready_to_submit',
  }

  return (
    <ReviewSubmitPage
      data={fullRegistrationData}
      onBack={() => {
        setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      onEditSection={(section) => {
        if (section === 'business') {
          setCurrentStep(1)
        } else {
          setCurrentStep(2)
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      onStepClick={(step: number) => {
        setCurrentStep(step as 1 | 2 | 3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      onSubmitSuccess={() => {
        setIsSubmitted(true)
      }}
    />
  )
}

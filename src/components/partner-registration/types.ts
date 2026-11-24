export interface BusinessInformationData {
  legalBusinessName: string
  tradingName?: string
  businessType: string
  registrationNumber?: string
  country: string
  city: string
  address: string
  website?: string
}

export interface UploadedFileItem {
  id: string
  name: string
  size: number | string
  type: string
  uploadedAt?: Date | string
  previewUrl?: string
  customTitle?: string
}

export interface ContactDocumentsData {
  fullName: string
  jobTitle?: string
  businessEmail: string
  phoneCountryCode: string
  phoneNumber: string
  agencyDocument?: UploadedFileItem | null
  registrationDocument?: UploadedFileItem | null
  businessLicence?: UploadedFileItem | null
  otherDocument?: UploadedFileItem | null
  otherDocumentTitle?: string
}

export interface SupportingDocumentItem {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
}

export interface PartnerRegistrationData {
  business: BusinessInformationData
  contact: {
    fullName: string
    jobTitle: string
    businessEmail: string
    phoneCountryCode: string
    phoneNumber: string
  }
  documents: SupportingDocumentItem[]
  declarationConfirmed: boolean
  status: 'draft' | 'ready_to_submit' | 'submitted'
  submittedAt?: string
  referenceId?: string
}

export const DEFAULT_SAMPLE_REGISTRATION_DATA: PartnerRegistrationData = {
  business: {
    legalBusinessName: 'Skyline Demo Travels Ltd',
    tradingName: 'Skyline Demo Holidays',
    businessType: 'Travel agency',
    registrationNumber: '',
    country: 'Bangladesh',
    city: 'Dhaka',
    address: 'House 12, Road 5, Demo Avenue\nDhaka 1200',
    website: 'https://example.com',
  },
  contact: {
    fullName: 'Nusrat Jahan',
    jobTitle: 'Managing Director',
    businessEmail: 'nusrat.jahan@example.com',
    phoneCountryCode: 'BD',
    phoneNumber: '+880 1555 030405',
  },
  documents: [],
  declarationConfirmed: false,
  status: 'ready_to_submit',
}

export interface RegistrationFlowState {
  step: 1 | 2 | 3
  businessInfo: BusinessInformationData
  contactDocuments: ContactDocumentsData
}

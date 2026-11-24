import type { ApplicationStatus } from './status-metric-card'

export type { ApplicationStatus }

export interface ApplicationDocument {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
}

export interface AgentApplication {
  id: string
  reference: string
  businessName: string
  tradingName: string
  businessType: string
  registrationNumber: string
  taxNumber?: string
  country: string
  countryCode?: string
  city: string
  address: string
  website: string
  primaryContact: string
  contactRole?: string
  jobTitle?: string
  email: string
  phone: string
  documents: string
  documentsList?: ApplicationDocument[]
  submittedDate: string
  status: ApplicationStatus
  isDemo?: boolean
  decisionDate?: string
  decisionNotes?: string
  approvedDate?: string
  rejectedDate?: string
  suspendedDate?: string
  creditLimit?: string
}

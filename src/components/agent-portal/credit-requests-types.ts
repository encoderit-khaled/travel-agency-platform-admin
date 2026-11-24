export type CreditRequestStatus =
  'Pending' | 'Approved' | 'Adjusted' | 'Rejected'

export type CreditRequestType = 'Credit-limit increase' | 'Credit top-up'

export interface CreditRequest {
  id: string
  submittedDate: string
  submittedTime: string
  submittedTimestamp: string // e.g. "12 Nov 2026 · 10:20"
  requestType: CreditRequestType
  typeDescription: string // e.g. "Additional booking capacity"
  requestedAmount: string // e.g. "Sample amount" or "$10,000"
  requestedAmountNumeric?: number
  adjustedAmount?: string // e.g. "Adjusted amount available"
  status: CreditRequestStatus
  reason: string
  decision: string // e.g. "Pending", "Admin approved", "Admin rejected", "Admin adjusted"
  decisionDate?: string | null // e.g. "30 Oct 2026"
  decisionNote?: string // e.g. "Awaiting an Aero Wing Admin decision."
  creditRecord: string // e.g. "Pending decision"
  agentNotification: string // e.g. "Notification will follow after a decision"
}

export interface CreditKPISummary {
  totalRequests: number
  pending: number
  approvedAdjusted: number
  rejected: number
}

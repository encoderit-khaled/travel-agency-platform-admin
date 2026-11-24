export type CreditRequestStatus =
  'Pending' | 'Approved' | 'Adjusted' | 'Rejected'

export type CreditRequestType = 'Credit-limit increase' | 'Credit top-up'

export interface CreditRequestHistoryItem {
  id: string
  title: string
  date: string
  type: 'submit' | 'approved' | 'adjusted' | 'rejected'
  note?: string
}

export interface CreditRequestItem {
  id: string
  submittedDate: string
  submittedTime: string
  submittedFull: string
  requestType: CreditRequestType
  requestTypeSubtitle: string
  requestedAmount: string
  requestedAmountSubtitle?: string
  requestedAmountValue: number
  status: CreditRequestStatus
  decision: string
  decisionDate: string
  decisionNote?: string
  reason: string
  creditRecord: string
  notification: string
  history: CreditRequestHistoryItem[]
}

export interface CreditKpiSummary {
  totalRequests: number
  totalSubtitle: string
  pendingRequests: number
  pendingSubtitle: string
  approvedAdjustedRequests: number
  approvedAdjustedSubtitle: string
  rejectedRequests: number
  rejectedSubtitle: string
}

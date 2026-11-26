import * as React from 'react'
import { ChevronLeft, Plus, ListOrdered, Info, CreditCard } from 'lucide-react'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { Button } from '#/components/ui/button'
import { NewCreditRequestForm } from './new-credit-request-form'
import { CreditRequestsHistoryTable } from './credit-requests-history-table'
import { CreditRequestSubmittedDialog } from './credit-request-submitted-dialog'
import { CreditRequestDetailsSheet } from './credit-request-details-sheet'
import { INITIAL_CREDIT_REQUESTS } from './credit-requests-data'
import type { CreditRequest, CreditRequestType } from './credit-requests-types'
import { cn } from 'cn'

export interface AgentCreditRequestsPageProps {
  initialTab?: 'new' | 'history'
  initialSubmitModalOpen?: boolean
  initialSelectedRequestId?: string
}

export function AgentCreditRequestsPage({
  initialTab = 'new',
  initialSubmitModalOpen = false,
  initialSelectedRequestId,
}: AgentCreditRequestsPageProps) {
  const [activeTab, setActiveTab] = React.useState<'new' | 'history'>(
    initialTab,
  )
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [requests, setRequests] = React.useState<CreditRequest[]>(
    INITIAL_CREDIT_REQUESTS,
  )

  // Submit Modal state
  const [submitModalOpen, setSubmitModalOpen] = React.useState(
    initialSubmitModalOpen,
  )
  const [lastSubmittedData, setLastSubmittedData] = React.useState<{
    requestType: CreditRequestType
    requestedAmount: string
    reason: string
  }>({
    requestType: 'Credit-limit increase',
    requestedAmount: '1000',
    reason: 'Explain why you need this credit change',
  })

  // Details Sheet state
  const [detailsSheetOpen, setDetailsSheetOpen] = React.useState(
    Boolean(initialSelectedRequestId),
  )
  const [selectedRequest, setSelectedRequest] =
    React.useState<CreditRequest | null>(() => {
      if (initialSelectedRequestId) {
        return (
          requests.find((r) => r.id === initialSelectedRequestId) || requests[0]
        )
      }
      return null
    })

  // Handle Form Submission
  const handleSubmitRequest = (data: {
    requestType: CreditRequestType
    requestedAmount: string
    reason: string
  }) => {
    setLastSubmittedData(data)

    // Prepend new request
    const newReq: CreditRequest = {
      id: `REQ-2026-00${requests.length + 1}`,
      submittedDate: '12 Nov 2026',
      submittedTime: '10:20',
      submittedTimestamp: '12 Nov 2026 · 10:20',
      requestType: data.requestType,
      typeDescription:
        data.requestType === 'Credit-limit increase'
          ? 'Additional booking capacity'
          : 'Additional booking capacity',
      requestedAmount: `$${Number(data.requestedAmount || 1000).toLocaleString()}`,
      requestedAmountNumeric: Number(data.requestedAmount || 1000),
      status: 'Pending',
      reason: data.reason,
      decision: 'Pending',
      decisionDate: null,
      decisionNote: 'Awaiting an Aero Wing Admin decision.',
      creditRecord: 'Pending decision',
      agentNotification: 'Notification will follow after a decision',
    }

    setRequests((prev) => [newReq, ...prev])
    setSubmitModalOpen(true)
  }

  const handleOpenDetails = (req: CreditRequest) => {
    setSelectedRequest(req)
    setDetailsSheetOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex">
      {/* Sidebar */}
      <AgentPortalSidebar
        currentTab="Credit"
        currentActive="Credit"
        activePath="/credit"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          breadcrumbs={[
            { label: 'Dashboard', active: false },
            { label: 'Credit', active: false },
            { label: 'Requests', active: true },
          ]}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Bar: Back to Credit link */}
          <div>
            <Button variant="plain"
              type="button"
              onClick={() => {
                window.location.href = '/wallet'
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0267B8] hover:text-[#014f8e] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              <span>Back to Credit</span>
            </Button>
          </div>

          {/* Page Heading & Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0267B8] mb-1">
                AGENT PORTAL · M2.8 CREDIT REQUESTS
              </div>
              <h1 className="text-3xl font-extrabold text-[#001A3D] tracking-tight">
                Credit Requests
              </h1>
              <p className="text-sm text-[#5A6578] mt-1">
                Request changes to your Agent credit and review previous
                decisions.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-[#001A3D]">
                  Skyline Demo Travels Ltd
                </span>
                <span className="text-[11px] font-medium text-[#5A6578] bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Info className="size-3" />
                  Sample data
                </span>
              </div>
            </div>

            {/* + New Credit Request Button */}
            <Button
              type="button"
              onClick={() => setActiveTab('new')}
              className="rounded-xl bg-[#F5B544] hover:bg-[#E5A433] text-[#001A3D] font-bold text-sm px-5 py-2.5 shadow-xs flex items-center gap-2 cursor-pointer transition-colors shrink-0"
            >
              <Plus className="size-4 stroke-[2.5]" />
              New Credit Request
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-[#DCE2EB] pt-2">
            {/* Tab 1: Request History */}
            <Button variant="plain"
              type="button"
              onClick={() => setActiveTab('history')}
              className={cn(
                'pb-3 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer relative',
                activeTab === 'history'
                  ? 'text-[#0267B8]'
                  : 'text-[#5A6578] hover:text-[#001A3D]',
              ))}
            >
              <ListOrdered className="size-4" />
              <span>Request History</span>
              <span
                className={cn(
                  'text-[11px] px-2 py-0.2 rounded-full font-semibold',
                  activeTab === 'history'
                    ? 'bg-[#E8F1FC] text-[#0267B8]'
                    : 'bg-slate-200 text-slate-700',
                )}
              >
                {requests.length}
              </span>
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0267B8]" />
              )}
            </Button>

            {/* Tab 2: New Request */}
            <Button variant="plain"
              type="button"
              onClick={() => setActiveTab('new')}
              className={cn(
                'pb-3 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer relative',
                activeTab === 'new'
                  ? 'text-[#0267B8]'
                  : 'text-[#5A6578] hover:text-[#001A3D]',
              ))}
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Request</span>
              {activeTab === 'new' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0267B8]" />
              )}
            </Button>
          </div>

          {/* Tab Panels */}
          {activeTab === 'new' ? (
            <NewCreditRequestForm
              agencyName="Skyline Demo Travels Ltd"
              onSubmitRequest={handleSubmitRequest}
              onCancel={() => setActiveTab('history')}
            />
          ) : (
            <CreditRequestsHistoryTable
              requests={requests}
              onSelectRequest={handleOpenDetails}
            />
          )}

          {/* Bottom Footer */}
          <div className="pt-8 pb-4 border-t border-[#DCE2EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
            <div>
              AeroWing Agent Portal · M2.8 Credit Request & Request History ·
              Website
            </div>
            <div>
              Design prototype — no credit, approval, ledger or notification
              system is called
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Dialog (#743:4132) */}
      <CreditRequestSubmittedDialog
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        requestType={lastSubmittedData.requestType}
        requestedAmount={lastSubmittedData.requestedAmount}
        status="Pending"
        onSubmitAnother={() => {
          setSubmitModalOpen(false)
        }}
        onBackToCredit={() => {
          setSubmitModalOpen(false)
          setActiveTab('history')
        }}
        onViewRequest={() => {
          setSubmitModalOpen(false)
          setActiveTab('history')
          const firstReq = requests[0]
          handleOpenDetails(firstReq)
        }}
      />

      {/* Details Sheet (#743:4134) */}
      <CreditRequestDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        request={selectedRequest}
      />
    </div>
  )
}

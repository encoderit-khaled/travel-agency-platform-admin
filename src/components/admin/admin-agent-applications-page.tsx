import * as React from 'react'
import { Sparkles, RotateCcw, Eye } from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminFooter } from './admin-footer'
import { StatusMetricCard } from './status-metric-card'
import type { ApplicationStatus } from './status-metric-card'
import { AgentApplicationsTable } from './agent-applications-table'
import { ApplicationReviewModal } from './application-review-modal'
import { ApplicationReviewView } from './application-review-view'
import type { AgentApplication } from './application-review-modal'
import { Button } from '#/components/ui/button'
import { SidebarProvider } from '#/components/ui/sidebar'

// Initial application data derived exactly from Figma design #645:301 & #648:909
const INITIAL_APPLICATIONS: AgentApplication[] = [
  {
    id: 'app-skyline-demo-01',
    reference: 'No reference assigned',
    businessName: 'Skyline Demo Travels Ltd',
    tradingName: 'Skyline Demo Holidays',
    businessType: 'Travel agency',
    registrationNumber: 'TR-BD-2026-904',
    country: 'Bangladesh',
    city: 'Dhaka',
    address: 'House 12, Road 5, Demo Avenue\nDhaka 1200',
    website: 'https://example.com',
    primaryContact: 'Nusrat Jahan',
    jobTitle: 'Managing Director',
    email: 'nusrat.jahan@example.com',
    phone: '+880 1555 030405',
    documents: 'No supporting documents submitted',
    submittedDate: 'Not recorded in this prototype',
    status: 'pending',
    isDemo: true,
  },
]

interface AdminAgentApplicationsPageProps {
  initialView?: 'default' | 'no-data' | 'review'
  initialReviewId?: string
  initialTab?: 'pending' | 'all'
  initialStatus?: ApplicationStatus | null
  initialSearchQuery?: string
  initialEmpty?: boolean
  initialAction?: 'approve' | 'reject' | 'suspend'
}

export function AdminAgentApplicationsPage({
  initialView = 'default',
  initialReviewId,
  initialTab = 'pending',
  initialStatus = null,
  initialSearchQuery = '',
  initialEmpty = false,
  initialAction,
}: AdminAgentApplicationsPageProps) {
  const [applications, setApplications] =
    React.useState<AgentApplication[]>(INITIAL_APPLICATIONS)
  const [viewMode, setViewMode] = React.useState<'table' | 'review'>(
    initialView === 'review' || Boolean(initialAction) ? 'review' : 'table',
  )
  const [activeTab, setActiveTab] = React.useState<'pending' | 'all'>(
    initialTab,
  )
  const [selectedStatusFilter, setSelectedStatusFilter] =
    React.useState<ApplicationStatus | null>(initialStatus)
  const [globalSearch, setGlobalSearch] = React.useState(initialSearchQuery)
  const [selectedApplication, setSelectedApplication] =
    React.useState<AgentApplication>(() => {
      if (initialReviewId) {
        const found = INITIAL_APPLICATIONS.find((a) => a.id === initialReviewId)
        if (found) return found
      }
      return INITIAL_APPLICATIONS[0]
    })
  const [reviewingAppModal, setReviewingAppModal] =
    React.useState<AgentApplication | null>(null)
  const [forceNoDataMatch, setForceNoDataMatch] = React.useState<boolean>(
    initialEmpty || initialView === 'no-data',
  )

  // Status counts
  const pendingCount = applications.filter((a) => a.status === 'pending').length
  const approvedCount = applications.filter(
    (a) => a.status === 'approved',
  ).length
  const rejectedCount = applications.filter(
    (a) => a.status === 'rejected',
  ).length
  const suspendedCount = applications.filter(
    (a) => a.status === 'suspended',
  ).length

  const handleStatusCardClick = (status: ApplicationStatus) => {
    if (selectedStatusFilter === status) {
      setSelectedStatusFilter(null)
    } else {
      setSelectedStatusFilter(status)
      if (status === 'pending') {
        setActiveTab('pending')
      } else {
        setActiveTab('all')
      }
    }
    if (forceNoDataMatch) {
      setForceNoDataMatch(false)
    }
  }

  const handleUpdateStatus = (
    id: string,
    newStatus: ApplicationStatus,
    extra?: Partial<AgentApplication> | string,
  ) => {
    const extraProps =
      typeof extra === 'string' ? { decisionNotes: extra } : (extra ?? {})
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              decisionDate: dateStr,
              ...extraProps,
            }
          : app,
      ),
    )
    setSelectedApplication((prev) =>
      prev.id === id
        ? {
            ...prev,
            status: newStatus,
            decisionDate: dateStr,
            ...extraProps,
          }
        : prev,
    )
  }

  const handleToggleNoDataSimulation = () => {
    setForceNoDataMatch((prev) => !prev)
  }

  const [activeAction, setActiveAction] = React.useState<
    'approve' | 'reject' | 'suspend' | undefined
  >(initialAction)

  const handleOpenReviewPage = (
    app: AgentApplication,
    action?: 'approve' | 'reject' | 'suspend',
  ) => {
    setSelectedApplication(app)
    setActiveAction(action)
    setViewMode('review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Dynamic breadcrumbs based on viewMode
  const breadcrumbs =
    viewMode === 'review'
      ? [
          { label: 'Dashboard', href: '#' },
          { label: 'Agents', href: '#' },
          {
            label: 'Agent Applications',
            onClick: () => setViewMode('table'),
          },
          {
            label: selectedApplication.businessName,
            active: true,
          },
        ]
      : undefined

  return (
    <SidebarProvider defaultOpen className="min-h-screen w-full">
      <div className="min-h-screen flex w-full bg-[#F4F6FA] text-[#141C2E] font-sans antialiased">
        {/* 1. Desktop Sidebar */}
        <AdminSidebar pendingCount={pendingCount} />

        {/* 2. Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header with dynamic breadcrumbs */}
          <AdminHeader
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
            breadcrumbs={breadcrumbs}
          />

          {/* Page Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1664px] w-full mx-auto">
            {viewMode === 'review' ? (
              /* APPLICATION REVIEW FULL PAGE VIEW (#648:909, #648:1247, #648:1249, #648:1250) */
              <ApplicationReviewView
                application={selectedApplication}
                onBack={() => {
                  setActiveAction(undefined)
                  setViewMode('table')
                }}
                onUpdateStatus={handleUpdateStatus}
                initialOpenApprove={activeAction === 'approve'}
                initialOpenReject={activeAction === 'reject'}
                initialOpenSuspend={activeAction === 'suspend'}
              />
            ) : (
              /* AGENT APPLICATIONS QUEUE TABLE VIEW (#645:301) */
              <>
                {/* Page Heading & QA Demo Data Banner with Node 648:1253 Toggle & Node 648:909 Link */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#012A5E] tracking-tight leading-tight">
                        Agent Applications
                      </h1>
                      {forceNoDataMatch && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]">
                          No Data Match (#648:1253)
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#4F5B70] mt-1 font-medium">
                      Review submitted travel partner applications and manage
                      approval decisions.
                    </p>
                  </div>

                  {/* QA Demo Banner from Figma with interactive toggles */}
                  <div className="rounded-xl border border-dashed border-[#E1BA6D] bg-[#FFF8E7] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#E1BA6D]/30 text-[#854D0E] shrink-0 w-fit">
                        QA DEMO DATA
                      </span>
                      <span className="text-xs text-[#78350F] font-medium leading-snug">
                        Sample application from the registration prototype
                        (Steps 01–03).
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* Direct Button to open Reject Application (#648:1248) */}
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() =>
                          handleOpenReviewPage(selectedApplication, 'reject')
                        }
                        className="h-7 text-xs font-extrabold rounded-lg gap-1.5 border-[#FCA5A5] bg-white text-[#C62828] hover:bg-[#FEF2F2] cursor-pointer shadow-none"
                      >
                        <Eye className="size-3 text-[#C62828]" />
                        <span>Reject Modal (#648:1248)</span>
                      </Button>

                      {/* Direct Button to open Application Review (#648:909) */}
                      <Button
                        type="button"
                        size="xs"
                        variant="default"
                        onClick={() =>
                          handleOpenReviewPage(selectedApplication)
                        }
                        className="h-7 text-xs font-extrabold rounded-lg gap-1.5 bg-[#012A5E] hover:bg-[#023B82] text-white cursor-pointer shadow-none"
                      >
                        <Eye className="size-3 text-[#F1C134]" />
                        <span>Review (#648:909)</span>
                      </Button>

                      {/* Node 648:1253 State Switcher */}
                      <Button
                        type="button"
                        size="xs"
                        variant={forceNoDataMatch ? 'destructive' : 'outline'}
                        onClick={handleToggleNoDataSimulation}
                        className="h-7 text-xs font-bold rounded-lg gap-1.5 cursor-pointer shadow-none"
                      >
                        {forceNoDataMatch ? (
                          <>
                            <RotateCcw className="size-3" />
                            <span>Reset to 1 Result</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-3 text-[#B45309]" />
                            <span>"No Data Match" (#648:1253)</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 3. Status Metric Cards (4 Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
                  <StatusMetricCard
                    status="pending"
                    title="Pending Review"
                    count={pendingCount}
                    isSelected={selectedStatusFilter === 'pending'}
                    onClick={() => handleStatusCardClick('pending')}
                  />
                  <StatusMetricCard
                    status="approved"
                    title="Approved"
                    count={approvedCount}
                    isSelected={selectedStatusFilter === 'approved'}
                    onClick={() => handleStatusCardClick('approved')}
                  />
                  <StatusMetricCard
                    status="rejected"
                    title="Rejected"
                    count={rejectedCount}
                    isSelected={selectedStatusFilter === 'rejected'}
                    onClick={() => handleStatusCardClick('rejected')}
                  />
                  <StatusMetricCard
                    status="suspended"
                    title="Suspended"
                    count={suspendedCount}
                    isSelected={selectedStatusFilter === 'suspended'}
                    onClick={() => handleStatusCardClick('suspended')}
                  />
                </div>

                {/* 4. Main Applications Queue Table */}
                <AgentApplicationsTable
                  applications={applications}
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab)
                    setSelectedStatusFilter(
                      tab === 'pending' ? 'pending' : null,
                    )
                  }}
                  onReviewClick={(app) => handleOpenReviewPage(app)}
                  initialSearch={globalSearch}
                  statusFilter={selectedStatusFilter}
                  onStatusFilterChange={setSelectedStatusFilter}
                  forceNoDataMatch={forceNoDataMatch}
                  onToggleForceNoData={handleToggleNoDataSimulation}
                />
              </>
            )}
          </main>

          {/* 5. Footer */}
          <AdminFooter />
        </div>

        {/* Review Dialog Modal (kept for optional quick view) */}
        <ApplicationReviewModal
          application={reviewingAppModal}
          isOpen={Boolean(reviewingAppModal)}
          onClose={() => setReviewingAppModal(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </SidebarProvider>
  )
}

import * as React from 'react'
import {
  ArrowLeft,
  Building2,
  User,
  FileText,
  Clock,
  CheckCircle2,
  CircleX as XCircle,
  AlertOctagon,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ClipboardList,
  Mail,
  Lock,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { ApproveApplicationModal } from './approve-application-modal'
import { RejectApplicationModal } from './reject-application-modal'
import { SuspendAgentModal } from './suspend-agent-modal'
import type { AgentApplication, ApplicationStatus } from './types'

interface ApplicationReviewViewProps {
  application: AgentApplication
  onBack: () => void
  onUpdateStatus: (
    id: string,
    newStatus: ApplicationStatus,
    notes?: string,
  ) => void
  initialOpenApprove?: boolean
  initialOpenReject?: boolean
  initialOpenSuspend?: boolean
  initialAction?: 'approve' | 'reject' | 'suspend'
}

export function ApplicationReviewView({
  application,
  onBack,
  onUpdateStatus,
  initialOpenApprove = false,
  initialOpenReject = false,
  initialOpenSuspend = false,
  initialAction,
}: ApplicationReviewViewProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(
    initialOpenApprove || initialAction === 'approve',
  )
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(
    initialOpenReject || initialAction === 'reject',
  )
  const [suspendDialogOpen, setSuspendDialogOpen] = React.useState(
    initialOpenSuspend || initialAction === 'suspend',
  )

  const handleCopy = (text: string, field: string) => {
    void navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirmApprove = (id: string) => {
    onUpdateStatus(id, 'approved')
    setApproveDialogOpen(false)
  }

  const handleConfirmReject = (id: string, note?: string) => {
    onUpdateStatus(id, 'rejected', note)
    setRejectDialogOpen(false)
  }

  const handleConfirmSuspend = (id: string, note?: string) => {
    onUpdateStatus(id, 'suspended', note)
    setSuspendDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* 1. Back Navigation Button matching Figma button#dt-back */}
      <div>
        <Button
          type="button"
          variant="plain"
          onClick={onBack}
          className="text-[#005CE8] hover:text-[#0047B3] hover:bg-[#EBF3FE] font-bold text-sm px-3 py-2 -ml-2 rounded-xl gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to applications</span>
        </Button>
      </div>

      {/* 2. Top Header Card matching Figma #648:985 */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm">
        {/* Saffron Left Accent Border matching Figma ::before (width: 4px, fill: Saffron) */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F59E0B]" />

        <div className="flex flex-col gap-3.5 pl-2 sm:pl-3">
          {/* Status & QA Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {application.status === 'pending' && (
              <Badge className="bg-[#DDE9F8] text-[#012A5E] hover:bg-[#DDE9F8] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
                <Clock className="size-3.5 text-[#005CE8]" />
                Pending Review
              </Badge>
            )}
            {application.status === 'approved' && (
              <Badge className="bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#E8F5E9] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
                <CheckCircle2 className="size-3.5 text-[#1B5E20]" />
                Approved
              </Badge>
            )}
            {application.status === 'rejected' && (
              <Badge className="bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FEE2E2] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
                <XCircle className="size-3.5 text-[#DC2626]" />
                Rejected
              </Badge>
            )}
            {application.status === 'suspended' && (
              <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-none font-bold text-xs px-2.5 py-1 rounded-full gap-1.5 shadow-none">
                <AlertOctagon className="size-3.5 text-[#D97706]" />
                Suspended
              </Badge>
            )}

            {/* QA DEMO DATA TAG matching Figma span.qa-tag #648:992 */}
            {application.isDemo && (
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#92400E] border border-[#E1BA6D]/50 tracking-wider">
                QA DEMO DATA
              </span>
            )}
          </div>

          {/* Heading 1: Application Name matching Figma h1#dt-t #648:994 */}
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#012A5E] tracking-tight leading-tight">
            {application.businessName}
          </h1>

          {/* Metadata Row matching Figma dl.dh-meta #648:996 */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-2 border-t border-[#F1F5F9] text-xs">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Application reference
              </dt>
              <dd className="font-medium text-[#64748B] italic mt-0.5 text-sm">
                {application.reference || 'No reference assigned'}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Submitted
              </dt>
              <dd className="font-medium text-[#64748B] mt-0.5 text-sm">
                {application.submittedDate || 'Not recorded in this prototype'}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Business type
              </dt>
              <dd className="font-bold text-[#0F172A] mt-0.5 text-sm">
                {application.businessType || 'Travel agency'}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Country
              </dt>
              <dd className="font-bold text-[#0F172A] mt-0.5 text-sm">
                {application.country || 'Bangladesh'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 3. Main Detail Grid: Left Details (8 cols) + Right Sidebar (4 cols) matching Figma #648:1018 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Card 1: Business Information matching Figma section #648:1020 */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                  <Building2 className="size-4.5" />
                </div>
                <h2 className="font-extrabold text-[#012A5E] text-base sm:text-lg">
                  Business Information
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                <Lock className="size-3 text-[#94A3B8]" />
                <span>Read-only · as submitted</span>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Legal Business Name
                </dt>
                <dd className="font-bold text-[#0F172A]">
                  {application.businessName}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Trading Name
                </dt>
                <dd className="font-medium text-[#0F172A]">
                  {application.tradingName || application.businessName}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Business Type
                </dt>
                <dd className="font-medium text-[#0F172A]">
                  {application.businessType}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Country
                </dt>
                <dd className="font-medium text-[#0F172A]">
                  {application.country}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">City</dt>
                <dd className="font-medium text-[#0F172A]">
                  {application.city || 'Dhaka'}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Registration Number
                </dt>
                <dd className="font-mono text-[#0F172A]">
                  {application.registrationNumber || 'TR-BD-2026-904'}
                </dd>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Business Address
                </dt>
                <dd className="font-medium text-[#0F172A] whitespace-pre-line">
                  {application.address ||
                    'House 12, Road 5, Demo Avenue\nDhaka 1200'}
                </dd>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Business Website
                </dt>
                <dd className="font-medium text-[#005CE8]">
                  <a
                    href={application.website || 'https://example.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <span>{application.website || 'https://example.com'}</span>
                    <ExternalLink className="size-3 text-[#005CE8]" />
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Card 2: Primary Business Contact matching Figma section #648:1066 */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                  <User className="size-4.5" />
                </div>
                <h2 className="font-extrabold text-[#012A5E] text-base sm:text-lg">
                  Primary Business Contact
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                <Lock className="size-3 text-[#94A3B8]" />
                <span>Read-only · as submitted</span>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Full Name
                </dt>
                <dd className="font-bold text-[#0F172A]">
                  {application.primaryContact}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Job Title
                </dt>
                <dd className="font-medium text-[#0F172A]">
                  Managing Director
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Business Email
                </dt>
                <dd className="flex items-center gap-2 mt-0.5">
                  <span className="font-medium text-[#0F172A]">
                    {application.email}
                  </span>
                  <Button variant="plain"
                    type="button"
                    onClick={() => handleCopy(application.email, 'email')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#475569] hover:text-[#012A5E] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-2 py-0.5 rounded transition-colors cursor-pointer"
                    title="Copy business email"
                  >
                    {copiedField === 'email' ? (
                      <>
                        <Check className="size-3 text-[#16A34A]" />
                        <span className="text-[#16A34A]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 text-[#64748B]" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold text-[#64748B]">
                  Mobile Number
                </dt>
                <dd className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                    BD
                  </span>
                  <span className="font-medium text-[#0F172A]">
                    {application.phone || '+880 1555 030405'}
                  </span>
                  <Button variant="plain"
                    type="button"
                    onClick={() =>
                      handleCopy(
                        application.phone || '+880 1555 030405',
                        'phone',
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#475569] hover:text-[#012A5E] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-2 py-0.5 rounded transition-colors cursor-pointer"
                    title="Copy mobile number"
                  >
                    {copiedField === 'phone' ? (
                      <>
                        <Check className="size-3 text-[#16A34A]" />
                        <span className="text-[#16A34A]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 text-[#64748B]" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </dd>
              </div>
            </dl>
          </div>

          {/* Card 3: Supporting Documents matching Figma section#d-docs-s #648:1113 */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
              <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                <FileText className="size-4.5" />
              </div>
              <h2 className="font-extrabold text-[#012A5E] text-base sm:text-lg">
                Supporting Documents
              </h2>
            </div>

            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 sm:p-6 flex items-center gap-4">
              <div className="size-11 rounded-xl bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center shrink-0">
                <FileText className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#012A5E]">
                  No supporting documents submitted
                </span>
                <span className="text-xs text-[#475569] mt-0.5">
                  No supporting documents were required for this application.
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Decision history matching Figma section #648:1128 */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
              <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                <Clock className="size-4.5" />
              </div>
              <h2 className="font-extrabold text-[#012A5E] text-base sm:text-lg">
                Decision history
              </h2>
            </div>

            <ol className="relative pl-6 space-y-6 text-xs sm:text-sm">
              {/* Event 1 */}
              <li className="relative">
                <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#005CE8] ring-4 ring-[#EBF3FE] flex items-center justify-center text-white">
                  <Check className="size-2.5 stroke-3" />
                </span>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#0F172A]">
                    Application submitted
                  </span>
                  <span className="text-[#64748B]">
                    {application.submittedDate ||
                      'Date not recorded in this prototype'}
                  </span>
                </div>
              </li>

              {/* Connecting vertical line */}
              <div className="absolute left-0.75 top-4 bottom-4 w-0.5 bg-[#E2E8F0] pointer-events-none" />

              {/* Event 2 */}
              <li className="relative">
                {application.status === 'pending' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-white border-2 border-dashed border-[#94A3B8] ring-4 ring-[#F8FAFC]" />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#0F172A]">
                        Awaiting decision
                      </span>
                      <span className="text-[#64748B]">
                        Approve or reject this application.
                      </span>
                    </div>
                  </>
                ) : application.status === 'approved' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#16A34A] ring-4 ring-[#DCFCE7] flex items-center justify-center text-white">
                      <Check className="size-2.5 stroke-3" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#14532D]">
                        Application approved
                      </span>
                      <span className="text-[#64748B]">
                        Recorded by Admin user
                      </span>
                    </div>
                  </>
                ) : application.status === 'rejected' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#DC2626] ring-4 ring-[#FEE2E2] flex items-center justify-center text-white">
                      <XCircle className="size-3" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#991B1B]">
                        Application rejected
                      </span>
                      <span className="text-[#64748B]">
                        Recorded by Admin user
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#D97706] ring-4 ring-[#FEF3C7] flex items-center justify-center text-white">
                      <AlertOctagon className="size-2.5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#92400E]">
                        Agent suspended
                      </span>
                      <span className="text-[#64748B]">
                        Recorded by Admin user
                      </span>
                    </div>
                  </>
                )}
              </li>
            </ol>
          </div>
        </div>

        {/* Right Sidebar Column (4 cols) matching Figma div.dg-s #648:1154 */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Decision Box matching Figma section#d-dec #648:1155 */}
          <div className="rounded-2xl bg-white border-2 border-[#93C5FD] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
              <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                <ShieldCheck className="size-4.5" />
              </div>
              <h2 className="font-extrabold text-[#012A5E] text-base">
                Decision
              </h2>
            </div>

            {application.status === 'pending' ? (
              <>
                <p className="text-xs text-[#4F5B70] leading-relaxed">
                  Review the business information, contact and documents, then
                  record a decision. The applicant is notified of the decision
                  by email.
                </p>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => setApproveDialogOpen(true)}
                    className="w-full h-12 rounded-xl bg-[#01533B] hover:bg-[#01402E] text-white font-bold text-sm gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="size-4.5" />
                    <span>Approve Application</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRejectDialogOpen(true)}
                    className="w-full h-11 rounded-xl border-[#FCA5A5] text-[#B91C1C] hover:bg-[#FEF2F2] font-bold text-sm gap-2 cursor-pointer transition-all"
                  >
                    <XCircle className="size-4.5 text-[#DC2626]" />
                    <span>Reject Application</span>
                  </Button>
                </div>
              </>
            ) : application.status === 'approved' ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3.5 flex items-start gap-3 text-xs text-[#166534]">
                  <CheckCircle2 className="size-4.5 shrink-0 text-[#16A34A] mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-[#14532D]">
                      Approved — decision completed
                    </span>
                    <span className="leading-snug text-[#166534]">
                      Approve and reject are no longer available for this
                      application.
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Agent lifecycle
                  </span>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    <strong className="text-[#0F172A]">
                      Agent status: Active.
                    </strong>{' '}
                    Suspending changes the Agent's access according to the
                    configured account rules.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSuspendDialogOpen(true)}
                    className="w-full mt-1.5 h-10 border-[#CBD5E1] text-[#DC2626] hover:bg-[#FEF2F2] hover:border-[#FCA5A5] font-bold rounded-xl flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <AlertOctagon className="size-3.5" />
                    <span>Suspend Agent</span>
                  </Button>
                </div>
              </div>
            ) : application.status === 'rejected' ? (
              <div className="rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] p-3.5 flex items-start gap-3 text-xs text-[#991B1B]">
                <XCircle className="size-4.5 shrink-0 text-[#DC2626] mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-[#991B1B]">
                    Application Rejected
                  </span>
                  <span className="leading-snug text-[#7F1D1D]">
                    This application was rejected and record preserved in
                    history.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="rounded-xl bg-[#FEF3C7] border border-[#FDE68A] p-3.5 flex items-start gap-3 text-xs text-[#92400E]">
                  <AlertOctagon className="size-4.5 shrink-0 text-[#D97706] mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-[#92400E]">
                      Agent Suspended
                    </span>
                    <span className="leading-snug text-[#78350F]">
                      Access is paused according to account security rules.
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => handleConfirmApprove(application.id)}
                  className="w-full h-10 bg-[#01533B] hover:bg-[#01402E] text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Reactivate Agent
                </Button>
              </div>
            )}
          </div>

          {/* Review Summary Checklist matching Figma #648:1172 */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
              <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                <ClipboardList className="size-4.5" />
              </div>
              <h2 className="font-extrabold text-[#012A5E] text-base">
                Review summary
              </h2>
            </div>

            <ul className="flex flex-col divide-y divide-[#F1F5F9] text-xs">
              <li className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-[#0F172A]">
                  <CheckCircle2 className="size-4 text-[#16A34A]" />
                  <span>Business Information</span>
                </div>
                <span className="font-bold text-[#16A34A]">Complete</span>
              </li>

              <li className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-[#0F172A]">
                  <CheckCircle2 className="size-4 text-[#16A34A]" />
                  <span>Primary Contact</span>
                </div>
                <span className="font-bold text-[#16A34A]">Complete</span>
              </li>

              <li className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-[#0F172A]">
                  <Clock className="size-4 text-[#94A3B8]" />
                  <span>Supporting Documents</span>
                </div>
                <span className="font-medium text-[#64748B]">
                  Not submitted · optional
                </span>
              </li>
            </ul>
          </div>

          {/* Decision Notification (visible once decided or configured) */}
          {application.status !== 'pending' && (
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                  <Mail className="size-4.5" />
                </div>
                <h2 className="font-extrabold text-[#012A5E] text-base">
                  Decision Notification
                </h2>
              </div>

              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 flex items-start gap-2.5 text-xs text-[#475569]">
                <Clock className="size-4 shrink-0 text-[#64748B] mt-0.5" />
                <span className="leading-snug">
                  Email notification pending — In this prototype the
                  notification stays pending — nothing is sent.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve Confirmation Dialog matching Figma #648:1247 */}
      <ApproveApplicationModal
        application={application}
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={() => handleConfirmApprove(application.id)}
      />

      {/* Reject Confirmation Dialog matching Figma #648:1249 */}
      <RejectApplicationModal
        application={application}
        isOpen={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={(note) => handleConfirmReject(application.id, note)}
      />

      {/* Suspend Confirmation Dialog matching Figma #648:1251 */}
      <SuspendAgentModal
        application={application}
        isOpen={suspendDialogOpen}
        onClose={() => setSuspendDialogOpen(false)}
        onConfirm={(note) => handleConfirmSuspend(application.id, note)}
      />
    </div>
  )
}

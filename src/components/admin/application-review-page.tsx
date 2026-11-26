import * as React from 'react'
import {
  ArrowLeft,
  Building2,
  User,
  FileText,
  Clock,
  CheckCircle2,
  CircleX as XCircle,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Globe,
  Mail,
  ShieldCheck,
  AlertOctagon,
  ExternalLink,
  ClipboardList,
  FileQuestion,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'
import { AdminFooter } from './admin-footer'
import { SidebarProvider } from '#/components/ui/sidebar'
import type { AgentApplication } from './application-review-modal'
import type { ApplicationStatus } from './status-metric-card'
import { ApproveApplicationModal } from './approve-application-modal'
import { RejectApplicationModal } from './reject-application-modal'
import { SuspendAgentModal } from './suspend-agent-modal'

interface ApplicationReviewPageProps {
  application: AgentApplication
  pendingCount?: number
  onBack: () => void
  onUpdateStatus: (
    id: string,
    newStatus: ApplicationStatus,
    extra?: Partial<AgentApplication>,
  ) => void
  initialOpenApprove?: boolean
}

export function ApplicationReviewPage({
  application: initialApp,
  pendingCount = 1,
  onBack,
  onUpdateStatus,
  initialOpenApprove = false,
}: ApplicationReviewPageProps) {
  const [application, setApplication] =
    React.useState<AgentApplication>(initialApp)
  const [isApproveOpen, setIsApproveOpen] = React.useState(initialOpenApprove)
  const [isRejectOpen, setIsRejectOpen] = React.useState(false)
  const [isSuspendOpen, setIsSuspendOpen] = React.useState(false)
  const [copiedField, setCopiedField] = React.useState<
    'email' | 'phone' | null
  >(null)
  const [bannerAlert, setBannerAlert] = React.useState<string | null>(null)

  // Keep internal app synced if parent updates
  React.useEffect(() => {
    setApplication(initialApp)
  }, [initialApp])

  const copyToClipboard = (text: string, field: 'email' | 'phone') => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedField(field)
    setTimeout(() => {
      setCopiedField(null)
    }, 2000)
  }

  const handleConfirmApprove = (id: string) => {
    const updated: Partial<AgentApplication> = {
      status: 'approved',
      reference:
        application.reference &&
        application.reference !== 'No reference assigned'
          ? application.reference
          : 'AGT-BD-2026-904',
      approvedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }
    setApplication((prev) => ({ ...prev, ...updated, status: 'approved' }))
    onUpdateStatus(id, 'approved', updated)
    setBannerAlert(
      `Application approved successfully! Decision completed and applicant onboarding started.`,
    )
  }

  const handleConfirmReject = (id: string, note?: string) => {
    const updated: Partial<AgentApplication> = {
      status: 'rejected',
      decisionNotes: note,
      rejectedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }
    setApplication((prev) => ({ ...prev, ...updated, status: 'rejected' }))
    onUpdateStatus(id, 'rejected', updated)
    setBannerAlert(
      `Application rejected. Decision notification recorded and applicant notified.`,
    )
  }

  const handleConfirmSuspend = (id: string, note?: string) => {
    const updated: Partial<AgentApplication> = {
      status: 'suspended',
      decisionNotes: note,
    }
    setApplication((prev) => ({ ...prev, ...updated, status: 'suspended' }))
    onUpdateStatus(id, 'suspended', updated)
    setBannerAlert(
      `Agent account ${application.businessName} has been suspended.`,
    )
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Agents', href: '/admin' },
    { label: 'Agent Applications', onClick: onBack },
    { label: application.businessName, active: true },
  ]

  return (
    <SidebarProvider defaultOpen className="min-h-screen w-full">
      <div className="min-h-screen flex w-full bg-[#F4F6FA] text-[#141C2E] font-sans antialiased">
        {/* 1. Desktop Sidebar */}
        <AdminSidebar pendingCount={pendingCount} />

        {/* 2. Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header with Dynamic Breadcrumbs */}
          <AdminHeader breadcrumbs={breadcrumbs} />

          {/* Page Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 max-w-[1664px] w-full mx-auto">
            {/* Back Navigation Button matching Figma button#dt-back */}
            <div className="flex items-center justify-between">
              <Button variant="plain"
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#005CE8] hover:text-[#0047B3] transition-colors cursor-pointer group"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to applications</span>
              </Button>

              {/* Quick action to trigger Approve modal directly if pending */}
              {application.status === 'pending' && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsApproveOpen(true)}
                  className="bg-[#01533B] text-white hover:bg-[#01402E] font-bold text-xs h-8 sm:hidden gap-1.5 rounded-lg shadow-sm"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Approve</span>
                </Button>
              )}
            </div>

            {/* Action Success / Status Banner */}
            {bannerAlert && (
              <div className="rounded-xl border border-[#2E7D32]/30 bg-[#E8F5E9] px-4 py-3 text-xs sm:text-sm font-semibold text-[#1B5E20] flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-[#2E7D32]" />
                  <span>{bannerAlert}</span>
                </div>
                <Button variant="plain"
                  type="button"
                  onClick={() => setBannerAlert(null)}
                  className="text-[#1B5E20] hover:text-black text-xs font-bold px-1.5 py-0.5 cursor-pointer"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Detail View Header Card (#648:985) */}
            <div className="rounded-[18px] border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm relative overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[#F59E0B]">
              <div className="flex flex-col gap-3.5 pl-1">
                {/* Tags line */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {application.status === 'pending' && (
                    <Badge className="bg-[#DDE9F8] text-[#012A5E] hover:bg-[#DDE9F8] border-none font-bold text-xs px-2.5 py-1 gap-1.5 shadow-none rounded-full">
                      <Clock className="size-3.5 text-[#005CE8]" />
                      <span>Pending Review</span>
                    </Badge>
                  )}
                  {application.status === 'approved' && (
                    <Badge className="bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#E8F5E9] border-none font-bold text-xs px-2.5 py-1 gap-1.5 shadow-none rounded-full">
                      <CheckCircle2 className="size-3.5 text-[#1B5E20]" />
                      <span>Approved</span>
                    </Badge>
                  )}
                  {application.status === 'rejected' && (
                    <Badge className="bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FEE2E2] border-none font-bold text-xs px-2.5 py-1 gap-1.5 shadow-none rounded-full">
                      <XCircle className="size-3.5 text-[#DC2626]" />
                      <span>Rejected</span>
                    </Badge>
                  )}
                  {application.status === 'suspended' && (
                    <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-none font-bold text-xs px-2.5 py-1 gap-1.5 shadow-none rounded-full">
                      <AlertTriangle className="size-3.5 text-[#D97706]" />
                      <span>Suspended</span>
                    </Badge>
                  )}

                  {/* QA DEMO DATA TAG */}
                  {application.isDemo && (
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#92400E] border border-[#E1BA6D]/50 tracking-wider">
                      QA DEMO DATA
                    </span>
                  )}
                </div>

                {/* Company Title */}
                <div>
                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#012A5E] tracking-tight leading-tight">
                    {application.businessName}
                  </h1>
                </div>

                {/* Meta Description List (#648:996) */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6 pt-2 border-t border-[#F1F5F9] text-xs sm:text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Application reference
                    </dt>
                    <dd className="font-medium text-[#64748B] italic mt-0.5">
                      {application.reference || 'No reference assigned'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Submitted
                    </dt>
                    <dd className="font-medium text-[#64748B] mt-0.5">
                      {application.submittedDate ||
                        'Not recorded in this prototype'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Business type
                    </dt>
                    <dd className="font-bold text-[#0F172A] mt-0.5">
                      {application.businessType || 'Travel agency'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Country
                    </dt>
                    <dd className="font-bold text-[#0F172A] mt-0.5">
                      {application.country || 'Bangladesh'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* 2-Column Responsive Layout Grid (#648:1018) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Business Info, Contact, Docs, History (8 cols on lg) */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                {/* Card 1: Business Information (#648:1020) */}
                <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                        <Building2 className="size-4.5" />
                      </div>
                      <h2 className="text-base font-bold text-[#012A5E]">
                        Business Information
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                      <Lock className="size-3 text-[#94A3B8]" />
                      Read-only · as submitted
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-4 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Legal Business Name
                      </dt>
                      <dd className="text-sm font-bold text-[#0F172A] mt-0.5">
                        {application.businessName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Trading Name
                      </dt>
                      <dd className="text-sm font-medium text-[#0F172A] mt-0.5">
                        {application.tradingName || application.businessName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Business Type
                      </dt>
                      <dd className="text-sm font-medium text-[#0F172A] mt-0.5">
                        {application.businessType}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Country
                      </dt>
                      <dd className="text-sm font-medium text-[#0F172A] mt-0.5">
                        {application.country}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        City
                      </dt>
                      <dd className="text-sm font-medium text-[#0F172A] mt-0.5">
                        {application.city || 'Dhaka'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Business Registration Number
                      </dt>
                      <dd className="text-sm font-mono text-[#0F172A] mt-0.5">
                        {application.registrationNumber || 'TR-BD-2026-904'}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Business Address
                      </dt>
                      <dd className="text-sm font-medium text-[#0F172A] mt-0.5 whitespace-pre-line">
                        {application.address ||
                          'House 12, Road 5, Demo Avenue\nDhaka 1200'}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Business Website
                      </dt>
                      <dd className="text-sm font-medium text-[#005CE8] mt-0.5">
                        <a
                          href={application.website || 'https://example.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 hover:underline"
                        >
                          <Globe className="size-3.5" />
                          <span>
                            {application.website || 'https://example.com'}
                          </span>
                          <ExternalLink className="size-3 text-[#005CE8]" />
                        </a>
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* Card 2: Primary Business Contact (#648:1066) */}
                <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                        <User className="size-4.5" />
                      </div>
                      <h2 className="text-base font-bold text-[#012A5E]">
                        Primary Business Contact
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                      <Lock className="size-3 text-[#94A3B8]" />
                      Read-only · as submitted
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-4 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Full Name
                      </dt>
                      <dd className="text-sm font-bold text-[#0F172A] mt-0.5">
                        {application.primaryContact}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Job Title
                      </dt>
                      <dd className="text-sm font-medium text-[#0F172A] mt-0.5">
                        Managing Director
                      </dd>
                    </div>

                    {/* Business Email with Copy Button */}
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Business Email
                      </dt>
                      <dd className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-[#0F172A]">
                          {application.email}
                        </span>
                        <Button variant="plain"
                          type="button"
                          onClick={() =>
                            copyToClipboard(application.email, 'email')
                          }
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

                    {/* Mobile Number with Country Flag Badge & Copy Button */}
                    <div>
                      <dt className="text-xs font-semibold text-[#64748B]">
                        Mobile Number
                      </dt>
                      <dd className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          BD
                        </span>
                        <span className="text-sm font-medium text-[#0F172A]">
                          {application.phone || '+880 1555 030405'}
                        </span>
                        <Button variant="plain"
                          type="button"
                          onClick={() =>
                            copyToClipboard(
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
                </section>

                {/* Card 3: Supporting Documents (#648:1113) */}
                <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-[#F1F5F9]">
                    <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                      <FileText className="size-4.5" />
                    </div>
                    <h2 className="text-base font-bold text-[#012A5E]">
                      Supporting Documents
                    </h2>
                  </div>

                  <div className="pt-4">
                    {/* Dashed Border Empty State matching Figma */}
                    <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 sm:p-6 flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center shrink-0">
                        <FileQuestion className="size-5 text-[#005CE8]" />
                      </div>
                      <div className="flex flex-col">
                        <b className="text-sm font-bold text-[#012A5E]">
                          No supporting documents submitted
                        </b>
                        <span className="text-xs text-[#475569] mt-0.5">
                          No supporting documents were required for this
                          application.
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Card 4: Decision History Timeline (#648:1128) */}
                <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-[#F1F5F9]">
                    <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                      <Clock className="size-4.5" />
                    </div>
                    <h2 className="text-base font-bold text-[#012A5E]">
                      Decision history
                    </h2>
                  </div>

                  <ol className="relative pl-6 pt-4 space-y-6 text-sm">
                    {/* Step 1: Application submitted */}
                    <li className="relative">
                      <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#005CE8] ring-4 ring-[#EBF3FE] flex items-center justify-center text-white">
                        <Check className="size-2.5 stroke-3" />
                      </span>
                      <div className="flex flex-col">
                        <b className="font-bold text-[#0F172A]">
                          Application submitted
                        </b>
                        <span className="text-xs text-[#64748B] mt-0.5">
                          {application.submittedDate ||
                            'Date not recorded in this prototype'}
                        </span>
                      </div>
                    </li>

                    {/* Vertical line connecting steps */}
                    <div className="absolute left-0.75 top-4 bottom-4 w-0.5 bg-[#E2E8F0] pointer-events-none" />

                    {/* Step 2: Awaiting decision or Recorded decision */}
                    {application.status === 'pending' && (
                      <li className="relative">
                        <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-white border-2 border-dashed border-[#94A3B8] ring-4 ring-[#F8FAFC]" />
                        <div className="flex flex-col">
                          <b className="font-bold text-[#0F172A]">
                            Awaiting decision
                          </b>
                          <span className="text-xs text-[#64748B] mt-0.5">
                            Approve or reject this application.
                          </span>
                        </div>
                      </li>
                    )}

                    {application.status === 'approved' && (
                      <li className="relative">
                        <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#16A34A] ring-4 ring-[#DCFCE7] flex items-center justify-center text-white">
                          <Check className="size-2.5 stroke-3" />
                        </span>
                        <div className="flex flex-col">
                          <b className="font-bold text-[#14532D]">
                            Application approved
                          </b>
                          <span className="text-xs text-[#64748B] mt-0.5">
                            Recorded by Admin user
                          </span>
                        </div>
                      </li>
                    )}

                    {application.status === 'rejected' && (
                      <li className="relative">
                        <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#DC2626] ring-4 ring-[#FEE2E2] flex items-center justify-center text-white">
                          <XCircle className="size-3" />
                        </span>
                        <div className="flex flex-col">
                          <b className="font-bold text-[#991B1B]">
                            Application rejected
                          </b>
                          <span className="text-xs text-[#64748B] mt-0.5">
                            Recorded by Admin user
                          </span>
                          {application.decisionNotes && (
                            <p className="text-xs text-[#7F1D1D] mt-1.5 p-2 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]/60">
                              &quot;{application.decisionNotes}&quot;
                            </p>
                          )}
                        </div>
                      </li>
                    )}

                    {application.status === 'suspended' && (
                      <li className="relative">
                        <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#D97706] ring-4 ring-[#FEF3C7] flex items-center justify-center text-white">
                          <AlertTriangle className="size-2.5" />
                        </span>
                        <div className="flex flex-col">
                          <b className="font-bold text-[#92400E]">
                            Agent suspended
                          </b>
                          <span className="text-xs text-[#64748B] mt-0.5">
                            Recorded by Admin user
                          </span>
                        </div>
                      </li>
                    )}
                  </ol>
                </section>
              </div>

              {/* Right Column: Decision Actions Card & Review Summary (4 cols on lg) */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                {/* Card 1: Decision Card matching Figma #648:1155 */}
                <section className="rounded-2xl border-2 border-[#93C5FD] bg-white p-5 sm:p-6 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                    <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                      <ShieldCheck className="size-4.5" />
                    </div>
                    <h2 className="text-base font-bold text-[#012A5E]">
                      Decision
                    </h2>
                  </div>

                  <div className="pt-3">
                    {application.status === 'pending' ? (
                      <>
                        <p className="text-xs text-[#4F5B70] leading-relaxed">
                          Review the business information, contact and
                          documents, then record a decision. The applicant is
                          notified of the decision by email.
                        </p>

                        <div className="flex flex-col gap-3 pt-4">
                          {/* Approve Button matching Figma button#b-ap (#648:1164) */}
                          <Button
                            type="button"
                            onClick={() => setIsApproveOpen(true)}
                            className="w-full h-12 bg-[#01533B] hover:bg-[#01402E] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="size-4.5" />
                            <span>Approve Application</span>
                          </Button>

                          {/* Reject Button matching Figma button#b-rj (#648:1168) */}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsRejectOpen(true)}
                            className="w-full h-11 border-[#FCA5A5] bg-white hover:bg-[#FEF2F2] text-[#B91C1C] font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                          >
                            <XCircle className="size-4 text-[#DC2626]" />
                            <span>Reject Application</span>
                          </Button>
                        </div>
                      </>
                    ) : application.status === 'approved' ? (
                      <div className="flex flex-col gap-4">
                        {/* Approved success notice matching suspend-agent.png */}
                        <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3.5 flex items-start gap-3 text-xs text-[#166534]">
                          <CheckCircle2 className="size-4.5 shrink-0 text-[#16A34A] mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-[#14532D]">
                              Approved — decision completed
                            </span>
                            <span className="leading-snug text-[#166534]">
                              Approve and reject are no longer available for
                              this application.
                            </span>
                          </div>
                        </div>

                        {/* Agent lifecycle section */}
                        <div className="pt-2 border-t border-[#F1F5F9] flex flex-col gap-2">
                          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                            Agent lifecycle
                          </span>
                          <p className="text-xs text-[#475569] leading-relaxed">
                            <strong className="text-[#0F172A]">
                              Agent status: Active.
                            </strong>{' '}
                            Suspending changes the Agent's access according to
                            the configured account rules.
                          </p>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsSuspendOpen(true)}
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
                            This application was rejected and record preserved
                            in history.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="rounded-xl bg-[#FEF3C7] border border-[#FDE68A] p-3.5 flex items-start gap-3 text-xs text-[#92400E]">
                          <AlertTriangle className="size-4.5 shrink-0 text-[#D97706] mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-[#92400E]">
                              Agent Suspended
                            </span>
                            <span className="leading-snug text-[#78350F]">
                              Access is paused according to account security
                              rules.
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
                </section>

                {/* Card 2: Review summary (#648:1172) */}
                <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
                    <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                      <ClipboardList className="size-4.5" />
                    </div>
                    <h2 className="text-base font-bold text-[#012A5E]">
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
                </section>

                {/* Card 3: Decision Notification (visible once decided) */}
                {application.status !== 'pending' && (
                  <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
                      <div className="size-8 rounded-lg bg-[#EBF3FE] text-[#005CE8] flex items-center justify-center">
                        <Mail className="size-4.5" />
                      </div>
                      <h2 className="text-base font-bold text-[#012A5E]">
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
                  </section>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>

        {/* Reusable Modals matching Figma */}
        <ApproveApplicationModal
          application={application}
          isOpen={isApproveOpen}
          onClose={() => setIsApproveOpen(false)}
          onConfirmApprove={handleConfirmApprove}
        />

        <RejectApplicationModal
          application={application}
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          onConfirmReject={handleConfirmReject}
        />

        <SuspendAgentModal
          application={application}
          isOpen={isSuspendOpen}
          onClose={() => setIsSuspendOpen(false)}
          onConfirmSuspend={handleConfirmSuspend}
        />
      </div>
    </SidebarProvider>
  )
}

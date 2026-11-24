import {
  Building2,
  Mail,
  CheckCircle2,
  CircleX as XCircle,
  Clock,
  AlertTriangle,
  Globe,
  FileCheck,
} from 'lucide-react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import type { ApplicationStatus } from './status-metric-card'
import type { AgentApplication } from './types'

export type { AgentApplication }

interface ApplicationReviewModalProps {
  application: AgentApplication | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void
}

export function ApplicationReviewModal({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
}: ApplicationReviewModalProps) {
  if (!application) return null

  const handleApprove = () => {
    onUpdateStatus(application.id, 'approved')
    onClose()
  }

  const handleReject = () => {
    onUpdateStatus(application.id, 'rejected')
    onClose()
  }

  // Suspends the application
  void function suspendApp() {
    onUpdateStatus(application.id, 'suspended')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPopup className="max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2">
              <DialogTitle>Application Review</DialogTitle>
              {application.isDemo && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFF8E7] text-[#92400E] border border-[#E1BA6D]/50">
                  QA DEMO DATA
                </span>
              )}
            </div>
            {application.status === 'pending' && (
              <Badge className="bg-[#DDE9F8] text-[#012A5E] border-none font-bold">
                <Clock className="size-3 mr-1" />
                Pending Review
              </Badge>
            )}
            {application.status === 'approved' && (
              <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-none font-bold">
                <CheckCircle2 className="size-3 mr-1" />
                Approved
              </Badge>
            )}
            {application.status === 'rejected' && (
              <Badge className="bg-[#FCE8E6] text-[#B71C1C] border-none font-bold">
                <XCircle className="size-3 mr-1" />
                Rejected
              </Badge>
            )}
            {application.status === 'suspended' && (
              <Badge className="bg-[#FFF8E1] text-[#B45309] border-none font-bold">
                <AlertTriangle className="size-3 mr-1" />
                Suspended
              </Badge>
            )}
          </div>
          <DialogDescription>
            Reference: {application.reference} · Submitted:{' '}
            {application.submittedDate}
          </DialogDescription>
        </DialogHeader>

        {/* Content sections */}
        <div className="flex flex-col gap-5 py-2">
          {/* Business Details Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E6EAF0] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#012A5E]">
              <Building2 className="size-4 text-[#0267B8]" />
              <span>Business Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-[#4F5B70] block">Legal Name</span>
                <span className="font-extrabold text-[#141C2E]">
                  {application.businessName}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">
                  Trading Name
                </span>
                <span className="font-medium text-[#141C2E]">
                  {application.tradingName || 'Same as legal name'}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">
                  Business Type
                </span>
                <span className="font-medium text-[#141C2E]">
                  {application.businessType}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">
                  Registration Number
                </span>
                <span className="font-medium text-[#141C2E]">
                  {application.registrationNumber || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">
                  Country & City
                </span>
                <span className="font-medium text-[#141C2E]">
                  {application.city ? `${application.city}, ` : ''}
                  {application.country}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">Address</span>
                <span className="font-medium text-[#141C2E]">
                  {application.address || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Contact Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E6EAF0] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#012A5E]">
              <Mail className="size-4 text-[#0267B8]" />
              <span>Primary Contact</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-[#4F5B70] block">Full Name</span>
                <span className="font-bold text-[#141C2E]">
                  {application.primaryContact}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">Email</span>
                <span className="font-medium text-[#141C2E]">
                  {application.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">Phone</span>
                <span className="font-medium text-[#141C2E]">
                  {application.phone || '+880 1712 000000'}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#4F5B70] block">Website</span>
                <span className="font-medium text-[#0267B8] flex items-center gap-1">
                  <Globe className="size-3" />
                  {application.website || 'https://skylinetravels.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Verification & Documents Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E6EAF0] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#012A5E]">
                <FileCheck className="size-4 text-[#0267B8]" />
                <span>Submitted Documents</span>
              </div>
              <span className="text-xs text-[#4F5B70]">
                {application.documents}
              </span>
            </div>
            <p className="text-xs text-[#7B7B7B] leading-relaxed">
              This application was imported from the registration prototype.
              Required verification files (trade license, certificate of
              incorporation) can be requested or verified here.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-[#DCE2EB] text-[#4F5B70]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            className="bg-[#C62828] text-white hover:bg-[#B71C1C]"
          >
            <XCircle className="size-4 mr-1.5" />
            Reject
          </Button>
          <Button
            type="button"
            onClick={handleApprove}
            className="bg-[#2E7D32] text-white hover:bg-[#1B5E20] font-bold"
          >
            <CheckCircle2 className="size-4 mr-1.5" />
            Approve Application
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

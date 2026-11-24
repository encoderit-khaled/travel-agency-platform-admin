import * as React from 'react'
import {
  FileEdit,
  Search,
  Mail,
  UserCheck,
  Check,
  ChevronUp,
  Shield,
  HelpCircle,
  FileCheck2,
} from 'lucide-react'

export interface RegistrationSidebarProps {
  businessName?: string
  primaryContact?: string
  completedStepsCount?: number
  totalStepsCount?: number
  documentStatus?: string
  submissionStatus?: string
}

export function RegistrationSidebar({
  businessName,
  primaryContact,
  completedStepsCount,
  totalStepsCount = 3,
  documentStatus,
  submissionStatus,
}: RegistrationSidebarProps) {
  const [isAccordionOpen, setIsAccordionOpen] = React.useState(true)

  return (
    <aside className="flex flex-col gap-5 w-full">
      {/* Optional Application Snapshot Card if metadata provided */}
      {businessName && (
        <div className="rounded-[18px] border border-[#BAE6FD] bg-[#F0F7FF] p-4.5 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0267B8]">
            <FileCheck2 className="size-4" />
            <span>Application Summary</span>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Agency:</span>
              <span className="font-bold text-[#141C2E] truncate max-w-[180px]">
                {businessName}
              </span>
            </div>
            {primaryContact && (
              <div className="flex justify-between">
                <span className="text-[#64748B]">Contact:</span>
                <span className="font-semibold text-[#141C2E]">
                  {primaryContact}
                </span>
              </div>
            )}
            {completedStepsCount !== undefined && (
              <div className="flex justify-between">
                <span className="text-[#64748B]">Progress:</span>
                <span className="font-bold text-[#0267B8]">
                  Step {completedStepsCount} of {totalStepsCount}
                </span>
              </div>
            )}
            {documentStatus && (
              <div className="flex justify-between">
                <span className="text-[#64748B]">Documents:</span>
                <span className="text-[#141C2E] font-medium">
                  {documentStatus}
                </span>
              </div>
            )}
            {submissionStatus && (
              <div className="flex justify-between">
                <span className="text-[#64748B]">Status:</span>
                <span
                  className={`font-bold ${
                    submissionStatus === 'Submitted'
                      ? 'text-[#059669]'
                      : 'text-[#D97706]'
                  }`}
                >
                  {submissionStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card 1: How partner registration works */}
      <div className="rounded-[18px] border border-[#DCE2EB] bg-white p-5 sm:p-6 shadow-xs">
        <h2 className="text-base font-extrabold text-[#012A5E]">
          How partner registration works
        </h2>

        <ol className="mt-5 relative flex flex-col gap-6">
          {/* Step 1 */}
          <li className="relative flex items-start gap-3.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EBF3FC] text-[#0267B8]">
              <FileEdit className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#012A5E]">
                1. Submit application
              </span>
              <p className="mt-0.5 text-xs text-[#4F5B70] leading-relaxed">
                Fill in your agency and contact details and upload any
                supporting documents.
              </p>
            </div>
            {/* Connector line */}
            <div className="absolute left-4 top-8 -bottom-4 w-px bg-[#E2E8F0]" />
          </li>

          {/* Step 2 */}
          <li className="relative flex items-start gap-3.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EBF3FC] text-[#0267B8]">
              <Search className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#012A5E]">
                2. Account review
              </span>
              <p className="mt-0.5 text-xs text-[#4F5B70] leading-relaxed">
                Our team will review your application and verify your details
                within 1–2 business days.
              </p>
            </div>
            {/* Connector line */}
            <div className="absolute left-4 top-8 -bottom-4 w-px bg-[#E2E8F0]" />
          </li>

          {/* Step 3 */}
          <li className="relative flex items-start gap-3.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EBF3FC] text-[#0267B8]">
              <Mail className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#012A5E]">
                3. Get approved
              </span>
              <p className="mt-0.5 text-xs text-[#4F5B70] leading-relaxed">
                Once approved, you’ll receive your login credentials to access
                the AeroWing B2B Portal.
              </p>
            </div>
            {/* Connector line */}
            <div className="absolute left-4 top-8 -bottom-4 w-px bg-[#E2E8F0]" />
          </li>

          {/* Step 4 */}
          <li className="relative flex items-start gap-3.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EBF3FC] text-[#0267B8]">
              <UserCheck className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#012A5E]">
                4. Start booking
              </span>
              <p className="mt-0.5 text-xs text-[#4F5B70] leading-relaxed">
                Access exclusive agent fares, book flights, manage itineraries,
                and earn commissions.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Card 2: What partners get (Accordion) */}
      <div className="rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-xs">
        <button
          type="button"
          className="flex w-full items-center justify-between cursor-pointer select-none text-left"
          onClick={() => setIsAccordionOpen((prev) => !prev)}
          aria-expanded={isAccordionOpen}
        >
          <h3 className="text-sm font-extrabold text-[#012A5E]">
            What partners get
          </h3>
          <ChevronUp
            className={`size-4 text-[#0267B8] transition-transform duration-200 ${
              isAccordionOpen ? '' : 'rotate-180'
            }`}
          />
        </button>

        {isAccordionOpen && (
          <div className="mt-4 flex flex-col gap-3.5 border-t border-[#F1F5F9] pt-3.5">
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-start gap-2.5 text-xs text-[#141C2E] font-medium leading-tight">
                <Check className="size-4 shrink-0 text-[#059669] stroke-[2.5] mt-0.5" />
                <span>Search and book on behalf of customers</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#141C2E] font-medium leading-tight">
                <Check className="size-4 shrink-0 text-[#059669] stroke-[2.5] mt-0.5" />
                <span>Agent dashboard and booking history</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#141C2E] font-medium leading-tight">
                <Check className="size-4 shrink-0 text-[#059669] stroke-[2.5] mt-0.5" />
                <span>Markup view, wallet and commission summary</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#141C2E] font-medium leading-tight">
                <Check className="size-4 shrink-0 text-[#059669] stroke-[2.5] mt-0.5" />
                <span>
                  Sub-agent management, credit requests, statements and reports
                </span>
              </li>
            </ul>

            <div className="text-[11.5px] text-[#4F5B70] leading-relaxed border-t border-[#E6EAF0] pt-3 mt-1">
              The full Agent Portal is on the AeroWing website. The AeroWing
              mobile app offers the agent dashboard, search and booking, markup
              view, booking history, wallet and commission summary.
            </div>
          </div>
        )}
      </div>

      {/* Card 3: Your information */}
      <div className="rounded-[16px] border border-[#DCE2EB] bg-white p-4.5 shadow-xs flex items-start gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EBF3FC] text-[#0267B8] mt-0.5">
          <Shield className="size-4 text-[#0267B8]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#012A5E]">Your information</h4>
          <p className="text-[11.5px] text-[#4F5B70] mt-0.5 leading-relaxed">
            Your details are used only to review this partner application.
          </p>
        </div>
      </div>

      {/* Card 4: Need help? */}
      <div className="rounded-[16px] border border-[#E6EAF0] bg-[#F8FAFD] p-4.5 shadow-xs flex items-start gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E2E8F0] text-[#4F5B70] mt-0.5">
          <HelpCircle className="size-4 text-[#0267B8]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#012A5E]">Need assistance?</h4>
          <p className="text-[11.5px] text-[#4F5B70] mt-0.5 leading-relaxed">
            Contact our agent support desk at{' '}
            <a
              href="mailto:partners@aerowing.com"
              className="text-[#0267B8] font-semibold hover:underline"
            >
              partners@aerowing.com
            </a>
          </p>
        </div>
      </div>
    </aside>
  )
}

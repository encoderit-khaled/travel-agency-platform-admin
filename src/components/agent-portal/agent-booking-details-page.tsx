import * as React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Download,
  CheckCircle2,
  Plane,
  Building,
  Package,
  Compass,
  Car,
  Ticket,
  Clock,
  XCircle,
  Info,
  FileText,
  Users,
  CreditCard,
  Network,
  Printer,
  ShieldCheck,
  AlertOctagon,
  Calendar,
  User,
  Check,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import {
  AgentPortalSidebar,
  AgentPortalHeader,
} from '#/components/agent-portal'
import {
  MIRPUR_DESK_DETAILS,
  SUB_AGENT_BOOKINGS,
} from '#/components/sub-agents/data'
import type {
  SubAgentBookingRecord,
  BookingServiceType,
} from '#/components/sub-agents/types'

export interface AgentBookingDetailsPageProps {
  initialBookingRef?: string
  deskName?: string
  parentAgentName?: string
  initialETicketOpen?: boolean
}

function getServiceIcon(service: BookingServiceType) {
  switch (service) {
    case 'Flight':
      return <Plane className="size-4 text-[#0267B8]" />
    case 'Hotel':
      return <Building className="size-4 text-[#0267B8]" />
    case 'Travel Package':
      return <Package className="size-4 text-[#0267B8]" />
    case 'Activity':
      return <Compass className="size-4 text-[#0267B8]" />
    case 'Car Rental':
      return <Car className="size-4 text-[#0267B8]" />
    default:
      return <Ticket className="size-4 text-[#0267B8]" />
  }
}

export function AgentBookingDetailsPage({
  initialBookingRef = 'AW-DEMO-FL-001',
  deskName = 'Mirpur Desk',
  parentAgentName = 'Skyline Demo Travels Ltd',
  initialETicketOpen = false,
}: AgentBookingDetailsPageProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [isTicketPreviewOpen, setIsTicketPreviewOpen] =
    React.useState(initialETicketOpen)
  const [downloadSuccessToast, setDownloadSuccessToast] = React.useState(false)

  // Find booking data or fallback to the primary demo flight booking
  const booking: SubAgentBookingRecord =
    SUB_AGENT_BOOKINGS.find((b) => b.ref === initialBookingRef) ||
    SUB_AGENT_BOOKINGS[0]

  const isFlight = booking.service === 'Flight'
  const isTicketed = booking.status === 'Ticketed'
  const isConfirmed = booking.status === 'Confirmed'
  const isPending = booking.status === 'Pending'
  const isCancelled = booking.status === 'Cancelled'

  const handleDownload = () => {
    setDownloadSuccessToast(true)
    setTimeout(() => {
      setDownloadSuccessToast(false)
    }, 3500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6FA] text-[#012A5E]">
      {/* Sidebar Navigation */}
      <AgentPortalSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        activePath="bookings"
      />

      {/* Main Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <AgentPortalHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          userName="Nusrat Jahan · Agent Owner"
          agencyName="Skyline Demo Travels Ltd"
          breadcrumbs={[
            { label: 'Dashboard' },
            { label: 'Sub-agents' },
            { label: deskName },
            { label: 'Booking Details', active: true },
          ]}
        />

        {/* Page Container */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6 pb-20">
          {/* Back link */}
          <div>
            <Link
              to="/sub-agents/bookings"
              search={{ booking: booking.ref }}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0267B8] hover:text-[#014A85] transition-colors py-1 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Booking History</span>
            </Link>
          </div>

          {/* Hero Banner Header */}
          <section className="bg-white rounded-2xl border border-[#DCE2EB] p-6 lg:p-7 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left Title and Badges */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0267B8]">
                  Agent Portal · M2.11 Agent Booking Details
                </p>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                  {booking.ref}
                </h1>

                <p className="text-sm font-medium text-[#60728D]">
                  {booking.service} booking for{' '}
                  <span className="font-bold text-[#012A5E]">
                    {booking.customer}
                  </span>
                </p>

                {/* Badge tags row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {isTicketed && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#047857]">
                      <CheckCircle2 className="size-3.5" />
                      Ticketed
                    </span>
                  )}
                  {isConfirmed && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#047857]">
                      <CheckCircle2 className="size-3.5" />
                      Confirmed
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF6E7] text-[#9A6400]">
                      <Clock className="size-3.5" />
                      Pending
                    </span>
                  )}
                  {isCancelled && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F1F3F6] text-[#60728D]">
                      <XCircle className="size-3.5" />
                      Cancelled
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2FA] text-[#0267B8]">
                    <Network className="size-3.5" />
                    Sub-agent booking
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#F1F3F6] text-[#60728D]">
                    <Info className="size-3 text-[#71829B]" />
                    Sample data
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                {isFlight && isTicketed && (
                  <Button
                    onClick={() => setIsTicketPreviewOpen(true)}
                    className="h-11 px-5 bg-[#F5A623] hover:bg-[#E09618] text-[#012A5E] font-bold text-sm shadow-sm transition-all rounded-xl"
                  >
                    <Eye className="size-4 mr-2 text-[#012A5E]" />
                    View E-ticket
                  </Button>
                )}

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="h-11 px-5 border-[#DCE2EB] bg-white hover:bg-[#F4F6FA] text-[#012A5E] font-bold text-sm shadow-2xs rounded-xl"
                >
                  <Download className="size-4 mr-2 text-[#0267B8]" />
                  Download E-ticket PDF
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 px-5 border-[#DCE2EB] bg-white hover:bg-[#F4F6FA] text-[#0267B8] font-bold text-sm shadow-2xs rounded-xl"
                >
                  <Link to="/sub-agents/bookings">
                    <ArrowLeft className="size-4 mr-2" />
                    Back to Booking History
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Download Notification Toast */}
          {downloadSuccessToast && (
            <div className="flex items-center justify-between gap-3 p-4 bg-[#EBF5EE] border border-[#CCE5D3] rounded-xl text-xs font-bold text-[#047857] shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-[#047857]" />
                <span>
                  E-ticket PDF downloaded successfully for booking {booking.ref}
                  .
                </span>
              </div>
              <button
                onClick={() => setDownloadSuccessToast(false)}
                className="text-[#047857] hover:opacity-75 font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Booking Summary */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-4 border-b border-[#F1F3F6]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-[#EAF2FA] flex items-center justify-center text-[#0267B8]">
                        <Ticket className="size-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-extrabold text-[#012A5E]">
                          Booking Summary
                        </CardTitle>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#60728D] bg-[#F1F3F6] px-2.5 py-0.5 rounded-full">
                      Sample data
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4">
                    {/* Booking Reference */}
                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Booking Reference
                      </dt>
                      <dd className="text-sm font-bold font-mono text-[#012A5E]">
                        {booking.ref}
                      </dd>
                    </div>

                    {/* Service */}
                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Service
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E] flex items-center gap-1.5">
                        {getServiceIcon(booking.service)}
                        <span>{booking.service}</span>
                      </dd>
                    </div>

                    {/* Booking Status */}
                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Booking Status
                      </dt>
                      <dd>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#047857]">
                          <CheckCircle2 className="size-3" />
                          {booking.status}
                        </span>
                      </dd>
                    </div>

                    {/* Travel Date */}
                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Travel / Service Date
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E]">
                        {booking.travelDate}
                      </dd>
                    </div>

                    {/* Customer */}
                    <div className="space-y-1 pt-3 border-t border-[#F1F3F6]">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Customer
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E]">
                        {booking.customer}
                      </dd>
                    </div>

                    {/* Created By */}
                    <div className="space-y-1 pt-3 border-t border-[#F1F3F6]">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Created By
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E]">
                        {deskName}
                      </dd>
                    </div>

                    {/* Booking Source */}
                    <div className="space-y-1 pt-3 border-t border-[#F1F3F6]">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Booking Source
                      </dt>
                      <dd>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-[#EAF2FA] text-[#0267B8]">
                          <Network className="size-3" />
                          Sub-agent
                        </span>
                      </dd>
                    </div>

                    {/* Parent Agent */}
                    <div className="space-y-1 pt-3 border-t border-[#F1F3F6]">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Parent Agent
                      </dt>
                      <dd
                        className="text-sm font-bold text-[#012A5E] truncate"
                        title={parentAgentName}
                      >
                        {parentAgentName}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Card 2: Booking Status */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#EBF5EE] flex items-center justify-center text-[#047857]">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Booking Status
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="bg-[#EBF5EE] border border-[#CCE5D3] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-[#047857]" />
                        <span className="text-base font-extrabold text-[#012A5E]">
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#60728D]">
                        An E-ticket is available for this booking.
                      </p>
                    </div>
                    {isTicketed && (
                      <Button
                        size="sm"
                        onClick={() => setIsTicketPreviewOpen(true)}
                        className="bg-white hover:bg-emerald-50 text-[#047857] border border-[#CCE5D3] font-bold text-xs shadow-2xs rounded-xl"
                      >
                        <Eye className="size-3.5 mr-1.5" />
                        Preview E-ticket
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Customer */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#FEF7ED] flex items-center justify-center text-[#D97706]">
                      <User className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Customer
                      </CardTitle>
                      <p className="text-xs text-[#60728D] mt-0.5">
                        The person this booking was made for
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Customer Name
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E]">
                        {booking.customer}
                      </dd>
                    </div>

                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Booking Type
                      </dt>
                      <dd className="text-xs font-medium text-[#60728D] flex items-center gap-1.5">
                        <Info className="size-3.5 text-[#0267B8]" />
                        <span>Booked on behalf of customer</span>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Card 4: Service Details */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#EAF2FA] flex items-center justify-center text-[#0267B8]">
                      <Plane className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Service Details
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Service
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E] flex items-center gap-1.5">
                        {getServiceIcon(booking.service)}
                        <span>{booking.service}</span>
                      </dd>
                    </div>

                    <div className="space-y-1">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Travel / Service Date
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E]">
                        {booking.travelDate}
                      </dd>
                    </div>

                    <div className="space-y-1 pt-3 border-t border-[#F1F3F6]">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Booking Status
                      </dt>
                      <dd>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#047857]">
                          <CheckCircle2 className="size-3" />
                          {booking.status}
                        </span>
                      </dd>
                    </div>

                    <div className="space-y-1 pt-3 border-t border-[#F1F3F6]">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Route details
                      </dt>
                      <dd className="text-sm font-semibold text-[#012A5E]">
                        {booking.routeOrItem ||
                          'Biman Bangladesh Airlines (BG-084) · Dhaka ➔ Dubai'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Card 5: Traveller Information */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#60728D]">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Traveller Information
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="bg-[#F8F9FC] border border-[#E6EAF0] rounded-xl p-4 flex items-start gap-3">
                    <Info className="size-5 text-[#60728D] mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <b className="text-sm font-bold text-[#012A5E] block">
                        Traveller details not provided in this design-preview
                        dataset
                      </b>
                      <p className="text-xs text-[#60728D]">
                        Traveller information will appear here when available
                        from the booking record.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 6: Payment Information */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#60728D]">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Payment Information
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="bg-[#F8F9FC] border border-[#E6EAF0] rounded-xl p-4 flex items-start gap-3">
                    <Info className="size-5 text-[#60728D] mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <b className="text-sm font-bold text-[#012A5E] block">
                        Not available in this design-preview dataset
                      </b>
                      <p className="text-xs text-[#60728D]">
                        Payment information will be shown here when available
                        from the booking record.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 7: Booking Activity */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#60728D]">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Booking Activity
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="bg-[#F8F9FC] border border-[#E6EAF0] rounded-xl p-4 flex items-start gap-3">
                    <Info className="size-5 text-[#60728D] mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <b className="text-sm font-bold text-[#012A5E] block">
                        Not available
                      </b>
                      <p className="text-xs text-[#60728D]">
                        Detailed booking activity is not available in this
                        design-preview dataset.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Documents */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#EBF5EE] flex items-center justify-center text-[#047857]">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Documents
                      </CardTitle>
                      <p className="text-xs text-[#60728D] mt-0.5">
                        Flights use an E-ticket
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {/* Document Card Preview */}
                  <div className="rounded-2xl border border-[#D0E2FF] bg-[#F0F6FC] p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-[#EBF5EE] flex items-center justify-center text-[#047857]">
                        <Ticket className="size-5" />
                      </div>
                      <div>
                        <b className="text-sm font-bold text-[#012A5E] block">
                          E-ticket
                        </b>
                        <small className="text-xs text-[#60728D]">
                          E-ticket available
                        </small>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        onClick={() => setIsTicketPreviewOpen(true)}
                        variant="outline"
                        size="sm"
                        className="w-full bg-white hover:bg-[#F4F6FA] border-[#DCE2EB] text-[#012A5E] font-bold text-xs rounded-xl shadow-2xs"
                      >
                        <Eye className="size-3.5 mr-1 text-[#0267B8]" />
                        View
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="w-full bg-white hover:bg-[#F4F6FA] border-[#DCE2EB] text-[#012A5E] font-bold text-xs rounded-xl shadow-2xs"
                      >
                        <Download className="size-3.5 mr-1 text-[#0267B8]" />
                        PDF
                      </Button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#60728D] leading-relaxed">
                    E-tickets are automatically issued for ticketed flights. You
                    can print, view, or forward this document directly to the
                    customer.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2: Booking Source & Hierarchy */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#EAF2FA] flex items-center justify-center text-[#0267B8]">
                      <Network className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Booking Source
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <dl className="space-y-3 pb-3 border-b border-[#F1F3F6]">
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Created By
                      </dt>
                      <dd className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-[#012A5E]">
                          {deskName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EAF2FA] text-[#0267B8]">
                          <Network className="size-3" />
                          Sub-agent
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#60728D]">
                        Parent Agent
                      </dt>
                      <dd className="text-sm font-bold text-[#012A5E] mt-0.5">
                        {parentAgentName}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex items-start gap-2 text-xs text-[#60728D]">
                    <Info className="size-3.5 text-[#0267B8] shrink-0 mt-0.5" />
                    <span>
                      Created by {deskName} on behalf of a customer under{' '}
                      {parentAgentName}.
                    </span>
                  </div>

                  {/* Booking Hierarchy Flow */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#60728D] block">
                      Booking Hierarchy
                    </span>

                    {/* Step 1: Parent Agent */}
                    <div className="p-3 rounded-xl border border-[#DCE2EB] bg-white flex items-center gap-3 shadow-2xs">
                      <div className="size-9 rounded-full bg-[#012A5E] flex items-center justify-center text-[#FFC72C] font-extrabold text-xs shrink-0">
                        SD
                      </div>
                      <div className="min-w-0 flex-1">
                        <small className="text-[11px] font-medium text-[#60728D] block">
                          Parent Agent
                        </small>
                        <b className="text-xs font-bold text-[#012A5E] truncate block">
                          {parentAgentName}
                        </b>
                      </div>
                    </div>

                    {/* Connector 1 */}
                    <div className="flex items-center justify-center gap-2 py-0.5">
                      <div className="h-4 w-px bg-[#DCE2EB]" />
                      <span className="text-[10px] font-semibold text-[#60728D] uppercase tracking-wider bg-[#F4F6FA] px-2 py-0.5 rounded">
                        delegated to
                      </span>
                      <div className="h-4 w-px bg-[#DCE2EB]" />
                    </div>

                    {/* Step 2: Sub-agent */}
                    <div className="p-3 rounded-xl border border-[#DCE2EB] bg-white flex items-center gap-3 shadow-2xs">
                      <div className="size-9 rounded-full bg-[#EAF2FA] flex items-center justify-center text-[#012A5E] font-extrabold text-xs shrink-0">
                        MD
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <small className="text-[11px] font-medium text-[#60728D] block">
                            Sub-agent
                          </small>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EAF2FA] text-[#0267B8]">
                            Sub-agent
                          </span>
                        </div>
                        <b className="text-xs font-bold text-[#012A5E] truncate block">
                          {deskName}
                        </b>
                      </div>
                    </div>

                    {/* Connector 2 */}
                    <div className="flex items-center justify-center gap-2 py-0.5">
                      <div className="h-4 w-px bg-[#DCE2EB]" />
                      <span className="text-[10px] font-semibold text-[#60728D] uppercase tracking-wider bg-[#F4F6FA] px-2 py-0.5 rounded">
                        booked for
                      </span>
                      <div className="h-4 w-px bg-[#DCE2EB]" />
                    </div>

                    {/* Step 3: Customer */}
                    <div className="p-3 rounded-xl border border-[#DCE2EB] bg-white flex items-center gap-3 shadow-2xs">
                      <div className="size-9 rounded-full bg-[#FEF7ED] flex items-center justify-center text-[#B45309] font-extrabold text-xs shrink-0">
                        AR
                      </div>
                      <div className="min-w-0 flex-1">
                        <small className="text-[11px] font-medium text-[#60728D] block">
                          Customer
                        </small>
                        <b className="text-xs font-bold text-[#012A5E] truncate block">
                          {booking.customer}
                        </b>
                      </div>
                    </div>
                  </div>

                  {/* View Sub-agent button */}
                  <div className="pt-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-white hover:bg-[#F4F6FA] border-[#DCE2EB] text-[#012A5E] font-bold text-xs rounded-xl shadow-2xs h-10"
                    >
                      <Link to="/sub-agents/details">
                        <User className="size-3.5 mr-2 text-[#0267B8]" />
                        <span>View {deskName}</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Agent Settlement */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white shadow-2xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-[#F1F3F6]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[#FEF7ED] flex items-center justify-center text-[#D97706]">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#012A5E]">
                        Agent Settlement
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="rounded-xl border border-[#E6EAF0] bg-[#F8F9FC] p-3.5 flex items-start gap-3">
                    <Info className="size-4 text-[#0267B8] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <b className="text-xs font-extrabold text-[#012A5E] block">
                        Agent settlement note
                      </b>
                      <p className="text-xs text-[#60728D] leading-relaxed">
                        This booking is settled against {parentAgentName}’s
                        wallet and available credit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1 text-xs text-[#60728D]">
                    <AlertOctagon className="size-3.5 text-[#60728D] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Cancellation and refund actions are handled in their
                      dedicated workflows where available.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-white border-t border-[#DCE2EB] px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#60728D] mt-auto">
          <span>AeroWing Agent Portal · M2.11 Booking Details</span>
          <span className="text-center sm:text-right">
            Website only · configuration prototype — no prices are calculated
            and the real pricing engine is not changed.
          </span>
        </footer>
      </div>

      {/* E-ticket Preview Dialog Modal (Figma #707:19884) */}
      <Dialog open={isTicketPreviewOpen} onOpenChange={setIsTicketPreviewOpen}>
        <DialogContent className="sm:max-w-[640px] p-6 max-h-[92vh] overflow-y-auto rounded-2xl bg-white border-[#DCE2EB]">
          <DialogHeader className="pb-3 border-b border-[#F1F3F6]">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-extrabold text-[#012A5E]">
                  Electronic Ticket Receipt
                </DialogTitle>
                <DialogDescription className="text-xs text-[#60728D]">
                  Issued by AeroWing Platform · Reference {booking.ref}
                </DialogDescription>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#047857]">
                <Check className="size-3.5" />
                CONFIRMED & TICKETED
              </span>
            </div>
          </DialogHeader>

          {/* Ticket Body Card */}
          <div className="space-y-6 pt-2">
            {/* Airline Header */}
            <div className="p-4 rounded-xl bg-[#012A5E] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Plane className="size-6 text-[#FFC72C]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base tracking-wide">
                    Biman Bangladesh Airlines
                  </h4>
                  <p className="text-xs text-white/70">
                    Flight BG-084 · Non-stop
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                  PNR
                </span>
                <span className="font-mono font-extrabold text-sm text-[#FFC72C]">
                  {booking.pnr || 'PK782D'}
                </span>
              </div>
            </div>

            {/* Passenger & Ticket Information */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F8F9FC] border border-[#E6EAF0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60728D] block">
                  Passenger Name
                </span>
                <span className="text-sm font-bold text-[#012A5E]">
                  {booking.customer}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60728D] block">
                  E-Ticket Number
                </span>
                <span className="text-sm font-mono font-bold text-[#012A5E]">
                  077-2490182741
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60728D] block">
                  Cabin Class
                </span>
                <span className="text-sm font-bold text-[#012A5E]">
                  Economy (Y)
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60728D] block">
                  Seat
                </span>
                <span className="text-sm font-bold text-[#012A5E]">
                  24A (Confirmed)
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60728D] block">
                  Baggage
                </span>
                <span className="text-sm font-bold text-[#012A5E]">
                  30 KG Included
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60728D] block">
                  Date of Issue
                </span>
                <span className="text-sm font-bold text-[#012A5E]">
                  {booking.travelDate}
                </span>
              </div>
            </div>

            {/* Flight Route Details */}
            <div className="border border-[#DCE2EB] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#60728D] pb-3 border-b border-[#F1F3F6]">
                <span>Dhaka (DAC) ➔ Dubai (DXB)</span>
                <span>Travel Date: {booking.travelDate}</span>
              </div>

              <div className="grid grid-cols-3 items-center gap-2 text-center">
                <div className="text-left">
                  <span className="text-2xl font-extrabold text-[#012A5E] block">
                    14:30
                  </span>
                  <b className="text-xs font-bold text-[#012A5E] block">DAC</b>
                  <small className="text-[11px] text-[#60728D]">
                    Hazrat Shahjalal Intl, T2
                  </small>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-medium text-[#60728D]">
                    4h 50m
                  </span>
                  <div className="w-full flex items-center justify-center my-1">
                    <div className="h-0.5 flex-1 bg-[#DCE2EB]" />
                    <Plane className="size-4 text-[#0267B8] mx-2 rotate-90" />
                    <div className="h-0.5 flex-1 bg-[#DCE2EB]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#047857]">
                    Direct Flight
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#012A5E] block">
                    18:20
                  </span>
                  <b className="text-xs font-bold text-[#012A5E] block">DXB</b>
                  <small className="text-[11px] text-[#60728D]">
                    Dubai Intl, Terminal 1
                  </small>
                </div>
              </div>
            </div>

            {/* Barcode & Agency Info */}
            <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E6EAF0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-xs text-[#60728D]">
                <p>
                  <strong className="text-[#012A5E]">Agency:</strong>{' '}
                  {parentAgentName}
                </p>
                <p>
                  <strong className="text-[#012A5E]">Issued By:</strong>{' '}
                  {deskName}
                </p>
                <p className="text-[10px]">
                  This is an official electronic travel document. Please carry
                  valid passport & visa.
                </p>
              </div>

              {/* Simulated barcode */}
              <div className="bg-white p-2.5 rounded-lg border border-[#DCE2EB] shrink-0 text-center">
                <div className="h-9 w-36 flex items-center justify-between gap-0.5 overflow-hidden">
                  {[
                    4, 2, 5, 1, 3, 2, 4, 1, 6, 2, 3, 1, 4, 5, 2, 1, 3, 2, 5, 2,
                    4, 1, 3, 2, 4, 1,
                  ].map((w, i) => (
                    <div
                      key={i}
                      className="h-full bg-slate-900"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-[#60728D] block mt-1">
                  *0772490182741*
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="h-10 px-4 border-[#DCE2EB] text-[#012A5E] font-bold text-xs rounded-xl"
              >
                <Printer className="size-3.5 mr-2" />
                Print Ticket
              </Button>
              <Button
                onClick={() => {
                  handleDownload()
                  setIsTicketPreviewOpen(false)
                }}
                className="h-10 px-4 bg-[#0267B8] hover:bg-[#014A85] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                <Download className="size-3.5 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

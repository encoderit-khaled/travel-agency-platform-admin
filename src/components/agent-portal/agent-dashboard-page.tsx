import * as React from 'react'
import {
  Plane,
  Building2,
  Briefcase,
  Ticket,
  Car,
  Smartphone,
  Train,
  ShieldCheck,
  ArrowRight,
  Plus,
  Wallet,
  CreditCard,
  Coins,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Percent,
  Users,
  FileText,
  BarChart3,
  ChevronRight,
  CalendarX2,
  Sparkles,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react'
import { AgentPortalSidebar } from './agent-portal-sidebar'
import { AgentPortalHeader } from './agent-portal-header'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { DatePicker } from '#/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import { Label } from '#/components/ui/label'
import { cn } from 'cn'

type TravelServiceType =
  | 'Flights'
  | 'Hotels'
  | 'Travel Packages'
  | 'Activities'
  | 'Car Rental'
  | 'eSIM'
  | 'Bus / Train'
  | 'Travel Insurance'

export interface AgentDashboardPageProps {
  initialMenu?: 'dropdown' | 'notifications'
  initialTab?: string
  initialPopulated?: boolean
}

export function AgentDashboardPage({
  initialMenu,
  initialTab = 'Dashboard',
  initialPopulated = false,
}: AgentDashboardPageProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [activeNav, setActiveNav] = React.useState(initialTab)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedService, setSelectedService] =
    React.useState<TravelServiceType>('Flights')

  // Demo toggle: Prototype empty state (exact Figma #660:5189) vs Populated demo
  const [isDemoPopulated, setIsDemoPopulated] = React.useState(initialPopulated)

  // Interactive modal states
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false)
  const [topUpModalOpen, setTopUpModalOpen] = React.useState(false)
  const [creditModalOpen, setCreditModalOpen] = React.useState(false)
  const [subAgentModalOpen, setSubAgentModalOpen] = React.useState(false)

  const travelServices: {
    id: TravelServiceType
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    { id: 'Flights', label: 'Flights', icon: Plane },
    { id: 'Hotels', label: 'Hotels', icon: Building2 },
    { id: 'Travel Packages', label: 'Travel Packages', icon: Briefcase },
    { id: 'Activities', label: 'Activities', icon: Ticket },
    { id: 'Car Rental', label: 'Car Rental', icon: Car },
    { id: 'eSIM', label: 'eSIM', icon: Smartphone },
    { id: 'Bus / Train', label: 'Bus / Train', icon: Train },
    { id: 'Travel Insurance', label: 'Travel Insurance', icon: ShieldCheck },
  ]

  const handleServiceSelect = (service: TravelServiceType) => {
    setSelectedService(service)
  }

  const handleStartBooking = () => {
    setBookingModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col antialiased font-sans text-[#141C2E]">
      {/* Shell Layout matching Figma #660:5190 */}
      <div className="flex flex-1 w-full min-h-screen">
        {/* Desktop Sidebar (Figma #660:5191) */}
        <AgentPortalSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          currentTab={activeNav}
          onSelectNav={setActiveNav}
          className="hidden lg:flex"
        />

        {/* Main Content Area (Figma #660:5270) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header (Figma #660:5813 & #660:5853 Dropdown Menu) */}
          <AgentPortalHeader
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            initialMenu={initialMenu}
            breadcrumbs={[
              { label: 'Agent Portal', active: false },
              { label: activeNav, active: true },
            ]}
          />

          {/* Page Body Container (Figma #660:5271) */}
          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-[1600px] w-full mx-auto space-y-6 sm:space-y-8">
            {/* 1. Page Header / Welcome Greeting matching Figma #660:5273 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
              <div className="space-y-1.5 min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#0267B8]">
                  Agent Portal · Dashboard
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                  Welcome back
                </h1>

                {/* Business Meta line #660:5279 */}
                <div className="flex items-center flex-wrap gap-2 pt-0.5">
                  <span className="font-extrabold text-sm sm:text-base text-[#012A5E]">
                    Skyline Demo Travels Ltd
                  </span>
                  <span className="inline-flex items-center rounded-md bg-[#F1C134] px-2 py-0.5 text-[11px] font-extrabold tracking-wider text-[#012A5E] shadow-2xs">
                    QA DEMO DATA
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E6EAF0] px-2.5 py-0.5 text-xs font-bold text-[#012A5E]">
                    <ShieldCheck className="size-3.5 text-[#0267B8]" />
                    Agent Owner
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#4F5B70] pt-1">
                  Manage your bookings, customers and business activity from
                  your Agent Portal.
                </p>
              </div>

              {/* Action Buttons Top Right #660:5290 */}
              <div className="flex items-center md:flex-col md:items-end gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDemoPopulated((prev) => !prev)}
                    className="h-10 text-xs font-bold text-[#012A5E] border-[#DCE2EB] bg-white hover:bg-[#F4F6FA]"
                    title="Toggle between Figma prototype empty state and populated preview"
                  >
                    <RotateCcw className="size-3.5 mr-1.5 text-[#0267B8]" />
                    {isDemoPopulated
                      ? 'Show Empty State'
                      : 'Populate Demo Data'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleStartBooking}
                    className="h-11 px-5 rounded-xl font-extrabold text-sm text-[#012A5E] bg-[#F1C134] hover:bg-[#E5B52E] shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="size-4.5 stroke-[2.5]" />
                    <span>New Booking</span>
                  </Button>
                </div>

                <span className="text-[11px] text-[#4F5B70] font-medium hidden md:block">
                  Book on behalf of a customer
                </span>
              </div>
            </div>

            {/* 2. Hero Quick Start Banner matching Figma #660:5298 */}
            <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-linear-to-br from-[#001A3D] via-[#012A5E] to-[#0F3F7D] text-white shadow-xl">
              {/* Radial glow background & decorative accent rings */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_100%_0%,rgba(10,118,204,0.45)_0%,transparent_60%)]"
                aria-hidden="true"
              />
              <div
                className="absolute -right-16 -top-16 size-80 rounded-full border-[32px] border-[#F1C134]/10 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col gap-6">
                {/* Banner Header #660:5300 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9D7EA]">
                    <Sparkles className="size-4 text-[#F1C134]" />
                    <span>Book on behalf of a customer</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                    Start your first booking
                  </h2>
                  <p className="text-xs sm:text-sm text-[#C9D7EA] max-w-xl">
                    Search Aero Wing travel services and create a booking for
                    your customer.
                  </p>
                </div>

                {/* Travel Service Option Buttons #660:5310 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
                  {travelServices.map((service) => {
                    const Icon = service.icon
                    const isSelected = selectedService === service.id
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleServiceSelect(service.id)}
                        className={cn(
                          'flex flex-col items-center justify-center p-3 sm:py-4 sm:px-2 rounded-xl border text-center transition-all cursor-pointer group',
                          isSelected
                            ? 'bg-white/16 border-[#F1C134] ring-2 ring-[#F1C134]/30 shadow-md scale-[1.02]'
                            : 'bg-white/6 hover:bg-white/12 border-white/16 text-white',
                        )}
                      >
                        <div
                          className={cn(
                            'size-9 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110',
                            isSelected
                              ? 'bg-[#F1C134] text-[#012A5E]'
                              : 'bg-white/12 text-white',
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <span
                          className={cn(
                            'text-xs font-bold leading-tight',
                            isSelected ? 'text-[#F1C134]' : 'text-white',
                          )}
                        >
                          {service.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Banner Action Bar #660:5351 */}
                <div className="pt-2 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C9D7EA]">
                    <span className="size-2 rounded-full bg-[#F1C134] animate-pulse" />
                    <span>
                      Selected service: {selectedService} · Search real-time
                      inventory & net agent fares
                    </span>
                  </div>

                  <Button
                    type="button"
                    onClick={handleStartBooking}
                    className="h-10 px-5 rounded-xl font-extrabold text-xs sm:text-sm text-[#012A5E] bg-[#F1C134] hover:bg-[#E5B52E] shadow-sm transition-all"
                  >
                    <span>Start New Booking</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </section>

            {/* 3. Business Summary 4 KPI Cards matching Figma #660:5365 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* KPI 1: Wallet Balance */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                    Wallet Balance
                  </span>
                  <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center">
                    <Wallet className="size-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#012A5E]">
                    {isDemoPopulated ? '$24,850.00' : '—'}
                  </p>
                  <p className="text-xs text-[#4F5B70] mt-1 font-medium">
                    {isDemoPopulated
                      ? 'Available for booking'
                      : 'Not available'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setTopUpModalOpen(true)}
                    className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                  >
                    View Wallet <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </Card>

              {/* KPI 2: Available Credit */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                    Available Credit
                  </span>
                  <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <CreditCard className="size-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#012A5E]">
                    {isDemoPopulated ? '$50,000.00' : '—'}
                  </p>
                  <p className="text-xs text-[#4F5B70] mt-1 font-medium">
                    {isDemoPopulated
                      ? 'Credit facility active'
                      : 'Not available'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setCreditModalOpen(true)}
                    className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                  >
                    View Credit <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </Card>

              {/* KPI 3: Commission */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                    Commission
                  </span>
                  <div className="size-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Coins className="size-5" />
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#4F5B70]">Pending</span>
                    <span className="font-extrabold text-[#012A5E]">
                      {isDemoPopulated ? '$1,420.00' : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#4F5B70]">Earned</span>
                    <span className="font-extrabold text-[#012A5E]">
                      {isDemoPopulated ? '$3,890.00' : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#4F5B70]">Settled</span>
                    <span className="font-extrabold text-[#012A5E]">
                      {isDemoPopulated ? '$12,300.00' : '—'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                  <a
                    href="#c-cm"
                    className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                  >
                    View Commission <ChevronRight className="size-3.5" />
                  </a>
                </div>
              </Card>

              {/* KPI 4: Active Bookings */}
              <Card className="rounded-2xl border-[#DCE2EB] bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4F5B70] uppercase tracking-wide">
                    Active Bookings
                  </span>
                  <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CalendarDays className="size-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#012A5E]">
                    {isDemoPopulated ? '14' : '0'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#4F5B70] mt-1 font-medium">
                    <span>
                      Upcoming:{' '}
                      <b className="text-[#012A5E]">
                        {isDemoPopulated ? '8' : '0'}
                      </b>
                    </span>
                    <span>
                      Confirmed:{' '}
                      <b className="text-[#012A5E]">
                        {isDemoPopulated ? '6' : '0'}
                      </b>
                    </span>
                  </div>
                </div>
                <div className="mt-3.5 pt-3 border-t border-[#F1F5F9]">
                  <a
                    href="#c-bk"
                    className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                  >
                    View All Bookings <ChevronRight className="size-3.5" />
                  </a>
                </div>
              </Card>
            </div>

            {/* 4. Dashboard Modules Grid matching Figma #660:5456 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Module 1: Recent Bookings (Figma section#c-bk #660:5457) */}
              <Card
                id="c-bk"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5458 */}
                  <div className="p-5 pb-3 flex items-start gap-3 border-b border-[#F1F5F9]">
                    <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                      <CalendarDays className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#012A5E] text-base">
                        Recent Bookings
                      </h3>
                      <p className="text-xs text-[#4F5B70]">
                        Agent and Sub-agent bookings for your customers
                      </p>
                    </div>
                  </div>

                  {/* Body Empty State #660:5467 */}
                  <div className="p-6 text-center flex flex-col items-center justify-center min-h-[220px]">
                    {isDemoPopulated ? (
                      <div className="w-full text-left space-y-3">
                        <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[#012A5E]">
                              DAC → LHR · Return
                            </p>
                            <p className="text-[11px] text-[#4F5B70]">
                              2 Passengers · British Airways
                            </p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Confirmed
                          </Badge>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[#012A5E]">
                              Bangkok Marriott Hotel
                            </p>
                            <p className="text-[11px] text-[#4F5B70]">
                              3 Nights · Deluxe Room
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Upcoming
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="size-14 rounded-2xl bg-[#F4F6FA] text-[#8EAECF] flex items-center justify-center mb-3">
                          <CalendarX2 className="size-7" />
                        </div>
                        <h4 className="font-extrabold text-sm text-[#012A5E]">
                          No bookings yet
                        </h4>
                        <p className="text-xs text-[#4F5B70] max-w-xs mt-1">
                          You haven't made any bookings yet. Start searching and
                          create your first customer booking.
                        </p>
                        <Button
                          type="button"
                          onClick={handleStartBooking}
                          className="mt-4 h-9 px-4 rounded-xl text-xs font-bold bg-[#0267B8] hover:bg-[#012A5E] text-white"
                        >
                          <Plus className="size-3.5 mr-1" />
                          Start New Booking
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={handleStartBooking}
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View All Bookings <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Module 2: Needs Attention (Figma section#c-att #660:5487) */}
              <Card
                id="c-att"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5488 */}
                  <div className="p-5 pb-3 flex items-start gap-3 border-b border-[#F1F5F9]">
                    <div className="size-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <AlertCircle className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#012A5E] text-base">
                        Needs Attention
                      </h3>
                      <p className="text-xs text-[#4F5B70]">
                        Actionable items for your business
                      </p>
                    </div>
                  </div>

                  {/* Body State #660:5497 */}
                  <div className="p-6 flex flex-col items-start gap-3 min-h-[220px]">
                    <div className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-900">
                      <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-emerald-950">
                          Nothing needs your attention right now.
                        </p>
                        <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                          Booking actions, credit, wallet and commission updates
                          will appear here as they occur.
                        </p>
                      </div>
                    </div>

                    <div className="w-full p-3 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] text-xs text-[#4F5B70]">
                      <span className="font-bold text-[#012A5E]">Tip:</span> You
                      can configure real-time email & SMS notification alerts in
                      Account Settings.
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <a
                      href="#notifications"
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Notifications <ChevronRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </Card>

              {/* Module 3: Wallet (Figma section#c-wal #660:5510) */}
              <Card
                id="c-wal"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5511 */}
                  <div className="p-5 pb-3 flex items-start gap-3 border-b border-[#F1F5F9]">
                    <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                      <Wallet className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#012A5E] text-base">
                        Wallet
                      </h3>
                      <p className="text-xs text-[#4F5B70]">
                        Agent wallet and ledger
                      </p>
                    </div>
                  </div>

                  {/* Body Content #660:5520 */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB]">
                      <div>
                        <span className="text-[11px] font-bold text-[#4F5B70] uppercase">
                          Current Balance
                        </span>
                        <p className="text-lg font-extrabold text-[#012A5E] mt-0.5">
                          {isDemoPopulated ? '$24,850.00' : '—'}
                        </p>
                        <span className="text-[10px] text-[#8EAECF]">
                          {isDemoPopulated ? 'Updated today' : 'Not available'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#4F5B70] uppercase">
                          Latest transaction
                        </span>
                        <p className="text-lg font-extrabold text-[#012A5E] mt-0.5">
                          {isDemoPopulated ? '+$5,000.00' : '—'}
                        </p>
                        <span className="text-[10px] text-[#8EAECF]">
                          {isDemoPopulated ? 'Card Deposit' : 'Not available'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#4F5B70] leading-relaxed">
                      Top up by card payment or by a manual deposit recorded by
                      administrator.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setTopUpModalOpen(true)}
                        className="h-8 rounded-lg text-xs font-bold text-[#012A5E] bg-[#EBF3FC] hover:bg-[#D7E3F4] border border-[#0267B8]/20"
                      >
                        <Plus className="size-3 mr-1" />
                        Top Up Wallet
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTopUpModalOpen(true)}
                        className="h-8 rounded-lg text-xs font-bold text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA]"
                      >
                        Quick View Ledger
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={() => setTopUpModalOpen(true)}
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Wallet <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Module 4: Credit Facility (Figma section#c-crd #660:5557) */}
              <Card
                id="c-crd"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5558 */}
                  <div className="p-5 pb-3 flex items-start gap-3 border-b border-[#F1F5F9]">
                    <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#012A5E] text-base">
                        Credit
                      </h3>
                      <p className="text-xs text-[#4F5B70]">
                        Credit limit and usage
                      </p>
                    </div>
                  </div>

                  {/* Body Content #660:5567 */}
                  <div className="p-6 space-y-4">
                    {isDemoPopulated ? (
                      <div className="space-y-2 p-3.5 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#4F5B70]">Credit Limit</span>
                          <span className="font-bold text-[#012A5E]">
                            $50,000.00
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4F5B70]">Outstanding</span>
                          <span className="font-bold text-[#012A5E]">
                            $12,400.00
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-[#DCE2EB] pt-1">
                          <span className="font-bold text-[#012A5E]">
                            Available
                          </span>
                          <span className="font-bold text-emerald-700">
                            $37,600.00
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] text-center">
                        <p className="text-xs font-bold text-[#012A5E]">
                          Credit details are not available.
                        </p>
                        <p className="text-[11px] text-[#4F5B70] mt-1 leading-relaxed">
                          Request a corporate credit line to book tickets and
                          hotels with post-settlement billing.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setCreditModalOpen(true)}
                        className="h-8 rounded-lg text-xs font-bold text-[#012A5E] bg-[#EBF3FC] hover:bg-[#D7E3F4] border border-[#0267B8]/20"
                      >
                        Request Credit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={() => setCreditModalOpen(true)}
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Credit <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Module 5: Commission Overview (Figma section#c-cm #660:5603) */}
              <Card
                id="c-cm"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5604 */}
                  <div className="p-5 pb-3 flex items-start gap-3 border-b border-[#F1F5F9]">
                    <div className="size-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Coins className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#012A5E] text-base">
                        Commission
                      </h3>
                      <p className="text-xs text-[#4F5B70]">
                        Commission on Agent bookings
                      </p>
                    </div>
                  </div>

                  {/* Body Content #660:5613 */}
                  <div className="p-6 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F1F5F9]">
                        <div>
                          <span className="font-bold text-[#012A5E]">
                            Pending
                          </span>
                          <span className="text-[10px] text-[#8EAECF] block">
                            Recorded, not yet confirmed
                          </span>
                        </div>
                        <span className="font-extrabold text-sm text-[#012A5E]">
                          {isDemoPopulated ? '$1,420.00' : '—'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F1F5F9]">
                        <div>
                          <span className="font-bold text-[#012A5E]">
                            Earned
                          </span>
                          <span className="text-[10px] text-[#8EAECF] block">
                            Confirmed, awaiting settlement
                          </span>
                        </div>
                        <span className="font-extrabold text-sm text-[#012A5E]">
                          {isDemoPopulated ? '$3,890.00' : '—'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#012A5E]">
                            Settled
                          </span>
                          <span className="text-[10px] text-[#8EAECF] block">
                            Settlement completed
                          </span>
                        </div>
                        <span className="font-extrabold text-sm text-emerald-700">
                          {isDemoPopulated ? '$12,300.00' : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] text-[11px] text-[#4F5B70] flex items-center gap-2">
                      <Info className="size-4 text-[#0267B8] shrink-0" />
                      <span>
                        {isDemoPopulated
                          ? 'Commission settlements execute on the 1st of every month.'
                          : 'No commission activity yet. Commission on bookings will appear here.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <a
                      href="#commission"
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Commission Details{' '}
                      <ChevronRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </Card>

              {/* Module 6: My Pricing & Markup (Figma section#c-mk #660:5647) */}
              <Card
                id="c-mk"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5648 */}
                  <div className="p-5 pb-3 flex items-start gap-3 border-b border-[#F1F5F9]">
                    <div className="size-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Percent className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#012A5E] text-base">
                        My Pricing & Markup
                      </h3>
                      <p className="text-xs text-[#4F5B70]">
                        Agent, module and supplier markup
                      </p>
                    </div>
                  </div>

                  {/* Body Content #660:5657 */}
                  <div className="p-6 text-center flex flex-col items-center justify-center min-h-[190px]">
                    <div className="size-12 rounded-2xl bg-[#F4F6FA] text-[#8EAECF] flex items-center justify-center mb-2.5">
                      <Percent className="size-6" />
                    </div>
                    <h4 className="font-extrabold text-sm text-[#012A5E]">
                      No markup data available
                    </h4>
                    <p className="text-xs text-[#4F5B70] max-w-xs mt-1 leading-relaxed">
                      Markup rules configured for your account will appear here.
                      Configure custom margins per travel product.
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <a
                      href="#pricing-markup"
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Pricing & Markup{' '}
                      <ChevronRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </Card>

              {/* Module 7: Sub-agents (Figma section#c-sub #660:5670) */}
              <Card
                id="c-sub"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5671 */}
                  <div className="p-5 pb-3 flex items-start justify-between gap-3 border-b border-[#F1F5F9]">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                        <Users className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#012A5E] text-base">
                          Sub-agents
                        </h3>
                        <p className="text-xs text-[#4F5B70]">
                          Agent → Sub-agent hierarchy
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-[#E6EAF0] px-2 py-0.5 text-[10px] font-bold text-[#012A5E] shrink-0">
                      Website only
                    </span>
                  </div>

                  {/* Body Content #660:5684 */}
                  <div className="p-6 text-center flex flex-col items-center justify-center min-h-[190px]">
                    {isDemoPopulated ? (
                      <div className="w-full text-left space-y-2">
                        <div className="p-2.5 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[#012A5E]">
                              Dhaka North Travel Sub-agency
                            </p>
                            <p className="text-[11px] text-[#4F5B70]">
                              3 Agents · Active
                            </p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="size-12 rounded-2xl bg-[#F4F6FA] text-[#8EAECF] flex items-center justify-center mb-2.5">
                          <Users className="size-6" />
                        </div>
                        <h4 className="font-extrabold text-sm text-[#012A5E]">
                          No Sub-agents yet
                        </h4>
                        <p className="text-xs text-[#4F5B70] max-w-xs mt-1 leading-relaxed">
                          Add Sub-agents so your team can book under your Agent
                          account with designated credit and markup rules.
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setSubAgentModalOpen(true)}
                          className="mt-3.5 h-8 rounded-lg text-xs font-bold text-[#012A5E] bg-[#EBF3FC] hover:bg-[#D7E3F4] border border-[#0267B8]/20"
                        >
                          <Plus className="size-3 mr-1" />
                          Manage Sub-agents
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={() => setSubAgentModalOpen(true)}
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Sub-agents <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Module 8: Statements (Figma section#c-stm #660:5701) */}
              <Card
                id="c-stm"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5702 */}
                  <div className="p-5 pb-3 flex items-start gap-3 border-b border-[#F1F5F9]">
                    <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#012A5E] text-base">
                        Statements
                      </h3>
                      <p className="text-xs text-[#4F5B70]">
                        Periodic Agent account statements
                      </p>
                    </div>
                  </div>

                  {/* Body Content #660:5711 */}
                  <div className="p-6 space-y-3">
                    <p className="text-xs font-bold text-[#012A5E]">
                      Your Agent statement brings together:
                    </p>

                    <ul className="space-y-1.5 text-xs text-[#4F5B70]">
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Bookings & Issued Tickets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Wallet transactions & Top-ups</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Credit usage & Repayments</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Commissions & Incentive payouts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Closing balance & Monthly summaries</span>
                      </li>
                    </ul>

                    <div className="pt-2">
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 rounded-lg text-xs font-bold text-[#012A5E] bg-[#EBF3FC] hover:bg-[#D7E3F4] border border-[#0267B8]/20"
                      >
                        Download Latest Statement (PDF)
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <a
                      href="#statements"
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Statements <ChevronRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </Card>

              {/* Module 9: Reports & Analytics (Figma section#c-rep #660:5744) */}
              <Card
                id="c-rep"
                className="rounded-2xl border-[#DCE2EB] bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header #660:5745 */}
                  <div className="p-5 pb-3 flex items-start justify-between gap-3 border-b border-[#F1F5F9]">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-xl bg-[#EBF3FC] text-[#0267B8] flex items-center justify-center shrink-0">
                        <BarChart3 className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#012A5E] text-base">
                          Reports
                        </h3>
                        <p className="text-xs text-[#4F5B70]">
                          Detailed reports open in the Reports area
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-[#E6EAF0] px-2 py-0.5 text-[10px] font-bold text-[#012A5E] shrink-0">
                      Website only
                    </span>
                  </div>

                  {/* Body 5 Report Cards #660:5757 */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#DCE2EB] bg-[#F4F6FA] hover:bg-[#EBF3FC] text-left transition-colors cursor-pointer group"
                      >
                        <div className="size-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                          $
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#012A5E] group-hover:text-[#0267B8]">
                            Sales
                          </p>
                          <span className="text-[10px] text-[#4F5B70]">
                            Report
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#DCE2EB] bg-[#F4F6FA] hover:bg-[#EBF3FC] text-left transition-colors cursor-pointer group"
                      >
                        <div className="size-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs">
                          <Plane className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#012A5E] group-hover:text-[#0267B8]">
                            Bookings
                          </p>
                          <span className="text-[10px] text-[#4F5B70]">
                            Report
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#DCE2EB] bg-[#F4F6FA] hover:bg-[#EBF3FC] text-left transition-colors cursor-pointer group"
                      >
                        <div className="size-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
                          %
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#012A5E] group-hover:text-[#0267B8]">
                            Commissions
                          </p>
                          <span className="text-[10px] text-[#4F5B70]">
                            Report
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#DCE2EB] bg-[#F4F6FA] hover:bg-[#EBF3FC] text-left transition-colors cursor-pointer group"
                      >
                        <div className="size-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-bold text-xs">
                          <Wallet className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#012A5E] group-hover:text-[#0267B8]">
                            Wallet / Credit
                          </p>
                          <span className="text-[10px] text-[#4F5B70]">
                            Report
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="col-span-2 flex items-center gap-2.5 p-2.5 rounded-xl border border-[#DCE2EB] bg-[#F4F6FA] hover:bg-[#EBF3FC] text-left transition-colors cursor-pointer group"
                      >
                        <div className="size-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 font-bold text-xs">
                          <Users className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#012A5E] group-hover:text-[#0267B8]">
                            Sub-agent Performance
                          </p>
                          <span className="text-[10px] text-[#4F5B70]">
                            Detailed hierarchy analysis
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <a
                      href="#reports"
                      className="text-xs font-bold text-[#0267B8] hover:text-[#012A5E] flex items-center gap-1 transition-colors"
                    >
                      View Reports <ChevronRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </main>

          {/* 5. Footer matching Figma #660:5808 */}
          <footer className="mt-auto border-t border-[#DCE2EB] bg-white py-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4F5B70]">
            <span className="font-medium">
              AeroWing Agent Portal · M2 B2B Agent Portal · Agent Dashboard
            </span>
            <span className="text-[#8EAECF] text-center sm:text-right">
              Design prototype — no bookings, payments or wallet transactions
              will be processed
            </span>
          </footer>
        </div>
      </div>

      {/* --- Interactive Modals --- */}

      {/* Modal 1: Start New Booking Dialog */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="sm:max-w-3xl overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-extrabold text-[#012A5E]">
              <Plane className="size-5 text-[#0267B8]" />
              Start New Booking — {selectedService}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4F5B70]">
              Search Aero Wing real-time B2B inventory and create an instant
              booking on behalf of your customer.
            </DialogDescription>
          </DialogHeader>

          <div className="min-w-0 space-y-4">
            <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
              {travelServices.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedService(s.id)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors',
                    selectedService === s.id
                      ? 'border-[#012A5E] bg-[#012A5E] text-white'
                      : 'border-[#DCE2EB] bg-[#F4F6FA] text-[#4F5B70] hover:bg-white',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#012A5E]">
                  Origin / Departure
                </Label>
                <Input
                  defaultValue="Hazrat Shahjalal Intl (DAC), Dhaka"
                  placeholder="City or Airport"
                  className="rounded-xl border-[#DCE2EB] text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#012A5E]">
                  Destination
                </Label>
                <Input
                  defaultValue="Heathrow Airport (LHR), London"
                  placeholder="City or Airport"
                  className="rounded-xl border-[#DCE2EB] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#012A5E]">
                  Travel Dates
                </Label>
                <DatePicker
                  value="2026-12-01"
                  className="h-9 rounded-xl border-[#DCE2EB] text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#012A5E]">
                  Customer / Passenger
                </Label>
                <Input
                  defaultValue="1 Adult · Economy"
                  placeholder="Passenger details"
                  className="rounded-xl border-[#DCE2EB] text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#0267B8]/20 bg-[#EBF3FC] p-3 text-xs">
              <span className="font-medium text-[#012A5E]">
                Applied Agent Margin:
              </span>
              <span className="font-extrabold whitespace-nowrap text-[#0267B8]">
                +5.0% Standard B2B Markup
              </span>
            </div>
          </div>

          <DialogFooter className="border-[#F1F5F9]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBookingModalOpen(false)}
              className="rounded-full px-5 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                window.alert(`Search initiated for ${selectedService}!`)
                setBookingModalOpen(false)
              }}
              className="rounded-full bg-[#F1C134] px-5 text-xs font-bold text-[#012A5E] hover:bg-[#E5B52E]"
            >
              Search Fares & Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Top Up Wallet Dialog */}
      <Dialog open={topUpModalOpen} onOpenChange={setTopUpModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-[#012A5E] flex items-center gap-2">
              <Wallet className="size-5 text-[#0267B8]" />
              Top Up Agent Wallet
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4F5B70]">
              Add funds to your agency balance via instant card payment or bank
              wire transfer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-[#012A5E] block mb-1">
                Top-up Amount (USD)
              </label>
              <Input
                type="number"
                defaultValue="5000"
                className="rounded-xl border-[#DCE2EB] text-sm font-bold"
              />
            </div>

            <div className="flex gap-2">
              {['$1,000', '$2,500', '$5,000', '$10,000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="flex-1 py-1 rounded-lg border border-[#DCE2EB] bg-[#F4F6FA] hover:bg-[#EBF3FC] text-xs font-bold text-[#012A5E]"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#DCE2EB] text-xs text-[#4F5B70]">
              Bank wire deposits must include your agency reference number:{' '}
              <b className="text-[#012A5E]">AW-AG-904</b>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTopUpModalOpen(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                alert('Top-up request registered for simulation.')
                setTopUpModalOpen(false)
              }}
              className="bg-[#0267B8] text-white hover:bg-[#012A5E]"
            >
              Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Request Credit Dialog */}
      <Dialog open={creditModalOpen} onOpenChange={setCreditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-[#012A5E] flex items-center gap-2">
              <CreditCard className="size-5 text-purple-600" />
              Request Corporate Credit Line
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4F5B70]">
              Apply for a revolving credit limit with bi-weekly or monthly
              settlements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-bold text-[#012A5E] block mb-1">
                Requested Limit
              </label>
              <Input
                defaultValue="$50,000.00"
                className="rounded-xl border-[#DCE2EB]"
              />
            </div>
            <div>
              <label className="font-bold text-[#012A5E] block mb-1">
                Expected Monthly Volume
              </label>
              <Input
                defaultValue="50-100 bookings / month"
                className="rounded-xl border-[#DCE2EB]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                alert('Credit application submitted to AeroWing Admin!')
                setCreditModalOpen(false)
              }}
              className="bg-[#012A5E] text-white hover:bg-[#0267B8]"
            >
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 4: Sub-agent Modal */}
      <Dialog open={subAgentModalOpen} onOpenChange={setSubAgentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-[#012A5E] flex items-center gap-2">
              <Users className="size-5 text-[#0267B8]" />
              Add New Sub-agent
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4F5B70]">
              Create credentials for an affiliated sub-agent or staff branch.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-bold text-[#012A5E] block mb-1">
                Sub-agent Agency Name
              </label>
              <Input
                placeholder="e.g. Apex Travel Branch 2"
                className="rounded-xl border-[#DCE2EB]"
              />
            </div>
            <div>
              <label className="font-bold text-[#012A5E] block mb-1">
                Contact Person Email
              </label>
              <Input
                placeholder="subagent@example.com"
                className="rounded-xl border-[#DCE2EB]"
              />
            </div>
            <div>
              <label className="font-bold text-[#012A5E] block mb-1">
                Assigned Credit Limit (USD)
              </label>
              <Input
                defaultValue="5000"
                className="rounded-xl border-[#DCE2EB]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubAgentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                alert('Sub-agent invitation dispatched!')
                setSubAgentModalOpen(false)
              }}
              className="bg-[#0267B8] text-white hover:bg-[#012A5E]"
            >
              Send Invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

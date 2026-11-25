import * as React from 'react'
import {
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  Pencil,
  Info,
  Bell,
  ChevronDown,
  Sparkles,
  Menu,
} from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { SidebarProvider } from '#/components/ui/sidebar'
import { Button } from '#/components/ui/button'
import { EditCustomerDialog } from './edit-customer-dialog'

export interface B2CCustomerDetailsPageProps {
  initialCustomerName?: string
  initialEmail?: string
  initialMobile?: string
  initialAccountType?: string
  initialSignInContext?: string
}

export function B2CCustomerDetailsPage({
  initialCustomerName = 'Demo Customer',
  initialEmail = 'demo.customer@example.com',
  initialMobile = 'Not added',
  initialAccountType = 'B2C Customer',
  initialSignInContext = 'Email',
}: B2CCustomerDetailsPageProps) {
  const [customerName, setCustomerName] = React.useState(initialCustomerName)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [showSavedToast, setShowSavedToast] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Compute initials for avatar (e.g. "Demo Customer" -> "DC")
  const initials = React.useMemo(() => {
    const parts = customerName.trim().split(/\s+/)
    if (parts.length === 0) return 'DC'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }, [customerName])

  const handleSaveProfile = (newName: string) => {
    setCustomerName(newName)
    setShowSavedToast(true)
    setTimeout(() => {
      setShowSavedToast(false)
    }, 3500)
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-[#F4F6FA] text-[#141B28]">
        {/* 1. Sidebar - Core Admin B2C Customers active */}
        <AdminSidebar currentTab="B2C Customers" />

        {/* 2. Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Header Bar (Node #990:3176) */}
          <header className="h-[68px] shrink-0 bg-white/92 backdrop-blur-md border-b border-[#DCE2EB] px-5 sm:px-7 flex items-center justify-between sticky top-0 z-20">
            {/* Left: Mobile Toggle & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#012A5E]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                <Menu className="size-5" />
              </Button>

              <nav aria-label="Breadcrumb" className="flex items-center text-sm">
                <ol className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <li>
                    <a
                      href="/admin"
                      className="text-[#4F5B70] hover:text-[#012A5E] font-medium transition-colors"
                    >
                      Admin Panel
                    </a>
                  </li>
                  <li className="text-[#8792A4] select-none" aria-hidden="true">
                    /
                  </li>
                  <li>
                    <a
                      href="/admin?tab=b2c-customers"
                      className="text-[#4F5B70] hover:text-[#012A5E] font-medium transition-colors"
                    >
                      B2C Customers
                    </a>
                  </li>
                  <li className="text-[#8792A4] select-none" aria-hidden="true">
                    /
                  </li>
                  <li className="text-[#141B28] font-extrabold truncate" aria-current="page">
                    Customer Profile
                  </li>
                </ol>
              </nav>
            </div>

            {/* Right: Notifications & Profile Menu (Node #990:3187) */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Notifications Button */}
              <button
                type="button"
                className="size-10 rounded-xl flex items-center justify-center text-[#4F5B70] hover:text-[#012A5E] hover:bg-slate-100/80 transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="size-5 text-[#4F5B70]" />
                <span className="size-2 rounded-full bg-[#0267B8] absolute top-2.5 right-2.5 ring-2 ring-white" />
              </button>

              {/* Profile Pill Menu (Node #990:3191) */}
              <button
                type="button"
                className="flex items-center gap-2.5 p-1 pr-3 bg-white border border-[#DCE2EB] rounded-2xl shadow-2xs hover:border-[#C5CFDC] transition-all cursor-pointer group"
                title="User profile"
              >
                <span className="size-8 rounded-xl bg-[#012A5E] flex items-center justify-center text-[#F1C134] text-xs font-extrabold shrink-0 group-hover:scale-105 transition-transform">
                  SA
                </span>
                <span className="flex flex-col text-left leading-tight hidden sm:flex">
                  <span className="text-[13.5px] font-extrabold text-[#141B28]">
                    Sample Admin
                  </span>
                  <span className="text-[11.5px] font-medium text-[#4F5B70]">
                    Super Admin
                  </span>
                </span>
                <ChevronDown className="size-4 text-[#8792A4] shrink-0 ml-0.5 group-hover:text-[#012A5E] transition-colors" />
              </button>
            </div>
          </header>

          {/* Main Container (Node #990:3063) */}
          <main className="flex-1 p-5 sm:p-7 xl:p-[28px_28px_40px] max-w-[1656px] w-full mx-auto flex flex-col gap-6">
            {/* Notification Toast */}
            {showSavedToast && (
              <div className="flex items-center justify-between gap-3 bg-[#EAF4FD] border border-[#0267B8]/30 rounded-xl px-4 py-3 text-sm text-[#012A5E] shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#0267B8]" />
                  <span className="font-bold">Profile updated successfully:</span>
                  <span>Customer name changed to &ldquo;{customerName}&rdquo;.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSavedToast(false)}
                  className="text-xs font-bold text-[#0267B8] hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Simulation Header / Figma metadata indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#DCE2EB] rounded-2xl p-3 sm:px-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5B70]">
                <Sparkles className="size-4 text-[#F1C134] shrink-0" />
                <span>
                  Figma Screen:{' '}
                  <strong className="text-[#012A5E]">
                    B2C Customer Details (Node #990:2945)
                  </strong>
                </span>
                <span className="hidden sm:inline-block text-[#C5CFDC]">|</span>
                <span className="hidden sm:inline text-xs text-[#8792A4]">
                  Admin Panel Core · View and edit profile information
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="border-[#DCE2EB] text-[#012A5E] hover:bg-[#F4F6FA] text-xs font-bold h-7"
                >
                  <Pencil className="size-3 mr-1" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* div#page container (Node #990:3064) */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Back Link (Node #990:3065) */}
              <div>
                <a
                  href="/admin?tab=b2c-customers"
                  className="inline-flex items-center gap-1.5 py-2 px-1.5 rounded-lg text-sm font-extrabold text-[#012A5E] hover:text-[#0F3F7D] hover:underline transition-colors w-fit group"
                >
                  <ArrowLeft className="size-4.5 stroke-[2.5] text-[#012A5E] group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to B2C Customers</span>
                </a>
              </div>

              {/* Page Title & Context Header (Node #990:3069) */}
              <div className="flex flex-col pb-2">
                <span className="text-[11.5px] font-extrabold text-[#0267B8] uppercase tracking-wider">
                  Core Admin
                </span>
                <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#012A5E] tracking-tight leading-tight mt-0.5">
                  Customer Profile
                </h1>
                <p className="text-[14px] sm:text-[15px] font-medium text-[#4F5B70] mt-1">
                  View and manage the customer’s basic profile information.
                </p>
              </div>

              {/* Hero Identity Card (Node #990:3077 section.idc) */}
              <section className="bg-white border border-[#DCE2EB] rounded-[18px] p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                {/* Decorative radial gradient in top right corner (Node #990:3078 ::after) */}
                <div
                  className="absolute -top-16 -right-6 w-[220px] h-[220px] rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(241, 193, 52, 0.18) 0%, rgba(241, 193, 52, 0) 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Avatar (Node #990:3079 span.pf-av) */}
                <div className="size-16 rounded-[18px] bg-[#012A5E] text-[#F1C134] text-2xl font-extrabold flex items-center justify-center shrink-0 shadow-xs ring-4 ring-[#F4F6FA]">
                  {initials}
                </div>

                {/* Details (Node #990:3081 div.idc-t) */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5 z-10">
                  {/* Name + Sample data pill row (Node #990:3082 h2#id-h) */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#012A5E] tracking-tight truncate">
                      {customerName}
                    </h2>
                    <span className="bg-[#EEF2F7] text-[#4F5B70] border border-[#DCE2EB] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      Sample data
                    </span>
                  </div>

                  {/* Metadata Pills Row (Node #990:3086 div.idc-m) */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {/* Badge 1: B2C Customer */}
                    <span className="bg-[#EEF2F7] text-[#012A5E] text-[11.5px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                      <User className="size-3 text-[#012A5E]" />
                      <span>{initialAccountType}</span>
                    </span>

                    {/* Badge 2: Email */}
                    <span className="bg-[#C6DCF2]/45 text-[#012A5E] text-[11.5px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                      <Mail className="size-3 text-[#012A5E]" />
                      <span>{initialSignInContext}</span>
                    </span>
                  </div>
                </div>
              </section>

              {/* Two-Column Grid (Node #990:3096) */}
              <div className="flex flex-col lg:flex-row items-start gap-5 pt-1">
                {/* Left Column (Node #990:3097 div.mcol) */}
                <div className="flex-1 w-full flex flex-col gap-5">
                  {/* Card 1: Profile Information (Node #990:3098 section.pc3) */}
                  <section className="bg-white border border-[#DCE2EB] rounded-[18px] p-5 sm:p-[20px_22px] shadow-xs flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 pb-1 border-b border-[#EEF2F7]">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-[10px] bg-[#EAF4FD] flex items-center justify-center text-[#012A5E] shrink-0">
                          <User className="size-4.5" />
                        </div>
                        <h2 className="text-[16.5px] font-extrabold text-[#012A5E]">
                          Profile Information
                        </h2>
                      </div>

                      {/* Edit Profile Button (Node #990:3106 button#ed-b) */}
                      <button
                        type="button"
                        onClick={() => setIsEditDialogOpen(true)}
                        className="bg-white border border-[#C5CFDC] rounded-[11px] px-3.5 py-2 inline-flex items-center gap-2 text-sm font-extrabold text-[#012A5E] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#012A5E]/20"
                      >
                        <Pencil className="size-3.5 text-[#012A5E]" />
                        <span>Edit Profile</span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1 pt-1">
                      <dt className="text-[12.5px] font-extrabold text-[#4F5B70] uppercase tracking-wide">
                        Full Name
                      </dt>
                      <dd className="text-[15px] font-extrabold text-[#141B28]">
                        {customerName}
                      </dd>
                    </div>
                  </section>

                  {/* Card 2: Sign-in & Contact (Node #990:3116 section.pc3) */}
                  <section className="bg-white border border-[#DCE2EB] rounded-[18px] p-5 sm:p-[20px_22px] shadow-xs flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-2.5 pb-1 border-b border-[#EEF2F7]">
                      <div className="size-9 rounded-[10px] bg-[#EAF4FD] flex items-center justify-center text-[#012A5E] shrink-0">
                        <Mail className="size-4.5" />
                      </div>
                      <h2 className="text-[16.5px] font-extrabold text-[#012A5E]">
                        Sign-in & Contact
                      </h2>
                    </div>

                    {/* Definition Grid (Node #990:3125 dl.kv2) */}
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1">
                      {/* Email */}
                      <div className="flex flex-col gap-1">
                        <dt className="text-[12.5px] font-extrabold text-[#4F5B70]">
                          Email
                        </dt>
                        <dd className="text-[15px] font-extrabold text-[#141B28] break-all">
                          {initialEmail}
                        </dd>
                      </div>

                      {/* Mobile */}
                      <div className="flex flex-col gap-1">
                        <dt className="text-[12.5px] font-extrabold text-[#4F5B70]">
                          Mobile
                        </dt>
                        <dd className="text-[15px] text-[#4F5B70]">
                          {initialMobile}
                        </dd>
                      </div>

                      {/* Sign-in Context */}
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <dt className="text-[12.5px] font-extrabold text-[#4F5B70]">
                          Sign-in Context
                        </dt>
                        <dd className="pt-0.5">
                          <span className="bg-[#C6DCF2]/45 text-[#012A5E] text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                            <Mail className="size-3 text-[#012A5E]" />
                            <span>{initialSignInContext}</span>
                          </span>
                        </dd>
                      </div>
                    </dl>

                    {/* Footer Notice (Node #990:3147 p) */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#EEF2F7] text-[13px] text-[#4F5B70]">
                      <Info className="size-4 text-[#4F5B70] shrink-0" />
                      <span>Sign-in and contact details are read-only here.</span>
                    </div>
                  </section>
                </div>

                {/* Right Column: Customer Account (Node #990:3155 section.pc3) */}
                <aside className="w-full lg:w-[320px] shrink-0 bg-white border border-[#DCE2EB] rounded-[18px] p-5 sm:p-[20px_22px] shadow-xs flex flex-col gap-4 self-start">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 pb-1 border-b border-[#EEF2F7]">
                    <div className="size-9 rounded-[10px] bg-[#EAF4FD] flex items-center justify-center text-[#012A5E] shrink-0">
                      <ShieldCheck className="size-4.5" />
                    </div>
                    <h2 className="text-[16.5px] font-extrabold text-[#012A5E]">
                      Customer Account
                    </h2>
                  </div>

                  {/* Body fields (Node #990:3163 dl.kv2) */}
                  <dl className="flex flex-col gap-3.5 pt-1">
                    {/* Account Type */}
                    <div className="flex flex-col gap-1">
                      <dt className="text-[12.5px] font-extrabold text-[#4F5B70]">
                        Account Type
                      </dt>
                      <dd className="text-[15px] font-extrabold text-[#141B28]">
                        {initialAccountType}
                      </dd>
                    </div>

                    {/* Sign-in Context */}
                    <div className="flex flex-col gap-1">
                      <dt className="text-[12.5px] font-extrabold text-[#4F5B70]">
                        Sign-in Context
                      </dt>
                      <dd className="text-[15px] font-extrabold text-[#141B28]">
                        {initialSignInContext}
                      </dd>
                    </div>
                  </dl>
                </aside>
              </div>
            </div>
          </main>

          {/* Footer (Node #990:3174 footer.ft2) */}
          <footer className="h-14 shrink-0 bg-white border-t border-[#DCE2EB] px-5 sm:px-7 flex items-center justify-between text-[13px] text-[#4F5B70] mt-auto">
            <span>© 2026 AeroWing. All rights reserved.</span>
            <span className="text-xs text-[#8792A4]">
              Node #990:2945 · B2C Customer Details
            </span>
          </footer>
        </div>

        {/* Reusable Edit Profile Modal */}
        <EditCustomerDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          customerName={customerName}
          onSave={handleSaveProfile}
        />
      </div>
    </SidebarProvider>
  )
}

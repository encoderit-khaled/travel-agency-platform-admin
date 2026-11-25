import * as React from 'react'
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Mail,
  Pencil,
  Info,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { SignInBadge } from './signin-badge'
import { EditCustomerDialog } from './edit-customer-dialog'
import type { B2CCustomer } from './types'

interface B2CCustomerDetailsViewProps {
  customer: B2CCustomer
  onBack: () => void
  onUpdateCustomer: (updated: B2CCustomer) => void
  isCollapsedSidebarScreen?: boolean
}

export function B2CCustomerDetailsView({
  customer,
  onBack,
  onUpdateCustomer,
  isCollapsedSidebarScreen = false,
}: B2CCustomerDetailsViewProps) {
  const [editOpen, setEditOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Figma Screen Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#DCE2EB] rounded-2xl p-3 sm:px-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5B70]">
          <span className="size-2 rounded-full bg-[#0267B8]" />
          <span>
            Figma Screen:{' '}
            <strong className="text-[#012A5E]">
              {isCollapsedSidebarScreen
                ? 'Collapsed Sidebar / Customer Profile (Node #995:4126)'
                : 'B2C Customer Details (Node #990:2945)'}
            </strong>
          </span>
          <span className="hidden sm:inline-block text-[#C5CFDC]">|</span>
          <span className="hidden sm:inline text-xs text-[#8792A4]">
            Admin Panel Core · View and edit profile information with collapsible sidebar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="rounded-xl border-[#C5CFDC] text-[#012A5E] hover:bg-[#EEF2F7] h-8 text-xs font-bold gap-1.5 shadow-2xs cursor-pointer"
          >
            <Pencil className="size-3.5" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#012A5E] hover:text-[#0F3F7D] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to B2C Customers</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <span className="text-[11.5px] font-extrabold text-[#0267B8] uppercase tracking-wider block">
          CORE ADMIN
        </span>
        <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#012A5E] tracking-tight leading-tight">
          Customer Profile
        </h1>
        <p className="text-sm text-[#4F5B70]">
          View and manage the customer’s basic profile information.
        </p>
      </div>

      {/* Hero Summary Card */}
      <div
        className="relative overflow-hidden bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-xs transition-shadow"
        style={{
          background:
            'radial-gradient(ellipse 400px 300px at 98% 50%, rgba(254, 240, 199, 0.45) 0%, rgba(255, 255, 255, 0) 70%), #ffffff',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar (64x64 rounded-2xl) */}
          <div className="size-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs select-none bg-[#001F4D] text-[#F1C134]">
            {customer.initials}
          </div>

          {/* Details */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#141B28] tracking-tight truncate">
                {customer.name}
              </h2>
              {customer.isSampleData && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2F7] text-[#4F5B70] border border-[#DCE2EB]">
                  Sample data
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2F7] text-[#141B28] border border-[#DCE2EB]">
                <User className="size-3 text-[#4F5B70]" />
                <span>{customer.accountType}</span>
              </span>

              {customer.signinMethods.map((method) => (
                <SignInBadge key={method} method={method} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Sections: 2 columns layout matching Figma */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Profile Information & Sign-in & Contact */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Profile Information */}
          <section className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF1F5] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="size-9 rounded-xl bg-[#EAF4FD] text-[#012A5E] flex items-center justify-center shrink-0">
                  <User className="size-5" />
                </span>
                <h2 className="text-base font-bold text-[#141B28]">
                  Profile Information
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="rounded-xl border-[#C5CFDC] text-[#012A5E] hover:bg-[#EEF2F7] h-8 text-xs font-bold gap-1.5 shadow-2xs cursor-pointer"
              >
                <Pencil className="size-3.5" />
                <span>Edit Profile</span>
              </Button>
            </div>

            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold text-[#4F5B70] uppercase tracking-wider mb-1">
                  Full Name
                </dt>
                <dd className="text-sm font-semibold text-[#141B28]">
                  {customer.name}
                </dd>
              </div>
            </dl>
          </section>

          {/* Card 2: Sign-in & Contact */}
          <section className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#EEF1F5]">
              <span className="size-9 rounded-xl bg-[#EAF4FD] text-[#012A5E] flex items-center justify-center shrink-0">
                <Mail className="size-5" />
              </span>
              <h2 className="text-base font-bold text-[#141B28]">
                Sign-in & Contact
              </h2>
            </div>

            <dl className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-bold text-[#4F5B70] uppercase tracking-wider mb-1">
                    Email
                  </dt>
                  <dd className="text-sm font-semibold text-[#141B28]">
                    {customer.email ? (
                      <span>{customer.email}</span>
                    ) : (
                      <span className="text-[#8792A4] italic font-normal">
                        Not added
                      </span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold text-[#4F5B70] uppercase tracking-wider mb-1">
                    Mobile
                  </dt>
                  <dd className="text-sm font-semibold text-[#141B28]">
                    {customer.mobile ? (
                      <span>{customer.mobile}</span>
                    ) : (
                      <span className="text-[#8792A4] italic font-normal">
                        Not added
                      </span>
                    )}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="text-xs font-bold text-[#4F5B70] uppercase tracking-wider mb-1.5">
                  Sign-in Context
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {customer.signinMethods.map((method) => (
                    <SignInBadge key={method} method={method} />
                  ))}
                </dd>
              </div>
            </dl>

            {/* Read-only notification notice */}
            <div className="pt-3 border-t border-[#EEF1F5] flex items-center gap-2 text-xs sm:text-[13px] text-[#4F5B70]">
              <Info className="size-4 text-[#0267B8] shrink-0" />
              <span>Sign-in and contact details are read-only here.</span>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Customer Account */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-2xl border border-[#DCE2EB] p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#EEF1F5]">
              <span className="size-9 rounded-xl bg-[#EAF4FD] text-[#012A5E] flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5" />
              </span>
              <h2 className="text-base font-bold text-[#141B28]">
                Customer Account
              </h2>
            </div>

            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold text-[#4F5B70] uppercase tracking-wider mb-1">
                  Account Type
                </dt>
                <dd className="text-sm font-semibold text-[#141B28]">
                  {customer.accountType}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-[#4F5B70] uppercase tracking-wider mb-1.5">
                  Sign-in Context
                </dt>
                <dd className="text-sm font-semibold text-[#141B28]">
                  Email
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Footer copyright note matching Figma */}
      <div className="pt-2 text-xs text-[#8C9BAE]">
        © 2026 AeroWing. All rights reserved.
      </div>

      {/* Edit Profile Modal */}
      <EditCustomerDialog
        customer={customer}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onUpdateCustomer}
      />
    </div>
  )
}

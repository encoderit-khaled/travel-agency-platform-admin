import * as React from 'react'
import { Search, X, Eye } from 'lucide-react'
import { AdminSidebar } from '../admin-sidebar'
import { AdminHeader } from '../admin-header'
import { AdminFooter } from '../admin-footer'
import { SidebarProvider } from '#/components/ui/sidebar'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { DataTable } from '#/components/ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { EmptyState } from '#/components/ui/empty-state'
import { SignInBadge } from './signin-badge'
import { B2CCustomerDetailsView } from './b2c-customer-details-view'
import { INITIAL_B2C_CUSTOMERS } from './data'
import type { B2CCustomer, SignInMethodFilter } from './types'
import { cn } from 'cn'

export interface B2CCustomersPageProps {
  initialSearchQuery?: string
  initialSigninFilter?: SignInMethodFilter
  initialSelectedCustomerId?: string | null
  initialView?: 'list' | 'details'
  initialSidebarCollapsed?: boolean
}

export function B2CCustomersPage({
  initialSearchQuery = '',
  initialSigninFilter = 'all',
  initialSelectedCustomerId = null,
  initialView = 'list',
  initialSidebarCollapsed = false,
}: B2CCustomersPageProps) {
  const [customers, setCustomers] = React.useState<B2CCustomer[]>(
    INITIAL_B2C_CUSTOMERS,
  )
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery)
  const [signinFilter, setSigninFilter] =
    React.useState<SignInMethodFilter>(initialSigninFilter)
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<B2CCustomer | null>(() => {
      if (initialSelectedCustomerId) {
        return (
          INITIAL_B2C_CUSTOMERS.find(
            (c) => c.id === initialSelectedCustomerId,
          ) || null
        )
      }
      if (initialView === 'details') {
        return INITIAL_B2C_CUSTOMERS[0]
      }
      return null
    })

  // Filter customers based on search text and sign-in method
  const filteredCustomers = React.useMemo(() => {
    return customers.filter((cust) => {
      // 1. Sign-in filter
      if (signinFilter !== 'all') {
        if (!cust.signinMethods.includes(signinFilter)) {
          return false
        }
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      const matchesName = cust.name.toLowerCase().includes(q)
      const matchesEmail = cust.email
        ? cust.email.toLowerCase().includes(q)
        : false
      const matchesMobile = cust.mobile
        ? cust.mobile.toLowerCase().includes(q)
        : false

      return matchesName || matchesEmail || matchesMobile
    })
  }, [customers, searchQuery, signinFilter])

  const handleUpdateCustomer = (updated: B2CCustomer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setSelectedCustomer(updated)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSigninFilter('all')
  }

  const breadcrumbs = selectedCustomer
    ? [
        { label: 'Admin Panel', href: '/admin' },
        {
          label: 'B2C Customers',
          onClick: () => setSelectedCustomer(null),
        },
        { label: 'Customer Profile', active: true },
      ]
    : [
        { label: 'Admin Panel', href: '/admin' },
        { label: 'B2C Customers', active: true },
      ]

  const columns = React.useMemo<ColumnDef<B2CCustomer>[]>(
    () => [
      {
        id: 'customer',
        header: 'Customer',
        meta: {
          headerClassName:
            'py-3 px-5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider min-w-[220px]',
          cellClassName: 'py-3.5 px-5',
        },
        cell: ({ row }) => {
          const customer = row.original
          return (
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none',
                  customer.avatarColor === 'dark'
                    ? 'bg-[#012A5E] text-white'
                    : 'bg-[#EAF4FD] text-[#012A5E] border border-[#C6DCF2]',
                )}
              >
                {customer.initials}
              </div>
              <span className="text-sm font-bold text-[#141B28] truncate">
                {customer.name}
              </span>
            </div>
          )
        },
      },
      {
        id: 'email',
        header: 'Email',
        meta: {
          headerClassName:
            'py-3 px-5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider min-w-[200px]',
          cellClassName: 'py-3.5 px-5 text-sm',
        },
        cell: ({ row }) =>
          row.original.email ? (
            <span className="text-[#141B28]">{row.original.email}</span>
          ) : (
            <span className="text-[#8792A4] italic font-normal">Not added</span>
          ),
      },
      {
        id: 'mobile',
        header: 'Mobile',
        meta: {
          headerClassName:
            'py-3 px-5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider min-w-[160px]',
          cellClassName: 'py-3.5 px-5 text-sm',
        },
        cell: ({ row }) =>
          row.original.mobile ? (
            <span className="text-[#141B28]">{row.original.mobile}</span>
          ) : (
            <span className="text-[#8792A4] italic font-normal">Not added</span>
          ),
      },
      {
        id: 'signin',
        header: 'Sign-in',
        meta: {
          headerClassName:
            'py-3 px-5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider min-w-[150px]',
          cellClassName: 'py-3.5 px-5',
        },
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-1.5">
            {row.original.signinMethods.map((method) => (
              <SignInBadge key={method} method={method} />
            ))}
          </div>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        meta: {
          headerClassName:
            'py-3 px-5 text-xs font-bold text-[#4F5B70] uppercase tracking-wider text-right w-[140px]',
          cellClassName: 'py-3.5 px-5 text-right',
        },
        cell: ({ row }) => {
          const customer = row.original
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedCustomer(customer)}
              className="h-8 rounded-xl border-[#C5CFDC] text-[#012A5E] hover:bg-[#EEF2F7] text-xs font-bold gap-1.5 shadow-2xs cursor-pointer"
            >
              <Eye className="size-3.5" />
              <span>View Customer</span>
            </Button>
          )
        },
      },
    ],
    [setSelectedCustomer],
  )

  return (
    <SidebarProvider
      defaultOpen={!initialSidebarCollapsed}
      className="h-screen w-screen overflow-hidden flex bg-[#EEF2F7]"
    >
      {/* Admin Sidebar with B2C Customers active */}
      <AdminSidebar currentTab="B2C Customers" />

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-[#EEF2F7]">
        {/* Header */}
        <AdminHeader
          breadcrumbs={breadcrumbs}
          userName="Sample Admin"
          userRole="Super Admin"
          userInitials="SA"
        />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {selectedCustomer ? (
              <B2CCustomerDetailsView
                customer={selectedCustomer}
                onBack={() => setSelectedCustomer(null)}
                onUpdateCustomer={handleUpdateCustomer}
                isCollapsedSidebarScreen={initialSidebarCollapsed}
              />
            ) : (
              <>
                {/* Page Header (div.ph2) */}
                <div className="space-y-1">
                  <span className="inline-block text-xs font-bold text-[#193CB8] bg-[#EAF4FD] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Core Admin
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight">
                    B2C Customers
                  </h1>
                  <p className="text-sm text-[#4F5B70]">
                    View and manage customer profiles.
                  </p>
                </div>

                {/* Main Card (section.tc2) */}
                <section className="bg-white rounded-2xl border border-[#DCE2EB] shadow-xs overflow-hidden">
                  {/* Filters Bar (div.fld & select.sel) */}
                  <div className="p-4 sm:p-5 border-b border-[#EEF1F5] grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-4 items-end">
                    {/* Search Field */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="customer-search"
                        className="text-xs font-bold text-[#141B28] uppercase tracking-wider"
                      >
                        Search Customers
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8792A4] pointer-events-none" />
                        <Input
                          id="customer-search"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by name, email or mobile"
                          className="h-10 pl-10 pr-9 rounded-xl border-[#C5CFDC] bg-white text-sm text-[#141B28] placeholder:text-[#8792A4] focus:border-[#012A5E] focus:ring-1 focus:ring-[#012A5E] transition-all"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8792A4] hover:text-[#141B28] p-0.5 rounded-full transition-colors cursor-pointer"
                            title="Clear search"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sign-in Method Select */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="signin-select"
                        className="text-xs font-bold text-[#141B28] uppercase tracking-wider"
                      >
                        Sign-in Method
                      </Label>
                      <Select
                        value={signinFilter}
                        onValueChange={(val) =>
                          setSigninFilter(val as SignInMethodFilter)
                        }
                      >
                        <SelectTrigger
                          id="signin-select"
                          className="h-10 rounded-xl border-[#C5CFDC] bg-white text-sm text-[#141B28] font-medium focus:border-[#012A5E] focus:ring-1 focus:ring-[#012A5E]"
                        >
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-lg">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Results Count Bar (p#res) */}
                  <div className="px-5 py-2.5 bg-[#EEF2F7] border-b border-[#EEF1F5] flex items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm font-bold text-[#141B28]">
                      {filteredCustomers.length}{' '}
                      {filteredCustomers.length === 1
                        ? 'customer'
                        : 'customers'}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2F7] text-[#4F5B70] border border-[#DCE2EB]">
                      Sample data
                    </span>
                  </div>

                  {/* Table or Empty State */}
                  {filteredCustomers.length === 0 ? (
                    <div className="p-8">
                      <EmptyState
                        title="No customers found"
                        description="No customer records match your active search and filter criteria."
                        onReset={handleResetFilters}
                      />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <DataTable
                        data={filteredCustomers}
                        columns={columns}
                        getRowId={(customer) => customer.id}
                        headerClassName="bg-transparent border-b border-[#EEF1F5]"
                        headerRowClassName="hover:bg-transparent"
                        rowClassName="border-b border-[#EEF1F5] hover:bg-[#F9FAFC] transition-colors"
                      />
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </SidebarProvider>
  )
}

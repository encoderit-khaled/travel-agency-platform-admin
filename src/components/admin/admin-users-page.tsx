import * as React from 'react'
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  Search,
  ChevronDown,
  X,
  UserCog,
  FileText,
  CreditCard,
  Sliders,
  Headphones,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminFooter } from './admin-footer'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { SidebarProvider } from '#/components/ui/sidebar'
import { EmptyState } from '#/components/ui/empty-state'
import { AddAdminUserDialog } from './add-admin-user-dialog'
import { ManageUserDialog } from './manage-user-dialog'
import { RolesOverviewDialog } from './roles-overview-dialog'
import type { AdminRole, AdminUser } from './admin-users-data'
import { INITIAL_ADMIN_USERS } from './admin-users-data'

interface AdminUsersPageProps {
  initialSearchQuery?: string
  initialRoleFilter?: string
  initialEmpty?: boolean
  initialAction?: 'add' | 'manage' | 'roles'
  initialUserId?: string
}

export function AdminUsersPage({
  initialSearchQuery = '',
  initialRoleFilter = 'all',
  initialEmpty = false,
  initialAction,
  initialUserId,
}: AdminUsersPageProps) {
  const [users, setUsers] = React.useState<AdminUser[]>(INITIAL_ADMIN_USERS)
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery)
  const [selectedRole, setSelectedRole] =
    React.useState<string>(initialRoleFilter)
  const [forceNoData, setForceNoData] = React.useState(initialEmpty)

  // Dialog states
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(
    initialAction === 'add',
  )
  const [isRolesOpen, setIsRolesOpen] = React.useState(
    initialAction === 'roles',
  )
  const [selectedUserToManage, setSelectedUserToManage] =
    React.useState<AdminUser | null>(() => {
      if (initialUserId) {
        return users.find((u) => u.id === initialUserId) || null
      }
      if (initialAction === 'manage') {
        return users[0] || null
      }
      return null
    })

  // Filtered users
  const filteredUsers = React.useMemo(() => {
    if (forceNoData) return []

    return users.filter((u) => {
      // Role filter
      if (selectedRole !== 'all' && u.role !== selectedRole) {
        return false
      }

      // Search filter (name or email)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = u.name.toLowerCase().includes(q)
        const matchesEmail = u.email.toLowerCase().includes(q)
        const matchesRole = u.role.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesRole) {
          return false
        }
      }

      return true
    })
  }, [users, searchQuery, selectedRole, forceNoData])

  // Handlers
  const handleAddUser = (newUser: AdminUser) => {
    setUsers((prev) => [newUser, ...prev])
  }

  const handleUpdateUser = (updated: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedRole('all')
    setForceNoData(false)
  }

  const getRoleIcon = (role: AdminRole) => {
    switch (role) {
      case 'Super Admin':
        return <Shield className="size-3 text-[#012A5E]" />
      case 'Content':
        return <FileText className="size-3 text-[#012A5E]" />
      case 'Finance':
        return <CreditCard className="size-3 text-[#012A5E]" />
      case 'Operations':
        return <Sliders className="size-3 text-[#012A5E]" />
      case 'Support':
        return <Headphones className="size-3 text-[#012A5E]" />
      default:
        return <Shield className="size-3 text-[#012A5E]" />
    }
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-[#F4F6F9]">
        {/* 1. Admin Sidebar with Admin Users active tab */}
        <AdminSidebar currentTab="Admin Users" />

        {/* 2. Main Layout Column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <AdminHeader
            breadcrumbs={[
              { label: 'Admin', href: '/admin' },
              { label: 'Core Admin', href: '#' },
              { label: 'Admin Users' },
            ]}
            userName="Admin user"
            userRole="Reviewer · can decide"
            userInitials="AD"
          />

          {/* Main Page Content */}
          <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
            {/* Simulation controls / banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#DCE2EB] rounded-2xl p-3 sm:px-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5B70]">
                <Sparkles className="size-4 text-[#F1C134]" />
                <span>
                  Figma Screen:{' '}
                  <strong className="text-[#012A5E]">
                    Admin Users (Node #975:3024)
                  </strong>
                </span>
                <span className="hidden sm:inline-block text-[#C5CFDC]">|</span>
                <span className="hidden sm:inline text-xs text-[#8792A4]">
                  Interactive prototype with real-time filters and user
                  management.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForceNoData((prev) => !prev)}
                  className={`h-7 px-2.5 text-xs font-bold rounded-lg border transition-colors ${
                    forceNoData
                      ? 'bg-amber-500/10 text-amber-700 border-amber-300'
                      : 'border-[#C5CFDC] text-[#4F5B70] hover:bg-[#EEF2F7]'
                  }`}
                >
                  <RotateCcw className="size-3 mr-1" />
                  <span>{forceNoData ? 'Show Data' : 'Simulate Empty'}</span>
                </Button>
              </div>
            </div>

            {/* Page Header (div.ph2) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0267B8] block mb-1">
                  Core Admin
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012A5E] tracking-tight font-sans">
                  Admin Users
                </h1>
                <p className="text-sm text-[#4F5B70] mt-1">
                  Manage Admin accounts and their assigned roles.
                </p>
              </div>

              {/* Action Buttons (div.ph2-a) */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRolesOpen(true)}
                  className="h-11 px-4 rounded-xl bg-white border border-[#C5CFDC] text-[#012A5E] hover:bg-[#F8FAFC] font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Shield className="size-4.5 text-[#012A5E]" />
                  <span>Manage Roles & Permissions</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => setIsAddUserOpen(true)}
                  className="h-11 px-4.5 rounded-xl bg-[#012A5E] hover:bg-[#02387B] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="size-4.5 text-white" />
                  <span>Add Admin User</span>
                </Button>
              </div>
            </div>

            {/* Summary KPI Cards (Summary) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {/* Card 1: Total Admin Users */}
              <div className="relative overflow-hidden bg-white border border-[#DCE2EB] rounded-[18px] p-4 flex flex-col justify-between shadow-2xs">
                {/* Decorative circle */}
                <div
                  aria-hidden="true"
                  className="absolute -top-10 -right-10 size-28 rounded-full pointer-events-none opacity-20 bg-linear-to-br from-[#0267B8] to-transparent"
                />

                <div className="flex items-center justify-between mb-3">
                  <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                    <Users className="size-5" />
                  </div>
                  <span className="bg-[#EEF2F7] border border-[#DCE2EB] rounded-full px-2 py-0.5 text-[11px] font-extrabold text-[#4F5B70] tracking-wide">
                    Sample data
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#4F5B70]">
                    Admin Users
                  </p>
                  <p className="text-2xl font-black text-[#141B28] mt-0.5">
                    {users.length}
                  </p>
                </div>
              </div>

              {/* Card 2: Predefined roles */}
              <div className="relative overflow-hidden bg-white border border-[#DCE2EB] rounded-[18px] p-4 flex flex-col justify-between shadow-2xs">
                {/* Decorative circle */}
                <div
                  aria-hidden="true"
                  className="absolute -top-10 -right-10 size-28 rounded-full pointer-events-none opacity-20 bg-linear-to-br from-[#0267B8] to-transparent"
                />

                <div className="flex items-center justify-between mb-3">
                  <div className="size-9 rounded-xl bg-[#EAF4FD] text-[#0267B8] flex items-center justify-center">
                    <ShieldCheck className="size-5" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#4F5B70]">
                    Predefined roles
                  </p>
                  <p className="text-2xl font-black text-[#141B28] mt-0.5">5</p>
                </div>
              </div>
            </div>

            {/* Table Container Card (section.tc2) */}
            <section className="bg-white border border-[#DCE2EB] rounded-[18px] shadow-xs overflow-hidden">
              {/* Filter Bar */}
              <div className="p-4 sm:p-4.5 border-b border-[#EEF1F5] grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3 items-end">
                {/* Search Field */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="search-admin-users"
                    className="text-xs font-bold text-[#141B28] block"
                  >
                    Search Admin Users
                  </Label>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 size-4.5 text-[#8792A4] pointer-events-none" />
                    <Input
                      id="search-admin-users"
                      placeholder="Search by name or email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 pl-10 pr-9 bg-white border-[#C5CFDC] rounded-xl text-sm placeholder:text-[#8792A4] text-[#141B28] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 text-[#8792A4] hover:text-[#141B28] p-1"
                        aria-label="Clear search"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Role Select */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="select-role-filter"
                    className="text-xs font-bold text-[#141B28] block"
                  >
                    Role
                  </Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(val) => setSelectedRole(val)}
                  >
                    <SelectTrigger
                      id="select-role-filter"
                      className="h-11 bg-white border-[#C5CFDC] rounded-xl text-sm font-medium text-[#141B28] px-3.5"
                    >
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#DCE2EB]">
                      <SelectItem
                        value="all"
                        className="cursor-pointer font-medium"
                      >
                        All Roles
                      </SelectItem>
                      <SelectItem
                        value="Super Admin"
                        className="cursor-pointer font-medium"
                      >
                        Super Admin
                      </SelectItem>
                      <SelectItem
                        value="Operations"
                        className="cursor-pointer font-medium"
                      >
                        Operations
                      </SelectItem>
                      <SelectItem
                        value="Support"
                        className="cursor-pointer font-medium"
                      >
                        Support
                      </SelectItem>
                      <SelectItem
                        value="Finance"
                        className="cursor-pointer font-medium"
                      >
                        Finance
                      </SelectItem>
                      <SelectItem
                        value="Content"
                        className="cursor-pointer font-medium"
                      >
                        Content
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Result Count Strip (p#res) */}
              <div className="bg-[#EEF2F7] px-4.5 py-2.5 border-b border-[#EEF1F5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#4F5B70]">
                    {filteredUsers.length} Admin users
                  </span>
                  <span className="bg-[#EEF2F7] border border-[#DCE2EB] rounded-full px-2 py-0.5 text-[11px] font-extrabold text-[#4F5B70]">
                    Sample data
                  </span>
                </div>
                {(searchQuery || selectedRole !== 'all' || forceNoData) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#0267B8] hover:underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Table / Empty State */}
              {filteredUsers.length === 0 ? (
                <div className="py-12 px-4">
                  <EmptyState
                    icon={Search}
                    title="No admin users found"
                    description="No admin users matched your filter criteria. Try searching for a different name, email, or role."
                    action={
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetFilters}
                        className="rounded-xl border-[#C5CFDC] text-[#012A5E] font-bold text-xs"
                      >
                        Clear filters
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#EEF2F7] border-b border-[#EEF1F5]">
                        <th className="px-5 py-3 text-xs font-bold text-[#4F5B70] tracking-wider uppercase">
                          Admin User
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-[#4F5B70] tracking-wider uppercase">
                          Admin Email
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-[#4F5B70] tracking-wider uppercase">
                          Role
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-[#4F5B70] tracking-wider uppercase text-right">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF1F5]">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-[#F8FAFC] transition-colors group"
                        >
                          {/* Col 1: Admin User (Avatar + Name) */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className={`size-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-2xs ${
                                  user.avatarBg === 'saffron'
                                    ? 'bg-[#F1C134] text-[#001A3D]'
                                    : 'bg-[#01559A] text-white'
                                }`}
                              >
                                {user.initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#012A5E]">
                                  {user.name}
                                </span>
                                {user.status === 'suspended' && (
                                  <span className="text-[10px] font-bold text-amber-600">
                                    Suspended
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Admin Email */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-sm text-[#4F5B70] font-normal">
                              {user.email}
                            </span>
                          </td>

                          {/* Col 3: Role Badge */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEF2F7] text-[#012A5E] border border-[#DCE2EB]">
                              {getRoleIcon(user.role)}
                              <span>{user.role}</span>
                            </span>
                          </td>

                          {/* Col 4: Action Button (Manage User) */}
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUserToManage(user)}
                              className="h-8.5 px-3.5 rounded-[11px] bg-white border border-[#C5CFDC] text-[#012A5E] hover:bg-[#EEF2F7] font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <UserCog className="size-3.5 text-[#012A5E]" />
                              <span>Manage User</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>

        {/* Dialogs */}
        <AddAdminUserDialog
          open={isAddUserOpen}
          onOpenChange={setIsAddUserOpen}
          onAddUser={handleAddUser}
        />

        <ManageUserDialog
          user={selectedUserToManage}
          open={Boolean(selectedUserToManage)}
          onOpenChange={(open) => {
            if (!open) setSelectedUserToManage(null)
          }}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />

        <RolesOverviewDialog open={isRolesOpen} onOpenChange={setIsRolesOpen} />
      </div>
    </SidebarProvider>
  )
}

import * as React from 'react'
import {
  ShieldCheck,
  Shield,
  Sliders,
  Wallet,
  Headphones,
  FileText,
  Info,
  Pencil,
  Save,
  RotateCcw,
  Search,
  Lock,
  AlertTriangle,
  Check,
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarDays,
  Briefcase,
  Boxes,
  Percent,
  Star,
  Bell,
  MessageSquare,
  FileSpreadsheet,
  BarChart3,
  Settings,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '#/components/ui/table'
import { SidebarProvider } from '#/components/ui/sidebar'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminFooter } from './admin-footer'
import {
  ADMIN_ROLES,
  CORE_ADMIN_AREAS,
  PLATFORM_MODULE_AREAS,
  ALL_PERMISSION_AREAS,
  INITIAL_ROLE_PERMISSION_MATRIX,
} from './admin-roles-permissions-data'
import type {
  AdminRoleId,
  PermissionStatus,
  RolePermissionMatrix,
  AdminRolesPermissionsPageProps as Props,
} from './admin-roles-permissions-types'
import { EditPermissionsDialog } from './edit-permissions-dialog'
import { cn } from '#/lib/utils'

export interface AdminRolesPermissionsPageProps extends Props {
  initialRole?: AdminRoleId | string
  initialEditMode?: boolean
}

const AREA_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  'b2c-customers': Users,
  'admin-users': UserCheck,
  'roles-permissions': Shield,
  'audit-log': FileText,
  bookings: CalendarDays,
  agents: Briefcase,
  suppliers: Boxes,
  'pricing-promotions': Percent,
  reviews: Star,
  notifications: Bell,
  'crm-whatsapp': MessageSquare,
  content: FileSpreadsheet,
  reports: BarChart3,
  'platform-settings': Settings,
}

export function AdminRolesPermissionsPage({
  initialRoleId,
  initialRole,
  initialEditOpen = false,
  initialEditMode = false,
  initialNodeId,
}: AdminRolesPermissionsPageProps) {
  // Normalize role ID
  const effectiveRoleId: AdminRoleId = React.useMemo(() => {
    const raw = initialRoleId || initialRole
    if (raw === 'super_admin' || raw === 'super-admin') return 'super-admin'
    if (raw === 'operations') return 'operations'
    if (raw === 'finance') return 'finance'
    if (raw === 'support') return 'support'
    if (raw === 'content') return 'content'
    return 'super-admin'
  }, [initialRoleId, initialRole])

  // Node 984:1859 or 984-1859 is the "Edit Permissions" screen
  const isEditNode =
    initialNodeId === '984-1859' ||
    initialNodeId === '984:1859' ||
    initialEditOpen ||
    initialEditMode

  const [selectedRole, setSelectedRole] = React.useState<AdminRoleId>(effectiveRoleId)
  const [isEditMode, setIsEditMode] = React.useState<boolean>(isEditNode)
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(isEditNode)
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [savedNotification, setSavedNotification] = React.useState<string | null>(null)

  // Full role permission matrix
  const [matrix, setMatrix] = React.useState<RolePermissionMatrix>(INITIAL_ROLE_PERMISSION_MATRIX)
  const [draftMatrix, setDraftMatrix] = React.useState<RolePermissionMatrix>(INITIAL_ROLE_PERMISSION_MATRIX)

  React.useEffect(() => {
    if (isEditMode) {
      setDraftMatrix(JSON.parse(JSON.stringify(matrix)))
    }
  }, [isEditMode, matrix])

  const currentRole = ADMIN_ROLES.find((r) => r.id === selectedRole) || ADMIN_ROLES[0]

  const activePermissions = isEditMode
    ? draftMatrix[selectedRole]
    : matrix[selectedRole]

  const handleCellClick = (areaId: string, roleId: AdminRoleId) => {
    if (!isEditMode) {
      // In view mode, clicking a cell focuses that role
      setSelectedRole(roleId)
      return
    }

    // In edit mode, clicking a cell cycles: not-configured -> visible -> hidden -> not-configured
    const current = draftMatrix[roleId][areaId] ?? 'not-configured'
    const next: PermissionStatus =
      current === 'not-configured'
        ? 'visible'
        : current === 'visible'
          ? 'hidden'
          : 'not-configured'

    setDraftMatrix((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [areaId]: next,
      },
    }))
  }

  const handleSaveInline = () => {
    setMatrix(draftMatrix)
    setIsEditMode(false)
    setSavedNotification(`Permissions for ${currentRole.name} updated successfully!`)
    setTimeout(() => setSavedNotification(null), 4000)
  }

  const handleDiscardInline = () => {
    setDraftMatrix(matrix)
    setIsEditMode(false)
  }

  const handleSaveDialog = (updatedMatrix: RolePermissionMatrix) => {
    setMatrix(updatedMatrix)
    setDraftMatrix(updatedMatrix)
    setSavedNotification(`Permissions updated successfully!`)
    setTimeout(() => setSavedNotification(null), 4000)
  }

  // Filter areas
  const filteredCoreAreas = CORE_ADMIN_AREAS.filter((area) => {
    const matchesSearch =
      searchQuery === '' ||
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.id.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (statusFilter !== 'all') {
      const status = activePermissions[area.id] ?? 'not-configured'
      if (statusFilter !== status) return false
    }
    return true
  })

  const filteredPlatformAreas = PLATFORM_MODULE_AREAS.filter((area) => {
    const matchesSearch =
      searchQuery === '' ||
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.id.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (statusFilter !== 'all') {
      const status = activePermissions[area.id] ?? 'not-configured'
      if (statusFilter !== status) return false
    }
    return true
  })

  // Exact Badge pill matching Figma templates
  const renderStatusPill = (status: PermissionStatus, isInteractive = false) => {
    if (status === 'visible') {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all select-none',
            'bg-[#EAF8F0] text-[#15803D] border border-[#A6E7C4] shadow-2xs',
            isInteractive && 'hover:scale-105 cursor-pointer',
          )}
        >
          <span className="size-2 rounded-full bg-[#16A34A] shrink-0" />
          <span>Visible</span>
        </span>
      )
    }

    if (status === 'hidden') {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all select-none',
            'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] shadow-2xs',
            isInteractive && 'hover:scale-105 cursor-pointer',
          )}
        >
          <span className="size-2 rounded-full bg-[#64748B] shrink-0" />
          <span>Hidden</span>
        </span>
      )
    }

    // not-configured exact styling from Figma EL-57b4e922 & EL-c72bfb92:
    // border dashed, Catskill White background, Comet/slate text, font-bold 11.5px
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-tight transition-all select-none',
          'bg-[#F8FAFC] text-[#64748B] border border-dashed border-[#CBD5E1]',
          isInteractive && 'hover:scale-105 hover:bg-white cursor-pointer',
        )}
      >
        <span className="size-2 rounded-full border border-dashed border-[#94A3B8] shrink-0" />
        <span>Not configured</span>
      </span>
    )
  }

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield':
        return ShieldCheck
      case 'sliders':
        return Sliders
      case 'wallet':
        return Wallet
      case 'headphones':
        return Headphones
      default:
        return FileText
    }
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        {/* Main Admin Sidebar */}
        <AdminSidebar currentTab="Roles & Permissions" />

        {/* Main Workspace Column */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Admin Header with Breadcrumbs */}
          <AdminHeader
            breadcrumbs={[
              { label: 'Core Admin', href: '/admin' },
              { label: 'Roles & Permissions', isCurrent: true },
            ]}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Feedback notification toast */}
            {savedNotification && (
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <Check className="size-5 text-emerald-600 shrink-0" />
                  <span>{savedNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSavedNotification(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Page Header (div.ph2) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#174A7C]">
                  Core Admin
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001A3D] tracking-tight mt-0.5">
                  Roles & Permissions
                </h1>
                <p className="text-sm text-[#5E6D82] mt-1">
                  Configure access for predefined Admin roles.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                {isEditMode ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleDiscardInline}
                      className="text-slate-600 border-slate-300 hover:bg-slate-100"
                    >
                      <RotateCcw className="size-4 mr-1.5" />
                      Discard Changes
                    </Button>
                    <Button
                      onClick={handleSaveInline}
                      className="bg-[#001A3D] hover:bg-[#00285C] text-white font-semibold shadow-xs gap-1.5"
                    >
                      <Save className="size-4 text-[#F1C134]" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setDialogOpen(true)}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      Configure Role...
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditMode(true)
                        setDialogOpen(true)
                      }}
                      className="bg-[#001A3D] hover:bg-[#00285C] text-white font-semibold shadow-xs gap-2 px-5 py-2.5"
                    >
                      <Pencil className="size-4 text-[#F1C134]" />
                      <span>Edit Permissions</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Editing Notice Banner when in Edit Mode */}
            {isEditMode && (
              <div className="flex items-center justify-between p-3.5 px-4 bg-amber-50/90 border border-amber-300 rounded-xl text-amber-900 text-sm font-medium shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>
                    <strong>Edit Mode Active:</strong> Click any cell in the table to cycle permission states (Visible ➔ Hidden ➔ Not configured), or use &quot;Configure Role...&quot; for modal editing.
                  </span>
                </div>
                <Badge className="bg-amber-200 text-amber-900 font-bold border-amber-300 text-xs">
                  Role: {currentRole.name}
                </Badge>
              </div>
            )}

            {/* Info Notice Banner (p.ib2) matching Figma */}
            <div className="flex items-start sm:items-center gap-3.5 p-4 sm:px-5 bg-[#EBF3FC] border border-[#C8DCF0] rounded-2xl shadow-2xs">
              <div className="size-5 rounded-full text-[#174A7C] shrink-0 mt-0.5 sm:mt-0 flex items-center justify-center">
                <Info className="size-5" />
              </div>
              <p className="text-xs sm:text-sm text-[#174A7C] font-medium leading-relaxed">
                Role names are predefined. Exact permission assignments are configured by the platform administrator and are not defined by the current project source.
              </p>
            </div>

            {/* Predefined Admin Roles Cards (button.rcb list from Figma) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Predefined Admin Roles (Select to view & highlight)
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {ADMIN_ROLES.length} predefined roles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {ADMIN_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id
                  const Icon = getRoleIcon(role.iconName)

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        'flex flex-col justify-between p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer',
                        'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001A3D]',
                        isSelected
                          ? 'bg-gradient-to-br from-[#F2F7FD] to-white border-[#001A3D] shadow-md ring-1 ring-[#001A3D]/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs shadow-2xs',
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div
                            className={cn(
                              'size-8 rounded-lg flex items-center justify-center transition-colors',
                              isSelected
                                ? 'bg-[#001A3D] text-[#F1C134]'
                                : 'bg-slate-100 text-slate-600',
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                          {isSelected && (
                            <span className="size-2 rounded-full bg-[#16A34A]" title="Selected Active Role" />
                          )}
                        </div>

                        <h3 className="text-base font-bold text-[#001A3D] mt-2 tracking-tight">
                          {role.name}
                        </h3>
                        <p className="text-xs text-[#5E6D82]">
                          {role.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 mt-4 pt-3 border-t border-slate-100">
                        <span className="text-xs font-semibold text-[#001A3D]">
                          {role.userCountLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F8FAFC] text-slate-500 border border-slate-200">
                          {role.tag}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Two-Column Layout (div.rpg): Matrix on Left, Side Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Permission Matrix Table Card */}
              <div className="lg:col-span-7 xl:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                {/* Table Header & Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                  <div>
                    <h2 className="text-lg font-bold text-[#001A3D] tracking-tight">
                      Permission Matrix
                    </h2>
                    <p className="text-xs text-[#5E6D82]">
                      High-level access by Admin area.
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-48 sm:w-56">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search area..."
                        className="h-8 pl-8 text-xs bg-slate-50/80 border-slate-200 focus-visible:bg-white"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-8 text-xs px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
                    >
                      <option value="all">All statuses</option>
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                      <option value="not-configured">Not configured</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader className="bg-[#F8FAFC]">
                      <TableRow className="border-b border-slate-200 hover:bg-transparent">
                        <TableHead className="w-[200px] text-xs font-bold text-[#001A3D] py-3.5 pl-5">
                          Permission area
                        </TableHead>
                        {ADMIN_ROLES.map((role) => {
                          const isSelected = selectedRole === role.id
                          return (
                            <TableHead
                              key={role.id}
                              onClick={() => setSelectedRole(role.id)}
                              className={cn(
                                'text-center text-xs font-bold py-3.5 px-3 transition-colors cursor-pointer select-none',
                                isSelected
                                  ? 'text-[#001A3D] bg-[#F2F7FD] border-x border-[#001A3D]/20 shadow-2xs font-extrabold'
                                  : 'text-slate-600 hover:text-[#001A3D]',
                              )}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>{role.name}</span>
                                {isSelected && (
                                  <span className="size-1.5 rounded-full bg-[#001A3D]" />
                                )}
                              </div>
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {/* Section 1: Core Admin */}
                      {filteredCoreAreas.length > 0 && (
                        <>
                          <TableRow className="bg-[#F8FAFC]/80 border-y border-slate-200/80 hover:bg-[#F8FAFC]">
                            <TableCell
                              colSpan={6}
                              className="py-2 px-5 text-[11px] font-extrabold uppercase tracking-wider text-[#174A7C]"
                            >
                              Core Admin ({filteredCoreAreas.length})
                            </TableCell>
                          </TableRow>

                          {filteredCoreAreas.map((area) => {
                            const Icon = AREA_ICONS[area.id] ?? Shield
                            return (
                              <TableRow
                                key={area.id}
                                className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                              >
                                <TableCell className="py-3 pl-5 pr-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="size-7 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                      <Icon className="size-3.5" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-[#001A3D]">
                                        {area.name}
                                      </div>
                                      <div className="text-[11px] text-slate-400">
                                        Core Admin Area
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>

                                {ADMIN_ROLES.map((role) => {
                                  const isSelected = selectedRole === role.id
                                  const currentMap = isEditMode
                                    ? draftMatrix[role.id]
                                    : matrix[role.id]
                                  const status = currentMap[area.id] ?? 'not-configured'

                                  return (
                                    <TableCell
                                      key={role.id}
                                      onClick={() => handleCellClick(area.id, role.id)}
                                      className={cn(
                                        'text-center py-3 px-2 transition-colors select-none',
                                        isSelected
                                          ? 'bg-[#F2F7FD]/70 border-x border-[#001A3D]/10'
                                          : '',
                                      )}
                                    >
                                      {renderStatusPill(status, isEditMode)}
                                    </TableCell>
                                  )
                                })}
                              </TableRow>
                            )
                          })}
                        </>
                      )}

                      {/* Section 2: Platform Modules */}
                      {filteredPlatformAreas.length > 0 && (
                        <>
                          <TableRow className="bg-[#F8FAFC]/80 border-y border-slate-200/80 hover:bg-[#F8FAFC]">
                            <TableCell
                              colSpan={6}
                              className="py-2 px-5 text-[11px] font-extrabold uppercase tracking-wider text-[#174A7C]"
                            >
                              Platform Modules ({filteredPlatformAreas.length})
                            </TableCell>
                          </TableRow>

                          {filteredPlatformAreas.map((area) => {
                            const Icon = AREA_ICONS[area.id] ?? Shield
                            return (
                              <TableRow
                                key={area.id}
                                className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                              >
                                <TableCell className="py-3 pl-5 pr-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="size-7 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                      <Icon className="size-3.5" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-[#001A3D]">
                                        {area.name}
                                      </div>
                                      <div className="text-[11px] text-slate-400">
                                        Platform Module Area
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>

                                {ADMIN_ROLES.map((role) => {
                                  const isSelected = selectedRole === role.id
                                  const currentMap = isEditMode
                                    ? draftMatrix[role.id]
                                    : matrix[role.id]
                                  const status = currentMap[area.id] ?? 'not-configured'

                                  return (
                                    <TableCell
                                      key={role.id}
                                      onClick={() => handleCellClick(area.id, role.id)}
                                      className={cn(
                                        'text-center py-3 px-2 transition-colors select-none',
                                        isSelected
                                          ? 'bg-[#F2F7FD]/70 border-x border-[#001A3D]/10'
                                          : '',
                                      )}
                                    >
                                      {renderStatusPill(status, isEditMode)}
                                    </TableCell>
                                  )
                                })}
                              </TableRow>
                            )
                          })}
                        </>
                      )}

                      {filteredCoreAreas.length === 0 && filteredPlatformAreas.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                            No permission areas match your search filter.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Right Column: Side Panel (2 Cards from Figma) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                {/* Card 1: Menu Access Preview (section.sc3) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-[#001A3D] tracking-tight">
                      Menu Access Preview
                    </h2>
                    <p className="text-xs text-[#5E6D82] mt-0.5">
                      Admin menu for <strong className="text-[#001A3D]">{currentRole.name}</strong> based on the current configuration.
                    </p>
                  </div>

                  {/* Dark Simulated Sidebar Box matching Figma fill_bbc54479 */}
                  <div className="bg-[#001A3D] bg-gradient-to-b from-[#001A3D] via-[#012A5E] to-[#0A2244] rounded-xl p-4 text-white shadow-inner">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {/* Left: Core Admin */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-[#8C9BAE] uppercase tracking-wider border-b border-white/10 pb-1.5">
                          Core Admin
                        </div>
                        <ul className="space-y-1.5">
                          {CORE_ADMIN_AREAS.map((item) => {
                            const status = activePermissions[item.id] ?? 'not-configured'
                            // In Figma for Super Admin all are visible
                            const isVisible =
                              status === 'visible' ||
                              (selectedRole === 'super-admin' && status === 'not-configured')
                            const isHidden = status === 'hidden'

                            return (
                              <li
                                key={item.id}
                                className={cn(
                                  'flex items-center justify-between text-xs py-1 px-1.5 rounded transition-colors',
                                  isVisible
                                    ? 'text-[#C9D7EA] font-medium'
                                    : isHidden
                                      ? 'text-slate-500 line-through opacity-70'
                                      : 'text-slate-400 italic',
                                )}
                              >
                                <span className="truncate pr-1">{item.name}</span>
                                {isVisible ? (
                                  <span className="size-2 rounded-full bg-[#22C55E] shrink-0" title="Visible" />
                                ) : isHidden ? (
                                  <span className="size-2 rounded-full bg-[#8C97A8] shrink-0" title="Hidden" />
                                ) : (
                                  <span className="size-2 rounded-full border border-dashed border-[#CBD5E1] shrink-0" title="Not configured" />
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      {/* Right: Platform Modules */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-[#8C9BAE] uppercase tracking-wider border-b border-white/10 pb-1.5">
                          Platform Modules
                        </div>
                        <ul className="space-y-1.5">
                          {PLATFORM_MODULE_AREAS.map((item) => {
                            const status = activePermissions[item.id] ?? 'not-configured'
                            const isVisible =
                              status === 'visible' ||
                              (selectedRole === 'super-admin' && status === 'not-configured')
                            const isHidden = status === 'hidden'

                            return (
                              <li
                                key={item.id}
                                className={cn(
                                  'flex items-center justify-between text-xs py-1 px-1.5 rounded transition-colors',
                                  isVisible
                                    ? 'text-[#C9D7EA] font-medium'
                                    : isHidden
                                      ? 'text-slate-500 line-through opacity-70'
                                      : 'text-slate-400 italic',
                                )}
                              >
                                <span className="truncate pr-1">{item.name}</span>
                                {isVisible ? (
                                  <span className="size-2 rounded-full bg-[#22C55E] shrink-0" title="Visible" />
                                ) : isHidden ? (
                                  <span className="size-2 rounded-full bg-[#8C97A8] shrink-0" title="Hidden" />
                                ) : (
                                  <span className="size-2 rounded-full border border-dashed border-[#CBD5E1] shrink-0" title="Not configured" />
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Legend (p.mp-k from Figma) */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-[#5E6D82]">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-sm bg-[#22C55E]" />
                      <span>Visible</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-sm bg-[#8C97A8]" />
                      <span>Hidden</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-sm border border-dashed border-[#CBD5E1] bg-slate-100" />
                      <span>Not configured</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Permissions apply beyond navigation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-xl bg-[#001A3D] text-[#F1C134] flex items-center justify-center shrink-0 shadow-xs">
                      <Lock className="size-4.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#001A3D]">
                        Permissions apply beyond navigation
                      </h2>
                      <p className="text-xs text-[#5E6D82] mt-1 leading-relaxed">
                        Hiding a menu item is not authorization. The same permission must also be enforced by the backend/API.
                      </p>
                    </div>
                  </div>

                  {/* Audit log notice (p.aud from Figma) */}
                  <div className="flex items-center gap-2 p-3 bg-[#FFF8EA] border border-[#F1C134]/60 rounded-xl text-[#7A4B00] text-xs font-medium">
                    <AlertTriangle className="size-4 text-[#F1C134] shrink-0" />
                    <span>Permission changes may be recorded in the Audit Log.</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Admin Footer */}
          <AdminFooter />
        </div>

        {/* Edit Permissions Dialog Modal (Node 984:1859) */}
        <EditPermissionsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentRole={selectedRole}
          matrix={matrix}
          onSave={handleSaveDialog}
        />
      </div>
    </SidebarProvider>
  )
}

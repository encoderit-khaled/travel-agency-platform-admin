import * as React from 'react'
import {
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Eye,
  Sliders,
  RotateCcw,
} from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminFooter } from './admin-footer'
import { SidebarProvider } from '#/components/ui/sidebar'
import { Input } from '#/components/ui/input'
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
import {
  INITIAL_AUDIT_LOGS,
  AUDIT_AREAS,
  AUDIT_ADMINS,
} from './admin-audit-log-data'
import type {
  AdminAuditLogPageProps,
  AuditLogItem,
} from './admin-audit-log-types'
import { cn } from '#/lib/utils'

function getActionIcon(action: string) {
  if (action.includes('permissions') || action.includes('Role')) {
    return <ShieldCheck className="size-4.5 text-[#012A5E]" />
  }
  if (action.includes('created')) {
    return <UserPlus className="size-4.5 text-[#012A5E]" />
  }
  if (action.includes('viewed')) {
    return <Eye className="size-4.5 text-[#012A5E]" />
  }
  if (action.includes('updated')) {
    return <UserCheck className="size-4.5 text-[#012A5E]" />
  }
  return <Sliders className="size-4.5 text-[#012A5E]" />
}

export function AdminAuditLogPage({
  initialSearchQuery = '',
  initialArea = 'all',
  initialAdmin = 'all',
  className,
}: AdminAuditLogPageProps) {
  const [searchQuery, setSearchQuery] =
    React.useState<string>(initialSearchQuery)
  const [selectedArea, setSelectedArea] = React.useState<string>(initialArea)
  const [selectedAdmin, setSelectedAdmin] = React.useState<string>(initialAdmin)

  // Filter audit logs
  const filteredLogs = React.useMemo(() => {
    return INITIAL_AUDIT_LOGS.filter((item: AuditLogItem) => {
      // Area filter
      if (selectedArea !== 'all' && item.area !== selectedArea) {
        return false
      }
      // Admin filter
      if (selectedAdmin !== 'all' && item.adminName !== selectedAdmin) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchAdmin = item.adminName.toLowerCase().includes(q)
        const matchAction = item.action.toLowerCase().includes(q)
        const matchArea = item.area.toLowerCase().includes(q)
        const matchContext = item.context.toLowerCase().includes(q)
        if (!matchAdmin && !matchAction && !matchArea && !matchContext) {
          return false
        }
      }
      return true
    })
  }, [searchQuery, selectedArea, selectedAdmin])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedArea('all')
    setSelectedAdmin('all')
  }

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedArea !== 'all' ||
    selectedAdmin !== 'all'

  const columns = React.useMemo<ColumnDef<AuditLogItem>[]>(
    () => [
      {
        id: 'dateTime',
        header: 'Date & Time',
        meta: {
          headerClassName:
            'w-[170px] px-4.5 py-3 text-left text-[11.5px] font-extrabold tracking-[0.06em] uppercase text-[#4F5B70] h-auto',
          cellClassName: 'px-4.5 py-4 align-middle',
        },
        cell: ({ row }) => (
          <div className="flex flex-col">
            <time className="text-[14px] font-extrabold text-[#141B28] leading-tight">
              {row.original.date}
            </time>
            <span className="text-[12.5px] font-bold text-[#4F5B70] leading-tight mt-0.5">
              {row.original.time}
            </span>
          </div>
        ),
      },
      {
        id: 'admin',
        header: 'Admin',
        meta: {
          headerClassName:
            'w-[280px] lg:w-[312px] px-4.5 py-3 text-left text-[11.5px] font-extrabold tracking-[0.06em] uppercase text-[#4F5B70] h-auto',
          cellClassName: 'px-4.5 py-4 align-middle',
        },
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'size-8 rounded-[10px] flex items-center justify-center text-[12px] font-extrabold shrink-0 shadow-2xs',
                  item.adminAvatarBg,
                  item.adminAvatarColor,
                )}
              >
                {item.adminInitials}
              </span>
              <span className="text-[14px] font-extrabold text-[#141B28]">
                {item.adminName}
              </span>
            </div>
          )
        },
      },
      {
        id: 'action',
        header: 'Action',
        meta: {
          headerClassName:
            'px-4.5 py-3 text-left text-[11.5px] font-extrabold tracking-[0.06em] uppercase text-[#4F5B70] h-auto',
          cellClassName: 'px-4.5 py-4 align-middle',
        },
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-2.5">
              <span className="size-8.5 rounded-[10px] bg-[#F1F5FA] flex items-center justify-center shrink-0 border border-[#DCE2EB]/50">
                {getActionIcon(item.action)}
              </span>
              <b className="text-[14px] font-extrabold text-[#141B28] font-normal">
                {item.action}
              </b>
            </div>
          )
        },
      },
      {
        id: 'area',
        header: 'Area',
        meta: {
          headerClassName:
            'w-[260px] lg:w-[318px] px-4.5 py-3 text-left text-[11.5px] font-extrabold tracking-[0.06em] uppercase text-[#4F5B70] h-auto',
          cellClassName: 'px-4.5 py-4 align-middle',
        },
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EEF3FA] text-[12px] font-bold text-[#012A5E]">
            {row.original.area}
          </span>
        ),
      },
      {
        id: 'context',
        header: 'Context',
        meta: {
          headerClassName:
            'w-[280px] lg:w-[346px] px-4.5 py-3 text-left text-[11.5px] font-extrabold tracking-[0.06em] uppercase text-[#4F5B70] h-auto',
          cellClassName: 'px-4.5 py-4 align-middle',
        },
        cell: ({ row }) => (
          <span className="text-[14px] font-bold text-[#141B28]">
            {row.original.context}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <SidebarProvider defaultOpen>
      <div
        className={cn(
          'flex min-h-screen w-full bg-[#F4F6FA] text-[#141B28] antialiased',
          className,
        )}
      >
        {/* Admin Sidebar */}
        <AdminSidebar currentTab="Audit Log" />

        {/* Main Column */}
        <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
          {/* Top Header / Navbar */}
          <AdminHeader
            breadcrumbs={[
              { label: 'Admin Panel', href: '/admin' },
              { label: 'Audit Log' },
            ]}
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
          />

          {/* Main Content */}
          <main className="flex-1 p-5 sm:p-7 lg:p-7 max-w-[1680px] w-full mx-auto">
            <div className="flex flex-col gap-5.5">
              {/* Page Header (div.ph2) */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-extrabold tracking-[0.08em] uppercase text-[#0267B8]">
                  Core Admin
                </span>
                <h1 className="text-[28px] sm:text-[30px] font-extrabold tracking-[-0.01em] text-[#012A5E] leading-tight">
                  Audit Log
                </h1>
                <p className="text-[15px] font-normal text-[#4F5B70]">
                  Review key actions performed in the Admin Panel.
                </p>
              </div>

              {/* Card Container (section.tc2) */}
              <section className="bg-white rounded-[18px] border border-[#DCE2EB] shadow-xs overflow-hidden">
                {/* Filter Toolbar */}
                <div className="p-4 sm:p-4.5 border-b border-[#EEF1F5] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_210px_210px] gap-3 items-end">
                  {/* Search Input */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="audit-search"
                      className="text-[13px] font-extrabold text-[#141B28]"
                    >
                      Search Audit Log
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8792A4] pointer-events-none" />
                      <Input
                        id="audit-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Admin, action or context"
                        className="pl-9.5 h-10 bg-white border-[#DCE2EB] rounded-xl text-sm text-[#141B28] placeholder:text-[#8792A4] focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]/20"
                      />
                    </div>
                  </div>

                  {/* Area Select */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="far"
                      className="text-[13px] font-extrabold text-[#141B28]"
                    >
                      Area
                    </label>
                    <Select
                      value={selectedArea}
                      onValueChange={(val) => setSelectedArea(val || 'all')}
                    >
                      <SelectTrigger
                        id="far"
                        className="w-full h-10 bg-white border-[#DCE2EB] rounded-xl text-sm font-semibold text-[#141B28] px-3.5 focus-visible:border-[#0267B8]"
                      >
                        <SelectValue placeholder="All Areas" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-md">
                        {AUDIT_AREAS.map((a) => (
                          <SelectItem
                            key={a.value}
                            value={a.value}
                            className="text-sm font-medium text-[#141B28]"
                          >
                            {a.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Admin Select */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="fad"
                      className="text-[13px] font-extrabold text-[#141B28]"
                    >
                      Admin
                    </label>
                    <Select
                      value={selectedAdmin}
                      onValueChange={(val) => setSelectedAdmin(val || 'all')}
                    >
                      <SelectTrigger
                        id="fad"
                        className="w-full h-10 bg-white border-[#DCE2EB] rounded-xl text-sm font-semibold text-[#141B28] px-3.5 focus-visible:border-[#0267B8]"
                      >
                        <SelectValue placeholder="All Admins" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#DCE2EB] rounded-xl shadow-md">
                        {AUDIT_ADMINS.map((adm) => (
                          <SelectItem
                            key={adm.value}
                            value={adm.value}
                            className="text-sm font-medium text-[#141B28]"
                          >
                            {adm.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status / Meta bar (p#res) */}
                <div className="px-4.5 py-2.5 bg-[#F8FAFC] border-b border-[#EEF1F5] flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[13px] font-bold text-[#4F5B70]">
                    {filteredLogs.length} audit events · Newest first
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F1F4F8] border border-[#DCE2EB] text-[11px] font-extrabold tracking-[0.03em] uppercase text-[#4F5B70]">
                    Sample data
                  </span>
                </div>

                {/* Audit Log Table */}
                <div className="overflow-x-auto">
                  <DataTable
                    data={filteredLogs}
                    columns={columns}
                    getRowId={(item) => item.id}
                    tableClassName="w-full min-w-[900px] border-collapse"
                    headerRowClassName="border-b border-[#EEF1F5] hover:bg-transparent bg-[#F8FAFC]"
                    rowClassName="border-b border-[#EEF1F5] hover:bg-[#F8FAFC]/80 transition-colors"
                    emptyCellClassName="py-12 text-center text-[#4F5B70]"
                    empty={
                      <div className="flex flex-col items-center justify-center gap-3">
                        <p className="text-sm font-semibold">
                          No audit events found matching your filters.
                        </p>
                        {isFiltered && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetFilters}
                            className="gap-2 text-xs font-semibold rounded-xl border-[#DCE2EB]"
                          >
                            <RotateCcw className="size-3.5" />
                            Reset filters
                          </Button>
                        )}
                      </div>
                    }
                  />
                </div>
              </section>
            </div>
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}

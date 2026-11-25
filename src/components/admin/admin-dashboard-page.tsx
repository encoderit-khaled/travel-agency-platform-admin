import * as React from 'react'
import {
  Users,
  CalendarDays,
  ShieldCheck,
  Activity,
  FileText,
  KeyRound,
  ChevronRight,
  ArrowRight,
  Clock,
  UserCog,
  UserPlus,
  Eye,
  Edit3,
  RefreshCw,
} from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminFooter } from './admin-footer'
import { BarListChart } from '#/components/ui/bar-list-chart'
import {
  DASHBOARD_KPIS,
  TOTAL_BOOKINGS,
  BOOKING_STATUSES,
  QUICK_ACCESS_ITEMS,
  RECENT_ADMIN_ACTIVITIES,
  ADMIN_USERS_BY_ROLE,
  type DashboardKpiItem,
  type BookingStatusItem,
  type QuickAccessItem,
  type AdminActivityItem,
  type AdminRoleItem,
} from './dashboard-data'
import { Card, CardTitle, CardDescription } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { SidebarProvider } from '#/components/ui/sidebar'
import { cn } from 'cn'

/* -------------------------------------------------------------------------- */
/*                               KPI Metric Card                              */
/* -------------------------------------------------------------------------- */

interface AdminKpiCardProps {
  item: DashboardKpiItem
}

function AdminKpiCard({ item }: AdminKpiCardProps) {
  const renderIcon = () => {
    switch (item.icon) {
      case 'users':
        return <Users className="size-5 shrink-0" />
      case 'bookings':
        return <CalendarDays className="size-5 shrink-0" />
      case 'admin-users':
        return <ShieldCheck className="size-5 shrink-0" />
      case 'audit':
        return <Activity className="size-5 shrink-0" />
      default:
        return <Activity className="size-5 shrink-0" />
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-[18px] border border-[#DCE2EB] bg-white p-[18px_20px_23px] shadow-2xs transition-all duration-200 hover:border-[#C5CFDC] hover:shadow-xs">
      {/* Top row: Icon & Tag */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl shadow-xs',
            item.iconBgColor,
            item.iconColor,
          )}
        >
          {renderIcon()}
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-bold text-[#4F5B70] shadow-none"
        >
          {item.tag}
        </Badge>
      </div>

      {/* Label and Value */}
      <div className="mt-3 flex flex-col">
        <p className="text-[13px] font-medium text-[#4F5B70]">{item.label}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[28px] font-extrabold tracking-tight text-[#141B28] lg:text-[32px]">
            {item.value}
          </span>
          {item.subValue && (
            <span className="text-sm font-medium text-[#4F5B70]">
              {item.subValue}
            </span>
          )}
        </div>
      </div>

      {/* Decorative background element matching Figma's EL-53a7a43c */}
      <div
        className="pointer-events-none absolute -right-9 -top-9 size-28 rounded-full opacity-40 blur-xs"
        style={{
          background: `radial-gradient(circle, ${item.accentColor}25 0%, transparent 70%)`,
        }}
      />
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                          Booking Status Overview                           */
/* -------------------------------------------------------------------------- */

interface BookingStatusOverviewProps {
  statuses?: BookingStatusItem[]
  total?: number
}

function BookingStatusOverview({
  statuses = BOOKING_STATUSES,
  total = TOTAL_BOOKINGS,
}: BookingStatusOverviewProps) {
  return (
    <Card className="flex h-full flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-2xs lg:p-[20px_22px]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[#EEF2F7] pb-3.5">
          <div>
            <CardTitle className="text-lg font-bold text-[#012A5E]">
              Booking Status Overview
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs font-medium text-[#4F5B70]">
              Bookings by lifecycle status.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-bold text-[#4F5B70] shadow-none"
          >
            Sample data
          </Badge>
        </div>

        <BarListChart
          className="mt-4"
          name="Bookings"
          max={100}
          labelWidth={110}
          data={statuses.map((item) => ({
            label: item.label,
            value: item.percentage,
            detail: item.count.toLocaleString(),
            color: item.barColor.match(/#[0-9A-Fa-f]{3,8}/)?.[0] ?? '#0267B8',
          }))}
        />
      </div>

      {/* Footer Total */}
      <div className="mt-5 flex items-center justify-between border-t border-[#EEF2F7] pt-3 text-sm">
        <span className="text-xs font-semibold tracking-wider text-[#4F5B70] uppercase">
          Total bookings
        </span>
        <span className="text-base font-extrabold text-[#141B28]">
          {total.toLocaleString()}
        </span>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Quick Access                                */
/* -------------------------------------------------------------------------- */

interface QuickAccessSectionProps {
  items?: QuickAccessItem[]
}

function QuickAccessSection({
  items = QUICK_ACCESS_ITEMS,
}: QuickAccessSectionProps) {
  const getToolIcon = (icon: QuickAccessItem['icon']) => {
    switch (icon) {
      case 'customers':
        return <Users className="size-4.5 text-[#012A5E]" />
      case 'users':
        return <ShieldCheck className="size-4.5 text-[#012A5E]" />
      case 'roles':
        return <KeyRound className="size-4.5 text-[#012A5E]" />
      case 'audit':
        return <FileText className="size-4.5 text-[#012A5E]" />
      default:
        return <FileText className="size-4.5 text-[#012A5E]" />
    }
  }

  return (
    <Card className="flex h-full flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-2xs lg:p-[20px_22px]">
      <div>
        {/* Header */}
        <div className="border-b border-[#EEF2F7] pb-3.5">
          <CardTitle className="text-lg font-bold text-[#012A5E]">
            Quick Access
          </CardTitle>
          <CardDescription className="mt-0.5 text-xs font-medium text-[#4F5B70]">
            Core administration tools.
          </CardDescription>
        </div>

        {/* Action cards list */}
        <ul className="mt-4 flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="group flex items-center justify-between rounded-xl border border-[#DCE2EB] bg-white p-3 transition-all duration-150 hover:border-[#0267B8]/40 hover:bg-[#F8FAFC] hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#EEF2F7] text-[#012A5E] transition-colors group-hover:bg-[#E0F2FE] group-hover:text-[#0267B8]">
                    {getToolIcon(item.icon)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#141B28] transition-colors group-hover:text-[#0267B8]">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#8792A4]">
                      {item.description}
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8FA5C3] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0267B8]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                            Recent Admin Activity                           */
/* -------------------------------------------------------------------------- */

interface RecentAdminActivitySectionProps {
  activities?: AdminActivityItem[]
}

function RecentAdminActivitySection({
  activities = RECENT_ADMIN_ACTIVITIES,
}: RecentAdminActivitySectionProps) {
  const getActivityIcon = (type: AdminActivityItem['type']) => {
    switch (type) {
      case 'permission':
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
            <KeyRound className="size-4" />
          </div>
        )
      case 'account-update':
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E0F2FE] text-[#0284C7]">
            <UserCog className="size-4" />
          </div>
        )
      case 'profile-view':
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#64748B]">
            <Eye className="size-4" />
          </div>
        )
      case 'account-create':
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#166534]">
            <UserPlus className="size-4" />
          </div>
        )
      case 'profile-update':
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706]">
            <Edit3 className="size-4" />
          </div>
        )
      default:
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F7] text-[#012A5E]">
            <Activity className="size-4" />
          </div>
        )
    }
  }

  return (
    <Card className="flex h-full flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-2xs lg:p-[20px_22px]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[#EEF2F7] pb-3.5">
          <div>
            <CardTitle className="text-lg font-bold text-[#012A5E]">
              Recent Admin Activity
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs font-medium text-[#4F5B70]">
              Latest administration actions.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-bold text-[#4F5B70] shadow-none"
          >
            Sample data
          </Badge>
        </div>

        {/* Activity feed */}
        <ul className="mt-3 divide-y divide-[#EEF2F7]">
          {activities.map((act) => (
            <li
              key={act.id}
              className="flex items-center justify-between py-2.5 transition-colors hover:bg-[#F8FAFC]/60"
            >
              <div className="flex items-center gap-3">
                {getActivityIcon(act.type)}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#141B28]">
                    {act.title}
                  </span>
                  <span className="inline-flex w-fit items-center rounded-md bg-[#EEF2F7] px-1.5 py-0.5 text-[11px] font-medium text-[#4F5B70]">
                    {act.user}
                  </span>
                </div>
              </div>
              <time className="shrink-0 text-xs font-medium text-[#8792A4]">
                {act.timestamp}
              </time>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Link */}
      <div className="mt-4 border-t border-[#EEF2F7] pt-3">
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0267B8] transition-colors hover:text-[#012A5E]"
        >
          <span>View Audit Log</span>
          <ArrowRight className="size-4" />
        </a>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Admin Users                                */
/* -------------------------------------------------------------------------- */

interface AdminUsersSectionProps {
  roles?: AdminRoleItem[]
  totalAccounts?: number
}

function AdminUsersSection({
  roles = ADMIN_USERS_BY_ROLE,
  totalAccounts = 12,
}: AdminUsersSectionProps) {
  return (
    <Card className="flex h-full flex-col justify-between rounded-[18px] border border-[#DCE2EB] bg-white p-5 shadow-2xs lg:p-[20px_22px]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[#EEF2F7] pb-3.5">
          <div>
            <CardTitle className="text-lg font-bold text-[#012A5E]">
              Admin Users
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs font-medium text-[#4F5B70]">
              Accounts by predefined role.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-bold text-[#4F5B70] shadow-none"
          >
            Sample data
          </Badge>
        </div>

        {/* Total Admin accounts callout */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-[32px] font-extrabold tracking-tight text-[#141B28]">
            {totalAccounts}
          </span>
          <span className="text-sm font-medium text-[#4F5B70]">
            Admin accounts
          </span>
        </div>

        {/* Roles list */}
        <ul className="mt-4 flex flex-col gap-2">
          {roles.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl border border-[#EEF2F7] bg-[#F8FAFC]/50 px-3 py-2 transition-all hover:border-[#DCE2EB] hover:bg-white"
            >
              <div className="flex items-center gap-2">
                <span className={cn('size-2 rounded-full', r.dotColor)} />
                <span className="text-xs font-bold text-[#141B28]">
                  {r.role}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#141B28]">
                {r.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Link */}
      <div className="mt-5 border-t border-[#EEF2F7] pt-3">
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0267B8] transition-colors hover:text-[#012A5E]"
        >
          <span>Manage Admin Users</span>
          <ArrowRight className="size-4" />
        </a>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Main Dashboard Page                            */
/* -------------------------------------------------------------------------- */

export interface AdminDashboardPageProps {
  onRefresh?: () => void
}

export function AdminDashboardPage({ onRefresh }: AdminDashboardPageProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastRefreshed, setLastRefreshed] = React.useState('Just now')

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      const now = new Date()
      setLastRefreshed(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      )
      onRefresh?.()
    }, 600)
  }

  return (
    <SidebarProvider
      defaultOpen
      className="h-screen w-full overflow-hidden bg-[#EEF2F7]"
    >
      <div className="flex h-screen w-full overflow-hidden bg-[#EEF2F7]">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar currentTab="Dashboard" />

        {/* Main Column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Header */}
          <AdminHeader
            userName="Sample Admin"
            userRole="Super Admin"
            userInitials="SA"
            breadcrumbs={[
              { label: 'Admin Panel', href: '/admin' },
              { label: 'Dashboard' },
            ]}
          />

          {/* Main Content: div#page (EL-acfb41d2) */}
          <main className="flex-1 p-5 md:p-6 lg:p-8">
            <div className="mx-auto flex max-w-[1520px] flex-col gap-6">
              {/* Page Header (div.ph2) */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold tracking-wider text-[#0267B8] uppercase">
                    Admin Dashboard
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight text-[#012A5E] lg:text-[28px]">
                    Overview
                  </h1>
                  <p className="text-sm font-medium text-[#4F5B70]">
                    Monitor key platform activity and access core administration
                    tools.
                  </p>
                </div>

                {/* Right Context Pill (span.ctx) */}
                <div className="flex items-center gap-2 rounded-xl border border-[#DCE2EB] bg-white px-3 py-2 shadow-2xs">
                  <Clock className="size-4 text-[#4F5B70]" />
                  <span className="text-xs font-semibold text-[#4F5B70]">
                    Current overview
                  </span>
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#DCE2EB] bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-bold text-[#4F5B70] shadow-none"
                  >
                    Sample data
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-6 px-1.5 text-xs text-[#0267B8] hover:bg-[#EEF2F7]"
                    title={`Refresh overview data (Last updated: ${lastRefreshed})`}
                  >
                    <RefreshCw
                      className={cn('size-3.5', isRefreshing && 'animate-spin')}
                    />
                  </Button>
                </div>
              </div>

              {/* Row 1: KPI Metrics Grid (section 972:2189) */}
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {DASHBOARD_KPIS.map((kpi) => (
                  <AdminKpiCard key={kpi.id} item={kpi} />
                ))}
              </section>

              {/* Rows 2 & 3: Main Grid (3 columns on lg, gap-5) */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Row 2 Left (span 2): Booking Status Overview */}
                <div className="lg:col-span-2">
                  <BookingStatusOverview />
                </div>

                {/* Row 2 Right (span 1): Quick Access */}
                <div className="lg:col-span-1">
                  <QuickAccessSection />
                </div>

                {/* Row 3 Left (span 2): Recent Admin Activity */}
                <div className="lg:col-span-2">
                  <RecentAdminActivitySection />
                </div>

                {/* Row 3 Right (span 1): Admin Users */}
                <div className="lg:col-span-1">
                  <AdminUsersSection />
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  Percent,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  Key,
  List,
  Ticket,
  Tag,
  Plug,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarContext,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '#/components/ui/sidebar'
import { cn } from 'cn'

export interface AdminSidebarProps {
  currentTab?: string
  pendingCount?: number
  className?: string
  onCloseMobile?: () => void
  collapsible?: 'offcanvas' | 'icon' | 'none'
  defaultOpen?: boolean
}

function navItemClass(active: boolean) {
  return cn(
    'relative h-auto gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors [&_svg]:size-4.5',
    active
      ? 'bg-white/12 font-semibold text-[#F1C134] shadow-[inset_3px_0_0_0_#F1C134] hover:bg-white/15 hover:text-[#F1C134] active:bg-white/15 active:text-[#F1C134]'
      : 'bg-transparent font-medium text-[#C9D7EA] hover:bg-white/6 hover:text-white active:bg-white/6 active:text-white',
  )
}

function navIconClass(active: boolean) {
  return cn(
    'size-4.5 shrink-0 transition-colors',
    active ? 'text-[#F1C134]' : 'text-[#C9D7EA]',
  )
}

function AdminSidebarInner({
  currentTab,
  pendingCount = 1,
  className,
  onCloseMobile,
  collapsible = 'icon',
}: AdminSidebarProps) {
  const [agentsExpanded, setAgentsExpanded] = React.useState(true)

  const activeSubItem = currentTab || 'Agent Applications'

  const isDashboardActive = activeSubItem === 'Dashboard'

  const overviewItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin?view=dashboard',
      active: isDashboardActive,
    },
  ]

  const coreAdminItems = [
    {
      label: 'B2C Customers',
      icon: Users,
      href: '/b2c-customers',
      active:
        activeSubItem === 'B2C Customers' || activeSubItem === 'Customers',
    },
    {
      label: 'Admin Users',
      icon: UserCheck,
      href: '/admin-users?node-id=975-3024',
      active: activeSubItem === 'Admin Users',
    },
    {
      label: 'Roles & Permissions',
      icon: Key,
      href: '/roles-access',
      active: activeSubItem === 'Roles & Permissions',
    },
    {
      label: 'Audit Log',
      icon: List,
      href: '/admin-audit-log',
      active: activeSubItem === 'Audit Log',
    },
  ]

  const agentSubItems = [
    {
      label: 'Agent Applications',
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
      active: activeSubItem === 'Agent Applications',
      href: '/admin?tab=pending',
    },
    {
      label: 'Approved Agents',
      active: activeSubItem === 'Approved Agents',
      href: '#',
    },
    {
      label: 'Sub-agents',
      active: activeSubItem === 'Sub-agents',
      href: '/sub-agents',
    },
  ]

  const moduleNavItems = [
    {
      label: 'Bookings',
      icon: Ticket,
      href: '/bookings',
      active: activeSubItem === 'Bookings',
    },
    {
      label: 'Integrations',
      icon: Plug,
      href: '#',
      active: activeSubItem === 'Integrations',
    },
    {
      label: 'Pricing & Markup',
      icon: Tag,
      href: '/pricing-markup',
      active: activeSubItem === 'Pricing & Markup',
    },
    {
      label: 'Commissions',
      icon: Percent,
      href: '/admin-reports?node-id=1005-5346',
      active: activeSubItem === 'Commissions',
    },
    {
      label: 'Notifications',
      icon: Bell,
      href: '#',
      active: activeSubItem === 'Notifications',
    },
    {
      label: 'Support',
      icon: MessageSquare,
      href: '#',
      active: activeSubItem === 'Support',
    },
    {
      label: 'Reports',
      icon: BarChart3,
      href: '/admin-reports?node-id=1005-5341&tab=bookings',
      active: activeSubItem === 'Reports',
    },
    {
      label: 'Platform Settings',
      icon: Settings,
      href: '/platform-settings?section=languages',
      active:
        activeSubItem === 'Settings' ||
        activeSubItem === 'Platform Settings' ||
        activeSubItem === 'Business Details' ||
        activeSubItem === 'Languages',
    },
  ]

  return (
    <Sidebar
      collapsible={collapsible}
      className={cn(
        'shrink-0 text-white select-none border-r border-white/10 transition-all duration-200',
        'bg-[#001A3D] bg-linear-to-b from-[#001A3D] via-[#012A5E] to-[#0F3F7D] [&_[data-slot=sidebar-inner]]:bg-transparent',
        className,
      )}
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-white/10 gap-2 group-data-[collapsible=icon]:h-17 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:overflow-hidden">
        {/* Full Brand Logo Container */}
        <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-center shadow-xs w-full group-data-[collapsible=icon]:hidden">
          <a
            href="/admin"
            className="flex items-center justify-center w-full transition-opacity hover:opacity-95"
          >
            <img
              src="/images/aerowing-logo.png"
              alt="AeroWing — Explore, Book, Travel"
              className="h-9 w-auto max-w-full object-contain"
            />
          </a>
        </div>

        {/* Collapsed Icon Logo */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
          <a
            href="/admin"
            className="size-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs transition-transform hover:scale-105"
            title="AeroWing Admin"
          >
            <img
              src="/images/aerowing-icon.png"
              alt="AeroWing Admin"
              className="size-7 object-contain"
            />
          </a>
        </div>

        <div className="px-1 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="text-[11px] font-bold text-[#8C9BAE] uppercase tracking-wider px-0 h-auto py-0">
            Admin Panel
          </SidebarGroupLabel>
        </div>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="px-3 py-3 gap-1 group-data-[collapsible=icon]:px-1.5">
        {/* Overview Group */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {overviewItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className={navItemClass(item.active)}
                      render={
                        <a href={item.href} onClick={onCloseMobile} />
                      }
                    >
                      <Icon className={navIconClass(item.active)} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 bg-white/10 group-data-[collapsible=icon]:my-1" />

        {/* Core Admin Group */}
        <SidebarGroup className="p-0">
          <div className="px-3 py-1 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-wider px-0 h-auto py-0">
              Core Admin
            </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {coreAdminItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className={navItemClass(item.active)}
                      render={
                        <a href={item.href} onClick={onCloseMobile} />
                      }
                    >
                      <Icon className={navIconClass(item.active)} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 bg-white/10 group-data-[collapsible=icon]:my-1" />

        {/* Platform Modules Group */}
        <SidebarGroup className="p-0">
          <div className="px-3 py-1 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-[10px] font-bold text-[#8C9BAE] uppercase tracking-wider px-0 h-auto py-0">
              Platform Modules
            </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {/* Agents Expandable Section */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  tooltip="Agents"
                  onClick={() => setAgentsExpanded(!agentsExpanded)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="size-4.5 shrink-0 text-[#C9D7EA]" />
                    <span>Agents</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'size-4 text-[#8C9BAE] transition-transform duration-200 group-data-[collapsible=icon]:hidden',
                      !agentsExpanded && '-rotate-90',
                    )}
                  />
                </SidebarMenuButton>

                {agentsExpanded && (
                  <ul className="ml-5 pl-2.5 border-l border-white/10 flex flex-col gap-1 mt-1 py-1 group-data-[collapsible=icon]:hidden">
                    {agentSubItems.map((sub) => (
                      <li key={sub.label}>
                        <a
                          href={sub.href}
                          onClick={onCloseMobile}
                          className={cn(
                            'relative flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors',
                            sub.active
                              ? 'bg-white/12 font-semibold text-[#F1C134] shadow-[inset_3px_0_0_0_#F1C134] hover:bg-white/15'
                              : 'bg-transparent font-medium text-[#C9D7EA] hover:bg-white/6 hover:text-white',
                          )}
                        >
                          <span className="truncate whitespace-nowrap">
                            {sub.label}
                          </span>
                          {sub.badge && (
                            <span className="size-5 min-w-5 rounded-full bg-[#F1C134] text-[#001A3D] text-[11px] font-bold flex items-center justify-center shrink-0">
                              {sub.badge}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </SidebarMenuItem>

              {moduleNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className={navItemClass(item.active)}
                      render={
                        <a href={item.href} onClick={onCloseMobile} />
                      }
                    >
                      <Icon className={navIconClass(item.active)} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-3 border-t border-white/10 flex flex-col items-center justify-center">
        <AdminSidebarFooterToggle />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function AdminSidebarFooterToggle() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="w-full flex items-center justify-between group-data-[collapsible=icon]:justify-center">
      <p className="text-[11px] text-[#8C9BAE] font-medium leading-relaxed group-data-[collapsible=icon]:hidden">
        M15 · Admin Panel Core
      </p>
      <button
        type="button"
        onClick={toggleSidebar}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="size-8 rounded-lg flex items-center justify-center text-[#8C9BAE] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        {isCollapsed ? (
          <PanelLeftOpen className="size-5" />
        ) : (
          <PanelLeftClose className="size-5" />
        )}
      </button>
    </div>
  )
}

export function AdminSidebar(props: AdminSidebarProps) {
  const existingContext = React.useContext(SidebarContext)
  if (existingContext) {
    return <AdminSidebarInner {...props} />
  }

  return (
    <SidebarProvider
      defaultOpen={props.defaultOpen ?? true}
      className="h-full min-h-0 w-auto"
    >
      <AdminSidebarInner {...props} />
    </SidebarProvider>
  )
}

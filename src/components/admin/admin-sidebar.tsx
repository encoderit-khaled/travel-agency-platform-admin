import * as React from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Briefcase,
  Wallet,
  Percent,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  Plane,
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
} from '#/components/ui/sidebar'
import { cn } from 'cn'

export interface AdminSidebarProps {
  currentTab?: string
  pendingCount?: number
  className?: string
  onCloseMobile?: () => void
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

function AdminSidebarInner({
  currentTab,
  pendingCount = 1,
  className,
  onCloseMobile,
  collapsible = 'icon',
}: AdminSidebarProps) {
  const [agentsExpanded, setAgentsExpanded] = React.useState(true)

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { label: 'Bookings', icon: CalendarDays, href: '#' },
    { label: 'Customers', icon: Users, href: '#' },
  ]

  const activeSubItem = currentTab || 'Agent Applications'

  const agentSubItems = [
    {
      label: 'Agent Applications',
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
      active: activeSubItem === 'Agent Applications',
      href: '/admin',
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

  const secondaryNavItems = [
    { label: 'Wallet & Credit', icon: Wallet, href: '#' },
    { label: 'Commissions', icon: Percent, href: '#' },
    { label: 'Reports', icon: BarChart3, href: '#' },
    { label: 'Notifications', icon: Bell, href: '#' },
    { label: 'Settings', icon: Settings, href: '#' },
  ]

  return (
    <Sidebar
      collapsible={collapsible}
      className={cn(
        'shrink-0 text-white select-none border-r border-white/10 transition-all duration-200',
        '*:data-[sidebar=sidebar]:bg-linear-to-b *:data-[sidebar=sidebar]:from-[#001A3D] *:data-[sidebar=sidebar]:via-[#012A5E] *:data-[sidebar=sidebar]:to-[#0F3F7D] *:data-[sidebar=sidebar]:text-white',
        className,
      )}
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-white/10 gap-2 group-data-[collapsible=icon]:h-17 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:overflow-hidden">
        <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-xs w-full group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
            <div
              className="size-8 rounded-lg bg-[#012A5E] border border-white/15 flex items-center justify-center text-[#F1C134] shadow-xs shrink-0 transition-transform hover:scale-105"
              title="AeroWing Admin"
            >
              <Plane className="size-4.5 -rotate-45" />
            </div>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="font-extrabold text-[#012A5E] text-base leading-none tracking-tight">
                Aero<span className="text-[#0267B8]">Wing</span>
              </span>
              <span className="text-[10px] text-[#4F5B70] font-medium leading-tight">
                Travel Agency Platform
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F1C134]/20 text-[#854D0E] px-1.5 py-0.5 rounded shrink-0 group-data-[collapsible=icon]:hidden">
            Admin
          </span>
        </div>

        <div className="px-1 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="text-[11px] font-bold text-[#8C9BAE] uppercase tracking-wider px-0 h-auto py-0">
            Admin Panel
          </SidebarGroupLabel>
        </div>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="px-3 py-3 gap-1 group-data-[collapsible=icon]:px-1.5">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      render={
                        <a
                          href={item.href}
                          onClick={onCloseMobile}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-[#C9D7EA] hover:text-white hover:bg-white/5 transition-colors"
                        />
                      }
                    >
                      <Icon className="size-4.5 shrink-0 text-[#8C9BAE]" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {/* Agents Expandable Section */}
              <SidebarMenuItem className="mt-1">
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
                            'flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                            sub.active
                              ? 'bg-[#273B4B] border-l-2 border-[#F1C134] text-white font-bold shadow-xs'
                              : 'text-[#8C9BAE] hover:text-white hover:bg-white/5 font-medium border-l-2 border-transparent',
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 bg-white/10 group-data-[collapsible=icon]:my-1" />

        {/* Secondary Navigation */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      render={
                        <a
                          href={item.href}
                          onClick={onCloseMobile}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-[#C9D7EA] hover:text-white hover:bg-white/5 transition-colors"
                        />
                      }
                    >
                      <Icon className="size-4.5 shrink-0 text-[#8C9BAE]" />
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
      <SidebarFooter className="p-4 border-t border-white/10 group-data-[collapsible=icon]:hidden">
        <p className="text-[11px] text-[#8C9BAE] font-medium leading-relaxed">
          M2.1 · Agent Registration & Approval
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export function AdminSidebar(props: AdminSidebarProps) {
  const existingContext = React.useContext(SidebarContext)
  if (existingContext) {
    return <AdminSidebarInner {...props} />
  }

  return (
    <SidebarProvider defaultOpen className="h-full min-h-0 w-auto">
      <AdminSidebarInner {...props} />
    </SidebarProvider>
  )
}

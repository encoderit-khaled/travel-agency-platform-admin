import * as React from 'react'
import {
  Outlet,
  createRootRoute,
  Link,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  Compass,
  ChevronDown,
  Check,
  CheckCircle2,
  CircleX as XCircle,
  AlertOctagon,
  Search,
  Shield,
  ShieldCheck,
  Layers,
  FileCheck2,
  LayoutDashboard,
  UserCheck,
  Network,
  Bell,
  Ticket,
  Percent,
  BarChart2,
  Wallet,
  PlusCircle,
  FileText,
  FileSpreadsheet,
  Coins,
  CreditCard,
} from 'lucide-react'
import '../globals.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [navOpen, setNavOpen] = React.useState(false)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const search = routerState.location.search as {
    step?: number
    view?: string
  }
  const currentStep = search.step

  const routesList = [
    {
      title: 'Roles & Access: Permission Matrix (M2.13)',
      path: '/roles-access?node-id=835-2591&tab=matrix',
      tag: 'Figma #835:2591',
      icon: ShieldCheck,
      active:
        pathname === '/roles-access' &&
        ((search as any)['node-id'] === '835-2591' ||
          (search as any).nodeId === '835:2591' ||
          (search as any).tab === 'matrix'),
    },
    {
      title: 'Roles & Access: Overview (M2.13)',
      path: '/roles-access?node-id=835-2262&tab=overview',
      tag: 'Figma #835:2262',
      icon: Shield,
      active:
        pathname === '/roles-access' &&
        ((search as any)['node-id'] === '835-2262' ||
          (search as any).nodeId === '835:2262' ||
          (search as any).tab === 'overview' ||
          (!(search as any)['node-id'] && !(search as any).tab)),
    },
    {
      title: 'Roles & Access: Team Access (M2.13)',
      path: '/roles-access?node-id=835-2588&tab=team',
      tag: 'Figma #835:2588',
      icon: Network,
      active:
        pathname === '/roles-access' &&
        ((search as any)['node-id'] === '835-2588' ||
          (search as any).nodeId === '835:2588' ||
          (search as any).tab === 'team'),
    },
    {
      title: 'Roles & Access: Owner Access Summary (Drawer)',
      path: '/roles-access?node-id=835-2589&modal=owner',
      tag: 'Figma #835:2589',
      icon: UserCheck,
      active:
        pathname === '/roles-access' &&
        ((search as any)['node-id'] === '835-2589' ||
          (search as any).nodeId === '835:2589' ||
          (search as any).modal === 'owner'),
    },
    {
      title: 'Agent Reports: Sales (M2.12)',
      path: '/reports?node-id=821-1920',
      tag: 'Figma #821:1920',
      icon: BarChart2,
      active:
        pathname === '/reports' &&
        ((search as any)['node-id'] === '821-1920' ||
          (search as any).nodeId === '821:1920' ||
          (search as any).tab === 'sales' ||
          !(search as any)['node-id']),
    },
    {
      title: 'Agent Reports: Overview (M2.12)',
      path: '/reports?node-id=821-920&tab=overview',
      tag: 'Figma #821:920',
      icon: BarChart2,
      active:
        pathname === '/reports' &&
        ((search as any)['node-id'] === '821-920' ||
          (search as any).nodeId === '821:920' ||
          (search as any).tab === 'overview'),
    },
    {
      title: 'Credit Request Details (Drawer)',
      path: '/credit?node-id=743-4134&modal=details',
      tag: 'Figma #743:4134',
      icon: CreditCard,
      active:
        pathname === '/credit' &&
        ((search as any)['node-id'] === '743-4134' ||
          (search as any).nodeId === '743:4134' ||
          (search as any).modal === 'details'),
    },
    {
      title: 'Credit Requests: Submit Request Success',
      path: '/credit?node-id=743-4132&modal=submit',
      tag: 'Figma #743:4132',
      icon: PlusCircle,
      active:
        pathname === '/credit' &&
        ((search as any)['node-id'] === '743-4132' ||
          (search as any).nodeId === '743:4132' ||
          (search as any).modal === 'submit'),
    },
    {
      title: 'Credit Requests: New Request Form',
      path: '/credit?tab=new&node-id=743-4050',
      tag: 'Figma #743:4050',
      icon: PlusCircle,
      active:
        pathname === '/credit' &&
        ((search as any)['node-id'] === '743-4050' ||
          (search as any).nodeId === '743:4050' ||
          ((search as any).tab === 'new' &&
            (search as any).modal !== 'submit')),
    },
    {
      title: 'Credit Requests (M2.8 History & Form)',
      path: '/credit',
      tag: 'Figma #743:3110',
      icon: FileText,
      active:
        pathname === '/credit' &&
        !(search as any)['node-id'] &&
        !(search as any).nodeId &&
        !(search as any).modal,
    },
    {
      title: 'Commission Tracking: Commission Details',
      path: '/commissions?modal=details&node-id=745-6678',
      tag: 'Figma #745:6678',
      icon: Coins,
      active:
        pathname === '/commissions' &&
        ((search as any).modal === 'details' ||
          (search as any)['node-id'] === '745-6678' ||
          (search as any).nodeId === '745:6678' ||
          Boolean((search as any).details)),
    },
    {
      title: 'Commission Tracking (Overview)',
      path: '/commissions?node-id=745-5562',
      tag: 'Figma #745:5562',
      icon: Coins,
      active:
        pathname === '/commissions' &&
        (search as any)['node-id'] !== '745-6678' &&
        (search as any).nodeId !== '745:6678' &&
        !(search as any).modal &&
        !(search as any).details,
    },
    {
      title: 'Agent Statements (M2.10)',
      path: '/statements?node-id=749-7809',
      tag: 'Figma #749:7809',
      icon: FileText,
      active:
        pathname === '/statements' &&
        ((search as any)['node-id'] === '749-7809' ||
          (search as any).nodeId === '749:7809' ||
          !(search as any)['node-id']),
    },
    {
      title: 'Agent Statements: Download CSV',
      path: '/statements?export=csv&node-id=749-10386',
      tag: 'Figma #749:10386',
      icon: FileSpreadsheet,
      active:
        pathname === '/statements' &&
        ((search as any)['node-id'] === '749-10386' ||
          (search as any).nodeId === '749:10386' ||
          (search as any).export === 'csv'),
    },
    {
      title: 'Agent Statements: Download PDF',
      path: '/statements?export=pdf&node-id=749-10388',
      tag: 'Figma #749:10388',
      icon: FileText,
      active:
        pathname === '/statements' &&
        ((search as any)['node-id'] === '749-10388' ||
          (search as any).nodeId === '749:10388' ||
          (search as any).export === 'pdf'),
    },
    {
      title: 'Wallet Ledger: Export Current View',
      path: '/wallet-ledger?node-id=728-29735',
      tag: 'Figma #728:29735',
      icon: Layers,
      active:
        (pathname === '/wallet' || pathname === '/wallet-ledger') &&
        ((search as any)['node-id'] === '728-29735' ||
          (search as any).nodeId === '728:29735' ||
          (search as any).export === true ||
          (search as any).export === 'true' ||
          (search as any).modal === 'export'),
    },
    {
      title: 'Wallet Ledger: Transaction Details',
      path: '/wallet-ledger?node-id=728-29736',
      tag: 'Figma #728:29736',
      icon: Wallet,
      active:
        (pathname === '/wallet' || pathname === '/wallet-ledger') &&
        ((search as any)['node-id'] === '728-29736' ||
          (search as any).nodeId === '728:29736' ||
          (search as any).modal === 'details'),
    },
    {
      title: 'Wallet Ledger (M2.6)',
      path: '/wallet-ledger?node-id=728-28566',
      tag: 'Figma #728:28566',
      icon: Wallet,
      active:
        pathname === '/wallet-ledger' &&
        (search as any)['node-id'] === '728-28566',
    },
    {
      title: 'Agent Pricing & Markup: Remove Markup Rule',
      path: '/pricing-markup?modal=remove&node-id=710-22500',
      tag: 'Figma #710:22500',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        ((search as any).modal === 'remove' ||
          (search as any)['node-id'] === '710-22500' ||
          (search as any).nodeId === '710:22500' ||
          (search as any)['node-id'] === '710-22493' ||
          (search as any).nodeId === '710:22493'),
    },
    {
      title: 'Agent Pricing & Markup: Disable Markup Rule',
      path: '/pricing-markup?modal=disable&node-id=710-22499',
      tag: 'Figma #710:22499',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        ((search as any).modal === 'disable' ||
          (search as any)['node-id'] === '710-22499' ||
          (search as any).nodeId === '710:22499' ||
          (search as any)['node-id'] === '710-22494' ||
          (search as any).nodeId === '710:22494'),
    },
    {
      title: 'Agent Pricing & Markup: Markup Rule Details',
      path: '/pricing-markup?modal=details&node-id=710-22498',
      tag: 'Figma #710:22498',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        ((search as any).modal === 'details' ||
          (search as any).drawer === 'details' ||
          (search as any)['node-id'] === '710-22498' ||
          (search as any).nodeId === '710:22498' ||
          (search as any)['node-id'] === '710-22495' ||
          (search as any).nodeId === '710:22495'),
    },
    {
      title: 'Agent Pricing & Markup: Pricing Preview',
      path: '/pricing-markup?modal=preview&node-id=710-22497',
      tag: 'Figma #710:22497',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        ((search as any).modal === 'preview' ||
          (search as any).preview === 'true' ||
          (search as any).preview === true ||
          (search as any)['node-id'] === '710-22497' ||
          (search as any).nodeId === '710:22497' ||
          (search as any)['node-id'] === '710-22496' ||
          (search as any).nodeId === '710:22496'),
    },
    {
      title: 'Agent Pricing & Markup Overview',
      path: '/pricing-markup',
      tag: 'Figma #710:21270',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        !(search as any).preview &&
        !(search as any).modal &&
        !(search as any).drawer &&
        !(search as any)['node-id'] &&
        !(search as any).nodeId,
    },
    {
      title: 'Agent Wallet Overview',
      path: '/wallet?node-id=723-25715',
      tag: 'Figma #723:25715',
      icon: Wallet,
      active:
        pathname === '/wallet' &&
        (search as any)['node-id'] !== '725-27232' &&
        (search as any).nodeId !== '725:27232' &&
        !(search as any).topUp &&
        (search as any).modal !== 'topup' &&
        (search as any).view !== 'ledger' &&
        (search as any)['node-id'] !== '728-28566' &&
        (search as any).nodeId !== '728:28566',
    },
    {
      title: 'Agent: Top Up Wallet',
      path: '/wallet?modal=topup&node-id=725-27232',
      tag: 'Figma #725:27232',
      icon: PlusCircle,
      active:
        pathname === '/wallet' &&
        ((search as any)['node-id'] === '725-27232' ||
          (search as any).nodeId === '725:27232' ||
          (search as any).topUp === true ||
          (search as any).topUp === 'true' ||
          (search as any).modal === 'topup'),
    },
    {
      title: 'Agent: Wallet Ledger',
      path: '/wallet?view=ledger&node-id=728-28566',
      tag: 'Figma #728:28566',
      icon: Layers,
      active:
        pathname === '/wallet' &&
        ((search as any).view === 'ledger' ||
          (search as any)['node-id'] === '728-28566' ||
          (search as any).nodeId === '728:28566' ||
          (search as any)['node-id'] === '728-28567' ||
          (search as any).nodeId === '728:28567'),
    },
    {
      title: 'Agent Booking History (M2.11)',
      path: '/bookings?node-id=703-16111',
      tag: 'Figma #703:16111',
      icon: Ticket,
      active:
        pathname === '/bookings' &&
        !(search as any).booking &&
        (search as any)['node-id'] !== '706-17471',
    },
    {
      title: 'Agent Booking History: Booking Preview',
      path: '/bookings?booking=AW-DEMO-FL-001&node-id=706-17471',
      tag: 'Figma #706:17471',
      icon: Ticket,
      active:
        pathname === '/bookings' &&
        Boolean(
          (search as any).booking ||
          (search as any)['node-id'] === '706-17471' ||
          (search as any).nodeId === '706:17471',
        ),
    },
    {
      title: 'Agent Pricing & Markup Overview',
      path: '/pricing-markup?node-id=710-21270',
      tag: 'Figma #710:21270',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        !(search as any).modal &&
        ((search as any)['node-id'] === '710-21270' ||
          (search as any).nodeId === '710:21270' ||
          (!(search as any)['node-id'] && !(search as any).modal)),
    },
    {
      title: 'Pricing & Markup: Markup Rule Details',
      path: '/pricing-markup?modal=details&node-id=710-22495',
      tag: 'Figma #710:22495',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        ((search as any).modal === 'details' ||
          (search as any)['node-id'] === '710-22495' ||
          (search as any).nodeId === '710:22495'),
    },
    {
      title: 'Pricing & Markup: Pricing Preview',
      path: '/pricing-markup?modal=preview&node-id=710-22497',
      tag: 'Figma #710:22497',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        ((search as any).modal === 'preview' ||
          (search as any)['node-id'] === '710-22497' ||
          (search as any).nodeId === '710:22497'),
    },
    {
      title: 'Pricing & Markup: Add Markup Rule',
      path: '/pricing-markup?modal=add&node-id=713-23496',
      tag: 'Figma #713:23496',
      icon: Percent,
      active:
        pathname === '/pricing-markup' &&
        ((search as any).modal === 'add' ||
          (search as any)['node-id'] === '713-23496' ||
          (search as any).nodeId === '713:23496'),
    },
    {
      title: 'Agent Booking Details: E-ticket Preview',
      path: '/agent-booking-details?node-id=707-19883',
      tag: 'Figma #707:19883',
      icon: Ticket,
      active:
        pathname === '/agent-booking-details' ||
        (search as any)['node-id'] === '707-19883' ||
        (search as any).nodeId === '707:19883',
    },
    {
      title: 'Sub-agent Performance: Booking Details',
      path: '/sub-agents/performance?booking=AW-DEMO-FL-001&node-id=698-12713',
      tag: 'Figma #698:12713',
      icon: BarChart2,
      active:
        (pathname === '/sub-agents/performance' &&
          Boolean((search as any).booking)) ||
        (pathname === '/sub-agents/details' &&
          ((search as any)['node-id'] === '698-12713' ||
            (search as any).nodeId === '698:12713')),
    },
    {
      title: 'Sub-agent Performance',
      path: '/sub-agents/performance',
      tag: 'Figma #698:11315',
      icon: BarChart2,
      active:
        pathname === '/sub-agents/performance' &&
        !(search as any).booking &&
        (search as any)['node-id'] !== '698-12713',
    },
    {
      title: 'Sub-agent Markup',
      path: '/sub-agents/markup',
      tag: 'Figma #691:4490',
      icon: Percent,
      active: pathname === '/sub-agents/markup',
    },
    {
      title: 'Sub-agent Permissions: Discard Changes Dialog',
      path: '/sub-agents/permissions?modal=discard',
      tag: 'Figma #689:3505',
      icon: ShieldCheck,
      active:
        pathname === '/sub-agents/permissions' &&
        (search as any).modal === 'discard',
    },
    {
      title: 'Sub-agent Permissions: Custom & Unsaved',
      path: '/sub-agents/permissions?preset=custom',
      tag: 'Figma #689:3507',
      icon: ShieldCheck,
      active:
        pathname === '/sub-agents/permissions' &&
        (search as any).preset === 'custom' &&
        !(search as any).modal,
    },
    {
      title: 'Sub-agent Permissions: Save Changes Dialog',
      path: '/sub-agents/permissions?modal=save',
      tag: 'Figma #689:3508',
      icon: ShieldCheck,
      active:
        pathname === '/sub-agents/permissions' &&
        (search as any).modal === 'save',
    },
    {
      title: 'Sub-agent Permissions (Standard)',
      path: '/sub-agents/permissions',
      tag: 'Figma #689:3099',
      icon: ShieldCheck,
      active:
        pathname === '/sub-agents/permissions' &&
        !(search as any).modal &&
        !(search as any).preset,
    },
    {
      title: 'Agent Booking Details (Full Page)',
      path: '/sub-agents/booking-details?booking=AW-DEMO-FL-001&node-id=707-18493',
      tag: 'Figma #707:18493',
      icon: Ticket,
      active:
        pathname === '/sub-agents/booking-details' ||
        pathname === '/agent-booking-details' ||
        (search as any)['node-id'] === '707-18493' ||
        (search as any).nodeId === '707:18493',
    },
    {
      title: 'Sub-agent Bookings: Booking Details',
      path: '/sub-agents/bookings?booking=AW-DEMO-FL-001',
      tag: 'Figma #694:7691',
      icon: Ticket,
      active:
        pathname === '/sub-agents/bookings' &&
        (search as any)['node-id'] !== '707-18493' &&
        (search as any).nodeId !== '707:18493' &&
        Boolean(
          (search as any).booking === 'AW-DEMO-FL-001' ||
          (search as any)['node-id'] === '694-7691' ||
          (search as any).nodeId === '694:7691',
        ),
    },
    {
      title: 'Sub-agent Bookings (Overview)',
      path: '/sub-agents/bookings',
      tag: 'Figma #694:6650',
      icon: Ticket,
      active:
        pathname === '/sub-agents/bookings' &&
        !(search as any).booking &&
        !(search as any)['node-id'],
    },
    {
      title: 'Sub-agent Details: Booking Details',
      path: '/sub-agents/details?booking=AW-DEMO-FL-001',
      tag: 'Figma #696:9753',
      icon: Ticket,
      active:
        pathname === '/sub-agents/details' &&
        (search as any).tab !== 'bookings',
    },
    {
      title: 'Agent: Add Sub-agent',
      path: '/sub-agents/create',
      tag: 'Figma #667:8506',
      icon: UserCheck,
      active: pathname === '/sub-agents/create',
    },
    {
      title: 'Agent: Sub-agents Overview',
      path: '/sub-agents',
      tag: 'Figma #665:6745',
      icon: Network,
      active: pathname === '/sub-agents' && !(search as any).dropdown,
    },
    {
      title: 'Agent: Sub-agents Actions Dropdown',
      path: '/sub-agents?dropdown=true',
      tag: 'Figma #665:7388',
      icon: ChevronDown,
      active:
        pathname === '/sub-agents' &&
        ((search as any).dropdown === true ||
          (search as any).dropdown === 'true'),
    },
    {
      title: 'Agent Dashboard (M2)',
      path: '/',
      tag: 'Figma #660:5189',
      icon: LayoutDashboard,
      active:
        (pathname === '/' ||
          pathname === '/agent-dashboard' ||
          pathname === '/agent') &&
        !(search as any).menu,
    },
    {
      title: 'Agent Dashboard: Dropdown Menu',
      path: '/agent-dashboard?menu=dropdown',
      tag: 'Figma #660:5853',
      icon: ChevronDown,
      active:
        (pathname === '/agent-dashboard' || pathname === '/agent') &&
        (search as any).menu === 'dropdown',
    },
    {
      title: 'Agent Dashboard: Notifications',
      path: '/agent-dashboard?menu=notifications',
      tag: 'Figma #660:5854',
      icon: Bell,
      active:
        (pathname === '/agent-dashboard' || pathname === '/agent') &&
        (search as any).menu === 'notifications',
    },
    {
      title: 'Step 3: Review & Submit',
      path: '/review-submit',
      tag: 'Figma #639:5270',
      icon: FileCheck2,
      active:
        pathname === '/review-submit' ||
        (pathname === '/register' && currentStep === 3),
    },
    {
      title: 'Step 1: Business Info',
      path: '/register?step=1',
      tag: 'Step 01',
      icon: Layers,
      active: pathname === '/register' && currentStep === 1,
    },
    {
      title: 'Step 2: Contact & Documents',
      path: '/register?step=2',
      tag: 'Step 02',
      icon: Layers,
      active: pathname === '/register' && currentStep === 2,
    },
    {
      title: 'Admin: All Applications',
      path: '/admin?tab=all',
      tag: 'Figma #645:555',
      icon: Shield,
      active:
        pathname === '/admin' &&
        ((search as any).tab === 'all' || !(search as any).tab),
    },
    {
      title: 'Admin: Pending Review',
      path: '/admin?tab=pending',
      tag: 'Figma #645:301',
      icon: Shield,
      active: pathname === '/admin' && (search as any).tab === 'pending',
    },
    {
      title: 'Admin: Application Review',
      path: '/admin?view=review',
      tag: 'Figma #648:909',
      icon: ShieldCheck,
      active:
        pathname === '/admin' &&
        Boolean((search as any).appId || (search as any).view === 'review') &&
        !(search as any).action,
    },
    {
      title: 'Admin: Reject Application',
      path: '/admin?view=review&action=reject',
      tag: 'Figma #648:1248',
      icon: XCircle,
      active: pathname === '/admin' && (search as any).action === 'reject',
    },
    {
      title: 'Admin: Approve Application',
      path: '/admin?view=review&action=approve',
      tag: 'Figma #648:1247',
      icon: CheckCircle2,
      active: pathname === '/admin' && (search as any).action === 'approve',
    },
    {
      title: 'Admin: Suspend Agent',
      path: '/admin?view=review&action=suspend',
      tag: 'Figma #648:1251',
      icon: AlertOctagon,
      active: pathname === '/admin' && (search as any).action === 'suspend',
    },
    {
      title: 'Admin: No Data Match',
      path: '/admin?empty=true',
      tag: 'Figma #648:1253',
      icon: Search,
      active: pathname === '/admin' && Boolean((search as any).empty),
    },
  ]

  return (
    <>
      <Outlet />

      {/* Floating Route Quick-Navigator Pill */}
      <div className="fixed bottom-4 left-4 z-50 print:hidden select-none">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNavOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-[#012A5E]/20 bg-[#012A5E] px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-[#023B82] active:scale-95"
            aria-label="Toggle All Pages Navigator"
          >
            <Compass className="size-4 text-[#F1C134]" />
            <span>Routes & Pages</span>
            <ChevronDown
              className={`size-3.5 text-white/70 transition-transform duration-200 ${
                navOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {navOpen && (
            <div className="absolute bottom-12 left-0 w-72 rounded-2xl border border-[#DCE2EB] bg-white p-2.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
              <div className="px-2.5 py-1.5 border-b border-[#F1F5F9] mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4F5B70]">
                  Project Pages & Routes
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {routesList.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.title}
                      to={item.path}
                      onClick={() => setNavOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition-colors ${
                        item.active
                          ? 'bg-[#EBF3FC] text-[#0267B8]'
                          : 'text-[#141C2E] hover:bg-[#F4F6FA]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold text-[#4F5B70]">
                          {item.tag}
                        </span>
                        {item.active && <Check className="size-3.5 stroke-3" />}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}

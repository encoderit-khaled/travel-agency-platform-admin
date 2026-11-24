import * as React from 'react'
import { Search, Bell, Shield } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { Button } from '../ui/button'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  active?: boolean
}

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
  breadcrumbs?: BreadcrumbItem[]
}

export function AdminHeader({
  onToggleMobileMenu,
  searchQuery = '',
  onSearchChange,
  breadcrumbs,
}: AdminHeaderProps) {
  return (
    <header className="h-17 shrink-0 bg-white border-b border-[#DCE2EB] px-4 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Left: Sidebar Trigger + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger
          onClick={onToggleMobileMenu}
          className="text-[#012A5E] hover:bg-[#F4F6FA] border border-[#DCE2EB] rounded-lg size-8.5 shrink-0 cursor-pointer shadow-2xs"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        />

        {/* Breadcrumb nav */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {breadcrumbs && breadcrumbs.length > 0 ? (
            breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  {index > 0 && (
                    <span className="text-[#94A3B8] font-normal select-none">
                      /
                    </span>
                  )}
                  {isLast || item.active ? (
                    <span
                      className="text-[#141C2E] font-bold truncate max-w-35 sm:max-w-65"
                      title={item.label}
                    >
                      {item.label}
                    </span>
                  ) : item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="text-[#0267B8] hover:text-[#012A5E] font-medium transition-colors hover:underline cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href || '#'}
                      className="text-[#4F5B70] hover:text-[#012A5E] font-medium transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </React.Fragment>
              )
            })
          ) : (
            <>
              <a
                href="#"
                className="text-[#4F5B70] hover:text-[#012A5E] font-medium transition-colors"
              >
                Dashboard
              </a>
              <span className="text-[#94A3B8] font-normal">/</span>
              <a
                href="#"
                className="text-[#4F5B70] hover:text-[#012A5E] font-medium transition-colors"
              >
                Agents
              </a>
              <span className="text-[#94A3B8] font-normal">/</span>
              <span className="text-[#141C2E] font-bold">
                Agent Applications
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search */}
        <div className="relative w-44 sm:w-64 md:w-80 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#7B7B7B] pointer-events-none" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search Admin Panel"
            className="h-10 pl-9 pr-3 rounded-lg bg-[#F4F6FA] border-[#DCE2EB] text-sm placeholder:text-[#7B7B7B] focus-visible:bg-white focus-visible:border-[#0267B8] focus-visible:ring-1 focus-visible:ring-[#0267B8]/30"
          />
        </div>

        {/* Notifications Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[#4F5B70] hover:text-[#012A5E] hover:bg-[#F4F6FA] rounded-lg size-10"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-[#F1C134] rounded-full ring-2 ring-white" />
        </Button>

        <div className="h-6 w-px bg-[#DCE2EB] hidden sm:block" />

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-1">
          <div className="size-9 rounded-full bg-[#012A5E] text-[#F1C134] font-extrabold text-xs flex items-center justify-center ring-2 ring-[#012A5E]/15 select-none shrink-0 shadow-2xs">
            AD
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="text-sm font-bold text-[#141C2E] leading-tight">
              Admin user
            </span>
            <span className="text-xs text-[#4F5B70] leading-tight flex items-center gap-1 font-medium">
              <Shield className="size-3 text-[#0267B8]" />
              Reviewer · can decide
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

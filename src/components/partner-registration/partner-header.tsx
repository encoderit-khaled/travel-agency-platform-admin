import { Link } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'

export interface PartnerHeaderProps {
  signInUrl?: string
  logoSrc?: string
}

export function PartnerHeader({
  signInUrl = '/login',
  logoSrc = '/images/aerowing-logo.png',
}: PartnerHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-[#E6EAF0]">
      <div className="mx-auto flex h-18 max-w-300 items-center justify-between px-6">
        {/* Left: Brand Logo & Program Badge */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center transition-opacity hover:opacity-95"
          >
            <img
              src={logoSrc}
              alt="AeroWing — Explore, Book, Travel"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent && !parent.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('div')
                  fallback.className =
                    'logo-fallback flex items-center gap-1.5 font-extrabold text-2xl text-[#012A5E]'
                  fallback.innerHTML =
                    '<span class="text-[#0267B8] font-black">✈</span><span>Aero<span class="text-[#0267B8]">wing</span></span>'
                  parent.appendChild(fallback)
                }
              }}
            />
          </Link>

          <div className="h-6 w-px bg-[#DCE2EB] hidden sm:block" />

          <div className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#012A5E]">
            <Building2 className="size-4 text-[#0267B8]" />
            <span>Travel Partner Program</span>
          </div>
        </div>

        {/* Right: Sign in link */}
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-[#4F5B70]">Already a registered agent?</span>
          <Link
            to={signInUrl}
            className="font-bold text-[#0267B8] hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  )
}

import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'

export interface PartnerHeroProps {
  portalUrl?: string
}

export function PartnerHero({ portalUrl = '/login' }: PartnerHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#011B3D] via-[#012552] to-[#012A5E] pt-9 pb-28 text-white">
      {/* Decorative Golden Wave / Glow Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 80% 25%, rgba(245, 166, 35, 0.45), transparent 70%), radial-gradient(ellipse 45% 45% at 20% 90%, rgba(2, 103, 184, 0.35), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-300 px-6">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#F5A623] uppercase">
          <Sparkles className="size-3.5 text-[#F5A623]" />
          <span>AEROWING TRAVEL PARTNER PORTAL</span>
        </div>

        {/* Title & Lead */}
        <h1
          id="pg-t"
          className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
        >
          Agent Registration
        </h1>
        <p className="mt-2 text-sm text-[#CBD5E1] sm:text-base">
          Join our global network of travel professionals and start booking
          today.
        </p>

        {/* Sign in quick link */}
        <p className="mt-3 text-xs text-[#94A3B8]">
          Already an agent?{' '}
          <Link
            to={portalUrl}
            className="inline-flex items-center gap-1 font-semibold text-[#F5A623] hover:underline"
          >
            <span>Sign in to your portal</span>
            <ArrowRight className="size-3" />
          </Link>
        </p>
      </div>
    </section>
  )
}

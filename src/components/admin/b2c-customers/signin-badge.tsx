import { Mail, Smartphone } from 'lucide-react'
import { GoogleIcon } from './google-icon'
import type { SignInMethod } from './types'
import { cn } from 'cn'

interface SignInBadgeProps {
  method: SignInMethod
  className?: string
}

export function SignInBadge({ method, className }: SignInBadgeProps) {
  if (method === 'google') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-[#141B28] border border-[#DCE2EB] shadow-2xs transition-colors',
          className,
        )}
      >
        <GoogleIcon className="size-3.5 shrink-0" />
        <span>Google</span>
      </span>
    )
  }

  if (method === 'mobile') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4FD] text-[#012A5E] border border-[#C6DCF2] shadow-2xs transition-colors',
          className,
        )}
      >
        <Smartphone className="size-3 text-[#012A5E] shrink-0" />
        <span>Mobile</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4FD] text-[#012A5E] border border-[#C6DCF2] shadow-2xs transition-colors',
        className,
      )}
    >
      <Mail className="size-3 text-[#012A5E] shrink-0" />
      <span>Email</span>
    </span>
  )
}

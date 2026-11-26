import { Mail, Smartphone } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
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
      <Badge
        variant="outline"
        className={cn(
          'h-auto gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-[#141B28] border-[#DCE2EB] shadow-2xs',
          className,
        )}
      >
        <GoogleIcon className="size-3.5 shrink-0" />
        <span>Google</span>
      </Badge>
    )
  }

  if (method === 'mobile') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'h-auto gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4FD] text-[#012A5E] border-[#C6DCF2] shadow-2xs',
          className,
        )}
      >
        <Smartphone className="size-3 text-[#012A5E] shrink-0" />
        <span>Mobile</span>
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-auto gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4FD] text-[#012A5E] border-[#C6DCF2] shadow-2xs',
        className,
      )}
    >
      <Mail className="size-3 text-[#012A5E] shrink-0" />
      <span>Email</span>
    </Badge>
  )
}

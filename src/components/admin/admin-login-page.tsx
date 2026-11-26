import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Lock,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Card, CardContent } from '#/components/ui/card'

export interface AdminLoginPageProps {
  initialView?: 'login' | 'trouble'
  initialEmail?: string
}

export function TroubleSigningInPage(
  props: Omit<AdminLoginPageProps, 'initialView'>,
) {
  return <AdminLoginPage {...props} initialView="trouble" />
}

export function AdminLoginPage({
  initialView = 'login',
  initialEmail = '',
}: AdminLoginPageProps) {
  const navigate = useNavigate()
  const [view, setView] = React.useState<'login' | 'trouble'>(initialView)
  const [email, setEmail] = React.useState(initialEmail || '')
  const [error, setError] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  // Handle URL parameter changes
  React.useEffect(() => {
    if (initialView) {
      setView(initialView)
    }
  }, [initialView])

  const switchToView = (targetView: 'login' | 'trouble') => {
    setView(targetView)
    try {
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          view: targetView === 'trouble' ? 'trouble' : undefined,
          'node-id': targetView === 'trouble' ? '965-1500' : '965-1410',
          nodeId: targetView === 'trouble' ? '965:1500' : '965:1410',
        }),
      })
    } catch {
      // Fallback if not inside router context
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your admin email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setSubmitting(true)

    // Simulate authentication / sign-in transition
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setTimeout(() => {
        navigate({ to: '/admin' })
      }, 700)
    }, 600)
  }

  const fillSampleEmail = () => {
    setEmail('admin@example.com')
    setError('')
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F6FA] font-sans antialiased selection:bg-[#012A5E] selection:text-white">
      {/* ========================================================= */}
      {/* LEFT ASIDE PANEL (Figma #965:1412)                        */}
      {/* ========================================================= */}
      <aside
        className="relative lg:w-[48%] xl:w-220.75 shrink-0 min-h-115 lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-[48px_56px_36px] overflow-hidden text-white"
        style={{
          background:
            'linear-gradient(154deg, rgba(0, 26, 61, 1) 0%, rgba(1, 42, 94, 1) 59%, rgba(11, 58, 117, 1) 100%)',
        }}
      >
        {/* Background Visual Asset / Flight Patterns (#965:1507) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/images/admin-login-aside-965-1507.png"
            alt="Flight Network"
            className="w-full h-full object-cover object-top-left"
          />
        </div>

        {/* Top Header: AeroWing Logo Brand Badge (#965:1433) */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white rounded-xl py-2 px-3.5 inline-flex items-center shadow-xs">
            <img
              src="/images/aerowing-logo.png"
              alt="AeroWing Explore, Book, Travel"
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Copy: Title, Badge and Subtitle (#965:1437) */}
        <div className="relative z-10 mt-auto pt-16 lg:pt-0 space-y-3.5 max-w-xl">
          {/* Admin Panel Pill Badge (#965:1439) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1C134]/14 border border-[#F1C134]/35 text-[#F1C134] text-[12.5px] font-extrabold uppercase tracking-[0.06em] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F1C134]" />
            <span>Admin Panel</span>
          </div>

          {/* Heading (#965:1444) */}
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-[-0.015em] text-white leading-tight lg:leading-12">
            Aero Wing Admin
          </h1>

          {/* Subtitle (#965:1446) */}
          <p className="text-sm sm:text-base text-[#CCD7E6] font-medium leading-relaxed max-w-md">
            The operational workspace for authorised Aero Wing staff.
          </p>

          {/* Aside Footer Copyright (#965:1448) */}
          <div className="pt-8 text-[13px] font-medium text-[#8FA5C3]">
            © 2026 AeroWing. All rights reserved.
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* RIGHT MAIN SIGN IN / TROUBLE SECTION (Figma #965:1451)    */}
      {/* ========================================================= */}
      <main
        className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 min-h-155 lg:min-h-screen relative"
        style={{
          background:
            'radial-gradient(circle at 100% 0%, rgba(230, 238, 248, 1) 0%, rgba(230, 238, 248, 0) 60%), #F4F6FA',
        }}
      >
        <div className="w-full max-w-111.5 space-y-4">
          {/* Top Lock Badge above the Card (#965:1454) */}
          <div className="flex items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#012A5E] text-white text-[12.5px] font-extrabold tracking-[0.02em] shadow-xs">
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Admin Panel</span>
            </div>
          </div>

          {/* The White Card Container (#965:1459) */}
          <Card className="relative bg-white border border-[#DCE2EB] rounded-[22px] p-7 sm:p-[34px_34px_26px] shadow-[0px_2px_6px_0px_rgba(1,42,94,0.05),0px_24px_50px_-30px_rgba(0,26,61,0.38)] overflow-hidden gap-0 ring-0">
            {/* Top Tri-Color Accent Line (Figma #965:1460) */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  'linear-gradient(90deg, rgba(1, 42, 94, 1) 0%, rgba(10, 118, 204, 1) 50%, rgba(241, 193, 52, 1) 100%)',
              }}
            />

            <CardContent className="p-0">
              {/* ---------------------------------------------------- */}
              {/* STATE A: SIGN IN FORM (#965:1461)                    */}
              {/* ---------------------------------------------------- */}
              {view === 'login' ? (
                <div className="space-y-5">
                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#012A5E] tracking-[-0.01em] leading-8">
                      Sign in to Admin Panel
                    </h2>
                    <p className="text-[14.5px] font-medium text-[#4F5B70] leading-snug">
                      Use your authorised Admin account to continue.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4.5 pt-1">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="admin-email"
                        className="text-sm font-bold text-[#141B28]"
                      >
                        Admin Email
                      </Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError('')
                        }}
                        placeholder="admin@example.com"
                        autoComplete="email"
                        className={`h-12 rounded-[14px] bg-white border px-4 text-base text-[#141B28] placeholder:text-[#8792A4] transition-all ${
                          error
                            ? 'border-red-400 focus-visible:ring-red-400'
                            : 'border-[#C5CFDC] focus-visible:border-[#012A5E] focus-visible:ring-1 focus-visible:ring-[#012A5E]'
                        }`}
                      />

                      {error && (
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-red-600 pt-0.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{error}</span>
                        </p>
                      )}

                      {/* Helper text with sample data quick-fill tag (#965:1474) */}
                      <div className="flex items-center justify-between text-xs text-[#4F5B70] pt-1">
                        <span>Example: admin@example.com</span>
                        <Button variant="plain"
                          type="button"
                          onClick={fillSampleEmail}
                          className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EEF2F7] hover:bg-[#DCE2EB] text-[#4F5B70] border border-[#DCE2EB] text-[10.5px] font-bold cursor-pointer transition-colors"
                          title="Click to fill sample email"
                        >
                          Sample data
                        </Button>
                      </div>
                    </div>

                    {/* Continue Button (#965:1478) */}
                    <Button
                      type="submit"
                      disabled={submitting || success}
                      className="w-full h-12 rounded-[14px] bg-[#012A5E] hover:bg-[#001D42] text-white font-extrabold text-base shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Verifying account...</span>
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Authenticated</span>
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>

                    {/* Trouble signing in Link (#965:1481) */}
                    <div className="text-center pt-1">
                      <Button variant="plain"
                        type="button"
                        onClick={() => switchToView('trouble')}
                        className="text-sm font-bold text-[#0267B8] hover:text-[#014A85] underline underline-offset-3 cursor-pointer transition-colors"
                      >
                        Trouble signing in?
                      </Button>
                    </div>
                  </form>

                  {/* Bottom Authorised Access Security Notice (#965:1483) */}
                  <div className="pt-4.5 border-t border-[#EEF1F5] flex items-start gap-3 text-left">
                    <ShieldCheck className="w-5 h-5 text-[#0267B8] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <b className="text-[13.5px] font-extrabold text-[#141B28] block">
                        Authorised access only
                      </b>
                      <span className="text-[13px] font-medium text-[#4F5B70] leading-relaxed block">
                        Access to the Aero Wing Admin Panel is restricted to
                        authorised staff.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* ---------------------------------------------------- */
                /* STATE B: TROUBLE SIGNING IN (#965:1500)              */
                /* ---------------------------------------------------- */
                <div className="space-y-6 text-center">
                  {/* Help Question Icon (#965:1500) */}
                  <div className="w-14 h-14 rounded-2xl bg-[#EBF3FC] text-[#0A76CC] flex items-center justify-center mx-auto shadow-2xs mt-1">
                    <HelpCircle className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  {/* Heading & Subtitle (#965:1500) */}
                  <div className="space-y-2">
                    <h2 className="text-[26px] font-extrabold text-[#012A5E] tracking-[-0.01em] leading-8.5">
                      Trouble signing in?
                    </h2>
                    <p className="text-[14px] font-medium text-[#4F5B70] max-w-xs mx-auto leading-relaxed">
                      Contact your Aero Wing administrator or authorised support
                      team for access assistance.
                    </p>
                  </div>

                  {/* Back to Sign In Button (#965:1500) */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => switchToView('login')}
                    className="w-full h-12 rounded-[14px] border border-[#C5CFDC] bg-white hover:bg-slate-50 text-[#012A5E] font-extrabold text-[15px] shadow-2xs cursor-pointer transition-all"
                  >
                    Back to Sign In
                  </Button>

                  {/* Bottom Authorised Access Security Notice (#965:1483) */}
                  <div className="pt-4.5 border-t border-[#EEF1F5] flex items-start gap-3 text-left">
                    <ShieldCheck className="w-5 h-5 text-[#0267B8] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <b className="text-[13.5px] font-extrabold text-[#141B28] block">
                        Authorised access only
                      </b>
                      <span className="text-[13px] font-medium text-[#4F5B70] leading-relaxed block">
                        Access to the Aero Wing Admin Panel is restricted to
                        authorised staff.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Copyright below Card (#965:1493) */}
          <div className="text-center text-[12.5px] font-semibold text-[#4F5B70] pt-1">
            © 2026 AeroWing. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  )
}

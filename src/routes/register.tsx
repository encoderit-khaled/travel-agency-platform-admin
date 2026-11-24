import { createFileRoute } from '@tanstack/react-router'
import { PartnerRegistrationFlow } from '#/components/partner-registration'

interface RegisterSearchParams {
  step?: 1 | 2 | 3
}

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>): RegisterSearchParams => {
    const rawStep = Number(search.step)
    const step: 1 | 2 | 3 =
      rawStep === 1 || rawStep === 2 || rawStep === 3 ? rawStep : 1
    return { step }
  },
  component: RegisterRoute,
})

function RegisterRoute() {
  const { step } = Route.useSearch()
  return <PartnerRegistrationFlow initialStep={step} />
}

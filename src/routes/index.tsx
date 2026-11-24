import { createFileRoute } from '@tanstack/react-router'
import { PartnerRegistrationFlow } from '#/components/partner-registration'

interface IndexSearchParams {
  step?: 1 | 2 | 3
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): IndexSearchParams => {
    const rawStep = Number(search.step)
    const step: 1 | 2 | 3 =
      rawStep === 1 || rawStep === 2 || rawStep === 3 ? rawStep : 3
    return { step }
  },
  component: PartnerRegistrationRoute,
})

function PartnerRegistrationRoute() {
  const { step } = Route.useSearch()
  return <PartnerRegistrationFlow initialStep={step} />
}

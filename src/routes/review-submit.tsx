import { createFileRoute } from '@tanstack/react-router'
import { ReviewSubmitPage } from '#/components/partner-registration'

export const Route = createFileRoute('/review-submit')({
  component: ReviewSubmitRoute,
})

function ReviewSubmitRoute() {
  return <ReviewSubmitPage />
}

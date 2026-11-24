import { createFileRoute } from '@tanstack/react-router'
import { CreateSubAgentPage } from '#/components/sub-agents'

export const Route = createFileRoute('/sub-agents/create')({
  component: CreateSubAgentPage,
})

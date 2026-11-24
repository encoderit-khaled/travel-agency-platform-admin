import * as React from 'react'
import { cn } from '#/lib/utils'
import { Check } from 'lucide-react'

export interface StepItem {
  id: number
  number: string
  label: string
  title: string
}

export const REGISTRATION_STEPS: StepItem[] = [
  { id: 1, number: '1', label: 'STEP 1', title: 'Business Information' },
  { id: 2, number: '2', label: 'STEP 2', title: 'Contact & Documents' },
  { id: 3, number: '3', label: 'STEP 3', title: 'Review & Submit' },
]

export interface RegistrationProgressProps {
  currentStep?: number
  className?: string
  steps?: StepItem[]
  onStepClick?: (stepId: number) => void
}

export function RegistrationProgress({
  currentStep = 2,
  className,
  steps = REGISTRATION_STEPS,
  onStepClick,
}: RegistrationProgressProps) {
  return (
    <nav
      aria-label="Registration progress"
      className={cn(
        'w-full rounded-[18px] border border-[#DCE2EB] bg-white px-5 py-4 shadow-xs',
        className,
      )}
    >
      <ol className="flex items-center justify-between gap-2 sm:gap-4">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isUpcoming = step.id > currentStep

          return (
            <React.Fragment key={step.id}>
              <li
                className={cn(
                  'flex items-center gap-3 select-none',
                  onStepClick &&
                    isCompleted &&
                    'cursor-pointer hover:opacity-85',
                )}
                onClick={() => {
                  if (onStepClick && (isCompleted || step.id <= currentStep)) {
                    onStepClick(step.id)
                  }
                }}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step Circle Indicator */}
                {isCompleted ? (
                  <span
                    aria-label={`${step.title} completed`}
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-full border-2 border-[#A7F3D0] bg-[#ECFDF5] text-[#059669] shadow-xs"
                  >
                    <Check className="size-4 stroke-3" />
                  </span>
                ) : isCurrent ? (
                  <span
                    aria-label={`Current step: ${step.title}`}
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#0267B8] text-white font-bold text-sm shadow-md"
                  >
                    {step.number}
                  </span>
                ) : (
                  <span
                    aria-label={`Upcoming step: ${step.title}`}
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-[#DCE2EB] bg-[#F8FAFD] text-[#8C9BAE] font-bold text-sm"
                  >
                    {step.number}
                  </span>
                )}

                {/* Step Texts */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-[10.5px] font-extrabold tracking-wider uppercase',
                      isCompleted && 'text-[#059669]',
                      isCurrent && 'text-[#0267B8]',
                      isUpcoming && 'text-[#8C9BAE]',
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-bold whitespace-nowrap',
                      isCompleted && 'text-[#141C2E]',
                      isCurrent && 'text-[#012A5E]',
                      isUpcoming && 'text-[#8C9BAE]',
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </li>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    'hidden md:block h-0.5 flex-1 min-w-[20px] rounded-full transition-colors',
                    step.id < currentStep ? 'bg-[#10B981]' : 'bg-[#E2E8F0]',
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

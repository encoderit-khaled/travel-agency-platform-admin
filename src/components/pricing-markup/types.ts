export type PricingRuleSource = 'admin' | 'agent'
export type RuleScope = 'All Services' | 'Specific Service' | 'Supplier'
export type PricingCalculationType = 'Percentage' | 'Fixed amount'
export type RuleStatus = 'active' | 'inactive'

export interface AdminPricingRule {
  id: string
  name: string
  source: 'admin'
  scope: RuleScope
  service: string
  supplier: string
  type: PricingCalculationType
  value: string
  numericValue: number
  appliedTo: string
  status: 'active'
  description?: string
  precedence?: number
}

export interface AgentMarkupRule {
  id: string
  name: string
  source: 'agent'
  scope: RuleScope
  service: string
  supplier: string
  type: PricingCalculationType
  value: string
  numericValue: number
  currency?: string
  appliedTo?: string
  status: RuleStatus
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type AnyPricingRule = AdminPricingRule | AgentMarkupRule

export interface ServiceCoverageModule {
  id: string
  name: string
  iconType:
    | 'plane'
    | 'hotel'
    | 'package'
    | 'activity'
    | 'car'
    | 'esim'
    | 'train'
    | 'insurance'
  hasAgentRule: boolean
  activeRulesCount: number
  status: 'active' | 'inactive' | 'admin_only'
  badgeLabel: 'Agent rule configured' | 'Admin pricing only'
  subtext: '1 active rule' | 'Rule inactive' | 'No Agent rule'
}

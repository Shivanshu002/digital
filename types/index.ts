export type UserRole = 'subscriber' | 'admin'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'lapsed'
export type SubscriptionPlan = 'monthly' | 'yearly'
export type DrawStatus = 'pending' | 'simulated' | 'published'
export type DrawType = 'random' | 'algorithmic'
export type MatchType = '5-match' | '4-match' | '3-match'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: UserRole
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan | null
  subscription_renewal_date: string | null
  charity_id: string | null
  charity_percentage: number
  created_at: string
}

export interface Charity {
  id: string
  name: string
  description: string | null
  image_url: string | null
  website: string | null
  is_featured: boolean
  created_at: string
  charity_events?: CharityEvent[]
}

export interface CharityEvent {
  id: string
  charity_id: string
  title: string
  description: string | null
  event_date: string | null
  created_at: string
}

export interface GolfScore {
  id: string
  user_id: string
  score: number
  played_at: string
  created_at: string
}

export interface Draw {
  id: string
  draw_date: string
  draw_type: DrawType
  drawn_numbers: number[] | null
  status: DrawStatus
  prize_pool_total: number
  jackpot_amount: number
  created_at: string
}

export interface DrawEntry {
  id: string
  draw_id: string
  user_id: string
  scores: number[]
  match_count: number
  created_at: string
}

export interface Winner {
  id: string
  draw_id: string
  user_id: string
  match_type: MatchType
  prize_amount: number
  verification_status: VerificationStatus
  proof_url: string | null
  created_at: string
  profiles?: Profile
  draws?: Draw
}

export const PRIZE_POOL_SHARES: Record<MatchType, number> = {
  '5-match': 0.40,
  '4-match': 0.35,
  '3-match': 0.25,
}

export const SUBSCRIPTION_PRICES = {
  monthly: 20,
  yearly: 200,
}

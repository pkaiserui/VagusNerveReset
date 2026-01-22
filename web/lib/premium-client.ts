import { createClient } from '@/lib/supabase/client'

export interface PremiumStatus {
  isPremium: boolean
  isTrial: boolean
  trialDaysRemaining: number | null
  trialEndDate: Date | null
}

/**
 * Client-side premium check (for client components)
 */
export async function checkPremiumStatusClient(userId: string): Promise<PremiumStatus> {
  const supabase = createClient()

  // Check for paid premium entitlement
  const { data: entitlements } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (entitlements) {
    return {
      isPremium: true,
      isTrial: false,
      trialDaysRemaining: null,
      trialEndDate: null,
    }
  }

  // Check for trial period (14 days from signup)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.created_at) {
    return {
      isPremium: false,
      isTrial: false,
      trialDaysRemaining: null,
      trialEndDate: null,
    }
  }

  const signupDate = new Date(user.created_at)
  const trialEndDate = new Date(signupDate)
  trialEndDate.setDate(trialEndDate.getDate() + 14)
  const now = new Date()

  if (now <= trialEndDate) {
    const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return {
      isPremium: true,
      isTrial: true,
      trialDaysRemaining: daysRemaining,
      trialEndDate: trialEndDate,
    }
  }

  return {
    isPremium: false,
    isTrial: false,
    trialDaysRemaining: null,
    trialEndDate: null,
  }
}

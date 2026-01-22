import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PremiumClient from './PremiumClient'
import { checkPremiumStatus } from '@/lib/premium'

async function getPremiumData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const premiumStatus = await checkPremiumStatus(user.id)

  return {
    isPremium: premiumStatus.isPremium,
    premiumStatus,
  }
}

export default async function PremiumPage() {
  const data = await getPremiumData()

  return <PremiumClient {...data} />
}

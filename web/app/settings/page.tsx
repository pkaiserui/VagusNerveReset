import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'
import { checkPremiumStatus } from '@/lib/premium'

async function getSettingsData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const premiumStatus = await checkPremiumStatus(user.id)

  return {
    user,
    profile: profile || null,
    isPremium: premiumStatus.isPremium,
    premiumStatus,
  }
}

export default async function SettingsPage() {
  const data = await getSettingsData()

  return <SettingsClient {...data} />
}

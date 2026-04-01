import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: activeUsers },
    { data: draws },
    { data: charityContribs },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('draws').select('prize_pool_total, jackpot_amount').eq('status', 'published'),
    supabase.from('profiles').select('charity_percentage, subscription_plan'),
  ])

  const totalPrizePool = draws?.reduce((s, d) => s + d.prize_pool_total, 0) || 0
  const totalJackpot = draws?.reduce((s, d) => s + d.jackpot_amount, 0) || 0
  const totalCharityContrib = charityContribs?.reduce((s, p) => {
    const base = p.subscription_plan === 'yearly' ? 200 : 20
    return s + (base * (p.charity_percentage / 100))
  }, 0) || 0

  const stats = [
    { label: 'Total Users', value: totalUsers || 0 },
    { label: 'Active Subscribers', value: activeUsers || 0 },
    { label: 'Total Prize Pool', value: formatCurrency(totalPrizePool) },
    { label: 'Current Jackpot', value: formatCurrency(totalJackpot) },
    { label: 'Charity Contributions', value: formatCurrency(totalCharityContrib) },
    { label: 'Draws Published', value: draws?.length || 0 },
  ]

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Admin Overview</h1>
      <p className="text-neutral-400 mb-10">Platform analytics at a glance.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass rounded-2xl p-6">
            <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
            <p className="text-2xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { AlertCircle, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: scores }, { data: wins }] = await Promise.all([
    supabase.from('profiles').select('*, charities(name)').eq('id', user.id).single(),
    supabase.from('golf_scores').select('*').eq('user_id', user.id).order('played_at', { ascending: false }).limit(5),
    supabase.from('winners').select('*, draws(draw_date)').eq('user_id', user.id),
  ])

  const totalWon = wins?.reduce((sum, w) => sum + w.prize_amount, 0) || 0

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-black mb-2">Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}</h1>
      <p className="text-neutral-400 mb-10">Here's your platform overview.</p>

      {profile?.subscription_status !== 'active' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3 mb-8">
          <AlertCircle className="text-amber-400 shrink-0" size={20} />
          <p className="text-sm text-amber-300">Your subscription is <strong>{profile?.subscription_status}</strong>. <Link href="/signup" className="underline">Reactivate</Link> to enter draws.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Subscription', value: profile?.subscription_status || '—', sub: profile?.subscription_plan || '' },
          { label: 'Renewal', value: profile?.subscription_renewal_date ? formatDate(profile.subscription_renewal_date) : '—', sub: '' },
          { label: 'Total Won', value: formatCurrency(totalWon), sub: '' },
          { label: 'Charity', value: profile?.charities?.name || 'None selected', sub: `${profile?.charity_percentage || 10}% contribution` },
        ].map(card => (
          <div key={card.label} className="glass rounded-2xl p-5">
            <p className="text-xs text-neutral-500 mb-1">{card.label}</p>
            <p className="font-bold text-white truncate">{card.value}</p>
            {card.sub && <p className="text-xs text-neutral-500 mt-0.5 truncate">{card.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Scores */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">Recent Scores</h2>
            <Link href="/dashboard/scores" className="text-emerald-400 text-sm flex items-center gap-1 hover:text-emerald-300">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {scores && scores.length > 0 ? (
            <div className="space-y-2">
              {scores.map(s => (
                <div key={s.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-neutral-400 text-sm">{formatDate(s.played_at)}</span>
                  <span className="font-bold text-emerald-400 text-lg">{s.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm">No scores yet. <Link href="/dashboard/scores" className="text-emerald-400">Add your first score</Link></p>
          )}
        </div>

        {/* Wins */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">Winnings</h2>
            <Link href="/dashboard/draws" className="text-emerald-400 text-sm flex items-center gap-1 hover:text-emerald-300">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {wins && wins.length > 0 ? (
            <div className="space-y-2">
              {wins.slice(0, 4).map(w => (
                <div key={w.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{w.match_type}</p>
                    <p className="text-xs text-neutral-500">{w.draws?.draw_date ? formatDate(w.draws.draw_date) : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">{formatCurrency(w.prize_amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm">No winnings yet. Keep playing!</p>
          )}
        </div>
      </div>
    </div>
  )
}

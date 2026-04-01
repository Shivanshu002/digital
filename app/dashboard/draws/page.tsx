import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import ProofUpload from './ProofUpload'

export default async function DrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: wins }, { data: draws }] = await Promise.all([
    supabase.from('winners').select('*, draws(draw_date, drawn_numbers)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('draws').select('*').eq('status', 'published').order('draw_date', { ascending: false }).limit(6),
  ])

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black mb-2">Draws & Wins</h1>
      <p className="text-neutral-400 mb-10">Your draw history and winnings.</p>

      {/* Winnings */}
      <h2 className="font-bold text-lg mb-4">My Winnings</h2>
      {wins && wins.length > 0 ? (
        <div className="space-y-4 mb-12">
          {wins.map(w => (
            <div key={w.id} className="glass rounded-2xl p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-lg">{w.match_type}</p>
                  <p className="text-neutral-400 text-sm">{w.draws?.draw_date ? formatDate(w.draws.draw_date) : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400">{formatCurrency(w.prize_amount)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {w.draws?.drawn_numbers?.map((n: number) => (
                  <span key={n} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold">{n}</span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full border ${
                  w.verification_status === 'approved' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                  w.verification_status === 'rejected' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                  'border-amber-500/30 text-amber-400 bg-amber-500/10'
                }`}>
                  Verification: {w.verification_status}
                </span>
                {w.verification_status === 'pending' && !w.proof_url && (
                  <ProofUpload winnerId={w.id} />
                )}
                {w.proof_url && <span className="text-xs text-neutral-500">Proof submitted</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center mb-12">
          <p className="text-neutral-400">No winnings yet. Keep entering draws!</p>
        </div>
      )}

      {/* Recent Draws */}
      <h2 className="font-bold text-lg mb-4">Recent Draws</h2>
      <div className="space-y-3">
        {draws?.map(d => (
          <div key={d.id} className="glass rounded-xl p-5 flex flex-wrap justify-between gap-4 items-center">
            <div>
              <p className="font-medium">{formatDate(d.draw_date)}</p>
              <p className="text-xs text-neutral-500 capitalize">{d.draw_type} draw</p>
            </div>
            <div className="flex gap-2">
              {d.drawn_numbers?.map((n: number) => (
                <span key={n} className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">{n}</span>
              ))}
            </div>
            <p className="text-sm text-neutral-400">Pool: {formatCurrency(d.prize_pool_total)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

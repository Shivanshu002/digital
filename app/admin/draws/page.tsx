import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import DrawControls from './DrawControls'

export default async function AdminDrawsPage() {
  const supabase = await createClient()
  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })

  const { count: activeSubscribers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Draws</h1>
          <p className="text-neutral-400">{activeSubscribers || 0} active subscribers</p>
        </div>
        <DrawControls activeSubscribers={activeSubscribers || 0} />
      </div>

      <div className="space-y-4">
        {draws?.map(d => (
          <div key={d.id} className="glass rounded-2xl p-6">
            <div className="flex flex-wrap justify-between gap-4 items-start mb-4">
              <div>
                <p className="font-bold">{formatDate(d.draw_date)}</p>
                <p className="text-xs text-neutral-500 capitalize mt-0.5">{d.draw_type} draw</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full border ${
                  d.status === 'published' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                  d.status === 'simulated' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                  'border-neutral-500/30 text-neutral-400 bg-neutral-500/10'
                }`}>{d.status}</span>
                {d.status !== 'published' && (
                  <DrawControls drawId={d.id} currentStatus={d.status} activeSubscribers={activeSubscribers || 0} />
                )}
              </div>
            </div>
            {d.drawn_numbers && (
              <div className="flex gap-2 mb-3">
                {d.drawn_numbers.map((n: number) => (
                  <span key={n} className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">{n}</span>
                ))}
              </div>
            )}
            <div className="flex gap-6 text-sm text-neutral-400">
              <span>Pool: <strong className="text-white">{formatCurrency(d.prize_pool_total)}</strong></span>
              <span>Jackpot: <strong className="text-amber-400">{formatCurrency(d.jackpot_amount)}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

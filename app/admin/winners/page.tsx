import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import WinnerActions from './WinnerActions'

export default async function AdminWinnersPage() {
  const supabase = await createClient()
  const { data: winners } = await supabase
    .from('winners')
    .select('*, profiles(full_name, email), draws(draw_date)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Winners</h1>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-neutral-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4">Winner</th>
                <th className="text-left px-6 py-4">Match</th>
                <th className="text-left px-6 py-4">Prize</th>
                <th className="text-left px-6 py-4">Draw Date</th>
                <th className="text-left px-6 py-4">Verification</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {winners?.map(w => (
                <tr key={w.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{w.profiles?.full_name || '—'}</p>
                    <p className="text-neutral-500 text-xs">{w.profiles?.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{w.match_type}</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">{formatCurrency(w.prize_amount)}</td>
                  <td className="px-6 py-4 text-neutral-400">{w.draws?.draw_date ? formatDate(w.draws.draw_date) : '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      w.verification_status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                      w.verification_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>{w.verification_status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <WinnerActions winner={w} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import type { GolfScore } from '@/types'

export default function ScoresPage() {
  const [scores, setScores] = useState<GolfScore[]>([])
  const [score, setScore] = useState('')
  const [playedAt, setPlayedAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function fetchScores() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(5)
    setScores(data || [])
  }

  useEffect(() => { fetchScores() }, [])

  async function addScore(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const val = Number(score)
    if (val < 1 || val > 45) { setError('Score must be between 1 and 45'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Enforce rolling 5: delete oldest if already 5
    if (scores.length >= 5) {
      const oldest = [...scores].sort((a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime())[0]
      await supabase.from('golf_scores').delete().eq('id', oldest.id)
    }

    const { error: insertError } = await supabase.from('golf_scores').insert({
      user_id: user.id, score: val, played_at: playedAt
    })
    if (insertError) setError(insertError.message)
    else { setScore(''); setPlayedAt(''); await fetchScores() }
    setLoading(false)
  }

  async function deleteScore(id: string) {
    await supabase.from('golf_scores').delete().eq('id', id)
    await fetchScores()
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-black mb-2">My Scores</h1>
      <p className="text-neutral-400 mb-8">Your last 5 Stableford scores. Adding a new one replaces the oldest.</p>

      <form onSubmit={addScore} className="glass rounded-2xl p-6 mb-8 space-y-4">
        <h2 className="font-bold">Add New Score</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-400 block mb-1.5">Score (1–45)</label>
            <input type="number" min={1} max={45} required value={score} onChange={e => setScore(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <div>
            <label className="text-sm text-neutral-400 block mb-1.5">Date Played</label>
            <input type="date" required value={playedAt} onChange={e => setPlayedAt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-colors">
          <Plus size={18} /> {loading ? 'Adding…' : 'Add Score'}
        </button>
      </form>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between text-sm text-neutral-500">
          <span>Date</span><span>Score</span>
        </div>
        {scores.length === 0 ? (
          <p className="text-neutral-500 text-sm p-6">No scores yet.</p>
        ) : (
          scores.map((s, i) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
              <div>
                <span className="text-sm text-neutral-400">{formatDate(s.played_at)}</span>
                {i === 0 && <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Latest</span>}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-emerald-400">{s.score}</span>
                <button onClick={() => deleteScore(s.id)} className="text-neutral-600 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

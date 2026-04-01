'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, ExternalLink } from 'lucide-react'
import type { Charity } from '@/types'

export default function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [percentage, setPercentage] = useState(10)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: profile }, { data: chars }] = await Promise.all([
        supabase.from('profiles').select('charity_id, charity_percentage').eq('id', user.id).single(),
        supabase.from('charities').select('*').order('name'),
      ])
      setCharities(chars || [])
      if (profile?.charity_id) setSelectedId(profile.charity_id)
      if (profile?.charity_percentage) setPercentage(profile.charity_percentage)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ charity_id: selectedId || null, charity_percentage: percentage }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selected = charities.find(c => c.id === selectedId)

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black mb-2">My Charity</h1>
      <p className="text-neutral-400 mb-8">Choose where your contribution goes and how much you give.</p>

      {selected && (
        <div className="glass rounded-2xl p-6 mb-8 border border-emerald-500/20">
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-2">Currently Supporting</p>
          <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
          <p className="text-neutral-400 text-sm mb-3">{selected.description}</p>
          {selected.website && (
            <a href={selected.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-400 text-sm hover:text-emerald-300">
              Visit website <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}

      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-bold mb-4">Select Charity</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {charities.map(c => (
            <button key={c.id} onClick={() => setSelectedId(c.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${selectedId === c.id ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'border-white/10 text-neutral-400 hover:border-white/20'}`}>
              {selectedId === c.id && <CheckCircle size={16} className="text-emerald-400 shrink-0" />}
              <span>{c.name}</span>
              {c.is_featured && <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Featured</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-bold mb-4">Contribution: <span className="text-emerald-400">{percentage}%</span></h2>
        <input type="range" min={10} max={100} value={percentage} onChange={e => setPercentage(Number(e.target.value))}
          className="w-full accent-emerald-500 mb-2" />
        <div className="flex justify-between text-xs text-neutral-500">
          <span>10% (minimum)</span><span>100%</span>
        </div>
      </div>

      <button onClick={save} disabled={saving} className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-colors">
        {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

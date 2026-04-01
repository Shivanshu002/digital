'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

export default function CharityForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('charities').insert({ name, description, website: website || null, is_featured: isFeatured })
    setLoading(false)
    setOpen(false)
    setName(''); setDescription(''); setWebsite(''); setIsFeatured(false)
    router.refresh()
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
      <Plus size={16} /> Add Charity
    </button>
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Charity</h2>
          <button onClick={() => setOpen(false)}><X size={20} className="text-neutral-400" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Charity name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 resize-none" />
          <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website URL (optional)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500" />
          <label className="flex items-center gap-3 text-sm text-neutral-400 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-emerald-500" />
            Feature on homepage
          </label>
          <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors">
            {loading ? 'Adding…' : 'Add Charity'}
          </button>
        </form>
      </div>
    </div>
  )
}

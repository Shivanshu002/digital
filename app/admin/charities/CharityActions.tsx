'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2, Star } from 'lucide-react'
import type { Charity } from '@/types'

export default function CharityActions({ charity }: { charity: Charity }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function toggleFeatured() {
    setLoading(true)
    await supabase.from('charities').update({ is_featured: !charity.is_featured }).eq('id', charity.id)
    setLoading(false)
    router.refresh()
  }

  async function deleteCharity() {
    if (!confirm(`Delete "${charity.name}"?`)) return
    setLoading(true)
    await supabase.from('charities').delete().eq('id', charity.id)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button onClick={toggleFeatured} disabled={loading}
        className={`p-2 rounded-lg transition-colors ${charity.is_featured ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-amber-400 hover:bg-amber-500/10'}`}>
        <Star size={16} />
      </button>
      <button onClick={deleteCharity} disabled={loading}
        className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  )
}

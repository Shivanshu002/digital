'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'

export default function WinnerActions({ winner }: { winner: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function update(patch: object) {
    setLoading(true)
    await supabase.from('winners').update(patch).eq('id', winner.id)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-1.5">
      {winner.proof_url && (
        <a href={winner.proof_url} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
          <ExternalLink size={14} />
        </a>
      )}
      {winner.verification_status === 'pending' && (
        <>
          <button onClick={() => update({ verification_status: 'approved' })} disabled={loading}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
            <CheckCircle size={14} />
          </button>
          <button onClick={() => update({ verification_status: 'rejected' })} disabled={loading}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <XCircle size={14} />
          </button>
        </>
      )}
    </div>
  )
}

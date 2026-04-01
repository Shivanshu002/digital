'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload } from 'lucide-react'

export default function ProofUpload({ winnerId }: { winnerId: string }) {
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const path = `proofs/${user.id}/${winnerId}-${Date.now()}`
    const { data, error } = await supabase.storage.from('winner-proofs').upload(path, file)
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('winner-proofs').getPublicUrl(path)
      await supabase.from('winners').update({ proof_url: publicUrl }).eq('id', winnerId)
      setDone(true)
    }
    setUploading(false)
  }

  if (done) return <span className="text-xs text-emerald-400">✓ Proof uploaded</span>

  return (
    <label className="cursor-pointer flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg">
      <Upload size={14} />
      {uploading ? 'Uploading…' : 'Upload Proof'}
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
    </label>
  )
}

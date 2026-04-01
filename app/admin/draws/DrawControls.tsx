'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Eye, Send, Plus } from 'lucide-react'

interface Props {
  drawId?: string
  currentStatus?: string
  activeSubscribers: number
}

export default function DrawControls({ drawId, currentStatus, activeSubscribers }: Props) {
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [drawType, setDrawType] = useState<'random' | 'algorithmic'>('random')
  const router = useRouter()

  async function runAction(action: string, body?: object) {
    setLoading(true)
    await fetch('/api/draws', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, drawId, drawType, ...body }),
    })
    setLoading(false)
    router.refresh()
  }

  // New draw button
  if (!drawId) {
    return (
      <div className="flex items-center gap-3">
        {showCreate && (
          <select value={drawType} onChange={e => setDrawType(e.target.value as 'random' | 'algorithmic')}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="random">Random</option>
            <option value="algorithmic">Algorithmic</option>
          </select>
        )}
        <button onClick={() => showCreate ? runAction('create') : setShowCreate(true)} disabled={loading}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <Plus size={16} /> {showCreate ? (loading ? 'Creating…' : 'Create Draw') : 'New Draw'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {currentStatus === 'pending' && (
        <button onClick={() => runAction('simulate')} disabled={loading}
          className="flex items-center gap-1.5 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
          <Eye size={14} /> {loading ? '…' : 'Simulate'}
        </button>
      )}
      {(currentStatus === 'pending' || currentStatus === 'simulated') && (
        <button onClick={() => runAction('publish')} disabled={loading}
          className="flex items-center gap-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
          <Send size={14} /> {loading ? '…' : 'Publish'}
        </button>
      )}
    </div>
  )
}

'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }

    // Set session explicitly so the next query is authenticated
    await supabase.auth.setSession({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
    })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()

    localStorage.setItem('user_id', data.user.id)
    localStorage.setItem('user_email', data.user.email ?? '')
    localStorage.setItem('user_role', profile?.role ?? 'subscriber')

    window.location.href = profile?.role === 'admin' ? '/admin' : '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06)_0%,transparent_60%)]">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-black gradient-text mb-10">GolfGives</Link>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-neutral-400 block mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1.5">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-neutral-500 text-sm mt-6">
            No account? <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">Subscribe now</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

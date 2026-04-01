'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import type { Charity } from '@/types'

function SignupForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [plan, setPlan] = useState<'monthly' | 'yearly'>(
    (searchParams.get('plan') as 'monthly' | 'yearly') || 'monthly'
  )
  const [charities, setCharities] = useState<Charity[]>([])
  const [charityId, setCharityId] = useState('')
  const [charityPct, setCharityPct] = useState(10)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.from('charities').select('*').then(({ data }) => setCharities(data || []))
  }, [])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setError('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    if (signupError || !data.user) { setError(signupError?.message || 'Signup failed'); setLoading(false); return }

    // Save charity preference before redirecting to payment
    await supabase.from('profiles').update({
      charity_id: charityId || null,
      charity_percentage: charityPct,
      subscription_plan: plan,
    }).eq('id', data.user.id)

    // Redirect to Stripe Checkout (test mode)
    const res = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, userId: data.user.id }),
    })
    const { url, error: stripeError } = await res.json()
    if (stripeError || !url) { setError('Payment setup failed'); setLoading(false); return }
    window.location.href = url
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06)_0%,transparent_60%)]">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-black gradient-text mb-10">GolfGives</Link>
        <div className="glass rounded-2xl p-8">
          <div className="flex gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-emerald-500' : 'bg-white/10'}`} />
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 ? (
              <>
                <h1 className="text-2xl font-bold mb-6">Create your account</h1>
                <div>
                  <label className="text-sm text-neutral-400 block mb-1.5">Full Name</label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm text-neutral-400 block mb-1.5">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm text-neutral-400 block mb-1.5">Password</label>
                  <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="text-sm text-neutral-400 block mb-3">Choose Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['monthly', 'yearly'] as const).map(p => (
                      <button type="button" key={p} onClick={() => setPlan(p)}
                        className={`py-3 rounded-xl font-semibold text-sm border transition-all ${plan === p ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/10 text-neutral-400 hover:border-white/20'}`}>
                        {p === 'monthly' ? '£20/mo' : '£200/yr'}
                        {p === 'yearly' && <span className="block text-xs text-emerald-400">Save £40</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">Choose your charity</h1>
                <p className="text-neutral-400 text-sm mb-6">At least 10% of your subscription goes to your chosen charity.</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {charities.map(c => (
                    <button type="button" key={c.id} onClick={() => setCharityId(c.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${charityId === c.id ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'border-white/10 text-neutral-400 hover:border-white/20'}`}>
                      {charityId === c.id && <CheckCircle size={16} className="text-emerald-400 shrink-0" />}
                      {c.name}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-sm text-neutral-400 block mb-1.5">Charity Contribution: {charityPct}%</label>
                  <input type="range" min={10} max={100} value={charityPct} onChange={e => setCharityPct(Number(e.target.value))}
                    className="w-full accent-emerald-500" />
                </div>
              </>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors">
              {loading ? 'Creating account…' : step === 1 ? 'Continue' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm mt-6">
            Already a member? <Link href="/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}

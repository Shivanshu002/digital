import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Heart, Trophy, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featuredCharity } = await supabase
    .from('charities')
    .select('*')
    .eq('is_featured', true)
    .single()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-500/20 mb-6">
              Golf · Charity · Monthly Draws
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Every swing<br />
              <span className="gradient-text">changes lives.</span>
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Track your Stableford scores, enter monthly prize draws, and automatically support the charity you care about — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all animate-pulse-glow flex items-center gap-2 justify-center">
                Start Giving Today <ArrowRight size={20} />
              </Link>
              <Link href="/how-it-works" className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all">
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-6 border-y border-white/5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '£40K+', label: 'Prize Pool This Month' },
              { value: '12', label: 'Charities Supported' },
              { value: '2,400+', label: 'Active Members' },
              { value: '10%+', label: 'Goes to Charity' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-neutral-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6" id="how-it-works">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">How It Works</h2>
            <p className="text-neutral-400 text-center mb-16 max-w-xl mx-auto">Three simple steps. Real impact.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: TrendingUp, title: 'Track Your Scores', desc: 'Enter your last 5 Stableford scores. The platform keeps a rolling record — newest in, oldest out.' },
                { icon: Trophy, title: 'Enter Monthly Draws', desc: 'Your scores automatically enter you into the monthly draw. Match 3, 4, or 5 numbers to win.' },
                { icon: Heart, title: 'Support Your Charity', desc: 'At least 10% of your subscription goes directly to the charity you choose. You can give more.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="text-emerald-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Simple Pricing</h2>
            <p className="text-neutral-400 text-center mb-16">No hidden fees. Cancel anytime.</p>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { plan: 'Monthly', price: '£20', period: '/month', features: ['Full platform access', 'Monthly draw entry', 'Score tracking', 'Charity contribution'], highlight: false },
                { plan: 'Yearly', price: '£200', period: '/year', badge: 'Save £40', features: ['Everything in Monthly', '2 months free', 'Priority support', 'Charity contribution'], highlight: true },
              ].map(({ plan, price, period, badge, features, highlight }) => (
                <div key={plan} className={`rounded-2xl p-8 relative ${highlight ? 'bg-emerald-500/10 border border-emerald-500/30' : 'glass'}`}>
                  {badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">{badge}</span>
                  )}
                  <p className="text-neutral-400 text-sm mb-2">{plan}</p>
                  <p className="text-5xl font-black mb-1">{price}<span className="text-lg text-neutral-400 font-normal">{period}</span></p>
                  <ul className="mt-6 space-y-3 mb-8">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-neutral-300">
                        <CheckCircle size={16} className="text-emerald-400 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/signup?plan=${plan.toLowerCase()}`} className={`block text-center py-3 rounded-full font-bold transition-all ${highlight ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'glass hover:bg-white/10 text-white'}`}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Charity */}
        {featuredCharity && (
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto glass rounded-3xl p-10 md:p-16 text-center">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Spotlight Charity</span>
              <h2 className="text-3xl font-black mt-3 mb-4">{featuredCharity.name}</h2>
              <p className="text-neutral-400 max-w-xl mx-auto mb-8">{featuredCharity.description}</p>
              <Link href="/charities" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                View All Charities <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

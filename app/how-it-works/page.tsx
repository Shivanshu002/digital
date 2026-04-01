import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { UserPlus, CreditCard, TrendingUp, Trophy, Heart, ArrowRight } from 'lucide-react'

const steps = [
  { icon: UserPlus, title: 'Create Your Account', desc: 'Sign up in minutes. Choose your subscription plan — monthly or yearly.' },
  { icon: CreditCard, title: 'Subscribe Securely', desc: 'Pay via Stripe. Your subscription is PCI-compliant and can be cancelled anytime.' },
  { icon: Heart, title: 'Pick Your Charity', desc: 'Select from our verified charity directory. At least 10% of your fee goes directly to them.' },
  { icon: TrendingUp, title: 'Enter Your Scores', desc: 'Log your last 5 Stableford scores (1–45). The platform keeps a rolling record automatically.' },
  { icon: Trophy, title: 'Enter Monthly Draws', desc: 'Your scores are your draw numbers. Match 3, 4, or 5 drawn numbers to win a share of the prize pool.' },
]

const prizes = [
  { match: '5 Numbers', share: '40%', note: 'Jackpot — rolls over if unclaimed', highlight: true },
  { match: '4 Numbers', share: '35%', note: 'Split equally among winners', highlight: false },
  { match: '3 Numbers', share: '25%', note: 'Split equally among winners', highlight: false },
]

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">How It Works</h1>
            <p className="text-neutral-400 text-lg">Simple steps. Real prizes. Real impact.</p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-20">
            {steps.map((step, i) => (
              <div key={step.title} className="glass rounded-2xl p-6 flex gap-5 items-start">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <step.icon className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Step {i + 1}</p>
                  <h2 className="font-bold text-lg mb-1">{step.title}</h2>
                  <p className="text-neutral-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prize table */}
          <h2 className="text-3xl font-black mb-6 text-center">Prize Pool Breakdown</h2>
          <div className="space-y-3 mb-16">
            {prizes.map(p => (
              <div key={p.match} className={`rounded-2xl p-6 flex justify-between items-center ${p.highlight ? 'bg-emerald-500/10 border border-emerald-500/30' : 'glass'}`}>
                <div>
                  <p className="font-bold">{p.match}</p>
                  <p className="text-neutral-400 text-sm">{p.note}</p>
                </div>
                <p className={`text-3xl font-black ${p.highlight ? 'text-emerald-400' : 'text-white'}`}>{p.share}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ExternalLink, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function CharitiesPage() {
  const supabase = await createClient()
  const { data: charities } = await supabase
    .from('charities')
    .select('*, charity_events(*)')
    .order('is_featured', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Our Charities</h1>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto">Every subscription supports a cause. Choose yours and make every round count.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {charities?.map(c => (
              <div key={c.id} className="glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all">
                {c.is_featured && (
                  <span className="inline-block text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full mb-4">⭐ Featured</span>
                )}
                <h2 className="text-xl font-bold mb-3">{c.name}</h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">{c.description}</p>
                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 text-sm hover:text-emerald-300 transition-colors mb-5">
                    <ExternalLink size={14} /> Visit website
                  </a>
                )}
                {c.charity_events && c.charity_events.length > 0 && (
                  <div className="border-t border-white/5 pt-4 mt-4">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Upcoming Events</p>
                    <div className="space-y-2">
                      {c.charity_events.slice(0, 3).map((ev: any) => (
                        <div key={ev.id} className="flex items-start gap-3">
                          <Calendar size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{ev.title}</p>
                            {ev.event_date && <p className="text-xs text-neutral-500">{formatDate(ev.event_date)}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

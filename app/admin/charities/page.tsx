import { createClient } from '@/lib/supabase/server'
import CharityForm from './CharityForm'
import CharityActions from './CharityActions'

export default async function AdminCharitiesPage() {
  const supabase = await createClient()
  const { data: charities } = await supabase.from('charities').select('*').order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Charities</h1>
        <CharityForm />
      </div>

      <div className="space-y-3">
        {charities?.map(c => (
          <div key={c.id} className="glass rounded-2xl p-6 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-bold">{c.name}</h2>
                {c.is_featured && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <p className="text-neutral-400 text-sm">{c.description}</p>
              {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 text-xs mt-1 inline-block hover:text-emerald-300">{c.website}</a>}
            </div>
            <CharityActions charity={c} />
          </div>
        ))}
      </div>
    </div>
  )
}

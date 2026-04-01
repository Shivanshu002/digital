import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Users</h1>
      <p className="text-neutral-400 mb-8">{users?.length || 0} total users</p>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-neutral-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4">Name / Email</th>
                <th className="text-left px-6 py-4">Plan</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Charity</th>
                <th className="text-left px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(u => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{u.full_name || '—'}</p>
                    <p className="text-neutral-500 text-xs">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 capitalize">{u.subscription_plan || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      u.subscription_status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      u.subscription_status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-neutral-500/20 text-neutral-400'
                    }`}>{u.subscription_status}</span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">{u.charities?.name || '—'}</td>
                  <td className="px-6 py-4 text-neutral-500">{formatDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

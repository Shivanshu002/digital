import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, TrendingUp, Heart, Trophy, ShieldCheck } from 'lucide-react'
import SignOutButton from '@/components/SignOutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('full_name, subscription_status, role').eq('id', user.id).single()

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/scores', label: 'My Scores', icon: TrendingUp },
    { href: '/dashboard/charity', label: 'My Charity', icon: Heart },
    { href: '/dashboard/draws', label: 'Draws & Wins', icon: Trophy },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col p-6 fixed h-full hidden md:flex">
        <Link href="/" className="text-xl font-black gradient-text mb-10">GolfGives</Link>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-6">
          <p className="text-sm font-medium text-white truncate">{profile?.full_name || user.email}</p>
          <p className={`text-xs mt-0.5 ${profile?.subscription_status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
            {profile?.subscription_status}
          </p>
          {profile?.role === 'admin' && (
            <Link href="/admin"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm mb-3 font-semibold transition-colors">
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          )}
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 flex justify-around py-3 z-50">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors">
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </nav>

      <main className="flex-1 md:ml-64 p-6 md:p-10 pb-24 md:pb-10">
        {children}
      </main>
    </div>
  )
}

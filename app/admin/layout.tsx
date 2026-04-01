import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Trophy, Heart, CheckSquare, BarChart3, LogOut, LayoutDashboard } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const navItems = [
    { href: '/admin', label: 'Overview', icon: BarChart3 },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/draws', label: 'Draws', icon: Trophy },
    { href: '/admin/charities', label: 'Charities', icon: Heart },
    { href: '/admin/winners', label: 'Winners', icon: CheckSquare },
  ]

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-neutral-900 border-r border-white/5 flex flex-col p-6 fixed h-full hidden md:flex">
        <div className="mb-2">
          <Link href="/" className="text-xl font-black gradient-text">GolfGives</Link>
          <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <p className="text-xs text-neutral-600 mb-8">Admin Panel</p>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/signout" method="POST">
          <button className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </form>
        <Link href="/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-emerald-400 text-sm mt-3 transition-colors">
          <LayoutDashboard size={16} /> User Dashboard
        </Link>
      </aside>
      <main className="flex-1 md:ml-64 p-6 md:p-10">{children}</main>
    </div>
  )
}

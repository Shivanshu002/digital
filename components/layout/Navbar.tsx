'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold gradient-text">GolfGives</Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
          <Link href="/charities" className="hover:text-white transition-colors">Charities</Link>
          <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-full font-semibold transition-colors">
            Subscribe
          </Link>
        </div>
        <button className="md:hidden text-neutral-400" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass border-t border-white/5 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/charities" onClick={() => setOpen(false)}>Charities</Link>
          <Link href="/how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
          <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
          <Link href="/signup" className="bg-emerald-500 text-white px-5 py-2 rounded-full font-semibold text-center" onClick={() => setOpen(false)}>
            Subscribe
          </Link>
        </div>
      )}
    </nav>
  )
}

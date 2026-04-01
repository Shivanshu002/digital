import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 text-sm text-neutral-500">
        <div>
          <p className="text-white font-bold text-lg gradient-text mb-2">GolfGives</p>
          <p>Play. Win. Give.</p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <p className="text-white font-medium mb-1">Platform</p>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/charities" className="hover:text-white transition-colors">Charities</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Subscribe</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-white font-medium mb-1">Account</p>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </div>
      <p className="text-center text-neutral-700 text-xs mt-10">© {new Date().getFullYear()} GolfGives. All rights reserved.</p>
    </footer>
  )
}

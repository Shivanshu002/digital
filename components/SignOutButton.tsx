'use client'
export default function SignOutButton() {
  function handleSignOut() {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_role')
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/api/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }
  return (
    <button onClick={handleSignOut} className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mt-4 transition-colors">
      Sign Out
    </button>
  )
}

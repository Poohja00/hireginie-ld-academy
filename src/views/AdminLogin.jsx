import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Store } from '../store.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, pageMotion } from '../ui.jsx'

export default function AdminLogin() {
  const nav = useNavigate()
  const { refreshUser } = useApp()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e?.preventDefault()
    setErr('')
    if (!email.trim() || !pw) return setErr('Enter your admin email and password.')
    setBusy(true)
    try {
      await Store.signIn(email.trim().toLowerCase(), pw)
      if (!Store.profile || !Store.profile.is_admin) {
        await Store.signOut()
        refreshUser()
        setErr('This sign-in is for admin accounts only.')
        setBusy(false)
        return
      }
      refreshUser()
      nav('/admin')
    } catch (ex) {
      setErr(ex.message || 'Sign-in failed.')
      setBusy(false)
    }
  }

  const field = 'w-full px-3.5 py-3 border border-line rounded-xl text-[15px] bg-surface2 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition'

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap" style={{ maxWidth: 440 }}>
        <div className="text-center text-xs tracking-[0.16em] uppercase text-accent-d font-semibold mb-2 flex items-center justify-center gap-1.5">
          <Icon name="shield" className="!w-3.5 !h-3.5" /> Admin access
        </div>
        <h2 className="serif text-center text-3xl mb-6">Admin sign in</h2>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-line rounded-2xl p-8 shadow-[var(--shadow-soft)]"
        >
          <div className="mb-3.5">
            <label className="block text-[13px] text-muted mb-1.5">Admin email</label>
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hireginie.com" />
          </div>
          <div className="mb-4">
            <label className="block text-[13px] text-muted mb-1.5">Password</label>
            <input className={field} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Your password" />
          </div>
          <Button variant="accent" type="submit" disabled={busy} className="w-full">
            {busy ? 'Please wait...' : 'Sign in as admin'}
          </Button>
          {err && (
            <div className="flex items-start gap-2 bg-bad/8 border border-bad/20 rounded-xl px-3.5 py-2.5 mt-3">
              <svg className="w-4 h-4 text-bad flex-none mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              <p className="text-bad text-[13.5px]">{err}</p>
            </div>
          )}
        </motion.form>
        <div className="text-center text-sm text-muted mt-4">
          Not an admin? <a className="cursor-pointer font-semibold text-ink" onClick={() => nav('/login')}>Go to regular sign in</a>
        </div>
      </div>
    </motion.div>
  )
}

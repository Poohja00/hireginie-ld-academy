import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Store, PREVIEW } from '../store.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Button, pageMotion } from '../ui.jsx'

export default function Auth({ mode }) {
  const signup = mode === 'signup'
  const nav = useNavigate()
  const { refreshUser } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [good, setGood] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e?.preventDefault()
    setErr(''); setGood(false)
    const em = email.trim().toLowerCase()
    if (signup && !name.trim()) return setErr('Please enter your name.')
    if (!em || !/.+@.+\..+/.test(em)) return setErr('Please enter a valid email.')
    if (pw.length < 6) return setErr('Password must be at least 6 characters.')
    setBusy(true)
    try {
      if (signup) {
        const r = await Store.signUp(name.trim(), em, pw)
        if (r && r.needConfirm) { setGood(true); setBusy(false); return setErr('Check your email to confirm your account, then sign in.') }
      } else {
        await Store.signIn(em, pw)
      }
      refreshUser()
      nav('/dashboard')
    } catch (ex) {
      setErr(ex.message || 'Something went wrong.')
      setBusy(false)
    }
  }

  const field = 'w-full px-3.5 py-3 border border-line rounded-xl text-[15px] bg-surface2 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition'

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap max-w-[440px]">
        <div className="text-center text-xs tracking-[0.16em] uppercase text-accent-d font-semibold mb-2">
          {CONFIG.BRAND} {CONFIG.PROGRAM_NAME}
        </div>
        <h2 className="serif text-center text-3xl mb-6">{signup ? 'Create your account' : 'Welcome back'}</h2>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-line rounded-2xl p-8 shadow-[var(--shadow-soft)]"
        >
          {signup && (
            <div className="mb-3.5">
              <label className="block text-[13px] text-muted mb-1.5">Full name</label>
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="As it should appear on your certificate" />
            </div>
          )}
          <div className="mb-3.5">
            <label className="block text-[13px] text-muted mb-1.5">Email</label>
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="mb-3.5">
            <label className="block text-[13px] text-muted mb-1.5">Password</label>
            <input className={field} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={signup ? 'Choose a password (min 6 chars)' : 'Your password'} />
          </div>
          <Button variant="accent" type="submit" disabled={busy} className="w-full mt-1">
            {busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}
          </Button>
          {err && <div className={`text-[13.5px] mt-3 ${good ? 'text-good' : 'text-bad'}`}>{err}</div>}
          {PREVIEW && (
            <div className="text-[13px] text-muted bg-surface2 border border-line2 rounded-xl p-3 mt-3.5">
              Running in <b>preview mode</b> — your account and progress are stored only in this browser.
              Add Supabase keys in <b>config.js</b> to enable real cross-device accounts.
            </div>
          )}
        </motion.form>
        <div className="text-center text-sm text-muted mt-4">
          {signup ? 'Already registered? ' : 'New here? '}
          <a className="cursor-pointer font-semibold" onClick={() => nav(signup ? '/login' : '/signup')}>
            {signup ? 'Sign in' : 'Create an account'}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

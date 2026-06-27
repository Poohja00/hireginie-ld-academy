import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Store, PREVIEW } from '../store.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Button, pageMotion } from '../ui.jsx'
import { Icon } from '../icons.jsx'

export default function Auth({ mode }) {
  const signup = mode === 'signup'
  const nav = useNavigate()
  const { refreshUser } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [touched, setTouched] = useState({})

  function touch(field) { setTouched(t => ({ ...t, [field]: true })) }

  function validate() {
    if (signup && !name.trim()) return 'Please enter your full name.'
    if (!email.trim()) return 'Please enter your email address.'
    if (!/.+@.+\..+/.test(email.trim())) return 'Please enter a valid email address.'
    if (!pw) return 'Please enter a password.'
    if (signup && pw.length < 6) return 'Password must be at least 6 characters.'
    return null
  }

  async function submit(e) {
    e?.preventDefault()
    setErr('')
    const validErr = validate()
    if (validErr) { setTouched({ name: true, email: true, pw: true }); return setErr(validErr) }
    setBusy(true)
    try {
      if (signup) {
        const r = await Store.signUp(name.trim(), email.trim().toLowerCase(), pw)
        if (r && r.needConfirm) { setEmailSent(true); setBusy(false); return }
      } else {
        await Store.signIn(email.trim().toLowerCase(), pw)
      }
      refreshUser()
      nav('/dashboard')
    } catch (ex) {
      const msg = ex.message || ''
      if (msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('invalid credentials')) {
        setErr('Incorrect email or password. Please try again.')
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('user already')) {
        setErr('An account with this email already exists. Try signing in instead.')
      } else if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('security purposes')) {
        setErr('Too many attempts. Please wait a moment before trying again.')
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setErr('Please confirm your email first — check your inbox for the verification link.')
      } else {
        setErr(msg || 'Something went wrong. Please try again.')
      }
      setBusy(false)
    }
  }

  const field = (hasErr) =>
    `w-full px-3.5 py-3 border rounded-xl text-[15px] bg-surface2 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition ${
      hasErr ? 'border-bad/60 bg-bad/5' : 'border-line'
    }`

  if (emailSent) {
    return (
      <motion.div {...pageMotion} className="py-14 pb-24">
        <div className="wrap max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-line rounded-2xl p-8 shadow-[var(--shadow-soft)] text-center"
          >
            <div className="w-14 h-14 rounded-full bg-good/10 text-good grid place-items-center mx-auto mb-4">
              <Icon name="check" className="!w-7 !h-7" />
            </div>
            <h2 className="font-serif text-2xl mb-2">Check your inbox</h2>
            <p className="text-muted text-[15px] mb-1">
              We sent a verification link to
            </p>
            <p className="font-semibold text-ink mb-4">{email}</p>
            <p className="text-muted text-[14px] mb-6">
              Click the link in the email to verify your account, then come back and sign in.
              If you don't see it, check your spam folder.
            </p>
            <Button variant="ghost" className="w-full" onClick={() => nav('/login')}>
              Go to sign in
            </Button>
            <button
              onClick={() => { setEmailSent(false); setErr('') }}
              className="block text-[13px] text-muted mt-3 mx-auto hover:text-ink"
            >
              Wrong email? Go back
            </button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

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
              <input
                className={field(touched.name && !name.trim())}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => touch('name')}
                placeholder="As it should appear on your certificate"
              />
              {touched.name && !name.trim() && (
                <p className="text-bad text-[12px] mt-1">Name is required.</p>
              )}
            </div>
          )}
          <div className="mb-3.5">
            <label className="block text-[13px] text-muted mb-1.5">Email</label>
            <input
              className={field(touched.email && !/.+@.+\..+/.test(email.trim()))}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => touch('email')}
              placeholder="you@company.com"
            />
            {touched.email && !/.+@.+\..+/.test(email.trim()) && (
              <p className="text-bad text-[12px] mt-1">Enter a valid email address.</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-[13px] text-muted mb-1.5">Password</label>
            <input
              className={field(touched.pw && (signup ? pw.length < 6 : !pw))}
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onBlur={() => touch('pw')}
              placeholder={signup ? 'Choose a password (min 6 chars)' : 'Your password'}
            />
            {touched.pw && signup && pw && pw.length < 6 && (
              <p className="text-bad text-[12px] mt-1">Password must be at least 6 characters.</p>
            )}
            {!signup && (
              <div className="text-right mt-1.5">
                <button type="button" className="text-[12px] text-accent-d hover:underline">
                  Forgot password?
                </button>
              </div>
            )}
          </div>
          <Button variant="accent" type="submit" disabled={busy} className="w-full">
            {busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}
          </Button>
          {err && (
            <div className="flex items-start gap-2 bg-bad/8 border border-bad/20 rounded-xl px-3.5 py-2.5 mt-3">
              <svg className="w-4 h-4 text-bad flex-none mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              <p className="text-bad text-[13.5px]">{err}</p>
            </div>
          )}
          {PREVIEW && (
            <div className="text-[13px] text-muted bg-surface2 border border-line2 rounded-xl p-3 mt-3.5">
              Running in <b>preview mode</b> — your account and progress are stored only in this browser.
              Add Supabase keys in <b>config.js</b> to enable real cross-device accounts.
            </div>
          )}
        </motion.form>
        <div className="text-center text-sm text-muted mt-4">
          {signup ? 'Already registered? ' : 'New here? '}
          <a className="cursor-pointer font-semibold text-ink" onClick={() => nav(signup ? '/login' : '/signup')}>
            {signup ? 'Sign in' : 'Create an account'}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

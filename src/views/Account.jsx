import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Store } from '../store.js'
import { Account } from '../account.js'
import { useApp } from '../app-context.jsx'
import { Button, Eyebrow, pageMotion } from '../ui.jsx'

function initials(n, e) {
  n = n || e || ''
  const p = n.trim().split(/\s+/)
  return ((p[0] || '')[0] || '') + ((p[1] || '')[0] || '') || (e || '?')[0].toUpperCase()
}

export default function AccountSettings() {
  const { user, profile, isAdmin, refreshUser, showToast } = useApp()
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    full_name: '', avatar_url: '', bio: '', location: '', github: '', linkedin: '', twitter: '', website: '', workplace: '',
  })
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setForm({
      full_name: (profile && profile.full_name) || (user && user.name) || '',
      avatar_url: (profile && profile.avatar_url) || '',
      bio: (profile && profile.bio) || '',
      location: (profile && profile.location) || '',
      github: (profile && profile.github) || '',
      linkedin: (profile && profile.linkedin) || '',
      twitter: (profile && profile.twitter) || '',
      website: (profile && profile.website) || '',
      workplace: (profile && profile.workplace) || '',
    })
  }, [profile])

  async function onPickFile(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await Account.uploadAvatar(user.id, file)
      setForm((f) => ({ ...f, avatar_url: url }))
      showToast('Photo uploaded - click Save to apply')
    } catch (err) {
      showToast(err.message || 'Failed to upload photo')
    }
    setUploading(false)
    e.target.value = ''
  }

  async function save() {
    setBusy(true)
    try {
      await Account.updateProfile(form)
      if (Store.profile) Store.profile = { ...Store.profile, ...form }
      refreshUser()
      showToast('Profile saved')
    } catch (e) {
      showToast(e.message || 'Failed to save profile')
    }
    setBusy(false)
  }

  const field = 'w-full px-3.5 py-2.5 border border-line rounded-xl text-[14.5px] bg-surface2 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition'

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap" style={{ maxWidth: 680 }}>
        <Eyebrow>Account</Eyebrow>
        <h2 className="font-serif text-3xl mb-1">Profile details</h2>
        <p className="text-muted text-[13.5px] mb-7">* Required</p>

        <div className="bg-surface border border-line rounded-2xl p-6 flex flex-col gap-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-accent-soft text-accent-d grid place-items-center font-semibold text-2xl flex-none">
              {form.avatar_url
                ? <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                : initials(form.full_name, user && user.email)}
            </div>
            <div>
              <div className="text-[13px] text-muted mb-1.5">Avatar photo</div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
              <Button variant="ghost" size="sm" onClick={() => fileRef.current && fileRef.current.click()} disabled={uploading}>
                {uploading ? 'Uploading…' : 'Choose photo'}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-muted mb-1.5">Name *</label>
            <input className={field} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>

          {isAdmin ? (
            <div>
              <label className="block text-[13px] text-muted mb-1.5">Email</label>
              <input className={field} value={(user && user.email) || ''} disabled />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Bio (optional)</label>
                <textarea
                  rows={3} className={field}
                  value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Location (optional)</label>
                <input
                  className={field} placeholder="City, Country"
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-muted mb-1.5">GitHub username (optional)</label>
                  <input className={field} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] text-muted mb-1.5">LinkedIn username (optional)</label>
                  <input className={field} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] text-muted mb-1.5">Twitter username (optional)</label>
                  <input className={field} value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] text-muted mb-1.5">Personal website (optional)</label>
                  <input className={field} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Workplace (optional)</label>
                <input className={field} value={form.workplace} onChange={(e) => setForm({ ...form, workplace: e.target.value })} />
              </div>
            </>
          )}

          <Button onClick={save} disabled={busy} className="self-start">{busy ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </div>
    </motion.div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Admin } from '../admin.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, Eyebrow, pageMotion } from '../ui.jsx'

function initials(n, e) {
  n = n || e || ''
  const p = n.trim().split(/\s+/)
  return ((p[0] || '')[0] || '') + ((p[1] || '')[0] || '') || (e || '?')[0].toUpperCase()
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-surface border border-line rounded-2xl px-5 py-4 flex-1 min-w-[140px]">
      <b className="font-serif text-[26px] block leading-none" style={accent ? { color: accent } : {}}>{value}</b>
      <span className="text-[12px] text-muted">{label}</span>
    </div>
  )
}

function CertModal({ user, onClose, onIssue, onRevoke, busy }) {
  const [name, setName] = useState(user.full_name || user.email)
  const [percent, setPercent] = useState(user.bestScore || 80)

  const cert = user.cert
  const d = cert ? new Date(cert.issued_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-paper rounded-2xl max-w-[640px] w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl">Certificate — {user.full_name || user.email}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink"><Icon name="x" /></button>
        </div>

        {cert ? (
          <>
            <div className="relative w-full bg-surface border border-line text-center px-7 py-10 shadow-[var(--shadow-soft)] mb-4">
              <span className="absolute inset-2.5 border-[1.5px] border-accent pointer-events-none" />
              <span className="absolute inset-4 border-[0.5px] border-line pointer-events-none" />
              <img src="/logo.png" alt={CONFIG.BRAND} className="h-9 w-auto mx-auto mb-3" />
              <div className="text-[10px] tracking-[0.24em] uppercase text-accent-d">Certificate of Completion</div>
              <div className="text-muted text-sm mt-3">This certifies that</div>
              <div className="font-serif text-[28px] mt-2 mb-1">{cert.full_name}</div>
              <div className="w-[90px] h-px bg-accent mx-auto my-3" />
              <div className="text-muted text-[13px] max-w-[420px] mx-auto">
                has successfully completed the <b>{CONFIG.BRAND} {CONFIG.PROGRAM_NAME}</b> programme with a score of <b>{cert.percent}%</b>.
              </div>
              <div className="flex justify-between mt-7 text-[11px]">
                <div className="text-left">
                  <b className="font-serif block text-sm text-ink">{d}</b>
                  <span className="text-faint text-[10px] uppercase tracking-[0.08em]">Date of issue</span>
                </div>
                <div className="text-right">
                  <b className="font-serif block text-sm text-ink">{cert.id}</b>
                  <span className="text-faint text-[10px] uppercase tracking-[0.08em]">Credential ID</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <Button icon="download" size="sm" onClick={() => window.print()}>Print / Save as PDF</Button>
              <Button variant="ghost" size="sm" onClick={() => onIssue(user.id, name, percent)} disabled={busy}>Re-issue (new ID)</Button>
              <Button variant="ghost" size="sm" className="!text-bad !border-bad/40" onClick={() => onRevoke(cert.id)} disabled={busy}>Revoke certificate</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted text-sm mb-4">
              This user hasn't earned a certificate yet ({user.topicsDone}/{user.topicsTotal} topics · best exam score {user.bestScore}%).
              You can manually issue one below — useful for exceptions handled outside the platform.
            </p>
            <div className="bg-surface border border-line rounded-xl p-4 flex flex-col gap-3">
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Name on certificate</label>
                <input
                  className="w-full px-3.5 py-2.5 border border-line rounded-xl text-[15px] bg-surface2 focus:outline-none focus:border-accent"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Score (%)</label>
                <input
                  type="number" min="0" max="100"
                  className="w-full px-3.5 py-2.5 border border-line rounded-xl text-[15px] bg-surface2 focus:outline-none focus:border-accent"
                  value={percent} onChange={(e) => setPercent(e.target.value)}
                />
              </div>
              <Button onClick={() => onIssue(user.id, name, percent)} disabled={busy}>{busy ? 'Issuing…' : 'Issue certificate'}</Button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { showToast } = useApp()
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [certFilter, setCertFilter] = useState('all')
  const [sortBy, setSortBy] = useState('joined')
  const [busyId, setBusyId] = useState(null)
  const [certUser, setCertUser] = useState(null)
  const [bulkThreshold, setBulkThreshold] = useState(50)
  const [bulkBusy, setBulkBusy] = useState(false)

  async function load() {
    try {
      setError('')
      const data = await Admin.listUsers()
      setUsers(data)
    } catch (e) {
      setError(e.message || 'Failed to load users.')
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!users) return []
    let r = users
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      r = r.filter((u) => (u.full_name || '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    }
    if (statusFilter === 'active') r = r.filter((u) => !u.suspended)
    if (statusFilter === 'suspended') r = r.filter((u) => u.suspended)
    if (certFilter === 'certified') r = r.filter((u) => u.certified)
    if (certFilter === 'not-certified') r = r.filter((u) => !u.certified)
    r = [...r].sort((a, b) => {
      if (sortBy === 'progress') return b.pct - a.pct
      if (sortBy === 'name') return (a.full_name || a.email).localeCompare(b.full_name || b.email)
      return new Date(b.created_at) - new Date(a.created_at)
    })
    return r
  }, [users, search, statusFilter, certFilter, sortBy])

  const stats = useMemo(() => {
    if (!users) return null
    return {
      total: users.length,
      certified: users.filter((u) => u.certified).length,
      inProgress: users.filter((u) => u.pct > 0 && u.pct < 100).length,
      avgScore: users.filter((u) => u.attemptCount > 0).length
        ? Math.round(users.filter((u) => u.attemptCount > 0).reduce((s, u) => s + u.bestScore, 0) / users.filter((u) => u.attemptCount > 0).length)
        : 0,
    }
  }, [users])

  async function toggleSuspend(u) {
    setBusyId(u.id)
    try {
      await Admin.setSuspended(u.id, !u.suspended)
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, suspended: !u.suspended } : x)))
      showToast(u.suspended ? 'Access restored' : 'User removed from course access')
    } catch (e) {
      showToast(e.message || 'Action failed')
    }
    setBusyId(null)
  }

  async function remind(u) {
    setBusyId(u.id)
    try {
      await Admin.sendReminder(u.email, u.full_name, u.pct)
      showToast(`Reminder sent to ${u.email}`)
    } catch (e) {
      showToast(e.message || 'Could not send reminder')
    }
    setBusyId(null)
  }

  async function bulkRemind() {
    const targets = filtered.filter((u) => !u.suspended && !u.certified && u.pct < bulkThreshold)
    if (!targets.length) return showToast('No matching users below that threshold')
    setBulkBusy(true)
    let sent = 0
    for (const u of targets) {
      try { await Admin.sendReminder(u.email, u.full_name, u.pct); sent++ } catch {}
    }
    setBulkBusy(false)
    showToast(`Sent ${sent}/${targets.length} reminder emails`)
  }

  async function issueCert(userId, name, percent) {
    setBusyId(userId)
    try {
      const cert = await Admin.issueCertificate(userId, name, Number(percent))
      setUsers((prev) => prev.map((x) => (x.id === userId ? { ...x, certified: true, cert: { ...cert, issued_at: new Date().toISOString() } } : x)))
      setCertUser((prev) => prev && { ...prev, certified: true, cert: { ...cert, issued_at: new Date().toISOString() } })
      showToast('Certificate issued')
    } catch (e) {
      showToast(e.message || 'Failed to issue certificate')
    }
    setBusyId(null)
  }

  async function revokeCert(certId) {
    if (!certUser) return
    setBusyId(certUser.id)
    try {
      await Admin.deleteCertificate(certId)
      setUsers((prev) => prev.map((x) => (x.id === certUser.id ? { ...x, certified: false, cert: null } : x)))
      setCertUser(null)
      showToast('Certificate revoked')
    } catch (e) {
      showToast(e.message || 'Failed to revoke certificate')
    }
    setBusyId(null)
  }

  function exportCSV() {
    const csv = Admin.toCSV(filtered)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'lda-roster.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <motion.div {...pageMotion} className="py-14 pb-24">
        <div className="wrap max-w-[600px] text-center">
          <Eyebrow>Admin</Eyebrow>
          <h2 className="font-serif text-2xl mb-2">Couldn't load the roster</h2>
          <p className="text-muted text-sm mb-4">{error}</p>
          <Button variant="ghost" onClick={load}>Try again</Button>
        </div>
      </motion.div>
    )
  }

  if (!users) return <div className="py-24 text-center text-muted">Loading roster…</div>

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap max-w-[1100px]">
        <Eyebrow>Admin</Eyebrow>
        <h2 className="font-serif text-3xl mb-1">Learner roster</h2>
        <p className="text-muted text-[15px] mb-6">Track progress, send reminders, and manage certificates.</p>

        <div className="flex gap-3 flex-wrap mb-7">
          <StatCard label="Registered" value={stats.total} />
          <StatCard label="Certified" value={stats.certified} accent="#22a355" />
          <StatCard label="In progress" value={stats.inProgress} accent="#3a61d2" />
          <StatCard label="Avg exam score" value={stats.avgScore + '%'} accent="#c8920a" />
        </div>

        {/* bulk remind */}
        <div className="bg-surface2 border border-line2 rounded-xl px-4 py-3 mb-5 flex items-center gap-3 flex-wrap">
          <Icon name="mail" className="!w-4 !h-4 text-muted" />
          <span className="text-[13.5px] text-muted">Remind everyone (not certified, not suspended) below</span>
          <input
            type="number" min="0" max="100" value={bulkThreshold}
            onChange={(e) => setBulkThreshold(Number(e.target.value))}
            className="w-16 px-2 py-1 border border-line rounded-lg text-[13.5px] bg-surface text-center"
          />
          <span className="text-[13.5px] text-muted">% progress</span>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={bulkRemind} disabled={bulkBusy}>
            {bulkBusy ? 'Sending…' : 'Send bulk reminder'}
          </Button>
        </div>

        {/* filters */}
        <div className="flex gap-2.5 flex-wrap mb-4 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Icon name="search" className="!w-4 !h-4 absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              placeholder="Search name or email…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-line rounded-xl text-[14px] bg-surface focus:outline-none focus:border-accent"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-line rounded-xl text-[13.5px] bg-surface">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <select value={certFilter} onChange={(e) => setCertFilter(e.target.value)} className="px-3 py-2.5 border border-line rounded-xl text-[13.5px] bg-surface">
            <option value="all">All certification</option>
            <option value="certified">Certified</option>
            <option value="not-certified">Not certified</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2.5 border border-line rounded-xl text-[13.5px] bg-surface">
            <option value="joined">Sort: newest first</option>
            <option value="progress">Sort: progress</option>
            <option value="name">Sort: name</option>
          </select>
          <Button variant="ghost" size="sm" icon="download" onClick={exportCSV}>Export CSV</Button>
        </div>

        {/* table */}
        <div className="bg-surface border border-line rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_110px_110px_110px_140px] gap-3 px-5 py-3 text-[11px] uppercase tracking-[0.08em] text-faint border-b border-line bg-surface2">
            <span>Learner</span>
            <span>Progress</span>
            <span>Best score</span>
            <span>Certified</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">No learners match these filters.</div>
          )}
          {filtered.map((u) => (
            <div
              key={u.id}
              className={`grid grid-cols-[1fr_110px_110px_110px_140px] gap-3 px-5 py-3.5 items-center border-b border-line last:border-0 ${u.suspended ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-accent-soft text-accent-d grid place-items-center font-semibold text-[12px] flex-none">
                  {initials(u.full_name, u.email)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[14px] truncate">{u.full_name || '(no name)'}</div>
                  <div className="text-[12.5px] text-muted truncate">{u.email}</div>
                </div>
                {u.suspended && <span className="text-[10px] px-2 py-0.5 rounded-full bg-bad/10 text-bad flex-none">Suspended</span>}
              </div>
              <div className="text-[13.5px]">
                <div className="h-1.5 rounded-full bg-surface2 overflow-hidden mb-1">
                  <div className="h-full bg-accent" style={{ width: `${u.pct}%` }} />
                </div>
                {u.topicsDone}/{u.topicsTotal} · {u.pct}%
              </div>
              <div className="text-[13.5px] text-muted">
                {u.attemptCount ? `${u.bestScore}% (${u.attemptCount})` : '—'}
              </div>
              <div>
                {u.certified
                  ? <span className="text-[12px] px-2.5 py-1 rounded-full bg-good/10 text-good font-medium">Certified</span>
                  : <span className="text-[12px] px-2.5 py-1 rounded-full bg-surface2 text-faint">Not yet</span>}
              </div>
              <div className="flex justify-end gap-1.5">
                <button
                  title="Send reminder email" onClick={() => remind(u)} disabled={busyId === u.id || u.suspended}
                  className="w-8 h-8 grid place-items-center rounded-lg border border-line text-muted hover:text-accent-d hover:border-accent disabled:opacity-30"
                ><Icon name="mail" className="!w-4 !h-4" /></button>
                <button
                  title="View / manage certificate" onClick={() => setCertUser(u)}
                  className="w-8 h-8 grid place-items-center rounded-lg border border-line text-muted hover:text-ink hover:border-ink"
                ><Icon name="award" className="!w-4 !h-4" /></button>
                <button
                  title={u.suspended ? 'Restore access' : 'Remove from course'} onClick={() => toggleSuspend(u)} disabled={busyId === u.id}
                  className={`w-8 h-8 grid place-items-center rounded-lg border ${u.suspended ? 'border-good/40 text-good hover:bg-good/10' : 'border-line text-muted hover:text-bad hover:border-bad/40'} disabled:opacity-30`}
                ><Icon name={u.suspended ? 'refresh' : 'ban'} className="!w-4 !h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {certUser && (
          <CertModal
            user={certUser}
            busy={busyId === certUser.id}
            onClose={() => setCertUser(null)}
            onIssue={issueCert}
            onRevoke={revokeCert}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

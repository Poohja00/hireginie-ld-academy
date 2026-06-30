import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Admin } from '../admin.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, Eyebrow, pageMotion } from '../ui.jsx'
import { CertCanvas } from './Certificate.jsx'

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

function CertModal({ user, template, onClose, onRevoke, busy }) {
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
          <h3 className="font-serif text-xl">Certificate - {user.full_name || user.email}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink"><Icon name="x" /></button>
        </div>

        {cert ? (
          <>
            <div className="mb-4 rounded-xl overflow-hidden border border-line">
              <CertCanvas template={template} fullName={cert.full_name} percent={cert.percent} dateStr={d} certId={cert.id} />
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <Button icon="download" size="sm" onClick={() => window.print()}>Print / Save as PDF</Button>
              <Button variant="ghost" size="sm" className="!text-bad !border-bad/40" onClick={() => onRevoke(cert.id)} disabled={busy}>Revoke certificate</Button>
            </div>
          </>
        ) : (
          <p className="text-muted text-sm">
            This learner hasn't earned a certificate yet ({user.topicsDone}/{user.topicsTotal} topics, best exam score {user.bestScore}%).
            A certificate appears here automatically once they complete all topics and pass the exam.
          </p>
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
  const [template, setTemplate] = useState(null)
  const [bulkThreshold, setBulkThreshold] = useState(50)

  async function load() {
    try {
      setError('')
      const [data, tmpl] = await Promise.all([Admin.listUsers(), Admin.getCertTemplate()])
      setUsers(data)
      setTemplate(tmpl)
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

  function remind(u) {
    window.open(Admin.buildReminderMailto(u.email, u.full_name, u.pct), '_blank')
    showToast(`Opening a reminder email to ${u.email} in a new tab`)
  }

  function bulkRemind() {
    const targets = filtered.filter((u) => !u.suspended && !u.certified && u.pct < bulkThreshold)
    if (!targets.length) return showToast('No matching learners below that threshold')
    setStatusFilter('active')
    setCertFilter('not-certified')
    showToast(`Filtered to ${targets.length} learner(s) below ${bulkThreshold}% - click the mail icon on each to send`)
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
        <div className="wrap text-center" style={{ maxWidth: 600 }}>
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
      <div className="wrap" style={{ maxWidth: 1100 }}>
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
          <span className="text-[13.5px] text-muted">Find everyone (not certified, not suspended) below</span>
          <input
            type="number" min="0" max="100" value={bulkThreshold}
            onChange={(e) => setBulkThreshold(Number(e.target.value))}
            className="w-16 px-2 py-1 border border-line rounded-lg text-[13.5px] bg-surface text-center"
          />
          <span className="text-[13.5px] text-muted">% progress, then remind each from the list below</span>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={bulkRemind}>
            Filter list
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
                {u.attemptCount ? `${u.bestScore}% (${u.attemptCount})` : '-'}
              </div>
              <div>
                {u.certified
                  ? <span className="text-[12px] px-2.5 py-1 rounded-full bg-good/10 text-good font-medium">Certified</span>
                  : <span className="text-[12px] px-2.5 py-1 rounded-full bg-surface2 text-faint">Not yet</span>}
              </div>
              <div className="flex justify-end gap-1.5">
                <button
                  title="Send reminder email" onClick={() => remind(u)} disabled={u.suspended}
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
            template={template}
            busy={busyId === certUser.id}
            onClose={() => setCertUser(null)}
            onRevoke={revokeCert}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

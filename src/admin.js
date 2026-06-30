import { sb, useSB } from './store.js'
import { TOPICS } from './data.js'

function assertSB() {
  if (!useSB) throw new Error('Admin tools require Supabase to be configured.')
}

function randId() {
  return 'HIRG-LD-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export const Admin = {
  // Fetches every registered user plus their topic progress, best exam score
  // and certification status in one shot, joined client-side.
  async listUsers() {
    assertSB()
    const [profiles, progress, attempts, certs] = await Promise.all([
      sb.from('profiles').select('*').eq('is_admin', false).order('created_at', { ascending: false }),
      sb.from('progress').select('user_id, topic_id'),
      sb.from('attempts').select('user_id, percent, passed, created_at'),
      sb.from('certificates').select('*'),
    ])
    if (profiles.error) throw profiles.error

    const progByUser = new Map()
    for (const row of progress.data || []) {
      if (!progByUser.has(row.user_id)) progByUser.set(row.user_id, new Set())
      progByUser.get(row.user_id).add(row.topic_id)
    }
    const attByUser = new Map()
    for (const row of attempts.data || []) {
      if (!attByUser.has(row.user_id)) attByUser.set(row.user_id, [])
      attByUser.get(row.user_id).push(row)
    }
    const certByUser = new Map((certs.data || []).map((c) => [c.user_id, c]))

    return (profiles.data || []).map((p) => {
      const done = progByUser.get(p.id)?.size || 0
      const atts = attByUser.get(p.id) || []
      const best = atts.reduce((m, a) => Math.max(m, a.percent || 0), 0)
      const passed = atts.some((a) => a.passed)
      const cert = certByUser.get(p.id) || null
      const lastAttempt = atts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      return {
        ...p,
        topicsDone: done,
        topicsTotal: TOPICS.length,
        pct: Math.round((done / TOPICS.length) * 100),
        attemptCount: atts.length,
        bestScore: best,
        passed,
        certified: !!cert,
        cert,
        lastAttemptAt: lastAttempt?.created_at || null,
      }
    })
  },

  async setSuspended(userId, suspended) {
    assertSB()
    const r = await sb.from('profiles').update({ suspended }).eq('id', userId)
    if (r.error) throw r.error
  },

  async issueCertificate(userId, fullName, percent) {
    assertSB()
    const cert = { id: randId(), user_id: userId, full_name: fullName, percent: Math.round(percent) }
    const r = await sb.from('certificates').upsert(cert)
    if (r.error) throw r.error
    return cert
  },

  async deleteCertificate(certId) {
    assertSB()
    const r = await sb.from('certificates').delete().eq('id', certId)
    if (r.error) throw r.error
  },

  // Universal certificate template: one shared row admins edit, that every
  // learner's certificate renders against (background image + name position).
  async getCertTemplate() {
    if (!useSB) return null
    const r = await sb.from('cert_template').select('*').eq('id', 1).single()
    return r.data || null
  },

  async saveCertTemplate(template) {
    assertSB()
    const r = await sb.from('cert_template').upsert({ id: 1, ...template, updated_at: new Date().toISOString() })
    if (r.error) throw r.error
  },

  // Builds a Gmail web-compose URL (not mailto:) so it opens reliably in a
  // new tab without depending on the OS/browser having a mailto: handler
  // registered. Admin reviews and clicks Send themselves from their own inbox.
  buildReminderMailto(email, name, pct) {
    const firstName = (name || '').trim().split(/\s+/)[0] || 'there'
    const subject = 'Finish your Hireginie L&D Academy course'
    const body = `Hi ${firstName},\n\n` +
      `You're ${pct}% through the Hireginie L&D Academy course - just checking in to see how it's going!\n\n` +
      `------------------------------------\n` +
      `   CONTINUE MY COURSE\n` +
      `   https://learninganddevelopment-hireginie.vercel.app/#/dashboard\n` +
      `------------------------------------\n\n` +
      `Whenever you get a chance, jump back in and pick up right where you left off.\n\n` +
      `Best,\nPooja\nHireginie L&D Academy`
    const params = new URLSearchParams({ view: 'cm', fs: '1', to: email, su: subject, body, authuser: 'pooja.hireginie@gmail.com' })
    return `https://mail.google.com/mail/?${params.toString()}`
  },

  toCSV(users) {
    const headers = ['Name', 'Email', 'Joined', 'Topics done', 'Progress %', 'Exam attempts', 'Best score', 'Passed', 'Certified', 'Status']
    const rows = users.map((u) => [
      u.full_name || '',
      u.email,
      new Date(u.created_at).toLocaleDateString(),
      u.topicsDone,
      u.pct,
      u.attemptCount,
      u.bestScore,
      u.passed ? 'Yes' : 'No',
      u.certified ? 'Yes' : 'No',
      u.suspended ? 'Suspended' : 'Active',
    ])
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
    return [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n')
  },
}

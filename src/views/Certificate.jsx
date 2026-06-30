import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Store } from '../store.js'
import { TOPICS } from '../data.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, Eyebrow, pageMotion } from '../ui.jsx'
import { Admin } from '../admin.js'
import AdminCertManager from './AdminCertManager.jsx'

const THRESH = CONFIG.CERT_PASS_THRESHOLD || 80
const REQ_ALL = CONFIG.CERT_REQUIRE_ALL_TOPICS !== false

function randId() {
  return 'HIRG-LD-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

// Renders against the admin-uploaded template (background image + name
// position) when one exists; falls back to the built-in coded design.
export function CertCanvas({ template, fullName, percent, dateStr, certId }) {
  if (template && template.image_url) {
    return (
      <div className="relative w-full bg-white">
        <img src={template.image_url} alt="Certificate" className="w-full h-auto block" />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 font-serif text-center whitespace-nowrap"
          style={{ top: `${template.name_top}%`, left: `${template.name_left}%`, fontSize: `${template.font_size}px`, color: template.color }}
        >
          {fullName}
        </div>
      </div>
    )
  }
  return (
    <div className="relative w-full bg-surface border border-line text-center px-10 py-14 md:px-16 shadow-[var(--shadow-lift)]">
      <span className="absolute inset-3.5 border-[1.5px] border-accent pointer-events-none" />
      <span className="absolute inset-5 border-[0.5px] border-line pointer-events-none" />
      <img src="/logo.png" alt={CONFIG.BRAND} className="h-12 w-auto mx-auto mb-4" />
      <div className="text-xs tracking-[0.28em] uppercase text-accent-d">Certificate of Completion</div>
      <div className="text-muted mt-4.5">This certifies that</div>
      <div className="font-serif text-[42px] mt-3.5 mb-1.5">{fullName}</div>
      <div className="w-[120px] h-px bg-accent mx-auto my-4" />
      <div className="text-muted max-w-[520px] mx-auto">
        has successfully completed the <b>{CONFIG.BRAND} {CONFIG.PROGRAM_NAME}</b> programme - all {TOPICS.length} topics
        across 6 modules - and passed the certification exam with a score of <b>{percent}%</b>.
      </div>
      <div className="flex justify-between mt-10 text-[13px]">
        <div className="text-left">
          <b className="font-serif block text-base text-ink">{dateStr}</b>
          <span className="text-faint text-[11px] uppercase tracking-[0.08em]">Date of issue</span>
        </div>
        <div className="text-right">
          <b className="font-serif block text-base text-ink">{certId}</b>
          <span className="text-faint text-[11px] uppercase tracking-[0.08em]">Credential ID</span>
        </div>
      </div>
    </div>
  )
}

export default function Certificate() {
  const nav = useNavigate()
  const { user, isAdmin } = useApp()
  const [state, setState] = useState(null)

  useEffect(() => {
    if (isAdmin) return
    (async () => {
      const [prog, atts, template] = await Promise.all([Store.getProgress(), Store.getAttempts(), Admin.getCertTemplate()])
      const best = atts.reduce((m, a) => Math.max(m, a.percent || 0), 0)
      const passedExam = atts.some((a) => a.passed)
      const allTopics = prog.size >= TOPICS.length
      const eligible = passedExam && (!REQ_ALL || allTopics)
      let cert = null
      if (eligible) {
        cert = await Store.getCert()
        if (!cert) {
          cert = { id: randId(), full_name: user.name || user.email, percent: Math.round(best), issued_at: new Date().toISOString() }
          await Store.saveCert(cert)
        }
      }
      setState({ prog, passedExam, allTopics, eligible, cert, template })
    })()
  }, [isAdmin])

  if (isAdmin) return <AdminCertManager />

  if (!state) return <div className="py-24 text-center text-muted">Loading…</div>

  if (!state.eligible) {
    const demoCert = {
      full_name: 'Your Name Here',
      percent: THRESH,
      id: 'HIRG-LD-' + new Date().getFullYear() + '-DEMO',
      issued_at: new Date().toISOString(),
    }
    const d = new Date(demoCert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const topicsDone = state.prog.size
    const allTopics = state.allTopics
    const passedExam = state.passedExam

    return (
      <motion.div {...pageMotion} className="py-14 pb-24">
        <div className="wrap grid place-items-center gap-6">
          <div className="w-full max-w-[820px]">
            <Eyebrow>Certificate</Eyebrow>
            <h2 className="serif text-3xl mb-1.5">Your certificate awaits</h2>
            <p className="text-muted text-[16px] mb-6">
              Earn your Hireginie L&amp;D certificate by completing all topics and passing the exam above {THRESH}%.
            </p>

            {/* unlock requirements */}
            <div className="bg-surface border border-line rounded-2xl p-5 shadow-[var(--shadow-soft)] mb-6 flex flex-col gap-3">
              <div className={`flex items-center gap-3 ${allTopics ? 'text-ink' : 'text-muted'}`}>
                <div className={`w-6 h-6 rounded-full grid place-items-center flex-none text-xs font-bold ${allTopics ? 'bg-accent text-white' : 'border border-line bg-surface2'}`}>
                  {allTopics ? '✓' : '1'}
                </div>
                <span>
                  {allTopics ? <s className="opacity-50">Complete all {TOPICS.length} topics</s> : <>Complete all {TOPICS.length} topics <span className="text-faint">({topicsDone}/{TOPICS.length} done)</span></>}
                </span>
                {!allTopics && <Button size="sm" variant="ghost" className="ml-auto" onClick={() => nav('/curriculum')}>Continue</Button>}
              </div>
              <div className={`flex items-center gap-3 ${passedExam ? 'text-ink' : 'text-muted'}`}>
                <div className={`w-6 h-6 rounded-full grid place-items-center flex-none text-xs font-bold ${passedExam ? 'bg-accent text-white' : 'border border-line bg-surface2'}`}>
                  {passedExam ? '✓' : '2'}
                </div>
                <span>
                  {passedExam ? <s className="opacity-50">Pass the exam at {THRESH}% or above</s> : <>Pass the exam at <b>{THRESH}%</b> or above</>}
                </span>
                {!passedExam && allTopics && <Button size="sm" className="ml-auto" onClick={() => nav('/exam')}>Take exam</Button>}
              </div>
            </div>

            {/* blurred demo certificate */}
            <div className="relative select-none">
              <div className="blur-[3px] opacity-60 pointer-events-none">
                <CertCanvas template={state.template} fullName={demoCert.full_name} percent={demoCert.percent} dateStr={d} certId={demoCert.id} />
              </div>

              {/* overlay badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 22 }}
                  className="bg-ink text-white rounded-2xl px-7 py-5 text-center shadow-[var(--shadow-lift)] max-w-[360px] mx-4"
                >
                  <img src="/logo.png" alt="Hireginie" className="h-6 w-auto mx-auto mb-3 invert" />
                  <div className="font-serif text-[17px] mb-1">Receive this L&amp;D certificate</div>
                  <div className="text-white/60 text-[13px] mb-4">
                    by Hireginie - achieve {THRESH}% or more on the final exam to unlock your certificate.
                  </div>
                  {allTopics
                    ? <Button variant="accent" size="sm" onClick={() => nav('/exam')}>Take the exam now</Button>
                    : <Button variant="ghost" size="sm" className="border-white/30 text-white hover:border-white" onClick={() => nav('/curriculum')}>Complete all topics first</Button>
                  }
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const cert = state.cert
  const d = new Date(cert.issued_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap grid place-items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotateX: 8 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="relative w-full max-w-[820px]"
        >
          <CertCanvas template={state.template} fullName={cert.full_name} percent={cert.percent} dateStr={d} certId={cert.id} />
        </motion.div>

        <div className="no-print flex gap-3">
          <Button icon="award" onClick={() => window.print()}>Print / Save as PDF</Button>
          <Button variant="ghost" onClick={() => nav('/dashboard')}>Back to dashboard</Button>
        </div>
      </div>
    </motion.div>
  )
}

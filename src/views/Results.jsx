import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Store } from '../store.js'
import { MODULES } from '../data.js'
import { CONFIG } from '../config.js'
import { ExamState } from '../exam-state.js'
import { Icon } from '../icons.jsx'
import { Button, Ring, Eyebrow, pageMotion } from '../ui.jsx'

const THRESH = CONFIG.CERT_PASS_THRESHOLD || 80

function Confetti() {
  const colors = ['#d2613a', '#2f7d5b', '#6a4c93', '#2a8a8a', '#b9821f']
  const bits = Array.from({ length: 80 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[70]">
      {bits.map((i) => {
        const x = Math.random() * 100
        const delay = Math.random() * 0.4
        const dur = 2.2 + Math.random() * 1.4
        const size = 6 + Math.random() * 8
        return (
          <motion.div
            key={i}
            initial={{ y: -40, x: x + 'vw', rotate: 0, opacity: 1 }}
            animate={{ y: '110vh', rotate: 360 + Math.random() * 360, opacity: [1, 1, 0.8] }}
            transition={{ duration: dur, delay, ease: 'easeIn' }}
            style={{ position: 'absolute', width: size, height: size * 0.6, background: colors[i % colors.length], borderRadius: 2 }}
          />
        )
      })}
    </div>
  )
}

export default function Results() {
  const nav = useNavigate()
  const [state, setState] = useState(ExamState.current)
  const [loading, setLoading] = useState(!ExamState.current)

  useEffect(() => {
    if (ExamState.current) return
    (async () => {
      const atts = await Store.getAttempts()
      if (!atts.length) { nav('/exam'); return }
      const a = atts[0]
      setState({ result: { correct: a.score, total: a.total, pct: Math.round(a.percent), passed: a.passed, byMod: a.by_module || {} }, qs: null })
      setLoading(false)
    })()
  }, [])

  if (loading || !state) return <div className="py-24 text-center text-muted">Loading…</div>

  const r = state.result
  const weak = MODULES.filter((m) => { const b = r.byMod[m.id]; return b && b.t && b.c / b.t < 0.6 })
  const col = r.passed ? 'var(--color-good)' : 'var(--color-bad)'

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      {r.passed && <Confetti />}
      <div className="wrap">
        <Eyebrow>Exam results</Eyebrow>
        <div className="bg-surface border border-line rounded-2xl p-8 shadow-[var(--shadow-soft)] flex gap-9 items-center flex-wrap">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
            <Ring percent={r.pct} color={col} size={150}>
              <div>
                <b className="font-serif text-[38px] leading-none">{r.pct}%</b>
                <span className="block text-xs text-muted">{r.correct}/{r.total}</span>
              </div>
            </Ring>
          </motion.div>
          <div className="flex-1 min-w-[260px]">
            <b className="font-serif text-[26px]">{r.passed ? 'Congratulations - you passed.' : 'Not quite there yet.'}</b>
            <div className="mt-1.5">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold ${r.passed ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'}`}>
                <Icon name={r.passed ? 'check' : 'arrow'} />
                {r.passed ? `Passed · ${THRESH}% required` : `Need ${THRESH}% to certify`}
              </span>
            </div>
            <p className="text-muted text-sm mt-3 max-w-[440px]">
              {r.passed ? 'Mark any remaining topics as learned to unlock your certificate.' : 'Review the modules below and retake the exam - questions are randomised each time.'}
            </p>
            <div className="flex gap-2.5 flex-wrap mt-3">
              <Button variant="ghost" size="sm" onClick={() => { ExamState.current = null; nav('/exam') }}>Retake exam</Button>
              {r.passed && <Button size="sm" iconRight="arrow" onClick={() => nav('/certificate')}>View certificate</Button>}
            </div>
          </div>
        </div>

        <h2 className="font-serif text-[28px] mt-9 mb-5">Performance by module</h2>
        <div className="bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-soft)]">
          {MODULES.map((m, idx) => {
            const b = r.byMod[m.id] || { c: 0, t: 0 }
            const p = b.t ? Math.round((b.c / b.t) * 100) : 0
            const c = p >= 80 ? 'var(--color-good)' : p >= 60 ? 'var(--color-accent)' : 'var(--color-bad)'
            return (
              <div key={m.id} className="grid grid-cols-[140px_1fr_52px] md:grid-cols-[200px_1fr_52px] gap-3.5 items-center my-2.5 text-sm">
                <div>{m.title}</div>
                <div className="h-2.5 bg-line2 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: c }} initial={{ width: 0 }} animate={{ width: p + '%' }} transition={{ delay: 0.1 + idx * 0.08, duration: 0.6 }} />
                </div>
                <div className="text-right font-semibold tabular-nums">{b.t ? p + '%' : '-'}</div>
              </div>
            )
          })}
        </div>

        {weak.length > 0 && (
          <div className="bg-[#fbf3e3] border-l-[3px] border-warn rounded-xl px-4 py-3.5 mt-4.5 text-sm">
            <b>Focus areas:</b> {weak.map((m) => m.title).join(', ')}. Revisit these modules before retaking.
          </div>
        )}

        {state.qs && (
          <>
            <h2 className="font-serif text-[28px] mt-9 mb-5">Answer review</h2>
            <div className="flex flex-col gap-3">
              {state.qs.map((q, n) => {
                const ok = q.picked === q.ref.a
                return (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }}
                    className="border border-line rounded-xl px-5 py-4 bg-surface"
                  >
                    <div className="font-semibold mb-2">{n + 1}. {q.ref.q}</div>
                    <div className={`text-sm flex gap-2 items-start ${ok ? 'text-good' : 'text-bad'}`}>
                      <Icon name={ok ? 'check' : 'arrow'} className="mt-0.5" />
                      Your answer: {q.picked === null ? '(blank)' : q.ref.opts[q.picked]}
                    </div>
                    {!ok && (
                      <div className="text-sm flex gap-2 items-start text-good mt-1">
                        <Icon name="check" className="mt-0.5" /> Correct: {q.ref.opts[q.ref.a]}
                      </div>
                    )}
                    <div className="text-[13.5px] text-muted mt-2 border-t border-dashed border-line pt-2">{q.ref.ex}</div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

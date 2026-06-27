import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Store } from '../store.js'
import { TOPICS } from '../data.js'
import { useApp } from '../app-context.jsx'
import { Button, Ring, Eyebrow, pageMotion } from '../ui.jsx'
import ModulesGrid from './ModulesGrid.jsx'

function CountUp({ to, suffix = '' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf, start
    const dur = 700
    const step = (t) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{n}{suffix}</>
}

export default function Dashboard() {
  const nav = useNavigate()
  const { user } = useApp()
  const [data, setData] = useState(null)

  useEffect(() => {
    (async () => {
      const prog = await Store.getProgress()
      const atts = await Store.getAttempts()
      setData({ prog, atts })
    })()
  }, [])

  if (!data) return <div className="py-24 text-center text-muted">Loading…</div>

  const { prog, atts } = data
  const best = atts.reduce((m, a) => Math.max(m, a.percent || 0), 0)
  const pct = Math.round((prog.size / TOPICS.length) * 100)
  const passed = atts.some((a) => a.passed)

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap">
        <Eyebrow>Your dashboard</Eyebrow>
        <div className="bg-surface border border-line rounded-2xl p-7 md:p-8 shadow-[var(--shadow-soft)] flex gap-7 items-center flex-wrap mb-7">
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
            <Ring percent={pct} size={130}>
              <div>
                <b className="font-serif text-[26px] leading-none"><CountUp to={pct} suffix="%" /></b>
                <span className="block text-[11px] text-muted">complete</span>
              </div>
            </Ring>
          </motion.div>
          <div className="flex-1 min-w-[240px]">
            <h2 className="serif text-[26px] mb-1">Hello, {(user.name || 'there').split(' ')[0]}</h2>
            <p className="text-muted text-[15px] max-w-[460px]">
              {pct === 100 ? 'All topics complete. ' : ''}
              {passed ? 'You have passed the exam.' : 'Work through the modules, then sit the final exam to certify.'}
            </p>
            <div className="flex gap-3.5 flex-wrap mt-2.5">
              {[
                [`${prog.size}/${TOPICS.length}`, 'Topics learned'],
                [atts.length ? Math.round(best) + '%' : '—', 'Best exam score'],
                [passed ? 'Yes' : 'Not yet', 'Certified'],
              ].map(([v, l]) => (
                <div key={l} className="bg-surface2 border border-line2 rounded-xl px-4 py-3 min-w-[120px]">
                  <b className="font-serif text-[22px] block">{v}</b>
                  <span className="text-xs text-muted">{l}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              <Button iconRight="arrow" onClick={() => { const next = TOPICS.find((t) => !prog.has(t.id)) || TOPICS[0]; nav('/topic/' + next.id) }}>
                {prog.size < TOPICS.length ? 'Continue learning' : 'Review topics'}
              </Button>
              <div className="relative group">
                <Button variant="ghost" disabled={pct < 100} onClick={() => nav('/exam')}>Take the final exam</Button>
                {pct < 100 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-ink text-white text-[12px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Complete all {TOPICS.length} topics first ({prog.size}/{TOPICS.length})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <h2 className="font-serif text-[28px] m-0">Curriculum</h2>
          <span className="text-muted text-sm">{TOPICS.length} topics · 6 modules</span>
        </div>
        <ModulesGrid progress={prog} />
      </div>
    </motion.div>
  )
}

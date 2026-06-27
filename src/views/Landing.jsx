import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { MODULES, TOPICS } from '../data.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, pageMotion } from '../ui.jsx'

const MODULE_COLORS = [
  { bg: 'bg-[#fdf3ee]', badge: 'bg-[#f0d5c8] text-[#a04d2a]', dot: 'bg-[#d2613a]' },
  { bg: 'bg-[#eef4fd]', badge: 'bg-[#c8d9f0] text-[#2a4da0]', dot: 'bg-[#3a61d2]' },
  { bg: 'bg-[#f0fdf4]', badge: 'bg-[#c8f0d5] text-[#1a6e39]', dot: 'bg-[#22a355]' },
  { bg: 'bg-[#fdf8ee]', badge: 'bg-[#f0e8c8] text-[#8a6010]', dot: 'bg-[#c8920a]' },
  { bg: 'bg-[#f5eeff]', badge: 'bg-[#e0c8f5] text-[#6a2aa0]', dot: 'bg-[#9b4dd2]' },
  { bg: 'bg-[#fff0f3]', badge: 'bg-[#f5c8d0] text-[#a02a40]', dot: 'bg-[#d23a55]' },
]

function ModuleAccordion() {
  const [open, setOpen] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      {MODULES.map((m, i) => {
        const ts = TOPICS.filter((t) => t.m === m.id)
        const isOpen = open === i
        const c = MODULE_COLORS[i] || MODULE_COLORS[0]
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 240, damping: 26 }}
            className={`rounded-2xl border border-line overflow-hidden transition-shadow ${isOpen ? 'shadow-[var(--shadow-soft)]' : ''}`}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${isOpen ? c.bg : 'bg-surface hover:bg-surface2'}`}
            >
              <div className={`w-9 h-9 rounded-xl grid place-items-center flex-none text-[13px] font-bold ${c.badge}`}>
                {m.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px] leading-snug">{m.title}</div>
                <div className="text-[13px] text-muted mt-0.5">{m.blurb}</div>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <span className="hidden sm:block text-[12px] text-muted whitespace-nowrap">{ts.length} topics</span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-muted flex-none"
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pt-1 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-0.5 bg-surface">
                    {ts.map((t, ti) => (
                      <div key={t.id} className="flex items-center gap-3 py-2 border-b border-line/60 last:border-0 sm:even:border-0">
                        <span className={`w-5 h-5 rounded-full grid place-items-center flex-none text-[10px] font-bold text-white ${c.dot}`}>
                          {ti + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[14px] text-ink">{t.title}</span>
                        </div>
                        <span className="text-[11px] text-faint flex-none">{t.read} min</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

const STATS = [
  ['24', 'Topics'],
  ['6', 'Modules'],
  [String(CONFIG.EXAM_QUESTION_COUNT), 'Exam questions'],
  [CONFIG.CERT_PASS_THRESHOLD + '%', 'To certify'],
]

export default function Landing() {
  const nav = useNavigate()
  const { user } = useApp()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap">
        {/* hero */}
        <div className="relative overflow-hidden rounded-[26px] px-8 py-16 md:px-14 md:py-20 text-[#f3efe6] bg-navy">
          <motion.div
            className="float-slow absolute -right-24 -top-24 w-[380px] h-[380px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(210,97,58,.42), transparent 65%)' }}
          />
          <div
            className="absolute -left-20 bottom-[-120px] w-[320px] h-[320px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(106,76,147,.4), transparent 65%)' }}
          />
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase font-semibold text-accent mb-5"
            >
              <Icon name="spark" /> {CONFIG.BRAND} · {CONFIG.PROGRAM_NAME}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="font-serif font-semibold text-4xl md:text-[52px] leading-[1.05] max-w-[680px] mb-5"
            >
              Become a confident Learning &amp; Development professional.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-[#cbc7bd] text-lg max-w-[560px] mb-8"
            >
              A complete, self-paced foundation in modern L&amp;D — 24 topics across 6 modules,
              a scenario-based certification exam, and a certificate to prove it.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
              className="flex gap-3.5 flex-wrap"
            >
              <Button variant="accent" size="lg" iconRight="arrow" onClick={() => nav('/signup')}>
                Create your account
              </Button>
              <Button variant="ghost" size="lg" className="!text-[#f3efe6] !border-white/25 hover:!border-white/60" onClick={() => nav('/login')}>
                I already have an account
              </Button>
            </motion.div>

            <div className="flex gap-10 flex-wrap mt-12">
              {STATS.map(([n, l], i) => (
                <motion.div key={l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}>
                  <b className="font-serif text-3xl block text-white">{n}</b>
                  <span className="text-[#a9a499] text-[13px]">{l}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* modules */}
        <div className="mt-14 mb-2">
          <h2 className="font-serif text-3xl mb-1">There are {MODULES.length} modules in this course</h2>
          <p className="text-muted text-[15px] mb-7">Six modules building from foundations to strategy — {TOPICS.length} topics in total.</p>
          <ModuleAccordion />
        </div>
      </div>
    </motion.div>
  )
}

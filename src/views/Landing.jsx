import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { MODULES, TOPICS } from '../data.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, pageMotion } from '../ui.jsx'

function ModuleAccordion() {
  const [open, setOpen] = useState(0)
  return (
    <div className="border border-line rounded-2xl overflow-hidden divide-y divide-line">
      {MODULES.map((m, i) => {
        const ts = TOPICS.filter((t) => t.m === m.id)
        const isOpen = open === i
        return (
          <div key={m.id}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center gap-4 px-6 py-4 text-left bg-surface hover:bg-surface2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-accent-soft text-accent-d grid place-items-center flex-none text-sm font-semibold">
                {m.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px]">{m.title}</div>
                <div className="text-[13px] text-muted">{ts.length} topics</div>
              </div>
              <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-muted flex-none"
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden bg-bg"
                >
                  <div className="px-6 py-3 grid sm:grid-cols-2 gap-x-8 gap-y-1">
                    {ts.map((t) => (
                      <div key={t.id} className="flex items-center gap-2.5 py-1.5 text-[14px] text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-none" />
                        {t.title}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

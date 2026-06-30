import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { MODULES, TOPICS } from '../data.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, pageMotion } from '../ui.jsx'

const MODULE_PALETTE = [
  { accent: '#d2613a', light: '#fdf3ee', text: '#a04d2a' },
  { accent: '#3a61d2', light: '#eef4fd', text: '#2a4da0' },
  { accent: '#22a355', light: '#f0fdf4', text: '#1a6e39' },
  { accent: '#c8920a', light: '#fdf8ee', text: '#8a6010' },
  { accent: '#9b4dd2', light: '#f5eeff', text: '#6a2aa0' },
  { accent: '#d23a55', light: '#fff0f3', text: '#a02a40' },
]

function ModuleAccordion() {
  const [open, setOpen] = useState(-1)
  return (
    <div className="relative">
      {/* connecting line */}
      <div className="absolute left-[27px] top-10 bottom-10 w-[2px] bg-line hidden md:block" />

      <div className="flex flex-col gap-4">
        {MODULES.map((m, i) => {
          const ts = TOPICS.filter((t) => t.m === m.id)
          const isOpen = open === i
          const p = MODULE_PALETTE[i] || MODULE_PALETTE[0]
          const totalMins = ts.reduce((s, t) => s + (t.read || 0), 0)

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 240, damping: 26 }}
              className="flex gap-4 items-start"
            >
              {/* step badge */}
              <div
                className="relative z-10 w-14 h-14 rounded-2xl grid place-items-center flex-none shadow-[0_2px_8px_rgba(0,0,0,0.12)] hidden md:grid"
                style={{ background: p.accent }}
              >
                <span className="text-white font-bold text-lg leading-none">{m.n}</span>
              </div>

              {/* card */}
              <div
                className="flex-1 rounded-2xl border overflow-hidden transition-shadow"
                style={{ borderColor: isOpen ? p.accent + '60' : undefined, boxShadow: isOpen ? `0 4px 20px ${p.accent}18` : undefined }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-start gap-4 px-5 py-4 text-left transition-colors hover:brightness-[0.98]"
                  style={{ background: p.light }}
                >
                  {/* mobile number */}
                  <div
                    className="w-8 h-8 rounded-xl grid place-items-center flex-none text-[13px] font-bold text-white md:hidden"
                    style={{ background: p.accent }}
                  >
                    {m.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: p.text }}>
                        Module {m.n}
                      </span>
                      <span className="text-faint text-[11px]">·</span>
                      <span className="text-[11px] text-faint">{ts.length} topics · ~{totalMins} min</span>
                    </div>
                    <div className="font-semibold text-[17px] leading-snug">{m.title}</div>
                    <div className="text-[13px] text-muted mt-1 leading-relaxed">{m.blurb}</div>
                  </div>
                  <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-none mt-1" style={{ color: isOpen ? p.accent : undefined }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: 'easeInOut' }}
                      className="overflow-hidden bg-surface"
                    >
                      <div
                        className="h-[2px] w-full"
                        style={{ background: `linear-gradient(90deg, ${p.accent}, transparent)` }}
                      />
                      <div className="px-5 py-4 grid sm:grid-cols-2 gap-2">
                        {ts.map((t, ti) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-line bg-bg"
                          >
                            <span
                              className="w-6 h-6 rounded-lg grid place-items-center flex-none text-[11px] font-bold text-white"
                              style={{ background: p.accent + 'cc' }}
                            >
                              {ti + 1}
                            </span>
                            <span className="flex-1 text-[13.5px] text-ink">{t.title}</span>
                            <span className="text-[11px] text-faint flex-none">{t.read}m</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
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
              A complete, self-paced foundation in modern L&amp;D - 24 topics across 6 modules,
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
          <p className="text-muted text-[15px] mb-7">Six modules building from foundations to strategy - {TOPICS.length} topics in total.</p>
          <ModuleAccordion />
        </div>
      </div>
    </motion.div>
  )
}

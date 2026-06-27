import { motion } from 'framer-motion'
import { useNavigate, Navigate } from 'react-router-dom'
import { MODULES, TOPICS } from '../data.js'
import { CONFIG } from '../config.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, pageMotion } from '../ui.jsx'

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
        <div className="flex items-baseline justify-between gap-4 flex-wrap mt-14 mb-6">
          <h2 className="font-serif text-3xl m-0">What you will learn</h2>
          <span className="text-muted text-[15px]">Six modules, building from foundations to strategy.</span>
        </div>
        <div className="grid gap-[18px] md:grid-cols-3">
          {MODULES.map((m, i) => {
            const ts = TOPICS.filter((t) => t.m === m.id)
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: (i % 3) * 0.08, type: 'spring', stiffness: 220, damping: 24 }}
                whileHover={{ y: -6 }}
                className="bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-d grid place-items-center">
                    <Icon name={ts[0].icon} className="!w-5 !h-5" />
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.1em] uppercase text-faint">Module {m.n}</div>
                    <h3 className="m-0 text-[19px]">{m.title}</h3>
                  </div>
                </div>
                <p className="text-muted text-sm mt-2 mb-4">{m.blurb}</p>
                <div className="flex flex-col gap-0.5">
                  {ts.map((t) => (
                    <div key={t.id} className="flex items-center gap-2.5 px-2.5 py-1.5 text-[14px]">
                      <span className="w-2 h-2 rounded-full border-[1.6px] border-line flex-none" />
                      <span>{t.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

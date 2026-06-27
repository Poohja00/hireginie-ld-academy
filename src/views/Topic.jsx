import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Store } from '../store.js'
import { TOPICS, MODULES } from '../data.js'
import { useApp } from '../app-context.jsx'
import { Icon } from '../icons.jsx'
import { Button, pageMotion } from '../ui.jsx'

const topicById = (id) => TOPICS.find((t) => t.id === id)
const moduleById = (id) => MODULES.find((m) => m.id === id)

export default function Topic() {
  const { id } = useParams()
  const nav = useNavigate()
  const { showToast } = useApp()
  const [progress, setProgress] = useState(null)
  const t = topicById(id)

  useEffect(() => { Store.getProgress().then(setProgress) }, [])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [id])

  if (!t) { nav('/dashboard'); return null }
  if (!progress) return <div className="py-24 text-center text-muted">Loading…</div>

  const learned = progress.has(id)
  const mod = moduleById(t.m)
  const idx = TOPICS.findIndex((x) => x.id === id)
  const prev = TOPICS[idx - 1]
  const next = TOPICS[idx + 1]
  const modTopics = TOPICS.filter((x) => x.m === t.m)

  async function toggleLearned() {
    const nowLearned = !learned
    await Store.setLearned(id, nowLearned)
    const np = new Set(progress); nowLearned ? np.add(id) : np.delete(id)
    setProgress(np)
    showToast(nowLearned ? 'Marked as learned ✓' : 'Unmarked')
    if (nowLearned && next) setTimeout(() => nav('/topic/' + next.id), 380)
  }

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap">
        <div className="grid lg:grid-cols-[230px_1fr] gap-10 items-start">
          {/* TOC */}
          <div className="lg:sticky lg:top-[90px]">
            <div onClick={() => nav('/dashboard')} className="flex items-center gap-1.5 text-[13px] text-muted cursor-pointer mb-4 hover:text-ink">
              <Icon name="back" /> Back to dashboard
            </div>
            <div className="text-[12px] uppercase tracking-[0.1em] text-faint mb-2">Module {mod.n}</div>
            {modTopics.map((x) => {
              const done = progress.has(x.id)
              const on = x.id === id
              return (
                <div
                  key={x.id}
                  onClick={() => nav('/topic/' + x.id)}
                  className={`flex items-center gap-2 text-[13px] px-2.5 py-1.5 rounded-lg cursor-pointer mb-0.5 ${
                    on ? 'bg-surface text-ink font-semibold shadow-[var(--shadow-soft)]' : done ? 'text-good hover:bg-surface' : 'text-muted hover:bg-surface'
                  }`}
                >
                  {done ? <Icon name="check" className="!w-4 !h-4" /> : <span className="w-4" />}
                  {x.title}
                </div>
              )
            })}
          </div>

          {/* article */}
          <motion.article
            key={id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="prose-lda max-w-[760px]"
          >
            <div className="flex items-center gap-2 text-accent-d font-semibold text-[13px] uppercase tracking-[0.1em]">
              <Icon name={t.icon} /> {mod.title}
            </div>
            <h1 className="font-serif text-[34px] mt-1 mb-2">{t.title}</h1>
            <div className="flex gap-3.5 items-center text-[13px] text-muted mb-2">
              <span className="inline-flex items-center gap-1.5"><Icon name="clock" /> {t.read} min read</span>
              <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-accent-soft text-accent-d">{t.tag}</span>
            </div>

            {t.sec.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                className="mt-7"
              >
                <h4 className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-faint mb-2.5 before:content-[''] before:w-[18px] before:h-[1.5px] before:bg-accent">
                  {s.h}
                </h4>
                <div dangerouslySetInnerHTML={{ __html: s.b }} />
              </motion.div>
            ))}

            <div className="bg-navy text-[#f3efe6] rounded-2xl px-6 py-5 mt-8">
              <span className="block text-[11px] tracking-[0.14em] uppercase text-accent mb-1.5">Key takeaway</span>
              {t.key}
            </div>

            <div className="flex justify-between items-center gap-3.5 flex-wrap mt-9">
              <Button variant={learned ? 'ghost' : 'accent'} icon={learned ? 'check' : undefined} onClick={toggleLearned}>
                {learned ? 'Marked as learned' : 'Mark as learned'}
              </Button>
              <div className="flex gap-2.5">
                {prev && <Button variant="ghost" size="sm" onClick={() => nav('/topic/' + prev.id)}>Previous</Button>}
                {next
                  ? <Button size="sm" iconRight="arrow" onClick={() => nav('/topic/' + next.id)}>Next topic</Button>
                  : <Button size="sm" onClick={() => nav('/dashboard')}>Finish</Button>}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </motion.div>
  )
}

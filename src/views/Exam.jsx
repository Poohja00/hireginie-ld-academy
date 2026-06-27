import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Store } from '../store.js'
import { QUIZ, MODULES, TOPICS } from '../data.js'
import { CONFIG } from '../config.js'
import { ExamState, shuffle } from '../exam-state.js'
import { Icon } from '../icons.jsx'
import { Button, Eyebrow, pageMotion } from '../ui.jsx'

const QN = CONFIG.EXAM_QUESTION_COUNT || 25
const THRESH = CONFIG.CERT_PASS_THRESHOLD || 80
const TMIN = CONFIG.EXAM_TIME_MINUTES || 0
const moduleById = (id) => MODULES.find((m) => m.id === id)

export default function Exam() {
  const nav = useNavigate()
  const [exam, setExam] = useState(null)
  const [i, setI] = useState(0)
  const [, force] = useState(0)
  const [left, setLeft] = useState(TMIN * 60000)
  const endRef = useRef(0)
  const [prog, setProg] = useState(null)

  useEffect(() => {
    Store.getProgress().then(setProg)
  }, [])

  // timer
  useEffect(() => {
    if (!exam || !TMIN) return
    const id = setInterval(() => {
      const rem = Math.max(0, endRef.current - Date.now())
      setLeft(rem)
      if (rem <= 0) { clearInterval(id); finish(exam) }
    }, 250)
    return () => clearInterval(id)
  }, [exam])

  function start() {
    const qs = shuffle(QUIZ).slice(0, Math.min(QN, QUIZ.length)).map((q) => ({
      ref: q, order: shuffle([0, 1, 2, 3]), picked: null,
    }))
    endRef.current = Date.now() + TMIN * 60000
    setLeft(TMIN * 60000)
    setI(0)
    setExam({ qs })
  }

  async function finish(ex) {
    const byMod = {}; MODULES.forEach((m) => (byMod[m.id] = { c: 0, t: 0 }))
    let correct = 0
    ex.qs.forEach((q) => {
      const ok = q.picked === q.ref.a
      if (ok) correct++
      const b = byMod[q.ref.m]; b.t++; if (ok) b.c++
    })
    const pct = Math.round((correct / ex.qs.length) * 100)
    const passed = pct >= THRESH
    await Store.saveAttempt({ score: correct, total: ex.qs.length, percent: pct, passed, by_module: byMod })
    ExamState.current = { result: { correct, total: ex.qs.length, pct, passed, byMod }, qs: ex.qs }
    nav('/results')
  }

  // intro screen
  if (!exam) {
    const allDone = prog && prog.size >= TOPICS.length
    const topicsDone = prog ? prog.size : 0
    return (
      <motion.div {...pageMotion} className="py-14 pb-24">
        <div className="wrap max-w-[720px]">
          <Eyebrow>Certification exam</Eyebrow>
          <h2 className="serif text-3xl mb-2.5">Final Exam</h2>
          <p className="text-muted text-[17px]">
            {QN} scenario-based questions drawn at random from the full bank, covering all six modules.
            You need <b>{THRESH}%</b> to certify{TMIN ? <>, and you have <b>{TMIN} minutes</b></> : ''}.
            You will get a full breakdown and explanations at the end.
          </p>

          {!prog ? null : !allDone ? (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-soft)] mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-warn/10 border border-warn/30 grid place-items-center flex-none">
                  <Icon name="clock" />
                </div>
                <div>
                  <div className="font-semibold text-ink">Exam locked</div>
                  <div className="text-muted text-[13px]">Complete all topics to unlock the final exam</div>
                </div>
              </div>
              <div className="h-2 bg-line2 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-accent-d"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((topicsDone / TOPICS.length) * 100)}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="text-[13px] text-muted mb-4">{topicsDone} of {TOPICS.length} topics completed</div>
              <Button iconRight="arrow" onClick={() => nav('/curriculum')}>Continue learning</Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-soft)] mt-6">
              <div className="grid grid-cols-3 gap-3.5">
                {[[QN, 'Questions'], [THRESH + '%', 'Pass mark'], [TMIN ? TMIN + ' min' : 'None', 'Time limit']].map(([v, l]) => (
                  <div key={l} className="bg-surface2 border border-line2 rounded-xl px-4 py-3 text-center">
                    <b className="font-serif text-[22px] block">{v}</b>
                    <span className="text-xs text-muted">{l}</span>
                  </div>
                ))}
              </div>
              <Button variant="accent" iconRight="arrow" className="mt-5" onClick={start}>Begin exam</Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  const q = exam.qs[i]
  const ref = q.ref
  const secs = Math.floor(left / 1000)
  const timeStr = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`
  const lastQ = i === exam.qs.length - 1

  function pick(oi) { q.picked = oi; force((n) => n + 1) }
  function nextQ() {
    if (!lastQ) { setI(i + 1); return }
    const un = exam.qs.filter((x) => x.picked === null).length
    if (un > 0 && !confirm(`${un} question(s) are unanswered and will be marked wrong. Submit anyway?`)) return
    finish(exam)
  }

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-2">
          <Eyebrow className="!mb-0">Final Exam</Eyebrow>
          {TMIN > 0 && (
            <div className={`font-serif text-[22px] border rounded-xl px-4 py-1.5 ${left < 60000 ? 'text-bad border-bad' : 'border-line bg-surface'}`}>
              {timeStr}
            </div>
          )}
        </div>
        <div className="h-1.5 bg-line2 rounded-full overflow-hidden mb-1.5">
          <motion.div className="h-full bg-gradient-to-r from-accent to-accent-d" animate={{ width: (i / exam.qs.length) * 100 + '%' }} transition={{ duration: 0.3 }} />
        </div>
        <div className="text-center text-muted text-[13px] mb-4">Question {i + 1} of {exam.qs.length}</div>

        <div className="max-w-[760px] mx-auto">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-surface border border-line rounded-2xl p-7 md:p-8 shadow-[var(--shadow-soft)]"
          >
            <div className="text-xs uppercase tracking-[0.1em] text-faint">{moduleById(ref.m).title}</div>
            <div className="font-serif text-[20px] leading-snug my-2 mb-5">{ref.q}</div>
            {q.order.map((oi, k) => {
              const sel = q.picked === oi
              return (
                <motion.div
                  key={oi}
                  whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}
                  onClick={() => pick(oi)}
                  className={`flex items-start gap-3 border rounded-xl px-4 py-3.5 mb-2.5 cursor-pointer transition-colors ${
                    sel ? 'border-ink bg-surface2 ring-1 ring-ink' : 'border-line hover:border-accent hover:bg-surface2'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg grid place-items-center text-xs font-bold flex-none ${sel ? 'bg-ink text-white' : 'border border-line text-muted'}`}>
                    {'ABCD'[k]}
                  </div>
                  <div>{ref.opts[oi]}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <div className="flex justify-between max-w-[760px] mx-auto mt-5 gap-3">
          <Button variant="ghost" disabled={i === 0} onClick={() => setI(Math.max(0, i - 1))}>Previous</Button>
          <Button variant={lastQ ? 'accent' : 'solid'} onClick={nextQ}>{lastQ ? 'Submit exam' : 'Next'}</Button>
        </div>
      </div>
    </motion.div>
  )
}

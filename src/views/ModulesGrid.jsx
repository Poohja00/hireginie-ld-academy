import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MODULES, TOPICS } from '../data.js'
import { Icon } from '../icons.jsx'

export function moduleUnlocked(moduleId, progressSet) {
  const idx = MODULES.findIndex((m) => m.id === moduleId)
  if (idx === 0) return true
  const prev = MODULES[idx - 1]
  return TOPICS.filter((t) => t.m === prev.id).every((t) => progressSet.has(t.id))
}

export default function ModulesGrid({ progress }) {
  const nav = useNavigate()
  return (
    <div className="grid gap-[18px] md:grid-cols-2">
      {MODULES.map((m, i) => {
        const ts = TOPICS.filter((t) => t.m === m.id)
        const done = ts.filter((t) => progress.has(t.id)).length
        const pct = Math.round((done / ts.length) * 100)
        const unlocked = moduleUnlocked(m.id, progress)
        const prevMod = i > 0 ? MODULES[i - 1] : null

        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i % 2) * 0.06, type: 'spring', stiffness: 220, damping: 24 }}
            className={`bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-soft)] ${!unlocked ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${unlocked ? 'bg-accent-soft text-accent-d' : 'bg-surface2 text-faint'}`}>
                {unlocked
                  ? <Icon name={ts[0].icon} className="!w-5 !h-5" />
                  : <Icon name="lock" className="!w-4 !h-4" />}
              </div>
              <div className="flex-1">
                <div className="text-xs tracking-[0.1em] uppercase text-faint">Module {m.n} · {done}/{ts.length}</div>
                <h3 className="m-0 text-[19px]">{m.title}</h3>
              </div>
              {unlocked
                ? <div className="text-[13px] font-semibold text-accent-d tabular-nums">{pct}%</div>
                : <Icon name="lock" className="text-faint !w-4 !h-4" />}
            </div>

            <div className="h-1.5 bg-line2 rounded-full overflow-hidden mt-2 mb-3">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-d"
                initial={{ width: 0 }}
                whileInView={{ width: pct + '%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>

            {!unlocked ? (
              <p className="text-faint text-sm mb-4 flex items-center gap-1.5">
                <Icon name="lock" className="!w-3.5 !h-3.5 flex-none" />
                Complete <b className="text-muted">{prevMod?.title}</b> to unlock · {done}/{ts.length} topics done
              </p>
            ) : (
              <p className="text-muted text-sm mb-4">{m.blurb}</p>
            )}

            <div className="flex flex-col gap-0.5">
              {ts.map((t) => {
                const isDone = progress.has(t.id)
                if (!unlocked) {
                  return (
                    <div key={t.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[14.5px] text-faint cursor-default">
                      <span className="w-2.5 h-2.5 rounded-full flex-none border-[1.6px] border-line2" />
                      <span>{t.title}</span>
                    </div>
                  )
                }
                return (
                  <motion.div
                    key={t.id}
                    whileHover={{ x: 4 }}
                    onClick={() => nav('/topic/' + t.id)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[14.5px] hover:bg-surface2 group"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full flex-none border-[1.6px] ${isDone ? 'bg-good border-good' : 'border-line'}`} />
                    <span className={isDone ? 'text-muted' : ''}>{t.title}</span>
                    {isDone && <Icon name="check" className="ml-auto text-good !w-4 !h-4" />}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

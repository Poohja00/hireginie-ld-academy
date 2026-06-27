import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MODULES, TOPICS } from '../data.js'
import { Icon } from '../icons.jsx'

export default function ModulesGrid({ progress }) {
  const nav = useNavigate()
  return (
    <div className="grid gap-[18px] md:grid-cols-2">
      {MODULES.map((m, i) => {
        const ts = TOPICS.filter((t) => t.m === m.id)
        const done = ts.filter((t) => progress.has(t.id)).length
        const pct = Math.round((done / ts.length) * 100)
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i % 2) * 0.06, type: 'spring', stiffness: 220, damping: 24 }}
            className="bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-d grid place-items-center">
                <Icon name={ts[0].icon} className="!w-5 !h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs tracking-[0.1em] uppercase text-faint">Module {m.n} · {done}/{ts.length}</div>
                <h3 className="m-0 text-[19px]">{m.title}</h3>
              </div>
              <div className="text-[13px] font-semibold text-accent-d tabular-nums">{pct}%</div>
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
            <p className="text-muted text-sm mb-4">{m.blurb}</p>
            <div className="flex flex-col gap-0.5">
              {ts.map((t) => {
                const isDone = progress.has(t.id)
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

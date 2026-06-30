import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Store } from '../store.js'
import { useApp } from '../app-context.jsx'
import { Eyebrow, pageMotion } from '../ui.jsx'
import ModulesGrid from './ModulesGrid.jsx'

export default function Curriculum() {
  const { isAdmin } = useApp()
  const [prog, setProg] = useState(null)
  useEffect(() => { Store.getProgress().then(setProg) }, [])
  if (!prog) return <div className="py-24 text-center text-muted">Loading…</div>

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap">
        <Eyebrow>Curriculum</Eyebrow>
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <h2 className="font-serif text-[28px] m-0">All topics</h2>
          <span className="text-muted text-sm">{isAdmin ? 'Read-only overview of the course content.' : 'Click any topic to start.'}</span>
        </div>
        <ModulesGrid progress={prog} adminMode={isAdmin} />
      </div>
    </motion.div>
  )
}

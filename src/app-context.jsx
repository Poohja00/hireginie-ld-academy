import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Store } from './store.js'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children, initialUser, initialProfile }) {
  const [user, setUser] = useState(initialUser)
  const [profile, setProfile] = useState(initialProfile || null)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const refreshUser = useCallback(() => {
    setUser(Store.user ? { ...Store.user } : null)
    setProfile(Store.profile ? { ...Store.profile } : null)
  }, [])

  return (
    <Ctx.Provider value={{ user, setUser, profile, isAdmin: !!(profile && profile.is_admin), refreshUser, showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 24, x: '-50%' }}
            className="fixed bottom-7 left-1/2 z-[80] bg-ink text-white px-5 py-3 rounded-xl text-sm shadow-[var(--shadow-lift)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}

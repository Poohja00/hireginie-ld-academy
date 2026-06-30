import { Routes, Route, useLocation, useNavigate, NavLink, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, PREVIEW } from './store.js'
import { CONFIG } from './config.js'
import { useApp } from './app-context.jsx'
import { Icon } from './icons.jsx'

import Landing from './views/Landing.jsx'
import Auth from './views/Auth.jsx'
import Dashboard from './views/Dashboard.jsx'
import Curriculum from './views/Curriculum.jsx'
import Topic from './views/Topic.jsx'
import Exam from './views/Exam.jsx'
import Results from './views/Results.jsx'
import Certificate from './views/Certificate.jsx'
import AdminDashboard from './views/AdminDashboard.jsx'
import AdminLogin from './views/AdminLogin.jsx'
import AccountSettings from './views/Account.jsx'

function initials(n, e) {
  n = n || e || ''
  const p = n.trim().split(/\s+/)
  return ((p[0] || '')[0] || '') + ((p[1] || '')[0] || '') || (e || '?')[0].toUpperCase()
}

const NAV = [
  ['/dashboard', 'Dashboard'],
  ['/curriculum', 'Curriculum'],
  ['/exam', 'Final Exam'],
  ['/certificate', 'Certificate'],
]

const ADMIN_NAV = [
  ['/curriculum', 'Curriculum'],
  ['/certificate', 'Certificate'],
]

function Header() {
  const { user, profile, isAdmin, refreshUser } = useApp()
  const nav = useNavigate()

  async function signOut() {
    await Store.signOut()
    refreshUser()
    nav('/')
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/80 border-b border-line">
      <div className="wrap flex items-center gap-6 h-[66px]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => nav('/')}>
          <motion.img
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            src="/logo.png"
            alt="Hireginie"
            className="h-7 w-auto"
          />
          <span className="hidden sm:block h-6 w-px bg-line" />
          <span className="hidden sm:block text-[12px] text-muted uppercase tracking-[0.12em] font-semibold">L&amp;D Academy</span>
        </div>

        {user && (
          <nav className="flex gap-1.5 ml-auto">
            {(isAdmin ? ADMIN_NAV : NAV).map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-surface rounded-lg shadow-[var(--shadow-soft)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-accent-d hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-surface rounded-lg shadow-[var(--shadow-soft)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon name="shield" className="relative !w-3.5 !h-3.5" />
                    <span className="relative">Admin</span>
                  </>
                )}
              </NavLink>
            )}
          </nav>
        )}

        <div className={`flex items-center gap-2.5 ${user ? '' : 'ml-auto'}`}>
          {PREVIEW && (
            <span className="text-[11px] text-warn border border-line bg-surface px-2.5 py-1 rounded-full whitespace-nowrap">
              Preview mode
            </span>
          )}
          {user && (
            <>
              <button
                onClick={() => nav('/account')}
                title="Account settings"
                className="w-8 h-8 rounded-full bg-accent-soft text-accent-d grid place-items-center font-semibold text-[13px] overflow-hidden hover:ring-2 hover:ring-accent/30 transition-shadow"
              >
                {profile && profile.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  : initials(user.name, user.email)}
              </button>
              <button onClick={signOut} className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink px-2 py-1.5">
                <Icon name="logout" /> Sign out
              </button>
            </>
          )}
          {!user && (
            <button
              onClick={() => nav('/admin-login')}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-d border border-accent/30 hover:border-accent hover:bg-accent-soft px-3.5 py-2 rounded-lg transition-colors"
            >
              <Icon name="shield" className="!w-3.5 !h-3.5" /> Login as admin
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function Protected({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function LearnerOnly({ children }) {
  const { user, isAdmin } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/admin" replace />
  return children
}

function AdminProtected({ children }) {
  const { user, isAdmin } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const location = useLocation()
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/dashboard" element={<LearnerOnly><Dashboard /></LearnerOnly>} />
            <Route path="/curriculum" element={<Protected><Curriculum /></Protected>} />
            <Route path="/topic/:id" element={<LearnerOnly><Topic /></LearnerOnly>} />
            <Route path="/exam" element={<LearnerOnly><Exam /></LearnerOnly>} />
            <Route path="/results" element={<LearnerOnly><Results /></LearnerOnly>} />
            <Route path="/certificate" element={<Protected><Certificate /></Protected>} />
            <Route path="/account" element={<Protected><AccountSettings /></Protected>} />
            <Route path="/admin" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </main>
      <footer className="border-t border-line text-faint text-[13px] py-7 text-center">
        <div className="wrap">
          {CONFIG.BRAND} L&amp;D Academy · A self-paced learning platform for the L&amp;D function.
        </div>
      </footer>
    </div>
  )
}

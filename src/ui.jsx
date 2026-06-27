import { motion } from 'framer-motion'
import { Icon } from './icons.jsx'

export function Button({ variant = 'solid', size = 'md', icon, iconRight, children, className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl cursor-pointer select-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const sizes = { md: 'px-5 py-2.5 text-sm', sm: 'px-3.5 py-2 text-[13px]', lg: 'px-6 py-3 text-[15px]' }
  const variants = {
    solid: 'bg-ink text-white border border-ink hover:bg-navy',
    accent: 'text-white border-0 bg-gradient-to-br from-accent to-accent-d shadow-[0_8px_24px_-8px_rgba(210,97,58,.6)] hover:shadow-[0_12px_30px_-8px_rgba(210,97,58,.7)]',
    ghost: 'bg-transparent text-ink border border-line hover:border-ink',
  }
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} />}
      {children}
      {iconRight && <Icon name={iconRight} />}
    </motion.button>
  )
}

export function Card({ children, className = '', hover = false, ...rest }) {
  const Comp = hover ? motion.div : 'div'
  const hoverProps = hover
    ? { whileHover: { y: -4, boxShadow: 'var(--shadow-lift)' }, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    : {}
  return (
    <Comp
      className={`bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-soft)] ${className}`}
      {...hoverProps}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function Eyebrow({ children, className = '' }) {
  return <div className={`text-xs tracking-[0.16em] uppercase text-accent-d font-semibold mb-3 ${className}`}>{children}</div>
}

export function Ring({ percent, color, size = 120, children }) {
  const inner = size - 28
  return (
    <div
      className="ring rounded-full grid place-items-center flex-none"
      style={{ '--p': percent, '--ring-c': color, width: size, height: size }}
    >
      <div className="rounded-full bg-surface grid place-items-center text-center" style={{ width: inner, height: inner }}>
        {children}
      </div>
    </div>
  )
}

// shared page transition wrapper
// per-view entrance only; page-level exit is handled by the App route wrapper
export const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
}

export function stagger(i, base = 0.05) {
  return { delay: i * base }
}

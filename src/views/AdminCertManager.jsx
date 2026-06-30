import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Admin } from '../admin.js'
import { useApp } from '../app-context.jsx'
import { Button, Eyebrow, pageMotion } from '../ui.jsx'

export default function AdminCertManager() {
  const { showToast } = useApp()
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState({ image_url: '', name_top: 45, name_left: 50, font_size: 42, color: '#1a1a1a' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Admin.getCertTemplate().then((t) => {
      if (t) setForm({ image_url: t.image_url || '', name_top: t.name_top, name_left: t.name_left, font_size: t.font_size, color: t.color })
      setLoaded(true)
    })
  }, [])

  async function save() {
    setBusy(true)
    try {
      await Admin.saveCertTemplate(form)
      showToast('Certificate template saved')
    } catch (e) {
      showToast(e.message || 'Failed to save template')
    }
    setBusy(false)
  }

  if (!loaded) return <div className="py-24 text-center text-muted">Loading…</div>

  const field = 'w-full px-3.5 py-2.5 border border-line rounded-xl text-[14px] bg-surface2 focus:outline-none focus:border-accent'

  return (
    <motion.div {...pageMotion} className="py-14 pb-24">
      <div className="wrap" style={{ maxWidth: 1040 }}>
        <Eyebrow>Admin</Eyebrow>
        <h2 className="font-serif text-3xl mb-1">Certificate template</h2>
        <p className="text-muted text-[15px] mb-7 max-w-[640px]">
          Upload your certificate design anywhere that gives you a public image URL (Canva export, Google Drive public link, etc.),
          paste it below, and position where the learner's name should sit. Every certificate generates automatically from this one template -
          no per-learner uploads needed.
        </p>

        <div className="grid lg:grid-cols-[360px_1fr] gap-7 items-start">
          <div className="bg-surface border border-line rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <label className="block text-[13px] text-muted mb-1.5">Certificate background image URL</label>
              <input
                className={field}
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Name - top %</label>
                <input
                  type="number" min="0" max="100" className={field}
                  value={form.name_top} onChange={(e) => setForm({ ...form, name_top: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Name - left %</label>
                <input
                  type="number" min="0" max="100" className={field}
                  value={form.name_left} onChange={(e) => setForm({ ...form, name_left: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Font size (px)</label>
                <input
                  type="number" min="10" max="140" className={field}
                  value={form.font_size} onChange={(e) => setForm({ ...form, font_size: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[13px] text-muted mb-1.5">Text color</label>
                <input
                  type="color" className="w-full h-[42px] border border-line rounded-xl bg-surface2 cursor-pointer"
                  value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save template'}</Button>
            {!form.image_url && (
              <p className="text-[12.5px] text-faint">
                No template set yet - learners see the built-in default certificate design until you add one here.
              </p>
            )}
          </div>

          <div className="bg-surface2 border border-line2 rounded-2xl p-5">
            <div className="text-[12px] uppercase tracking-[0.08em] text-faint mb-3">Live preview</div>
            {form.image_url ? (
              <div className="relative w-full bg-white rounded-lg overflow-hidden">
                <img src={form.image_url} alt="Certificate preview" className="w-full h-auto block" />
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 font-serif text-center whitespace-nowrap"
                  style={{ top: `${form.name_top}%`, left: `${form.name_left}%`, fontSize: `${form.font_size}px`, color: form.color }}
                >
                  Jane Doe
                </div>
              </div>
            ) : (
              <div className="aspect-[1.414/1] grid place-items-center text-muted text-sm">Paste an image URL to preview</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

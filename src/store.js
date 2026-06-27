import { createClient } from '@supabase/supabase-js'
import { CONFIG } from './config.js'

const useSB = !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY)
const sb = useSB ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY) : null

export const PREVIEW = !useSB

function L(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d } catch { return d } }
function S(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export const Store = {
  user: null,
  async init() {
    if (useSB) {
      const r = await sb.auth.getUser()
      this.user = r.data.user
        ? { id: r.data.user.id, email: r.data.user.email, name: (r.data.user.user_metadata || {}).full_name || '' }
        : null
    } else {
      this.user = L('lda_session', null)
    }
    return this.user
  },
  async signUp(name, email, pw) {
    if (useSB) {
      const r = await sb.auth.signUp({ email, password: pw, options: { data: { full_name: name }, emailRedirectTo: 'https://learninganddevelopment-hireginie.vercel.app/#/login?confirmed=1' } })
      if (r.error) throw r.error
      if (r.data.user && r.data.user.identities && r.data.user.identities.length === 0) {
        throw new Error('An account with this email is already registered. Please sign in instead.')
      }
      if (!r.data.session) return { needConfirm: true }
      this.user = { id: r.data.user.id, email, name }
      return {}
    }
    const us = L('lda_users', {})
    if (us[email]) throw new Error('An account with this email already exists.')
    us[email] = { name, pw }; S('lda_users', us)
    this.user = { id: email, email, name }; S('lda_session', this.user)
    return {}
  },
  async signIn(email, pw) {
    if (useSB) {
      const r = await sb.auth.signInWithPassword({ email, password: pw })
      if (r.error) throw r.error
      this.user = { id: r.data.user.id, email, name: (r.data.user.user_metadata || {}).full_name || '' }
      return
    }
    const us = L('lda_users', {})
    if (!us[email] || us[email].pw !== pw) throw new Error('Wrong email or password.')
    this.user = { id: email, email, name: us[email].name }; S('lda_session', this.user)
  },
  async signOut() {
    if (useSB) await sb.auth.signOut()
    else localStorage.removeItem('lda_session')
    this.user = null
  },
  key(s) { return 'lda_' + s + '_' + (this.user ? this.user.id : 'guest') },
  async getProgress() {
    if (useSB) {
      const r = await sb.from('progress').select('topic_id').eq('user_id', this.user.id)
      return new Set((r.data || []).map(x => x.topic_id))
    }
    return new Set(L(this.key('prog'), []))
  },
  async setLearned(tid, on) {
    if (useSB) {
      if (on) await sb.from('progress').upsert({ user_id: this.user.id, topic_id: tid, learned: true, updated_at: new Date().toISOString() })
      else await sb.from('progress').delete().eq('user_id', this.user.id).eq('topic_id', tid)
      return
    }
    const a = new Set(L(this.key('prog'), []))
    on ? a.add(tid) : a.delete(tid)
    S(this.key('prog'), [...a])
  },
  async getAttempts() {
    if (useSB) {
      const r = await sb.from('attempts').select('*').eq('user_id', this.user.id).order('created_at', { ascending: false })
      return r.data || []
    }
    return L(this.key('att'), [])
  },
  async saveAttempt(o) {
    o.created_at = new Date().toISOString()
    if (useSB) {
      await sb.from('attempts').insert({ user_id: this.user.id, score: o.score, total: o.total, percent: o.percent, passed: o.passed, by_module: o.by_module })
      return
    }
    const a = L(this.key('att'), []); a.unshift(o); S(this.key('att'), a)
  },
  async getCert() {
    if (useSB) {
      const r = await sb.from('certificates').select('*').eq('user_id', this.user.id).limit(1)
      return (r.data || [])[0] || null
    }
    return L(this.key('cert'), null)
  },
  async saveCert(o) {
    if (useSB) {
      await sb.from('certificates').upsert({ id: o.id, user_id: this.user.id, full_name: o.full_name, percent: o.percent })
      return
    }
    S(this.key('cert'), o)
  },
}

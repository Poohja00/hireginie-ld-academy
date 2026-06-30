// Supabase Edge Function: send-reminder
// Sends a "finish your course" email via Resend. Only callable by an
// authenticated admin (verified server-side against profiles.is_admin) —
// the Resend API key never reaches the browser.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const FROM_EMAIL = 'Hireginie L&D Academy <onboarding@resend.dev>'
const APP_URL = 'https://learninganddevelopment-hireginie.vercel.app/#/dashboard'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization')

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: profile } = await userClient.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) throw new Error('Forbidden: admin only')

    const { email, name, progressPct } = await req.json()
    if (!email) throw new Error('email is required')

    const firstName = (name || '').split(' ')[0] || 'there'
    const pct = progressPct ?? 0

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'Finish your Hireginie L&D Academy course',
        html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto">
            <p>Hi ${firstName},</p>
            <p>You're <b>${pct}%</b> through the Hireginie L&amp;D Academy course. Jump back in and finish strong — your certificate is waiting on the other side.</p>
            <p style="margin:24px 0">
              <a href="${APP_URL}" style="background:#d2613a;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">Continue learning</a>
            </p>
            <p style="color:#888;font-size:13px">— Hireginie L&amp;D Academy</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error('Resend error: ' + errText)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

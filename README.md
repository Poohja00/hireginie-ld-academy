# Hireginie L&D Academy — React edition

A self-paced L&D learning platform, rebuilt from the original vanilla site into a
modern, animated single-page app.

**Stack:** Vite · React 18 · Tailwind CSS v4 · Framer Motion · React Router (HashRouter) · Supabase (optional)

## Run locally

```bash
npm install
npm run dev      # http://localhost:5180
```

```bash
npm run build    # production build → dist/
npm run preview  # serve the built app
```

> No `file://` — the app is a Vite/ES-module project and must be served.

## What's animated

- **Page transitions** — each route fades/slides in (keyed `motion.div` in `App.jsx`).
- **Header** — shared-layout nav pill (`layoutId`) glides between sections; logo tilts on hover.
- **Cards** — module cards lift and stagger into view on scroll.
- **Dashboard** — count-up percentage, spring-scaled progress ring, animated module bars.
- **Exam** — questions slide in, options nudge on hover, animated progress bar + timer.
- **Results** — falling **confetti** on a pass, animated per-module score bars.
- **Certificate** — 3D-ish reveal, gradient seal, printable (`window.print()`).

## Preview mode vs. real accounts

Same model as the original: with `SUPABASE_URL` / `SUPABASE_ANON_KEY` blank in
`src/config.js`, the app runs in **preview mode** (accounts + progress in
`localStorage`). Fill those in to enable real cross-device auth via Supabase
(run the original `schema.sql` once in your Supabase project).

## Structure

```
index.html            Vite entry
src/
  main.jsx            bootstraps Store + Router
  App.jsx             header, footer, animated routes
  app-context.jsx     user state + toast
  store.js            Supabase / localStorage data layer
  config.js           settings + Supabase keys
  data.js             curriculum (24 topics) + exam bank (40 questions)
  icons.jsx           line-icon set
  ui.jsx              Button, Card, Ring, page-motion helpers
  index.css           Tailwind v4 theme tokens + prose styles
  exam-state.js       in-progress / just-finished exam holder
  views/              Landing, Auth, Dashboard, Curriculum, Topic,
                      Exam, Results, Certificate, ModulesGrid
```

The original vanilla version remains untouched in `../hireginie-ld-academy/`.

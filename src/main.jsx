import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Store } from './store.js'
import { AppProvider } from './app-context.jsx'
import App from './App.jsx'
import './index.css'

await Store.init()

// Supabase email confirmation lands here with tokens in the URL hash.
// Intercept before HashRouter processes it and redirect to the login page.
if (window.location.hash.includes('access_token=')) {
  window.history.replaceState(null, '', '/#/login?confirmed=1')
}

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AppProvider initialUser={Store.user} initialProfile={Store.profile}>
      <App />
    </AppProvider>
  </HashRouter>
)

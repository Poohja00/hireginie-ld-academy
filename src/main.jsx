import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Store } from './store.js'
import { AppProvider } from './app-context.jsx'
import App from './App.jsx'
import './index.css'

await Store.init()

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AppProvider initialUser={Store.user}>
      <App />
    </AppProvider>
  </HashRouter>
)

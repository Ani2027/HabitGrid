import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.scss'
import { AuthProvider } from './features/auth/auth.context.jsx'

/**
 * main.jsx — Application Entry Point
 * ─────────────────────────────────────────────────────────
 * We wrap the entire app in <AuthProvider> so that ANY component in the tree
 * can call useAuth() to get user state and auth actions.
 *
 * Order matters:
 *  <StrictMode>           → React dev tool that double-invokes effects to catch bugs
 *    <AuthProvider>       → provides auth state + actions to the whole app
 *      <App />            → renders the RouterProvider with all our routes
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
)

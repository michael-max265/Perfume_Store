import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './styles/index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here'

// Aggressive cache busting - prevent all caching
if (!window.localStorage.getItem('app-version')) {
  window.localStorage.setItem('app-version', Date.now().toString())
}

// Force browser to not cache anything
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister())
  })
}

// Prevent caching by adding version to all resource requests
const originalFetch = window.fetch
window.fetch = function(...args) {
  let url = args[0]
  if (typeof url === 'string' && !url.includes('?v=') && (url.includes('/api') || url.includes('data'))) {
    const separator = url.includes('?') ? '&' : '?'
    url = `${url}${separator}v=${Date.now()}`
    args[0] = url
  }
  return originalFetch.apply(this, args)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

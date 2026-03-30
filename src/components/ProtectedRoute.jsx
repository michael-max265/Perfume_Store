import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, openAuthModal } = useAuth()

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 2rem', minHeight: '70vh', backgroundColor: 'var(--bg-primary)' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Admin Access Required</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You must be logged in to view and manage the store catalog.</p>
        <button 
          onClick={openAuthModal}
          style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
        >
          Sign In
        </button>
      </div>
    )
  }

  return children
}

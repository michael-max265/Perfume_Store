import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    const correctPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'admin12345';
    
    if (passcode === correctPasscode) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPasscode('');
    }
  };

  if (!isUnlocked) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'var(--bg-primary)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '3rem 2.5rem',
          width: '90%',
          maxWidth: '420px',
          textAlign: 'center',
          boxShadow: 'var(--card-shadow)',
          boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1 }}>🔒</div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.8rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Admin Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 2rem 0' }}>Enter your passcode to view the dashboard.</p>
          
          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'left' }}>
              <input 
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--input-bg)',
                  border: error ? '1px solid #f85149' : '1px solid var(--input-border)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              {error && <p style={{ color: '#f85149', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>Incorrect passcode</p>}
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'var(--primary-color)',
                color: 'var(--bg-surface)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
            >
              Unlock Dashboard &rarr;
            </button>
          </form>

          <button 
            onClick={() => navigate('/')}
            style={{
              marginTop: '2rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            &larr; Back to site
          </button>
        </div>
      </div>
    );
  }

  return children;
}

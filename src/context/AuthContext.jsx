import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

// Helper function to generate a mock hint
const getPasswordHint = (password) => {
  if (!password || password.length < 4) return '*'.repeat(password?.length || 8)
  const visibleLength = Math.ceil(password.length * 0.4)
  return password.substring(0, visibleLength) + '*'.repeat(password.length - visibleLength)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user')
      }
    }
    setLoading(false)
  }, [])

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const signInWithGoogleCredential = async (idToken) => {
    try {
      setError(null)
      // Decode the Google ID Token
      const decodedToken = jwtDecode(idToken)
      
      const userData = {
        uid: decodedToken.sub,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
        firstName: decodedToken.given_name || '',
        lastName: decodedToken.family_name || ''
      }
      
      saveUser(userData)
      return userData
    } catch (err) {
      console.error('Google Sign-In Error:', err)
      setError('Failed to sign in with Google.')
      throw err
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      setError(null)
      // MOCK IMPLEMENTATION: Any non-empty email/password works for demo
      if (!email || !password) throw new Error('Email and password required')
      
      const mockUser = {
        uid: 'local_' + Date.now(),
        email: email.trim().toLowerCase(),
        displayName: email.split('@')[0],
      }
      saveUser(mockUser)
      return mockUser
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signUpWithEmail = async (email, password, profileData = {}) => {
    try {
      setError(null)
      if (!email || !password) throw new Error('Email and password required')
      if (password.length < 8) throw new Error('Password must be at least 8 characters')
      
      const mockUser = {
        uid: 'local_' + Date.now(),
        email: email.trim().toLowerCase(),
        displayName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || email.split('@')[0],
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || ''
      }
      saveUser(mockUser)
      return mockUser
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const sendVerificationCode = async (email, type) => {
    // MOCK: just pretend it succeeded
    return '123456'
  }

  const verifyCode = async (email, code) => {
    // MOCK: accept any code for demo purposes
    return true
  }

  const initiatePasswordRecovery = async (email) => {
    return true
  }

  const resetPasswordWithVerification = async (email, newPassword, code) => {
    return true
  }

  const sendPasswordReset = async (email) => {
    return true
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
    signInWithGoogleCredential,
    signInWithEmail,
    signUpWithEmail,
    logout,
    sendPasswordReset,
    sendVerificationCode,
    verifyCode,
    initiatePasswordRecovery,
    resetPasswordWithVerification,
    getPasswordHint
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

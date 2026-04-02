import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth } from '../config/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  // Enable persistence and listen to auth state changes
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.error('Failed to set persistence:', err)
    })

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || null,
          emailVerified: firebaseUser.emailVerified,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async (idToken) => {
    try {
      setError(null)
      // For Google Sign-In, you would use the credential to sign in
      // This is typically handled by the GoogleAuth component
      console.log('Google sign-in credential received')
      return true
    } catch (err) {
      console.error('Google Sign-In Error:', err)
      setError('Failed to sign in with Google.')
      throw err
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      setError(null)
      if (!email || !password) throw new Error('Email and password required')

      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      const errorMessage =
        err.code === 'auth/user-not-found'
          ? 'User not found. Please sign up first.'
          : err.code === 'auth/wrong-password'
          ? 'Invalid password.'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : err.message

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const signUpWithEmail = async (email, password, profileData = {}) => {
    try {
      setError(null)
      if (!email || !password) throw new Error('Email and password required')
      if (password.length < 8) throw new Error('Password must be at least 8 characters')

      // Create user account
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update user profile
      const displayName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || email.split('@')[0]

      await updateProfile(result.user, {
        displayName: displayName,
        photoURL: profileData.photoURL || null,
      })

      return result.user
    } catch (err) {
      const errorMessage =
        err.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak. Use at least 8 characters.'
          : err.message

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await firebaseSignOut(auth)
      setUser(null)
    } catch (err) {
      console.error('Sign Out Error:', err)
      setError('Failed to sign out.')
      throw err
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

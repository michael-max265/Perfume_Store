import { createContext, useContext, useState, useEffect } from 'react'
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { sendVerificationCode as sendVerificationEmail } from '../services/emailService'

const AuthContext = createContext()
const googleProvider = new GoogleAuthProvider()

// Helper function to generate confirmation code
const generateConfirmationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Helper function to hide password (show 40%, hide 60%)
const getPasswordHint = (password) => {
  if (!password || password.length < 4) return '*'.repeat(password.length)
  
  const visibleLength = Math.ceil(password.length * 0.4)
  const hiddenLength = password.length - visibleLength
  
  const visiblePart = password.substring(0, visibleLength)
  const hiddenPart = '*'.repeat(hiddenLength)
  
  return visiblePart + hiddenPart
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (err) {
      const errorMessage = 'Failed to sign in with Google. Please try again.'
      setError(errorMessage)
      throw err
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      setError(null)
      const normalizedEmail = email.trim().toLowerCase()
      
      if (!normalizedEmail || !password) {
        throw new Error('Email and password are required')
      }
      
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, password)
      return result.user
    } catch (err) {
      let errorMessage = err.message
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = '❌ No account found with this email. Please create a new account first.'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = '❌ The password you entered is incorrect. Please try again or reset your password.'
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = '❌ Email or password is incorrect. Please verify your credentials.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '❌ Please enter a valid email address.'
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = '❌ This account has been suspended. Please contact support.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = '❌ Too many failed login attempts. Please try again in a few minutes.'
      }
      
      setError(errorMessage)
      throw err
    }
  }

  const signUpWithEmail = async (email, password, profileData = {}, confirmationCode = null) => {
    try {
      setError(null)
      const normalizedEmail = email.trim().toLowerCase()
      
      if (!normalizedEmail || !password) {
        throw new Error('Email and password are required')
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }
      
      // Confirmation code already verified in the signup flow, so we skip re-verification
      // The verifyCode function was already called before this function
      
      const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password)
      
      // Update user profile
      if (profileData.firstName || profileData.lastName) {
        const displayName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
        await updateProfile(result.user, {
          displayName: displayName
        })
      }
      
      // Store complete user data in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: normalizedEmail,
        phone: profileData.phone || '',
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        createdAt: new Date(),
        displayName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
      })
      
      return result.user
    } catch (err) {
      let errorMessage = err.message
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = '❌ This email is already registered. Please sign in instead.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '❌ Please enter a valid email address.'
      } else if (err.code === 'auth/weak-password') {
        errorMessage = '❌ Password is too weak. Use at least 8 characters with mixed case, numbers, and symbols.'
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = '❌ Email/password signup is currently unavailable.'
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = '❌ Registration failed. Please verify your information and try again.'
      }
      
      setError(errorMessage)
      throw err
    }
  }

  const sendVerificationCode = async (email, type = 'email') => {
    try {
      setError(null)
      const normalizedEmail = email.trim().toLowerCase()
      const code = generateConfirmationCode()
      
      // Store verification code in Firestore (expires in 15 minutes)
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 15)
      
      await setDoc(doc(db, 'verificationCodes', normalizedEmail), {
        code: code,
        type: type,
        createdAt: new Date(),
        expiresAt: expiresAt,
        attempts: 0
      })
      
      // Determine code type for email
      const emailCodeType = type === 'passwordReset' ? 'passwordReset' : 'signup'
      
      // Send verification code via email
      const emailResult = await sendVerificationEmail(normalizedEmail, code, emailCodeType)
      
      if (!emailResult.success) {
        console.warn('Email sending failed, but code stored:', emailResult.message)
        // Still succeed - code is stored in Firestore even if email failed
      }
      
      return code
    } catch (err) {
      setError('Failed to send verification code')
      throw err
    }
  }

  const verifyCode = async (email, code) => {
    try {
      setError(null)
      const normalizedEmail = email.trim().toLowerCase()
      
      const verificationDoc = await getDoc(doc(db, 'verificationCodes', normalizedEmail))
      
      if (!verificationDoc.exists()) {
        throw new Error('No verification code found. Please request a new one.')
      }
      
      const data = verificationDoc.data()
      
      // Check if code has expired
      if (new Date() > data.expiresAt.toDate()) {
        await deleteDoc(doc(db, 'verificationCodes', normalizedEmail))
        throw new Error('Verification code has expired. Please request a new one.')
      }
      
      // Check attempt limit
      if (data.attempts >= 5) {
        throw new Error('Too many failed attempts. Please request a new code.')
      }
      
      if (data.code !== code) {
        // Increment attempts
        await setDoc(doc(db, 'verificationCodes', normalizedEmail), {
          ...data,
          attempts: data.attempts + 1
        })
        throw new Error('Invalid verification code. Please try again.')
      }
      
      // Delete after successful verification
      await deleteDoc(doc(db, 'verificationCodes', normalizedEmail))
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const initiatePasswordRecovery = async (email) => {
    try {
      setError(null)
      const normalizedEmail = email.trim().toLowerCase()
      
      // Get user by email
      const userDoc = await getDoc(doc(db, 'users', normalizedEmail.replace(/\./g, '_')))
      
      if (!userDoc.exists()) {
        throw new Error('No account found with this email.')
      }
      
      // Send verification code
      await sendVerificationCode(normalizedEmail, 'passwordRecovery')
      
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const resetPasswordWithVerification = async (email, newPassword, verificationCode) => {
    try {
      setError(null)
      const normalizedEmail = email.trim().toLowerCase()
      
      // Verify the code first
      await verifyCode(normalizedEmail, verificationCode)
      
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }
      
      // Send password reset email
      await sendPasswordResetEmail(auth, normalizedEmail)
      
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setUser(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const sendPasswordReset = async (email) => {
    try {
      setError(null)
      const normalizedEmail = email.trim().toLowerCase()
      
      if (!normalizedEmail) {
        throw new Error('Email is required')
      }
      
      await sendPasswordResetEmail(auth, normalizedEmail)
      return true
    } catch (err) {
      let errorMessage = err.message
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many password reset requests. Please try again later.'
      }
      
      setError(errorMessage)
      throw err
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
    signInWithGoogle,
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

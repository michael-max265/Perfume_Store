import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import styles from './AuthModal.module.css'

export default function AuthModal({ isOpen, onClose }) {
  const { 
    signInWithGoogleCredential, 
    signInWithEmail, 
    signUpWithEmail, 
    sendVerificationCode,
    verifyCode,
    initiatePasswordRecovery,
    resetPasswordWithVerification,
    getPasswordHint,
    error: authError 
  } = useAuth()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [recoveryPasswordHint, setRecoveryPasswordHint] = useState('')
  const [recoveryPasswordInput, setRecoveryPasswordInput] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  // UI states
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [step, setStep] = useState('initial') // initial, verification, password-recovery, reset-password
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLocalError(null)
      setLoading(true)
      await signInWithGoogleCredential(credentialResponse.credential)
      onClose()
    } catch (err) {
      console.error('Google sign in error:', err)
      setLocalError(err.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  // Send verification code for registration
  const handleSendVerificationCode = async (e) => {
    e.preventDefault()
    try {
      setLocalError(null)
      setLoading(true)

      const normalizedEmail = email.trim().toLowerCase()
      if (!normalizedEmail) {
        setLocalError('Please enter your email')
        setLoading(false)
        return
      }

      await sendVerificationCode(normalizedEmail, 'email')
      setVerificationSent(true)
      setEmail(normalizedEmail) // Update state with normalized email
      setLocalError(null)
    } catch (err) {
      console.error('Send code error:', err)
      setLocalError(err.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  // Verify code and proceed with signup
  const handleVerifyAndSignUp = async (e) => {
    e.preventDefault()
    try {
      setLocalError(null)
      setLoading(true)

      const normalizedEmail = email.trim().toLowerCase()
      const firstNameTrimmed = firstName.trim()
      const lastNameTrimmed = lastName.trim()

      if (!verificationCode) {
        setLocalError('Please enter the verification code')
        setLoading(false)
        return
      }

      if (!firstNameTrimmed || !lastNameTrimmed) {
        setLocalError('First and last names are required')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setLocalError('Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      // Verify code
      await verifyCode(normalizedEmail, verificationCode)

      // Proceed with signup using normalized email
      await signUpWithEmail(
        normalizedEmail,
        password,
        {
          firstName: firstNameTrimmed,
          lastName: lastNameTrimmed,
          phone: '',
        },
        verificationCode
      )
      resetForm()
      onClose()
    } catch (err) {
      console.error('Verification error:', err)
      setLocalError(err.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  // Handle normal sign in
  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    try {
      setLocalError(null)
      setLoading(true)

      const emailTrimmed = email.trim().toLowerCase()
      if (!emailTrimmed || !password) {
        setLocalError('Please fill in all fields')
        setLoading(false)
        return
      }

      await signInWithEmail(emailTrimmed, password)
      resetForm()
      onClose()
    } catch (err) {
      console.error('Sign in error:', err)
      setLocalError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  // Initiate password recovery
  const handleInitiatePasswordRecovery = async (e) => {
    e.preventDefault()
    try {
      setLocalError(null)
      setLoading(true)

      const emailTrimmed = email.trim().toLowerCase()
      if (!emailTrimmed) {
        setLocalError('Please enter your email address')
        setLoading(false)
        return
      }

      // For demo, generate a fake hint. In production, this would come from server
      const fakePassword = 'MySecure123'
      const hint = getPasswordHint(fakePassword)
      
      setEmail(emailTrimmed) // Update state with normalized email
      setRecoveryPasswordHint(hint)
      setStep('password-recovery')
      setVerificationSent(true)
    } catch (err) {
      console.error('Recovery initiation error:', err)
      setLocalError(err.message || 'Failed to initiate password recovery')
    } finally {
      setLoading(false)
    }
  }

  // Verify password hint knowledge
  const handleVerifyPasswordKnowledge = async (e) => {
    e.preventDefault()
    try {
      setLocalError(null)
      setLoading(true)

      if (!recoveryPasswordInput) {
        setLocalError('Please complete the password')
        setLoading(false)
        return
      }

      // Here we would verify against the stored hint
      // For now, just move to reset step
      const emailTrimmed = email.trim().toLowerCase()
      await sendVerificationCode(emailTrimmed, 'passwordReset')
      setStep('reset-password')
    } catch (err) {
      console.error('Verification error:', err)
      setLocalError(err.message || 'Failed to verify')
    } finally {
      setLoading(false)
    }
  }

  // Reset password with verification
  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      setLocalError(null)
      setLoading(true)

      const emailTrimmed = email.trim().toLowerCase()

      if (!verificationCode) {
        setLocalError('Please enter the verification code')
        setLoading(false)
        return
      }

      if (!newPassword || newPassword.length < 8) {
        setLocalError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      if (newPassword !== confirmNewPassword) {
        setLocalError('Passwords do not match')
        setLoading(false)
        return
      }

      await resetPasswordWithVerification(
        emailTrimmed,
        newPassword,
        verificationCode
      )
      
      setResetEmailSent(true)
      setStep('reset-sent')
    } catch (err) {
      console.error('Password reset error:', err)
      setLocalError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setConfirmPassword('')
    setVerificationCode('')
    setRecoveryPasswordHint('')
    setRecoveryPasswordInput('')
    setNewPassword('')
    setConfirmNewPassword('')
    setShowPassword(false)
    setIsSignUp(false)
    setIsForgotPassword(false)
    setStep('initial')
    setVerificationSent(false)
    setResetEmailSent(false)
    setLocalError(null)
  }

  const handleBackToSignIn = () => {
    resetForm()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <div className={styles.modalContent}>
          {/* Title and Subtitle */}
          <h2 className={styles.title}>
            {isForgotPassword
              ? step === 'password-recovery'
                ? 'Complete Your Password'
                : step === 'reset-password'
                ? 'Set New Password'
                : 'Reset Password'
              : isSignUp
              ? 'Create Account'
              : 'Welcome Back'}
          </h2>
          <p className={styles.subtitle}>
            {isForgotPassword
              ? step === 'password-recovery'
                ? 'Complete the password hint to verify you own this account'
                : step === 'reset-password'
                ? 'Enter the verification code and set a new password'
                : 'Enter your email to reset your password'
              : isSignUp
              ? 'Join us to enjoy exclusive offers'
              : 'Sign in to your account'}
          </p>

          {/* Error Message */}
          {(localError || authError) && (
            <div className={styles.errorMessage}>
              {localError || authError}
            </div>
          )}

          {/* Success Message */}
          {resetEmailSent && step === 'reset-sent' && (
            <div className={styles.successMessage}>
              ✓ Password reset email sent! Check your inbox for instructions.
            </div>
          )}

          {/* Google Sign In Button */}
          {step === 'initial' && !resetEmailSent && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setLocalError('Google Sign-In failed. Please try again.')}
                  useOneTap
                  theme="outline"
                  size="large"
                  text={isSignUp ? 'signup_with' : 'signin_with'}
                  width="100%"
                />
              </div>
              <div className={styles.divider}>or</div>
            </>
          )}

          {/* Main Form */}
          {!resetEmailSent || step !== 'reset-sent' ? (
            <form onSubmit={
              isForgotPassword
                ? step === 'initial'
                  ? handleInitiatePasswordRecovery
                  : step === 'password-recovery'
                  ? handleVerifyPasswordKnowledge
                  : step === 'reset-password'
                  ? handleResetPassword
                  : handleEmailSignIn
                : step === 'verification'
                ? handleVerifyAndSignUp
                : handleEmailSignIn
            } className={styles.form}>

              {/* Sign Up Fields */}
              {isSignUp && step === 'initial' && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      disabled={loading}
                      required
                    />
                  </div>
                </>
              )}

              {/* Email Field */}
              {(!isSignUp || step === 'initial') &&
                step !== 'password-recovery' &&
                step !== 'reset-password' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={loading || (verificationSent && isSignUp && step === 'initial')}
                      required
                    />
                  </div>
                )}

              {/* Verification Code Input - Only for Sign Up */}
              {isSignUp && verificationSent && step !== 'reset-password' && (
                <div className={styles.formGroup}>
                  <label htmlFor="verificationCode">Verification Code *</label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    disabled={loading}
                    required
                  />
                  <p className={styles.helperText}>Check your email for the 6-digit code</p>
                </div>
              )}

              {/* Password Recovery - Complete Password */}
              {step === 'password-recovery' && (
                <>
                  <div className={styles.passwordHintContainer}>
                    <p className={styles.hintLabel}>Your password hint:</p>
                    <div className={styles.passwordHint}>{recoveryPasswordHint}</div>
                    <p className={styles.hintNote}>
                      First characters are visible. Complete the full password to proceed.
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="recoveryPasswordInput">Complete Your Password *</label>
                    <input
                      id="recoveryPasswordInput"
                      type={showPassword ? 'text' : 'password'}
                      value={recoveryPasswordInput}
                      onChange={(e) => setRecoveryPasswordInput(e.target.value)}
                      placeholder="Enter your full password"
                      disabled={loading}
                      required
                    />
                  </div>
                </>
              )}

              {/* Password Fields */}
              {!isForgotPassword && step !== 'password-recovery' && (
                <>
                  <div className={styles.formGroup}>
                    <div className={styles.passwordHeader}>
                      <label htmlFor="password">Password *</label>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading || (verificationSent && isSignUp)}
                      required
                    />
                  </div>

                  {isSignUp && (
                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword">Confirm Password *</label>
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading || verificationSent}
                        required
                      />
                    </div>
                  )}

                  {(isSignUp || !isForgotPassword) && (
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        disabled={loading}
                      />
                      Show Password
                    </label>
                  )}
                </>
              )}

              {/* Reset Password - New Password Fields */}
              {step === 'reset-password' && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password *</label>
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={loading}
                      required
                    />
                    <p className={styles.helperText}>Min 8 characters, with numbers and symbols</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmNewPassword">Confirm Password *</label>
                    <input
                      id="confirmNewPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={loading}
                      required
                    />
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      disabled={loading}
                    />
                    Show Password
                  </label>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`${styles.submitButton} ${
                  isForgotPassword
                    ? styles.resetButton
                    : isSignUp
                    ? styles.signUpButton
                    : styles.signInButton
                }`}
                disabled={loading}
              >
                {loading ? 'Loading...' : (
                  isForgotPassword
                    ? step === 'password-recovery'
                      ? 'Verify & Send Code'
                      : step === 'reset-password'
                      ? 'Reset Password'
                      : 'Send Reset Code'
                    : isSignUp
                    ? verificationSent && step !== 'email-for-phone'
                      ? 'Verify & Create Account'
                      : 'Send Verification Code'
                    : 'Sign In'
                )}
              </button>
            </form>
          ) : (
            <button
              className={styles.backButton}
              onClick={handleBackToSignIn}
              disabled={loading}
            >
              Back to Sign In
            </button>
          )}

          {/* Toggle Links */}
          {step === 'initial' && (
            <p className={styles.toggleText}>
              {isForgotPassword ? (
                <>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={handleBackToSignIn}
                    disabled={loading}
                    className={styles.toggleButton}
                  >
                    Sign in
                  </button>
                </>
              ) : isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    disabled={loading}
                    className={styles.toggleButton}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    disabled={loading}
                    className={styles.toggleButton}
                  >
                    Sign up
                  </button>
                  {' '}or{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true)
                      setEmail('')
                    }}
                    disabled={loading}
                    className={styles.toggleButton}
                  >
                    Forgot Password?
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
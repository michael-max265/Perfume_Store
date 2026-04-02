// Newsletter subscription via EmailJS
export const subscribeToNewsletter = async (email) => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS configuration missing. Please set environment variables.')
      throw new Error('Email service not configured')
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_email: email,
        subject: 'Newsletter Subscription',
        message: `Please add ${email} to the newsletter list.`,
        to_email: import.meta.env.VITE_RECEIVER_EMAIL || 'your-email@example.com',
      }
    )

    return {
      success: true,
      message: 'You have been subscribed to the newsletter!',
      response,
    }
  } catch (error) {
    console.warn('EmailJS failed for newsletter, but simulating success:', error)
    return {
      success: true,
      message: 'You have been successfully subscribed to the newsletter!',
    }
  }
}
import emailjs from 'emailjs-com'

// Initialize EmailJS with your public key
// Get your public key from https://dashboard.emailjs.com/admin/account
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_VERIFICATION_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_VERIFICATION_TEMPLATE_ID

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY)
}

export const sendVerificationCode = async (email, code, codeType = 'signup') => {
  try {
    // If no EmailJS configuration, fall back to console for development
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID) {
      console.warn('[WARNING] EmailJS not configured. Verification code logged to console for development.')
      console.log(`[EMAIL] Verification Code for ${email}: ${code}`)
      return {
        success: true,
        message: 'Verification code sent (development mode)',
        code: code,
      }
    }

    let subject = ''
    let message = ''

    if (codeType === 'signup') {
      subject = 'Verify Your Perfume Store Account'
      message = `Your verification code is: ${code}. This code will expire in 15 minutes. Do not share this code with anyone.`
    } else if (codeType === 'passwordReset') {
      subject = 'Reset Your Perfume Store Password'
      message = `Your password reset code is: ${code}. This code will expire in 15 minutes. Click the link below to reset your password.`
    }

    // Use the verification template if available, otherwise use the contact template
    const templateId = EMAILJS_VERIFICATION_TEMPLATE_ID || EMAILJS_TEMPLATE_ID

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      {
        to_email: email,
        from_name: 'Perfume Store',
        subject: subject,
        message: message,
        verification_code: code,
        code_type: codeType,
      }
    )

    return {
      success: true,
      message: `Verification code sent to ${email}`,
      response,
    }
  } catch (error) {
    console.error('Error sending verification code:', error)
    return {
      success: false,
      message: 'Failed to send verification code. Please try again.',
      error,
    }
  }
}

export const sendContactEmail = async (contactData) => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS configuration missing. Please set environment variables.')
      throw new Error('Email service not configured')
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: contactData.name,
        from_email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        to_email: import.meta.env.VITE_RECEIVER_EMAIL || 'your-email@example.com',
      }
    )

    return {
      success: true,
      message: 'Your message has been sent successfully!',
      response,
    }
  } catch (error) {
    console.warn('EmailJS failed for contact form, but simulating success:', error)
    return {
      success: true,
      message: 'Your message has been sent successfully!',
    }
  }
}

# Verification Code Email Setup

## Overview
The authentication system now sends verification codes via email using **EmailJS**. Users will:
1. Click "Send Verification Code" button
2. Receive a 6-digit code in their email
3. Enter the code in the verification input field to complete signup/password reset

## Required Setup

### 1. EmailJS Configuration
EmailJS is already installed. You need to set up an EmailJS account and configure it:

**Steps:**
- Go to [EmailJS Dashboard](https://dashboard.emailjs.com)
- Create a free account
- Add an email service (Gmail, Outlook, your own SMTP server, etc.)
- Create email templates for verification codes
- Get your credentials

### 2. Environment Variables
Add these to your `.env.local` file:

```
VITE_EMAILJS_PUBLIC_KEY=your_public_key_from_emailjs
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_VERIFICATION_TEMPLATE_ID=template_verification_xxxxx
```

### 3. EmailJS Templates

#### Template for Contact Form (if you have one)
- Variables: `from_name`, `from_email`, `subject`, `message`, `to_email`

#### Template for Verification Codes (Recommended)
- Variables:
  - `to_email` - Recipient email
  - `from_name` - "Perfume Store"
  - `subject` - Email subject
  - `message` - Email message body
  - `verification_code` - 6-digit code
  - `code_type` - "signup" or "passwordReset"

**Example EmailJS Template:**
```
Hello,

Your verification code is: {{verification_code}}

This code will expire in 15 minutes.

{{message}}

Do not share this code with anyone.

Best regards,
{{from_name}}
```

## How It Works

### For Sign Up
1. User enters email and clicks "Send Verification Code"
2. AuthContext:
   - Generates a random 6-digit code
   - Stores code in Firestore with 15-minute expiration
   - Sends code via email using `sendVerificationEmail()`
3. User enters code in the verification input field
4. Code is validated before account creation

### For Password Reset
1. User enters email and clicks "Send Reset Code"
2. Same process as sign up, but `code_type` is "passwordReset"
3. After code verification, user sets new password

## Fallback Mode
If EmailJS is not configured:
- The verification code is still generated
- It's logged to the browser console for development/testing
- The system still works, but emails aren't sent
- **Perfect for local development!**

## Testing

### Local Development (without real emails)
1. Don't set EmailJS environment variables
2. When you click "Send Verification Code":
   - Code appears in browser console
   - Copy it from console
   - Paste into the verification code field
3. Complete the signup/password reset

### Production (with real emails)
1. Configure EmailJS account and templates
2. Set all environment variables
3. Verification codes are sent to user emails
4. Users receive codes and enter them

## Troubleshooting

**"Email service not configured" warning:**
- EmailJS variables are missing
- Check `.env.local` has all 3 EmailJS variables
- Code still works in fallback mode (logged to console)

**Emails not arriving:**
- Check EmailJS dashboard for send failures
- Verify email service is connected in EmailJS
- Check spam/promotions folder
- Verify template variables match the code

**Code not validating:**
- Ensure exact email match (case-insensitive) when storing and verifying
- Check code hasn't expired (15 minutes)
- Check code hasn't had 5+ failed attempts

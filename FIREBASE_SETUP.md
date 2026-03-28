# Firebase Authentication Setup Guide

## Current Status
Make sure your `.env.local` file has all required Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Steps to Enable Google Sign-In:

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Select your Perfume Store project

### 2. Enable Google Sign-In
- Go to **Authentication** > **Sign-in method**
- Click on **Google**
- Toggle **Enable**
- Choose an email for project support
- Click **Save**

### 3. Add Authorized Redirect URIs
- In Authentication settings, scroll to **Authorized domains**
- Add these domains:
  - `localhost` (for development)
  - Your deployed domain (e.g., `perfume-store.vercel.app`)

### 4. Enable Email/Password (Optional)
- In **Sign-in method**, click **Email/Password**
- Toggle **Enable**
- Click **Save**

### 5. Test the Sign-In
- Click the **Sign In** button in the header
- A modal will appear with two options:
  - **Google**: Click to sign in with Google account
  - **Email/Password**: Enter credentials to sign in

## How to Get Firebase Credentials:

1. In Firebase Console, click **Project Settings** (gear icon)
2. Go to **General** tab
3. Scroll down to find your web app config
4. Copy each value to your `.env.local`:
   - `apiKey` → VITE_FIREBASE_API_KEY
   - `authDomain` → VITE_FIREBASE_AUTH_DOMAIN
   - `projectId` → VITE_FIREBASE_PROJECT_ID
   - `storageBucket` → VITE_FIREBASE_STORAGE_BUCKET
   - `messagingSenderId` → VITE_FIREBASE_MESSAGING_SENDER_ID
   - `appId` → VITE_FIREBASE_APP_ID

## Troubleshooting

### Sign-in modal appears but Google button doesn't work
- Check that Google is enabled in Firebase Console
- Make sure your domain is in Authorized domains
- Check browser console for error messages (F12)

### "Auth/configuration-not-found" error
- Your Firebase config in `.env.local` is incomplete
- Double-check all environment variables are set

### Email/Password sign-in doesn't work
- Make sure Email/Password provider is enabled in Firebase
- Check that you've created a test user account

## Testing Locally

For development, you can create a test user:
1. In Firebase Console, go to **Authentication** > **Users**
2. Click **Add user**
3. Enter email and password
4. Click **Create**
5. Now you can sign in with these credentials in the modal

## Features

The new authentication system includes:
- ✅ Google Sign-In with popup
- ✅ Email/Password authentication
- ✅ Account creation (sign up)
- ✅ Error handling and feedback
- ✅ User profile dropdown
- ✅ Sign out functionality
- ✅ Mobile responsive

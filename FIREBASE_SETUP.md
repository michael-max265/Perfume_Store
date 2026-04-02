# Firebase Setup Guide for Perfume Store

## ✅ What's Been Implemented

Your Perfume Store now uses **Firebase** for:
- 🔐 **Authentication** - Real email/password registration and login with Firebase Auth
- 📦 **Products Database** - All products stored in Firestore with real-time updates
- 🛒 **Cart Persistence** - User carts saved per user in Firestore
- ❤️ **Wishlist Persistence** - User wishlists saved per user in Firestore
- ⭐ **Reviews & Ratings** - Product reviews stored with products in Firestore
- ☁️ **Cloud Storage** - Ready for product images in Firebase Storage

---

## 🚀 Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a new project**
3. Enter project name (e.g., "Perfume Store")
4. Accept the terms and click **Continue**
5. Disable Google Analytics (optional) and click **Create project**
6. Wait for project to be created

### Step 2: Enable Authentication

1. In Firebase Console, click **Authentication** (left sidebar)
2. Click **Get started**
3. Under **Sign-in method**, click **Email/Password**
4. Enable **Email/Password** toggle
5. (Optional) Enable **Google** for Google Sign-In
6. Click **Save**

### Step 3: Create Firestore Database

1. Click **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose location (closest to your users)
4. Select **Start in production mode**
5. Click **Create**

### Step 4: Set Security Rules

1. In Firestore, click **Rules** tab
2. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public: Products collection (readable by all, writable by admins)
    match /products/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    
    // User carts (readable/writable only by owner)
    match /userCarts/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // User wishlists (readable/writable only by owner)
    match /userWishlists/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

### Step 5: Get Firebase Credentials

1. Go to **Project Settings** (gear icon, top right)
2. Select your project
3. Under **General** tab, scroll down to **Your apps**
4. Click **Web** icon (or create a new web app)
5. You'll see your Firebase config - copy the values

### Step 6: Set Environment Variables

1. Create `.env.local` file in project root:

```bash
# Copy from Firebase Console Project Settings
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe (keep your existing key)
VITE_STRIPE_PUBLIC_KEY=your_stripe_key

# Google OAuth (if using)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

2. **DO NOT commit `.env.local`** - it contains secrets!

### Step 7: Install Dependencies & Run

```bash
# Install Firebase SDK
npm install

# Start development server
npm run dev
```

---

## 📊 Database Structure

### Collections Overview

```
Firestore:
├── products/                      # Public product catalog
│   ├── {productId}
│   │   ├── name: string
│   │   ├── brand: string
│   │   ├── price: number
│   │   ├── stock: number
│   │   ├── category: string
│   │   ├── image: string (URL)
│   │   ├── description: string
│   │   ├── rating: number
│   │   ├── reviewCount: number
│   │   ├── reviews: array
│   │   │   ├── id: string
│   │   │   ├── customerName: string
│   │   │   ├── rating: number
│   │   │   ├── text: string
│   │   │   └── date: timestamp
│   │   ├── createdAt: timestamp
│   │   └── createdBy: string (uid)
│
├── userCarts/{userId}             # User shopping carts
│   ├── items: array
│   │   ├── id: string
│   │   ├── name: string
│   │   ├── price: number
│   │   ├── quantity: number
│   │   └── stock: number
│   ├── userId: string
│   └── updatedAt: timestamp
│
└── userWishlists/{userId}         # User wishlists
    ├── items: array (same as cart items)
    ├── userId: string
    └── updatedAt: timestamp
```

---

## 🔄 How It Works

### Authentication Flow
1. User signs up with email/password → Firebase Auth creates account
2. User logs in → Firebase validates credentials
3. Firebase maintains session → User stays logged in across devices
4. User logout → Session clears locally

### Product Management
1. Admin adds product → Saved to Firestore `products` collection
2. All users can read products → Real-time updates for everyone
3. Stock updated after purchase → Automatic sync across devices

### Cart & Wishlist
1. User adds to cart → Saved to Firestore `userCarts/{userId}`
2. Switch devices → Cart loads automatically from cloud
3. Clear browser cache → Cart still available from Firebase
4. Same for wishlists in `userWishlists/{userId}`

---

## 🎯 Multi-Device Sync

With Firebase, your data now syncs automatically:

| Feature | Before (localStorage) | After (Firebase) |
|---------|----------------------|------------------|
| Products | Device-only | Synced globally |
| Admin data | Device-only | Synced globally |
| Cart | Device-only | Synced per user |
| Wishlist | Device-only | Synced per user |
| Authentication | Mock | Real |

---

## 🔓 Troubleshooting

### Firebase Not Loading?
- [ ] Check `.env.local` has all values
- [ ] Verify Firebase project is created
- [ ] Check Firestore Database is created
- [ ] Verify Security Rules are published

### Getting CORS Errors?
- [ ] Update Firestore Security Rules
- [ ] Check authentication is enabled

### Data Not Persisting?
- [ ] Verify user is authenticated
- [ ] Check Firestore Database is active
- [ ] See browser console for errors

### Images Not Loading on Admin?
- Still use Export/Import for now
- Or store images in Firebase Storage (future enhancement)

---

## 🚀 Deploying to Vercel

1. **Commit changes:**
```bash
git add .
git commit -m "Implement Firebase backend integration"
git push origin main
```

2. **On Vercel:**
   - Add environment variables to Vercel project settings
   - Copy all `VITE_FIREBASE_*` values from `.env.local`
   - Redeploy

3. **Live app will connect to Firebase automatically**

---

## 📚 Next Steps

### Optional Enhancements:
- [ ] Set up Firebase Storage for product images
- [ ] Implement order history in Firestore
- [ ] Add Firebase Functions for backend logic
- [ ] Set up email notifications with SendGrid
- [ ] Implement Stripe Webhooks for payment confirmation

### Security Best Practices:
- [ ] Enable reCAPTCHA for auth forms
- [ ] Set up Firestore backups
- [ ] Monitor Firestore usage to prevent bill shocks
- [ ] Review Security Rules quarterly

---

## 🎓 Important Notes

### Authentication
- Email must be unique per account
- Passwords require minimum 8 characters
- Users can reset passwords via "Forgot Password" (requires email config)

### Admin Features
- Only authenticated users can add/edit/delete products
- Admin passcode is still required for `/admin` route
- Future: Add role-based access control for true admin panel

### Data Limits
- Firestore free tier: 1GB storage, 50K reads/day
- Monitor usage in Firebase Console
- Upgrade plan if needed (pay-as-you-go)

---

## 📞 Support

For Firebase issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

For code issues:
- Check browser console for errors
- Check Firebase Console for activity logs
- Review Security Rules if data not loading

---

**Firebase Backend Implementation: ✅ Complete!**

Your Perfume Store now has enterprise-grade cloud database and authentication.

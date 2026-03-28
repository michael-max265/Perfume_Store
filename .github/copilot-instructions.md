# Perfume Store - Copilot Instructions

## Project Overview
A high-quality, responsive React-based e-commerce platform for perfume sales with Firebase backend, Stripe payments, and comprehensive admin features.

## Tech Stack
- **Frontend**: React 18+ with CSS Modules
- **Backend**: Node.js/Express (optional, Firebase handles most backend)
- **Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Payments**: Stripe API
- **Styling**: CSS Modules
- **Deployment**: Vercel

## Key Features
- Product catalog with advanced filtering
- Shopping cart & checkout
- User authentication (signup/login)
- Payment processing (Stripe/PayPal)
- Order management & tracking
- Admin dashboard
- Product reviews & ratings
- Wishlist functionality
- Responsive design (mobile-first)

## Project Structure
```
src/
  ├── components/        # Reusable components
  ├── pages/            # Page components
  ├── services/         # Firebase, API services
  ├── context/          # Context API for state management
  ├── styles/           # CSS Modules
  ├── utils/            # Helper functions
  ├── config/           # Configuration files
  └── App.jsx
public/                 # Static assets
```

## Development Guidelines
1. Use CSS Modules for component styling (one .module.css per component)
2. Implement proper error boundaries
3. Use React Context for global state (cart, auth)
4. Follow component composition patterns
5. Ensure mobile-responsive design (tested at 320px, 768px, 1024px+)
6. Use images only as placeholders (replace with actual product images)
7. Implement proper error handling and loading states
8. Use Firebase for auth, data persistence, and real-time updates

## Running the Project
```
npm install
npm start
```

## Environment Variables
Create `.env.local`:
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_STRIPE_PUBLIC_KEY=
```

# Perfume Store - Premium E-Commerce Platform

A high-quality, responsive React-based e-commerce platform for premium perfumes and fragrances with modern design, advanced features, and seamless shopping experience.

## Features

- 🛍️ **Product Catalog** - Browse premium fragrances with detailed information
- 🔍 **Advanced Filtering** - Filter by category, brand, and price range
- 🛒 **Shopping Cart** - Manage items and calculate totals with tax and shipping
- ❤️ **Wishlist** - Save favorite products for later
- 👤 **User Authentication** - Firebase-powered login and registration
- 💳 **Payment Processing** - Secure Stripe integration
- ⭐ **Product Reviews** - Read and write reviews and ratings
- 📦 **Order Management** - Track orders and delivery status
- 📱 **Responsive Design** - Perfect on mobile (320px), tablet (768px), and desktop
- 🎨 **Premium UI** - Modern design with smooth animations

## Tech Stack

- **Frontend**: React 18+ with Vite
- **State Management**: React Context API
- **Styling**: CSS Modules
- **Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Payments**: Stripe API
- **Routing**: React Router v6
- **Deployment**: Vercel-ready

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Footer with links
│   └── ProductCard.jsx # Product display card
├── pages/              # Page components
│   ├── Home.jsx        # Homepage with featured products
│   ├── Shop.jsx        # Product catalog with filters
│   ├── Cart.jsx        # Shopping cart page
│   └── Wishlist.jsx    # Wishlist page
├── context/            # Context API providers
│   ├── CartContext.jsx     # Cart state management
│   ├── AuthContext.jsx     # Authentication state
│   └── WishlistContext.jsx # Wishlist management
├── services/           # API and Firebase services
├── config/             # Configuration files
│   ├── firebase.js      # Firebase setup
│   └── stripe.js        # Stripe setup
├── styles/             # Global CSS and modules
├── utils/              # Helper functions
└── App.jsx             # Main app component
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase project (for database)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone [Your GitHub URL]
cd perfume-store
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Firebase and Stripe credentials to `.env.local`:
```
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
```

### Development

Run the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Linting

Check code quality:
```bash
npm run lint
npm run lint:fix
```

## Features in Detail

### Home Page
- Beautiful hero section with call-to-action
- Featured products showcase
- Category browsing
- Newsletter subscription form

### Shop Page
- Advanced filtering by category, brand, and price
- Product grid with responsive layout
- Product cards with ratings and reviews
- Quick add-to-cart functionality

### Shopping Cart
- View all items with quantities
- Adjust quantities inline
- Remove items
- Real-time price calculations
- Shipping and tax estimation
- Checkout flow

### Wishlist
- Save favorite perfumes
- Easy management
- Move items to cart

### Premium Design
- Elegant color scheme (warm browns and whites)
- Smooth animations and transitions
- Professional typography
- Accessible UI with proper ARIA labels
- Mobile-first responsive design

## Design System

### Colors
- Primary: #8b5a3c (Warm Brown)
- Secondary: #5d3a26 (Dark Brown)
- Background: #fafafa (Off-white)
- Text: #1a1a1a (Near Black)

### Typography
- Font Family: System fonts optimized for clarity
- Heading Weight: 600-700
- Body Weight: 400-500

## Responsive Breakpoints
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## Performance Optimizations
- Lazy loading for images
- Code splitting with React Router
- Optimized CSS with modules
- Efficient state management

## Best Practices
- Component-based architecture
- Separation of concerns
- Consistent error handling
- Accessibility-first approach
- Clean, maintainable code

## Future Enhancements
- Admin dashboard for product management
- Advanced search with full-text search
- Product recommendations
- Detailed product pages
- Order tracking
- Email notifications
- Multi-language support
- Wishlist sharing

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Commit your changes
3. Push to your branch
4. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@perfumestore.com or create an issue in the repository.

---

Built with ❤️ for perfume enthusiasts worldwide

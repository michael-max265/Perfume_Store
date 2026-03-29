import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import AuthModal from './AuthModal'
import styles from './Header.module.css'

const getInitials = (user) => {
  if (!user) return 'U'
  if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  if (user.displayName) return user.displayName.substring(0, 2).toUpperCase()
  if (user.email) return user.email.substring(0, 2).toUpperCase()
  return 'U'
}

export default function Header() {
  const { getTotalItems, clearCart } = useCart()
  const { user, isAuthenticated, logout, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const totalItems = getTotalItems()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthMenu, setShowAuthMenu] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleSignOut = async () => {
    try {
      await logout()
      clearCart()
      setShowAuthMenu(false)
      closeMenu()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          🌸 Perfume Store
        </Link>

        <nav className={`${styles.navDesktop} ${menuOpen ? styles.menuOpen : ''}`}>
          <ul className={styles.navLinks}>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/shop" onClick={closeMenu}>Shop</Link></li>
            <li><Link to="/pricing" onClick={closeMenu}>Pricing</Link></li>
            <li><Link to="/about" onClick={closeMenu}>About</Link></li>
            <li><Link to="/faq" onClick={closeMenu}>FAQ</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            
            {/* Mobile Auth Links */}
            <li className={styles.mobileAuthOnly}>
              {isAuthenticated ? (
                <button className={styles.navSignOutButton} onClick={handleSignOut}>Sign Out</button>
              ) : (
                <button className={styles.navSignInButton} onClick={() => { closeMenu(); openAuthModal(); }}>Sign In</button>
              )}
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <button onClick={toggleTheme} className={styles.themeToggle} title="Toggle Theme" aria-label="Toggle Theme">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <Link to="/wishlist" className={styles.iconButton} title="Wishlist" onClick={closeMenu}>
            ❤️
          </Link>
          <Link to="/cart" className={styles.iconButton} title="Shopping Cart" onClick={closeMenu}>
            🛒
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className={styles.authMenu}>
              <button 
                className={styles.userButton}
                onClick={() => setShowAuthMenu(!showAuthMenu)}
                title={user?.displayName || user?.email || 'User Account'}
              >
                <div className={styles.userInitials}>{getInitials(user)}</div>
              </button>
              {showAuthMenu && (
                <div className={styles.authDropdown}>
                  <div className={styles.userInfo}>
                    <p><strong>{user?.displayName || 'User'}</strong></p>
                    <p className={styles.userEmail}>{user?.email}</p>
                  </div>
                  <hr />
                  <button className={styles.signOutButton} onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className={styles.signInButton} 
              onClick={openAuthModal}
            >
              Sign In
            </button>
          )}

          <button 
            className={styles.hamburger} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMenu} />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
      />
    </header>
  )
}

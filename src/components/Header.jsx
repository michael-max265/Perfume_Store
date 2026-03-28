import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import styles from './Header.module.css'

export default function Header() {
  const { getTotalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const totalItems = getTotalItems()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthMenu, setShowAuthMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleSignOut = async () => {
    try {
      await logout()
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
          </ul>
        </nav>

        <div className={styles.actions}>
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
                👤 {user?.displayName ? user.displayName.split(' ')[0] : 'User'}
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
              onClick={() => setShowAuthModal(true)}
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
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  )
}

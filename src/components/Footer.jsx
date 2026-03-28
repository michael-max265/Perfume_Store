import { useState } from 'react'
import { subscribeToNewsletter } from '../services/emailService'
import styles from './Footer.module.css'

export default function Footer() {
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | loading | success | error
  const [newsletterMessage, setNewsletterMessage] = useState('');

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>About Us</h3>
          <p>
            Premium fragrances curated for those who appreciate quality and
            elegance. Experience luxury in every bottle.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul className={styles.footerLinks}>
            <li><a href="#home">Home</a></li>
            <li><a href="#shop">Shop</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Customer Service</h3>
          <ul className={styles.footerLinks}>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Newsletter</h3>
          <p>Subscribe to get special offers and updates.</p>
          <form
            className={styles.newsletter}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const email = form.elements[0].value;
              setNewsletterStatus('loading');
              const result = await subscribeToNewsletter(email);
              setNewsletterStatus(result.success ? 'success' : 'error');
              setNewsletterMessage(result.message);
              if (result.success) form.reset();
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              required
            />
            <button type="submit" disabled={newsletterStatus === 'loading'}>
              {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {newsletterStatus === 'success' && (
            <div style={{ color: 'lightgreen', marginTop: '0.5rem', fontSize: '0.95rem' }}>{newsletterMessage}</div>
          )}
          {newsletterStatus === 'error' && (
            <div style={{ color: 'salmon', marginTop: '0.5rem', fontSize: '0.95rem' }}>{newsletterMessage}</div>
          )}
          <div className={styles.socialLinks}>
            <a href="#facebook" aria-label="Facebook">f</a>
            <a href="#twitter" aria-label="Twitter">𝕏</a>
            <a href="#instagram" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2026 Perfume Store. All rights reserved.</p>
      </div>
    </footer>
  )
}

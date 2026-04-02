import { useState, useEffect } from 'react'
import { subscribeToNewsletter } from '../services/emailService'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import styles from './Home.module.css'

export default function Home() {
  const { products, getTotalReviewsFromTopProducts } = useProducts()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [totalTopReviews, setTotalTopReviews] = useState(0)
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | loading | success | error
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    // Get first 4 featured products (highest rated)
    const featured = products.length > 0 ? products.slice(0, 4) : []
    setFeaturedProducts(featured)
    // Auto-calculate total reviews from top products
    const totalReviews = getTotalReviewsFromTopProducts(4)
    setTotalTopReviews(totalReviews)
  }, [products, getTotalReviewsFromTopProducts])

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <video
          className={styles.heroVideo}
          src="/images/perfume-vapor.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Awaken Your Senses<br />With Every Breath
          </h1>
          <p className={styles.heroSubtitle}>
            Step into a world where fragrance is poetry, and every note is a memory in the making.<br />
            Let the sweet, swirling aroma of luxury perfumes embrace you—mysterious, elegant, unforgettable.
          </p>
          <Link to="/shop" className={styles.heroCta}>
            Shop the Collection &rarr;
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Collections</h2>
          {totalTopReviews > 0 && (
            <p className={styles.reviewsCount}>
              ⭐ {totalTopReviews} verified customer review{totalTopReviews !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoriesGrid}>
          <div className={styles.categoryCard}>
            <img
              src="/images/chanel-coco-mademoiselle.jpg"
              alt="Women's Fragrances"
              className={styles.categoryImage}
            />
            <div className={styles.categoryContent}>
              <h3>Women's Fragrances</h3>
              <p>Elegant and captivating scents for every woman</p>
              <Link to="/shop?category=women">Explore →</Link>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <img
              src="/images/ysl-fit-73789.jpg"
              alt="Men's Fragrances"
              className={styles.categoryImage}
            />
            <div className={styles.categoryContent}>
              <h3>Men's Fragrances</h3>
              <p>Strong and sophisticated profiles for gentlemen</p>
              <Link to="/shop?category=men">Explore →</Link>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <img
              src="/images/marc-jacobs-daisy.png"
              alt="Unisex Fragrances"
              className={styles.categoryImage}
            />
            <div className={styles.categoryContent}>
              <h3>Unisex Fragrances</h3>
              <p>Versatile scents for everyone</p>
              <Link to="/shop?category=unisex">Explore →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for exclusive offers and new arrivals</p>
          <form
            className={styles.newsletterForm}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const email = form.elements[0].value;
              setNewsletterStatus('loading');
              const result = await subscribeToNewsletter(email);
              setNewsletterStatus(result.success ? 'success' : 'error');
              setNewsletterMessage(result.message);
              if (result.success) {
                form.reset();
                setTimeout(() => {
                  setNewsletterStatus('idle');
                  setNewsletterMessage('');
                }, 10000);
              }
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
            <div style={{ color: 'green', marginTop: '1rem' }}>{newsletterMessage}</div>
          )}
          {newsletterStatus === 'error' && (
            <div style={{ color: 'red', marginTop: '1rem' }}>{newsletterMessage}</div>
          )}
        </div>
      </section>
    </main>
  )
}

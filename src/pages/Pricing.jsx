import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import styles from './Pricing.module.css'

const PRICE_RANGES = [
  {
    id: 'budget',
    title: 'Budget Friendly',
    range: '$60 - $75',
    description: 'Premium quality at affordable prices',
    min: 60,
    max: 75,
  },
  {
    id: 'mid',
    title: 'Mid-Range',
    range: '$75 - $90',
    description: 'Best value and quality balance',
    min: 75,
    max: 90,
  },
  {
    id: 'premium',
    title: 'Premium',
    range: '$90 - $110',
    description: 'Luxury fragrances with exceptional quality',
    min: 90,
    max: 110,
  },
]

export default function Pricing() {
  const { products } = useProducts()

  const getProductsByPriceRange = (min, max) => {
    return products.filter(
      (product) => product.price >= min && product.price <= max
    )
  }

  const avgPrice = products.length > 0 ? (
    products.reduce((sum, p) => sum + p.price, 0) /
    products.length
  ).toFixed(2) : '0.00'

  return (
    <div className={styles.pricingContainer}>
      <h1 className={styles.pricingTitle}>Our Pricing</h1>
      <p className={styles.pricingSubtitle}>
        Find your perfect fragrance at every price point
      </p>

      {/* Price Statistics */}
      <div className={styles.priceStats}>
        <div className={styles.statCard}>
          <h3>${products.length > 0 ? Math.min(...products.map((p) => p.price)).toFixed(2) : '0.00'}</h3>
          <p>Most Affordable</p>
        </div>
        <div className={styles.statCard}>
          <h3>${avgPrice}</h3>
          <p>Average Price</p>
        </div>
        <div className={styles.statCard}>
          <h3>${products.length > 0 ? Math.max(...products.map((p) => p.price)).toFixed(2) : '0.00'}</h3>
          <p>Most Premium</p>
        </div>
      </div>

      {/* Price Range Sections */}
      {PRICE_RANGES.map((range) => {
        const products = getProductsByPriceRange(range.min, range.max)
        const isBestValue = range.id === 'mid'

        return (
          <div
            key={range.id}
            className={`${styles.pricingSection} ${
              isBestValue ? styles.bestValue : ''
            }`}
          >
            {isBestValue && (
              <div className={styles.bestValueLabel}>
                <FontAwesomeIcon icon={faStar} style={{ marginRight: '0.5rem', color: '#f39c12' }} />
                Best Value
              </div>
            )}

            <div className={styles.sectionHeader}>
              <div>
                <h2>{range.title}</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                  {range.description}
                </p>
              </div>
              <div className={styles.priceRange}>{range.range}</div>
            </div>

            {products.length > 0 ? (
              <div className={styles.grid}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <p>No products available in this price range</p>
              </div>
            )}
          </div>
        )
      })}

      {/* All Products Section */}
      <div className={styles.pricingSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>All Fragrances</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Browse our complete collection
            </p>
          </div>
          <div className={styles.priceRange}>
            All Prices ({products.length} products)
          </div>
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

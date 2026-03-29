import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import styles from './Shop.module.css'

export default function Shop() {
  const { products } = useProducts()
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Dynamically get unique brands
  const uniqueBrands = useMemo(() => {
    const brands = ['all', ...new Set(products.map(p => p.brand))]
    return brands
  }, [products])

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory)
      return false

    if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false

    if (priceRange === 'under50' && product.price >= 50) return false
    if (priceRange === '50-75' && (product.price < 50 || product.price > 75))
      return false
    if (priceRange === '75-100' && (product.price < 75 || product.price > 100))
      return false
    if (priceRange === 'over100' && product.price < 100) return false

    // Search by name (case-insensitive)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      if (!product.name.toLowerCase().includes(query) && 
          !product.brand.toLowerCase().includes(query)) {
        return false
      }
    }

    return true
  })

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is already handled by state, so just ensure focus/accessibility
    // This handler can be extended for additional features like analytics
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className={styles.shopContainer}>
      <h1 className={styles.shopTitle}>Shop Our Collection</h1>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Search by perfume name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className={styles.searchButton}>
            🔍 Search
          </button>
        </form>
      </div>

      <div className={styles.content}>
        <div className={styles.filters}>
          {/* Category Filter */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Category</h3>
            {['all', 'women', 'men', 'unisex'].map((cat) => (
              <div key={cat} className={styles.filterOption}>
                <input
                  type="checkbox"
                  id={`cat-${cat}`}
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                />
                <label htmlFor={`cat-${cat}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              </div>
            ))}
          </div>

          {/* Brand Filter */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brand</h3>
            {uniqueBrands.map((brand) => (
              <div key={brand} className={styles.filterOption}>
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={selectedBrand === brand}
                  onChange={() => setSelectedBrand(brand)}
                />
                <label htmlFor={`brand-${brand}`}>
                  {brand === 'all' ? 'All Brands' : brand}
                </label>
              </div>
            ))}
          </div>

          {/* Price Filter */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Price</h3>
            {[
              { value: 'all', label: 'All Prices' },
              { value: 'under50', label: 'Under $50' },
              { value: '50-75', label: '$50 - $75' },
              { value: '75-100', label: '$75 - $100' },
              { value: 'over100', label: 'Over $100' },
            ].map((price) => (
              <div key={price.value} className={styles.filterOption}>
                <input
                  type="checkbox"
                  id={`price-${price.value}`}
                  checked={priceRange === price.value}
                  onChange={() => setPriceRange(price.value)}
                />
                <label htmlFor={`price-${price.value}`}>{price.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className={styles.noProducts}>
              <p>No products found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

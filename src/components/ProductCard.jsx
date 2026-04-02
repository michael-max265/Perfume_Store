import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getPerfumeImage, getFallbackColor } from '../services/imageService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  const [imageError, setImageError] = useState(false)
  
  const fallbackColor = getFallbackColor(product.id)
  const displayImage = getPerfumeImage(product.name, product.id)

  const handleAddToCart = useCallback(() => {
    addToCart(product)
  }, [addToCart, product])

  const handleProductClick = useCallback(() => {
    navigate(`/product/${product.id}`)
  }, [navigate, product.id])

  const handleWishlistToggle = useCallback((e) => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }, [inWishlist, product, addToWishlist, removeFromWishlist])

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} style={{ backgroundColor: imageError ? fallbackColor : 'transparent' }}>
        {discountPercentage > 0 && (
          <div className={styles.discountBadge}>-{discountPercentage}% OFF</div>
        )}
        {!imageError && (
          <img
            src={displayImage}
            alt={product.name}
            className={styles.image}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        {imageError && (
          <div className={styles.imageFallback}>
            <div style={{ fontSize: '2.5rem' }}>
              <FontAwesomeIcon icon={faHeartSolid} style={{ color: '#e74c3c' }} />
            </div>
            <p>{product.brand}</p>
          </div>
        )}
        <button
          className={`${styles.wishlistButton} ${inWishlist ? styles.active : ''}`}
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FontAwesomeIcon 
            icon={inWishlist ? faHeartSolid : faHeartRegular} 
            style={{ fontSize: '1.25rem' }}
          />
        </button>
      </div>

      <div className={styles.content} onClick={handleProductClick} role="button" tabIndex="0">
        <div className={styles.brand}>{product.brand || 'Premium'}</div>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        {product.rating && (
          <div className={styles.rating}>
            <span className={styles.stars}>
              <FontAwesomeIcon icon={faStarSolid} style={{ color: '#f39c12', marginRight: '0.25rem' }} />
              {product.rating.toFixed(1)}
            </span>
            <span className={styles.reviewCount}>
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.priceArea}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {discountPercentage > 0 && (
              <span className={styles.discount}>-{discountPercentage}%</span>
            )}
          </div>
          {typeof product.stock === 'number' && (
            <div className={styles.stockArea}>
              <span className={product.stock === 0 ? styles.outOfStock : styles.inStock}>
                {product.stock === 0 ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>
          )}
        </div>
        <button
          className={styles.addButton}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
      </div>
      </div>
  )
  }
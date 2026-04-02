import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid, faArrowLeft, faHeart as faHeartSolid, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { getPerfumeImage } from '../services/imageService'
import AuthModal from '../components/AuthModal'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, addReview } = useProducts()
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 5,
    text: ''
  })
  const [imageError, setImageError] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [sortBy, setSortBy] = useState('recent') // recent, helpful, highest, lowest
  const [filterRating, setFilterRating] = useState(0) // 0 = all ratings
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id))
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      navigate('/shop')
    }
  }, [id, products, navigate])

  if (!product) {
    return <div className={styles.loading}>Loading...</div>
  }

  const inWishlist = isInWishlist(product.id)
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const reviews = product.reviews || []

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess(false)

    if (!reviewForm.customerName.trim()) {
      setSubmitError('Please enter your name')
      return
    }
    if (!reviewForm.text.trim()) {
      setSubmitError('Please write a review')
      return
    }
    if (reviewForm.text.trim().length < 10) {
      setSubmitError('Review must be at least 10 characters')
      return
    }

    setIsSubmitting(true)
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      try {
        addReview(product.id, {
          customerName: reviewForm.customerName.trim(),
          rating: parseInt(reviewForm.rating),
          text: reviewForm.text.trim()
        })

        setReviewForm({
          customerName: '',
          rating: 5,
          text: ''
        })
        setSubmitSuccess(true)
        setShowReviewForm(false)
        
        // Auto-close success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000)
      } catch (error) {
        setSubmitError('Failed to submit review. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }, 500)
  }

  const getSortedAndFilteredReviews = () => {
    let filtered = reviews
    
    // Filter by rating
    if (filterRating > 0) {
      filtered = filtered.filter(r => r.rating === filterRating)
    }
    
    // Sort reviews
    switch (sortBy) {
      case 'helpful':
        return filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
      case 'highest':
        return filtered.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return filtered.sort((a, b) => a.rating - b.rating)
      case 'recent':
      default:
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  }

  const handleAddReviewClick = () => {
    if (!user) {
      setShowAuthModal(true)
    } else {
      setShowReviewForm(true)
      setReviewForm(prev => ({
        ...prev,
        customerName: user.displayName || user.email || ''
      }))
    }
  }

  const displayImage = getPerfumeImage(product.name, product.id)

  return (
    <main className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/shop')}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
        Back to Shop
      </button>

      <div className={styles.content}>
        {/* Product Image */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {!imageError ? (
              <img
                src={displayImage}
                alt={product.name}
                className={styles.image}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={styles.imageFallback}>
                <FontAwesomeIcon icon={faHeartSolid} style={{ fontSize: '5rem', color: '#e74c3c' }} />
              </div>
            )}
            {discountPercentage > 0 && (
              <div className={styles.discountBadge}>-{discountPercentage}% OFF</div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div>
              <p className={styles.brand}>{product.brand}</p>
              <h1 className={styles.name}>{product.name}</h1>
            </div>
            <button
              className={`${styles.wishlistButton} ${inWishlist ? styles.active : ''}`}
              onClick={handleWishlistToggle}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FontAwesomeIcon 
                icon={inWishlist ? faHeartSolid : faHeartRegular} 
                size="xl"
              />
            </button>
          </div>

          {/* Rating */}
          <div className={styles.ratingSection}>
            <div className={styles.ratingDisplay}>
              <span className={styles.stars}>
                <FontAwesomeIcon icon={faStarSolid} style={{ color: '#FFD700', marginRight: '0.25rem' }} />
                {product.rating?.toFixed(1) || 'N/A'}
              </span>
              <span className={styles.reviewCount}>
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Product Specs */}
          <div className={styles.specs}>
            {product.category && (
              <div className={styles.spec}>
                <span className={styles.specLabel}>Category:</span>
                <span className={styles.specValue}>{product.category}</span>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className={styles.priceSection}>
            <div className={styles.prices}>
              {product.originalPrice && (
                <span className={styles.originalPrice}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className={styles.currentPrice}>${product.price.toFixed(2)}</span>
              {discountPercentage > 0 && (
                <span className={styles.discountAmount}>Save ${(product.originalPrice - product.price).toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className={styles.stockStatus}>
            <span className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
              {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Section */}
          <div className={styles.actionSection}>
            <div className={styles.quantityControl}>
              <label htmlFor="quantity">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2>Customer Reviews</h2>
          <button
            className={styles.addReviewButton}
            onClick={handleAddReviewClick}
          >
            + Write a Review
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
            <h3>Share Your Thoughts</h3>
            
            {submitError && <div className={styles.error}>{submitError}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                value={reviewForm.customerName}
                onChange={(e) => setReviewForm({
                  ...reviewForm,
                  customerName: e.target.value
                })}
                placeholder="Enter your name"
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({
                  ...reviewForm,
                  rating: parseInt(e.target.value)
                })}
                disabled={isSubmitting}
              >
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★ Very Good</option>
                <option value="3">★★★ Good</option>
                <option value="2">★★ Fair</option>
                <option value="1">★ Poor</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="text">Review</label>
              <textarea
                id="text"
                value={reviewForm.text}
                onChange={(e) => setReviewForm({
                  ...reviewForm,
                  text: e.target.value
                })}
                placeholder="Share your experience with this perfume..."
                rows={5}
                maxLength={1000}
                disabled={isSubmitting}
              />
              <small>{reviewForm.text.length}/1000</small>
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowReviewForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className={styles.success}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '0.5rem' }} />
            Thank you! Your review has been posted successfully.
          </div>
        )}

        {/* Filter and Sort Controls */}
        {reviews.length > 0 && (
          <div className={styles.reviewControls}>
            <div className={styles.sortControl}>
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            <div className={styles.filterControl}>
              <label htmlFor="filter">Filter by rating:</label>
              <select 
                id="filter" 
                value={filterRating} 
                onChange={(e) => setFilterRating(parseInt(e.target.value))}
              >
                <option value="0">All Ratings</option>
                <option value="5">★★★★★ (5 Stars)</option>
                <option value="4">★★★★ (4 Stars)</option>
                <option value="3">★★★ (3 Stars)</option>
                <option value="2">★★ (2 Stars)</option>
                <option value="1">★ (1 Star)</option>
              </select>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className={styles.reviewsList}>
          {reviews.length === 0 ? (
            <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
          ) : getSortedAndFilteredReviews().length === 0 ? (
            <p className={styles.noReviews}>No reviews match your filter. Try a different rating.</p>
          ) : (
            getSortedAndFilteredReviews().map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div>
                    <p className={styles.reviewerName}>{review.customerName}</p>
                    <div className={styles.reviewRating}>
                      {'★'.repeat(review.rating)}
                      <span className={styles.ratingValue}>({review.rating}/5)</span>
                    </div>
                  </div>
                  <p className={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </main>
  )
}

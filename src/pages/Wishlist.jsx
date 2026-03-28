import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import styles from './Wishlist.module.css'

export default function Wishlist() {
  const { wishlist } = useWishlist()

  if (wishlist.length === 0) {
    return (
      <div className={styles.wishlistContainer}>
        <h1 className={styles.wishlistTitle}>My Wishlist</h1>
        <div className={styles.emptyWishlist}>
          <p>Your wishlist is empty</p>
          <Link to="/shop" className={styles.shopButton}>
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wishlistContainer}>
      <h1 className={styles.wishlistTitle}>My Wishlist ({wishlist.length})</h1>
      <div className={styles.grid}>
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Cart.module.css'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart()
  const total = getTotalPrice()

  if (cart.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <h1 className={styles.cartTitle}>Shopping Cart</h1>
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/shop" className={styles.continueShoppingBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Shopping Cart</h1>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img
                src={item.image || '/images/placeholder.jpg'}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.itemDetails}>
                <div className={styles.itemBrand}>{item.brand || 'Premium'}</div>
                <h3 className={styles.itemName}>{item.name}</h3>
                <div className={styles.itemPrice}>
                  ${item.price.toFixed(2)} each
                </div>

                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityButton}
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className={styles.quantityInput}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    min="1"
                    aria-label="Quantity"
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summaryBox}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>

          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>{total > 100 ? 'Free' : '$10.00'}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Tax:</span>
            <span>${(total * 0.08).toFixed(2)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Total:</span>
            <span>${(total + (total > 100 ? 0 : 10) + total * 0.08).toFixed(2)}</span>
          </div>

          <Link to="/checkout" className={styles.checkoutButton}>
            Proceed to Checkout
          </Link>

          <Link
            to="/shop"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '1rem',
              color: '#8b5a3c',
              fontSize: '0.9rem',
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

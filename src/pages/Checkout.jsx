import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const { cart, getTotalPrice } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal()
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate, openAuthModal])

  if (!isAuthenticated) {
    return null
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>Checkout</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
          <h2>Your cart is empty</h2>
          <button 
            onClick={() => navigate('/shop')} 
            style={{ marginTop: '1.5rem', padding: '0.8rem 2rem', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div style={{ backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
            <h2>Payment Stub</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Integration with payment processor coming soon.</p>
            <button 
                onClick={() => alert('Payment functionality is not yet integrated.')}
                style={{ marginTop: '2rem', width: '100%', padding: '1rem', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

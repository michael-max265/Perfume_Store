import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { isAuthenticated, user, openAuthModal } = useAuth()
  const [loadingCart, setLoadingCart] = useState(false)

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      loadCartFromFirestore()
    }
  }, [isAuthenticated, user?.uid])

  const loadCartFromFirestore = async () => {
    if (!user?.uid) return
    try {
      setLoadingCart(true)
      const cartRef = doc(db, 'userCarts', user.uid)
      const cartDoc = await getDoc(cartRef)
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items || [])
      }
    } catch (err) {
      console.error('Error loading cart from Firestore:', err)
    } finally {
      setLoadingCart(false)
    }
  }

  const saveCartToFirestore = async (cartItems) => {
    if (!user?.uid) return
    try {
      const cartRef = doc(db, 'userCarts', user.uid)
      await setDoc(cartRef, {
        items: cartItems,
        updatedAt: new Date(),
        userId: user.uid,
      })
    } catch (err) {
      console.error('Error saving cart to Firestore:', err)
    }
  }

  const addToCart = useCallback((product) => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      
      if (product.stock !== undefined && currentQuantity + 1 > product.stock) {
        alert('Cannot add more items than available in stock!')
        return prevCart;
      }

      let updatedCart
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }]
      }
      
      // Save to Firestore
      saveCartToFirestore(updatedCart)
      return updatedCart
    })
  }, [isAuthenticated, openAuthModal, user?.uid])

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId)
      saveCartToFirestore(updatedCart)
      return updatedCart
    })
  }, [user?.uid])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem && existingItem.stock !== undefined && quantity > existingItem.stock) {
        alert("You've reached the limit! There's no more of this item available in stock.");
        return prevCart;
      }
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCartToFirestore(updatedCart)
      return updatedCart
    });
  }, [removeFromCart, user?.uid])

  const clearCart = useCallback(() => {
    setCart([])
    saveCartToFirestore([])
  }, [user?.uid])

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cart])

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

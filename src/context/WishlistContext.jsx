import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const { isAuthenticated, openAuthModal } = useAuth()

  const addToWishlist = useCallback((product) => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item.id === product.id)
      if (exists) {
        return prevWishlist
      }
      return [...prevWishlist, product]
    })
  }, [isAuthenticated, openAuthModal])

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    )
  }, [])

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId)
  }, [wishlist])

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

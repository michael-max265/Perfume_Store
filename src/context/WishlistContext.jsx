import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const { isAuthenticated, user, openAuthModal } = useAuth()
  const [loadingWishlist, setLoadingWishlist] = useState(false)

  // Load wishlist from Firestore when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      loadWishlistFromFirestore()
    }
  }, [isAuthenticated, user?.uid])

  const loadWishlistFromFirestore = async () => {
    if (!user?.uid) return
    try {
      setLoadingWishlist(true)
      const wishlistRef = doc(db, 'userWishlists', user.uid)
      const wishlistDoc = await getDoc(wishlistRef)
      if (wishlistDoc.exists()) {
        setWishlist(wishlistDoc.data().items || [])
      }
    } catch (err) {
      console.error('Error loading wishlist from Firestore:', err)
    } finally {
      setLoadingWishlist(false)
    }
  }

  const saveWishlistToFirestore = async (wishlistItems) => {
    if (!user?.uid) return
    try {
      const wishlistRef = doc(db, 'userWishlists', user.uid)
      await setDoc(wishlistRef, {
        items: wishlistItems,
        updatedAt: new Date(),
        userId: user.uid,
      })
    } catch (err) {
      console.error('Error saving wishlist to Firestore:', err)
    }
  }

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
      const updatedWishlist = [...prevWishlist, product]
      saveWishlistToFirestore(updatedWishlist)
      return updatedWishlist
    })
  }, [isAuthenticated, openAuthModal, user?.uid])

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter((item) => item.id !== productId)
      saveWishlistToFirestore(updatedWishlist)
      return updatedWishlist
    })
  }, [user?.uid])

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId)
  }, [wishlist])

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loadingWishlist,
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

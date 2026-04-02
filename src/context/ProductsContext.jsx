import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { PERFUME_PRODUCTS } from '../data/products'
import { useAuth } from './AuthContext'

const ProductsContext = createContext()

export function useProducts() {
  return useContext(ProductsContext)
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // Initialize products on mount
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const productsRef = collection(db, 'products')
      const snapshot = await getDocs(productsRef)
      
      if (snapshot.empty) {
        // Initialize with default products if collection is empty
        await initializeDefaultProducts()
      } else {
        const loadedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(loadedProducts)
      }
    } catch (err) {
      console.error('Error loading products:', err)
      setError(err.message)
      // Fallback to mock data on error
      setProducts(PERFUME_PRODUCTS.map((p, idx) => ({ ...p, id: idx })))
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultProducts = async () => {
    try {
      const productsRef = collection(db, 'products')
      
      for (const product of PERFUME_PRODUCTS) {
        await addDoc(productsRef, {
          ...product,
          stock: product.stock || 10,
          reviews: [],
          createdAt: new Date(),
        })
      }
      
      // Reload products after initialization
      await loadProducts()
    } catch (err) {
      console.error('Error initializing default products:', err)
      setError(err.message)
    }
  }

  const addProduct = useCallback(async (productData) => {
    if (!user) {
      setError('Must be logged in to add products')
      return
    }

    try {
      setError(null)
      const productsRef = collection(db, 'products')
      
      const docRef = await addDoc(productsRef, {
        ...productData,
        reviews: [],
        createdAt: new Date(),
        createdBy: user.uid,
        stock: productData.stock || 10,
      })

      // Add to local state
      setProducts(prev => [...prev, { id: docRef.id, ...productData }])
      return docRef.id
    } catch (err) {
      console.error('Error adding product:', err)
      setError(err.message)
      throw err
    }
  }, [user])

  const deleteProduct = useCallback(async (id) => {
    if (!user) {
      setError('Must be logged in to delete products')
      return
    }

    try {
      setError(null)
      const productRef = doc(db, 'products', id)
      await deleteDoc(productRef)
      
      // Remove from local state
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err.message)
      throw err
    }
  }, [user])

  const updateProduct = useCallback(async (id, updatedData) => {
    if (!user) {
      setError('Must be logged in to update products')
      return
    }

    try {
      setError(null)
      const productRef = doc(db, 'products', id)
      
      await updateDoc(productRef, {
        ...updatedData,
        updatedAt: new Date(),
      })
      
      // Update local state
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updatedData } : p))
      )
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.message)
      throw err
    }
  }, [user])

  const purchaseItems = useCallback(async (cartItems) => {
    try {
      setError(null)
      
      // Update each product's stock
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.id)
        const productDoc = await getDoc(productRef)
        
        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock || 0
          await updateDoc(productRef, {
            stock: Math.max(0, currentStock - item.quantity),
          })
        }
      }
      
      // Reload products to sync
      await loadProducts()
    } catch (err) {
      console.error('Error purchasing items:', err)
      setError(err.message)
      throw err
    }
  }, [])

  const addReview = useCallback(async (productId, reviewData) => {
    try {
      setError(null)
      const productRef = doc(db, 'products', productId)
      const productDoc = await getDoc(productRef)
      
      if (!productDoc.exists()) {
        throw new Error('Product not found')
      }

      const newReview = {
        id: Date.now().toString(),
        ...reviewData,
        date: new Date().toISOString(),
      }

      // Add review to product
      await updateDoc(productRef, {
        reviews: arrayUnion(newReview),
      })

      // Calculate and update average rating
      const currentProduct = productDoc.data()
      const allReviews = [...(currentProduct.reviews || []), newReview]
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      await updateDoc(productRef, {
        rating: avgRating,
        reviewCount: allReviews.length,
      })

      // Update local state
      setProducts(prev =>
        prev.map(p => {
          if (p.id === productId) {
            return {
              ...p,
              reviews: [...(p.reviews || []), newReview],
              rating: avgRating,
              reviewCount: allReviews.length,
            }
          }
          return p
        })
      )
    } catch (err) {
      console.error('Error adding review:', err)
      setError(err.message)
      throw err
    }
  }, [])

  const value = {
    products,
    loading,
    error,
    addProduct,
    deleteProduct,
    updateProduct,
    purchaseItems,
    addReview,
    loadProducts,
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

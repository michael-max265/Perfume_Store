import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERFUME_PRODUCTS } from '../data/products';

const ProductsContext = createContext();

export function useProducts() {
  return useContext(ProductsContext);
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize stock for the hardcoded fallback list
      const initialProducts = PERFUME_PRODUCTS.map(p => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : 10
      }));
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now() // Simple unique ID generation
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id, updatedData) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updatedData } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const purchaseItems = (cartItems) => {
    setProducts((prev) => {
      const newProducts = prev.map(p => {
        const cartItem = cartItems.find(item => item.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
      localStorage.setItem('products', JSON.stringify(newProducts));
      return newProducts;
    });
  };

  const addReview = (productId, review) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const reviews = product.reviews || [];
        const updatedReviews = [...reviews, {
          id: Date.now(),
          ...review,
          date: new Date().toISOString()
        }];
        
        // Calculate average rating
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        
        return {
          ...product,
          reviews: updatedReviews,
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: updatedReviews.length
        };
      }
      return product;
    });
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const getTotalReviewsFromTopProducts = (topProductCount = 4) => {
    return products.slice(0, topProductCount).reduce((total, product) => {
      return total + (product.reviewCount || 0);
    }, 0);
  };

  const getTotalReviewsCount = () => {
    return products.reduce((total, product) => {
      return total + (product.reviewCount || 0);
    }, 0);
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      addProduct, 
      deleteProduct, 
      updateProduct, 
      purchaseItems, 
      addReview,
      getTotalReviewsFromTopProducts,
      getTotalReviewsCount
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

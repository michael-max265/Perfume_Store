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

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, purchaseItems }}>
      {children}
    </ProductsContext.Provider>
  );
}

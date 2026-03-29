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
      setProducts(PERFUME_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(PERFUME_PRODUCTS));
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

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

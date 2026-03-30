import { useState } from 'react'
import { useProducts } from '../context/ProductsContext'
import styles from './Admin.module.css'

export default function Admin() {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts()
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: 'women',
    image: '',
    stock: 10,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description || '',
      category: product.category || 'women',
      image: product.image || '',
      stock: product.stock !== undefined ? product.stock : 10,
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const numericData = {
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    }

    if (editingId) {
      updateProduct(editingId, { ...formData, ...numericData });
    } else {
      const newProduct = {
        ...formData,
        ...numericData,
        rating: 5.0, // Default rating for new products
        reviewCount: 0,
      }
      addProduct(newProduct)
    }
    
    // Reset form
    setFormData({
      name: '',
      brand: '',
      price: '',
      description: '',
      category: 'women',
      image: '',
      stock: 10,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <button 
          className={styles.addButton}
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              setFormData({ name: '', brand: '', price: '', description: '', category: 'women', image: '', stock: 10 });
            }
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>{editingId ? 'Edit Perfume' : 'Add New Perfume'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Perfume Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="brand">Brand</label>
                <input 
                  type="text" 
                  id="brand" 
                  name="brand" 
                  value={formData.brand} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="price">Price ($)</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  step="0.01" 
                  min="0"
                  value={formData.price} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="category">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="stock">Stock Quantity</label>
                <input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  min="0"
                  value={formData.stock} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="image">Image URL</label>
                <input 
                  type="url" 
                  id="image" 
                  name="image" 
                  placeholder="https://..."
                  value={formData.image} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', brand: '', price: '', description: '', category: 'women', image: '', stock: 10 });
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                <td>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                <td>{product.stock}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className={styles.addButton}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => {
                        if(window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                          deleteProduct(product.id)
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  No products found. Add some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

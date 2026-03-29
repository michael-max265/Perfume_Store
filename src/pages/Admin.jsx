import { useState } from 'react'
import { useProducts } from '../context/ProductsContext'
import styles from './Admin.module.css'

export default function Admin() {
  const { products, addProduct, deleteProduct } = useProducts()
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: 'women',
    image: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      rating: 5.0, // Default rating for new products
      reviewCount: 0,
    }
    
    addProduct(newProduct)
    
    // Reset form
    setFormData({
      name: '',
      brand: '',
      price: '',
      description: '',
      category: 'women',
      image: '',
    })
    setShowForm(false)
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Add New Perfume</h2>
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
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Save Product
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
                <td>${product.price.toFixed(2)}</td>
                <td>
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

import { useState } from 'react'
import { useProducts } from '../context/ProductsContext'
import styles from './Admin.module.css'

export default function Admin() {
  const { products, addProduct, deleteProduct, updateProduct, addReview } = useProducts()
  
  const [showForm, setShowForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
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
  const [reviewData, setReviewData] = useState({
    productId: '',
    customerName: '',
    rating: 5,
    reviewText: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target
    setReviewData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    
    if (!reviewData.productId || !reviewData.customerName || !reviewData.reviewText) {
      alert('Please fill in all review fields')
      return
    }

    addReview(parseInt(reviewData.productId), {
      customerName: reviewData.customerName,
      rating: reviewData.rating,
      text: reviewData.reviewText,
    })

    // Reset form
    setReviewData({
      productId: '',
      customerName: '',
      rating: 5,
      reviewText: '',
    })
    setShowReviewForm(false)
    alert('Review added successfully!')
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
        <div className={styles.buttonGroup}>
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
          <button 
            className={styles.reviewButton}
            onClick={() => {
              if (showReviewForm) {
                setReviewData({ productId: '', customerName: '', rating: 5, reviewText: '' });
              }
              setShowReviewForm(!showReviewForm)
            }}
          >
            {showReviewForm ? 'Cancel' : 'Add Review'}
          </button>
        </div>
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

      {showReviewForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Add New Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="productId">Select Product</label>
                <select 
                  id="productId" 
                  name="productId" 
                  value={reviewData.productId} 
                  onChange={handleReviewInputChange}
                  required
                >
                  <option value="">-- Choose a product --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="customerName">Customer Name</label>
                <input 
                  type="text" 
                  id="customerName" 
                  name="customerName" 
                  value={reviewData.customerName} 
                  onChange={handleReviewInputChange} 
                  placeholder="e.g., John Doe"
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="rating">Rating (1-5 stars)</label>
                <select 
                  id="rating" 
                  name="rating" 
                  value={reviewData.rating} 
                  onChange={handleReviewInputChange}
                >
                  <option value="5">★★★★★ 5 Stars</option>
                  <option value="4">★★★★ 4 Stars</option>
                  <option value="3">★★★ 3 Stars</option>
                  <option value="2">★★ 2 Stars</option>
                  <option value="1">★ 1 Star</option>
                </select>
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="reviewText">Review Text</label>
                <textarea 
                  id="reviewText" 
                  name="reviewText" 
                  value={reviewData.reviewText} 
                  onChange={handleReviewInputChange}
                  placeholder="Write the review here..."
                  rows="4"
                  required 
                />
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setReviewData({ productId: '', customerName: '', rating: 5, reviewText: '' });
                  setShowReviewForm(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Add Review
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
                      style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleEdit(product)}
                      title="Edit"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button 
                      className={styles.deleteButton}
                      style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => {
                        if(window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                          deleteProduct(product.id)
                        }
                      }}
                      title="Delete"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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

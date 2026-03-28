import { useState } from 'react'
import styles from './Contact.module.css'
import { sendContactEmail } from '../services/emailService'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [statusType, setStatusType] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatusMessage(null)

    const result = await sendContactEmail(formData)

    if (result.success) {
      setStatusType('success')
      setStatusMessage(result.message)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } else {
      setStatusType('error')
      setStatusMessage(result.message)
    }

    setIsLoading(false)

    // Clear message after 5 seconds
    setTimeout(() => {
      setStatusMessage(null)
    }, 5000)
  }

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.contactTitle}>Contact Us</h1>

      <div className={styles.contactContent}>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>Get in Touch</h2>

          {statusMessage && (
            <div className={`${styles.statusMessage} ${styles[statusType]}`}>
              {statusType === 'success' ? '✓' : '✕'} {statusMessage}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className={styles.contactInfo}>
          <div className={styles.infoCard}>
            <h3>📍 Address</h3>
            <p>123 Piooner Avenue<br />Independence Layout Enugu<br />NIGERIA</p>
          </div>

          <div className={styles.infoCard}>
            <h3>📞 Phone</h3>
            <p><a href="tel:+234 9154047646">+234 9154047646</a></p>
          </div>

          <div className={styles.infoCard}>
            <h3>📧 Email</h3>
            <p><a href="mailto:okparachukwukamichael@gmail.com">okparachukwukamichael@gmail.com</a></p>
          </div>

          <div className={styles.hoursSection}>
            <h3>⏰ Business Hours</h3>
            <ul className={styles.hoursList}>
              <li>
                <span>Monday - Friday</span>
                <span className={styles.status}>9:00 AM - 6:00 PM</span>
              </li>
              <li>
                <span>Saturday</span>
                <span className={styles.status}>10:00 AM - 4:00 PM</span>
              </li>
              <li>
                <span>Sunday</span>
                <span className={`${styles.status} ${styles.closed}`}>Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

     
    </div>
  )
}

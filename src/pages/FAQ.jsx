import { useState } from 'react'
import styles from './FAQ.module.css'

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all unopened fragrances. If you\'re not satisfied with your purchase, you can return it within 30 days of receipt for a full refund. Please ensure the product is in its original condition with original packaging.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 5-7 business days. We also offer expedited shipping (2-3 business days) and overnight shipping options at checkout. International orders may take 7-14 business days depending on destination.'
    },
    {
      question: 'Are your fragrances authentic?',
      answer: 'Yes, 100% authentic! We source all our products directly from authorized distributors and brand partners. Each product comes with authenticity verification and is backed by our satisfaction guarantee.'
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Absolutely! We offer complimentary gift wrapping for all orders. You can select the gift wrap option during checkout, and we\'ll include a personalized message card if you\'d like.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All payments are secure and encrypted with SSL technology.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive an email with a tracking number. You can use this number to track your package on our website or directly through the carrier\'s website. Live tracking is available 24/7.'
    },
    {
      question: 'Can I change or cancel my order?',
      answer: 'Yes, you can modify or cancel your order within 1 hour of placing it. After that, the order will be in preparation for shipment and cannot be changed. Please contact our customer service team for assistance.'
    },
    {
      question: 'Do you have a loyalty program?',
      answer: 'Yes! Join our Perfume Rewards program to earn points on every purchase. Earn 0.5 point per dollar spent and redeem your points for discounts on future purchases. Sign up is free and automatic for all customers.'
    },
    {
      question: 'What if the fragrance doesn\'t arrive intact?',
      answer: 'We pack all fragrances carefully to prevent damage during transit. However, if your product arrives damaged, please contact us within 24 hours with photos. We\'ll send a replacement immediately at no cost to you.'
    },
    {
      question: 'How do I know which fragrance is right for me?',
      answer: 'Take our Fragrance Quiz on the Shop page to discover scents matching your preferences. You can also filter by fragrance family, brand, or price. Our customer reviews include detailed scent descriptions to help you decide.'
    },
    {
      question: 'Do you have a physical store?',
      answer: 'Currently, we operate online only to provide the best pricing for our customers. However, we\'re expanding! Sign up for our newsletter to be notified when new locations open.'
    }
  ]

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqContent}>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => toggleExpand(index)}
              >
                <span>{faq.question}</span>
                <span className={`${styles.icon} ${expandedIndex === index ? styles.expanded : ''}`}>
                  ▼
                </span>
              </button>
              {expandedIndex === index && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.faqSidebar}>
          <div className={styles.contactCard}>
            <h3>Still Have Questions?</h3>
            <p>Our customer service team is here to help!</p>
            <div className={styles.contactOptions}>
              <div className={styles.contactOption}>
                <span className={styles.icon}>📧</span>
                <div>
                  <strong>Email</strong>
                  <p>okparachukwukamichael@gmail.com</p>
                </div>
              </div>
              <div className={styles.contactOption}>
                <span className={styles.icon}>💬</span>
                <div>
                  <strong>Live Chat</strong>
                  <p>Available 9am-9pm WAT</p>
                </div>
              </div>
              <div className={styles.contactOption}>
                <span className={styles.icon}>📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>09154047646</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/shop">Browse Products</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="#returns">Returns & Exchanges</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruck, faStar, faGift, faGem, faSync } from '@fortawesome/free-solid-svg-icons'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>About Perfume Store</h1>

      <div className={styles.aboutSection}>
        <h2>Our Story</h2>
        <p>
          Founded in 2020, Perfume Store has been dedicated to bringing the finest
          fragrances from around the world to perfume enthusiasts everywhere. We believe
          that a great fragrance is more than just a scent—it's an experience, a memory,
          and a reflection of personal style.
        </p>
        <p>
          Our carefully curated collection features premium perfumes from both established
          and emerging fragrance houses. Each product is selected for its quality, uniqueness,
          and ability to captivate the senses. We work directly with brands to ensure
          authenticity and offer our customers the best prices possible.
        </p>
      </div>

      <div className={styles.aboutSection}>
        <h2>Our Mission</h2>
        <p>
          Our mission is to make premium fragrances accessible to everyone. We're committed
          to providing an exceptional shopping experience, expert guidance, and the highest
          quality products. Whether you're looking for a signature scent or exploring new
          fragrances, we're here to help you find your perfect match.
        </p>
      </div>

      <div className={styles.aboutSection}>
        <h2>Why Choose Us?</h2>
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <h3>🔒 Authenticity</h3>
            <p>100% genuine products, guaranteed</p>
          </div>
          <div className={styles.featureItem}>
            <h3><FontAwesomeIcon icon={faTruck} style={{ marginRight: '0.5rem' }} />Fast Shipping</h3>
            <p>Free shipping on orders over $100</p>
          </div>
          <div className={styles.featureItem}>
            <h3><FontAwesomeIcon icon={faStar} style={{ marginRight: '0.5rem', color: '#FFD700' }} />Expert Curation</h3>
            <p>Handpicked fragrances for quality</p>
          </div>
          <div className={styles.featureItem}>
            <h3><FontAwesomeIcon icon={faGift} style={{ marginRight: '0.5rem', color: '#e74c3c' }} />Customer Service</h3>
            <p>24/7 support for your needs</p>
          </div>
          <div className={styles.featureItem}>
            <h3><FontAwesomeIcon icon={faSync} style={{ marginRight: '0.5rem' }} />Easy Returns</h3>
            <p>30-day satisfaction guarantee</p>
          </div>
          <div className={styles.featureItem}>
            <h3><FontAwesomeIcon icon={faGem} style={{ marginRight: '0.5rem', color: '#9b59b6' }} />Exclusive Offers</h3>
            <p>Member-only deals and discounts</p>
          </div>
        </div>
      </div>

      <div className={styles.aboutSection}>
        <h2>Our Team</h2>
        <p>
          Our team consists of fragrance enthusiasts, perfumery experts, and dedicated
          customer service professionals who share a passion for bringing joy through scent.
        </p>
        <div className={styles.teamGrid}>
          <div className={styles.teamMember}>
            <h3>Sarah Mitchell</h3>
            <div className={styles.role}>Founder & CEO</div>
            <p>Fragrance expert with 10+ years of experience in the industry</p>
          </div>
          <div className={styles.teamMember}>
            <h3>James Chen</h3>
            <div className={styles.role}>Chief Curator</div>
            <p>Specializes in sourcing rare and exclusive fragrances</p>
          </div>
          <div className={styles.teamMember}>
            <h3>Emma Rodriguez</h3>
            <div className={styles.role}>Customer Relations</div>
            <p>Dedicated to ensuring every customer is satisfied</p>
          </div>
        </div>
      </div>

      <div className={styles.aboutSection}>
        <h2>Sustainability</h2>
        <p>
          We're committed to sustainability and ethical practices. We partner with brands
          that share our values and use eco-friendly packaging where possible. Together,
          we're working towards a more sustainable future for our industry.
        </p>
      </div>
    </div>
  )
}

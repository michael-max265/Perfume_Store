import React, { useState } from 'react';
import styles from './Checkout.module.css';

const CRYPTO_OPTIONS = [
  'Bitcoin', 'Ethereum', 'USDT', 'BNB', 'Solana', 'XRP', 'Dogecoin', 'Cardano', 'Polygon', 'Tron',
  'Litecoin', 'Polkadot', 'Avalanche', 'Shiba Inu', 'Chainlink'
];

const FIAT_OPTIONS = [
  { label: 'Naira (₦)', value: 'ngn' },
  { label: 'US Dollar ($)', value: 'usd' },
  { label: 'Euro (€)', value: 'eur' }
];

const CARD_OPTIONS = [
  'Visa', 'MasterCard', 'Verve', 'American Express', 'Discover', 'JCB', 'Diners Club', 'UnionPay'
];

function generateWalletAddress(crypto) {
  // Simulate wallet address generation
  return crypto.slice(0, 3).toUpperCase() + Math.random().toString(36).slice(2, 12).toUpperCase();
}

export default function Checkout() {
  const [paymentType, setPaymentType] = useState('fiat');
  const [fiatCurrency, setFiatCurrency] = useState('ngn');
  const [cardType, setCardType] = useState('Visa');
  const [cryptoType, setCryptoType] = useState(CRYPTO_OPTIONS[0]);
  const [walletAddress, setWalletAddress] = useState(generateWalletAddress(CRYPTO_OPTIONS[0]));

  const handleCryptoChange = (e) => {
    setCryptoType(e.target.value);
    setWalletAddress(generateWalletAddress(e.target.value));
  };

  return (
    <div className={styles.checkoutContainer}>
      {/* Hero image removed as requested */}
      <h2>Checkout</h2>
      <div className={styles.paymentSection}>
        <label>
          <input
            type="radio"
            name="paymentType"
            value="fiat"
            checked={paymentType === 'fiat'}
            onChange={() => setPaymentType('fiat')}
          />
          Pay with Card (Fiat)
        </label>
        <label>
          <input
            type="radio"
            name="paymentType"
            value="crypto"
            checked={paymentType === 'crypto'}
            onChange={() => setPaymentType('crypto')}
          />
          Pay with Crypto
        </label>
      </div>

      {paymentType === 'fiat' && (
        <div className={styles.fiatSection}>
          <div className={styles.fiatOptionsRow}>
            {FIAT_OPTIONS.map(opt => (
              <div
                key={opt.value}
                className={
                  styles.fiatOptionBox +
                  (fiatCurrency === opt.value ? ' ' + styles.selected : '')
                }
                onClick={() => setFiatCurrency(opt.value)}
                tabIndex={0}
                role="button"
                aria-pressed={fiatCurrency === opt.value}
              >
                {opt.label}
              </div>
            ))}
          </div>
          <label className={styles.cardLabel}>
            Card Type:
            <select style={{marginLeft: "30px", width: "200px"}} value={cardType} onChange={e => setCardType(e.target.value)}>
              {CARD_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <div style={{marginBottom: '1.2rem'}}></div>
          <input type="text" placeholder="Card Number" className={styles.input} />
          <input type="text" placeholder="Cardholder Name" className={styles.input} />
          <div className={styles.cardRow}>
            <input type="text" placeholder="Expiry (MM/YY)" className={styles.input} style={{width:'48%'}} />
            <input type="text" placeholder="CVV" className={styles.input} style={{width:'48%'}} />
          </div>
        </div>
      )}

      {paymentType === 'crypto' && (
        <div className={styles.cryptoSection}>
          <label>
            Cryptocurrency:
            <select value={cryptoType} onChange={handleCryptoChange}>
              {CRYPTO_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <div className={styles.walletBox}>
            <span>Wallet Address:</span>
            <span className={styles.walletAddress}>{walletAddress}</span>
          </div>
        </div>
      )}

      <button className={styles.payButton}>Pay Now</button>
    </div>
  );
}

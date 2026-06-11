import React from 'react';
import { CreditCard, Truck, Landmark } from 'lucide-react';

const PaymentMethods = ({
  paymentMethod,
  setPaymentMethod,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  upiId,
  setUpiId
}) => {
  return (
    <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-gray)', marginBottom: '0.75rem' }}>
        2. Payment Method
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {/* Cash on Delivery */}
        <div 
          className={`checkout-payment-box ${paymentMethod === 'COD' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('COD')}
        >
          <Truck style={{ color: 'var(--fk-blue)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cash On Delivery</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>Pay cash when delivered</span>
          </div>
        </div>

        {/* Debit/Credit card selection */}
        <div 
          className={`checkout-payment-box ${paymentMethod === 'CARD' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('CARD')}
        >
          <CreditCard style={{ color: 'var(--fk-blue)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Card Payment</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>Debit or credit card</span>
          </div>
        </div>

        {/* UPI Option */}
        <div 
          className={`checkout-payment-box ${paymentMethod === 'UPI' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('UPI')}
        >
          <Landmark style={{ color: 'var(--fk-blue)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>UPI / NetBanking</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>Instant mock UPI payment</span>
          </div>
        </div>
      </div>

      {/* Render Mock Inputs details based on chosen method */}
      {paymentMethod === 'CARD' && (
        <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '4px', marginTop: '1rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Card Number</label>
            <input
              type="text"
              className="form-input"
              style={{ padding: '0.5rem' }}
              placeholder="4000 1234 5678 9010"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Expiry Date</label>
            <input
              type="text"
              className="form-input"
              style={{ padding: '0.5rem' }}
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>CVV</label>
            <input
              type="password"
              maxLength="3"
              className="form-input"
              style={{ padding: '0.5rem' }}
              placeholder="123"
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value)}
            />
          </div>
        </div>
      )}

      {paymentMethod === 'UPI' && (
        <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>UPI Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="username@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;

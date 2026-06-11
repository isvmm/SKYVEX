import React from 'react';

const CartSummary = ({
  cart,
  subtotal,
  coupon,
  discountAmount,
  shippingFee,
  finalTotal
}) => {
  return (
    <div className="cart-sidebar-card">
      <div className="sidebar-title">Price Details</div>
      
      <div className="price-summary-row">
        <span>Price ({cart.length} items)</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      {coupon && (
        <div className="price-summary-row" style={{ color: 'var(--success)', fontWeight: 500 }}>
          <span>Discount ({coupon.code})</span>
          <span>-₹{discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="price-summary-row">
        <span>Delivery Charges</span>
        <span>{shippingFee === 0 ? <span style={{ color: 'var(--success)', fontWeight: 500 }}>FREE</span> : `₹${shippingFee}`}</span>
      </div>

      <div className="price-summary-row total">
        <span>Total Amount</span>
        <span>₹{finalTotal.toFixed(2)}</span>
      </div>

      {shippingFee > 0 && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-gray)', marginTop: '0.75rem', textAlign: 'center' }}>
          Add ₹{(499 - subtotal).toFixed(2)} more of products to get <strong>FREE Delivery</strong>!
        </div>
      )}
    </div>
  );
};

export default CartSummary;

import React from 'react';

const OrderSummary = ({ cart, subtotal, coupon, discountAmount, shippingFee, finalTotal }) => {
  return (
    <div>
      <div className="cart-sidebar-card" style={{ marginBottom: '1rem' }}>
        <div className="sidebar-title">Order Summary</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                <div style={{ color: 'var(--text-gray)', fontSize: '0.75rem' }}>
                  Qty: {item.quantity} | Size: {item.size} {item.color ? `| Color: ${item.color}` : ''}
                </div>
              </div>
              <span style={{ fontWeight: 600 }}>₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Price Summary */}
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
          <span>Total Payable</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

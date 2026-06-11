import React from 'react';

const CouponForm = ({
  coupon,
  couponCodeInput,
  setCouponCodeInput,
  couponLoading,
  couponMsg,
  handleApplyCoupon,
  handleRemoveCoupon
}) => {
  return (
    <div className="cart-sidebar-card" style={{ marginBottom: '1rem' }}>
      <div className="sidebar-title">Apply Coupons</div>
      {coupon ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--success-glow)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--success)' }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{coupon.code}</span> applied
          </div>
          <button 
            onClick={handleRemoveCoupon}
            style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 600, cursor: 'pointer' }}
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="coupon-form">
          <input
            type="text"
            className="coupon-input"
            placeholder="Enter Code (e.g. EZEE10)"
            value={couponCodeInput}
            onChange={(e) => setCouponCodeInput(e.target.value)}
            required
          />
          <button type="submit" className="coupon-btn" disabled={couponLoading}>
            {couponLoading ? '...' : 'APPLY'}
          </button>
        </form>
      )}

      {couponMsg && (
        <div 
          style={{ 
            fontSize: '0.8rem', 
            marginTop: '0.5rem', 
            color: couponMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
            fontWeight: 500 
          }}
        >
          {couponMsg.text}
        </div>
      )}
    </div>
  );
};

export default CouponForm;

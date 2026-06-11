import React from 'react';

const CouponForm = ({
  handleSubmit,
  code,
  setCode,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  minCartValue,
  setMinCartValue,
  expiryDate,
  setExpiryDate,
  loading,
  setShowForm
}) => {
  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-title">Create Discount Coupon</div>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Coupon Code *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. EZEE20"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Discount Type *</label>
          <select 
            className="form-select"
            value={discountType}
            onChange={(e) => { setDiscountType(e.target.value); setDiscountValue(''); }}
          >
            <option value="percent">Percentage Discount (%)</option>
            <option value="amount">Flat Amount Discount (₹)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            {discountType === 'percent' ? 'Discount Percentage (%) *' : 'Discount Flat Amount (INR) *'}
          </label>
          <input
            type="number"
            min="1"
            max={discountType === 'percent' ? '100' : undefined}
            className="form-input"
            placeholder={discountType === 'percent' ? 'e.g. 20' : 'e.g. 150'}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Minimum Purchase Requirement (INR)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            placeholder="e.g. 499"
            value={minCartValue}
            onChange={(e) => setMinCartValue(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Expiry Date *</label>
          <input
            type="date"
            className="form-input"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;

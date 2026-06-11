import React from 'react';

const ShippingForm = ({
  customerName,
  setCustomerName,
  email,
  setEmail,
  phone,
  setPhone,
  postalCode,
  setPostalCode,
  address,
  setAddress,
  city,
  setCity
}) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-gray)', marginBottom: '0.75rem' }}>
        1. Delivery Address
      </h3>
      
      <div className="checkout-form-grid">
        <div className="form-group">
          <label className="form-label">Customer Full Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. John Doe"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            className="form-input"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mobile Number *</label>
          <input
            type="tel"
            className="form-input"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pincode / Postal Code *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 400001"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Street Address *</label>
          <textarea
            className="form-textarea"
            style={{ minHeight: '60px' }}
            placeholder="Flat/House No., Building Name, Street details..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">City *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Mumbai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;

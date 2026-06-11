import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CouponForm from './components/CouponForm';
import CouponTable from './components/CouponTable';

const CouponManager = ({ apiBase }) => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percent'); // percent or amount
  const [discountValue, setDiscountValue] = useState('');
  const [minCartValue, setMinCartValue] = useState('0');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${apiBase}/coupons`);
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !discountValue || !expiryDate) {
      triggerAlert('error', 'Please fill in code, discount value, and expiry date.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        code: code.toUpperCase().trim(),
        minCartValue: parseFloat(minCartValue) || 0,
        expiryDate,
      };

      if (discountType === 'percent') {
        payload.discountPercent = parseInt(discountValue);
        payload.discountAmount = null;
      } else {
        payload.discountAmount = parseFloat(discountValue);
        payload.discountPercent = null;
      }

      const res = await fetch(`${apiBase}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        triggerAlert('success', `Coupon code "${data.code}" created successfully!`);
        setCode('');
        setDiscountValue('');
        setMinCartValue('0');
        setExpiryDate('');
        setShowForm(false);
        fetchCoupons();
      } else {
        triggerAlert('error', data.message || 'Error creating coupon');
      }
    } catch (err) {
      console.error('Error creating coupon:', err);
      triggerAlert('error', 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;

    try {
      const res = await fetch(`${apiBase}/coupons/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        triggerAlert('success', `Coupon "${couponCode}" deleted.`);
        fetchCoupons();
      } else {
        const data = await res.json();
        triggerAlert('error', data.message || 'Error deleting coupon');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
      triggerAlert('error', 'Network error.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Discount Coupons ({coupons.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus style={{ width: 16, height: 16 }} />
          {showForm ? 'Cancel' : 'Add Coupon'}
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Add Coupon Form */}
      {showForm && (
        <CouponForm
          handleSubmit={handleSubmit}
          code={code}
          setCode={setCode}
          discountType={discountType}
          setDiscountType={setDiscountType}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          minCartValue={minCartValue}
          setMinCartValue={setMinCartValue}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
          loading={loading}
          setShowForm={setShowForm}
        />
      )}

      {/* Coupons Table List */}
      <CouponTable
        coupons={coupons}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default CouponManager;

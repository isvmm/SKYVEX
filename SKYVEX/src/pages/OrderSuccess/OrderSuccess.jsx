import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderSuccess = ({ order, setActivePage }) => {
  if (!order) {
    return (
      <div className="success-card">
        <h3>No Order Found</h3>
        <button className="add-cart-btn" onClick={() => setActivePage('home')} style={{ marginTop: '1.5rem', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '4px', cursor: 'pointer', maxWidth: '160px', margin: '1.5rem auto 0 auto' }}>
          Go to Home
        </button>
      </div>
    );
  }

  // Use actual delivery date from the backend
  const deliveryDate = order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  return (
    <div className="success-card">
      <div className="success-icon-box">
        <CheckCircle style={{ width: 44, height: 44 }} />
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
        Order Placed Successfully!
      </h2>
      <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Thank you for shopping with SKYVEX. Your order has been registered.
      </p>

      {/* Order Info recap panel */}
      <div style={{ background: 'var(--bg-light)', padding: '1.5rem', borderRadius: '6px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-gray)' }}>Order ID:</span>
          <strong style={{ fontFamily: 'monospace' }}>#{order.id}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-gray)' }}>Total Amount paid:</span>
          <strong style={{ color: 'var(--fk-blue)' }}>₹{order.totalAmount}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-gray)' }}>Payment Status:</span>
          <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '0.15rem 0.5rem' }}>
            {order.paymentStatus}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
          <span style={{ color: 'var(--text-gray)' }}>Deliver to:</span>
          <strong>{order.customerName}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-gray)' }}>Est. Delivery:</span>
          <strong style={{ color: 'var(--success)' }}>{deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          className="add-cart-btn" 
          style={{ width: '200px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          onClick={() => setActivePage('home')}
        >
          <span>Continue Shopping</span>
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;

import React from 'react';
import { Trash2, Tag } from 'lucide-react';

const CouponTable = ({ coupons, handleDelete }) => {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min Cart Total</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No coupons created yet.
                </td>
              </tr>
            ) : (
              coupons.map((c) => {
                const isExpired = new Date(c.expiryDate) < new Date();
                const statusLabel = isExpired ? 'Expired' : (c.isActive ? 'Active' : 'Inactive');
                
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag style={{ width: 16, height: 16, color: 'var(--accent)' }} />
                        <code>{c.code}</code>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {c.discountPercent ? `${c.discountPercent}% Off` : `₹${c.discountAmount} Off`}
                    </td>
                    <td>₹{c.minCartValue}</td>
                    <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${statusLabel === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem' }}
                        onClick={() => handleDelete(c.id, c.code)}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponTable;

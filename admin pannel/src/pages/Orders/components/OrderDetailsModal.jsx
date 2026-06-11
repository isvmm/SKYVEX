import React from 'react';
import { X, CreditCard } from 'lucide-react';

const OrderDetailsModal = ({
  selectedOrder,
  setSelectedOrder,
  handleUpdateStatus,
  loading,
  apiBase
}) => {
  return (
    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="table-title">Order Details: #{selectedOrder.id.substring(0, 8)}</div>
          <button 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            onClick={() => setSelectedOrder(null)}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div className="modal-body">
          
          <div className="order-details-grid" style={{ marginBottom: '1.5rem' }}>
            {/* Shipping Details */}
            <div>
              <h4 style={{ fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                Shipping Address
              </h4>
              <p style={{ fontWeight: 600 }}>{selectedOrder.customerName}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedOrder.address}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedOrder.city} - {selectedOrder.postalCode}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Phone: {selectedOrder.phone}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email: {selectedOrder.email}</p>
            </div>

            {/* Status updates forms */}
            <div>
              <h4 style={{ fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                Update Status
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: '90px' }}>Order Status:</span>
                  <select 
                    className="form-select"
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, { orderStatus: e.target.value })}
                    disabled={loading}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: '90px' }}>Payment Status:</span>
                  <select 
                    className="form-select"
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, { paymentStatus: e.target.value })}
                    disabled={loading}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                <div style={{ padding: '0.35rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', borderRadius: '4px' }}>
                  <CreditCard style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Payment Method</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedOrder.paymentMethod}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h4 style={{ fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Items Ordered
          </h4>
          <div className="order-items-list">
            {selectedOrder.items.map((item, idx) => {
              const imgUrl = item.image 
                ? (item.image.startsWith('http') ? item.image : `${apiBase.replace('/api', '')}${item.image}`)
                : 'https://placehold.co/80x80?text=No+Img';
              
              return (
                <div key={idx} className="order-item-row">
                  <img src={imgUrl} alt={item.name} className="order-item-img" />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-meta">
                      Size: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.size || 'N/A'}</span>
                      {item.color && (
                        <span style={{ marginLeft: '1rem' }}>
                          Color: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.color}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600 }}>₹{item.price}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing calculation summary */}
          <div style={{ width: '200px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            {selectedOrder.discountAmount > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                  <span>₹{(parseFloat(selectedOrder.totalAmount) + parseFloat(selectedOrder.discountAmount)).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Discount ({selectedOrder.couponApplied || 'Coupon'}):</span>
                  <span>-₹{selectedOrder.discountAmount}</span>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
              <span>Total paid:</span>
              <span style={{ color: 'var(--accent)' }}>₹{selectedOrder.totalAmount}</span>
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;

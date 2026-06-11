import React from 'react';
import { Eye } from 'lucide-react';

const OrderTable = ({ filteredOrders, setSelectedOrder }) => {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Method</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Total</th>
              <th>Order Date</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No orders found matching this status filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <code style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                      #{order.id.substring(0, 8)}
                    </code>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.phone}</div>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.paymentMethod}</span></td>
                  <td>
                    <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      order.orderStatus === 'Delivered' ? 'badge-success' :
                      order.orderStatus === 'Shipped' ? 'badge-info' :
                      order.orderStatus === 'Pending' ? 'badge-warning' :
                      order.orderStatus === 'Processing' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem' }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye style={{ width: 14, height: 14 }} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;

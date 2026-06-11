import React, { useState, useEffect } from 'react';
import OrderTable from './components/OrderTable';
import OrderDetailsModal from './components/OrderDetailsModal';

const OrderManager = ({ apiBase }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.orderStatus === statusFilter));
    }
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiBase}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleUpdateStatus = async (orderId, updates) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await res.json();

      if (res.ok) {
        triggerAlert('success', `Order status updated successfully!`);
        fetchOrders();
        // Update selected order modal detail in real time
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data);
        }
      } else {
        triggerAlert('error', data.message || 'Error updating order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      triggerAlert('error', 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Orders ({filteredOrders.length})</h2>
        
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                background: statusFilter === status ? 'var(--bg-tertiary)' : 'transparent',
                color: statusFilter === status ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Orders List Table */}
      <OrderTable
        filteredOrders={filteredOrders}
        setSelectedOrder={setSelectedOrder}
      />

      {/* Order Details Modal Overlay */}
      {selectedOrder && (
        <OrderDetailsModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          handleUpdateStatus={handleUpdateStatus}
          loading={loading}
          apiBase={apiBase}
        />
      )}
    </div>
  );
};

export default OrderManager;

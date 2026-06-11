import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, FolderTree, Layers, AlertCircle } from 'lucide-react';

const Dashboard = ({ apiBase }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    categoriesCount: 0,
    productsCount: 0,
    lowStock: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLast7Days = () => {
    const days = [];
    const options = { weekday: 'short' };
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateString: d.toISOString().split('T')[0], // YYYY-MM-DD
        label: d.toLocaleDateString('en-US', options), // Mon
        value: 0
      });
    }
    return days;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch products, categories, orders to compute stats
        const [prodRes, catRes, ordRes] = await Promise.all([
          fetch(`${apiBase}/products`),
          fetch(`${apiBase}/categories`),
          fetch(`${apiBase}/orders`)
        ]);

        const products = await prodRes.json();
        const categories = await catRes.json();
        const orders = await ordRes.json();

        // Calculate stats
        const totalOrders = orders.length;
        const totalSales = orders
          .filter(o => o.paymentStatus === 'Paid')
          .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

        const lowStock = products.filter(p => p.stock <= 5);

        // Group paid orders by date in the last 7 days
        const last7DaysData = getLast7Days();
        orders
          .filter(o => o.paymentStatus === 'Paid')
          .forEach(order => {
            const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
            const dayBucket = last7DaysData.find(day => day.dateString === orderDateStr);
            if (dayBucket) {
              dayBucket.value += parseFloat(order.totalAmount);
            }
          });

        setStats({
          totalSales: totalSales.toFixed(2),
          totalOrders,
          categoriesCount: categories.length,
          productsCount: products.length,
          lowStock
        });

        setWeeklySales(last7DaysData);
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiBase]);

  const maxChartValue = Math.max(...weeklySales.map(d => d.value), 0);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard metrics...</div>;
  }

  return (
    <div>
      {/* Stat Cards Grid */}
      <div className="grid-4">
        <div className="stats-card">
          <div>
            <div className="stats-title">Total Revenue</div>
            <div className="stats-value">₹{stats.totalSales}</div>
          </div>
          <div className="stats-icon-wrapper" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
            <DollarSign className="nav-icon" />
          </div>
        </div>

        <div className="stats-card">
          <div>
            <div className="stats-title">Total Orders</div>
            <div className="stats-value">{stats.totalOrders}</div>
          </div>
          <div className="stats-icon-wrapper" style={{ color: '#111827', background: 'rgba(0, 0, 0, 0.05)' }}>
            <ShoppingBag className="nav-icon" />
          </div>
        </div>

        <div className="stats-card">
          <div>
            <div className="stats-title">Categories</div>
            <div className="stats-value">{stats.categoriesCount}</div>
          </div>
          <div className="stats-icon-wrapper" style={{ color: '#111827', background: 'rgba(0, 0, 0, 0.05)' }}>
            <FolderTree className="nav-icon" />
          </div>
        </div>

        <div className="stats-card">
          <div>
            <div className="stats-title">Total Products</div>
            <div className="stats-value">{stats.productsCount}</div>
          </div>
          <div className="stats-icon-wrapper" style={{ color: '#111827', background: 'rgba(0, 0, 0, 0.05)' }}>
            <Layers className="nav-icon" />
          </div>
        </div>
      </div>

      <div className="dashboard-grid-layout" style={{ marginBottom: '2rem' }}>
        {/* Sales Chart */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <div className="table-title" style={{ marginBottom: '1.5rem' }}>Weekly Sales Revenue (₹)</div>
          <div className="chart-container">
            {weeklySales.map((d, index) => {
              const pct = maxChartValue > 0 ? (d.value / maxChartValue) * 75 + 10 : 10; // Scale height with protection
              return (
                <div key={index} className="chart-bar-wrapper">
                  <div className="chart-bar" style={{ height: `${pct}%` }}>
                    <span className="chart-bar-value">₹{d.value.toFixed(0)}</span>
                  </div>
                  <span className="chart-label">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Alert list */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <div className="table-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
            <AlertCircle style={{ width: 18, height: 18 }} />
            Low Stock Alerts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '230px', overflowY: 'auto' }}>
            {stats.lowStock.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All items in healthy stock.</div>
            ) : (
              stats.lowStock.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Price: ₹{p.price}</div>
                  </div>
                  <span className="badge badge-danger">{p.stock} left</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Recent Orders</div>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No orders placed yet.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.email}</div>
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'badge-success' :
                        order.orderStatus === 'Shipped' ? 'badge-info' :
                        order.orderStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

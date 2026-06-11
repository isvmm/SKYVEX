import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const Profile = ({ apiBase, user, token, onLogout, setActivePage }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (!user) {
      setActivePage('home');
      return;
    }
    fetchAddresses();
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiBase}/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${apiBase}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/addresses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name, street, city, postalCode, phone, isDefault })
      });
      if (res.ok) {
        setShowAddForm(false);
        // Reset form
        setName(''); setStreet(''); setCity(''); setPostalCode(''); setPhone(''); setIsDefault(false);
        fetchAddresses();
      } else {
        alert('Failed to add address');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await fetch(`${apiBase}/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Account</h2>
        <button className="login-btn" onClick={onLogout} style={{ padding: '0.5rem 1rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          Logout
        </button>
      </div>

      <div className="cart-card-left" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3>Profile Details</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Email: {user.email}</p>
        <p style={{ color: 'var(--text-secondary)' }}>Account Type: {user.role}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600, color: activeTab === 'orders' ? 'var(--fk-yellow)' : 'var(--text-secondary)', borderBottom: activeTab === 'orders' ? '2px solid var(--fk-yellow)' : '2px solid transparent', cursor: 'pointer' }}
        >
          My Orders
        </button>
        <button 
          onClick={() => setActiveTab('addresses')}
          style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600, color: activeTab === 'addresses' ? 'var(--fk-yellow)' : 'var(--text-secondary)', borderBottom: activeTab === 'addresses' ? '2px solid var(--fk-yellow)' : '2px solid transparent', cursor: 'pointer' }}
        >
          Saved Addresses
        </button>
      </div>

      {activeTab === 'addresses' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Saved Addresses</h3>
            {!showAddForm && (
              <button className="add-cart-btn" style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '4px', maxWidth: '200px' }} onClick={() => setShowAddForm(true)}>
                <Plus size={16} /> Add Address
              </button>
            )}
          </div>

          {showAddForm && (
            <form className="cart-card-left" onSubmit={handleAddAddress} style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--fk-yellow)' }}>
              <h4 style={{ marginBottom: '1rem' }}>Add New Address</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Street Address</label>
                  <input type="text" className="form-input" required value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">City / State</label>
                  <input type="text" className="form-input" required value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input type="text" className="form-input" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                    Set as default shipping address
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="add-cart-btn" style={{ padding: '0.5rem 1.5rem', borderRadius: '4px' }}>Save Address</button>
                <button type="button" className="login-btn" style={{ padding: '0.5rem 1.5rem' }} onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          {loading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-input)', borderRadius: '8px' }}>
              <MapPin size={40} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'var(--text-secondary)' }}>You don't have any saved addresses yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {addresses.map(addr => (
                <div key={addr.id} className="cart-card-left" style={{ padding: '1.5rem', position: 'relative' }}>
                  {addr.isDefault && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      <CheckCircle2 size={14} /> Default
                    </div>
                  )}
                  <h4 style={{ marginBottom: '0.5rem' }}>{addr.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{addr.street}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{addr.city}, {addr.postalCode}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Phone: {addr.phone}</p>
                  
                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <h3 style={{ marginBottom: '1rem' }}>Order History</h3>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-input)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
              <button className="add-cart-btn" onClick={() => setActivePage('home')} style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', borderRadius: '4px', maxWidth: '200px', margin: '1rem auto' }}>Start Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map(order => {
                const estDate = order.estimatedDeliveryDate 
                  ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) 
                  : 'Pending';
                
                return (
                  <div key={order.id} className="cart-card-left" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order #{order.id.slice(0,8)}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                          {order.orderStatus}
                        </span>
                        {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--success-color)', marginTop: '0.5rem', fontWeight: 600 }}>
                            🚚 Expected: {estDate}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span>{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-light)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--fk-yellow)' }}>₹{order.totalAmount}</strong>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;

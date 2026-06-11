import React, { useState } from 'react';
import ShippingForm from './components/ShippingForm';
import PaymentMethods from './components/PaymentMethods';
import OrderSummary from './components/OrderSummary';

const Checkout = ({ 
  apiBase, 
  cart, 
  coupon, 
  onClearCart, 
  setLastPlacedOrder, 
  setActivePage,
  user,
  token
}) => {
  // Form details state
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, CARD, UPI
  
  const [savedAddresses, setSavedAddresses] = useState([]);

  React.useEffect(() => {
    if (user && token) {
      if (!email) setEmail(user.email);
      fetch(`${apiBase}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSavedAddresses(data);
          const defaultAddr = data.find(a => a.isDefault);
          if (defaultAddr && !address) {
            applyAddress(defaultAddr);
          }
        }
      })
      .catch(err => console.error(err));
    }
  }, [user, token]);

  const applyAddress = (addr) => {
    setCustomerName(addr.name);
    setPhone(addr.phone);
    setAddress(addr.street);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
  };
  
  // Mock inputs state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.discountPrice || item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const shippingFee = subtotal >= 499 ? 0 : 40;
  const discountAmount = coupon ? parseFloat(coupon.discount) : 0;
  const finalTotal = subtotal + shippingFee - discountAmount;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !email || !phone || !address || !city || !postalCode) {
      setErrorMsg('Please fill in all shipping details.');
      return;
    }

    if (paymentMethod === 'CARD' && (!cardNumber || !cardExpiry || !cardCvv)) {
      setErrorMsg('Please enter debit/credit card details.');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId) {
      setErrorMsg('Please enter your UPI ID.');
      return;
    }

    setErrorMsg('');

    try {
      setLoading(true);

      // Map cart to api schema
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : ''
      }));

      const payload = {
        userId: user ? user.id : null,
        customerName,
        email,
        phone,
        address,
        city,
        postalCode,
        items: orderItems,
        totalAmount: finalTotal,
        discountAmount,
        couponApplied: coupon ? coupon.code : null,
        paymentMethod
      };

      const res = await fetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setLastPlacedOrder(data.order);
        onClearCart();
        setActivePage('order-success');
      } else {
        setErrorMsg(data.message || 'Error occurred while placing order.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('Network error. Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const expectedDeliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="cart-layout">
      {/* Left Column Delivery Address & Payment details */}
      <div className="cart-card-left" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          Delivery & Payment Details
        </h2>

        {errorMsg && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {errorMsg}
          </div>
        )}

        {user && savedAddresses.length > 0 && (
          <div style={{ marginBottom: '1.5rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select from Saved Addresses</h4>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {savedAddresses.map(addr => (
                <div 
                  key={addr.id} 
                  onClick={() => applyAddress(addr)}
                  style={{ minWidth: '220px', cursor: 'pointer', border: '1px solid var(--fk-yellow)', padding: '0.75rem', borderRadius: '4px', background: 'rgba(255, 194, 0, 0.05)', transition: '0.2s' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                    {addr.name} 
                    {addr.isDefault && <span style={{ color: 'var(--fk-yellow)', fontSize: '0.7rem' }}>Default</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{addr.street}, {addr.city} - {addr.postalCode}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          {/* Shipping Address Form */}
          <ShippingForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
          />

          {/* Payment Selection Forms */}
          <PaymentMethods
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardExpiry={cardExpiry}
            setCardExpiry={setCardExpiry}
            cardCvv={cardCvv}
            setCardCvv={setCardCvv}
            upiId={upiId}
            setUpiId={setUpiId}
          />

          <div style={{ marginTop: '1.5rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success-color)', borderRadius: '4px', textAlign: 'center' }}>
            <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>🚚 Expected Delivery by {expectedDeliveryDate}</span>
          </div>

          <button 
            type="submit" 
            className="action-btn-buy" 
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Processing Order...' : `CONFIRM ORDER (₹${finalTotal.toFixed(2)})`}
          </button>
        </form>
      </div>

      {/* Right Column: Order Summary details */}
      <OrderSummary
        cart={cart}
        subtotal={subtotal}
        coupon={coupon}
        discountAmount={discountAmount}
        shippingFee={shippingFee}
        finalTotal={finalTotal}
      />
    </div>
  );
};

export default Checkout;

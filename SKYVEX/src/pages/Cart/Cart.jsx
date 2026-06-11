import React, { useState } from 'react';
import CartItemRow from './components/CartItemRow';
import CouponForm from './components/CouponForm';
import CartSummary from './components/CartSummary';

const Cart = ({ 
  apiBase, 
  cart, 
  onUpdateQty, 
  onRemoveItem, 
  setActivePage, 
  coupon, 
  setCoupon 
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState(coupon ? coupon.code : '');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState(null); // { type: 'success'|'error', text: '' }

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.discountPrice || item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    try {
      setCouponLoading(true);
      setCouponMsg(null);

      const res = await fetch(`${apiBase}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCodeInput,
          cartTotal: subtotal
        })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setCoupon({
          code: data.code,
          discount: data.discount
        });
        setCouponMsg({ type: 'success', text: `Coupon applied: ${data.message} Discount of ₹${data.discount} applied.` });
      } else {
        setCoupon(null);
        setCouponMsg({ type: 'error', text: data.message || 'Failed to apply coupon.' });
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setCouponMsg({ type: 'error', text: 'Error connecting to validation API.' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCodeInput('');
    setCouponMsg(null);
  };

  // Shipping logic: Free shipping on orders above ₹499
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const discountAmount = coupon ? parseFloat(coupon.discount) : 0;
  const finalTotal = subtotal + shippingFee - discountAmount;

  if (cart.length === 0) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', maxWidth: '800px', margin: '3rem auto', padding: '4rem 2rem', textAlign: 'center', borderRadius: '4px', boxShadow: 'var(--shadow-sm)' }}>
        <img 
          src="https://img.icons8.com/color/96/000000/empty-cart.png" 
          alt="Empty Cart" 
          style={{ marginBottom: '1.5rem', opacity: 0.8 }} 
        />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your Cart is Empty!</h3>
        <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '2rem' }}>Add items to it now to place an order.</p>
        <button 
          className="add-cart-btn" 
          onClick={() => {
            setActivePage('shop');
            window.history.pushState(null, '', '/?page=shop');
          }}
          style={{ padding: '0.65rem 2rem', fontWeight: 600, cursor: 'pointer', maxWidth: '200px', margin: '0 auto' }}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      {/* Left Column: Cart Items */}
      <div className="cart-card-left">
        <div className="cart-header">
          <span>My Cart ({cart.length})</span>
        </div>

        <div className="cart-items-container">
          {cart.map((item, idx) => (
            <CartItemRow
              key={idx}
              item={item}
              idx={idx}
              apiBase={apiBase}
              onUpdateQty={onUpdateQty}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>

        {/* Proceed to checkout row */}
        <div className="cart-footer-btn-row">
          <button 
            className="action-btn-buy" 
            style={{ width: '220px', padding: '0.75rem' }}
            onClick={() => {
              setActivePage('checkout');
              window.history.pushState(null, '', '/?page=checkout');
            }}
          >
            PLACE ORDER
          </button>
        </div>
      </div>

      {/* Right Column: Price summary sidebar */}
      <div>
        {/* Coupon Discount code card */}
        <CouponForm
          coupon={coupon}
          couponCodeInput={couponCodeInput}
          setCouponCodeInput={setCouponCodeInput}
          couponLoading={couponLoading}
          couponMsg={couponMsg}
          handleApplyCoupon={handleApplyCoupon}
          handleRemoveCoupon={handleRemoveCoupon}
        />

        {/* Detailed Price Summary */}
        <CartSummary
          cart={cart}
          subtotal={subtotal}
          coupon={coupon}
          discountAmount={discountAmount}
          shippingFee={shippingFee}
          finalTotal={finalTotal}
        />
      </div>
    </div>
  );
};

export default Cart;

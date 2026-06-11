import React from 'react';

const CartItemRow = ({ item, idx, apiBase, onUpdateQty, onRemoveItem }) => {
  const prod = item.product;
  const itemPrice = prod.discountPrice || prod.price;
  const imgUrl = prod.images && prod.images.length > 0
    ? (prod.images[0].startsWith('http') ? prod.images[0] : `${apiBase.replace('/api', '')}${prod.images[0]}`)
    : 'https://placehold.co/100?text=No+Image';

  return (
    <div className="cart-item-row">
      <img src={imgUrl} alt={prod.name} className="cart-item-img" />
      
      <div className="cart-item-body">
        <h4 className="cart-item-title">{prod.name}</h4>
        
        <div className="cart-item-meta">
          Size: <strong style={{ color: 'var(--text-dark)' }}>{item.size}</strong>
          {item.color && (
            <span style={{ marginLeft: '1rem' }}>
              Color: <strong style={{ color: 'var(--text-dark)' }}>{item.color}</strong>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>₹{itemPrice}</span>
          {prod.discountPrice && (
            <span style={{ textDecoration: 'line-through', color: 'var(--text-gray)', fontSize: '0.85rem' }}>
              ₹{prod.price}
            </span>
          )}
        </div>

        {/* Quantity adjustments */}
        <div className="qty-counter">
          <button 
            className="qty-btn" 
            onClick={() => onUpdateQty(prod.id, item.size, item.color, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="qty-val">{item.quantity}</span>
          <button 
            className="qty-btn" 
            onClick={() => onUpdateQty(prod.id, item.size, item.color, item.quantity + 1)}
            disabled={item.quantity >= prod.stock}
          >
            +
          </button>

          <button 
            className="remove-item-btn"
            onClick={() => onRemoveItem(prod.id, item.size, item.color)}
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;

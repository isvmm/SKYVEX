import React from 'react';
import { ShoppingCart, Zap, Heart } from 'lucide-react';

const ProductSpecs = ({
  name,
  price,
  discountPrice,
  discountPct,
  sizes,
  selectedSize,
  setSelectedSize,
  colors,
  selectedColor,
  setSelectedColor,
  stock,
  description,
  handleAddToCart,
  handleBuyNow,
  isBestSeller,
  isNewArrival,
  isWishlisted,
  onToggleWishlist,
  product
}) => {
  return (
    <div className="details-info">
      {/* Badges */}
      <div className="details-badge-row">
        {isBestSeller && <span className="badge badge-warning">BEST SELLER</span>}
        {isNewArrival && <span className="badge badge-info">NEW ARRIVAL</span>}
        <span 
          className={`wishlist-icon-overlay ${isWishlisted ? 'active' : ''}`}
          onClick={() => onToggleWishlist(product.id)}
          style={{ position: 'relative', top: 0, right: 0, display: 'inline-flex', cursor: 'pointer' }}
        >
          <Heart style={{ width: 16, height: 16, fill: isWishlisted ? 'currentColor' : 'none' }} />
        </span>
      </div>

      <h1 className="details-title">{name}</h1>
      
      {/* Pricing structure */}
      <div className="details-price-row">
        {discountPrice ? (
          <>
            <span className="details-price-now">₹{discountPrice}</span>
            <span className="details-price-was">₹{price}</span>
            <span className="details-price-off">{discountPct}% OFF</span>
          </>
        ) : (
          <span className="details-price-now">₹{price}</span>
        )}
      </div>

      {/* Sizes Selector */}
      {sizes && sizes.length > 0 && (
        <div className="details-section">
          <h4 className="details-section-title">Select Size</h4>
          <div className="size-bubbles">
            {sizes.map((sz) => (
              <div 
                key={sz} 
                className={`size-bubble ${selectedSize === sz ? 'active' : ''}`}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colors Selector */}
      {colors && colors.length > 0 && (
        <div className="details-section">
          <h4 className="details-section-title">Select Color</h4>
          <div className="color-bubbles">
            {colors.map((col) => (
              <div 
                key={col} 
                className={`color-bubble ${selectedColor === col ? 'active' : ''}`}
                onClick={() => setSelectedColor(col)}
              >
                {col}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Alerts */}
      <div className="details-section" style={{ fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
        <span style={{ color: 'var(--text-gray)' }}>Availability:</span>
        {stock === 0 ? (
          <strong style={{ color: 'var(--danger)' }}>Out of Stock</strong>
        ) : stock <= 5 ? (
          <strong style={{ color: 'var(--danger)' }}>Hurry! Only {stock} units left in stock!</strong>
        ) : (
          <strong style={{ color: 'var(--success)' }}>In Stock ({stock} units)</strong>
        )}
      </div>

      {/* Description Section */}
      <div className="details-section" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
        <h4 className="details-section-title">Product Description</h4>
        <p className="description-text">{description || 'No description available for this product.'}</p>
      </div>

      {/* Action Buttons */}
      <div className="details-action-buttons" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button 
          className="action-btn-cart" 
          onClick={handleAddToCart}
          disabled={stock === 0}
          style={{ flex: 1 }}
        >
          <ShoppingCart style={{ width: 18, height: 18 }} />
          {stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
        </button>
        <button 
          className="action-btn-buy" 
          onClick={handleBuyNow}
          disabled={stock === 0}
          style={{ flex: 1 }}
        >
          <Zap style={{ width: 18, height: 18 }} />
          {stock === 0 ? 'OUT OF STOCK' : 'BUY NOW'}
        </button>
      </div>
    </div>
  );
};

export default ProductSpecs;

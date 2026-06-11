import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, apiBase, onAddToCart, onProductClick, isWishlisted, onToggleWishlist }) => {
  const { id, name, price, discountPrice, images, sizes, isNewArrival, isBestSeller } = product;

  // Compute image URL
  const displayImg = images && images.length > 0
    ? (images[0].startsWith('http') ? images[0] : `${apiBase.replace('/api', '')}${images[0]}`)
    : 'https://placehold.co/300x400?text=No+Product+Image';

  // Compute discount percentage
  const discountPct = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;

  const handleCardClick = (e) => {
    // Avoid triggering card click if wishlist or add-to-cart button is clicked
    if (e.target.closest('.wishlist-icon-overlay') || e.target.closest('.add-cart-btn')) {
      return;
    }
    onProductClick(id);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Product Image and overlays */}
      <div className="card-image-box">
        <img src={displayImg} alt={name} />
        
        {/* Badges */}
        {isNewArrival && <span className="tag-badge tag-new">NEW</span>}
        {discountPrice && <span className="tag-badge tag-discount">-{discountPct}%</span>}
        
        {/* Wishlist toggle */}
        <button 
          className={`wishlist-icon-overlay ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(id);
          }}
        >
          <Heart style={{ width: 16, height: 16, fill: isWishlisted ? 'currentColor' : 'none' }} />
        </button>
      </div>

      {/* Product Information details */}
      <div className="card-details">
        {/* Best seller indicator */}
        {isBestSeller && (
          <span style={{ fontSize: '0.65rem', color: '#b45309', background: '#fef3c7', padding: '0.1rem 0.35rem', borderRadius: '4px', alignSelf: 'flex-start', fontWeight: 700, marginBottom: '0.35rem' }}>
            BEST SELLER
          </span>
        )}

        <h3 className="card-name">{name}</h3>
        
        <div className="card-pricing">
          {discountPrice ? (
            <>
              <span className="price-now">₹{discountPrice}</span>
              <span className="price-was">₹{price}</span>
              <span className="price-off">{discountPct}% OFF</span>
            </>
          ) : (
            <span className="price-now">₹{price}</span>
          )}
        </div>

        {sizes && sizes.length > 0 && (
          <div className="card-sizes">
            Size: {sizes.join(', ')}
          </div>
        )}

        <button 
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            // Default size selection is the first available size
            const size = sizes && sizes.length > 0 ? sizes[0] : 'M';
            const color = product.colors && product.colors.length > 0 ? product.colors[0] : '';
            onAddToCart(product, size, color);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

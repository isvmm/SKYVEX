import React from 'react';
import ProductCard from '../../../components/ProductCard';

const ProductGrids = ({ 
  bestSellers, 
  newArrivals, 
  apiBase, 
  onAddToCart, 
  handleProductSelect, 
  wishlist, 
  onToggleWishlist,
  onSearch,
  setActivePage
}) => {
  return (
    <>
      {/* Best Sellers product list */}
      <div className="products-section">
        <div className="category-circles-header">
          <h2 className="section-title">Best Sellers</h2>
          <span 
            className="view-all-link" 
            onClick={() => {
              onSearch('');
              setActivePage('shop');
              window.history.pushState(null, '', '/?page=shop');
            }}
          >
            View All →
          </span>
        </div>
        <div className="products-grid">
          {bestSellers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-gray)' }}>
              No products marked as best sellers yet.
            </div>
          ) : (
            bestSellers.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                apiBase={apiBase}
                onAddToCart={onAddToCart}
                onProductClick={handleProductSelect}
                isWishlisted={wishlist.includes(prod.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))
          )}
        </div>
      </div>

      {/* New Arrivals product list */}
      <div className="products-section" style={{ marginBottom: '2rem' }}>
        <div className="category-circles-header">
          <h2 className="section-title">New Arrivals</h2>
          <span 
            className="view-all-link" 
            onClick={() => {
              onSearch('New');
              setActivePage('shop');
              window.history.pushState(null, '', '/?page=shop&search=New');
            }}
          >
            View All →
          </span>
        </div>
        <div className="products-grid">
          {newArrivals.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-gray)' }}>
              No new arrivals loaded yet.
            </div>
          ) : (
            newArrivals.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                apiBase={apiBase}
                onAddToCart={onAddToCart}
                onProductClick={handleProductSelect}
                isWishlisted={wishlist.includes(prod.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProductGrids;

import React, { useState, useEffect } from 'react';
import ProductGallery from './components/ProductGallery';
import ProductSpecs from './components/ProductSpecs';
import TrustBadges from './components/TrustBadges';
import { getCacheData, setCacheData } from '../../utils/cookies';

const ProductDetails = ({ 
  apiBase, 
  productId, 
  onAddToCart, 
  setActivePage, 
  wishlist, 
  onToggleWishlist 
}) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const cacheKey = `skyvex_product_${productId}`;
        let cachedProd = getCacheData(cacheKey);

        if (cachedProd) {
          setProduct(cachedProd);
          if (cachedProd.sizes && cachedProd.sizes.length > 0) {
            setSelectedSize(cachedProd.sizes[0]);
          }
          if (cachedProd.colors && cachedProd.colors.length > 0) {
            setSelectedColor(cachedProd.colors[0]);
          }
          setLoading(false);
          return;
        }

        const res = await fetch(`${apiBase}/products/${productId}`);
        const data = await res.json();
        
        if (res.ok) {
          setProduct(data);
          setCacheData(cacheKey, data, 5); // cache for 5 minutes
          // Pre-select first available size and color
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        } else {
          setErrorMsg(data.message || 'Product details not found');
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setErrorMsg('Network error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId, apiBase]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please choose a size first.');
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please choose a size first.');
      return;
    }
    // Adds to cart and immediately routes to Cart page in the same tab
    onAddToCart(product, selectedSize, selectedColor);
    setActivePage('cart');
    window.history.pushState(null, '', '/?page=cart');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1248px', margin: '2rem auto', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '2.5rem' }}>
          {/* Gallery Skeleton */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shimmer-wrapper shimmer-bg" style={{ width: '60px', height: '60px', borderRadius: '4px' }}></div>
              ))}
            </div>
            <div className="shimmer-wrapper shimmer-bg" style={{ flex: 1, height: '400px', borderRadius: '4px' }}></div>
          </div>
          {/* Specs Skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="shimmer-bg shimmer-line" style={{ width: '40px', height: '14px' }}></div>
            <div className="shimmer-bg shimmer-line" style={{ width: '85%', height: '32px' }}></div>
            <div className="shimmer-bg shimmer-line" style={{ width: '30%', height: '20px' }}></div>
            <div className="shimmer-bg shimmer-line" style={{ width: '50%', height: '18px' }}></div>
            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />
            <div className="shimmer-bg shimmer-line" style={{ width: '45%', height: '16px' }}></div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer-wrapper shimmer-bg" style={{ width: '45px', height: '35px', borderRadius: '4px' }}></div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div className="shimmer-bg" style={{ flex: 1, height: '48px', borderRadius: '4px' }}></div>
              <div className="shimmer-bg" style={{ flex: 1, height: '48px', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', maxWidth: '800px', margin: '3rem auto', padding: '3rem', textAlign: 'center', borderRadius: '4px' }}>
        <h3>Error Loading Product</h3>
        <p style={{ color: 'var(--text-gray)', margin: '1rem 0' }}>{errorMsg || 'Product details missing.'}</p>
        <button className="add-cart-btn" onClick={() => {
          setActivePage('shop');
          window.history.pushState(null, '', '/?page=shop');
        }} style={{ border: 'none', padding: '0.5rem 1.5rem', borderRadius: '4px', cursor: 'pointer', maxWidth: '160px', margin: '0 auto' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const { name, price, discountPrice, description, images, sizes, colors, isBestSeller, isNewArrival, stock } = product;

  const discountPct = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;

  const isWishlisted = wishlist.includes(product.id);

  // Compute image paths
  const imagePaths = images && images.length > 0 ? images : [''];

  return (
    <div className="product-details-container">
      {/* Left Gallery */}
      <ProductGallery
        imagePaths={imagePaths}
        selectedImgIdx={selectedImgIdx}
        setSelectedImgIdx={setSelectedImgIdx}
        apiBase={apiBase}
        name={name}
      />

      {/* Right Column Product Details */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ProductSpecs
          name={name}
          price={price}
          discountPrice={discountPrice}
          discountPct={discountPct}
          sizes={sizes}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          colors={colors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          stock={stock}
          description={description}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          isBestSeller={isBestSeller}
          isNewArrival={isNewArrival}
          isWishlisted={isWishlisted}
          onToggleWishlist={onToggleWishlist}
          product={product}
        />

        <TrustBadges />
      </div>
    </div>
  );
};

export default ProductDetails;

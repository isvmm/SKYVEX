import React, { useState, useEffect } from 'react';
import HeroBanner from './components/HeroBanner';
import FeatureBadges from './components/FeatureBadges';
import CategoryCircles from './components/CategoryCircles';
import ProductGrids from './components/ProductGrids';
import { getCacheData, setCacheData } from '../../utils/cookies';

const Home = ({ 
  apiBase, 
  setActivePage, 
  setSelectedProductId, 
  onSearch, 
  onAddToCart, 
  wishlist, 
  onToggleWishlist, 
  settings, 
  theme 
}) => {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    settings?.homeBannerImage1,
    settings?.homeBannerImage2,
    settings?.homeBannerImage3
  ].filter(Boolean);

  if (bannerImages.length === 0) {
    bannerImages.push(settings?.homeBannerImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200');
  }

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        let cats = getCacheData('skyvex_categories');
        let prods = getCacheData('skyvex_products');

        if (!cats || !prods) {
          const [catRes, prodRes] = await Promise.all([
            fetch(`${apiBase}/categories`),
            fetch(`${apiBase}/products`)
          ]);

          if (catRes.ok) {
            cats = await catRes.json();
            setCacheData('skyvex_categories', cats, 10); // Cache for 10 minutes
          }
          if (prodRes.ok) {
            prods = await prodRes.json();
            setCacheData('skyvex_products', prods, 10); // Cache for 10 minutes
          }
        }

        if (cats) setCategories(cats);
        if (prods) {
          setBestSellers(prods.filter(p => p.isBestSeller).slice(0, 4));
          setNewArrivals(prods.filter(p => p.isNewArrival).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [apiBase]);

  const handleCategorySelect = (slug) => {
    onSearch(slug);
    setSelectedProductId(null);
    setActivePage('shop');
    window.history.pushState(null, '', `/?page=shop&search=${encodeURIComponent(slug)}`);
  };

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
    setActivePage('product-details');
    window.history.pushState(null, '', `/?page=product-details&id=${id}`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '1rem' }}>
        {/* Main Grid Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {/* Sidebar Skeleton */}
          <div className="shimmer-wrapper" style={{ height: '300px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="shimmer-bg shimmer-line" style={{ width: '60%', height: '20px' }}></div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="shimmer-bg shimmer-line" style={{ width: '85%', height: '14px' }}></div>
            ))}
          </div>
          {/* Banner Skeleton */}
          <div className="shimmer-wrapper shimmer-bg" style={{ height: '340px', borderRadius: '4px' }}></div>
        </div>

        {/* Categories Circle Skeleton */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="shimmer-bg shimmer-line" style={{ width: '200px', height: '24px', marginBottom: '1.5rem' }}></div>
          <div style={{ display: 'flex', gap: '2rem', overflow: 'hidden' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div className="shimmer-bg shimmer-circle"></div>
                <div className="shimmer-bg shimmer-line" style={{ width: '50px', height: '10px' }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="shimmer-bg shimmer-line" style={{ width: '150px', height: '24px', marginBottom: '1.5rem' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shimmer-wrapper">
                <div className="shimmer-bg shimmer-card-image"></div>
                <div className="shimmer-card-details">
                  <div className="shimmer-bg shimmer-line" style={{ width: '85%', height: '16px' }}></div>
                  <div className="shimmer-bg shimmer-line" style={{ width: '40%', height: '14px' }}></div>
                  <div className="shimmer-bg shimmer-line" style={{ width: '100%', height: '32px', marginTop: '0.5rem', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner section */}
      <div className="home-layout">
        
        {/* Left Categories Sidebar navigation */}
        <div className="side-categories">
          <div style={{ padding: '0.5rem 1.25rem', borderBottom: '1px solid var(--border-light)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-gray)', textTransform: 'uppercase' }}>
            Categories
          </div>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="side-category-item"
              onClick={() => handleCategorySelect(cat.slug)}
            >
              <span>{cat.name}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>→</span>
            </div>
          ))}
          <div 
            className="side-category-item"
            style={{ fontWeight: 600, color: 'var(--text-primary)' }}
            onClick={() => {
              onSearch('');
              setSelectedProductId(null);
              setActivePage('shop');
              window.history.pushState(null, '', '/?page=shop');
            }}
          >
            <span>View All Collections</span>
            <span>→</span>
          </div>
        </div>

        {/* Hero sliding banner billboard */}
        <HeroBanner
          bannerImages={bannerImages}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          apiBase={apiBase}
          onSearch={onSearch}
          setActivePage={setActivePage}
        />

      </div>

      {/* Trust Feature Badges */}
      <FeatureBadges settings={settings} />

      {/* Circle Categories horizontal section */}
      <CategoryCircles 
        categories={categories}
        apiBase={apiBase}
        handleCategorySelect={handleCategorySelect}
      />

      {/* Products Showcase */}
      <ProductGrids
        bestSellers={bestSellers}
        newArrivals={newArrivals}
        apiBase={apiBase}
        onAddToCart={onAddToCart}
        handleProductSelect={handleProductSelect}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        onSearch={onSearch}
        setActivePage={setActivePage}
      />
    </div>
  );
};

export default Home;

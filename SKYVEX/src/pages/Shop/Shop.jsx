import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from './components/FilterSidebar';
import SortBar from './components/SortBar';
import { getCacheData, setCacheData } from '../../utils/cookies';

const Shop = ({ 
  apiBase, 
  searchQuery, 
  onSearchClear, 
  setActivePage, 
  setSelectedProductId, 
  onAddToCart, 
  wishlist, 
  onToggleWishlist 
}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceTier, setPriceTier] = useState('all'); // all, under_499, 499_999, over_999
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters or search query changes
  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, priceTier, sortBy, searchQuery, selectedSizes]);

  const fetchCategories = async () => {
    try {
      let cached = getCacheData('skyvex_categories');
      if (cached) {
        setCategories(cached);
        return;
      }
      const res = await fetch(`${apiBase}/categories`);
      const data = await res.json();
      setCategories(data);
      setCacheData('skyvex_categories', data, 10);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      
      let url = `${apiBase}/products?`;
      
      if (selectedCategory) {
        url += `category=${selectedCategory}&`;
      }
      
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }

      // Handle price tier math
      if (priceTier === 'under_499') {
        url += `maxPrice=499&`;
      } else if (priceTier === '499_999') {
        url += `minPrice=499&maxPrice=999&`;
      } else if (priceTier === 'over_999') {
        url += `minPrice=999&`;
      }

      // Handle sorting parameter mapping
      if (sortBy === 'price_low') {
        url += `sort=price_low&`;
      } else if (sortBy === 'price_high') {
        url += `sort=price_high&`;
      }

      // Caching based on URL parameters to fetch only when necessary
      const queryCacheKey = `skyvex_shop_products_${selectedCategory || 'all'}_${priceTier}_${sortBy}_${searchQuery || 'all'}`;
      let cachedData = getCacheData(queryCacheKey);
      
      if (!cachedData) {
        const res = await fetch(url);
        if (res.ok) {
          cachedData = await res.json();
          setCacheData(queryCacheKey, cachedData, 5); // cache for 5 minutes
        }
      }

      if (cachedData) {
        // Local filter for sizes since backend doesn't support complex size filtering
        let filteredData = cachedData;
        if (selectedSizes.length > 0) {
          filteredData = cachedData.filter(prod => 
            prod.sizes && prod.sizes.some(size => selectedSizes.includes(size))
          );
        }
        setProducts(filteredData);
      }
    } catch (err) {
      console.error('Error fetching filtered products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
    setActivePage('product-details');
    window.history.pushState(null, '', `/?page=product-details&id=${id}`);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setPriceTier('all');
    setSelectedSizes([]);
    setSortBy('newest');
    onSearchClear();
  };

  return (
    <div className="shop-layout">
      {/* Mobile filter backdrop - closes drawer on tap outside */}
      {showMobileFilters && (
        <div 
          className="mobile-filter-backdrop active"
          onClick={() => setShowMobileFilters(false)}
        />
      )}

      {/* Filters Sidebar */}
      <FilterSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceTier={priceTier}
        setPriceTier={setPriceTier}
        sizeOptions={sizeOptions}
        selectedSizes={selectedSizes}
        handleSizeToggle={handleSizeToggle}
        clearAllFilters={clearAllFilters}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
      />

      {/* Product Listings grid */}
      <div style={{ minWidth: 0, width: '100%' }}>
        {/* Sort and status bar */}
        <SortBar
          searchQuery={searchQuery}
          productsLength={products.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Mobile top action triggers */}
        <div className="mobile-filter-bar">
          <button className="mobile-action-btn" onClick={() => setShowMobileFilters(true)}>
            🔍 Filters & Categories
          </button>
          <button className="mobile-action-btn" onClick={clearAllFilters}>
            Clear Filters
          </button>
        </div>

        {/* Product Grid showcase */}
        {loading ? (
          <div className="products-grid" style={{ marginTop: 0 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        ) : products.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '5rem', textAlign: 'center', borderRadius: '4px' }}>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>No products found</p>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem' }}>Try clearing filters or search query.</p>
            <button 
              className="add-cart-btn btn-sm" 
              style={{ marginTop: '1.5rem', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', maxWidth: '200px', margin: '1.5rem auto 0 auto' }}
              onClick={clearAllFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid" style={{ marginTop: 0 }}>
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                apiBase={apiBase}
                onAddToCart={onAddToCart}
                onProductClick={handleProductSelect}
                isWishlisted={wishlist.includes(prod.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

import React from 'react';

const FilterSidebar = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  priceTier, 
  setPriceTier, 
  sizeOptions, 
  selectedSizes, 
  handleSizeToggle, 
  clearAllFilters,
  isOpen,
  onClose
}) => {
  return (
    <div className={`filters-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="filters-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Filters</span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={clearAllFilters}
            style={{ background: 'none', border: 'none', color: 'var(--fk-blue)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            CLEAR ALL
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="mobile-filter-close-btn"
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-primary)', padding: '0.2rem' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categories checklist */}
      <div className="filter-section">
        <div className="filter-section-title">Categories</div>
        <div className="filter-checkbox-group">
          <label className="filter-checkbox-item">
            <input 
              type="radio" 
              name="category-filter"
              checked={selectedCategory === ''} 
              onChange={() => { setSelectedCategory(''); onClose && onClose(); }} 
            />
            <span>All Collections</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="filter-checkbox-item">
              <input 
                type="radio" 
                name="category-filter"
                checked={selectedCategory === cat.slug} 
                onChange={() => { setSelectedCategory(cat.slug); onClose && onClose(); }} 
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price filters range */}
      <div className="filter-section">
        <div className="filter-section-title">Price Range</div>
        <div className="filter-checkbox-group">
          <label className="filter-checkbox-item">
            <input type="radio" name="price-filter" checked={priceTier === 'all'} onChange={() => setPriceTier('all')} />
            <span>All Prices</span>
          </label>
          <label className="filter-checkbox-item">
            <input type="radio" name="price-filter" checked={priceTier === 'under_499'} onChange={() => setPriceTier('under_499')} />
            <span>Under ₹499</span>
          </label>
          <label className="filter-checkbox-item">
            <input type="radio" name="price-filter" checked={priceTier === '499_999'} onChange={() => setPriceTier('499_999')} />
            <span>₹499 - ₹999</span>
          </label>
          <label className="filter-checkbox-item">
            <input type="radio" name="price-filter" checked={priceTier === 'over_999'} onChange={() => setPriceTier('over_999')} />
            <span>₹999 & Above</span>
          </label>
        </div>
      </div>

      {/* Sizes Checklist */}
      <div className="filter-section" style={{ borderBottom: 'none' }}>
        <div className="filter-section-title">Sizes</div>
        <div className="filter-checkbox-group">
          {sizeOptions.map((size) => (
            <label key={size} className="filter-checkbox-item">
              <input 
                type="checkbox" 
                checked={selectedSizes.includes(size)} 
                onChange={() => handleSizeToggle(size)} 
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mobile apply button */}
      {onClose && (
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: 'var(--accent-color)',
              color: 'var(--bg-body)',
              border: 'none',
              fontFamily: 'var(--font-family)',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.75rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Apply Filters ✓
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;

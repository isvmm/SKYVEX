import React from 'react';

const SortBar = ({ searchQuery, productsLength, sortBy, setSortBy }) => {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontSize: '0.9rem' }}>
        {searchQuery && (
          <span style={{ marginRight: '1rem' }}>
            Search results for: <strong>"{searchQuery}"</strong>
          </span>
        )}
        <span>Showing <strong>{productsLength}</strong> products</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--text-gray)' }}>Sort By:</span>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ border: '1px solid var(--border-light)', padding: '0.25rem 0.5rem', borderRadius: '4px', outline: 'none' }}
        >
          <option value="newest">Newest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SortBar;

import React from 'react';

const CategoryCircles = ({ categories, apiBase, handleCategorySelect }) => {
  return (
    <div className="category-circles-section">
      <div className="category-circles-header">
        <h2 className="section-title">Shop by Category</h2>
        <span className="view-all-link" onClick={() => handleCategorySelect('')}>View All →</span>
      </div>
      <div className="category-circles-grid">
        {categories.map((cat) => {
          const displayImg = cat.image 
            ? (cat.image.startsWith('http') ? cat.image : `${apiBase.replace('/api', '')}${cat.image}`)
            : 'https://placehold.co/150?text=' + cat.name;

          return (
            <div 
              key={cat.id} 
              className="category-circle-item"
              onClick={() => handleCategorySelect(cat.slug)}
            >
              <div className="circle-img-box">
                <img src={displayImg} alt={cat.name} />
              </div>
              <span className="circle-label">{cat.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCircles;

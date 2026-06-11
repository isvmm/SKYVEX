import React from 'react';

const HeroBanner = ({ bannerImages, currentSlide, setCurrentSlide, apiBase, onSearch, setActivePage }) => {
  return (
    <div className="hero-banner" style={{ position: 'relative', overflow: 'hidden', height: '340px' }}>
      {bannerImages.map((imgUrl, idx) => {
        const displayUrl = imgUrl.startsWith('http') ? imgUrl : `${apiBase.replace('/api', '')}${imgUrl}`;
        const isActive = idx === currentSlide;
        return (
          <div 
            key={idx}
            className="banner-slide-full"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${displayUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              transition: 'opacity 0.8s ease-in-out',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '2.5rem',
            }}
          >

            {/* Call to Action buttons grouped in the bottom-left corner */}
            <div className="banner-btn-group" style={{ zIndex: 3, position: 'relative', display: 'flex', gap: '0.75rem', margin: 0 }}>
              <button 
                className="banner-btn" 
                onClick={() => {
                  onSearch('');
                  setActivePage('shop');
                  window.history.pushState(null, '', '/?page=shop');
                }}
                style={{
                  padding: '0.45rem 1.15rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: 'var(--fk-yellow)',
                  color: '#121214',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--fk-yellow-dark)'}
                onMouseOut={(e) => e.target.style.background = 'var(--fk-yellow)'}
              >
                Shop Now
              </button>
              <button 
                className="banner-btn banner-btn-outline" 
                onClick={() => {
                  onSearch('New');
                  setActivePage('shop');
                  window.history.pushState(null, '', '/?page=shop&search=New');
                }}
                style={{
                  padding: '0.42rem 1.1rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.4)'}
              >
                New Arrivals
              </button>
            </div>
          </div>
        );
      })}

      {/* Indicator Pagination Dots */}
      {bannerImages.length > 1 && (
        <div 
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            right: '1.25rem',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 4
          }}
        >
          {bannerImages.map((_, idx) => (
            <span 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: idx === currentSlide ? 'var(--fk-yellow)' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                transform: idx === currentSlide ? 'scale(1.2)' : 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;

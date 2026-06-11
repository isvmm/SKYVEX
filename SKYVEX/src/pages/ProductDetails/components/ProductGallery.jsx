import React from 'react';

const ProductGallery = ({ imagePaths, selectedImgIdx, setSelectedImgIdx, apiBase, name }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Thumbnails */}
      {imagePaths.length > 1 && (
        <div className="gallery-thumbnails">
          {imagePaths.map((img, idx) => {
            const url = img.startsWith('http') ? img : `${apiBase.replace('/api', '')}${img}`;
            return (
              <div 
                key={idx} 
                className={`gallery-thumbnail-item ${selectedImgIdx === idx ? 'active' : ''}`}
                onClick={() => setSelectedImgIdx(idx)}
              >
                <img src={url} alt={`Thumbnail ${idx + 1}`} />
              </div>
            );
          })}
        </div>
      )}

      {/* Main Image View */}
      <div style={{ flex: 1 }}>
        <div className="gallery-main-view">
          {imagePaths && imagePaths.length > 0 && imagePaths[selectedImgIdx] ? (
            <img 
              src={imagePaths[selectedImgIdx].startsWith('http') ? imagePaths[selectedImgIdx] : `${apiBase.replace('/api', '')}${imagePaths[selectedImgIdx]}`} 
              alt={name} 
            />
          ) : (
            <img src="https://placehold.co/400x500?text=No+Image" alt="Placeholder" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;

import React from 'react';
import { UploadCloud } from 'lucide-react';

const ProductForm = ({
  handleSubmit,
  editMode,
  name,
  setName,
  categoryId,
  setCategoryId,
  categories,
  price,
  setPrice,
  discountPrice,
  setDiscountPrice,
  stock,
  setStock,
  isBestSeller,
  setIsBestSeller,
  isNewArrival,
  setIsNewArrival,
  selectedSizes,
  handleSizeToggle,
  selectedColors,
  handleColorToggle,
  description,
  setDescription,
  handleImageFileChange,
  existingImagesList,
  removeExistingImage,
  newPreviews,
  removeNewImage,
  loading,
  resetForm,
  apiBase
}) => {
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const availableColors = ['Blue', 'Black', 'White', 'Grey', 'Red', 'Navy', 'Olive', 'Yellow'];

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-title">{editMode ? 'Edit Product' : 'Add New Product'}</div>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Classic Oversized Blue Tee"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Price (INR) *</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder="₹999.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Discounted Price (INR, Optional)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder="₹799.00"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Stock Count *</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 50"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ flexDirection: 'row', gap: '2rem', alignItems: 'center', paddingTop: '1.5rem' }}>
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
            />
            <span className="checkbox-custom"></span>
            <span>Best Seller</span>
          </label>

          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
            />
            <span className="checkbox-custom"></span>
            <span>New Arrival</span>
          </label>
        </div>

        <div className="form-group full-width">
          <label className="form-label">Sizes (Available)</label>
          <div className="form-checkbox-group">
            {availableSizes.map(size => (
              <label key={size} className="form-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                />
                <span className="checkbox-custom"></span>
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label className="form-label">Colors (Available)</label>
          <div className="form-checkbox-group">
            {availableColors.map(color => (
              <label key={color} className="form-checkbox">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorToggle(color)}
                />
                <span className="checkbox-custom"></span>
                <span>{color}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Product design notes, fabric blend, fit style details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Product Images (Upload up to 5)</label>
          <div 
            className="file-upload-zone"
            onClick={() => document.getElementById('product-images-input').click()}
          >
            <UploadCloud style={{ width: 36, height: 36, color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Click to upload multiple images</p>
            <input
              id="product-images-input"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageFileChange}
            />
          </div>

          {/* Show Previews */}
          <div className="image-previews-container">
            {/* Existing Images */}
            {editMode && existingImagesList.map((img, idx) => {
              const path = img.startsWith('http') ? img : `${apiBase.replace('/api', '')}${img}`;
              return (
                <div key={`existing-${idx}`} className="image-preview-card" style={{ border: '2px solid var(--accent)' }}>
                  <img src={path} alt="Existing product img" />
                  <div className="image-preview-remove" onClick={() => removeExistingImage(idx)}>✕</div>
                </div>
              );
            })}
            
            {/* New Previews */}
            {newPreviews.map((preview, idx) => (
              <div key={`new-${idx}`} className="image-preview-card">
                <img src={preview} alt="New upload preview" />
                <div className="image-preview-remove" onClick={() => removeNewImage(idx)}>✕</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving Product...' : (editMode ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

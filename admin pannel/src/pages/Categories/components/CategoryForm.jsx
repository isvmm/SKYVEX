import React from 'react';
import { FolderPlus } from 'lucide-react';

const CategoryForm = ({
  handleSubmit,
  name,
  setName,
  image,
  setImage,
  preview,
  setPreview,
  handleImageChange,
  loading,
  setShowAddForm
}) => {
  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-title">Create New Category</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Graphic Tees"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category Image</label>
          <div 
            className="file-upload-zone"
            onClick={() => document.getElementById('category-img-input').click()}
          >
            <FolderPlus style={{ width: 32, height: 32, color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click to upload image</p>
            <input
              id="category-img-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          {preview && (
            <div className="image-previews-container">
              <div className="image-preview-card">
                <img src={preview} alt="Category preview" />
                <div className="image-preview-remove" onClick={() => { setImage(null); setPreview(''); }}>✕</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

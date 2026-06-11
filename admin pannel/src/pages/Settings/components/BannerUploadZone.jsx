import React from 'react';
import { UploadCloud } from 'lucide-react';

const BannerUploadZone = ({
  settings,
  handleInputChange,
  handleFileChange,
  banner1Preview,
  banner2Preview,
  banner3Preview,
  handleRemoveBanner
}) => {
  return (
    <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Homepage Hero Billboard</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Hero Title / Brand Name</label>
          <input
            type="text"
            className="form-input"
            value={settings.homeBannerTitle || ''}
            onChange={(e) => handleInputChange('homeBannerTitle', e.target.value)}
            placeholder="e.g. SKYVEX"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Hero Tagline</label>
          <input
            type="text"
            className="form-input"
            value={settings.homeBannerTagline || ''}
            onChange={(e) => handleInputChange('homeBannerTagline', e.target.value)}
            placeholder="e.g. ✨ Premium Collection 2026"
          />
        </div>
        <div className="form-group full-width">
          <label className="form-label">Hero Description / Description Text</label>
          <textarea
            className="form-textarea"
            rows="3"
            value={settings.homeBannerDesc || ''}
            onChange={(e) => handleInputChange('homeBannerDesc', e.target.value)}
            placeholder="Describe your banner collection..."
          />
        </div>
        <div className="form-group full-width" style={{ marginTop: '1rem' }}>
          <label className="form-label">Homepage Hero Banners (Slideshow Posters - 3:1 Landscape Recommended)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
            
            {/* Slide 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Banner Slide 1</span>
              <div 
                className="file-upload-zone"
                onClick={() => document.getElementById('banner-img1-input').click()}
                style={{ height: '90px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
              >
                <UploadCloud style={{ width: 20, height: 20, color: 'var(--text-secondary)', marginBottom: '2px' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload Slide 1</span>
                <input
                  id="banner-img1-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(1, e.target.files[0])}
                />
              </div>
              {banner1Preview && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '70px' }}>
                    <img src={banner1Preview} alt="Slide 1 Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(1)}
                    className="btn btn-danger btn-sm"
                    style={{ justifyContent: 'center', width: '100%', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    Delete Poster
                  </button>
                </div>
              )}
            </div>

            {/* Slide 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Banner Slide 2</span>
              <div 
                className="file-upload-zone"
                onClick={() => document.getElementById('banner-img2-input').click()}
                style={{ height: '90px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
              >
                <UploadCloud style={{ width: 20, height: 20, color: 'var(--text-secondary)', marginBottom: '2px' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload Slide 2</span>
                <input
                  id="banner-img2-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(2, e.target.files[0])}
                />
              </div>
              {banner2Preview && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '70px' }}>
                    <img src={banner2Preview} alt="Slide 2 Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(2)}
                    className="btn btn-danger btn-sm"
                    style={{ justifyContent: 'center', width: '100%', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    Delete Poster
                  </button>
                </div>
              )}
            </div>

            {/* Slide 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Banner Slide 3</span>
              <div 
                className="file-upload-zone"
                onClick={() => document.getElementById('banner-img3-input').click()}
                style={{ height: '90px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
              >
                <UploadCloud style={{ width: 20, height: 20, color: 'var(--text-secondary)', marginBottom: '2px' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload Slide 3</span>
                <input
                  id="banner-img3-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(3, e.target.files[0])}
                />
              </div>
              {banner3Preview && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '70px' }}>
                    <img src={banner3Preview} alt="Slide 3 Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(3)}
                    className="btn btn-danger btn-sm"
                    style={{ justifyContent: 'center', width: '100%', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    Delete Poster
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerUploadZone;

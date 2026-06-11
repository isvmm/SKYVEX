import React from 'react';

const BadgeInputs = ({ settings, handleInputChange }) => {
  return (
    <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Trust Badges & Highlights</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Badge 1 Title</label>
          <input type="text" className="form-input" value={settings.featuresBarText1_title || ''} onChange={(e) => handleInputChange('featuresBarText1_title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Badge 1 Description</label>
          <input type="text" className="form-input" value={settings.featuresBarText1_desc || ''} onChange={(e) => handleInputChange('featuresBarText1_desc', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Badge 2 Title</label>
          <input type="text" className="form-input" value={settings.featuresBarText2_title || ''} onChange={(e) => handleInputChange('featuresBarText2_title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Badge 2 Description</label>
          <input type="text" className="form-input" value={settings.featuresBarText2_desc || ''} onChange={(e) => handleInputChange('featuresBarText2_desc', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Badge 3 Title</label>
          <input type="text" className="form-input" value={settings.featuresBarText3_title || ''} onChange={(e) => handleInputChange('featuresBarText3_title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Badge 3 Description</label>
          <input type="text" className="form-input" value={settings.featuresBarText3_desc || ''} onChange={(e) => handleInputChange('featuresBarText3_desc', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Badge 4 Title</label>
          <input type="text" className="form-input" value={settings.featuresBarText4_title || ''} onChange={(e) => handleInputChange('featuresBarText4_title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Badge 4 Description</label>
          <input type="text" className="form-input" value={settings.featuresBarText4_desc || ''} onChange={(e) => handleInputChange('featuresBarText4_desc', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default BadgeInputs;

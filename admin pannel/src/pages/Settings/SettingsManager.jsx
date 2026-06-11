import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import BannerUploadZone from './components/BannerUploadZone';
import BadgeInputs from './components/BadgeInputs';

const SettingsManager = ({ apiBase }) => {
  const [settings, setSettings] = useState({
    homeBannerTagline: '',
    homeBannerTitle: '',
    homeBannerDesc: '',
    homeBannerImage: '',
    homeBannerImage1: '',
    homeBannerImage2: '',
    homeBannerImage3: '',
    featuresBarText1_title: '',
    featuresBarText1_desc: '',
    featuresBarText2_title: '',
    featuresBarText2_desc: '',
    featuresBarText3_title: '',
    featuresBarText3_desc: '',
    featuresBarText4_title: '',
    featuresBarText4_desc: '',
    footerAboutText: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    promoBannerText: ''
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [bannerImage1File, setBannerImage1File] = useState(null);
  const [bannerImage2File, setBannerImage2File] = useState(null);
  const [bannerImage3File, setBannerImage3File] = useState(null);
  const [banner1Preview, setBanner1Preview] = useState('');
  const [banner2Preview, setBanner2Preview] = useState('');
  const [banner3Preview, setBanner3Preview] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/settings`);
      const data = await res.json();
      setSettings(data);
      setBanner1Preview(
        data.homeBannerImage1
          ? (data.homeBannerImage1.startsWith('http') ? data.homeBannerImage1 : `${apiBase.replace('/api', '')}${data.homeBannerImage1}`)
          : ''
      );
      setBanner2Preview(
        data.homeBannerImage2
          ? (data.homeBannerImage2.startsWith('http') ? data.homeBannerImage2 : `${apiBase.replace('/api', '')}${data.homeBannerImage2}`)
          : ''
      );
      setBanner3Preview(
        data.homeBannerImage3
          ? (data.homeBannerImage3.startsWith('http') ? data.homeBannerImage3 : `${apiBase.replace('/api', '')}${data.homeBannerImage3}`)
          : ''
      );
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, val) => {
    setSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleFileChange = (slideNum, file) => {
    if (file) {
      if (slideNum === 1) {
        setBannerImage1File(file);
        setBanner1Preview(URL.createObjectURL(file));
      } else if (slideNum === 2) {
        setBannerImage2File(file);
        setBanner2Preview(URL.createObjectURL(file));
      } else if (slideNum === 3) {
        setBannerImage3File(file);
        setBanner3Preview(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveBanner = (slideNum) => {
    if (window.confirm(`Are you sure you want to delete Banner Slide ${slideNum}?`)) {
      if (slideNum === 1) {
        setBannerImage1File(null);
        setBanner1Preview('');
        setSettings(prev => ({ ...prev, homeBannerImage1: '' }));
      } else if (slideNum === 2) {
        setBannerImage2File(null);
        setBanner2Preview('');
        setSettings(prev => ({ ...prev, homeBannerImage2: '' }));
      } else if (slideNum === 3) {
        setBannerImage3File(null);
        setBanner3Preview('');
        setSettings(prev => ({ ...prev, homeBannerImage3: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSaveSuccess(false);
 
      const formData = new FormData();
      Object.keys(settings).forEach(key => {
        if (key !== 'homeBannerImage' && key !== 'homeBannerImage1' && key !== 'homeBannerImage2' && key !== 'homeBannerImage3') {
          formData.append(key, settings[key]);
        }
      });

      if (bannerImage1File) {
        formData.append('homeBannerImage1File', bannerImage1File);
      } else {
        formData.append('homeBannerImage1', settings.homeBannerImage1 || '');
      }

      if (bannerImage2File) {
        formData.append('homeBannerImage2File', bannerImage2File);
      } else {
        formData.append('homeBannerImage2', settings.homeBannerImage2 || '');
      }

      if (bannerImage3File) {
        formData.append('homeBannerImage3File', bannerImage3File);
      } else {
        formData.append('homeBannerImage3', settings.homeBannerImage3 || '');
      }

      formData.append('homeBannerImage', settings.homeBannerImage1 || settings.homeBannerImage2 || settings.homeBannerImage3 || settings.homeBannerImage || '');

      const res = await fetch(`${apiBase}/settings`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        
        // Reset file inputs so they are not re-uploaded on next save
        setBannerImage1File(null);
        setBannerImage2File(null);
        setBannerImage3File(null);

        // Update previews to the fresh saved URLs
        setBanner1Preview(
          data.settings.homeBannerImage1
            ? (data.settings.homeBannerImage1.startsWith('http') ? data.settings.homeBannerImage1 : `${apiBase.replace('/api', '')}${data.settings.homeBannerImage1}`)
            : ''
        );
        setBanner2Preview(
          data.settings.homeBannerImage2
            ? (data.settings.homeBannerImage2.startsWith('http') ? data.settings.homeBannerImage2 : `${apiBase.replace('/api', '')}${data.settings.homeBannerImage2}`)
            : ''
        );
        setBanner3Preview(
          data.settings.homeBannerImage3
            ? (data.settings.homeBannerImage3.startsWith('http') ? data.settings.homeBannerImage3 : `${apiBase.replace('/api', '')}${data.settings.homeBannerImage3}`)
            : ''
        );

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Store Settings & Content Management</h2>
        {saveSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
            <CheckCircle style={{ width: 18, height: 18 }} />
            Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* Section 1: Promotion / Announcement */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Announcement & Promo Banner</h3>
          <div className="form-group full-width">
            <label className="form-label">Top Banner Announcement Text</label>
            <input
              type="text"
              className="form-input"
              value={settings.promoBannerText || ''}
              onChange={(e) => handleInputChange('promoBannerText', e.target.value)}
              placeholder="e.g. Extra 10% off on your first order! Use code WELCOME10"
            />
          </div>
        </div>

        {/* Section 2: Home Hero Slide */}
        <BannerUploadZone
          settings={settings}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          banner1Preview={banner1Preview}
          banner2Preview={banner2Preview}
          banner3Preview={banner3Preview}
          handleRemoveBanner={handleRemoveBanner}
        />

        {/* Section 3: Trust Badges */}
        <BadgeInputs
          settings={settings}
          handleInputChange={handleInputChange}
        />

        {/* Section 4: Footer Info */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Footer & Contact Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Footer About Text</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={settings.footerAboutText || ''}
                onChange={(e) => handleInputChange('footerAboutText', e.target.value)}
                placeholder="Short statement about your brand..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input type="email" className="form-input" value={settings.contactEmail || ''} onChange={(e) => handleInputChange('contactEmail', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input type="text" className="form-input" value={settings.contactPhone || ''} onChange={(e) => handleInputChange('contactPhone', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label className="form-label">Office HQ Address</label>
              <input type="text" className="form-input" value={settings.contactAddress || ''} onChange={(e) => handleInputChange('contactAddress', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save style={{ width: 18, height: 18 }} />
            {loading ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;

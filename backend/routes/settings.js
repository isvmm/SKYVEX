const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { upload } = require('../config/cloudinary');

const defaultSettings = {
  homeBannerTagline: '✨ Premium Collection 2026',
  homeBannerTitle: 'SKYVEX',
  homeBannerDesc: 'Premium T-Shirts built for everyday confidence. Crafted from 100% combed cotton, custom fits, and breathable graphics.',
  homeBannerImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200',
  homeBannerImage1: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200',
  homeBannerImage2: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200',
  homeBannerImage3: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200',
  featuresBarText1_title: 'Free Delivery',
  featuresBarText1_desc: 'On orders above ₹499',
  featuresBarText2_title: 'Easy Returns',
  featuresBarText2_desc: '15-day hassle-free returns',
  featuresBarText3_title: 'Secure Payments',
  featuresBarText3_desc: '256-bit SSL secure gateway',
  featuresBarText4_title: '100% Authentic',
  featuresBarText4_desc: 'Direct from SKYVEX studio',
  footerAboutText: 'SKYVEX is your one-stop-shop for oversized graphic tees and premium everyday staples built for comfort and style.',
  contactEmail: 'contact@skyvex.com',
  contactPhone: '+91 98765 43210',
  contactAddress: 'HQ: Mumbai, Maharashtra, India',
  promoBannerText: 'Extra 10% off on your first order! Use code WELCOME10 at checkout.'
};

// GET all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const settingsMap = {};
    
    // Initialize with defaults
    Object.keys(defaultSettings).forEach(key => {
      settingsMap[key] = defaultSettings[key];
    });

    // Override with DB values
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    res.json(settingsMap);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ message: 'Server error fetching settings' });
  }
});

// POST update multiple settings
router.post('/', upload.any(), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // If files were uploaded, process them
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fieldName = file.fieldname; // e.g. "homeBannerImage1File"
        const settingKey = fieldName.replace('File', ''); // e.g. "homeBannerImage1"
        const isCloudinary = file.path.startsWith('http');
        updates[settingKey] = isCloudinary 
          ? file.path 
          : `/uploads/${file.filename}`;
      });
    }

    // Update each setting in the database
    for (const key of Object.keys(updates)) {
      await Setting.upsert({
        key,
        value: String(updates[key])
      });
    }

    // Retrieve full settings list again
    const settings = await Setting.findAll();
    const settingsMap = {};
    
    Object.keys(defaultSettings).forEach(key => {
      settingsMap[key] = defaultSettings[key];
    });

    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    res.json({ message: 'Settings updated successfully', settings: settingsMap });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: 'Server error updating settings' });
  }
});

module.exports = router;

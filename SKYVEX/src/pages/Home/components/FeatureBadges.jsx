import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Award } from 'lucide-react';

const FeatureBadges = ({ settings }) => {
  return (
    <div className="features-bar">
      <div className="feature-card">
        <div className="feature-icon-box">
          <Truck />
        </div>
        <div>
          <div className="feature-title">{settings?.featuresBarText1_title || 'Free Delivery'}</div>
          <div className="feature-desc">{settings?.featuresBarText1_desc || 'On orders above ₹499'}</div>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature-icon-box">
          <RotateCcw />
        </div>
        <div>
          <div className="feature-title">{settings?.featuresBarText2_title || 'Easy Returns'}</div>
          <div className="feature-desc">{settings?.featuresBarText2_desc || '15-day hassle-free returns'}</div>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature-icon-box">
          <ShieldCheck />
        </div>
        <div>
          <div className="feature-title">{settings?.featuresBarText3_title || 'Secure Payments'}</div>
          <div className="feature-desc">{settings?.featuresBarText3_desc || '256-bit SSL secure gateway'}</div>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature-icon-box">
          <Award />
        </div>
        <div>
          <div className="feature-title">{settings?.featuresBarText4_title || '100% Authentic'}</div>
          <div className="feature-desc">{settings?.featuresBarText4_desc || 'Direct from SKYVEX studio'}</div>
        </div>
      </div>
    </div>
  );
};

export default FeatureBadges;

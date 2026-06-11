import React from 'react';
import { Shield, RotateCcw, Truck } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-gray)' }}>
        <Shield style={{ color: 'var(--fk-blue)', width: 24, height: 24, margin: '0 auto 0.25rem auto' }} />
        <div>100% Authentic Product</div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-gray)' }}>
        <RotateCcw style={{ color: 'var(--fk-blue)', width: 24, height: 24, margin: '0 auto 0.25rem auto' }} />
        <div>15-Day Easy Returns</div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-gray)' }}>
        <Truck style={{ color: 'var(--fk-blue)', width: 24, height: 24, margin: '0 auto 0.25rem auto' }} />
        <div>Cash on Delivery Available</div>
      </div>
    </div>
  );
};

export default TrustBadges;

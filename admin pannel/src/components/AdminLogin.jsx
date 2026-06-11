import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Smartphone, AlertTriangle } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [deviceId, setDeviceId] = useState('');
  const [deviceLabel, setDeviceLabel] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if device ID is already created
    let existingId = localStorage.getItem('skyvex_admin_device_id');
    if (!existingId) {
      const randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
      existingId = `SKYVEX-DEVICE-${randHex}`;
      localStorage.setItem('skyvex_admin_device_id', existingId);
    }
    setDeviceId(existingId);
    setDeviceLabel(localStorage.getItem('skyvex_admin_device_label') || existingId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (passcode === '592005') {
        // Successful login
        localStorage.setItem('skyvex_admin_device_label', deviceLabel);
        
        const authData = {
          deviceId: deviceId,
          deviceLabel: deviceLabel,
          authorized: true,
          authorizedAt: Date.now()
        };
        localStorage.setItem('skyvex_admin_auth', JSON.stringify(authData));
        setLoading(false);
        onLoginSuccess();
      } else {
        setError('Invalid 6-digit access code. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  const handlePasscodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Numeric only
    if (val.length <= 6) {
      setPasscode(val);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-glass-card">
        <div className="login-header">
          <div className="login-logo-box">
            <ShieldCheck style={{ width: 32, height: 32, color: 'white' }} />
          </div>
          <h2 className="login-title">SKYVEX</h2>
          <p className="login-subtitle">Secure Administration Portal</p>
        </div>

        {error && (
          <div className="login-error-box">
            <AlertTriangle style={{ width: 18, height: 18, color: '#f87171', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label className="login-label">
              <Smartphone size={15} style={{ opacity: 0.7 }} />
              <span>Current Device ID (Authorized Signature)</span>
            </label>
            <input
              type="text"
              className="login-input"
              value={deviceLabel}
              onChange={(e) => setDeviceLabel(e.target.value)}
              placeholder="e.g. My Phone"
              required
            />
            <span className="login-device-subtext">Signature: {deviceId}</span>
          </div>

          <div className="login-field-group">
            <label className="login-label">
              <Lock size={15} style={{ opacity: 0.7 }} />
              <span>6-Digit Access Code</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                className="login-input login-passcode-input"
                value={passcode}
                onChange={handlePasscodeChange}
                placeholder="••••••"
                maxLength={6}
                required
                style={{
                  letterSpacing: passcode ? '0.7rem' : 'normal',
                  textAlign: passcode ? 'center' : 'left',
                  fontSize: passcode ? '1.5rem' : '1rem',
                  paddingLeft: passcode ? '1.2rem' : '1rem'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={loading || passcode.length !== 6}
          >
            {loading ? 'Authenticating Device...' : 'Authorize Device Access'}
          </button>
        </form>

        <div className="login-footer">
          Only authorized device signatures with valid security credentials may access this administration console. All login events are monitored.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

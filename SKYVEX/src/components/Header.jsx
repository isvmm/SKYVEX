import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, MapPin, Sun, Moon, User, Menu, X, Home, ShoppingBag, Tag, Phone, Info } from 'lucide-react';

const Header = ({ activePage, setActivePage, cart, wishlist, onSearch, settings, theme, toggleTheme, user, onOpenAuth, onLogout }) => {
  const [searchVal, setSearchVal] = useState('');
  const [locationName, setLocationName] = useState(() => localStorage.getItem('skyvex_user_location') || 'Select Location');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.open(`/?page=shop&search=${encodeURIComponent(searchVal)}`, '_blank');
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationName('Locating...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoCacheKey = `skyvex_geo_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
          const cachedVal = localStorage.getItem(geoCacheKey);
          if (cachedVal) {
            setLocationName(cachedVal);
            localStorage.setItem('skyvex_user_location', cachedVal);
            return;
          }
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12`);
          const data = await res.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.suburb || data.address.state || 'India';
            const postcode = data.address.postcode || '';
            const locationStr = postcode ? `${city} ${postcode}` : city;
            setLocationName(locationStr);
            localStorage.setItem('skyvex_user_location', locationStr);
            localStorage.setItem(geoCacheKey, locationStr);
          } else {
            const coordStr = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
            setLocationName(coordStr);
            localStorage.setItem('skyvex_user_location', coordStr);
            localStorage.setItem(geoCacheKey, coordStr);
          }
        } catch (e) {
          const coordStr = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
          setLocationName(coordStr);
          localStorage.setItem('skyvex_user_location', coordStr);
        }
      },
      () => {
        setLocationName('Access Denied');
        alert('Location access denied. Please enable location permissions in your browser settings.');
      }
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigate = (page, search = '') => {
    onSearch(search);
    setActivePage(page);
    window.history.pushState(null, '', search ? `/?page=${page}&search=${encodeURIComponent(search)}` : `/?page=${page}`);
    setMenuOpen(false);
  };

  /* ── Slide-in Menu Items ── */
  const menuItems = [
    { icon: <Home size={18} />, label: 'Home', action: () => navigate('home') },
    { icon: <ShoppingBag size={18} />, label: 'All Products', action: () => navigate('shop') },
    { icon: <Tag size={18} />, label: 'Oversized Tees', action: () => navigate('shop', 'Oversized') },
    { icon: <Tag size={18} />, label: 'Graphic Tees', action: () => navigate('shop', 'Graphic') },
    { icon: <Tag size={18} />, label: 'Polo T-Shirts', action: () => navigate('shop', 'Polo') },
    { icon: <Heart size={18} />, label: `Wishlist (${wishlist.length})`, action: () => alert('Wishlist contains ' + wishlist.length + ' item(s)') },
    { icon: <ShoppingCart size={18} />, label: `Cart (${cartCount})`, action: () => navigate('cart') },
    { icon: <User size={18} />, label: user ? 'My Profile' : 'Sign In / Register', action: () => {
      if (user) navigate('profile');
      else onOpenAuth();
    } },
  ];

  return (
    <>
      {/* ── Slide-in Mobile Menu Backdrop ── */}
      {menuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      {/* ── Slide-in Mobile Menu Drawer ── */}
      <div className={`mobile-menu-drawer ${menuOpen ? 'open' : ''}`}>
        {/* Drawer header */}
        <div className="mobile-menu-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={22} style={{ color: 'var(--fk-yellow)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user ? user.email.split('@')[0] : 'Hello, Guest'}</div>
              <div
                onClick={() => { setMenuOpen(false); if (user) navigate('profile'); else onOpenAuth(); }}
                style={{ fontSize: '0.75rem', color: 'var(--fk-yellow)', cursor: 'pointer', marginTop: '1px' }}
              >
                {user ? 'View Profile ›' : 'Sign in ›'}
              </div>
            </div>
          </div>
          <button className="menu-close-btn" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer nav items */}
        <div className="mobile-menu-items">
          {menuItems.map((item, idx) => (
            <div key={idx} className="mobile-menu-item" onClick={item.action}>
              <span className="mobile-menu-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}

          {/* Theme toggle inside menu */}
          <div className="mobile-menu-item" onClick={() => { toggleTheme(); setMenuOpen(false); }}>
            <span className="mobile-menu-item-icon">
              {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#a1a1aa' }} />}
            </span>
            <span>{theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}</span>
          </div>
        </div>
      </div>

      {/* ── Main Header Wrapper ── */}
      <div className="header-wrapper">
        {/* ══ DESKTOP LAYOUT (hidden on mobile via CSS) ══ */}
        <div className="header-container header-desktop">

          {/* Brand Logo */}
          <div className="header-logo" onClick={() => navigate('home')}>
            <span className="logo-main">SKYVEX</span>
            <span className="logo-sub">Explore Plus <span style={{ color: 'var(--fk-yellow)', fontWeight: 'bold' }}>★</span></span>
          </div>

          {/* Location Section */}
          <div
            className="header-location"
            onClick={handleLocationRequest}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'white', cursor: 'pointer', marginLeft: '0.5rem', userSelect: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <MapPin style={{ width: 18, height: 18, color: 'var(--fk-yellow)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase', fontWeight: 600 }}>Deliver to</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{locationName}</span>
            </div>
          </div>

          {/* Search Bar */}
          <form className="search-bar-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Search for T-shirts, polos, oversized..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit" className="search-button">
              <Search style={{ width: 18, height: 18 }} />
            </button>
          </form>

          {/* Desktop Nav */}
          <div className="header-nav">
            {user ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="login-btn" onClick={() => navigate('profile')} style={{ padding: '0.45rem 1rem' }}>
                  Profile
                </button>
                <button className="login-btn" onClick={() => { onLogout(); navigate('home'); }} style={{ padding: '0.45rem 1rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={onOpenAuth}>
                Login
              </button>
            )}
            <div className="nav-link" onClick={() => navigate('shop')}>
              <span>Shop</span>
            </div>
            <div className="nav-link" onClick={() => alert('Wishlist contains ' + wishlist.length + ' item(s)')}>
              <Heart style={{ width: 18, height: 18 }} />
              <span>Wishlist</span>
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
            </div>
            <div className="nav-link" onClick={() => navigate('cart')}>
              <ShoppingCart style={{ width: 18, height: 18 }} />
              <span>Cart</span>
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </div>
            <button
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', transition: 'transform 0.2s ease', borderRadius: '50%' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            >
              {theme === 'dark' ? <Sun style={{ width: 18, height: 18, color: '#f59e0b' }} /> : <Moon style={{ width: 18, height: 18, color: '#a1a1aa' }} />}
            </button>
          </div>
        </div>

        {/* ══ MOBILE LAYOUT ══ */}
        <div className="header-mobile">
          {/* Row 1: Hamburger | Logo | Sign-in icon | Cart icon */}
          <div className="mobile-header-row1">
            {/* Hamburger */}
            <button className="mobile-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>

            {/* Logo */}
            <div className="header-logo mobile-logo" onClick={() => navigate('home')}>
              <span className="logo-main">SKYVEX</span>
              <span className="logo-sub">Explore Plus <span style={{ color: 'var(--fk-yellow)', fontWeight: 'bold' }}>★</span></span>
            </div>

            {/* Right Actions */}
            <div className="mobile-header-actions">
              {/* Sign in button */}
              <button
                className="mobile-signin-btn"
                onClick={() => { if (user) navigate('profile'); else onOpenAuth(); }}
              >
                <User size={20} />
                <span className="mobile-signin-text">{user ? 'Profile' : 'Sign in'}</span>
              </button>

              {/* Cart */}
              <button
                className="mobile-cart-btn"
                onClick={() => navigate('cart')}
                aria-label="Cart"
              >
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="mobile-badge">{cartCount}</span>
                  )}
                </div>
              </button>

              {/* Theme toggle */}
              <button
                className="mobile-theme-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#a1a1aa' }} />}
              </button>
            </div>
          </div>

          {/* Row 2: Full-width Search bar */}
          <div className="mobile-header-row2">
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <Search size={16} className="mobile-search-icon-left" />
              <input
                type="text"
                className="mobile-search-input"
                placeholder="Search T-shirts, polos, oversized..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <button type="submit" className="mobile-search-btn-right">
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Row 3: Location strip (like Amazon) */}
          <div className="mobile-location-strip" onClick={handleLocationRequest}>
            <MapPin size={14} style={{ color: 'var(--fk-yellow)', flexShrink: 0 }} />
            <span className="mobile-location-text">
              Delivering to <strong>{locationName}</strong>
            </span>
            <span className="mobile-location-update">Update ›</span>
          </div>
        </div>

        {/* ── Sub Header Navigation ── */}
        <div className="subheader-wrapper">
          <div className="subheader-container">
            <span className={`subheader-link ${activePage === 'home' ? 'active' : ''}`} onClick={() => navigate('home')}>
              Home
            </span>
            <span className={`subheader-link ${activePage === 'shop' ? 'active' : ''}`} onClick={() => navigate('shop')}>
              All Products
            </span>
            <span className="subheader-link" onClick={() => navigate('shop', 'Oversized')}>
              Oversized Tees
            </span>
            <span className="subheader-link" onClick={() => navigate('shop', 'Graphic')}>
              Graphic Tees
            </span>
            <span className="subheader-link" onClick={() => navigate('shop', 'Polo')}>
              Polo T-Shirts
            </span>
          </div>
        </div>

        {/* ── Promo Bar ── */}
        <div className="promo-bar">
          <div className="promo-container" style={{ justifyContent: 'center' }}>
            <div className="promo-item" style={{ fontSize: '0.82rem', fontWeight: '500', color: 'var(--text-dark)' }}>
              <span>📢 Announcement: </span>
              {settings?.promoBannerText || 'Use coupon EZEE10 for 10% off • Free shipping above ₹499 • 15-day easy returns'}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Header;

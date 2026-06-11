import React, { useState, useEffect } from 'react';

// Components & Pages
import Header from './components/Header';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AuthModal from './components/AuthModal';
import Profile from './pages/Profile/Profile';

function App() {
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'home';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });
  const [selectedProductId, setSelectedProductId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skyvex_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('skyvex_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('skyvex_user', JSON.stringify(user));
      if (token) localStorage.setItem('skyvex_token', token);
    } else {
      localStorage.removeItem('skyvex_user');
      localStorage.removeItem('skyvex_token');
    }
  }, [user, token]);

  // Auto-login prompt for guests
  useEffect(() => {
    if (!user && !sessionStorage.getItem('skyvex_has_prompted_login')) {
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
        sessionStorage.setItem('skyvex_has_prompted_login', 'true');
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    if (activePage === 'profile') {
      window.history.pushState(null, '', '/?page=home');
      setActivePage('home');
    }
  };

  // Cart: [{ product, quantity, size, color }]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('skyvex_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      return [];
    }
  });
  
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('skyvex_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading wishlist:', e);
      return [];
    }
  });
  
  const [coupon, setCoupon] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('skyvex_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('skyvex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const apiBase = 'https://skyvex-backend.onrender.com/api';

  const [settings, setSettings] = useState({
    homeBannerTagline: '✨ Premium Collection 2026',
    homeBannerTitle: 'SKYVEX',
    homeBannerDesc: 'Premium T-Shirts built for everyday confidence. Crafted from 100% combed cotton, custom fits, and breathable graphics.',
    homeBannerImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
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
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Always fetch settings fresh — no caching because admin can update banner images anytime
  const fetchSettings = () => {
    fetch(`${apiBase}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  };

  useEffect(() => {
    fetchSettings();

    // Re-fetch when user returns to the tab (tab was in background, admin may have updated)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSettings();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [apiBase]);

  // Cart Callbacks
  const handleAddToCart = (product, size, color) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existingIdx > -1) {
        const updatedCart = [...prevCart];
        const newQty = updatedCart[existingIdx].quantity + 1;
        
        // Ensure not exceeding stock limits
        if (newQty <= product.stock) {
          updatedCart[existingIdx].quantity = newQty;
          alert(`Quantity updated in Cart: "${product.name}" (${size}) x ${newQty}`);
        } else {
          alert(`Sorry, stock is limited. Cannot add more of "${product.name}".`);
        }
        return updatedCart;
      } else {
        alert(`Added to Cart: "${product.name}" (${size})`);
        return [...prevCart, { product, quantity: 1, size, color }];
      }
    });
  };

  const handleUpdateQty = (productId, size, color, newQty) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId, size, color) => {
    if (window.confirm('Remove this item from your shopping cart?')) {
      setCart((prevCart) =>
        prevCart.filter(
          (item) =>
            !(item.product.id === productId && item.size === size && item.color === color)
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Wishlist callback
  const handleToggleWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  const handleSetActivePage = (pageName) => {
    setActivePage(pageName);
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageName);
    window.history.pushState(null, '', `/?${params.toString()}`);
  };

  // Switch routing based on state activePage
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            apiBase={apiBase}
            setActivePage={handleSetActivePage}
            setSelectedProductId={setSelectedProductId}
            onSearch={setSearchQuery}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            settings={settings}
            theme={theme}
          />
        );
      case 'shop':
        return (
          <Shop
            apiBase={apiBase}
            searchQuery={searchQuery}
            onSearchClear={() => setSearchQuery('')}
            setActivePage={handleSetActivePage}
            setSelectedProductId={setSelectedProductId}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        );
      case 'product-details':
        return (
          <ProductDetails
            apiBase={apiBase}
            productId={selectedProductId}
            onAddToCart={handleAddToCart}
            setActivePage={handleSetActivePage}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        );
      case 'cart':
        return (
          <Cart
            apiBase={apiBase}
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            setActivePage={handleSetActivePage}
            coupon={coupon}
            setCoupon={setCoupon}
          />
        );
      case 'checkout':
        return (
          <Checkout
            apiBase={apiBase}
            cart={cart}
            coupon={coupon}
            onClearCart={handleClearCart}
            setLastPlacedOrder={setLastPlacedOrder}
            setActivePage={handleSetActivePage}
            user={user}
            token={token}
          />
        );
      case 'profile':
        return (
          <Profile
            apiBase={apiBase}
            user={user}
            token={token}
            onLogout={handleLogout}
            setActivePage={handleSetActivePage}
          />
        );
      case 'order-success':
        return (
          <OrderSuccess
            order={lastPlacedOrder}
            setActivePage={handleSetActivePage}
          />
        );
      default:
        return (
          <Home
            apiBase={apiBase}
            setActivePage={handleSetActivePage}
            setSelectedProductId={setSelectedProductId}
            onSearch={setSearchQuery}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            settings={settings}
          />
        );
    }
  };
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navigation Header */}
        <Header
          activePage={activePage}
          setActivePage={handleSetActivePage}
          cart={cart}
          wishlist={wishlist}
          onSearch={setSearchQuery}
          settings={settings}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Pages render container */}
        <main style={{ flex: 1, paddingBottom: '3rem' }}>
          {renderPage()}
        </main>

        {/* Brand Footer */}
        <footer style={{ background: '#121212', color: 'white', padding: '2rem 1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.82rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '1248px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div>
              <h4 style={{ fontWeight: 'bold', color: 'var(--text-gray)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>About</h4>
              <p style={{ maxWidth: '280px', color: '#c2c2c2', lineHeight: '1.5' }}>{settings.footerAboutText}</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', color: 'var(--text-gray)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Help</h4>
              <p style={{ color: '#c2c2c2' }}><a href="#payments" style={{ color: 'inherit' }}>Payments</a></p>
              <p style={{ color: '#c2c2c2', marginTop: '0.25rem' }}><a href="#shipping" style={{ color: 'inherit' }}>Shipping</a></p>
              <p style={{ color: '#c2c2c2', marginTop: '0.25rem' }}><a href="#cancellations" style={{ color: 'inherit' }}>Cancellations & Returns</a></p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', color: 'var(--text-gray)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Contact</h4>
              <p style={{ color: '#c2c2c2' }}>Email: {settings.contactEmail}</p>
              <p style={{ color: '#c2c2c2', marginTop: '0.25rem' }}>Phone: {settings.contactPhone}</p>
              <p style={{ color: '#c2c2c2', marginTop: '0.25rem' }}>HQ: {settings.contactAddress}</p>
            </div>
          </div>
          <div style={{ color: 'var(--text-gray)', borderTop: '1px solid #2a3c54', paddingTop: '1.25rem' }}>
            © {new Date().getFullYear()} SKYVEX. All Rights Reserved. Made with ♥ for Premium Comfort.
          </div>
        </footer>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        apiBase={apiBase}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default App;

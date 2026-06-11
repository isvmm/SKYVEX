import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderTree, 
  Layers, 
  Tag, 
  ShoppingBag, 
  Settings as SettingsIcon,
  Menu, 
  X,
  LogOut
} from 'lucide-react';

// Subcomponents
import Dashboard from './pages/Dashboard';
import CategoryManager from './pages/Categories';
import ProductManager from './pages/Products';
import CouponManager from './pages/Coupons';
import OrderManager from './pages/Orders';
import SettingsManager from './pages/Settings';
import AdminLogin from './components/AdminLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const auth = localStorage.getItem('skyvex_admin_auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        const deviceId = localStorage.getItem('skyvex_admin_device_id');
        return parsed && parsed.authorized && parsed.deviceId === deviceId;
      }
    } catch (e) {
      console.error('Error loading auth status:', e);
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const apiBase = 'https://skyvex-backend.onrender.com/api';

  const handleLogout = () => {
    if (window.confirm('Do you want to log out and de-authorize this device? You will need the passcode to log in again.')) {
      localStorage.removeItem('skyvex_admin_auth');
      setIsAuthenticated(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard apiBase={apiBase} />;
      case 'categories':
        return <CategoryManager apiBase={apiBase} />;
      case 'products':
        return <ProductManager apiBase={apiBase} />;
      case 'coupons':
        return <CouponManager apiBase={apiBase} />;
      case 'orders':
        return <OrderManager apiBase={apiBase} />;
      case 'settings':
        return <SettingsManager apiBase={apiBase} />;
      default:
        return <Dashboard apiBase={apiBase} />;
    }
  };

  const getPageTitle = () => {
    const item = menuItems.find(m => m.id === activeTab);
    return item ? item.label : 'Admin Panel';
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Backdrop Overlay on Mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="brand-logo">SKYVEX</span>
            <span className="brand-badge">ADMIN</span>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'none', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            aria-label="Close menu"
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li 
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false); // Close sidebar on click on mobile
                }}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Panel Content */}
      <div className="main-content">
        {/* Top bar header */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open menu"
            >
              <Menu style={{ width: 20, height: 20 }} />
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="user-profile">
              <div className="avatar">A</div>
              <span className="admin-profile-text" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin Portal</span>
            </div>

            <button 
              className="btn btn-secondary btn-sm logout-btn-header"
              onClick={handleLogout}
              title="Log out & de-authorize device"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.55rem', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <LogOut style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Tab Components */}
        {renderActiveComponent()}
      </div>

      {/* Basic Mobile CSS helper */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
            background: var(--bg-secondary) !important;
            border: 1px solid var(--border-color) !important;
            color: var(--text-primary) !important;
            border-radius: 6px;
            cursor: pointer;
          }
          .admin-profile-text {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;

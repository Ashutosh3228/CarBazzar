import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, setCurrentView, setSelectedCarId, onOpenAuth, onShowToast }) {
  const { user, logout, loginAs, isAuthenticated } = useAuth();

  const handleNav = (view) => {
    setSelectedCarId(null);
    setCurrentView(view);
  };

  const handleDemoSwitch = async (role) => {
    try {
      await loginAs(role);
      if (onShowToast) onShowToast(`Switched account to Demo ${role.toUpperCase()}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="logo" onClick={() => handleNav('browse')} style={{ cursor: 'pointer' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 8.2 16 6 16 6H8S5.3 8.2 3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2c0 1.7 1.3 3 3 3s3-1.3 3-3h6c0 1.7 1.3 3 3 3s3-1.3 3-3zM8 18.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm10 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
            </svg>
            <span>CarBazzar</span>
          </div>

          <nav className="nav-links">
            <button
              className={`nav-link ${currentView === 'browse' ? 'active' : ''}`}
              onClick={() => handleNav('browse')}
            >
              Browse Cars
            </button>

            {isAuthenticated && (
              <>
                <button
                  className={`nav-link ${currentView === 'sell' ? 'active' : ''}`}
                  onClick={() => handleNav('sell')}
                >
                  Sell Your Car
                </button>
                <button
                  className={`nav-link ${currentView === 'my-listings' ? 'active' : ''}`}
                  onClick={() => handleNav('my-listings')}
                >
                  Seller Dashboard
                </button>
                <button
                  className={`nav-link ${currentView === 'favorites' ? 'active' : ''}`}
                  onClick={() => handleNav('favorites')}
                >
                  Favorites
                </button>
                {user?.role === 'admin' && (
                  <button
                    className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                    onClick={() => handleNav('admin')}
                    style={{ color: '#b45309', fontWeight: '700' }}
                  >
                    Admin Approval
                  </button>
                )}
              </>
            )}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{user.name}</div>
                <span className={`badge ${user.role === 'admin' ? 'badge-pending' : 'badge-approved'}`} style={{ fontSize: '0.65rem' }}>
                  {user.role}
                </span>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => {
                  logout();
                  if (onShowToast) onShowToast('You have been logged out');
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => onOpenAuth ? onOpenAuth('login') : setCurrentView('login')}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => onOpenAuth ? onOpenAuth('register') : setCurrentView('register')}>
                Register
              </button>
            </div>
          )}

          {/* Quick Demo Switcher */}
          <div style={{ display: 'flex', gap: '0.3rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              onClick={() => handleDemoSwitch('seller')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: user?.email === 'seller@carbazaar.com' ? '#2563eb' : 'transparent', color: user?.email === 'seller@carbazaar.com' ? '#fff' : '#475569', fontWeight: '600' }}
              title="Switch to Demo Seller"
            >
              Seller
            </button>
            <button
              onClick={() => handleDemoSwitch('admin')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: user?.email === 'admin@carbazaar.com' ? '#2563eb' : 'transparent', color: user?.email === 'admin@carbazaar.com' ? '#fff' : '#475569', fontWeight: '600' }}
              title="Switch to Demo Admin"
            >
              Admin
            </button>
            <button
              onClick={() => handleDemoSwitch('buyer')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: user?.email === 'buyer@carbazaar.com' ? '#2563eb' : 'transparent', color: user?.email === 'buyer@carbazaar.com' ? '#fff' : '#475569', fontWeight: '600' }}
              title="Switch to Demo Buyer"
            >
              Buyer
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

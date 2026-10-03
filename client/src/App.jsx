import React, { useState } from 'react';
import {
  Bell,
  Loader2,
  Inbox,
  AlertOctagon,
  Code2,
  Car,
  ShieldCheck,
  Fuel,
  Gauge,
  MapPin,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Layers,
  Sliders,
  Heart
} from 'lucide-react';
import {
  Spinner,
  LoadingOverlay,
  Skeleton,
  CarCardSkeleton,
  Button,
  EmptyState,
  ErrorState,
  ErrorBoundary,
  useToast,
  ToastProvider
} from './components/common';

// Subcomponent to test ErrorBoundary crash isolation
const BuggyCrashComponent = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('Simulated CarBazaar Engine Fault: Component threw an intentional rendering exception.');
  }
  return (
    <div
      style={{
        padding: '24px',
        borderRadius: 'var(--cb-radius-md)',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid var(--cb-success-border)',
        color: 'var(--cb-text-primary)',
        textAlign: 'center'
      }}
    >
      <CheckCircle size={32} color="var(--cb-success)" style={{ margin: '0 auto 12px' }} />
      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Engine Running Smoothly</h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--cb-text-secondary)', marginTop: '4px' }}>
        This component is protected by an isolated <code>&lt;ErrorBoundary /&gt;</code>. Click the crash button below to simulate an unexpected UI failure and verify graceful recovery.
      </p>
    </div>
  );
};

// Main App Dashboard Content
const DashboardContent = () => {
  const { toast, toasts, position, setPosition, clearToasts } = useToast();
  const [activeTab, setActiveTab] = useState('toasts');

  // Loading states demo
  const [btnLoading, setBtnLoading] = useState(false);
  const [containerLoading, setContainerLoading] = useState(false);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [showLiveCars, setShowLiveCars] = useState(false);

  // Empty state demo
  const [emptyType, setEmptyType] = useState('no-cars');
  const [emptyCompact, setEmptyCompact] = useState(false);

  // Error state demo
  const [errorType, setErrorType] = useState('network');
  const [crashSimulated, setCrashSimulated] = useState(false);

  // Sample car data for skeleton-to-content transition demo
  const sampleCars = [
    {
      id: 1,
      title: '2023 BMW M3 Competition',
      year: 2023,
      price: '$78,900',
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: '12,400 km',
      location: 'Los Angeles, CA',
      badge: 'Verified Dealer',
      badgeColor: 'var(--cb-primary)',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 2,
      title: '2022 Porsche 911 Carrera S',
      year: 2022,
      price: '$124,500',
      fuel: 'Petrol',
      transmission: 'PDK Dual-Clutch',
      mileage: '8,200 km',
      location: 'Miami, FL',
      badge: 'Featured',
      badgeColor: 'var(--cb-cyan)',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 3,
      title: '2024 Audi RS6 Avant Quattro',
      year: 2024,
      price: '$118,000',
      fuel: 'Hybrid',
      transmission: 'Tiptronic',
      mileage: '4,100 km',
      location: 'Chicago, IL',
      badge: 'Certified',
      badgeColor: 'var(--cb-success)',
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=700&q=80'
    }
  ];

  // Helper to test Promise Toast
  const triggerPromiseToast = () => {
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve({ carName: 'Mercedes-AMG GT', id: 'CAR-9821' });
        } else {
          reject(new Error('Database network timeout while syncing car specifications.'));
        }
      }, 2200);
    });

    toast.promise(mockPromise, {
      loading: 'Syncing vehicle listing with CarBazaar MongoDB server...',
      success: (data) => `Vehicle listing #${data.id} published to marketplace!`,
      error: (err) => `Sync failed: ${err.message}`
    });
  };

  // Helper for full-screen loading
  const triggerFullScreenLoading = () => {
    setFullScreenLoading(true);
    setTimeout(() => {
      setFullScreenLoading(false);
      toast.success('Marketplace inventory synchronized successfully.');
    }, 2500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Full-screen Loading Overlay */}
      <LoadingOverlay
        show={fullScreenLoading}
        fullScreen
        message="Synchronizing CarBazaar Marketplace"
        subMessage="Fetching latest listings, brand updates, and seller inquiries..."
        spinnerSize="xl"
        spinnerVariant="cyan"
      />

      {/* Top Automotive Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(11, 15, 25, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--cb-border-subtle)',
          padding: '14px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {/* Brand Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--cb-radius-md)',
                background: 'linear-gradient(135deg, var(--cb-primary), var(--cb-cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px var(--cb-primary-glow)'
              }}
            >
              <Car size={24} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--cb-font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--cb-text-primary)'
                  }}
                >
                  Car<span style={{ color: 'var(--cb-cyan)' }}>Bazaar</span>
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--cb-font-mono)',
                    padding: '2px 8px',
                    borderRadius: 'var(--cb-radius-full)',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    color: 'var(--cb-primary)',
                    border: '1px solid var(--cb-border-highlight)',
                    fontWeight: 600
                  }}
                >
                  feature/pradnya-ui
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--cb-text-muted)', fontWeight: 500 }}>
                Buy. Sell. Drive. &bull; Issue #30 Global UI States
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--cb-radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--cb-border-subtle)',
                fontSize: '0.8125rem',
                color: 'var(--cb-text-secondary)'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--cb-success)',
                  boxShadow: '0 0 8px var(--cb-success)'
                }}
              />
              <span>Active Toasts: <strong style={{ color: 'var(--cb-text-primary)' }}>{toasts.length}</strong></span>
            </div>

            <Button
              size="sm"
              variant="outline"
              icon={<Zap size={14} />}
              onClick={triggerFullScreenLoading}
            >
              Sync Inventory
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Hero Section Banner */}
        <section
          style={{
            position: 'relative',
            padding: '36px 32px',
            borderRadius: 'var(--cb-radius-xl)',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid var(--cb-border-subtle)',
            boxShadow: 'var(--cb-shadow-lg)',
            marginBottom: '32px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--cb-primary-glow) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--cb-radius-full)',
                backgroundColor: 'rgba(6, 182, 212, 0.12)',
                color: 'var(--cb-cyan)',
                fontSize: '0.775rem',
                fontWeight: 600,
                marginBottom: '14px',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}
            >
              <Sparkles size={14} />
              <span>Phase 4 &bull; Global UI Design System</span>
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--cb-text-primary)',
                lineHeight: 1.2,
                marginBottom: '12px'
              }}
            >
              Global UI States & Feedback System
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--cb-text-secondary)', lineHeight: 1.6 }}>
              Production-ready UI feedback architecture for CarBazaar: Loading spinners, skeleton shimmers,
              contextual empty states, resilient error boundaries, and non-blocking toast notifications.
            </p>
          </div>

          {/* Module Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '28px',
              borderTop: '1px solid var(--cb-border-subtle)',
              paddingTop: '20px'
            }}
          >
            {[
              { id: 'toasts', label: 'Toast Notifications', icon: <Bell size={16} /> },
              { id: 'loading', label: 'Loading States & Skeletons', icon: <Loader2 size={16} /> },
              { id: 'empty', label: 'Empty States', icon: <Inbox size={16} /> },
              { id: 'error', label: 'Error States & Boundary', icon: <AlertOctagon size={16} /> },
              { id: 'code', label: 'Team Integration Guide', icon: <Code2 size={16} /> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: 'var(--cb-radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--cb-transition-fast)',
                    backgroundColor: isActive ? 'var(--cb-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#FFFFFF' : 'var(--cb-text-secondary)',
                    border: `1px solid ${isActive ? 'var(--cb-primary)' : 'var(--cb-border-subtle)'}`,
                    boxShadow: isActive ? '0 4px 12px var(--cb-primary-glow)' : 'none'
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            TAB 1: TOAST NOTIFICATIONS
            ========================================================================= */}
        {activeTab === 'toasts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Toast Configuration Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '18px 24px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders size={18} color="var(--cb-cyan)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--cb-text-primary)' }}>
                  Toast Viewport Position:
                </span>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cb-bg-input)',
                    color: 'var(--cb-text-primary)',
                    border: '1px solid var(--cb-border-medium)',
                    borderRadius: 'var(--cb-radius-sm)',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="top-right">Top Right (Default)</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={toasts.length === 0}
                  onClick={clearToasts}
                >
                  Clear All ({toasts.length})
                </Button>
              </div>
            </div>

            {/* Interactive Triggers Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}
            >
              {/* Success Toast */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: 'var(--cb-radius-lg)',
                  backgroundColor: 'var(--cb-bg-card)',
                  border: '1px solid var(--cb-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cb-success)'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Success Notification</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--cb-text-secondary)', flex: 1 }}>
                  Confirm successful listings, OTP validations, profile saves, and verified seller inquiries.
                </p>
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.success('Listing Published: 2023 BMW M3 Competition is now live on CarBazaar!', {
                      title: 'Listing Published'
                    })
                  }
                >
                  Trigger Success Toast
                </Button>
              </div>

              {/* Error Toast */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: 'var(--cb-radius-lg)',
                  backgroundColor: 'var(--cb-bg-card)',
                  border: '1px solid var(--cb-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cb-error)'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Error Notification</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--cb-text-secondary)', flex: 1 }}>
                  Alert users to invalid credentials, network disconnections, or failed photo uploads.
                </p>
                <Button
                  variant="danger"
                  onClick={() =>
                    toast.error('Image Upload Failed: File exceeds the maximum allowed 5MB limit.', {
                      title: 'Upload Failed'
                    })
                  }
                >
                  Trigger Error Toast
                </Button>
              </div>

              {/* Warning Toast */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: 'var(--cb-radius-lg)',
                  backgroundColor: 'var(--cb-bg-card)',
                  border: '1px solid var(--cb-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cb-warning)'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Warning Notification</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--cb-text-secondary)', flex: 1 }}>
                  Notify users about expiring OTP codes, incomplete seller documents, or session timeouts.
                </p>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.warning('Your verification code will expire in 60 seconds.', {
                      title: 'OTP Expiring Soon'
                    })
                  }
                >
                  Trigger Warning Toast
                </Button>
              </div>

              {/* Info Toast */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: 'var(--cb-radius-lg)',
                  backgroundColor: 'var(--cb-bg-card)',
                  border: '1px solid var(--cb-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cb-info)'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Information Notification</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--cb-text-secondary)', flex: 1 }}>
                  Deliver buyer messages, new inquiries received, or price drop alerts for saved cars.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.info('A verified buyer inquired about your 2022 Porsche 911 listing.', {
                      title: 'New Buyer Inquiry'
                    })
                  }
                >
                  Trigger Info Toast
                </Button>
              </div>

              {/* Promise / Async Toast */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: 'var(--cb-radius-lg)',
                  backgroundColor: 'var(--cb-bg-card)',
                  border: '1px solid var(--cb-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cb-cyan)'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Async Promise Toast</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--cb-text-secondary)', flex: 1 }}>
                  Automatically transitions from loading spinner to success or error based on API promise resolution.
                </p>
                <Button
                  variant="cyan"
                  onClick={triggerPromiseToast}
                >
                  Simulate API Promise
                </Button>
              </div>

              {/* Action Toast with Undo */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: 'var(--cb-radius-lg)',
                  backgroundColor: 'var(--cb-bg-card)',
                  border: '1px solid var(--cb-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cb-primary)'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Interactive Action Toast</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--cb-text-secondary)', flex: 1 }}>
                  Toasts with interactive callbacks (such as Undo delete, Retry network, or View listing).
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.info('Porsche 911 Carrera removed from your saved garage.', {
                      title: 'Listing Removed',
                      duration: 6000,
                      action: {
                        label: 'Undo Action',
                        onClick: () => {
                          toast.success('Vehicle restored to your saved garage!');
                        }
                      }
                    })
                  }
                >
                  Toast with "Undo" Action
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: LOADING STATES & SKELETONS
            ========================================================================= */}
        {activeTab === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section 1: Spinners & Buttons */}
            <div
              style={{
                padding: '28px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  Automotive Spinners & Loading Buttons
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cb-text-secondary)' }}>
                  Crisp SVG spinners with dual concentric rings and pulsing glow, styled for automotive dashboards.
                </p>
              </div>

              {/* Sizes Showcase */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '28px',
                  padding: '20px',
                  borderRadius: 'var(--cb-radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="xs" variant="primary" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>xs (14px)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="sm" variant="cyan" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>sm (18px)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="md" variant="primary" glow />
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>md (26px)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="lg" variant="success" glow />
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>lg (38px)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="xl" variant="cyan" glow />
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>xl (52px)</span>
                </div>
              </div>

              {/* Interactive Loading Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
                <Button
                  variant="primary"
                  isLoading={btnLoading}
                  loadingText="Submitting..."
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  Click to Test Loading Button
                </Button>

                <Button
                  variant="cyan"
                  isLoading={btnLoading}
                  loadingText="Saving Listing..."
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  Cyan Action Button
                </Button>

                <Button
                  variant="outline"
                  isLoading={btnLoading}
                  loadingText="Refreshing..."
                  icon={<RefreshCw size={16} />}
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  Refresh Feed
                </Button>
              </div>
            </div>

            {/* Section 2: Container Loading Overlay */}
            <div
              style={{
                position: 'relative',
                padding: '28px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Container Loading Overlay</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--cb-text-secondary)', marginTop: '4px' }}>
                    Blurs container content and shows a centered spinner without affecting outside navigation.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setContainerLoading(!containerLoading)}
                >
                  {containerLoading ? 'Stop Overlay' : 'Simulate Container Loading'}
                </Button>
              </div>

              {/* Sample Container Content */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  padding: '20px',
                  borderRadius: 'var(--cb-radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{ padding: '16px', borderRadius: 'var(--cb-radius-sm)', backgroundColor: 'var(--cb-bg-input)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>Total Listed Cars</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>1,482</h3>
                </div>
                <div style={{ padding: '16px', borderRadius: 'var(--cb-radius-sm)', backgroundColor: 'var(--cb-bg-input)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>Active Inquiries</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--cb-cyan)', marginTop: '4px' }}>349</h3>
                </div>
                <div style={{ padding: '16px', borderRadius: 'var(--cb-radius-sm)', backgroundColor: 'var(--cb-bg-input)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cb-text-muted)' }}>Average Sale Speed</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--cb-success)', marginTop: '4px' }}>4.8 Days</h3>
                </div>
              </div>

              {/* The Container Overlay */}
              <LoadingOverlay
                show={containerLoading}
                message="Updating Marketplace Metrics"
                subMessage="Fetching verified analytics from CarBazaar MongoDB server..."
                spinnerSize="lg"
                spinnerVariant="primary"
              />
            </div>

            {/* Section 3: Car Card Skeleton & Live Transition */}
            <div
              style={{
                padding: '28px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Car Listing Skeleton Shimmers
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--cb-text-secondary)', marginTop: '4px' }}>
                    Prevents cumulative layout shift (CLS) by mirroring exact car card dimensions while fetching.
                  </p>
                </div>

                <Button
                  variant="primary"
                  icon={<RefreshCw size={16} />}
                  onClick={() => setShowLiveCars(!showLiveCars)}
                >
                  {showLiveCars ? 'View Shimmer Skeletons' : 'Simulate API Response (View Cars)'}
                </Button>
              </div>

              {/* 3-Column Car Card Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px'
                }}
              >
                {!showLiveCars ? (
                  <>
                    <CarCardSkeleton />
                    <CarCardSkeleton />
                    <CarCardSkeleton />
                  </>
                ) : (
                  sampleCars.map((car) => (
                    <div
                      key={car.id}
                      style={{
                        backgroundColor: 'var(--cb-bg-card)',
                        borderRadius: 'var(--cb-radius-lg)',
                        border: '1px solid var(--cb-border-subtle)',
                        overflow: 'hidden',
                        boxShadow: 'var(--cb-shadow-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform var(--cb-transition-fast), box-shadow var(--cb-transition-fast)',
                        animation: 'cb-fade-in 300ms ease-out'
                      }}
                    >
                      {/* Car Image with Badge */}
                      <div style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden' }}>
                        <img
                          src={car.image}
                          alt={car.title}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            padding: '4px 10px',
                            borderRadius: 'var(--cb-radius-full)',
                            backgroundColor: 'rgba(11, 15, 25, 0.8)',
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${car.badgeColor}`,
                            color: car.badgeColor,
                            fontSize: '0.725rem',
                            fontWeight: 700
                          }}
                        >
                          {car.badge}
                        </span>

                        <button
                          type="button"
                          aria-label="Add to favorites"
                          onClick={() => toast.success(`Saved ${car.title} to your garage!`)}
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(11, 15, 25, 0.75)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid var(--cb-border-subtle)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Heart size={16} />
                        </button>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cb-text-primary)' }}>
                            {car.title}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--cb-text-muted)' }}>
                            Model Year {car.year} &bull; Verified Inspection
                          </span>
                        </div>

                        {/* Specs Grid */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '8px',
                            padding: '10px 12px',
                            borderRadius: 'var(--cb-radius-md)',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            fontSize: '0.775rem',
                            color: 'var(--cb-text-secondary)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Fuel size={14} color="var(--cb-cyan)" />
                            <span>{car.fuel}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Gauge size={14} color="var(--cb-primary)" />
                            <span>{car.transmission}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="var(--cb-warning)" />
                            <span>{car.mileage}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} color="var(--cb-success)" />
                            <span>{car.location}</span>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            paddingTop: '12px',
                            borderTop: '1px solid var(--cb-border-subtle)'
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.725rem', color: 'var(--cb-text-muted)', display: 'block' }}>
                              Cash Price
                            </span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cb-text-primary)' }}>
                              {car.price}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => toast.info(`Viewing specs for ${car.title}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: EMPTY STATES
            ========================================================================= */}
        {activeTab === 'empty' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Control Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '18px 24px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Preset Scenario:</span>
                {[
                  { id: 'no-cars', label: 'No Cars Found' },
                  { id: 'no-favorites', label: 'No Favorites' },
                  { id: 'no-listings', label: 'No Listings' },
                  { id: 'no-inquiries', label: 'No Inquiries' },
                  { id: 'no-notifications', label: 'No Alerts' },
                  { id: 'search-empty', label: 'Search Empty' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEmptyType(item.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--cb-radius-sm)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: emptyType === item.id ? 'var(--cb-primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: emptyType === item.id ? '#FFFFFF' : 'var(--cb-text-secondary)',
                      border: '1px solid var(--cb-border-subtle)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--cb-text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emptyCompact}
                    onChange={(e) => setEmptyCompact(e.target.checked)}
                    style={{ marginRight: '6px' }}
                  />
                  Compact Variant
                </label>
              </div>
            </div>

            {/* Live Rendered Empty State */}
            <div
              style={{
                padding: '40px 20px',
                borderRadius: 'var(--cb-radius-xl)',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--cb-border-subtle)'
              }}
            >
              <EmptyState
                type={emptyType}
                compact={emptyCompact}
                primaryAction={{
                  label: emptyType === 'no-listings' ? 'Post Car for Sale' : 'Execute Action',
                  onClick: () => toast.success(`Dispatched primary action for: ${emptyType}`)
                }}
                secondaryAction={{
                  label: 'Learn More',
                  onClick: () => toast.info('Opened CarBazaar marketplace guide.')
                }}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ERROR STATES & ERROR BOUNDARY
            ========================================================================= */}
        {activeTab === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Error Type Selector */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 24px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Error Classification:</span>
              {[
                { id: 'network', label: 'Network Offline' },
                { id: '404', label: '404 Not Found' },
                { id: '403', label: '403 Unauthorized' },
                { id: '500', label: '500 Server Error' },
                { id: 'generic', label: 'Generic Fault' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setErrorType(item.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--cb-radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: errorType === item.id ? 'var(--cb-error)' : 'rgba(255, 255, 255, 0.05)',
                    color: errorType === item.id ? '#FFFFFF' : 'var(--cb-text-secondary)',
                    border: '1px solid var(--cb-border-subtle)'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Live Error State Display */}
            <div
              style={{
                padding: '40px 20px',
                borderRadius: 'var(--cb-radius-xl)',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--cb-border-subtle)'
              }}
            >
              <ErrorState
                type={errorType}
                errorDetails={`CarBazaar API Gateway Response:\nGET /api/cars/m3-competition-2023\nStatus: ${errorType.toUpperCase()}\nTimestamp: ${new Date().toISOString()}\nTrace: connection reset by peer`}
                onRetry={() => toast.success('Re-established connection to CarBazaar backend!')}
                onHome={() => toast.info('Navigated back to marketplace catalog.')}
              />
            </div>

            {/* ErrorBoundary Live Isolation Test */}
            <div
              style={{
                padding: '28px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--cb-text-primary)' }}>
                  Live &lt;ErrorBoundary /&gt; Fault Isolation Test
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cb-text-secondary)', marginTop: '4px' }}>
                  Demonstrates how our React <code>ErrorBoundary</code> intercepts runtime JavaScript exceptions,
                  protecting the rest of the application and rendering an automotive recovery interface.
                </p>
              </div>

              {/* Error Boundary wrapping the crash simulator */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: 'var(--cb-radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px dashed var(--cb-border-medium)'
                }}
              >
                <ErrorBoundary
                  onReset={() => {
                    setCrashSimulated(false);
                    toast.success('ErrorBoundary successfully recovered the component!');
                  }}
                >
                  <BuggyCrashComponent shouldCrash={crashSimulated} />
                </ErrorBoundary>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="danger"
                  onClick={() => setCrashSimulated(true)}
                  disabled={crashSimulated}
                >
                  Simulate Runtime UI Crash
                </Button>

                {crashSimulated && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCrashSimulated(false);
                      toast.info('Component state reset.');
                    }}
                  >
                    Reset Manually
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: TEAM INTEGRATION GUIDE
            ========================================================================= */}
        {activeTab === 'code' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                padding: '28px',
                borderRadius: 'var(--cb-radius-lg)',
                backgroundColor: 'var(--cb-bg-card)',
                border: '1px solid var(--cb-border-subtle)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                Developer Quick Reference for CarBazaar Team Members
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--cb-text-secondary)', lineHeight: 1.6 }}>
                Every UI state component is exported from <code>client/src/components/common</code>.
                Ashutosh (Auth), Sakshi (Marketplace), Prashant (Admin), and Pradnya (UI) can drop them into any page with zero extra setup.
              </p>
            </div>

            {/* Code Examples Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {/* Example 1: Toasts */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: 'var(--cb-radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--cb-border-subtle)'
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cb-cyan)', marginBottom: '8px' }}>
                  1. Dispatching Toasts in Any Component
                </h4>
                <pre
                  style={{
                    fontFamily: 'var(--cb-font-mono)',
                    fontSize: '0.8rem',
                    color: '#E2E8F0',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    margin: 0
                  }}
                >
{`import { useToast } from '../components/common';

const MyComponent = () => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await api.saveCarListing(data);
      toast.success('Car listed successfully!');
    } catch (err) {
      toast.error('Failed to save listing: ' + err.message);
    }
  };
};`}
                </pre>
              </div>

              {/* Example 2: Empty States */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: 'var(--cb-radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--cb-border-subtle)'
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cb-primary)', marginBottom: '8px' }}>
                  2. Using Empty States in Listings & Wishlist
                </h4>
                <pre
                  style={{
                    fontFamily: 'var(--cb-font-mono)',
                    fontSize: '0.8rem',
                    color: '#E2E8F0',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    margin: 0
                  }}
                >
{`import { EmptyState } from '../components/common';

// Inside FavoritesPage.jsx:
if (favorites.length === 0) {
  return (
    <EmptyState
      type="no-favorites"
      primaryAction={{
        label: 'Browse Cars',
        onClick: () => navigate('/cars')
      }}
    />
  );
}`}
                </pre>
              </div>

              {/* Example 3: Skeletons */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: 'var(--cb-radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--cb-border-subtle)'
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cb-success)', marginBottom: '8px' }}>
                  3. CarCardSkeletons During API Fetch
                </h4>
                <pre
                  style={{
                    fontFamily: 'var(--cb-font-mono)',
                    fontSize: '0.8rem',
                    color: '#E2E8F0',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    margin: 0
                  }}
                >
{`import { CarCardSkeleton } from '../components/common';

if (isLoading) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <CarCardSkeleton />
      <CarCardSkeleton />
      <CarCardSkeleton />
    </div>
  );
}`}
                </pre>
              </div>

              {/* Example 4: Error State & Boundary */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: 'var(--cb-radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--cb-border-subtle)'
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cb-error)', marginBottom: '8px' }}>
                  4. Error Recovery & Boundary Guard
                </h4>
                <pre
                  style={{
                    fontFamily: 'var(--cb-font-mono)',
                    fontSize: '0.8rem',
                    color: '#E2E8F0',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    margin: 0
                  }}
                >
{`import { ErrorState, ErrorBoundary } from '../components/common';

if (error) {
  return (
    <ErrorState
      type="network"
      onRetry={fetchCars}
      onHome={() => navigate('/')}
    />
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--cb-border-subtle)',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: 'rgba(11, 15, 25, 0.8)'
        }}
      >
        <p style={{ fontSize: '0.8125rem', color: 'var(--cb-text-muted)' }}>
          CarBazaar Marketplace &bull; Buy. Sell. Drive. &bull; Feature Branch: <code>feature/pradnya-ui</code>
        </p>
      </footer>
    </div>
  );
};

// Root App with ToastProvider wrapper
export function App() {
  return (
    <ToastProvider defaultPosition="top-right">
      <DashboardContent />
    </ToastProvider>
  );
}

export default App;

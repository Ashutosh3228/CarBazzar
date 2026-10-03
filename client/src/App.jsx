import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import BrowseCars from './pages/BrowseCars';
import CarDetail from './pages/CarDetail';
import SellCar from './pages/SellCar';
import MyListings from './pages/MyListings';
import Favorites from './pages/Favorites';
import AdminApproval from './pages/AdminApproval';

export default function App() {
  const [currentView, setCurrentView] = useState('browse');
  const [selectedCarId, setSelectedCarId] = useState(null);

  // Global Auth Modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Toast Banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectCar = (carId) => {
    setSelectedCarId(carId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedCarId(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        setSelectedCarId={setSelectedCarId}
        onOpenAuth={handleOpenAuth}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)}>&times;</button>
        </div>
      )}

      {/* Main Content Router */}
      <main style={{ flex: '1 0 auto' }}>
        {selectedCarId ? (
          <CarDetail
            carId={selectedCarId}
            onBack={() => setSelectedCarId(null)}
            onRequireAuth={() => handleOpenAuth('login')}
            onShowToast={showToast}
          />
        ) : currentView === 'browse' ? (
          <BrowseCars
            onSelectCar={handleSelectCar}
            onRequireAuth={() => handleOpenAuth('login')}
            onShowToast={showToast}
          />
        ) : currentView === 'sell' ? (
          <SellCar
            onListingCreated={(msg) => {
              showToast(msg);
              setCurrentView('my-listings');
            }}
            onRequireAuth={() => handleOpenAuth('login')}
          />
        ) : currentView === 'my-listings' ? (
          <MyListings
            onNavigateSell={() => setCurrentView('sell')}
            onSelectCar={handleSelectCar}
            onShowToast={showToast}
          />
        ) : currentView === 'favorites' ? (
          <Favorites
            onSelectCar={handleSelectCar}
            onNavigateBrowse={() => setCurrentView('browse')}
            onShowToast={showToast}
            onRequireAuth={() => handleOpenAuth('login')}
          />
        ) : currentView === 'admin' ? (
          <AdminApproval
            onSelectCar={handleSelectCar}
            onShowToast={showToast}
          />
        ) : (
          <BrowseCars onSelectCar={handleSelectCar} />
        )}
      </main>

      <Footer />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={showToast}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export default function Favorites({ onSelectCar, onNavigateBrowse, onShowToast, onRequireAuth }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  const handleRemoveFavorite = async (carId) => {
    try {
      await api.delete(`/favorites/${carId}`);
      setFavorites((prev) => prev.filter((f) => (f.car?._id || f.car) !== carId));
      if (onShowToast) onShowToast('Car removed from favorites');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove favorite');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <EmptyState
          title="Sign in to view your Saved Cars"
          message="Keep track of cars you're considering, compare pricing, and contact sellers anytime."
          actionText="Sign In"
          onAction={onRequireAuth}
        />
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading your saved cars..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
          Your Saved Favorite Cars
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          You have saved <strong>{favorites.length}</strong> vehicle{favorites.length === 1 ? '' : 's'} to review or contact
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="Your Favorites List is Empty"
          message="Browse verified cars on the marketplace and tap the heart icon on any car to save it here for later."
          actionText="Browse Marketplace"
          onAction={onNavigateBrowse}
        />
      ) : (
        <div className="car-grid">
          {favorites.map((fav) => {
            const car = fav.car;
            if (!car) return null;
            return (
              <CarCard
                key={fav._id}
                car={car}
                onSelect={onSelectCar}
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorite}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export default function BrowseCars({ onSelectCar, onRequireAuth, onShowToast }) {
  const { isAuthenticated } = useAuth();
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands');
        if (res.data.success) {
          setBrands(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load brands', err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch Favorites if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/favorites')
        .then((res) => {
          if (res.data.success) {
            const favIds = new Set(res.data.data.map((f) => f.car?._id || f.car));
            setFavorites(favIds);
          }
        })
        .catch((err) => console.error('Failed to load favorites', err));
    } else {
      setFavorites(new Set());
    }
  }, [isAuthenticated]);

  // Fetch Cars
  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (fuelType) params.append('fuelType', fuelType);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 12);

      const res = await api.get(`/cars?${params.toString()}`);
      if (res.data.success) {
        setCars(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch cars', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [selectedBrand, fuelType, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCars();
  };

  const handleToggleFavorite = async (carId) => {
    if (!isAuthenticated) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        alert('Please login to add cars to your favorites');
      }
      return;
    }

    try {
      if (favorites.has(carId)) {
        await api.delete(`/favorites/${carId}`);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(carId);
          return next;
        });
        if (onShowToast) onShowToast('Removed from favorites');
      } else {
        await api.post(`/favorites/${carId}`);
        setFavorites((prev) => new Set(prev).add(carId));
        if (onShowToast) onShowToast('Added to favorites!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update favorite');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setFuelType('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Hero Section & Search Bar */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
          Find Your Next Verified Dream Car
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Browse certified listings verified by experts. Transparent pricing and direct contact with sellers.
        </p>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', maxWidth: '650px', margin: '0 auto', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search by brand, model, or city (e.g. Nexon, Creta, Mumbai)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: '8px', padding: '0.85rem 1.25rem', fontSize: '1rem', border: '2px solid #e2e8f0' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '8px' }}>
            Search
          </button>
        </form>
      </div>

      {/* Brand Filter Pills */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Filter by Popular Brands
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setSelectedBrand(''); setPage(1); }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: selectedBrand === '' ? '#2563eb' : '#fff',
              color: selectedBrand === '' ? '#fff' : '#475569',
              border: '1px solid #e2e8f0',
            }}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b._id}
              onClick={() => { setSelectedBrand(b.name); setPage(1); }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: selectedBrand === b.name ? '#2563eb' : '#fff',
                color: selectedBrand === b.name ? '#fff' : '#475569',
                border: '1px solid #e2e8f0',
              }}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#fff', padding: '1rem 1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Fuel:</span>
            <select
              value={fuelType}
              onChange={(e) => { setFuelType(e.target.value); setPage(1); }}
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
            >
              <option value="">All Fuels</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Showing <strong>{cars.length}</strong> of <strong>{pagination.total}</strong> verified listings
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <LoadingSpinner message="Searching marketplace for approved cars..." />
      ) : cars.length === 0 ? (
        <EmptyState
          title="No Approved Cars Match Your Criteria"
          message="We couldn't find any approved cars matching your active search or brand filter. Try clearing filters to see all available cars."
          actionText="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          <div className="car-grid">
            {cars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onSelect={onSelectCar}
                isFavorite={favorites.has(car._id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', padding: '0 0.75rem' }}>
                Page {page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

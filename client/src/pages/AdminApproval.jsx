import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export default function AdminApproval({ onSelectCar, onShowToast }) {
  const { user, isAdmin } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? '' : `?approvalStatus=${filter}`;
      const res = await api.get(`/admin/cars${params}`);
      if (res.data.success) {
        setCars(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin cars', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCars();
    }
  }, [filter, isAdmin]);

  const handleApprove = async (carId) => {
    setActionLoading(carId);
    try {
      const res = await api.patch(`/admin/cars/${carId}/approve`);
      if (res.data.success) {
        if (onShowToast) onShowToast('Vehicle approved and published to marketplace!');
        fetchCars();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve listing');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (carId) => {
    setActionLoading(carId);
    try {
      const res = await api.patch(`/admin/cars/${carId}/reject`);
      if (res.data.success) {
        if (onShowToast) onShowToast('Listing rejected');
        fetchCars();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject listing');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <EmptyState
          title="Access Denied: Administrator Only"
          message="You must be signed in with an administrator account to access the CarBazzar verification and approval portal."
        />
      </div>
    );
  }

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.3rem' }}>
          Listing Review & Quality Verification
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Evaluate seller submissions against quality standards before publishing them to the public marketplace.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '700',
            background: filter === 'pending' ? '#f59e0b' : '#fff',
            color: filter === 'pending' ? '#fff' : '#64748b',
            border: '1px solid #e2e8f0',
          }}
        >
          ⏳ Pending Review
        </button>

        <button
          onClick={() => setFilter('approved')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '700',
            background: filter === 'approved' ? '#10b981' : '#fff',
            color: filter === 'approved' ? '#fff' : '#64748b',
            border: '1px solid #e2e8f0',
          }}
        >
          ✓ Approved & Live
        </button>

        <button
          onClick={() => setFilter('rejected')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '700',
            background: filter === 'rejected' ? '#ef4444' : '#fff',
            color: filter === 'rejected' ? '#fff' : '#64748b',
            border: '1px solid #e2e8f0',
          }}
        >
          ✕ Rejected
        </button>

        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '700',
            background: filter === 'all' ? '#0f172a' : '#fff',
            color: filter === 'all' ? '#fff' : '#64748b',
            border: '1px solid #e2e8f0',
          }}
        >
          All Listings
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving listings for review..." />
      ) : cars.length === 0 ? (
        <EmptyState
          title={`No ${filter === 'all' ? '' : filter} listings`}
          message={`There are no vehicle listings matching the "${filter}" filter right now.`}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cars.map((car) => (
            <div
              key={car._id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Car Info */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img
                  src={car.images && car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200'}
                  alt={car.title}
                  style={{ width: '130px', height: '90px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => onSelectCar(car._id)}
                />
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', alignItems: 'center' }}>
                    <span className={`badge ${car.approvalStatus === 'approved' ? 'badge-approved' : car.approvalStatus === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                      {car.approvalStatus.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Owner: <strong>{car.owner?.name || 'Seller'}</strong> ({car.owner?.email})
                    </span>
                  </div>

                  <h3
                    style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', cursor: 'pointer', marginBottom: '0.25rem' }}
                    onClick={() => onSelectCar(car._id)}
                  >
                    {car.title}
                  </h3>

                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2563eb', marginBottom: '0.35rem' }}>
                    {formatPrice(car.price)}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {car.year} &bull; {car.fuelType} &bull; {car.transmission} &bull; {car.kilometers?.toLocaleString()} km &bull; 📍 {car.location}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => onSelectCar(car._id)}
                >
                  Inspect Listing
                </button>

                {car.approvalStatus !== 'approved' && (
                  <button
                    className="btn btn-success"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => handleApprove(car._id)}
                    disabled={actionLoading === car._id}
                  >
                    {actionLoading === car._id ? 'Updating...' : '✓ Approve & Publish'}
                  </button>
                )}

                {car.approvalStatus !== 'rejected' && (
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => handleReject(car._id)}
                    disabled={actionLoading === car._id}
                  >
                    {actionLoading === car._id ? 'Updating...' : '✕ Reject'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import InquiryModal from '../components/InquiryModal';
import EditCarModal from '../components/EditCarModal';
import { useAuth } from '../context/AuthContext';

export default function CarDetail({ carId, onBack, onRequireAuth, onShowToast }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchCar = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/cars/${carId}`);
      if (res.data.success) {
        setCar(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carId) {
      fetchCar();
    }
  }, [carId]);

  // Check favorite status
  useEffect(() => {
    if (isAuthenticated && carId) {
      api.get('/favorites')
        .then((res) => {
          if (res.data.success) {
            const hasFav = res.data.data.some((f) => (f.car?._id || f.car) === carId);
            setIsFavorite(hasFav);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, carId]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${car._id}`);
        setIsFavorite(false);
        if (onShowToast) onShowToast('Removed from favorites');
      } else {
        await api.post(`/favorites/${car._id}`);
        setIsFavorite(true);
        if (onShowToast) onShowToast('Added to favorites!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating favorites');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.patch(`/cars/${car._id}/status`, { status: newStatus });
      if (res.data.success) {
        setCar((prev) => ({ ...prev, status: newStatus }));
        if (onShowToast) onShowToast(`Car status updated to "${newStatus}"`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change status');
    }
  };

  const handleAdminApprove = async () => {
    try {
      const res = await api.patch(`/admin/cars/${car._id}/approve`);
      if (res.data.success) {
        setCar((prev) => ({ ...prev, approvalStatus: 'approved', status: 'available' }));
        if (onShowToast) onShowToast('Car approved & published to marketplace!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve car');
    }
  };

  const handleAdminReject = async () => {
    try {
      const res = await api.patch(`/admin/cars/${car._id}/reject`);
      if (res.data.success) {
        setCar((prev) => ({ ...prev, approvalStatus: 'rejected' }));
        if (onShowToast) onShowToast('Car listing rejected');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject car');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving certified vehicle information..." />;
  }

  if (error || !car) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
          &larr; Back to Marketplace
        </button>
        <EmptyState
          title="Vehicle Listing Not Found"
          message={error || 'This listing may have been removed or is pending approval.'}
          actionText="Browse Available Cars"
          onAction={onBack}
        />
      </div>
    );
  }

  const isOwner = user && car.owner && car.owner._id === user._id;
  const images = car.images && car.images.length > 0 ? car.images : [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60'
  ];

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.45rem 0.9rem' }}>
          &larr; Back to Marketplace
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className={`badge ${car.approvalStatus === 'approved' ? 'badge-approved' : car.approvalStatus === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
            Approval: {car.approvalStatus}
          </span>
          <span className={`badge ${car.status === 'available' ? 'badge-available' : 'badge-sold'}`}>
            Status: {car.status}
          </span>
        </div>
      </div>

      {/* Admin Quick Action Banner */}
      {isAdmin && (
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: '800', color: '#92400e', fontSize: '0.95rem' }}>
              🛡️ Administrator Review Controls
            </div>
            <div style={{ fontSize: '0.85rem', color: '#78350f' }}>
              Current state: <strong>{car.approvalStatus}</strong> &bull; Owner: {car.owner?.name} ({car.owner?.email})
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {car.approvalStatus !== 'approved' && (
              <button className="btn btn-success" onClick={handleAdminApprove}>
                ✓ Approve & Publish
              </button>
            )}
            {car.approvalStatus !== 'rejected' && (
              <button className="btn btn-danger" onClick={handleAdminReject}>
                &times; Reject Listing
              </button>
            )}
          </div>
        </div>
      )}

      {/* Owner Quick Controls Banner */}
      {isOwner && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: '800', color: '#1e40af', fontSize: '0.95rem' }}>
              🚘 You are the Owner of this Listing
            </div>
            <div style={{ fontSize: '0.85rem', color: '#3b82f6' }}>
              Manage your price, details, or mark as sold when you close a deal.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(true)}>
              ✏️ Edit Listing
            </button>
            {car.status === 'available' ? (
              <button className="btn btn-secondary" onClick={() => handleStatusChange('sold')}>
                🏷️ Mark as Sold
              </button>
            ) : (
              <button className="btn btn-success" onClick={() => handleStatusChange('available')}>
                🔄 Mark as Available
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Gallery & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Image Gallery & Description */}
        <div>
          {/* Main Hero Image */}
          <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', background: '#0f172a', boxShadow: 'var(--shadow)' }}>
            <img
              src={images[selectedImage]}
              alt={car.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
              {car.condition || 'Certified Pre-Owned'}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '90px',
                    height: '65px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid #2563eb' : '1px solid #e2e8f0',
                    opacity: selectedImage === idx ? 1 : 0.7,
                  }}
                />
              ))}
            </div>
          )}

          {/* Overview & Description */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', marginTop: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
              Vehicle Overview & Features
            </h3>
            <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: '1.7', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
              {car.description || 'No detailed description provided by the seller.'}
            </p>

            {/* CarBazzar Certified Trust Highlights */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                🛡️ CarBazzar Assurance Checklist
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', fontSize: '0.85rem', color: '#334155' }}>
                <div>✓ 140-Point Expert Quality Check</div>
                <div>✓ Clean Title & Verified RC</div>
                <div>✓ Non-Accidental Certification</div>
                <div>✓ Direct Transparency with Seller</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Specs Grid, Seller Card, CTA */}
        <div>
          {/* Main Price & Title Box */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>
                {car.brand?.name || 'Verified Brand'}
              </span>
              <button
                className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                style={{ position: 'static', width: '38px', height: '38px' }}
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                ♥
              </button>
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem', lineHeight: '1.3' }}>
              {car.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#2563eb' }}>
                {formatPrice(car.price)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Excluding RTO transfer
              </span>
            </div>

            {/* Quick Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Registration Year</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{car.year}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Kilometers</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{car.kilometers?.toLocaleString()} km</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Fuel Type</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{car.fuelType}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Transmission</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{car.transmission}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Exterior Color</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{car.color || 'Not Specified'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>City Location</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{car.location}</span>
              </div>
            </div>

            {/* Action Buttons for Buyer */}
            {isOwner ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                  onClick={() => setShowEditModal(true)}
                >
                  ✏️ Edit This Vehicle Listing
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', fontWeight: '700' }}
                  onClick={() => setShowInquiryModal(true)}
                  disabled={car.status === 'sold'}
                >
                  {car.status === 'sold' ? 'Vehicle Marked as Sold' : '💬 Contact Seller & Inquire'}
                </button>

                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? '♥ Saved in Your Favorites' : '♡ Add to Saved Favorites'}
                </button>
              </div>
            )}
          </div>

          {/* Seller Profile Card */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Listed By Verified Seller
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800' }}>
                {car.owner?.name ? car.owner.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>
                  {car.owner?.name || 'CarBazzar Verified Seller'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {car.owner?.email ? car.owner.email : 'Member since 2024'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600', marginTop: '0.2rem' }}>
                  ✓ ID Verified Seller
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Inquiry Modal for Buyers */}
      <InquiryModal
        car={car}
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        onSuccess={(msg) => {
          if (onShowToast) onShowToast(msg);
        }}
        onRequireAuth={onRequireAuth}
      />

      {/* Edit Modal for Owner */}
      <EditCarModal
        car={car}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={(msg) => {
          if (onShowToast) onShowToast(msg);
          fetchCar();
        }}
      />
    </div>
  );
}

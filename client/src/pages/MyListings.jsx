import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import EditCarModal from '../components/EditCarModal';
import { useAuth } from '../context/AuthContext';

export default function MyListings({ onNavigateSell, onSelectCar, onShowToast }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cars'); // 'cars' or 'inquiries'
  const [cars, setCars] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingCar, setEditingCar] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carsRes, inqRes] = await Promise.allSettled([
        api.get('/cars/my-listings'),
        api.get('/inquiries/received'),
      ]);

      if (carsRes.status === 'fulfilled' && carsRes.value.data.success) {
        setCars(carsRes.value.data.data);
      }
      if (inqRes.status === 'fulfilled' && inqRes.value.data.success) {
        setInquiries(inqRes.value.data.data);
      }
    } catch (err) {
      console.error('Failed to load seller dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleSold = async (carId, currentStatus) => {
    const nextStatus = currentStatus === 'sold' ? 'available' : 'sold';
    try {
      const res = await api.patch(`/cars/${carId}/status`, { status: nextStatus });
      if (res.data.success) {
        setCars((prev) =>
          prev.map((c) => (c._id === carId ? { ...c, status: nextStatus } : c))
        );
        if (onShowToast) onShowToast(`Car marked as ${nextStatus}!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update vehicle status');
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) {
      return;
    }
    try {
      const res = await api.delete(`/cars/${carId}`);
      if (res.data.success) {
        setCars((prev) => prev.filter((c) => c._id !== carId));
        if (onShowToast) onShowToast('Listing deleted successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, status) => {
    try {
      const res = await api.patch(`/inquiries/${inquiryId}`, { status });
      if (res.data.success) {
        setInquiries((prev) =>
          prev.map((inq) => (inq._id === inquiryId ? { ...inq, status } : inq))
        );
        if (onShowToast) onShowToast(`Inquiry marked as ${status}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update inquiry status');
    }
  };

  // Stats calculation
  const approvedCount = cars.filter((c) => c.approvalStatus === 'approved').length;
  const pendingCount = cars.filter((c) => c.approvalStatus === 'pending').length;
  const soldCount = cars.filter((c) => c.status === 'sold').length;

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading seller dashboard & inquiries..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Dashboard Header & Quick Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
            Seller Management Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Welcome, <strong>{user?.name || 'Seller'}</strong> &bull; Manage your vehicle portfolio and buyer inquiries
          </p>
        </div>
        <button className="btn btn-primary" onClick={onNavigateSell} style={{ padding: '0.75rem 1.5rem', fontWeight: '700' }}>
          + List Another Car
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Listings</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginTop: '0.25rem' }}>{cars.length}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: '600', textTransform: 'uppercase' }}>Approved & Live</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#10b981', marginTop: '0.25rem' }}>{approvedCount}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: '600', textTransform: 'uppercase' }}>Pending Review</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.25rem' }}>{pendingCount}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>Marked as Sold</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#475569', marginTop: '0.25rem' }}>{soldCount}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '600', textTransform: 'uppercase' }}>Buyer Inquiries</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#2563eb', marginTop: '0.25rem' }}>{inquiries.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('cars')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: activeTab === 'cars' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'cars' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px',
          }}
        >
          🚘 My Listed Vehicles ({cars.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: activeTab === 'inquiries' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'inquiries' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px',
          }}
        >
          💬 Buyer Inquiries Received ({inquiries.length})
        </button>
      </div>

      {/* TAB 1: VEHICLE LIST */}
      {activeTab === 'cars' && (
        <>
          {cars.length === 0 ? (
            <EmptyState
              title="You Haven't Listed Any Cars Yet"
              message="Start selling today on CarBazzar! Add your car details and get connected with verified prospective buyers."
              actionText="List Your First Car"
              onAction={onNavigateSell}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cars.map((car) => (
                <div
                  key={car._id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {/* Left: Thumbnail & Details */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <img
                      src={car.images && car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200'}
                      alt={car.title}
                      style={{ width: '130px', height: '90px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => onSelectCar(car._id)}
                    />
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${car.approvalStatus === 'approved' ? 'badge-approved' : car.approvalStatus === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                          {car.approvalStatus === 'approved' ? '✓ Approved' : car.approvalStatus === 'pending' ? '⏳ Pending Review' : '✕ Rejected'}
                        </span>
                        <span className={`badge ${car.status === 'available' ? 'badge-available' : 'badge-sold'}`}>
                          {car.status === 'available' ? 'Available' : 'Sold'}
                        </span>
                      </div>

                      <h3
                        style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', cursor: 'pointer', marginBottom: '0.25rem' }}
                        onClick={() => onSelectCar(car._id)}
                      >
                        {car.title}
                      </h3>

                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2563eb', marginBottom: '0.35rem' }}>
                        {formatPrice(car.price)}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {car.year} &bull; {car.fuelType} &bull; {car.transmission} &bull; {car.kilometers?.toLocaleString()} km &bull; 📍 {car.location}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
                      onClick={() => onSelectCar(car._id)}
                    >
                      View Details
                    </button>

                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
                      onClick={() => setEditingCar(car)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className={car.status === 'sold' ? 'btn btn-success' : 'btn btn-secondary'}
                      style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
                      onClick={() => handleToggleSold(car._id, car.status)}
                    >
                      {car.status === 'sold' ? 'Mark Available' : '🏷️ Mark as Sold'}
                    </button>

                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
                      onClick={() => handleDelete(car._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: INQUIRIES LIST */}
      {activeTab === 'inquiries' && (
        <>
          {inquiries.length === 0 ? (
            <EmptyState
              title="No Inquiries Received Yet"
              message="When buyers express interest in your approved vehicle listings, their questions and contact requests will appear here."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Inquiry Received on: <strong>{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </div>
                      <h4
                        style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem', cursor: 'pointer' }}
                        onClick={() => inq.car && onSelectCar(inq.car._id || inq.car)}
                      >
                        Car: {inq.car?.title || 'Vehicle Listing'}
                      </h4>
                    </div>

                    <span className={`badge ${inq.status === 'responded' ? 'badge-approved' : inq.status === 'pending' ? 'badge-pending' : 'badge-sold'}`}>
                      Inquiry Status: {inq.status}
                    </span>
                  </div>

                  {/* Buyer Contact Box */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Buyer Name</span>
                      <strong>{inq.buyer?.name || 'Prospective Buyer'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Buyer Email</span>
                      <a href={`mailto:${inq.buyer?.email}`} style={{ color: '#2563eb', fontWeight: '600' }}>
                        {inq.buyer?.email || 'N/A'}
                      </a>
                    </div>
                    {inq.buyer?.mobile && (
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Phone</span>
                        <strong>{inq.buyer.mobile}</strong>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Buyer's Inquiry Message:
                    </div>
                    <p style={{ color: '#334155', fontSize: '0.95rem', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                      {inq.message}
                    </p>
                  </div>

                  {/* Response Action Controls */}
                  <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                    {inq.status !== 'responded' && (
                      <button
                        className="btn btn-success"
                        style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
                        onClick={() => handleUpdateInquiryStatus(inq._id, 'responded')}
                      >
                        ✓ Mark as Responded
                      </button>
                    )}
                    {inq.status !== 'closed' && (
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
                        onClick={() => handleUpdateInquiryStatus(inq._id, 'closed')}
                      >
                        Close Inquiry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editingCar && (
        <EditCarModal
          car={editingCar}
          isOpen={!!editingCar}
          onClose={() => setEditingCar(null)}
          onSuccess={(msg) => {
            if (onShowToast) onShowToast(msg);
            setEditingCar(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

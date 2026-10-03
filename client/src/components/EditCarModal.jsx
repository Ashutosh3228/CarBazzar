import React, { useState } from 'react';
import api from '../services/api';

export default function EditCarModal({ car, isOpen, onClose, onSuccess }) {
  if (!isOpen || !car) return null;

  const [title, setTitle] = useState(car.title || '');
  const [price, setPrice] = useState(car.price || '');
  const [kilometers, setKilometers] = useState(car.kilometers || '');
  const [fuelType, setFuelType] = useState(car.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState(car.transmission || 'Manual');
  const [condition, setCondition] = useState(car.condition || 'Used');
  const [color, setColor] = useState(car.color || '');
  const [location, setLocation] = useState(car.location || '');
  const [description, setDescription] = useState(car.description || '');
  const [imageUrl, setImageUrl] = useState(car.images && car.images[0] ? car.images[0] : '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.put(`/cars/${car._id}`, {
        title,
        price: Number(price),
        kilometers: Number(kilometers),
        fuelType,
        transmission,
        condition,
        color,
        location,
        description,
        images: imageUrl ? [imageUrl] : car.images,
      });

      if (res.data.success) {
        if (onSuccess) onSuccess('Listing updated successfully!');
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Edit Car Listing</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {car.approvalStatus === 'rejected' ? 'Updating a rejected car will resubmit it for admin review' : 'Modify vehicle details and pricing'}
            </span>
          </div>
          <button onClick={onClose} style={{ fontSize: '1.5rem', lineHeight: '1', color: '#94a3b8' }}>
            &times;
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
              Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="10000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Kilometers Driven *
              </label>
              <input
                type="number"
                required
                min="0"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Fuel Type
              </label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Transmission
              </label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Color
              </label>
              <input
                type="text"
                placeholder="e.g. Polar White"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Location (City, State) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pune, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
              Cover Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight special features, accessories, service records..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

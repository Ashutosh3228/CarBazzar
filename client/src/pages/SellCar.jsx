import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PRESET_CAR_IMAGES = [
  { label: 'Compact SUV (Grey)', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60' },
  { label: 'Mid-size SUV (White)', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60' },
  { label: 'Executive Sedan (Blue)', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60' },
  { label: 'Off-Road SUV (Black)', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=60' },
  { label: 'Premium Electric (Red)', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60' },
];

export default function SellCar({ onListingCreated, onRequireAuth }) {
  const { isAuthenticated } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // Form states
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [kilometers, setKilometers] = useState('');
  const [condition, setCondition] = useState('Used');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_CAR_IMAGES[0].url);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands');
        if (res.data.success && res.data.data.length > 0) {
          setBrands(res.data.data);
          setBrand(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load brands', err);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  const formatPricePreview = (val) => {
    const num = Number(val);
    if (!num || isNaN(num)) return '';
    if (num >= 100000) {
      return `≈ ₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `≈ ₹${num.toLocaleString('en-IN')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (!brand || !model || !year || !price || !kilometers || !location) {
      setError('Please fill in all mandatory fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const selectedBrandObj = brands.find((b) => b._id === brand);
      const brandName = selectedBrandObj ? selectedBrandObj.name : 'Car';
      const autoTitle = `${year} ${brandName} ${model} ${variant}`.trim();

      const payload = {
        title: autoTitle,
        brand,
        model,
        variant,
        year: Number(year),
        price: Number(price),
        fuelType,
        transmission,
        kilometers: Number(kilometers),
        condition,
        color: color.trim() || 'Standard',
        location: location.trim(),
        description: description.trim() || `Verified ${autoTitle} in top mechanical condition. Clean records and well maintained.`,
        images: [imageUrl || PRESET_CAR_IMAGES[0].url],
      };

      const res = await api.post('/cars', payload);

      if (res.data.success) {
        if (onListingCreated) {
          onListingCreated('Listing submitted successfully! It is now pending admin review before appearing publicly.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit car listing. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBrands) {
    return <LoadingSpinner message="Preparing seller form..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          Sell Your Car on CarBazzar
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto' }}>
          List your vehicle to thousands of verified buyers across India. Transparent, safe, and zero hidden platform charges.
        </p>
      </div>

      {/* Trust Notice Banner */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '1.75rem' }}>🛡️</div>
        <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
          <strong>Admin Quality Review:</strong> In line with marketplace safety guidelines, newly created listings are set to <em>Pending Approval</em> and reviewed by our verification team before publication.
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Section 1: Basic Vehicle Details */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            1. Vehicle Identity & Brand
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Manufacturer / Brand *
              </label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Car Model *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nexon, Creta, City, Harrier"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Variant / Trim
              </label>
              <input
                type="text"
                placeholder="e.g. Fearless Plus, SX(O), ZX"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Registration / Model Year *
              </label>
              <input
                type="number"
                required
                min="1995"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Specifications */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            2. Specifications & Condition
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Fuel Type *
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Transmission *
              </label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Kilometers Driven *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 24000"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Vehicle Condition
              </label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="Used">Used / Certified Pre-Owned</option>
                <option value="New">Brand New / Showroom Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Location */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            3. Pricing & Location
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Expected Price (₹ INR) * {price && <span style={{ color: '#2563eb', fontWeight: '700', marginLeft: '0.5rem' }}>{formatPricePreview(price)}</span>}
              </label>
              <input
                type="number"
                required
                min="10000"
                placeholder="e.g. 1150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Exterior Color
              </label>
              <input
                type="text"
                placeholder="e.g. Daytona Grey, Polar White"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                City & State Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mumbai, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Vehicle Photograph */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            4. Photographs & Gallery
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Select one of our preset high-resolution automobile images, or enter your own custom image URL.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {PRESET_CAR_IMAGES.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => setImageUrl(preset.url)}
                style={{
                  border: imageUrl === preset.url ? '3px solid #2563eb' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  background: '#f8fafc',
                }}
              >
                <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                <div style={{ padding: '0.3rem', fontSize: '0.7rem', fontWeight: '600', textAlign: 'center', color: '#334155' }}>
                  {preset.label}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
              Selected Photo URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Section 5: Description */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            5. Seller Description & Maintenance History
          </h3>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe maintenance history, insurance validity, notable features, tyres condition, reason for selling..."
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', fontWeight: '700' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting for Review...' : '🚀 Submit Listing for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}

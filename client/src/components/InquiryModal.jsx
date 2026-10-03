import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InquiryModal({
  car,
  isOpen,
  onClose,
  onSuccess,
  onRequireAuth,
}) {
  const { user, isAuthenticated } = useAuth();

  const [message, setMessage] = useState(
    car
      ? `Hi ${
          car.owner?.name || 'Seller'
        }, I am interested in your ${car.year} ${car.title}. Is it available for inspection and test drive?`
      : ''
  );

  const [offerPrice, setOfferPrice] = useState('');
  const [phone, setPhone] = useState(user?.mobile || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !car) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message for the seller');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let finalMessage = message.trim();

      if (offerPrice) {
        finalMessage += `\n[Proposed Offer: ₹${Number(
          offerPrice
        ).toLocaleString('en-IN')}]`;
      }

      if (phone) {
        finalMessage += `\n[Buyer Contact: ${phone}]`;
      }

      const res = await api.post('/inquiries', {
        carId: car._id,
        message: finalMessage,
      });

      if (res.data.success) {
        if (onSuccess) {
          onSuccess(
            'Your inquiry was sent to the seller successfully!'
          );
        }

        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to submit inquiry. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: '#0f172a',
              }}
            >
              Contact Seller
            </h3>

            <span
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
              }}
            >
              Direct inquiry to vehicle owner
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: '1.5rem',
              lineHeight: '1',
              color: '#94a3b8',
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Car Summary */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            background: '#f8fafc',
            padding: '0.85rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.25rem',
          }}
        >
          <img
            src={
              car.images && car.images[0]
                ? car.images[0]
                : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200'
            }
            alt={car.title}
            style={{
              width: '80px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '6px',
            }}
          />

          <div>
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#0f172a',
              }}
            >
              {car.title}
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#2563eb',
              }}
            >
              ₹
              {car.price >= 100000
                ? `${(car.price / 100000).toFixed(2)} Lakh`
                : car.price?.toLocaleString('en-IN')}
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
              }}
            >
              Seller: {car.owner?.name || 'Verified Owner'} • 📍{' '}
              {car.location}
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div
            className="alert alert-warning"
            style={{
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            <span>
              Please <strong>Sign In</strong> to send an inquiry
              directly to the seller.
            </span>

            <button
              type="button"
              className="btn btn-primary"
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.6rem',
                marginLeft: 'auto',
              }}
              onClick={onRequireAuth}
            >
              Sign In
            </button>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger"
            style={{
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Message */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
                color: '#334155',
              }}
            >
              Your Inquiry Message *
            </label>

            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about vehicle condition, service history, test drive availability..."
            />
          </div>

          {/* Offer + Contact */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '0.3rem',
                  color: '#334155',
                }}
              >
                Offer Price (₹ Optional)
              </label>

              <input
                type="number"
                min="0"
                placeholder={`e.g. ${car.price}`}
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '0.3rem',
                  color: '#334155',
                }}
              >
                Your Contact Number
              </label>

              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '0.5rem',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !isAuthenticated}
            >
              {loading
                ? 'Sending...'
                : '🚀 Submit Inquiry to Seller'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React from 'react';

export default function CarCard({ car, onSelect, isFavorite, onToggleFavorite }) {
  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const imageSrc =
    car.images && car.images.length > 0
      ? car.images[0]
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="car-card">
      <div className="car-card-img-wrapper" onClick={() => onSelect(car._id)} style={{ cursor: 'pointer' }}>
        <img src={imageSrc} alt={car.title} className="car-card-img" />
        {onToggleFavorite && (
          <button
            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(car._id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            ♥
          </button>
        )}
      </div>

      <div className="car-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>
            {car.brand?.name || 'Verified'}
          </span>
          <span className="badge badge-approved" style={{ fontSize: '0.65rem' }}>
            {car.condition || 'Used'}
          </span>
        </div>

        <h3 className="car-card-title" onClick={() => onSelect(car._id)} style={{ cursor: 'pointer' }} title={car.title}>
          {car.title}
        </h3>

        <div className="car-card-price">{formatPrice(car.price)}</div>

        <div className="car-specs">
          <span className="car-spec-item">{car.year}</span>
          <span className="car-spec-item">{car.fuelType}</span>
          <span className="car-spec-item">{car.transmission}</span>
          <span className="car-spec-item">{car.kilometers?.toLocaleString()} km</span>
        </div>

        <div className="car-card-footer">
          <span>📍 {car.location}</span>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => onSelect(car._id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

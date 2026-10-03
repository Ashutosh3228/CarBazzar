import React from 'react';

export default function EmptyState({ title = 'No Listings Found', message = 'Try adjusting your search criteria or filters.', actionText, onAction }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '2rem 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>{title}</h3>
      <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 1.5rem' }}>{message}</p>
      {actionText && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

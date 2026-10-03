import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              CarBazzar
            </div>
            <div>Buy. Sell. Drive. India's trusted verified car marketplace.</div>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Verified Inspections</span>
            <span>Secure Inquiries</span>
            <span>Transparent Pricing</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          &copy; {new Date().getFullYear()} CarBazzar Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

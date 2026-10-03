import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { login, register, loginAs } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('customer');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          if (onSuccess) onSuccess('Welcome back!');
          onClose();
        }
      } else {
        const res = await register({ name, email, mobile, password, role });
        if (res.success) {
          if (onSuccess) onSuccess('Account created successfully!');
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      await loginAs(demoRole);
      if (onSuccess) onSuccess(`Signed in as Demo ${demoRole.toUpperCase()}`);
      onClose();
    } catch (err) {
      setError(`Failed to sign in as demo ${demoRole}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: mode === 'login' ? '#2563eb' : '#94a3b8',
                borderBottom: mode === 'login' ? '3px solid #2563eb' : '3px solid transparent',
                paddingBottom: '0.4rem',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: mode === 'register' ? '#2563eb' : '#94a3b8',
                borderBottom: mode === 'register' ? '3px solid #2563eb' : '3px solid transparent',
                paddingBottom: '0.4rem',
              }}
            >
              Create Account
            </button>
          </div>
          <button
            onClick={onClose}
            style={{ fontSize: '1.5rem', lineHeight: '1', color: '#94a3b8', padding: '0.25rem' }}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Demo Fast Login Pills */}
        <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ⚡ 1-Click Demo Accounts (Instant Testing)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              onClick={() => handleDemoLogin('seller')}
              disabled={loading}
            >
              👨‍💼 Rajesh (Seller)
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              onClick={() => handleDemoLogin('buyer')}
              disabled={loading}
            >
              🚗 Priya (Buyer)
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderColor: '#cbd5e1' }}
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ padding: '0.65rem 1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#334155' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#334155' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#334155' }}>
                  Account Type
                </label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="customer">Buyer / Individual Seller</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#334155' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. user@carbazaar.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#334155' }}>
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: '700' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to CarBazzar' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

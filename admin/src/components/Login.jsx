import React, { useState } from 'react';
import { loginAdmin } from '../services/api';
import { Loader2 } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);

      // Store user info
      const user = data.admin;
      localStorage.setItem('user', JSON.stringify(user));

      onLogin(user);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-glass)' }}>
        <img 
          src="/logo.png" 
          alt="CivicLens AI Logo" 
          style={{ 
            width: '72px', 
            height: '72px', 
            objectFit: 'contain', 
            backgroundColor: '#f8fafc',
            padding: '6px',
            borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            marginBottom: '1.5rem'
          }} 
        />
        <h2 style={{ marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Welcome Back</h2>
        <p className="text-muted" style={{ marginBottom: '2rem', textAlign: 'center' }}>Sign in to the CivicLens Portal</p>
        
        {error && (
          <div style={{ 
            width: '100%', 
            padding: '0.75rem 1rem', 
            marginBottom: '1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: 'var(--radius-md)', 
            color: '#ef4444', 
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="text-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@civiclens.com"
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="text-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(role);
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
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="text-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@civiclens.gov"
              required 
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
            />
          </div>

          <div className="form-group">
            <label className="form-label">Access Role</label>
            <select 
              className="select-input" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Administrator</option>
              <option value="subadmin">Sub-Administrator</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

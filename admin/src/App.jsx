import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import './App.css';
import './index.css';

import { logoutAdmin } from './services/api';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Users from './components/Users';
import SubAdmins from './components/SubAdmins';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-login from stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const role = user?.role === 'sub_admin' ? 'subadmin' : (user?.role || 'admin');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard role={role} />;
      case 'reports':
        return <Reports role={role} />;
      case 'users':
        return <Users />;
      case 'sub-admins':
        return <SubAdmins />;
      default:
        return <Dashboard role={role} />;
    }
  };

  const handleLogin = (adminUser) => {
    setUser(adminUser);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logoutAdmin();
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ width: '32px', height: '32px', objectFit: 'contain', backgroundColor: '#f8fafc', padding: '3px', borderRadius: '6px' }} 
          />
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>CivicLens</div>
        </div>
        <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
        role={role}
        onLogout={handleLogout}
      />
      
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'mobile-open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

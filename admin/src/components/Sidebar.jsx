import React from 'react';
import { LayoutDashboard, FileText, Users, MapPin, ShieldAlert, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, role, onLogout }) => {
  return (
    <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="logo mb-6" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src="/logo.png" 
          alt="CivicLens AI Logo" 
          style={{ 
            width: '42px', 
            height: '42px', 
            objectFit: 'contain', 
            backgroundColor: '#f8fafc',
            padding: '4px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>CivicLens</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            {role === 'admin' ? 'Admin Portal' : 'Sub-Admin Portal'}
          </span>
        </div>
      </div>
      
      <nav className="nav-menu">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); setIsOpen(false); }}
        >
          <LayoutDashboard /> Dashboard
        </button>
        <button 
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => { setActiveTab('reports'); setIsOpen(false); }}
        >
          <FileText /> Reports
        </button>
        
        {role === 'admin' && (
          <>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => { setActiveTab('users'); setIsOpen(false); }}
            >
              <Users /> Users
            </button>
            <button 
              className={`nav-item ${activeTab === 'sub-admins' ? 'active' : ''}`}
              onClick={() => { setActiveTab('sub-admins'); setIsOpen(false); }}
            >
              <ShieldAlert /> Sub-Admins
            </button>
          </>
        )}
      </nav>

      {/* Logout Button */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', fontSize: '0.875rem', justifyContent: 'center', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
          onClick={() => {
            onLogout();
            setIsOpen(false);
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

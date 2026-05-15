import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import './App.css'; // This is empty but we import it just in case
import './index.css';

import { mockReports, mockUsers, mockWorkers, mockSubAdmins } from './data/mockData';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Users from './components/Users';
import SubAdmins from './components/SubAdmins';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('admin'); // 'admin' or 'subadmin'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reports, setReports] = useState(mockReports);
  const [users] = useState(mockUsers);
  const [workers] = useState(mockWorkers);
  const [subAdmins] = useState(mockSubAdmins);

  const handleUpdateReport = (reportId, updates) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId ? { ...report, ...updates } : report
      )
    );
  };

    const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard reports={reports} role={role} />;
      case 'reports':
        return <Reports reports={reports} workers={workers} onUpdateReport={handleUpdateReport} role={role} />;
      case 'users':
        return <Users users={users} />;
      case 'sub-admins':
        return <SubAdmins subAdmins={subAdmins} />;
      default:
        return <Dashboard reports={reports} role={role} />;
    }
  };

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
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

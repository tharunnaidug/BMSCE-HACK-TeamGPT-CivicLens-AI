import React, { useState, useEffect } from 'react';
import { Inbox, ArrowUpRight, CheckCircle2, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { getDashboardStats, getComplaints, getSubAdminComplaints } from '../services/api';

const Dashboard = ({ role }) => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        if (role === 'admin') {
          // ====== ADMIN: fetch stats + all complaints ======
          const [statsRes, complaintsRes] = await Promise.all([
            getDashboardStats(),
            getComplaints({ limit: 5 }),
          ]);
          setStats(statsRes.stats);
          setRecentComplaints(complaintsRes.complaints || []);
        } else {
          // ====== SUBADMIN: only fetch active complaints assigned to them ======
          const complaintsRes = await getSubAdminComplaints({ limit: 5 });
          const items = complaintsRes.complaints || [];
          setRecentComplaints(items);

          // Build mini stats from the returned complaints
          setStats({
            total: items.length,
            pending: items.filter(c => c.status === 'pending').length,
            in_progress: items.filter(c => c.status === 'in_progress').length,
            resolved: items.filter(c => c.status === 'resolved').length,
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'verified': return 'badge-progress';
      case 'in_progress': return 'badge-progress';
      case 'resolved': return 'badge-completed';
      case 'rejected': return 'badge-pending';
      default: return 'badge-pending';
    }
  };

  const formatStatus = (status) => {
    if (!status) return '—';
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '0.75rem', color: 'var(--text-muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <p>{error}</p>
        <button className="btn btn-outline" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4" style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
        {role === 'admin' ? 'Admin Dashboard' : 'My Assigned Work'}
      </h2>
      <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '2.5rem' }}>
        {role === 'admin'
          ? 'Triage incoming reports, assign field workers, and close the loop with proof.'
          : 'View and manage the complaints assigned to your region.'}
      </p>

      {/* ====== ADMIN STATS ====== */}
      {role === 'admin' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon gray"><Inbox /></div>
              <span className="stat-card-title">Total</span>
            </div>
            <div className="stat-value tabular-nums">{stats.total_complaints}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red"><ArrowUpRight /></div>
              <span className="stat-card-title">Pending</span>
            </div>
            <div className="stat-value tabular-nums">{stats.pending_complaints}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green"><CheckCircle2 /></div>
              <span className="stat-card-title">Resolved</span>
            </div>
            <div className="stat-value tabular-nums">{stats.resolved_complaints}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon purple"><AlertTriangle /></div>
              <span className="stat-card-title">Critical</span>
            </div>
            <div className="stat-value tabular-nums">{stats.critical_complaints}</div>
          </div>
        </div>
      )}

      {/* ====== SUBADMIN STATS (derived from their assigned complaints) ====== */}
      {role === 'subadmin' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon gray"><Inbox /></div>
              <span className="stat-card-title">Assigned</span>
            </div>
            <div className="stat-value tabular-nums">{stats.total}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red"><ArrowUpRight /></div>
              <span className="stat-card-title">Pending</span>
            </div>
            <div className="stat-value tabular-nums">{stats.pending}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon purple"><Clock /></div>
              <span className="stat-card-title">In Progress</span>
            </div>
            <div className="stat-value tabular-nums">{stats.in_progress}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green"><CheckCircle2 /></div>
              <span className="stat-card-title">Resolved</span>
            </div>
            <div className="stat-value tabular-nums">{stats.resolved}</div>
          </div>
        </div>
      )}

      {/* ====== RECENT ACTIVITY TABLE ====== */}
      <div className="card">
        <div className="card-header">
          <h3>{role === 'subadmin' ? 'My Assigned Complaints' : 'Recent Activity'}</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    {role === 'subadmin' ? 'No complaints assigned to your region' : 'No complaints found'}
                  </td>
                </tr>
              ) : (
                recentComplaints.map(complaint => (
                  <tr key={complaint.id}>
                    <td className="text-muted font-mono">#{complaint.id}</td>
                    <td style={{ fontWeight: 500 }}>{complaint.title || 'Untitled'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
                        {formatStatus(complaint.status)}
                      </span>
                    </td>
                    <td className="text-muted">{formatDate(complaint.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

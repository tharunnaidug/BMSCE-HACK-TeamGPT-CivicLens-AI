import React from 'react';
import { Inbox, ArrowUpRight, UserCheck, CheckCircle2 } from 'lucide-react';

const Dashboard = ({ reports, role }) => {
  const total = reports.length;
  const open = reports.filter(r => r.status === 'Pending').length;
  const assigned = reports.filter(r => r.assignedWorkerId !== null).length;
  const resolved = reports.filter(r => r.status === 'Completed').length;

  return (
    <div>
      <h2 className="mb-4" style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>Dashboard</h2>
      <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '2.5rem' }}>
        Triage incoming reports, assign field workers, and close the loop with proof.
      </p>
      
      {role === 'admin' && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon gray"><Inbox /></div>
              <span className="stat-card-title">Total</span>
            </div>
            <div className="stat-value tabular-nums">{total}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon red"><ArrowUpRight /></div>
              <span className="stat-card-title">Open</span>
            </div>
            <div className="stat-value tabular-nums">{open}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon purple"><UserCheck /></div>
              <span className="stat-card-title">Assigned</span>
            </div>
            <div className="stat-value tabular-nums">{assigned}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green"><CheckCircle2 /></div>
              <span className="stat-card-title">Resolved</span>
            </div>
            <div className="stat-value tabular-nums">{resolved}</div>
          </div>
        </div>
      )}
      
      <div className="card">
        <div className="card-header">
          <h3>Recent Activity</h3>
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
              {reports.slice(0, 5).map(report => (
                <tr key={report.id}>
                  <td className="text-muted font-mono">{report.id}</td>
                  <td style={{ fontWeight: 500 }}>{report.title}</td>
                  <td>
                    <span className={`badge badge-${report.status.toLowerCase().replace(' ', '')}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="text-muted">{report.dateReported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

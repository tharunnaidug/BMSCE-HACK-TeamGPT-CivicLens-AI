import React, { useState } from 'react';
import { Shield, Plus, MapPin, Mail, MoreVertical } from 'lucide-react';

const SubAdmins = ({ subAdmins }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Sub-Administrators</h2>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Sub-Admin
        </button>
      </div>
      
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Assigned Region</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.map(admin => (
                <tr key={admin.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{admin.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      ID: <span className="font-mono">{admin.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      <Mail size={12} /> {admin.email}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-muted">
                      <MapPin size={16} className="logo-icon" style={{ width: '16px', height: '16px' }} />
                      {admin.region}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${admin.status === 'Active' ? 'badge-completed' : 'badge-pending'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '0.25rem' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubAdmins;

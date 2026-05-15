import React from 'react';
import { Mail, Calendar } from 'lucide-react';

const Users = ({ users }) => {
  return (
    <div>
      <h2 className="mb-4">Registered Users</h2>
      
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Joined Date</th>
                <th>Total Reports</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>ID: <span className="font-mono">{user.id}</span></div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-muted">
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-muted">
                      <Calendar size={14} />
                      {user.joinedDate}
                    </div>
                  </td>
                  <td>
                    <div className="badge badge-progress tabular-nums" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: 'none' }}>
                      {user.totalReports} reports
                    </div>
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

export default Users;

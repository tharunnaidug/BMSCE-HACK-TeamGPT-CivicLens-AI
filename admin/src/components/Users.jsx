import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Loader2, Award, Star } from 'lucide-react';
import { getAllUsers } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getAllUsers();
        // Filter to show only regular users
        const regularUsers = (data.users || []).filter(u => u.role === 'user');
        setUsers(regularUsers);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '0.75rem', color: 'var(--text-muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading users...</span>
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
      <h2 className="mb-4">Registered Users</h2>
      
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Joined Date</th>
                <th>Points</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {user.photo_url ? (
                          <img src={user.photo_url} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>ID: <span className="font-mono">{user.id}</span></div>
                        </div>
                      </div>
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
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Award size={14} style={{ color: 'var(--accent-primary)' }} />
                        <span className="tabular-nums" style={{ fontWeight: 500 }}>{user.points || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-progress tabular-nums" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: 'none' }}>
                        <Star size={12} /> Lv. {user.level || 1}
                      </div>
                    </td>
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

export default Users;

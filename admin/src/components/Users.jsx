
import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';

import {
  Mail,
  Calendar,
  Loader2,
  Award,
  Star,
  Search,
} from 'lucide-react';

import { getAllUsers } from '../services/api';

const Users = () => {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [levelFilter, setLevelFilter] =
    useState('all');

  const [sortBy, setSortBy] =
    useState('points');


  // ================= FETCH USERS =================

  useEffect(() => {

    const fetchUsers = async () => {

      setLoading(true);

      setError('');

      try {

        const data =
          await getAllUsers();

        const regularUsers =
          (data.users || []).filter(
            (u) => u.role === 'user'
          );

        setUsers(regularUsers);

      } catch (err) {

        setError(
          err.message ||
          'Failed to load users'
        );

      } finally {

        setLoading(false);
      }
    };

    fetchUsers();

  }, []);


  // ================= FILTER + SEARCH + SORT =================

  const filteredUsers = useMemo(() => {

    let filtered = [...users];

    // SEARCH

    if (searchTerm.trim()) {

      filtered = filtered.filter(
        (user) =>
          user.name
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          user.email
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );
    }

    // FILTER

    if (levelFilter !== 'all') {

      filtered = filtered.filter(
        (user) =>
          user.level === levelFilter
      );
    }

    // SORT

    if (sortBy === 'points') {

      filtered.sort(
        (a, b) =>
          (b.points || 0) -
          (a.points || 0)
      );

    } else if (
      sortBy === 'latest'
    ) {

      filtered.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );
    }

    return filtered;

  }, [
    users,
    searchTerm,
    levelFilter,
    sortBy,
  ]);


  // ================= FORMAT DATE =================

  const formatDate = (dateStr) => {

    if (!dateStr) return '—';

    return new Date(dateStr)
      .toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      );
  };


  // ================= LOADING =================

  if (loading) {

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          gap: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <Loader2
          size={24}
          style={{
            animation:
              'spin 1s linear infinite',
          }}
        />

        <span>
          Loading users...
        </span>
      </div>
    );
  }


  // ================= ERROR =================

  if (error) {

    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#ef4444',
        }}
      >
        <p>{error}</p>

        <button
          className="btn btn-outline"
          onClick={() =>
            window.location.reload()
          }
          style={{
            marginTop: '1rem',
          }}
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div>

      <h2 className="mb-4">
        Registered Users
      </h2>


      <div
        className="card mb-4"
        style={{
          padding: '1rem',
        }}
      >

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >

          {/* SEARCH */}

          <div
            style={{
              position: 'relative',
              flex: 1,
              minWidth: '240px',
            }}
          >

            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              style={{
                width: '100%',
                padding:
                  '0.8rem 1rem 0.8rem 2.7rem',
                borderRadius: '12px',
                border:
                  '1px solid var(--border-color)',
                background:
                  'var(--bg-secondary)',
                color:
                  'var(--text-primary)',
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            />
          </div>


          {/* LEVEL FILTER */}

          <select
            value={levelFilter}
            onChange={(e) =>
              setLevelFilter(
                e.target.value
              )
            }
            style={{
              padding:
                '0.8rem 1rem',
              borderRadius: '12px',
              border:
                '1px solid var(--border-color)',
              background:
                'var(--bg-secondary)',
              color:
                'var(--text-primary)',
              outline: 'none',
              minWidth: '180px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >

            <option value="all">
              All Levels
            </option>

            <option value="Beginner">
              Beginner
            </option>

            <option value="Civic Reporter">
              Civic Reporter
            </option>

            <option value="Civic Guardian">
              Civic Guardian
            </option>

            <option value="Civic Hero">
              Civic Hero
            </option>

          </select>


          {/* SORT */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            style={{
              padding:
                '0.8rem 1rem',
              borderRadius: '12px',
              border:
                '1px solid var(--border-color)',
              background:
                'var(--bg-secondary)',
              color:
                'var(--text-primary)',
              outline: 'none',
              minWidth: '180px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >

            <option value="points">
              Sort by Points
            </option>

            <option value="latest">
              Latest Users
            </option>

          </select>

        </div>

      </div>



      {/* ================= TABLE ================= */}

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

              {filteredUsers.length === 0 ? (

                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: 'center',
                      color:
                        'var(--text-muted)',
                      padding: '2rem',
                    }}
                  >
                    No users found
                  </td>
                </tr>

              ) : (

                filteredUsers.map(
                  (user) => (

                    <tr key={user.id}>

                      {/* USER */}

                      <td>

                        <div
                          style={{
                            display: 'flex',
                            alignItems:
                              'center',
                            gap: '0.75rem',
                          }}
                        >

                          {user.photo_url ? (

                            <img
                              src={
                                user.photo_url
                              }
                              alt={user.name}
                              style={{
                                width: '38px',
                                height:
                                  '38px',
                                borderRadius:
                                  '50%',
                                objectFit:
                                  'cover',
                              }}
                            />

                          ) : (

                            <div
                              style={{
                                width: '38px',
                                height:
                                  '38px',
                                borderRadius:
                                  '50%',
                                backgroundColor:
                                  'var(--accent-primary)',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                color:
                                  'white',
                                fontWeight:
                                  600,
                              }}
                            >
                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() || '?'}
                            </div>
                          )}

                          <div>

                            <div
                              style={{
                                fontWeight:
                                  500,
                                color:
                                  'var(--text-primary)',
                              }}
                            >
                              {user.name}
                            </div>

                            <div
                              className="text-muted"
                              style={{
                                fontSize:
                                  '0.75rem',
                              }}
                            >
                              ID:
                              <span className="font-mono">
                                {' '}
                                {user.id}
                              </span>
                            </div>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>

                        <div className="flex items-center gap-2 text-muted">

                          <Mail size={14} />

                          {user.email}

                        </div>

                      </td>


                      {/* JOIN DATE */}

                      <td>

                        <div className="flex items-center gap-2 text-muted">

                          <Calendar
                            size={14}
                          />

                          {formatDate(
                            user.created_at
                          )}

                        </div>

                      </td>


                      {/* POINTS */}

                      <td>

                        <div className="flex items-center gap-2">

                          <Award
                            size={14}
                            style={{
                              color:
                                'var(--accent-primary)',
                            }}
                          />

                          <span
                            className="tabular-nums"
                            style={{
                              fontWeight:
                                500,
                            }}
                          >
                            {user.points || 0}
                          </span>

                        </div>

                      </td>


                      {/* LEVEL */}

                      <td>

                        <div
                          className="badge badge-progress"
                          style={{
                            backgroundColor:
                              'rgba(59, 130, 246, 0.1)',
                            border: 'none',
                          }}
                        >

                          <Star size={12} />

                          {user.level ||
                            'Beginner'}

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Users;
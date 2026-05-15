
import React, {
  useState,
  useEffect,
} from 'react';

import {
  Plus,
  MapPin,
  Mail,
  Loader2,
  X,
  Edit,
} from 'lucide-react';

import {
  getAllUsers,
  createSubAdmin,
  updateSubAdmin,
} from '../services/api';


const SubAdmins = () => {

  const [subAdmins, setSubAdmins] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [showCreateModal,
    setShowCreateModal] =
      useState(false);

  const [showEditModal,
    setShowEditModal] =
      useState(false);

  const [creating, setCreating] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [createError,
    setCreateError] =
      useState('');

  const [editError,
    setEditError] =
      useState('');

  const [selectedAdmin,
    setSelectedAdmin] =
      useState(null);


  // ================= CREATE FORM =================

  const [formName, setFormName] =
    useState('');

  const [formEmail, setFormEmail] =
    useState('');

  const [formPassword,
    setFormPassword] =
      useState('');

  const [formRegion,
    setFormRegion] =
      useState('');


  // ================= EDIT FORM =================

  const [editName, setEditName] =
    useState('');

  const [editRegion,
    setEditRegion] =
      useState('');

  const [editPhotoUrl,
    setEditPhotoUrl] =
      useState('');


  // ================= FETCH =================

  const fetchSubAdmins =
    async () => {

      setLoading(true);

      setError('');

      try {

        const data =
          await getAllUsers();

        const filtered =
          (data.users || []).filter(
            (u) =>
              u.role === 'sub_admin'
          );

        setSubAdmins(filtered);

      } catch (err) {

        setError(
          err.message ||
          'Failed to load sub-admins'
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {
    fetchSubAdmins();
  }, []);


  // ================= CREATE =================

  const handleCreate =
    async (e) => {

      e.preventDefault();

      setCreating(true);

      setCreateError('');

      try {

        await createSubAdmin({
          name: formName,
          email: formEmail,
          password: formPassword,
          region: formRegion,
          photo_url: '',
        });

        setShowCreateModal(false);

        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormRegion('');

        fetchSubAdmins();

      } catch (err) {

        setCreateError(
          err.message ||
          'Failed to create sub-admin'
        );

      } finally {

        setCreating(false);
      }
    };


  // ================= OPEN EDIT =================

  const openEditModal =
    (admin) => {

      setSelectedAdmin(admin);

      setEditName(admin.name || '');

      setEditRegion(
        admin.region || ''
      );

      setEditPhotoUrl(
        admin.photo_url || ''
      );

      setShowEditModal(true);
    };


  // ================= UPDATE =================

  const handleUpdate =
    async (e) => {

      e.preventDefault();

      setUpdating(true);

      setEditError('');

      try {

        await updateSubAdmin({
          sub_admin_id:
            selectedAdmin.id,

          name: editName,

          region: editRegion,

          photo_url:
            editPhotoUrl,
        });

        setShowEditModal(false);

        fetchSubAdmins();

      } catch (err) {

        setEditError(
          err.message ||
          'Failed to update sub-admin'
        );

      } finally {

        setUpdating(false);
      }
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
          color:
            'var(--text-muted)',
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
          Loading sub-admins...
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

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <h2>
          Sub-Administrators
        </h2>

        <button
          className="btn btn-primary"
          onClick={() =>
            setShowCreateModal(true)
          }
        >
          <Plus size={18} />

          Add Sub-Admin
        </button>

      </div>


      {/* TABLE */}

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

              {subAdmins.length === 0 ? (

                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: 'center',
                      color:
                        'var(--text-muted)',
                      padding: '2rem',
                    }}
                  >
                    No sub-admins found
                  </td>
                </tr>

              ) : (

                subAdmins.map(
                  (admin) => (

                    <tr key={admin.id}>

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

                          {admin.photo_url ? (

                            <img
                              src={
                                admin.photo_url
                              }
                              alt={admin.name}
                              style={{
                                width: '36px',
                                height:
                                  '36px',
                                borderRadius:
                                  '50%',
                                objectFit:
                                  'cover',
                              }}
                            />

                          ) : (

                            <div
                              style={{
                                width: '36px',
                                height:
                                  '36px',
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
                                fontSize:
                                  '0.875rem',
                              }}
                            >
                              {admin.name
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
                              {admin.name}
                            </div>

                            <div
                              className="text-muted"
                              style={{
                                fontSize:
                                  '0.75rem',
                                marginTop:
                                  '0.25rem',
                              }}
                            >
                              ID:
                              <span className="font-mono">
                                {' '}
                                {admin.id}
                              </span>
                            </div>

                            <div
                              className="flex items-center gap-2 text-muted"
                              style={{
                                fontSize:
                                  '0.75rem',
                                marginTop:
                                  '0.25rem',
                              }}
                            >
                              <Mail
                                size={12}
                              />

                              {admin.email}

                            </div>

                          </div>

                        </div>

                      </td>


                      {/* REGION */}

                      <td>

                        <div className="flex items-center gap-2 text-muted">

                          <MapPin
                            size={16}
                            className="logo-icon"
                            style={{
                              width: '16px',
                              height:
                                '16px',
                            }}
                          />

                          {admin.region ||
                            '—'}

                        </div>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span className="badge badge-completed">

                          Active

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            openEditModal(
                              admin
                            )
                          }
                          style={{
                            padding:
                              '0.55rem 0.9rem',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap: '0.45rem',
                          }}
                        >

                          <Edit size={14} />

                          Update

                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= CREATE MODAL ================= */}

      {showCreateModal && (

        <div
          className="modal-overlay"
          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              setShowCreateModal(
                false
              );
            }
          }}
        >

          <div
            className="modal-content"
            style={{
              maxWidth: '480px',
            }}
          >

            <div className="modal-header">

              <h3
                style={{
                  margin: 0,
                }}
              >
                Add Sub-Administrator
              </h3>

              <button
                className="modal-close"
                onClick={() =>
                  setShowCreateModal(
                    false
                  )
                }
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={
                handleCreate
              }
            >

              <div className="modal-body">

                {createError && (

                  <div
                    style={{
                      padding:
                        '0.75rem 1rem',
                      marginBottom:
                        '1rem',
                      backgroundColor:
                        'rgba(239, 68, 68, 0.1)',
                      border:
                        '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius:
                        'var(--radius-md)',
                      color:
                        '#ef4444',
                      fontSize:
                        '0.875rem',
                    }}
                  >
                    {createError}
                  </div>
                )}


                <div className="form-group">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="text-input"
                    value={formName}
                    onChange={(e) =>
                      setFormName(
                        e.target.value
                      )
                    }
                    placeholder="John Doe"
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="text-input"
                    value={formEmail}
                    onChange={(e) =>
                      setFormEmail(
                        e.target.value
                      )
                    }
                    placeholder="john@civiclens.com"
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="text-input"
                    value={formPassword}
                    onChange={(e) =>
                      setFormPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Region
                  </label>

                  <input
                    type="text"
                    className="text-input"
                    value={formRegion}
                    onChange={(e) =>
                      setFormRegion(
                        e.target.value
                      )
                    }
                    placeholder="South Zone"
                    required
                  />

                </div>

              </div>


              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    setShowCreateModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: '0.5rem',
                  }}
                >

                  {creating ? (
                    <>
                      <Loader2
                        size={16}
                        style={{
                          animation:
                            'spin 1s linear infinite',
                        }}
                      />

                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus
                        size={16}
                      />

                      Create Sub-Admin
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* ================= EDIT MODAL ================= */}

      {showEditModal && (

        <div
          className="modal-overlay"
          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              setShowEditModal(
                false
              );
            }
          }}
        >

          <div
            className="modal-content"
            style={{
              maxWidth: '480px',
            }}
          >

            <div className="modal-header">

              <h3
                style={{
                  margin: 0,
                }}
              >
                Update Sub-Admin
              </h3>

              <button
                className="modal-close"
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={
                handleUpdate
              }
            >

              <div className="modal-body">

                {editError && (

                  <div
                    style={{
                      padding:
                        '0.75rem 1rem',
                      marginBottom:
                        '1rem',
                      backgroundColor:
                        'rgba(239, 68, 68, 0.1)',
                      border:
                        '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius:
                        'var(--radius-md)',
                      color:
                        '#ef4444',
                      fontSize:
                        '0.875rem',
                    }}
                  >
                    {editError}
                  </div>
                )}


                <div className="form-group">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="text-input"
                    value={editName}
                    onChange={(e) =>
                      setEditName(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Region
                  </label>

                  <input
                    type="text"
                    className="text-input"
                    value={editRegion}
                    onChange={(e) =>
                      setEditRegion(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Photo URL
                  </label>

                  <input
                    type="text"
                    className="text-input"
                    value={editPhotoUrl}
                    onChange={(e) =>
                      setEditPhotoUrl(
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />

                </div>

              </div>


              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating}
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: '0.5rem',
                  }}
                >

                  {updating ? (
                    <>
                      <Loader2
                        size={16}
                        style={{
                          animation:
                            'spin 1s linear infinite',
                        }}
                      />

                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit
                        size={16}
                      />

                      Update
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default SubAdmins;

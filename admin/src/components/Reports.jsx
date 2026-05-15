import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, X, UploadCloud, Check, Loader2, Trash2, ImagePlus, Calendar, User, MapPin } from 'lucide-react';
import { getComplaints, getSubAdminComplaints, updateComplaintStatus, updateSubAdminComplaint, deleteComplaint } from '../services/api';
import uploadImage from '../utils/uploadImage';

const Reports = ({ role }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form state for modal
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [resolvedImageUrl, setResolvedImageUrl] = useState('');

  const fileInputRef = useRef(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 50 };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const data = role === 'subadmin'
        ? await getSubAdminComplaints(params)
        : await getComplaints(params);

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchComplaints(), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const openReportModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setRemarks(report.admin_response || '');
    setResolvedImageUrl(report.resolved_image_url || '');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadImage(file);

    if (result.success) {
      setResolvedImageUrl(result.url);
      if (newStatus !== 'resolved') setNewStatus('resolved');
    } else {
      alert(result.message || 'Image upload failed. Please try again.');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveChanges = async () => {
    if (!selectedReport) return;
    setSaving(true);
    try {
      if (role === 'subadmin') {
        await updateSubAdminComplaint(selectedReport.id, newStatus, remarks, resolvedImageUrl);
      } else {
        await updateComplaintStatus(selectedReport.id, newStatus, remarks);
      }
      setSelectedReport(null);
      fetchComplaints();
    } catch (err) {
      alert(err.message || 'Failed to update complaint');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await deleteComplaint(complaintId);
      fetchComplaints();
    } catch (err) {
      alert(err.message || 'Failed to delete complaint');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDateShort = (dateStr) => {
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

  const isResolved = selectedReport?.status === 'resolved';
  const adminStatuses = ['pending', 'verified', 'in_progress', 'resolved', 'rejected'];
  const subAdminStatuses = ['pending', 'in_progress', 'resolved'];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2>Manage Reports</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="select-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="">All Statuses</option>
            {adminStatuses.map(s => (
              <option key={s} value={s}>{formatStatus(s)}</option>
            ))}
          </select>
          <div className="flex items-center" style={{ width: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search reports..."
              className="text-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading complaints...</span>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Issue Details</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  complaints.map(complaint => (
                    <tr key={complaint.id}>
                      <td>
                        {complaint.image_url ? (
                          <img src={complaint.image_url} alt="Issue" className="img-thumb" />
                        ) : (
                          <div className="img-thumb" style={{ backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                            No img
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{complaint.title || 'Untitled'}</div>
                        <div className="text-muted"><span className="font-mono">#{complaint.id}</span> • {formatDateShort(complaint.created_at)}</div>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {complaint.address || `${complaint.latitude || '—'}, ${complaint.longitude || '—'}`}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
                          {formatStatus(complaint.status)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline" onClick={() => openReportModal(complaint)}>
                            <Eye size={16} /> View
                          </button>
                          {role === 'admin' && (
                            <button
                              className="btn btn-outline"
                              style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                              onClick={() => handleDelete(complaint.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== MODAL ===================== */}
      {selectedReport && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedReport(null); }}>
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>
                  Report <span className="font-mono">#{selectedReport.id}</span>
                </h3>
                <span className={`badge ${getStatusBadgeClass(selectedReport.status)}`} style={{ marginTop: '0.25rem', display: 'inline-flex' }}>
                  {formatStatus(selectedReport.status)}
                </span>
              </div>
              <button className="modal-close" onClick={() => setSelectedReport(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">

              {/* ====== ADMIN VIEW: RESOLVED complaint ====== */}
              {role === 'admin' && isResolved ? (
                <>
                  {/* Completion date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 'var(--radius-md)' }}>
                    <Check size={16} style={{ color: '#22c55e' }} />
                    <span style={{ color: '#15803d', fontWeight: 600, fontSize: '0.875rem' }}>
                      Completed on {formatDate(selectedReport.updated_at)}
                    </span>
                  </div>

                  {/* Side-by-side: Issue photo vs Fixed photo */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label className="form-label">📷 Issue Photo (Before)</label>
                      {selectedReport.image_url ? (
                        <img src={selectedReport.image_url} alt="Issue" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                      ) : (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="form-label">✅ Fixed Photo (After)</label>
                      {selectedReport.resolved_image_url ? (
                        <div style={{ position: 'relative' }}>
                          <img src={selectedReport.resolved_image_url} alt="Fixed" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '2px solid #22c55e' }} />
                          <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#22c55e', color: 'white', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Check size={12} /> Verified
                          </div>
                        </div>
                      ) : (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          No completion photo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <p style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                      {selectedReport.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Meta info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {selectedReport.name && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <User size={14} />
                        <span>{selectedReport.name}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Calendar size={14} />
                      <span>Reported: {formatDateShort(selectedReport.created_at)}</span>
                    </div>
                    {selectedReport.admin_response && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <label className="form-label" style={{ marginBottom: '0.25rem' }}>Sub-Admin Remarks</label>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                          "{selectedReport.admin_response}"
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ====== ADMIN VIEW: active complaint OR SUBADMIN VIEW ====== */
                <>
                  {/* Issue Photo */}
                  <div className="form-group">
                    <label className="form-label">Issue Photo</label>
                    {selectedReport.image_url ? (
                      <img src={selectedReport.image_url} alt="Issue" className="image-preview" />
                    ) : (
                      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <p style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      {selectedReport.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Reported by */}
                  {selectedReport.name && (
                    <div className="form-group">
                      <label className="form-label">Reported By</label>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {selectedReport.name} ({selectedReport.email})
                      </p>
                    </div>
                  )}

                  {/* Status update */}
                  <div className="form-group">
                    <label className="form-label">Update Status</label>
                    <select
                      className="select-input"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      {(role === 'subadmin' ? subAdminStatuses : adminStatuses).map(s => (
                        <option key={s} value={s}>{formatStatus(s)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Remarks */}
                  <div className="form-group">
                    <label className="form-label">Remarks / Response</label>
                    <textarea
                      className="text-input"
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add a remark or response..."
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>

                  {/* Completion Photo Upload — SubAdmin only */}
                  {role === 'subadmin' && (
                    <div className="form-group">
                      <label className="form-label">Completion Photo</label>

                      {resolvedImageUrl ? (
                        <div style={{ position: 'relative' }}>
                          <img src={resolvedImageUrl} alt="Completed" className="image-preview" />
                          <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#22c55e', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>
                            <Check size={14} /> Uploaded
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.85rem' }}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                          >
                            <ImagePlus size={16} /> Replace Photo
                          </button>
                        </div>
                      ) : (
                        <div
                          className="upload-zone"
                          onClick={() => !uploading && fileInputRef.current?.click()}
                          style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
                        >
                          {uploading ? (
                            <>
                              <Loader2 size={36} style={{ margin: '0 auto 0.75rem', display: 'block', animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Uploading to ImgBB...</p>
                            </>
                          ) : (
                            <>
                              <UploadCloud size={36} style={{ margin: '0 auto 0.75rem', display: 'block', color: 'var(--text-muted)' }} />
                              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Click to Upload Completion Photo</h4>
                              <p className="text-muted" style={{ fontSize: '0.8rem' }}>PNG, JPG, WEBP supported</p>
                            </>
                          )}
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedReport(null)}>Close</button>
              {/* Hide Save button for admin viewing a resolved complaint */}
              {!(role === 'admin' && isResolved) && (
                <button
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                  disabled={saving || uploading}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

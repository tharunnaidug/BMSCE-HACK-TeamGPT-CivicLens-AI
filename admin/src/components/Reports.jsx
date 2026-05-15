import React, { useState } from 'react';
import { Search, Eye, X, UploadCloud, Check } from 'lucide-react';

const Reports = ({ reports, workers, onUpdateReport, role }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (e) => {
    onUpdateReport(selectedReport.id, { status: e.target.value });
    setSelectedReport({ ...selectedReport, status: e.target.value });
  };

  const handleWorkerChange = (e) => {
    onUpdateReport(selectedReport.id, { assignedWorkerId: e.target.value });
    setSelectedReport({ ...selectedReport, assignedWorkerId: e.target.value });
  };

  const handleSimulateUpload = () => {
    const mockPhotoUrl = 'https://images.unsplash.com/photo-1584483756857-41481d6d4ba4?auto=format&fit=crop&q=80&w=800';
    onUpdateReport(selectedReport.id, { completionPhoto: mockPhotoUrl, status: 'Completed' });
    setSelectedReport({ ...selectedReport, completionPhoto: mockPhotoUrl, status: 'Completed' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Manage Reports</h2>
        <div className="flex items-center" style={{ width: '300px', position: 'relative' }}>
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
              {filteredReports.map(report => (
                <tr key={report.id}>
                  <td>
                    <img src={report.issuePhoto} alt="Issue" className="img-thumb" />
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{report.title}</div>
                    <div className="text-muted"><span className="font-mono">{report.id}</span> • {report.dateReported}</div>
                  </td>
                  <td>{report.location}</td>
                  <td>
                    <span className={`badge badge-${report.status.toLowerCase().replace(' ', '')}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-outline"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedReport(null); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Report Details - <span className="font-mono">{selectedReport.id}</span></h3>
              <button className="modal-close" onClick={() => setSelectedReport(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Issue Photo</label>
                <img src={selectedReport.issuePhoto} alt="Issue" className="image-preview" />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <p style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  {selectedReport.description}
                </p>
              </div>

              {role !== 'admin' && (
                <>
                  <div className="flex gap-4 mb-4">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Assign Worker</label>
                      <select 
                        className="select-input" 
                        value={selectedReport.assignedWorkerId || ''}
                        onChange={handleWorkerChange}
                      >
                        <option value="">Unassigned</option>
                        {workers.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Update Status</label>
                      <select 
                        className="select-input" 
                        value={selectedReport.status}
                        onChange={handleStatusChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Completion Photo</label>
                    {selectedReport.completionPhoto ? (
                      <div style={{ position: 'relative' }}>
                        <img src={selectedReport.completionPhoto} alt="Completed" className="image-preview" />
                        <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--status-completed)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>
                          <Check size={16} /> Verified
                        </div>
                      </div>
                    ) : (
                      <div className="upload-zone" onClick={handleSimulateUpload}>
                        <UploadCloud className="upload-icon flex" style={{ margin: '0 auto 1rem' }} />
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Click to Upload Photo</h4>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Simulates completing the job</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedReport(null)}>Close</button>
              {role !== 'admin' && (
                <button className="btn btn-primary" onClick={() => setSelectedReport(null)}>Save Changes</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

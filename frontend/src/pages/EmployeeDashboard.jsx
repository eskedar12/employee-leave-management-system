import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyRequests, createLeaveRequest } from '../services/leaveService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getMyRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await createLeaveRequest(formData);
      setShowForm(false);
      setFormData({ leaveType: 'annual', startDate: '', endDate: '', reason: '' });
      fetchRequests();
    } catch (err) {
      setError('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-logo">📋 Leave Management</span>
        </div>
        <div className="nav-right">
          <span className="nav-user">👤 {user?.username}</span>
          <Button variant="secondary" size="small" onClick={logout}>
            Logout
          </Button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Leave Requests</h1>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ New Request'}
          </Button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {showForm && (
          <div className="request-form">
            <h3>Submit Leave Request</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Leave Type</label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    required
                  >
                    <option value="annual">Annual</option>
                    <option value="sick">Sick</option>
                    <option value="casual">Casual</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Enter reason for leave..."
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : (
          <div className="requests-table-container">
            {requests.length === 0 ? (
              <div className="empty-state">
                <p>No leave requests found</p>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Submit your first request
                </Button>
              </div>
            ) : (
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const start = new Date(req.startDate);
                    const end = new Date(req.endDate);
                    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                    
                    return (
                      <tr key={req.id}>
                        <td className="capitalize">{req.leaveType}</td>
                        <td>{new Date(req.startDate).toLocaleDateString()}</td>
                        <td>{new Date(req.endDate).toLocaleDateString()}</td>
                        <td>{duration} day{duration > 1 ? 's' : ''}</td>
                        <td><StatusBadge status={req.status} /></td>
                        <td className="reason-cell">{req.reason || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dashboard {
          min-height: 100vh;
          background: #f5f3ff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .navbar {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          padding: 16px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 20px rgba(124, 58, 237, 0.3);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-logo {
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-user {
          color: white;
          font-weight: 600;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 40px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          color: #1f2937;
          font-size: 28px;
          font-weight: 700;
        }

        .request-form {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          margin-bottom: 30px;
          border: 2px solid #ede9fe;
        }

        .request-form h3 {
          color: #1f2937;
          margin-bottom: 20px;
          font-size: 18px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
          background: #fafafa;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .requests-table-container {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          overflow-x: auto;
        }

        .requests-table {
          width: 100%;
          border-collapse: collapse;
        }

        .requests-table thead {
          background: #f5f3ff;
        }

        .requests-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 700;
          color: #4b5563;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .requests-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
          color: #1f2937;
          font-size: 14px;
        }

        .requests-table tr:hover td {
          background: #faf5ff;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .reason-cell {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state p {
          font-size: 16px;
          margin-bottom: 16px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .error-msg {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .dashboard-content {
            padding: 20px;
          }

          .navbar {
            padding: 12px 20px;
            flex-wrap: wrap;
            gap: 10px;
          }

          .nav-right {
            flex-wrap: wrap;
            gap: 8px;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
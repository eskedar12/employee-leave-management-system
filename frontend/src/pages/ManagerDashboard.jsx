import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllRequests, approveRequest, rejectRequest } from '../services/leaveService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getAllRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveRequest(id);
      fetchRequests();
    } catch (err) {
      alert('Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await rejectRequest(id);
      fetchRequests();
    } catch (err) {
      alert('Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const getStats = () => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-logo">📋 Leave Management</span>
          <span className="nav-role-badge">Manager</span>
        </div>
        <div className="nav-right">
          <span className="nav-user">👤 {user?.fullName}</span>
          <Button variant="secondary" size="small" onClick={logout}>
            Logout
          </Button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>All Leave Requests</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card total">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card approved">
            <span className="stat-number">{stats.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat-card rejected">
            <span className="stat-number">{stats.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : (
          <div className="requests-table-container">
            {requests.length === 0 ? (
              <div className="empty-state">
                <p>No leave requests submitted yet</p>
              </div>
            ) : (
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const start = new Date(req.startDate);
                    const end = new Date(req.endDate);
                    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                    const isPending = req.status === 'pending';

                    return (
                      <tr key={req.id}>
                        <td className="employee-cell">
                          <strong>{req.User?.fullName || 'Unknown'}</strong>
                          <span className="username">@{req.User?.username}</span>
                        </td>
                        <td className="capitalize">{req.leaveType}</td>
                        <td>{new Date(req.startDate).toLocaleDateString()}</td>
                        <td>{new Date(req.endDate).toLocaleDateString()}</td>
                        <td>{duration} day{duration > 1 ? 's' : ''}</td>
                        <td><StatusBadge status={req.status} /></td>
                        <td className="reason-cell">{req.reason || '-'}</td>
                        <td>
                          {isPending ? (
                            <div className="action-buttons">
                              <Button
                                variant="success"
                                size="small"
                                onClick={() => handleApprove(req.id)}
                                disabled={actionLoading === req.id}
                              >
                                ✓
                              </Button>
                              <Button
                                variant="danger"
                                size="small"
                                onClick={() => handleReject(req.id)}
                                disabled={actionLoading === req.id}
                              >
                                ✗
                              </Button>
                            </div>
                          ) : (
                            <span className="no-action">—</span>
                          )}
                        </td>
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

        .nav-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-logo {
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .nav-role-badge {
          color: #c4b5fd;
          font-size: 12px;
          background: rgba(255,255,255,0.15);
          padding: 4px 14px;
          border-radius: 20px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
          max-width: 1400px;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px 24px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          border-left: 5px solid;
        }

        .stat-card.total { border-color: #7c3aed; }
        .stat-card.pending { border-color: #f59e0b; }
        .stat-card.approved { border-color: #10b981; }
        .stat-card.rejected { border-color: #ef4444; }

        .stat-number {
          font-size: 32px;
          font-weight: 800;
          color: #1f2937;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
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

        .employee-cell {
          display: flex;
          flex-direction: column;
        }

        .employee-cell strong {
          font-size: 14px;
        }

        .employee-cell .username {
          font-size: 12px;
          color: #6b7280;
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

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .action-buttons .btn {
          padding: 4px 10px;
          font-size: 16px;
          min-width: 32px;
          justify-content: center;
          border-radius: 6px;
        }

        .action-buttons .btn-success {
          background: #10b981;
          color: white;
        }

        .action-buttons .btn-success:hover:not(:disabled) {
          background: #059669;
        }

        .action-buttons .btn-danger {
          background: #ef4444;
          color: white;
        }

        .action-buttons .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .no-action {
          color: #9ca3af;
          font-size: 14px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state p {
          font-size: 16px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
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

export default ManagerDashboard;
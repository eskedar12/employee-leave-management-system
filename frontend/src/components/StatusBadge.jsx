import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: { label: 'Pending', className: 'badge-pending' },
    approved: { label: 'Approved', className: 'badge-approved' },
    rejected: { label: 'Rejected', className: 'badge-rejected' },
  };

  const { label, className } = statusMap[status] || statusMap.pending;

  return <span className={`badge ${className}`}>{label}</span>;
};

export default StatusBadge;
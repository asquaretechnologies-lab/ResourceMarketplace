import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, FileText, Building, Users, DollarSign } from 'lucide-react';

export const AdminPortalPage: React.FC = () => {
  const [commissionRate, setCommissionRate] = useState('10.0');
  const [facilities, setFacilities] = useState([
    {
      id: 'f1',
      name: 'Aluva Railway Station Premium Parking',
      owner: 'Aravind (Owner)',
      type: 'PARKING',
      district: 'Ernakulam',
      status: 'APPROVED',
      landDocument: 'Verified (Land Authorization Letter.pdf)'
    },
    {
      id: 'f2',
      name: 'ABC Sports Arena Kakkanad',
      owner: 'Kochi Sports Group',
      type: 'SPORTS',
      district: 'Ernakulam',
      status: 'APPROVED',
      landDocument: 'Verified (Sports Arena License.pdf)'
    },
    {
      id: 'f3',
      name: 'Thrissur Station Private Bike Parking',
      owner: 'Sunil Kumar',
      type: 'PARKING',
      district: 'Thrissur',
      status: 'PENDING_REVIEW',
      landDocument: 'Uploaded (Land_Tax_Receipt_2026.pdf)'
    }
  ]);

  const handleApprove = (id: string) => {
    setFacilities(facilities.map(f => f.id === id ? { ...f, status: 'APPROVED' } : f));
  };

  const handleReject = (id: string) => {
    setFacilities(facilities.map(f => f.id === id ? { ...f, status: 'REJECTED' } : f));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
          <Shield size={14} />
          <span>Platform Super Admin Control Panel</span>
        </div>
        <h1 className="page-title">System Administration & Facility Approvals</h1>
        <p className="page-subtitle">Verify land ownership proof, approve new sports & parking facilities, and manage commission rates.</p>
      </div>

      {/* Admin KPI Overview */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Total Facilities</span>
            <Building size={16} color="#10b981" />
          </div>
          <div className="kpi-card-value">24</div>
          <div className="kpi-card-footer" style={{ color: '#34d399' }}>22 Approved | 2 Pending Review</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Total Gross Volume</span>
            <DollarSign size={16} color="#10b981" />
          </div>
          <div className="kpi-card-value" style={{ color: '#34d399' }}>₹1,48,200</div>
          <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Platform Revenue (10%): ₹14,820</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Registered Platform Users</span>
            <Users size={16} color="#3b82f6" />
          </div>
          <div className="kpi-card-value">1,842</div>
          <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>1,720 Customers | 122 Owners</div>
        </div>
      </div>

      {/* Facility Verification Table */}
      <div className="admin-table-wrap">
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Facility Registration Approval Queue</h3>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Admin document verification of submitted land authorization proof</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <span>Global Platform Commission:</span>
            <input
              type="text"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              style={{ width: '60px', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '4px 8px', fontSize: '0.8rem', color: '#10b981', fontFamily: 'monospace', fontWeight: 800, textAlign: 'center' }}
            />
            <span>%</span>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Owner Name</th>
              <th>Category</th>
              <th>Land / License Document</th>
              <th>Approval Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((fac) => (
              <tr key={fac.id}>
                <td style={{ fontWeight: 700, color: 'white' }}>{fac.name}</td>
                <td>{fac.owner}</td>
                <td>
                  <span className={`badge-tag ${fac.type === 'PARKING' ? 'parking' : 'sports'}`} style={{ position: 'static' }}>
                    {fac.type}
                  </span>
                </td>
                <td style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                  <FileText size={14} color="#3b82f6" />
                  <span>{fac.landDocument}</span>
                </td>
                <td>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: fac.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : fac.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: fac.status === 'APPROVED' ? '#34d399' : fac.status === 'REJECTED' ? '#f87171' : '#fbbf24',
                    border: `1px solid ${fac.status === 'APPROVED' ? 'var(--border-emerald)' : fac.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-amber)'}`
                  }}>
                    {fac.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {fac.status === 'PENDING_REVIEW' && (
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => handleApprove(fac.id)}
                        style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--border-emerald)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(fac.id)}
                        style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  )}
                  {fac.status === 'APPROVED' && (
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Live on Marketplace</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

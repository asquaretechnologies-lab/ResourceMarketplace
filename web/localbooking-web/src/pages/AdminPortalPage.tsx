import React, { useState, useEffect } from 'react';
import { Facility } from '../types';
import { searchFacilities, USE_MOCKS } from '../services/api';
import { Shield, CheckCircle, XCircle, FileText, Building, Users, DollarSign } from 'lucide-react';

export const AdminPortalPage: React.FC = () => {
  const [commissionRate, setCommissionRate] = useState('10.0');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminFacilities();
  }, []);

  const fetchAdminFacilities = async () => {
    setLoading(true);
    setError(null);
    let data: Facility[];
    try {
      data = await searchFacilities({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load facilities.');
      setFacilities([]);
      setLoading(false);
      return;
    }
    
    // Add default Thrissur pending review demo facility if not present (dev mock mode only)
    const hasThrissur = data.some(f => f.name.includes('Thrissur'));
    if (USE_MOCKS && !hasThrissur) {
      data.push({
        facilityId: 'f-thrissur-pending',
        name: 'Thrissur Station Private Bike Parking',
        description: 'Private bike parking lot near Thrissur Railway Station North Exit.',
        address: 'Station Road, West Fort, Thrissur',
        district: 'Thrissur',
        state: 'Kerala',
        postalCode: '680001',
        latitude: 10.5186,
        longitude: 76.2144,
        landmark: 'Near Thrissur Station North Exit',
        distanceKm: 0.5,
        is24Hours: true,
        openingTime: '00:00',
        closingTime: '23:59',
        facilityType: 'PARKING',
        status: 'PENDING_REVIEW',
        rating: 4.8,
        reviewCount: 0,
        photos: [],
        features: ['Security Guard', '24 Hours'],
        parkingAreas: [],
        resources: []
      });
    }

    setFacilities(data);
    setLoading(false);
  };

  const handleApprove = (facilityId: string) => {
    setFacilities(facilities.map(f => f.facilityId === facilityId ? { ...f, status: 'APPROVED' } : f));
  };

  const handleReject = (facilityId: string) => {
    setFacilities(facilities.map(f => f.facilityId === facilityId ? { ...f, status: 'REJECTED' } : f));
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
          <div className="kpi-card-value">{facilities.length}</div>
          <div className="kpi-card-footer" style={{ color: '#34d399' }}>
            {facilities.filter(f => f.status === 'APPROVED').length} Approved | {facilities.filter(f => f.status === 'PENDING_REVIEW').length} Pending Review
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Total Gross Volume</span>
            <DollarSign size={16} color="#10b981" />
          </div>
          <div className="kpi-card-value" style={{ color: '#34d399' }}>₹1,48,200</div>
          <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Platform Commission (10%): ₹14,820</div>
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

        {error && (
          <div role="alert" style={{ padding: '14px 18px', marginBottom: '20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <span>{error}</span>
            <button id="retry-admin-facilities" className="btn-secondary" onClick={fetchAdminFacilities}>Retry</button>
          </div>
        )}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading facilities for review...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>District / Location</th>
                <th>Category</th>
                <th>Land / License Document</th>
                <th>Approval Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((fac) => {
                const docName = fac.status === 'APPROVED' 
                  ? 'Verified (Land_Authorization_Proof.pdf)'
                  : 'Uploaded (Land_Tax_Receipt_2026.pdf)';

                return (
                  <tr key={fac.facilityId}>
                    <td style={{ fontWeight: 700, color: 'white' }}>{fac.name}</td>
                    <td style={{ color: '#cbd5e1' }}>{fac.district} ({fac.landmark || 'Kerala'})</td>
                    <td>
                      <span 
                        className={`badge-tag ${fac.facilityType === 'PARKING' ? 'parking' : fac.facilityType === 'RENTAL' ? 'rental' : 'sports'}`} 
                        style={{ 
                          position: 'static',
                          ...(fac.facilityType === 'RENTAL' ? { background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8' } : {})
                        }}
                      >
                        {fac.facilityType}
                      </span>
                    </td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <FileText size={14} color="#3b82f6" />
                      <span>{docName}</span>
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
                            onClick={() => handleApprove(fac.facilityId)}
                            style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--border-emerald)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(fac.facilityId)}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { processCheckIn } from '../services/api';
import { CheckInResult } from '../types';
import { LayoutDashboard, Car, Bike, QrCode, CheckCircle, AlertCircle, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const [qrInput, setQrInput] = useState('QR-PARK-20260811-000125-TOKEN-SECURE');
  const [scanResult, setScanResult] = useState<CheckInResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    setIsProcessing(true);
    const res = await processCheckIn(qrInput.trim());
    setScanResult(res);
    setIsProcessing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--border-amber)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
          <LayoutDashboard size={14} />
          <span>Aluva Railway Station Parking Owner Portal</span>
        </div>
        <h1 className="page-title">Facility Owner Portal</h1>
        <p className="page-subtitle">Real-time capacity occupancy gauges, entrance QR ticket scanning, and daily revenue analytics.</p>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Today's Revenue</span>
            <TrendingUp size={16} color="#10b981" />
          </div>
          <div className="kpi-card-value" style={{ color: '#34d399' }}>₹4,850</div>
          <div className="kpi-card-footer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={12} /> +14% from yesterday
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Active Occupancy</span>
            <Car size={16} color="#f59e0b" />
          </div>
          <div className="kpi-card-value" style={{ color: '#fbbf24' }}>83 / 130</div>
          <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Cars: 18/30 | Bikes: 65/100</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Checked-in Vehicles</span>
            <Users size={16} color="#3b82f6" />
          </div>
          <div className="kpi-card-value">42</div>
          <div className="kpi-card-footer" style={{ color: '#3b82f6' }}>0 Overtime violations</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Net Payable Payout</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>10% Fee</span>
          </div>
          <div className="kpi-card-value">₹4,365</div>
          <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Payout date: Friday</div>
        </div>
      </div>

      {/* Main Grid: Occupancy Gauge & Entrance QR Scanner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Real-time Occupancy Gauge (Section 54 Spec) */}
        <div className="occupancy-gauge-card">
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={18} color="#f59e0b" />
              Real-Time Parking Occupancy
            </h3>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '2px' }}>PostgreSQL row locking protected against double-bookings</p>
          </div>

          {/* Car Progress Bar Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ color: '#f8fafc' }}>Car Parking Area</span>
              <span style={{ color: '#fbbf24', fontFamily: 'monospace', fontWeight: 800 }}>18 / 30 Slots Occupied (60%)</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill-amber" style={{ width: '60%' }} />
            </div>
            <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>12 Available car slots open for online customer reservation</span>
          </div>

          {/* Two-Wheeler Progress Bar Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ color: '#f8fafc' }}>Two Wheeler / Bike Area</span>
              <span style={{ color: '#34d399', fontFamily: 'monospace', fontWeight: 800 }}>65 / 100 Slots Occupied (65%)</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill-emerald" style={{ width: '65%' }} />
            </div>
            <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>35 Available bike slots open</span>
          </div>

          <div style={{ background: '#090d16', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.775rem', color: '#cbd5e1' }}>
            <span style={{ fontWeight: 700, color: 'white', display: 'block', marginBottom: '2px' }}>Operating Settings</span>
            <p>✓ 24/7 Hours Active | Security Guard: On Duty | CCTV: Online</p>
          </div>
        </div>

        {/* Entrance & Exit QR Scanner (Section 53 Spec) */}
        <div className="scanner-card">
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode size={18} color="#10b981" />
              Entrance & Exit QR Scanner
            </h3>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '2px' }}>Scan customer QR ticket or enter booking number to process check-in/out</p>
          </div>

          <form onSubmit={handleScanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Scan QR Code Token / Booking Number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="Scan QR or paste token..."
                  style={{ flex: 1, background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: 'white', fontFamily: 'monospace', outline: 'none' }}
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-book-now sports"
                  style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                >
                  {isProcessing ? 'Verifying...' : 'VERIFY & CHECK-IN'}
                </button>
              </div>
            </div>
          </form>

          {/* Scanner Result Card */}
          {scanResult && (
            <div style={{
              background: scanResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${scanResult.success ? 'var(--border-emerald)' : 'rgba(239, 68, 68, 0.3)'}`,
              padding: '14px',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: scanResult.success ? '#34d399' : '#f87171' }}>
                {scanResult.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{scanResult.message}</span>
              </div>

              {scanResult.booking && (
                <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '4px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Booking No:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'white' }}>{scanResult.booking.bookingNumber}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Vehicle No:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#fbbf24' }}>{scanResult.booking.vehicleNumber}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Status Action:</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{scanResult.action}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-light)', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color="#10b981" />
            <span>Automatic overtime charge calculator active at exit scan.</span>
          </div>

        </div>

      </div>

    </div>
  );
};

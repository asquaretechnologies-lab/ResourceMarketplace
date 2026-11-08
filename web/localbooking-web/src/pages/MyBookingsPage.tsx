import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { getMyBookings } from '../services/api';
import { QrCode, Calendar, Clock, MapPin, Car, Activity, CheckCircle, ShieldCheck } from 'lucide-react';

interface MyBookingsPageProps {
  initialBooking?: Booking | null;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ initialBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      if (initialBooking && !data.some(b => b.bookingId === initialBooking.bookingId)) {
        setBookings([initialBooking, ...data]);
      } else {
        setBookings(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings.');
      setBookings(initialBooking ? [initialBooking] : []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <QrCode size={24} color="#10b981" />
          My Booking Passes & QR Tickets
        </h1>
        <p className="page-subtitle">Present these digital QR passes at entrance scanners for automated check-in</p>
      </div>

      {error && (
        <div role="alert" style={{ padding: '14px 18px', marginBottom: '20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span>{error}</span>
          <button id="retry-my-bookings" className="btn-secondary" onClick={fetchBookings}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Loading your tickets...
        </div>
      ) : bookings.length === 0 ? (
        <div className="hero-card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No active bookings found</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Book railway station parking or sports turfs to generate instant digital QR passes.</p>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => {
            const isParking = booking.bookingType === 'PARKING';
            return (
              <div key={booking.bookingId} className="ticket-card">
                
                {/* Ticket Top Header Banner */}
                <div className="ticket-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge-tag ${isParking ? 'parking' : 'sports'}`} style={{ position: 'static' }}>
                      {isParking ? <Car size={12} /> : <Activity size={12} />}
                      {booking.bookingType}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 700, color: '#f8fafc' }}>
                      {booking.bookingNumber}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--border-emerald)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle size={14} />
                    <span>{booking.bookingStatus}</span>
                  </div>
                </div>

                {/* Ticket Details & White QR Pass Box */}
                <div className="ticket-body">
                  
                  {/* Left Column: Details */}
                  <div className="ticket-info-group">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{booking.facilityName}</h3>
                    
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#10b981" />
                      {booking.facilityAddress}
                    </p>

                    <div style={{ background: '#090d16', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.725rem', display: 'block' }}>Resource / Vehicle:</span>
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>{booking.resourceName}</span>
                        {booking.vehicleNumber && (
                          <span style={{ display: 'block', fontFamily: 'monospace', color: '#fbbf24', fontWeight: 800, marginTop: '2px' }}>
                            {booking.vehicleNumber}
                          </span>
                        )}
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.725rem', display: 'block' }}>Amount Paid:</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                          ₹{booking.totalAmount}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.775rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="#94a3b8" />
                        <span>Start: {new Date(booking.startDateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#94a3b8" />
                        <span>End: {new Date(booking.endDateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Crisp White QR Pass */}
                  <div className="qr-pass-box">
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      ENTRANCE QR PASS
                    </span>
                    
                    <div style={{ width: '120px', height: '120px', background: '#090d16', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode size={96} color="#ffffff" />
                    </div>

                    <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: '#1e293b' }}>
                      {booking.qrCodeToken.slice(0, 16)}...
                    </span>

                    <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} />
                      <span>Valid Digital Ticket</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { Facility, Booking } from '../types';
import { createBooking } from '../services/api';
import { MapPin, Star, Car, Activity, Clock, CheckCircle, ArrowLeft, CreditCard, Tag, AlertCircle } from 'lucide-react';

interface FacilityDetailsPageProps {
  facility: Facility;
  onBack: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export const FacilityDetailsPage: React.FC<FacilityDetailsPageProps> = ({
  facility,
  onBack,
  onBookingConfirmed
}) => {
  const isParking = facility.facilityType === 'PARKING';
  
  const [selectedParkingAreaId, setSelectedParkingAreaId] = useState<string>(
    facility.parkingAreas[0]?.parkingAreaId || ''
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    facility.resources[0]?.resourceId || ''
  );
  const [vehicleNumber, setVehicleNumber] = useState('KL 07 AB 1234');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [durationHours, setDurationHours] = useState(4);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentParkingArea = facility.parkingAreas.find(p => p.parkingAreaId === selectedParkingAreaId) || facility.parkingAreas[0];
  const currentResource = facility.resources.find(r => r.resourceId === selectedResourceId) || facility.resources[0];

  const hourlyRate = isParking 
    ? (currentParkingArea?.pricePerHour || 30)
    : (currentResource?.pricePerHour || 1200);

  const basePrice = hourlyRate * durationHours;
  const platformFee = Math.round(basePrice * 0.1);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPrice = Math.max(0, basePrice + platformFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'FIRSTBOOK') {
      const disc = Math.min(100, Math.round(basePrice * 0.1));
      setAppliedCoupon({ code: 'FIRSTBOOK', discount: disc });
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid coupon code. Try FIRSTBOOK for 10% off.');
    }
  };

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const startDT = new Date(startDate);
      const endDT = new Date(startDT.getTime() + durationHours * 3600000);

      const booking = await createBooking({
        facilityId: facility.facilityId,
        bookingType: facility.facilityType,
        startDateTime: startDT.toISOString(),
        endDateTime: endDT.toISOString(),
        parkingAreaId: isParking ? currentParkingArea?.parkingAreaId : undefined,
        vehicleTypeId: isParking ? currentParkingArea?.vehicleTypeId : undefined,
        resourceId: !isParking ? currentResource?.resourceId : undefined,
        vehicleNumber: isParking ? vehicleNumber : undefined,
        quantity: 1,
        couponCode: appliedCoupon?.code
      });

      onBookingConfirmed(booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Back Header */}
      <button
        onClick={onBack}
        style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Search Results</span>
      </button>

      {/* Main Details Layout */}
      <div className="details-layout">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Photo Banner */}
          <div className="card-image-wrap" style={{ height: '320px', borderRadius: '20px' }}>
            <img
              src={facility.photos[0] || (isParking ? 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80')}
              alt={facility.name}
            />
            <div className="card-overlay" />
            
            <div className={`badge-tag ${isParking ? 'parking' : 'sports'}`}>
              {isParking ? <Car size={12} /> : <Activity size={12} />}
              {isParking ? 'PARKING FACILITY' : 'SPORTS ARENA'}
            </div>

            <div className="rating-badge">
              <Star size={12} fill="#fbbf24" />
              <span>{facility.rating}</span>
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>({facility.reviewCount})</span>
            </div>

            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: '1.2' }}>{facility.name}</h1>
            </div>
          </div>

          {/* Details Panel */}
          <div className="details-panel">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MapPin size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Location & Address</h3>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{facility.address}, {facility.district}, {facility.state} - {facility.postalCode}</p>
                <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>Landmark: {facility.landmark}</p>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-light)' }} />

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>About Facility</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.6' }}>{facility.description}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '10px' }}>Facilities & Amenities</h3>
              <div className="features-wrap">
                {facility.features.map((feat, idx) => (
                  <span key={idx} className="feature-pill" style={{ padding: '6px 12px', fontSize: '0.775rem' }}>
                    <CheckCircle size={12} color="#10b981" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Floating Booking Card */}
        <div>
          <div className="booking-widget-card">
            
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Configure Booking</h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Instant digital QR ticket generation</p>
            </div>

            {/* Selection */}
            {isParking ? (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>Select Vehicle Type</label>
                {facility.parkingAreas.map((pa) => (
                  <button
                    key={pa.parkingAreaId}
                    type="button"
                    onClick={() => setSelectedParkingAreaId(pa.parkingAreaId)}
                    className={`option-selector-btn ${selectedParkingAreaId === pa.parkingAreaId ? 'selected' : ''}`}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'white' }}>{pa.vehicleTypeName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 600 }}>{pa.availableCapacity} slots available</div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fbbf24', fontSize: '0.9rem' }}>
                      ₹{pa.pricePerHour}/hr
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>Select Turf / Court</label>
                {facility.resources.map((r) => (
                  <button
                    key={r.resourceId}
                    type="button"
                    onClick={() => setSelectedResourceId(r.resourceId)}
                    className={`option-selector-btn ${selectedResourceId === r.resourceId ? 'selected' : ''}`}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'white' }}>{r.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{r.description}</div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#10b981', fontSize: '0.9rem' }}>
                      ₹{r.pricePerHour}/hr
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Number */}
            {isParking && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>Vehicle Registration Number</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. KL 07 AB 1234"
                  style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', fontFamily: 'monospace', outline: 'none', letterSpacing: '1px' }}
                />
              </div>
            )}

            {/* Start Date & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.75rem', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>Duration (Hours)</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.75rem', color: 'white', outline: 'none' }}
                >
                  <option value={1}>1 Hour</option>
                  <option value={2}>2 Hours</option>
                  <option value={4}>4 Hours</option>
                  <option value={8}>8 Hours</option>
                  <option value={12}>12 Hours (Half Day)</option>
                  <option value={24}>24 Hours (Full Day)</option>
                </select>
              </div>
            </div>

            {/* Coupon Code */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>Apply Discount Coupon</label>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Try FIRSTBOOK"
                  style={{ flex: 1, background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '8px 12px', fontSize: '0.75rem', color: 'white', textTransform: 'uppercase', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#1e293b', border: '1px solid var(--border-light)', color: 'white', borderRadius: '10px', padding: '8px 14px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                  Apply
                </button>
              </form>
              {appliedCoupon && (
                <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={12} /> Coupon {appliedCoupon.code} applied (₹{appliedCoupon.discount} off)
                </p>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="price-summary-card">
              <div className="price-summary-row">
                <span>Base Rate ({durationHours} hrs x ₹{hourlyRate}):</span>
                <span style={{ fontFamily: 'monospace', color: 'white' }}>₹{basePrice}</span>
              </div>
              <div className="price-summary-row">
                <span>Platform Fee (10%):</span>
                <span style={{ fontFamily: 'monospace', color: 'white' }}>₹{platformFee}</span>
              </div>
              {appliedCoupon && (
                <div className="price-summary-row" style={{ color: '#10b981', fontWeight: 700 }}>
                  <span>Discount:</span>
                  <span style={{ fontFamily: 'monospace' }}>-₹{appliedCoupon.discount}</span>
                </div>
              )}
              <div className="price-summary-row total">
                <span>Total Amount:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>₹{totalPrice}</span>
              </div>
            </div>

            {errorMessage && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '10px', color: '#f87171', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Payment Action Button */}
            <button
              onClick={handleBookingSubmit}
              disabled={isSubmitting}
              className={`btn-book-now ${isParking ? 'parking' : 'sports'}`}
              style={{ width: '100%', padding: '14px', fontSize: '0.85rem', justifyContent: 'center' }}
            >
              <CreditCard size={16} />
              <span>{isSubmitting ? 'Processing Payment...' : `PAY ₹${totalPrice} & GET QR TICKET`}</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
